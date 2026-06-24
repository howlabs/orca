#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRATCH="${SCRATCH:-/tmp/grok-goal-3ac3be008fd9/implementer}"
cd "$ROOT"
mkdir -p "$SCRATCH"

rm -f \
  "$SCRATCH"/vitest-core-tests.log \
  "$SCRATCH"/vitest-core-tests-run2.log \
  "$SCRATCH"/vitest-core-tests-pass1.log \
  "$SCRATCH"/help-menu-labels.log \
  "$SCRATCH"/migration-state.log \
  "$SCRATCH"/dead-code-grep.log \
  "$SCRATCH"/verification-summary.txt

VITEST_SLICE=(
  pnpm vitest run --config config/vitest.config.ts
  src/main/menu/register-app-menu.test.ts
  src/renderer/src/components/sidebar/SidebarSettingsHelpMenu.test.tsx
  src/main/persistence.test.ts
  src/renderer/src/hooks/useSettingsNavigationMetadata.test.ts
  src/renderer/src/store/slices/ui.test.ts
  --reporter=verbose
)

{
  echo "=== GATING RUN 1 $(date -Iseconds) ==="
  "${VITEST_SLICE[@]}"
  echo "=== GATING RUN 1 EXIT: $? ==="
  echo ""
  echo "=== GATING RUN 2 $(date -Iseconds) ==="
  "${VITEST_SLICE[@]}"
  echo "=== GATING RUN 2 EXIT: $? ==="
} 2>&1 | tee "$SCRATCH/vitest-core-tests.log"

pnpm vitest run --config config/vitest.config.ts \
  src/renderer/src/lib/getting-started-settings-search.test.ts \
  --reporter=verbose 2>&1 | tee "$SCRATCH/getting-started-settings-search-tests.log"

{
  echo "platform=$(uname -s) arch=$(uname -m)"
  echo "source=register-app-menu.test.ts (non-Mac Help submenu)"
  pnpm vitest run --config config/vitest.config.ts \
    src/main/menu/register-app-menu.test.ts \
    -t "Getting started" \
    --reporter=verbose 2>&1
} | tee "$SCRATCH/help-menu-labels.log"

{
  echo "source=persistence.test.ts migration cases"
  pnpm vitest run --config config/vitest.config.ts \
    src/main/persistence.test.ts \
    -t "defaults showAutomationsButton and showMobileButton" \
    --reporter=verbose 2>&1
  pnpm vitest run --config config/vitest.config.ts \
    src/main/persistence.test.ts \
    -t "preserves showAutomationsButton and showMobileButton" \
    --reporter=verbose 2>&1
} | tee "$SCRATCH/migration-state.log"

{
  echo "# dead-code grep $(date -Iseconds)"
  rg -n "Onboarding checklist|SetupGuideSidebarEntry|SettingsSetupGuidePane" src \
    --glob '!**/locales/**' \
    --glob '!**/*.test.*' || echo "(no matches)"
  rg -n "import.*SettingsSetupGuidePane" src || echo "(no SettingsSetupGuidePane imports)"
} | tee "$SCRATCH/dead-code-grep.log"

echo "verify-getting-started-phase1: OK — artifacts in $SCRATCH"