import { AgGridFilter, AgGridColumnState } from '@/entities/view/types';
import { SupabaseClient } from '@supabase/supabase-js';

export function applyAgGridStateToSupabaseQuery(query: any, filterModel: Record<string, AgGridFilter> | undefined | null, colState: AgGridColumnState[] | undefined | null) {
  if (filterModel) {
    Object.entries(filterModel).forEach(([key, filter]) => {
      if (filter.filterType === 'text') {
        if (filter.type === 'contains') query = query.ilike(key, `%${filter.filter}%`);
        else if (filter.type === 'equals') query = query.eq(key, filter.filter);
        else if (filter.type === 'startsWith') query = query.ilike(key, `${filter.filter}%`);
        else if (filter.type === 'endsWith') query = query.ilike(key, `%${filter.filter}`);
      }
      if (filter.filterType === 'number') {
        if (filter.type === 'equals') query = query.eq(key, filter.filter);
        if (filter.type === 'greaterThan') query = query.gt(key, filter.filter);
        if (filter.type === 'lessThan') query = query.lt(key, filter.filter);
      }
    });
  }

  if (colState) {
    const sortedCols = colState.filter(c => c.sort).sort((a, b) => (a.sortIndex || 0) - (b.sortIndex || 0));
    sortedCols.forEach(col => {
      query = query.order(col.colId, { ascending: col.sort === 'asc' });
    });
  }
  
  return query;
}
