import type { ClaudeUsageStore } from '../claude-usage/store'
import type {
  ClaudeUsageBreakdownKind,
  ClaudeUsageRange,
  ClaudeUsageScope
} from '../../shared/claude-usage-types'
import { registerUsageStoreHandlers } from './usage-store-handlers'

export function registerClaudeUsageHandlers(claudeUsage: ClaudeUsageStore): void {
  registerUsageStoreHandlers<ClaudeUsageScope, ClaudeUsageRange, ClaudeUsageBreakdownKind>(
    'claudeUsage',
    claudeUsage
  )
}
