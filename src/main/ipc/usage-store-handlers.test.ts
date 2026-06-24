import { beforeEach, describe, expect, it, vi } from 'vitest'

const { handleMock, removeHandlerMock } = vi.hoisted(() => ({
  handleMock: vi.fn(),
  removeHandlerMock: vi.fn()
}))

vi.mock('electron', () => ({
  ipcMain: {
    handle: handleMock,
    removeHandler: removeHandlerMock
  }
}))

import { registerUsageStoreHandlers } from './usage-store-handlers'

describe('registerUsageStoreHandlers', () => {
  beforeEach(() => {
    handleMock.mockClear()
  })

  it('registers the shared usage channel surface for a store prefix', () => {
    const store = {
      getScanState: vi.fn(() => ({ scanning: false })),
      setEnabled: vi.fn(),
      refresh: vi.fn(),
      getSnapshot: vi.fn(),
      getSummary: vi.fn(),
      getDaily: vi.fn(),
      getBreakdown: vi.fn(),
      getRecentSessions: vi.fn()
    }

    registerUsageStoreHandlers('claudeUsage', store)

    expect(handleMock.mock.calls.map(([channel]) => channel)).toEqual([
      'claudeUsage:getScanState',
      'claudeUsage:setEnabled',
      'claudeUsage:refresh',
      'claudeUsage:getSnapshot',
      'claudeUsage:getSummary',
      'claudeUsage:getDaily',
      'claudeUsage:getBreakdown',
      'claudeUsage:getRecentSessions'
    ])
  })
})
