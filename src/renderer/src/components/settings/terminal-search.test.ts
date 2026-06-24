import { describe, expect, it } from 'vitest'
import { getTerminalPaneSearchEntries } from './terminal-search'
import { getAppearancePaneSearchEntries } from './appearance-search'
import { matchesSettingsSearch } from './settings-search'

describe('getTerminalPaneSearchEntries', () => {
  it('includes the Windows right-click setting on Windows', () => {
    const entries = getTerminalPaneSearchEntries({ isWindows: true, isMac: false })
    expect(entries.some((entry) => entry.title === 'Right-click to paste')).toBe(true)
  })

  it('includes the PowerShell version setting on Windows', () => {
    const entries = getTerminalPaneSearchEntries({ isWindows: true, isMac: false })
    expect(entries.some((entry) => entry.title === 'PowerShell Version')).toBe(true)
  })

  it('keeps Windows host entries separate from Windows client entries', () => {
    const entries = getTerminalPaneSearchEntries({
      isWindows: false,
      isWindowsTerminalHost: true,
      isMac: false
    })

    expect(entries.some((entry) => entry.title === 'Default Shell')).toBe(true)
    expect(entries.some((entry) => entry.title === 'PowerShell Version')).toBe(true)
    expect(entries.some((entry) => entry.title === 'Right-click to paste')).toBe(false)
  })

  it('omits legacy WSL distribution terminal settings on Windows', () => {
    const entries = getTerminalPaneSearchEntries({ isWindows: true, isMac: false })
    expect(entries.some((entry) => entry.title === 'WSL Distribution')).toBe(false)
    expect(matchesSettingsSearch('ubuntu distro', entries)).toBe(false)
  })

  it('omits the Windows right-click setting elsewhere', () => {
    const entries = getTerminalPaneSearchEntries({ isWindows: false, isMac: false })
    expect(entries.some((entry) => entry.title === 'Right-click to paste')).toBe(false)
  })

  it('omits the PowerShell version setting elsewhere', () => {
    const entries = getTerminalPaneSearchEntries({ isWindows: false, isMac: false })
    expect(entries.some((entry) => entry.title === 'PowerShell Version')).toBe(false)
  })

  it('includes the Option as Alt setting on macOS', () => {
    const entries = getTerminalPaneSearchEntries({ isWindows: false, isMac: true })
    expect(entries.some((entry) => entry.title === 'Option as Alt')).toBe(true)
  })

  it('omits the Option as Alt setting on non-macOS', () => {
    const entries = getTerminalPaneSearchEntries({ isWindows: false, isMac: false })
    expect(entries.some((entry) => entry.title === 'Option as Alt')).toBe(false)
  })

  it('includes the JIS Yen mapping setting only on macOS', () => {
    const entriesMac = getTerminalPaneSearchEntries({ isWindows: false, isMac: true })
    const entriesLinux = getTerminalPaneSearchEntries({ isWindows: false, isMac: false })

    expect(entriesMac.some((entry) => entry.title === 'JIS Yen (¥) to Backslash (\\)')).toBe(true)
    expect(entriesLinux.some((entry) => entry.title === 'JIS Yen (¥) to Backslash (\\)')).toBe(
      false
    )
  })

  it('includes the Manage Sessions entry on all platforms', () => {
    const entriesWindows = getTerminalPaneSearchEntries({ isWindows: true, isMac: false })
    const entriesMac = getTerminalPaneSearchEntries({ isWindows: false, isMac: true })
    const entriesLinux = getTerminalPaneSearchEntries({ isWindows: false, isMac: false })
    expect(entriesWindows.some((entry) => entry.title === 'Manage Sessions')).toBe(true)
    expect(entriesMac.some((entry) => entry.title === 'Manage Sessions')).toBe(true)
    expect(entriesLinux.some((entry) => entry.title === 'Manage Sessions')).toBe(true)
  })

  it('includes the OSC 52 clipboard setting on all platforms', () => {
    const entriesWindows = getTerminalPaneSearchEntries({ isWindows: true, isMac: false })
    const entriesMac = getTerminalPaneSearchEntries({ isWindows: false, isMac: true })
    const entriesLinux = getTerminalPaneSearchEntries({ isWindows: false, isMac: false })
    expect(
      entriesWindows.some((entry) => entry.title === 'Allow TUI Clipboard Writes (OSC 52)')
    ).toBe(true)
    expect(entriesMac.some((entry) => entry.title === 'Allow TUI Clipboard Writes (OSC 52)')).toBe(
      true
    )
    expect(
      entriesLinux.some((entry) => entry.title === 'Allow TUI Clipboard Writes (OSC 52)')
    ).toBe(true)
  })

  it('includes the running-terminal close confirmation setting on all platforms', () => {
    const entriesWindows = getTerminalPaneSearchEntries({ isWindows: true, isMac: false })
    const entriesMac = getTerminalPaneSearchEntries({ isWindows: false, isMac: true })
    const entriesLinux = getTerminalPaneSearchEntries({ isWindows: false, isMac: false })
    const hasEntry = (entries: typeof entriesWindows): boolean =>
      entries.some(
        (entry) =>
          entry.title === 'Ask Before Closing Running Terminals' &&
          matchesSettingsSearch('confirm', [entry]) &&
          matchesSettingsSearch('agent', [entry]) &&
          matchesSettingsSearch('close', [entry])
      )

    expect(hasEntry(entriesWindows)).toBe(true)
    expect(hasEntry(entriesMac)).toBe(true)
    expect(hasEntry(entriesLinux)).toBe(true)
  })

  it('keeps terminal appearance settings in the Terminal search index', () => {
    const entriesWindows = getTerminalPaneSearchEntries({ isWindows: true, isMac: false })
    const entriesMac = getTerminalPaneSearchEntries({ isWindows: false, isMac: true })
    const entriesLinux = getTerminalPaneSearchEntries({ isWindows: false, isMac: false })

    expect(entriesWindows.some((entry) => entry.title === 'Import from Ghostty')).toBe(true)
    expect(entriesMac.some((entry) => entry.title === 'Font Size')).toBe(true)
    expect(entriesLinux.some((entry) => entry.title === 'Dark Theme')).toBe(true)
    expect(
      getAppearancePaneSearchEntries().some((entry) => entry.title === 'Import from Ghostty')
    ).toBe(false)
    expect(getAppearancePaneSearchEntries().some((entry) => entry.title === 'Font Size')).toBe(
      false
    )
    expect(getAppearancePaneSearchEntries().some((entry) => entry.title === 'Dark Theme')).toBe(
      false
    )
  })

  it('omits Warp import entries when desktop-only Terminal controls are hidden', () => {
    const desktopEntries = getTerminalPaneSearchEntries({
      isWindows: false,
      isMac: false,
      showWarpImport: true
    })
    const webEntries = getTerminalPaneSearchEntries({
      isWindows: false,
      isMac: false,
      showWarpImport: false
    })

    expect(desktopEntries.some((entry) => entry.title === 'Import themes from Warp')).toBe(true)
    expect(webEntries.some((entry) => entry.title === 'Import themes from Warp')).toBe(false)
    expect(webEntries.some((entry) => entry.title === 'Import from Ghostty')).toBe(true)
  })

  it('keeps sidebar and tray controls out of the Appearance search index', () => {
    const entries = getAppearancePaneSearchEntries()

    expect(entries.some((entry) => entry.title === 'Show Automations Button')).toBe(false)
    expect(entries.some((entry) => entry.title === 'Minimize to Tray on Close')).toBe(false)
    expect(matchesSettingsSearch('tray', entries)).toBe(false)
  })

  it('keeps workspace card layout out of the Appearance settings search catalog', () => {
    expect(
      getAppearancePaneSearchEntries().some((entry) => entry.title === 'Workspace Card Layout')
    ).toBe(false)
    expect(matchesSettingsSearch('card layout', getAppearancePaneSearchEntries())).toBe(false)
  })
})
