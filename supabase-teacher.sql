-- Maths Puzzle Arcade — teacher accounts + dashboard data.
-- Run this whole file once in Supabase: SQL Editor → New query → paste → Run.
-- Safe to run again. Requires supabase.sql to have been run first.

alter table pz_players add column if not exists is_teacher boolean not null default false;

-- helper: true only when name+hash are a valid login of a teacher account
create or replace function pz_is_teacher(p_name text, p_hash text) returns boolean
language plpgsql security definer set search_path=public,extensions as $$
declare k text:=pz_auth(p_name,p_hash);
begin
  if k is null then return false; end if;
  return exists(select 1 from pz_players where name_lower=k and is_teacher);
end $$;
revoke execute on function pz_is_teacher(text,text) from anon, authenticated, public;

-- login now also tells the app whether this is a teacher account (includes the earlier wrong-PIN fix)
create or replace function pz_login(p_name text, p_hash text) returns json
language plpgsql security definer set search_path=public,extensions as $$
declare p pz_players; d jsonb;
begin
  select * into p from pz_players where name_lower=lower(btrim(coalesce(p_name,'')));
  if not found then return json_build_object('ok',false,'error','no_user'); end if;
  if p.locked_until is not null and p.locked_until>now() then return json_build_object('ok',false,'error','locked'); end if;
  if extensions.crypt(coalesce(p_hash,''),p.pin_hash)<>p.pin_hash then
    update pz_players set
      locked_until=case when fails+1>=6 then now()+interval '5 minutes' else locked_until end,
      fails=case when fails+1>=6 then 0 else fails+1 end
    where name_lower=p.name_lower;
    return json_build_object('ok',false,'error','bad_pin');
  end if;
  update pz_players set fails=0,locked_until=null,last_seen=now() where name_lower=p.name_lower;
  select data into d from pz_progress where name_lower=p.name_lower;
  return json_build_object('ok',true,'name',p.name,'data',coalesce(d,'{}'::jsonb),'teacher',p.is_teacher);
end $$;

-- Teacher accounts can NOT be registered in the game. The site owner creates them here (SQL Editor), e.g.:
--   select pz_create_teacher('MISS SMITH','1234');   -- name, 4-digit PIN
-- Not callable from the app (no grant to anon / authenticated).
drop function if exists pz_register_teacher(text,text,text);
create or replace function pz_create_teacher(p_name text, p_pin text) returns json
language plpgsql security definer set search_path=public,extensions as $$
declare n text:=upper(btrim(regexp_replace(coalesce(p_name,''),'\s+',' ','g'))); h text;
begin
  if char_length(n)<2 or char_length(n)>16 then return json_build_object('ok',false,'error','bad_name'); end if;
  if coalesce(p_pin,'') !~ '^[0-9]{4}$' then return json_build_object('ok',false,'error','bad_pin'); end if;
  h:=encode(extensions.digest('pz1:'||lower(n)||':'||p_pin,'sha256'),'hex');
  insert into pz_players(name_lower,name,pin_hash,is_teacher) values(lower(n),n,extensions.crypt(h,extensions.gen_salt('bf')),true);
  insert into pz_progress(name_lower,data) values(lower(n),'{"v":2,"done":{},"rv":{}}'::jsonb);
  return json_build_object('ok',true,'name',n);
exception when unique_violation then
  return json_build_object('ok',false,'error','taken');
end $$;
revoke execute on function pz_create_teacher(text,text) from anon, authenticated, public;

-- 1) + 3) numbers for the dashboard (students only; teacher accounts are left out)
--   levels : how many students passed each level of each game
--   pg     : levels passed per student per game
--   time   : total playing seconds per game (and per student)
create or replace function pz_teacher_stats(p_name text, p_hash text) returns json
language plpgsql security definer set search_path=public,extensions as $$
begin
  if not pz_is_teacher(p_name,p_hash) then return json_build_object('ok',false,'error','not_teacher'); end if;
  return json_build_object('ok',true,
    'students',(select count(*) from pz_players where not is_teacher),
    'levels',coalesce((select json_agg(json_build_object('g',g,'l',l,'n',n)) from (
        select gk.key as g, lk.key::int as l, count(*) as n
        from pz_progress pr join pz_players p using(name_lower)
        cross join lateral jsonb_each(case when jsonb_typeof(pr.data->'done')='object' then pr.data->'done' else '{}'::jsonb end) gk
        cross join lateral jsonb_each(case when jsonb_typeof(gk.value)='object' then gk.value else '{}'::jsonb end) lk
        where not p.is_teacher and lk.key ~ '^[0-9]+$'
        group by gk.key, lk.key) x),'[]'::json),
    'pg',coalesce((select json_agg(json_build_object('p',name,'g',g,'n',n)) from (
        select p.name, gk.key as g, (select count(*) from jsonb_object_keys(case when jsonb_typeof(gk.value)='object' then gk.value else '{}'::jsonb end)) as n
        from pz_progress pr join pz_players p using(name_lower)
        cross join lateral jsonb_each(case when jsonb_typeof(pr.data->'done')='object' then pr.data->'done' else '{}'::jsonb end) gk
        where not p.is_teacher) y),'[]'::json),
    'time',coalesce((select json_agg(json_build_object('p',name,'g',game,'secs',s)) from (
        select p.name, e.game, sum(case when e.detail->>'secs' ~ '^[0-9]+(\.[0-9]+)?$' then (e.detail->>'secs')::numeric else 0 end)::bigint as s
        from pz_events e join pz_players p using(name_lower)
        where e.kind='time' and not p.is_teacher
        group by p.name, e.game) z),'[]'::json));
end $$;

-- 2) mistake summary for one level (framework: groups by the error type the game logged)
create or replace function pz_teacher_mistakes(p_name text, p_hash text, p_game text, p_level int) returns json
language plpgsql security definer set search_path=public,extensions as $$
begin
  if not pz_is_teacher(p_name,p_hash) then return json_build_object('ok',false,'error','not_teacher'); end if;
  return json_build_object('ok',true,'rows',coalesce((select json_agg(json_build_object('t',t,'n',n,'students',s) order by n desc) from (
      select coalesce(e.detail->>'type',e.detail->>'err',e.detail->>'stage','other') as t, count(*) as n, count(distinct e.name_lower) as s
      from pz_events e join pz_players p using(name_lower)
      where e.kind='wrong' and e.game=p_game and e.level=p_level and not p.is_teacher
      group by 1) q),'[]'::json));
end $$;

grant execute on function pz_login(text,text),
  pz_teacher_stats(text,text), pz_teacher_mistakes(text,text,text,int) to anon, authenticated;
