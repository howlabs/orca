import type React from 'react'

import type { GlobalSettings } from '../../../../shared/types'

import { Separator } from '../ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { UIZoomControl } from './UIZoomControl'
import { SearchableSetting } from './SearchableSetting'
import { matchesSettingsSearch } from './settings-search'
import { useAppStore } from '../../store'
import { useShortcutKeyComboDetails, type ShortcutKeyComboDetails } from '@/hooks/useShortcutLabel'
import { ShortcutKeyCombo } from '../ShortcutKeyCombo'
import {
  FontAutocomplete,
  SettingsRow,
  SettingsSegmentedControl
} from './SettingsFormControls'
import { DEFAULT_APP_FONT_FAMILY } from '../../../../shared/constants'
import { normalizeAppIconId } from '../../../../shared/app-icon'
import {
  getAppIconEntries,
  getAppearancePaneSearchEntries,
  getLanguageEntries,
  getThemeEntries,
  getTypographyEntries,
  getZoomEntries
} from './appearance-search'
import { AppIconSelector } from './AppIconSelector'
import {
  getUiLanguageChoiceLabel,
  SHOW_UI_LANGUAGE_SETTING,
  UI_LANGUAGE_CHOICES
} from '@/i18n/supported-languages'
import { translate } from '@/i18n/i18n'
import type { UiLanguage } from '../../../../shared/ui-language'
export { getAppearancePaneSearchEntries }

type AppearancePaneProps = {
  settings: GlobalSettings
  updateSettings: (updates: Partial<GlobalSettings>) => void
  applyTheme: (theme: 'system' | 'dark' | 'light') => void
  fontSuggestions: string[]
}

function ShortcutHintList({ combos }: { combos: ShortcutKeyComboDetails[] }): React.JSX.Element {
  if (combos.length === 0) {
    return (
      <span className="text-xs text-muted-foreground">
        {translate('auto.components.settings.AppearancePane.3057983501', 'Unassigned')}
      </span>
    )
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-1 align-middle">
      {combos.map((combo) => (
        <ShortcutKeyCombo
          key={combo.keys.join('-')}
          keys={combo.keys}
          doubleTap={combo.doubleTap}
          className="inline-flex gap-0.5"
          separatorClassName="text-[10px] text-muted-foreground"
        />
      ))}
    </span>
  )
}

export function AppearancePane({
  settings,
  updateSettings,
  applyTheme,
  fontSuggestions
}: AppearancePaneProps): React.JSX.Element {
  const searchQuery = useAppStore((state) => state.settingsSearchQuery)
  const zoomInKeyCombos = useShortcutKeyComboDetails('zoom.in')
  const zoomOutKeyCombos = useShortcutKeyComboDetails('zoom.out')
  const visibleSections = [
    matchesSettingsSearch(searchQuery, getThemeEntries()) ||
    (SHOW_UI_LANGUAGE_SETTING && matchesSettingsSearch(searchQuery, getLanguageEntries())) ||
    matchesSettingsSearch(searchQuery, getZoomEntries()) ||
    matchesSettingsSearch(searchQuery, getTypographyEntries()) ? (
      <section key="interface" className="divide-y divide-border/40">
        {matchesSettingsSearch(searchQuery, getThemeEntries()) ? (
          <SearchableSetting
            title={translate('auto.components.settings.AppearancePane.932ff1fbff', 'Theme')}
            description={translate(
              'auto.components.settings.AppearancePane.0f28e7b30c',
              'Choose how Orca looks in the app window.'
            )}
            keywords={getThemeEntries()[0]?.keywords ?? ['dark', 'light', 'system']}
          >
            <SettingsRow
              label={translate('auto.components.settings.AppearancePane.932ff1fbff', 'Theme')}
              description={translate(
                'auto.components.settings.AppearancePane.0f28e7b30c',
                'Choose how Orca looks in the app window.'
              )}
              control={
                <SettingsSegmentedControl
                  ariaLabel={translate(
                    'auto.components.settings.AppearancePane.932ff1fbff',
                    'Theme'
                  )}
                  value={settings.theme}
                  onChange={(option) => {
                    updateSettings({ theme: option })
                    applyTheme(option)
                  }}
                  options={[
                    {
                      value: 'system',
                      label: translate(
                        'auto.components.settings.AppearancePane.fb0e0b4453',
                        'System'
                      )
                    },
                    {
                      value: 'dark',
                      label: translate('auto.components.settings.AppearancePane.7d26ccabe8', 'Dark')
                    },
                    {
                      value: 'light',
                      label: translate(
                        'auto.components.settings.AppearancePane.fd89b5487c',
                        'Light'
                      )
                    }
                  ]}
                />
              }
            />
          </SearchableSetting>
        ) : null}

        {SHOW_UI_LANGUAGE_SETTING && matchesSettingsSearch(searchQuery, getLanguageEntries()) ? (
          <SearchableSetting
            title={translate('settings.appearance.language.title', 'Language')}
            description={translate(
              'settings.appearance.language.description',
              'Choose the language used by the Orca interface.'
            )}
            keywords={getLanguageEntries()[0]?.keywords ?? []}
          >
            <SettingsRow
              label={translate('settings.appearance.language.title', 'Language')}
              description={translate(
                'settings.appearance.language.description',
                'Choose the language used by the Orca interface.'
              )}
              control={
                <Select
                  value={settings.uiLanguage}
                  onValueChange={(value) => updateSettings({ uiLanguage: value as UiLanguage })}
                >
                  <SelectTrigger
                    size="sm"
                    className="min-w-[220px]"
                    aria-label={translate('settings.appearance.language.title', 'Language')}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UI_LANGUAGE_CHOICES.map((choice) => (
                      <SelectItem key={choice.value} value={choice.value}>
                        {getUiLanguageChoiceLabel(choice, translate)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              }
            />
          </SearchableSetting>
        ) : null}

        {matchesSettingsSearch(searchQuery, getZoomEntries()) ? (
          <SearchableSetting
            title={translate('auto.components.settings.AppearancePane.5e6d7aba8d', 'UI Zoom')}
            description={translate(
              'auto.components.settings.AppearancePane.622e1c3465',
              'Scale the entire application interface.'
            )}
            keywords={getZoomEntries()[0]?.keywords ?? ['zoom', 'scale', 'shortcut']}
          >
            <SettingsRow
              label={translate('auto.components.settings.AppearancePane.5e6d7aba8d', 'UI Zoom')}
              description={
                <>
                  {translate(
                    'auto.components.settings.AppearancePane.f687711a9b',
                    'Scale the entire application interface. Use'
                  )}{' '}
                  <ShortcutHintList combos={zoomInKeyCombos} /> /{' '}
                  <ShortcutHintList combos={zoomOutKeyCombos} />{' '}
                  {translate(
                    'auto.components.settings.AppearancePane.ef89200c1f',
                    'when not in a terminal pane.'
                  )}
                </>
              }
              control={<UIZoomControl />}
            />
          </SearchableSetting>
        ) : null}

        {matchesSettingsSearch(searchQuery, getTypographyEntries()) ? (
          <SearchableSetting
            title={translate('auto.components.settings.AppearancePane.102d6b5f9b', 'IDE Font')}
            description={translate(
              'auto.components.settings.AppearancePane.42554f615f',
              'Choose the font used by the Orca interface.'
            )}
            keywords={getTypographyEntries()[0]?.keywords ?? ['font', 'typeface', 'typography']}
          >
            <SettingsRow
              alignTop
              label={translate('auto.components.settings.AppearancePane.102d6b5f9b', 'IDE Font')}
              description={translate(
                'auto.components.settings.AppearancePane.42554f615f',
                'Choose the font used by the Orca interface.'
              )}
              control={
                <FontAutocomplete
                  value={settings.appFontFamily}
                  suggestions={fontSuggestions}
                  placeholder={DEFAULT_APP_FONT_FAMILY}
                  onChange={(value) =>
                    updateSettings({ appFontFamily: value.trim() || DEFAULT_APP_FONT_FAMILY })
                  }
                />
              }
            />
          </SearchableSetting>
        ) : null}
      </section>
    ) : null,
    matchesSettingsSearch(searchQuery, getAppIconEntries()) ? (
      <section key="app-icon" className="space-y-3">
        <SearchableSetting
          title={translate('auto.components.settings.AppearancePane.ca1590d42f', 'App Icon')}
          description={translate(
            'auto.components.settings.AppearancePane.0cd9b8228f',
            'Choose the app icon shown in the Dock and window switcher.'
          )}
          keywords={getAppIconEntries().flatMap((entry) => [
            entry.title,
            entry.description ?? '',
            ...(entry.keywords ?? [])
          ])}
          className="max-w-none py-2"
        >
          <AppIconSelector
            value={normalizeAppIconId(settings.appIcon)}
            onChange={(appIcon) => updateSettings({ appIcon })}
          />
        </SearchableSetting>
      </section>
    ) : null
  ].filter(Boolean)

  return (
    <div className="space-y-6">
      {visibleSections.map((section, index) => (
        <div key={index} className="space-y-6">
          {index > 0 ? <Separator /> : null}
          {section}
        </div>
      ))}
    </div>
  )
}
