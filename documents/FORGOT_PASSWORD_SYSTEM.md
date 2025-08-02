# Sistema de Recuperación de Contraseña

## Funcionalidades Implementadas

### 1. Forgot Password (`/forgot-password`)
- **Ruta**: `/forgot-password`
- **Funcionalidad**: Envía email de recuperación
- **Server Action**: `useForgotPasswordAction`
- **Validación**: Solo email requerido
- **Supabase**: `resetPasswordForEmail()`

### 2. Reset Password (`/reset-password`)
- **Ruta**: `/reset-password`
- **Funcionalidad**: Cambiar contraseña con token
- **Server Action**: `useResetPasswordAction`
- **Loader**: `useResetSession` (verificar token válido)
- **Validación**: Password + confirmación
- **Supabase**: `updateUser({ password })`

### 3. Enlaces de Navegación
- ✅ Login → Forgot Password
- ✅ Login → Register
- ✅ Register → Login
- ✅ Register → Forgot Password
- ✅ Forgot Password → Login

## Flujo Completo

1. **Usuario olvida contraseña**
   - Va a `/forgot-password`
   - Ingresa email
   - Supabase envía email con link

2. **Usuario recibe email**
   - Hace click en el link
   - Es redirigido a `/reset-password` con token

3. **Usuario cambia contraseña**
   - Ingresa nueva contraseña
   - Confirma contraseña
   - Sistema valida y actualiza
   - Redirige al dashboard autenticado

## Configuración Requerida en Supabase

### Email Templates
1. **Authentication > Email Templates**
2. **Reset Password Template**:
   ```html
   <h2>Restablecer Contraseña</h2>
   <p>Haz click en el siguiente enlace para restablecer tu contraseña:</p>
   <p><a href="{{ .ConfirmationURL }}">Restablecer Contraseña</a></p>
   ```

### Site URL Configuration
1. **Authentication > URL Configuration**
2. **Site URL**: `http://localhost:5174` (desarrollo)
3. **Redirect URLs**: 
   - `http://localhost:5174/reset-password`
   - `http://localhost:5174/**` (wildcard para desarrollo)

## Patrones de Qwik Utilizados

### 1. routeAction$ para Server Actions
```typescript
export const useForgotPasswordAction = routeAction$(async (data, requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent.request);
  // Server-side processing
}, schema);
```

### 2. routeLoader$ para Data Loading
```typescript
export const useResetSession = routeLoader$(async (requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent.request);
  // Server-side data loading
});
```

### 3. Form Component con Progressive Enhancement
```typescript
<Form action={action} onSubmit$={handler}>
  {/* Auto-handles server validation */}
</Form>
```

### 4. Zod Integration
```typescript
const schema = zod$({
  email: z.string().email("Email inválido"),
});
```

## Testing

### Rutas Disponibles
- ✅ `http://localhost:5174/login`
- ✅ `http://localhost:5174/register`
- ✅ `http://localhost:5174/forgot-password`
- ✅ `http://localhost:5174/reset-password`
- ✅ `http://localhost:5174/` (dashboard - requiere auth)

### Flujo de Prueba
1. Ir a `/login`
2. Click en "¿Olvidaste tu contraseña?"
3. Ingresar email registrado
4. Verificar email recibido
5. Seguir link de email
6. Cambiar contraseña
7. Verificar redirección al dashboard

## Próximos Pasos

### Mejoras Futuras
- [ ] Rate limiting para forgot password
- [ ] Email personalizado con branding
- [ ] Logs de seguridad
- [ ] Two-factor authentication
- [ ] Password strength indicator
- [ ] Remember device functionality

### Configuración de Producción
- [ ] Configurar SMTP provider en Supabase
- [ ] Actualizar Site URLs para dominio real
- [ ] Configurar SSL/HTTPS
- [ ] Rate limiting en servidor
