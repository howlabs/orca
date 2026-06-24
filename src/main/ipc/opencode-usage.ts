import type { OpenCodeUsageStore } from '../opencode-usage/store'
import type {
  OpenCodeUsageBreakdownKind,
  OpenCodeUsageRange,
  OpenCodeUsageScope
} from '../../shared/opencode-usage-types'
import { registerUsageStoreHandlers } from './usage-store-handlers'

export function registerOpenCodeUsageHandlers(openCodeUsage: OpenCodeUsageStore): void {
  registerUsageStoreHandlers<OpenCodeUsageScope, OpenCodeUsageRange, OpenCodeUsageBreakdownKind>(
    'openCodeUsage',
    openCodeUsage
  )
}
