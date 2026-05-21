export interface AgGridFilter {
  filterType: string;
  type?: string;
  filter?: string | number | boolean;
  [key: string]: unknown;
}

export interface AgGridColumnState {
  colId: string;
  width?: number | null;
  hide?: boolean;
  pinned?: string | null;
  sort?: 'asc' | 'desc' | null;
  sortIndex?: number | null;
  aggFunc?: string | null;
  rowGroup?: boolean;
  rowGroupIndex?: number | null;
  pivot?: boolean;
  pivotIndex?: number | null;
  flex?: number | null;
}

export interface AgGridState {
  colState?: AgGridColumnState[];
  filterModel?: Record<string, AgGridFilter>;
}

export interface GridView {
  id: string;
  view_name: string;
  table_name: string;
  grid_state: AgGridState;
  created_at: string;
  user_id: string;
}

export interface CreateViewPayload {
  view_name: string;
  table_name: string;
  grid_state: AgGridState;
}

export interface UpdateViewPayload {
  view_name?: string;
  grid_state?: AgGridState;
}
