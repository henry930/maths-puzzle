-- Patch: replaces pz_login (fixes the wrong-PIN error). Run in Supabase SQL Editor.
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
  return json_build_object('ok',true,'name',p.name,'data',coalesce(d,'{}'::jsonb));
end $$;
