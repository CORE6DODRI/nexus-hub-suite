CREATE OR REPLACE FUNCTION public.bootstrap_current_user(_first_name text DEFAULT NULL,_last_name text DEFAULT NULL) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE _uid uuid:=auth.uid(); _email text; _role_id uuid; _has_super boolean;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT email,raw_user_meta_data->>'first_name',raw_user_meta_data->>'last_name' INTO _email,_first_name,_last_name FROM auth.users WHERE id=_uid;
  INSERT INTO public.profiles(id,email,first_name,last_name,last_login_at) VALUES(_uid,_email,_first_name,_last_name,now())
    ON CONFLICT(id) DO UPDATE SET last_login_at=now(),email=EXCLUDED.email;
  IF NOT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=_uid) THEN
    SELECT EXISTS(SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id=ur.role_id WHERE r.slug='super-admin') INTO _has_super;
    SELECT id INTO _role_id FROM public.roles WHERE slug = CASE WHEN _has_super THEN 'viewer' ELSE 'super-admin' END;
    IF _role_id IS NOT NULL THEN INSERT INTO public.user_roles(user_id,role_id) VALUES(_uid,_role_id) ON CONFLICT DO NOTHING; END IF;
    IF NOT _has_super THEN UPDATE public.profiles SET access_type='super_admin' WHERE id=_uid; END IF;
  END IF;
  INSERT INTO public.activity_logs(user_id,actor_label,action,entity_type,description) VALUES(_uid,_email,'user.login','auth','User signed in');
END $$;