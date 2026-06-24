import { describe, expect, it, vi } from 'vitest'
import {
  buildGettingStartedSettingsSearchSection,
  GETTING_STARTED_SETTINGS_SECTION_ID,
  isGettingStartedSectionVisibleInSidebar,
  mergeGettingStartedIntoNavSections,
  shouldIncludeSectionInSettingsSidebarGroup,
  tryOpenGettingStartedFromSettingsSearch
} from './getting-started-settings-search'

describe('getting-started settings search module', () => {
  it('merges the Getting started section after voice when present', () => {
    const merged = mergeGettingStartedIntoNavSections(
      [{ id: 'agents' }, { id: 'voice' }, { id: 'general' }],
      { id: GETTING_STARTED_SETTINGS_SECTION_ID }
    )

    expect(merged.map((section) => section.id)).toEqual([
      'agents',
      'voice',
      GETTING_STARTED_SETTINGS_SECTION_ID,
      'general'
    ])
  })

  it('hides Getting started in the static sidebar until the user searches', () => {
    expect(
      isGettingStartedSectionVisibleInSidebar(GETTING_STARTED_SETTINGS_SECTION_ID, '')
    ).toBe(false)
    expect(
      isGettingStartedSectionVisibleInSidebar(GETTING_STARTED_SETTINGS_SECTION_ID, 'setup')
    ).toBe(true)
    expect(isGettingStartedSectionVisibleInSidebar('general', '')).toBe(true)
  })

  it('includes Getting started in sidebar groups only when search is active', () => {
    expect(
      shouldIncludeSectionInSettingsSidebarGroup({
        sectionId: GETTING_STARTED_SETTINGS_SECTION_ID,
        groupId: 'setup',
        sectionGroupId: 'setup',
        searchQuery: ''
      })
    ).toBe(false)
    expect(
      shouldIncludeSectionInSettingsSidebarGroup({
        sectionId: GETTING_STARTED_SETTINGS_SECTION_ID,
        groupId: 'setup',
        sectionGroupId: 'setup',
        searchQuery: 'getting'
      })
    ).toBe(true)
  })

  it('opens the setup-guide modal from settings search without activating a pane', () => {
    const openModal = vi.fn()
    const clearSearch = vi.fn()

    const handled = tryOpenGettingStartedFromSettingsSearch({
      sectionId: GETTING_STARTED_SETTINGS_SECTION_ID,
      searchQuery: 'setup guide',
      openModal,
      clearSearch
    })

    expect(handled).toBe(true)
    expect(openModal).toHaveBeenCalledWith('setup-guide', { telemetrySource: 'settings_search' })
    expect(clearSearch).toHaveBeenCalledTimes(1)
    expect(
      tryOpenGettingStartedFromSettingsSearch({
        sectionId: 'general',
        searchQuery: '',
        openModal,
        clearSearch
      })
    ).toBe(false)
  })

  it('uses Getting started copy without retired setup sidebar labels', () => {
    const section = buildGettingStartedSettingsSearchSection()
    const serialized = JSON.stringify(section.searchEntries)

    expect(section.title).toBe('Getting started')
    expect(serialized).not.toMatch(/onboarding checklist/i)
    expect(serialized).not.toMatch(/milestones/i)
  })
})