#!/bin/bash

# Script para limpiar documentación obsoleta
# Fecha: 5 de agosto de 2025

echo "🗑️ Iniciando limpieza de documentación obsoleta..."

# Directorio de documentos
DOCS_DIR="/Volumes/Proyectos/work/github/qwik-crm/documents"
cd "$DOCS_DIR"

# Archivos a conservar (los esenciales + específicos)
KEEP_FILES=(
  "QWIK_MASTER_GUIDE.md"
  "PROJECT_ARCHITECTURE.md" 
  "DEVELOPMENT_WORKFLOW.md"
  "AI_KNOWLEDGE_TRANSFER.md"
  "INDEX.md"
  "LANDING_PAGE_STRATEGY.md"
  "ESTADO_ACTUAL_AGOSTO_2025.md"
  "RESTRUCTURE_PLAN.md"
)

# Archivos a eliminar (obsoletos/duplicados)
REMOVE_FILES=(
  "AI_GUIDELINES.md"
  "AI_GUIDELINES_RULES.md"
  "AUTHENTICATION.md"
  "AUTH_REFACTORING.md"
  "AUTH_SYSTEM_AUDIT_COMPLETE.md"
  "COMPONENTS_REFACTOR.md"
  "COMPONENTS_STRUCTURE_FINAL.md"
  "CONTEXTO_GLOBAL_IMPLEMENTACION.md"
  "FORGOT_PASSWORD_SYSTEM.md"
  "HEADER_AUTH_FIX.md"
  "LAYOUT_REFACTORING_COMPLETED.md"
  "QWIK_BEST_PRACTICES_LEARNED.md"
  "QWIK_HELPERS_HOOKS.md"
  "QWIK_HOOKS_BEST_PRACTICES.md"
  "QWIK_IMPLEMENTATIONS.md"
  "QWIK_PATTERNS_PRACTICES.md"
  "QWIK_QUICK_REFERENCE.md"
  "QWIK_SETUP_CONFIG.md"
  "QWIK_STUDY_COMPLETE.md"
  "QWIK_TROUBLESHOOTING.md"
  "QUICK_START_SESSION.md"
  "AI_COMPATIBILITY_GUIDE.md"
)

echo "📊 Estado antes de limpieza:"
echo "Total archivos .md: $(ls -1 *.md 2>/dev/null | wc -l)"

# Crear backup directory
mkdir -p backup_$(date +%Y%m%d)

echo ""
echo "🔄 Eliminando archivos obsoletos..."

for file in "${REMOVE_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ❌ Eliminando: $file"
    mv "$file" "backup_$(date +%Y%m%d)/"
  else
    echo "  ⚠️  No encontrado: $file"
  fi
done

echo ""
echo "✅ Archivos conservados:"
for file in "${KEEP_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ⚠️  No encontrado: $file"
  fi
done

echo ""
echo "📊 Estado después de limpieza:"
echo "Total archivos .md: $(ls -1 *.md 2>/dev/null | wc -l)"
echo "Archivos en backup: $(ls -1 backup_$(date +%Y%m%d)/*.md 2>/dev/null | wc -l)"

echo ""
echo "🎉 Limpieza completada!"
echo "📁 Backup creado en: backup_$(date +%Y%m%d)/"
echo "📚 Documentación consolidada en 4 archivos esenciales"
