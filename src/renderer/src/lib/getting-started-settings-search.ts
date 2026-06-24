import type { SettingsNavSection } from '@/lib/settings-navigation-types'
import { OrcaLogoSettingsIcon } from '@/components/settings/orca-logo-settings-icon'
import { translate } from '@/i18n/i18n'

export const GETTING_STARTED_SETTINGS_SECTION_ID = 'setup-guide'

export function isGettingStartedSectionId(sectionId: string): boolean {
  return sectionId === GETTING_STARTED_SETTINGS_SECTION_ID
}

/** Search-only Settings nav entry; opens the setup-guide modal instead of a pane. */
export function buildGettingStartedSettingsSearchSection(): SettingsNavSection {
  return {
    id: GETTING_STARTED_SETTINGS_SECTION_ID,
    title: translate(
      'auto.lib.gettingStartedSettingsSearch.ded9e9032f',
      'Getting started'
    ),
    description: translate(
      'auto.lib.gettingStartedSettingsSearch.5f32ac08f3',
      'Finish core Orca workflows for parallel agent work.'
    ),
    icon: OrcaLogoSettingsIcon,
    searchEntries: [
      {
        title: translate(
          'auto.lib.gettingStartedSettingsSearch.ded9e9032f',
          'Getting started'
        ),
        description: translate(
          'auto.lib.gettingStartedSettingsSearch.17005c73d4',
          'Open setup steps for parallel agent work.'
        ),
        keywords: [
          translate('auto.lib.gettingStartedSettingsSearch.ea0b1bc7b8', 'setup guide'),
          translate(
            'auto.lib.gettingStartedSettingsSearch.0505d0df29',
            'get started with Orca'
          ),
          translate('auto.lib.gettingStartedSettingsSearch.724c440e72', 'getting started')
        ]
      }
    ],
    group: 'setup'
  }
}

export function mergeGettingStartedIntoNavSections<T extends { id: string }>(
  sections: readonly T[],
  gettingStartedSection: T
): T[] {
  const insertAfterId = sections.some((section) => section.id === 'voice')
    ? 'voice'
    : 'orchestration'
  const insertIndex = sections.findIndex((section) => section.id === insertAfterId)
  const insertAt = insertIndex >= 0 ? insertIndex + 1 : sections.length
  return [
    ...sections.slice(0, insertAt),
    gettingStartedSection,
    ...sections.slice(insertAt)
  ]
}

export function isGettingStartedSectionVisibleInSidebar(
  sectionId: string,
  searchQuery: string
): boolean {
  if (!isGettingStartedSectionId(sectionId)) {
    return true
  }
  return searchQuery.trim() !== ''
}

export function shouldIncludeSectionInSettingsSidebarGroup(args: {
  sectionId: string
  groupId: string
  sectionGroupId: string
  searchQuery: string
}): boolean {
  if (args.sectionGroupId !== args.groupId) {
    return false
  }
  return isGettingStartedSectionVisibleInSidebar(args.sectionId, args.searchQuery)
}

export function tryOpenGettingStartedFromSettingsSearch(args: {
  sectionId: string
  searchQuery: string
  openModal: (modal: 'setup-guide', data?: Record<string, unknown>) => void
  clearSearch: () => void
}): boolean {
  if (!isGettingStartedSectionId(args.sectionId)) {
    return false
  }
  args.openModal('setup-guide', { telemetrySource: 'settings_search' })
  if (args.searchQuery.trim() !== '') {
    args.clearSearch()
  }
  return true
}