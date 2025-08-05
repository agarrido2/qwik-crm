# USER_AUTHENTICATION_SUPA

## Tabla `user`

```sql
-- Tabla principal de usuarios para dominio CRM
CREATE TABLE public.user (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT FALSE, -- Solo será TRUE cuando el usuario confirme su email
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  role TEXT NOT NULL DEFAULT 'user' -- Ejemplo: 'user', 'admin', 'manager', etc.
);
```

---

## Función: handle_new_auth_user

```sql
-- Inserta un usuario en la tabla user cuando se crea en auth.users.
-- Marca is_active=TRUE solo si el email ya está confirmado.
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user (
    id,
    email,
    full_name,
    is_active,
    created_at,
    updated_at,
    auth_user_id,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    '', -- nombre vacío o por defecto
    CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN TRUE ELSE FALSE END,
    NOW(),
    NOW(),
    NEW.id,
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Trigger: on_auth_user_created

```sql
-- Trigger que ejecuta la función anterior tras crear usuario en auth.users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_auth_user();
```

---

## Función: handle_auth_user_update

```sql
-- Actualiza el campo is_active a TRUE en la tabla user cuando el usuario confirma su email en auth.users
CREATE OR REPLACE FUNCTION public.handle_auth_user_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    UPDATE public.user
    SET is_active = TRUE, updated_at = NOW()
    WHERE auth_user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Trigger: on_auth_user_updated

```sql
-- Trigger que ejecuta la función anterior tras actualizar usuario en auth.users
CREATE TRIGGER on_auth_user_updated
AFTER UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_auth_user_update();
```

---

### Notas
- Estos scripts aseguran que solo los usuarios con email confirmado tienen is_active=TRUE en tu tabla user.
- El patrón de documentación aquí usado será el estándar para futuras tablas, funciones y triggers relacionados con Supabase en este proyecto.
