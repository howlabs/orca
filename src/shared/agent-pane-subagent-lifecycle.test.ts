import { describe, expect, it } from 'vitest'
import {
  applyPaneSubagentHookLifecycle,
  clearPaneSubagentLifecycle,
  createPaneSubagentLifecycleMaps,
  paneHasActiveSubagents,
  shouldSuppressDoneForActiveSubagents
} from './agent-pane-subagent-lifecycle'

const PANE = 'tab-1:11111111-1111-4111-8111-111111111111'

describe('agent pane subagent lifecycle', () => {
  it('tracks SubagentStart and SubagentStop for the same pane', () => {
    const maps = createPaneSubagentLifecycleMaps()
    applyPaneSubagentHookLifecycle(maps, PANE, 'SubagentStart', 'agent-sub-a')
    expect(paneHasActiveSubagents(maps, PANE)).toBe(true)

    applyPaneSubagentHookLifecycle(maps, PANE, 'SubagentStop', 'agent-sub-a')
    expect(paneHasActiveSubagents(maps, PANE)).toBe(false)
  })

  it('accepts Copilot camelCase subagent event names', () => {
    const maps = createPaneSubagentLifecycleMaps()
    applyPaneSubagentHookLifecycle(maps, PANE, 'subagentStart', 'agent-sub-b')
    expect(shouldSuppressDoneForActiveSubagents(maps, PANE, 'Stop')).toBe(true)
  })

  it('suppresses main-agent Stop while any subagent is still active', () => {
    const maps = createPaneSubagentLifecycleMaps()
    applyPaneSubagentHookLifecycle(maps, PANE, 'SubagentStart', 'agent-sub-a')
    expect(shouldSuppressDoneForActiveSubagents(maps, PANE, 'Stop')).toBe(true)
    expect(shouldSuppressDoneForActiveSubagents(maps, PANE, 'StopFailure')).toBe(true)
    expect(shouldSuppressDoneForActiveSubagents(maps, PANE, 'PreToolUse')).toBe(false)
  })

  it('clears tracked subagents on a new user prompt', () => {
    const maps = createPaneSubagentLifecycleMaps()
    applyPaneSubagentHookLifecycle(maps, PANE, 'SubagentStart', 'agent-sub-a')
    applyPaneSubagentHookLifecycle(maps, PANE, 'UserPromptSubmit', undefined)
    expect(paneHasActiveSubagents(maps, PANE)).toBe(false)
    expect(shouldSuppressDoneForActiveSubagents(maps, PANE, 'Stop')).toBe(false)
  })

  it('clearPaneSubagentLifecycle removes pane bookkeeping', () => {
    const maps = createPaneSubagentLifecycleMaps()
    applyPaneSubagentHookLifecycle(maps, PANE, 'SubagentStart', 'agent-sub-a')
    clearPaneSubagentLifecycle(maps, PANE)
    expect(paneHasActiveSubagents(maps, PANE)).toBe(false)
  })
})
