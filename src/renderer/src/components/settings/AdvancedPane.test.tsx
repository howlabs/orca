import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getDefaultSettings } from '../../../../shared/constants'
import { AdvancedPane, shouldOpenHttp1CompatibilityTroubleshooting } from './AdvancedPane'
import { getAdvancedSearchEntry } from './advanced-search'

let settingsSearchQuery = ''

vi.mock('../../store', () => ({
  useAppStore: (selector: (state: { settingsSearchQuery: string }) => unknown) =>
    selector({ settingsSearchQuery })
}))

describe('AdvancedPane', () => {
  beforeEach(() => {
    settingsSearchQuery = ''
  })

  it('keeps HTTP/1.1 compatibility behind troubleshooting by default', () => {
    const markup = renderToStaticMarkup(
      <AdvancedPane settings={getDefaultSettings('/tmp')} updateSettings={vi.fn()} />
    )

    expect(markup).toContain('Compatibility')
    expect(markup).toContain('Troubleshooting')
    expect(markup).toContain('aria-expanded="false"')
    expect(markup).not.toContain('HTTP/1.1 Compatibility')
    expect(getAdvancedSearchEntry().http1Compatibility.keywords).toContain('support')
    expect(getAdvancedSearchEntry().http1Compatibility.keywords).toContain('troubleshooting')
  })

  it('reveals HTTP/1.1 compatibility when settings search matches it', () => {
    settingsSearchQuery = 'http/1.1'

    const markup = renderToStaticMarkup(
      <AdvancedPane settings={getDefaultSettings('/tmp')} updateSettings={vi.fn()} />
    )

    expect(markup).toContain('aria-expanded="true"')
    expect(markup).toContain('HTTP/1.1 Compatibility')
    expect(markup).toContain('Explain HTTP/1.1 compatibility')
  })

  it('opens HTTP/1.1 compatibility troubleshooting only when state needs it', () => {
    expect(
      shouldOpenHttp1CompatibilityTroubleshooting({
        searchQuery: '',
        enabled: false,
        restartRequired: false
      })
    ).toBe(false)
    expect(
      shouldOpenHttp1CompatibilityTroubleshooting({
        searchQuery: '',
        enabled: true,
        restartRequired: false
      })
    ).toBe(true)
    expect(
      shouldOpenHttp1CompatibilityTroubleshooting({
        searchQuery: 'proxy',
        enabled: false,
        restartRequired: false
      })
    ).toBe(true)
  })
})
