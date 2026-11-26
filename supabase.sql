-- Maths Puzzle Arcade — online database for accounts, progress and answer history.
-- Run this whole file once in Supabase: SQL Editor → New query → paste → Run.
-- BEFORE running: change CHANGE_ME_teacher_key (last section) to your own secret teacher key.

create extension if not exists pgcrypto with schema extensions;

create table if not exists pz_players(
  name_lower text primary key,
  name text not null,
  pin_hash text not null,
  created_at timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  fails int not null default 0,
  locked_until timestamptz
);
create table if not exists pz_progress(
  name_lower text primary key references pz_players(name_lower) on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
create table if not exists pz_events(
  id bigserial primary key,
  name_lower text not null references pz_players(name_lower) on delete cascade,
  game text not null,
  level int not null default 0,
  kind text not null,          -- 'wrong', 'complete', ...
  detail jsonb not null default '{}',   -- question, typed answer, expected answer, error types...
  at timestamptz not null default now()
);
create index if not exists pz_events_player on pz_events(name_lower, at desc);
create index if not exists pz_events_kind on pz_events(game, kind);
create table if not exists pz_settings(k text primary key, v text not null);

-- nobody can read or write the tables directly; only the functions below can
alter table pz_players enable row level security;
alter table pz_progress enable row level security;
alter table pz_events enable row level security;
alter table pz_settings enable row level security;
revoke all on pz_players, pz_progress, pz_events, pz_settings from anon, authenticated;
revoke all on sequence pz_events_id_seq from anon, authenticated;

create or replace function pz_auth(p_name text, p_hash text) returns text
language plpgsql security definer set search_path=public,extensions as $$
declare p pz_players;
begin
  select * into p from pz_players where name_lower=lower(btrim(p_name));
  if not found then return null; end if;
  if p.locked_until is not null and p.locked_until>now() then return null; end if;
  if extensions.crypt(p_hash,p.pin_hash)<>p.pin_hash then return null; end if;
  return p.name_lower;
end $$;

create or replace function pz_register(p_name text, p_hash text, p_data jsonb) returns json
language plpgsql security definer set search_path=public,extensions as $$
declare n text:=btrim(regexp_replace(coalesce(p_name,''),'\s+',' ','g'));
begin
  if char_length(n)<2 or char_length(n)>16 then return json_build_object('ok',false,'error','bad_name'); end if;
  if p_hash is null or p_hash !~ '^[0-9a-f]{64}$' then return json_build_object('ok',false,'error','bad_hash'); end if;
  begin
    insert into pz_players(name_lower,name,pin_hash) values(lower(n),n,extensions.crypt(p_hash,extensions.gen_salt('bf')));
  exception when unique_violation then
    return json_build_object('ok',false,'error','taken');
  end;
  insert into pz_progress(name_lower,data) values(lower(n),coalesce(p_data,'{}'::jsonb));
  return json_build_object('ok',true,'name',n);
end $$;

create or replace function pz_login(p_name text, p_hash text) returns json
language plpgsql security definer set search_path=public,extensions as $$
declare p pz_players; d jsonb;
begin
  select * into p from pz_players where name_lower=lower(btrim(coalesce(p_name,'')));
  if not found then return json_build_object('ok',false,'error','no_user'); end if;
  if p.locked_until is not null and p.locked_until>now() then return json_build_object('ok',false,'error','locked'); end if;
  if extensions.crypt(coalesce(p_hash,''),p.pin_hash)<>p.pin_hash then
    update pz_players set fails=fails+1,
      locked_until=case when fails+1>=6 then now()+interval '5 minutes' else null end,
      fails=case when fails+1>=6 then 0 else fails+1 end
    where name_lower=p.name_lower;
    return json_build_object('ok',false,'error','bad_pin');
  end if;
  update pz_players set fails=0,locked_until=null,last_seen=now() where name_lower=p.name_lower;
  select data into d from pz_progress where name_lower=p.name_lower;
  return json_build_object('ok',true,'name',p.name,'data',coalesce(d,'{}'::jsonb));
end $$;

create or replace function pz_save(p_name text, p_hash text, p_data jsonb) returns json
language plpgsql security definer set search_path=public,extensions as $$
declare k text:=pz_auth(p_name,p_hash);
begin
  if k is null then return json_build_object('ok',false,'error','auth'); end if;
  insert into pz_progress(name_lower,data,updated_at) values(k,coalesce(p_data,'{}'::jsonb),now())
    on conflict(name_lower) do update set data=excluded.data,updated_at=now();
  update pz_players set last_seen=now() where name_lower=k;
  return json_build_object('ok',true);
end $$;

create or replace function pz_log(p_name text, p_hash text, p_events jsonb) returns json
language plpgsql security definer set search_path=public,extensions as $$
declare k text:=pz_auth(p_name,p_hash); e jsonb; n int:=0;
begin
  if k is null then return json_build_object('ok',false,'error','auth'); end if;
  if jsonb_typeof(p_events)<>'array' then return json_build_object('ok',false,'error','bad_events'); end if;
  for e in select * from jsonb_array_elements(p_events) limit 500 loop
    insert into pz_events(name_lower,game,level,kind,detail,at)
    values(k,left(coalesce(e->>'g','?'),40),coalesce((e->>'l')::int,0),left(coalesce(e->>'k','?'),40),coalesce(e->'d','{}'::jsonb),
           to_timestamp(coalesce((e->>'at')::bigint,(extract(epoch from now())*1000)::bigint)/1000.0));
    n:=n+1;
  end loop;
  return json_build_object('ok',true,'n',n);
end $$;

create or replace function pz_name_free(p_name text) returns json
language plpgsql security definer set search_path=public,extensions as $$
begin
  return json_build_object('ok',true,'free',not exists(select 1 from pz_players where name_lower=lower(btrim(regexp_replace(coalesce(p_name,''),'\s+',' ','g')))));
end $$;

-- teacher views (need the teacher key)
create or replace function pz_admin(p_key text) returns json
language plpgsql security definer set search_path=public,extensions as $$
begin
  if not exists(select 1 from pz_settings where k='teacher_key' and extensions.crypt(coalesce(p_key,''),v)=v) then
    return json_build_object('ok',false,'error','bad_key'); end if;
  return json_build_object('ok',true,'players',coalesce((
    select json_agg(json_build_object('name',p.name,'created_at',p.created_at,'last_seen',p.last_seen,'data',g.data) order by p.name)
    from pz_players p left join pz_progress g using(name_lower)),'[]'::json));
end $$;

create or replace function pz_admin_events(p_key text, p_name text default null, p_limit int default 1000) returns json
language plpgsql security definer set search_path=public,extensions as $$
begin
  if not exists(select 1 from pz_settings where k='teacher_key' and extensions.crypt(coalesce(p_key,''),v)=v) then
    return json_build_object('ok',false,'error','bad_key'); end if;
  return json_build_object('ok',true,'events',coalesce((
    select json_agg(x) from (
      select e.at,p.name,e.game,e.level,e.kind,e.detail from pz_events e join pz_players p using(name_lower)
      where p_name is null or e.name_lower=lower(p_name) order by e.at desc limit least(p_limit,5000)) x),'[]'::json));
end $$;

grant execute on function pz_register(text,text,jsonb), pz_login(text,text), pz_save(text,text,jsonb), pz_log(text,text,jsonb),
  pz_name_free(text), pz_admin(text), pz_admin_events(text,text,int) to anon, authenticated;
revoke execute on function pz_auth(text,text) from anon, authenticated, public;

-- >>> CHANGE THE TEACHER KEY BELOW (keep the quotes) <<<
insert into pz_settings(k,v) values('teacher_key', extensions.crypt('CHANGE_ME_teacher_key', extensions.gen_salt('bf')))
  on conflict(k) do nothing;
