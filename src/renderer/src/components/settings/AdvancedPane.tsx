import { useRef, useState } from 'react'
import { ChevronDown, Info, Loader2, RotateCw } from 'lucide-react'
import type { GlobalSettings } from '../../../../shared/types'
import { useMountedRef } from '@/hooks/useMountedRef'
import { useAppStore } from '../../store'
import { Button } from '../ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { Label } from '../ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { AdvancedNetworkSettingsSection } from './AdvancedNetworkSettingsSection'
import { SearchableSetting } from './SearchableSetting'
import { SettingsSubsectionHeader, SettingsSwitch } from './SettingsFormControls'
import { getAdvancedPaneSearchEntries, getAdvancedSearchEntry } from './advanced-search'
import { matchesSettingsSearch, normalizeSettingsSearchQuery } from './settings-search'
import { cn } from '@/lib/utils'
import { translate } from '@/i18n/i18n'

export { getAdvancedPaneSearchEntries }

type AdvancedPaneProps = {
  settings: GlobalSettings
  updateSettings: (updates: Partial<GlobalSettings>) => void
}

export function shouldOpenHttp1CompatibilityTroubleshooting({
  searchQuery,
  enabled,
  restartRequired
}: {
  searchQuery: string
  enabled: boolean
  restartRequired: boolean
}): boolean {
  return (
    enabled ||
    restartRequired ||
    (normalizeSettingsSearchQuery(searchQuery) !== '' &&
      matchesSettingsSearch(searchQuery, getAdvancedSearchEntry().http1Compatibility))
  )
}

export function AdvancedPane({ settings, updateSettings }: AdvancedPaneProps): React.JSX.Element {
  const mountedRef = useMountedRef()
  const searchQuery = useAppStore((s) => s.settingsSearchQuery)
  const http1CompatibilityInitialRef = useRef(Boolean(settings.electronHttp1CompatibilityMode))
  const [http1CompatibilityRelaunching, setHttp1CompatibilityRelaunching] = useState(false)
  const http1CompatibilityEnabled = Boolean(settings.electronHttp1CompatibilityMode)
  const http1CompatibilityRestartRequired =
    http1CompatibilityEnabled !== http1CompatibilityInitialRef.current
  const [http1CompatibilityOpen, setHttp1CompatibilityOpen] = useState(false)
  const http1CompatibilityForcedOpen = shouldOpenHttp1CompatibilityTroubleshooting({
    searchQuery,
    enabled: http1CompatibilityEnabled,
    restartRequired: http1CompatibilityRestartRequired
  })
  const http1CompatibilityExpanded = http1CompatibilityOpen || http1CompatibilityForcedOpen

  const toggleHttp1CompatibilityMode = (): void => {
    updateSettings({ electronHttp1CompatibilityMode: !http1CompatibilityEnabled })
  }

  const handleHttp1CompatibilityRelaunch = (): void => {
    setHttp1CompatibilityRelaunching(true)
    void window.api.app.relaunch().catch((error) => {
      console.error('[settings] failed to relaunch for HTTP/1.1 compatibility:', error)
      if (mountedRef.current) {
        setHttp1CompatibilityRelaunching(false)
      }
    })
  }

  return (
    <div className="space-y-4">
      <section className="space-y-3">
        <SettingsSubsectionHeader
          title={translate('auto.components.settings.AdvancedPane.8d8d8ac599', 'Compatibility')}
          description={translate(
            'auto.components.settings.AdvancedPane.8b7a8df299',
            'Low-level workarounds for support troubleshooting.'
          )}
        />

        <Collapsible
          open={http1CompatibilityExpanded}
          onOpenChange={setHttp1CompatibilityOpen}
          className="space-y-2"
        >
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="-ml-2 h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              {translate(
                'auto.components.settings.AdvancedPane.troubleshooting',
                'Troubleshooting'
              )}
              <ChevronDown className={cn('size-3.5', http1CompatibilityExpanded && 'rotate-180')} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 rounded-md border border-border/60 bg-muted/20 px-3 py-3">
              <SearchableSetting
                title={getAdvancedSearchEntry().http1Compatibility.title}
                description={getAdvancedSearchEntry().http1Compatibility.description}
                keywords={getAdvancedSearchEntry().http1Compatibility.keywords}
                className="space-y-2"
                id="advanced-http1-compatibility"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 shrink">
                    <div className="flex items-center gap-1.5">
                      <Label id="advanced-http1-compatibility-label">
                        {translate(
                          'auto.components.settings.AdvancedPane.e9506d3377',
                          'HTTP/1.1 Compatibility'
                        )}
                      </Label>
                      <TooltipProvider delayDuration={250}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              aria-label={translate(
                                'auto.components.settings.AdvancedPane.6627e75c92',
                                'Explain HTTP/1.1 compatibility'
                              )}
                              className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                              <Info className="size-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            sideOffset={6}
                            className="max-w-[280px] leading-relaxed"
                          >
                            {translate(
                              'auto.components.settings.AdvancedPane.b3ad629640',
                              'Use only when a corporate VPN or proxy breaks update downloads with HTTP/2 protocol errors. It affects all Electron networking after restart.'
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <SettingsSwitch
                    checked={http1CompatibilityEnabled}
                    onChange={toggleHttp1CompatibilityMode}
                    ariaLabelledBy="advanced-http1-compatibility-label"
                  />
                </div>

                {http1CompatibilityRestartRequired ? (
                  <div className="flex items-center justify-between gap-3 rounded-md border border-border/50 bg-muted/30 px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium">
                        {translate(
                          'auto.components.settings.AdvancedPane.89958d7edf',
                          'Restart required'
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {translate(
                          'auto.components.settings.AdvancedPane.87a2cb2ac8',
                          'Orca applies this networking mode at startup.'
                        )}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleHttp1CompatibilityRelaunch}
                      disabled={http1CompatibilityRelaunching}
                      className="shrink-0 gap-1.5"
                    >
                      {http1CompatibilityRelaunching ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <RotateCw className="size-3.5" />
                      )}
                      {translate('auto.components.settings.AdvancedPane.40b29e0bf3', 'Restart')}
                    </Button>
                  </div>
                ) : null}
              </SearchableSetting>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </section>

      <section className="space-y-3">
        <SettingsSubsectionHeader
          title={translate('auto.components.settings.AdvancedPane.network', 'Network')}
          description={translate(
            'auto.components.settings.AdvancedPane.networkDescription',
            'App-level network routing for proxies and corporate environments.'
          )}
        />
        <AdvancedNetworkSettingsSection settings={settings} updateSettings={updateSettings} />
      </section>
    </div>
  )
}
