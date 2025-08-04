#!/bin/bash

echo "🚀 Probando el flujo de autenticación del CRM..."
echo

# Verificar que el servidor esté corriendo
echo "📡 Verificando servidor..."
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Servidor corriendo en http://localhost:5173"
else
    echo "❌ Servidor no está corriendo. Iniciando..."
    bun dev &
    sleep 5
fi

echo
echo "🔍 Rutas disponibles para probar:"
echo "  • Landing page: http://localhost:5173/"
echo "  • Login: http://localhost:5173/login"
echo "  • Register: http://localhost:5173/register"
echo "  • Dashboard (protegido): http://localhost:5173/dashboard"

echo
echo "🧪 Flujo de prueba recomendado:"
echo "1. Ir a landing page"
echo "2. Click en '🚀 Acceso a la App'"
echo "3. Deberías ser redirigido a login"
echo "4. Registrar nuevo usuario o usar credenciales existentes"
echo "5. Tras login exitoso, deberías llegar al dashboard"
echo "6. En el Header verás: avatar, nombre/email del usuario, botón 'Salir'"
echo "7. Click en 'Salir' → deberías volver a la landing page ('/')"

echo
echo "📝 Para crear usuario de prueba:"
echo "  Email: test@example.com"
echo "  Password: password123"

echo
echo "🎯 URLs directas para probar:"
echo "  curl http://localhost:5173/dashboard"
echo "  (Debería redirigir a login si no estás autenticado)"
