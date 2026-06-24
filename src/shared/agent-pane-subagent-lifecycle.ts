/** Per-pane Claude/Copilot subagent ids still running after a main-agent Stop. */

export type PaneSubagentLifecycleMaps = {
  activeSubagentIdsByPaneKey: Map<string, Set<string>>
}

export function createPaneSubagentLifecycleMaps(): PaneSubagentLifecycleMaps {
  return { activeSubagentIdsByPaneKey: new Map() }
}

export function clearPaneSubagentLifecycle(
  maps: PaneSubagentLifecycleMaps,
  paneKey: string
): void {
  maps.activeSubagentIdsByPaneKey.delete(paneKey)
}

export function paneHasActiveSubagents(maps: PaneSubagentLifecycleMaps, paneKey: string): boolean {
  const active = maps.activeSubagentIdsByPaneKey.get(paneKey)
  return active !== undefined && active.size > 0
}

function normalizeSubagentEventName(eventName: unknown): string {
  if (typeof eventName !== 'string') {
    return ''
  }
  const trimmed = eventName.trim()
  if (trimmed === 'subagentStart') {
    return 'SubagentStart'
  }
  if (trimmed === 'subagentStop') {
    return 'SubagentStop'
  }
  return trimmed
}

/** Updates subagent bookkeeping from a hook event before status normalization. */
export function applyPaneSubagentHookLifecycle(
  maps: PaneSubagentLifecycleMaps,
  paneKey: string,
  eventName: unknown,
  toolAgentId: string | undefined
): void {
  const normalizedEvent = normalizeSubagentEventName(eventName)
  if (normalizedEvent === 'UserPromptSubmit') {
    clearPaneSubagentLifecycle(maps, paneKey)
    return
  }
  const agentId = toolAgentId?.trim()
  if (!agentId) {
    return
  }
  if (normalizedEvent === 'SubagentStart') {
    let active = maps.activeSubagentIdsByPaneKey.get(paneKey)
    if (!active) {
      active = new Set()
      maps.activeSubagentIdsByPaneKey.set(paneKey, active)
    }
    active.add(agentId)
    return
  }
  if (normalizedEvent === 'SubagentStop') {
    const active = maps.activeSubagentIdsByPaneKey.get(paneKey)
    if (!active) {
      return
    }
    active.delete(agentId)
    if (active.size === 0) {
      maps.activeSubagentIdsByPaneKey.delete(paneKey)
    }
  }
}

/** Why: main-agent Stop can arrive while delegated subagents are still running. */
export function shouldSuppressDoneForActiveSubagents(
  maps: PaneSubagentLifecycleMaps,
  paneKey: string,
  eventName: unknown
): boolean {
  const normalizedEvent = normalizeSubagentEventName(eventName)
  if (normalizedEvent !== 'Stop' && normalizedEvent !== 'StopFailure') {
    return false
  }
  return paneHasActiveSubagents(maps, paneKey)
}
