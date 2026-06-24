import os from 'node:os'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { getDefaultSettings } from '../../../../shared/constants'
import { useAppStore } from '../../store'
import { shouldOpenAutoRenameBranchAdvanced } from './AutoRenameBranchFromWorkSetting'
import { GitPane, getGitPaneSearchEntries, shouldShowAutoRenameBranchSetting } from './GitPane'
import { TooltipProvider } from '../ui/tooltip'
import { matchesSettingsSearch } from './settings-search'

function renderGitPane(searchQuery: string): string {
  useAppStore.setState({ settingsSearchQuery: searchQuery })
  return renderToStaticMarkup(
    React.createElement(
      TooltipProvider,
      null,
      React.createElement(GitPane, {
        settings: getDefaultSettings(os.homedir()),
        updateSettings: () => {},
        writeSourceControlAiSettings: async () => {},
        displayedGitUsername: 'brennan',
        settingsSearchQuery: searchQuery
      })
    )
  )
}

describe('GitPane', () => {
  it('keeps the auto-rename branch setting visible while its prompt draft is dirty', () => {
    expect(shouldShowAutoRenameBranchSetting('zz-no-match', true)).toBe(true)
  })

  it('shows the auto-rename branch setting for advanced command-template searches', () => {
    expect(shouldShowAutoRenameBranchSetting('instructions', false)).toBe(true)
    expect(shouldShowAutoRenameBranchSetting('built-in prompt', false)).toBe(true)
    expect(shouldShowAutoRenameBranchSetting('command template', false)).toBe(true)
    expect(shouldShowAutoRenameBranchSetting('kebab-case', false)).toBe(true)
  })

  it('hides the auto-rename branch setting when search misses and the prompt draft is clean', () => {
    expect(shouldShowAutoRenameBranchSetting('zz-no-match', false)).toBe(false)
  })

  it('opens auto-rename advanced controls when search matches hidden command-template fields', () => {
    expect(shouldOpenAutoRenameBranchAdvanced('prompt')).toBe(true)
    expect(shouldOpenAutoRenameBranchAdvanced('instructions')).toBe(true)
    expect(shouldOpenAutoRenameBranchAdvanced('built-in prompt')).toBe(true)
    expect(shouldOpenAutoRenameBranchAdvanced('command template')).toBe(true)
    expect(shouldOpenAutoRenameBranchAdvanced('kebab-case')).toBe(true)
    expect(shouldOpenAutoRenameBranchAdvanced('model')).toBe(false)
    expect(shouldOpenAutoRenameBranchAdvanced('thinking')).toBe(false)
  })

  it('renders auto-rename advanced controls for advanced-only search terms', () => {
    expect(renderGitPane('instructions')).toContain('Branch name command template')
    expect(renderGitPane('command template')).toContain('Branch name command template')
  })

  it('keeps auto-rename advanced controls collapsed without an advanced search match', () => {
    expect(shouldOpenAutoRenameBranchAdvanced('')).toBe(false)
    expect(shouldOpenAutoRenameBranchAdvanced('creature name')).toBe(false)
  })

  it('renders the local main freshness setting with outcome-focused copy', () => {
    const markup = renderGitPane('behind main')

    expect(markup).toContain('Keep Local Main Up to Date')
    expect(markup).toContain('git diff main...HEAD')
    expect(markup).toContain('local-only commits')
    expect(markup).not.toContain('Refresh Local Base Ref')
  })

  it('keeps Source Control group ordering out of Git settings', () => {
    const markup = renderGitPane('group order')

    expect(markup).not.toContain('Source Control Group Order')
    expect(markup).not.toContain('Changes first')
    expect(markup).not.toContain('Staged first')
    expect(markup).not.toContain('Untracked first')
  })

  it('omits Source Control group order search metadata', () => {
    expect(matchesSettingsSearch('group order', getGitPaneSearchEntries())).toBe(false)
  })
})
