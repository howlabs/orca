import { tmpdir } from 'node:os'
import { describe, expect, it } from 'vitest'
import { getDefaultSettings } from '../../../shared/constants'
import { resolveLeftSidebarStyleVariables } from './left-sidebar-appearance'

function settings(overrides = {}) {
  return {
    ...getDefaultSettings(tmpdir()),
    ...overrides
  }
}

describe('resolveLeftSidebarStyleVariables', () => {
  it('leaves the default sidebar token surface untouched', () => {
    expect(resolveLeftSidebarStyleVariables(settings(), true)).toBeUndefined()
  })

  it('matches terminal background, foreground, and scoped text tokens', () => {
    const vars = resolveLeftSidebarStyleVariables(
      settings({
        leftSidebarAppearanceMode: 'match-terminal',
        terminalColorOverrides: {
          background: '#101820',
          foreground: '#f0f4f8'
        }
      }),
      true
    )

    expect(vars).toMatchObject({
      '--worktree-sidebar': '#101820',
      '--worktree-sidebar-foreground': '#f0f4f8',
      '--sidebar': '#101820',
      '--sidebar-foreground': '#f0f4f8',
      '--background': '#101820',
      '--foreground': '#f0f4f8'
    })
    expect(vars?.['--worktree-sidebar-accent']).toContain('#f0f4f8 9%')
    expect(vars?.['--sidebar-accent']).toBe(vars?.['--worktree-sidebar-accent'])
  })

  it('honors terminal background opacity for matched terminal surfaces', () => {
    const vars = resolveLeftSidebarStyleVariables(
      settings({
        leftSidebarAppearanceMode: 'match-terminal',
        terminalColorOverrides: { background: '#123456' },
        terminalBackgroundOpacity: 0.5
      }),
      true
    )

    expect(vars?.['--worktree-sidebar']).toBe('rgba(18, 52, 86, 0.5)')
  })

  it('falls back to the default surface for legacy tinted settings', () => {
    expect(
      resolveLeftSidebarStyleVariables(
        settings({
          leftSidebarAppearanceMode: 'tinted',
          leftSidebarTintColor: '336699',
          leftSidebarTintOpacity: 0.125
        }),
        true
      )
    ).toBeUndefined()
  })

  it('falls back to the default surface for high-opacity legacy tint settings', () => {
    expect(
      resolveLeftSidebarStyleVariables(
        settings({
          leftSidebarAppearanceMode: 'tinted',
          leftSidebarTintColor: '#000000',
          leftSidebarTintOpacity: 1
        }),
        true
      )
    ).toBeUndefined()
  })
})
