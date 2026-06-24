// @vitest-environment happy-dom

import React from 'react'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SearchFilters } from './SearchFilters'

let root: Root | null = null
let container: HTMLDivElement | null = null

function renderSearchFilters(
  props: Partial<React.ComponentProps<typeof SearchFilters>> = {}
): void {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => {
    root?.render(
      <SearchFilters
        includePattern=""
        excludePattern=""
        onIncludeChange={vi.fn()}
        onExcludeChange={vi.fn()}
        {...props}
      />
    )
  })
}

afterEach(() => {
  if (root) {
    act(() => root?.unmount())
  }
  root = null
  container?.remove()
  container = null
})

describe('SearchFilters', () => {
  it('keeps inactive filters collapsed until opened', () => {
    renderSearchFilters()

    const trigger = document.querySelector('button')
    expect(trigger?.getAttribute('aria-expanded')).toBe('false')
    expect(document.querySelector('input')).toBeNull()

    act(() => {
      trigger?.click()
    })

    expect(trigger?.getAttribute('aria-expanded')).toBe('true')
    expect(document.querySelectorAll('input')).toHaveLength(2)
  })

  it('opens when a filter is already active', () => {
    renderSearchFilters({ includePattern: 'src/**' })

    expect(document.querySelector('button')?.getAttribute('aria-expanded')).toBe('true')
    expect(document.querySelectorAll('input')).toHaveLength(2)
  })
})
