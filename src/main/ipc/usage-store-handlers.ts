import { ipcMain } from 'electron'

export type UsageStoreHandlers<Scope, Range, BreakdownKind> = {
  getScanState: () => unknown
  setEnabled: (enabled: boolean) => unknown
  refresh: (force?: boolean) => unknown
  getSnapshot: (scope: Scope, range: Range, limit?: number) => unknown
  getSummary: (scope: Scope, range: Range) => unknown
  getDaily: (scope: Scope, range: Range) => unknown
  getBreakdown: (scope: Scope, range: Range, kind: BreakdownKind) => unknown
  getRecentSessions: (scope: Scope, range: Range, limit?: number) => unknown
}

export function registerUsageStoreHandlers<Scope, Range, BreakdownKind>(
  channelPrefix: string,
  store: UsageStoreHandlers<Scope, Range, BreakdownKind>
): void {
  ipcMain.handle(`${channelPrefix}:getScanState`, () => store.getScanState())
  ipcMain.handle(`${channelPrefix}:setEnabled`, (_event, args: { enabled: boolean }) =>
    store.setEnabled(args.enabled)
  )
  ipcMain.handle(`${channelPrefix}:refresh`, (_event, args?: { force?: boolean }) =>
    store.refresh(args?.force ?? false)
  )
  ipcMain.handle(
    `${channelPrefix}:getSnapshot`,
    (_event, args: { scope: Scope; range: Range; limit?: number }) =>
      store.getSnapshot(args.scope, args.range, args.limit)
  )
  ipcMain.handle(`${channelPrefix}:getSummary`, (_event, args: { scope: Scope; range: Range }) =>
    store.getSummary(args.scope, args.range)
  )
  ipcMain.handle(`${channelPrefix}:getDaily`, (_event, args: { scope: Scope; range: Range }) =>
    store.getDaily(args.scope, args.range)
  )
  ipcMain.handle(
    `${channelPrefix}:getBreakdown`,
    (_event, args: { scope: Scope; range: Range; kind: BreakdownKind }) =>
      store.getBreakdown(args.scope, args.range, args.kind)
  )
  ipcMain.handle(
    `${channelPrefix}:getRecentSessions`,
    (_event, args: { scope: Scope; range: Range; limit?: number }) =>
      store.getRecentSessions(args.scope, args.range, args.limit)
  )
}
