import type { CodexUsageStore } from '../codex-usage/store'
import type {
  CodexUsageBreakdownKind,
  CodexUsageRange,
  CodexUsageScope
} from '../../shared/codex-usage-types'
import { registerUsageStoreHandlers } from './usage-store-handlers'

export function registerCodexUsageHandlers(codexUsage: CodexUsageStore): void {
  registerUsageStoreHandlers<CodexUsageScope, CodexUsageRange, CodexUsageBreakdownKind>(
    'codexUsage',
    codexUsage
  )
}
