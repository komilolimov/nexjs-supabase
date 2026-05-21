'use server';

import { createClient } from '@/shared/api/supabase/server';
import { applyAgGridStateToSupabaseQuery } from '@/shared/api/supabase/utils';

import { AgGridFilter, AgGridColumnState } from '@/entities/view/types';

export async function fetchInvoices(filterModel?: Record<string, AgGridFilter> | null, colState?: AgGridColumnState[]) {
  const supabase = await createClient();
  let query = supabase.from('invoices').select('*');
  
  query = applyAgGridStateToSupabaseQuery(query, filterModel, colState);
  
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}
