import React, { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { translate } from '@/i18n/i18n'

export type SearchFiltersProps = {
  includePattern: string
  excludePattern: string
  onIncludeChange: (value: string) => void
  onExcludeChange: (value: string) => void
  includeInputRef?: React.RefObject<HTMLInputElement | null>
  excludeInputRef?: React.RefObject<HTMLInputElement | null>
}

export function SearchFilters({
  includePattern,
  excludePattern,
  onIncludeChange,
  onExcludeChange,
  includeInputRef,
  excludeInputRef
}: SearchFiltersProps): React.JSX.Element {
  const activeFilterCount = [includePattern, excludePattern].filter((value) => value.trim()).length
  const [filtersOpen, setFiltersOpen] = useState(activeFilterCount > 0)
  const filterSummary =
    activeFilterCount > 0
      ? translate('auto.components.right.sidebar.SearchFilters.activeCount', '{{value0}} active', {
          value0: activeFilterCount
        })
      : translate('auto.components.right.sidebar.SearchFilters.noneActive', 'No filters')

  return (
    <div className="flex flex-col gap-1">
      <Button
        type="button"
        variant="ghost"
        size="xs"
        className="h-6 justify-start px-1.5 text-[11px] text-muted-foreground"
        aria-expanded={filtersOpen}
        onClick={() => setFiltersOpen((open) => !open)}
      >
        <SlidersHorizontal className="size-3.5" />
        {translate('auto.components.right.sidebar.SearchFilters.filters', 'Filters')}
        <span className="ml-auto tabular-nums">{filterSummary}</span>
      </Button>
      {filtersOpen ? (
        <div className="flex flex-col gap-1 pt-1">
          <label className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase text-muted-foreground">
              {translate(
                'auto.components.right.sidebar.SearchFilters.a69ee1bd0e',
                'Files To Include'
              )}
            </span>
            <input
              ref={includeInputRef}
              type="text"
              className="rounded-sm border border-border bg-input/50 px-2 py-1 text-xs text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-ring"
              placeholder={translate(
                'auto.components.right.sidebar.SearchFilters.8a77efcbd1',
                'files to include (e.g. *.ts, src/**)'
              )}
              value={includePattern}
              onChange={(e) => onIncludeChange(e.target.value)}
              spellCheck={false}
            />
          </label>
          <label className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase text-muted-foreground">
              {translate(
                'auto.components.right.sidebar.SearchFilters.0a6412a895',
                'Files To Exclude'
              )}
            </span>
            <input
              ref={excludeInputRef}
              type="text"
              className="rounded-sm border border-border bg-input/50 px-2 py-1 text-xs text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-ring"
              placeholder={translate(
                'auto.components.right.sidebar.SearchFilters.01e4671ccf',
                'files to exclude (e.g. *.min.js, dist/**)'
              )}
              value={excludePattern}
              onChange={(e) => onExcludeChange(e.target.value)}
              spellCheck={false}
            />
          </label>
        </div>
      ) : null}
    </div>
  )
}
