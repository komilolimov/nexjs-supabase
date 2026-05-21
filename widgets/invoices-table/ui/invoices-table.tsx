'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AGGridTable } from '@/shared/ui/ag-grid';
import { ViewManager } from '@/features/view-manager/ui';
import { fetchInvoices } from '../api/actions';
import { AgGridFilter, AgGridColumnState, AgGridState, GridView } from '@/entities/view/types';
import { AgGridReact } from 'ag-grid-react';

const DEFAULT_COLUMNS = [
  { field: 'invoice_id', colId: 'invoice_id', headerName: 'Invoice ID' },
  { field: 'customer_name', colId: 'customer_name', headerName: 'Customer Name' },
  { field: 'customer_email', colId: 'customer_email', headerName: 'Customer Email', hide: true },
  { field: 'invoice_date', colId: 'invoice_date', headerName: 'Invoice Date' },
  { field: 'due_date', colId: 'due_date', headerName: 'Due Date' },
  { field: 'amount', colId: 'amount', headerName: 'Amount', hide: true },
  { field: 'tax', colId: 'tax', headerName: 'Tax (%)', hide: true },
  { field: 'total', colId: 'total', headerName: 'Total' },
  { field: 'status', colId: 'status', headerName: 'Status' },
  { field: 'payment_method', colId: 'payment_method', headerName: 'Payment Method', hide: true },
  { field: 'notes', colId: 'notes', headerName: 'Notes', hide: true },
];

export function InvoicesTableWidget({ initialRowData }: { initialRowData?: Record<string, unknown>[] }) {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<Record<string, unknown>[]>(initialRowData || []);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [filterModel, setFilterModel] = useState<Record<string, AgGridFilter> | null>(null);
  const [colState, setColState] = useState<AgGridColumnState[]>([]);
  const [currentView, setCurrentView] = useState<AgGridState | undefined | null>(undefined);

  const isApplyingView = useRef(false);
  const isInitialMount = useRef(true);
  const isFirstDataFetch = useRef(true);

  const loadData = useCallback(async (currentFilter: Record<string, AgGridFilter> | null, currentColState: AgGridColumnState[]) => {
    try {
      const data = await fetchInvoices(currentFilter, currentColState);
      setRowData(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (isFirstDataFetch.current) {
      isFirstDataFetch.current = false;
      return;
    }
    loadData(filterModel, colState);
  }, [filterModel, colState, loadData]);

  const onGridReady = () => {
    setTimeout(() => {
      isInitialMount.current = false;
    }, 200);
  };

  const onApplyView = (view: AgGridState | null) => {
    setCurrentView(view);
    isApplyingView.current = true;

    const cols = view?.colState || [];
    const filters = view?.filterModel || null;

    setFilterModel(filters);
    setColState(cols);

    if (!view) {
      if (gridRef.current?.api) {
        gridRef.current.api.setFilterModel(null);
        gridRef.current.api.resetColumnState();
      }
      setHasUnsavedChanges(false);
      isApplyingView.current = false;
    }
  };

  useEffect(() => {
    if (currentView === undefined || !currentView) return;
    if (!isApplyingView.current) return; 

    const gridApi = gridRef.current?.api;
    if (!gridApi) return;

    const cols = currentView.colState;
    const filters = currentView.filterModel;

    isApplyingView.current = true;

    let innerTimer: NodeJS.Timeout;

    const outerTimer = setTimeout(() => {
      if (gridRef.current?.api) {
        if (cols && cols.length > 0) {
          gridRef.current.api.applyColumnState({
            state: cols as any,
            applyOrder: true,
          });
        }
        if (filters) {
          gridRef.current.api.setFilterModel(filters);
        }
        
        innerTimer = setTimeout(() => {
          setHasUnsavedChanges(false);
          isApplyingView.current = false;
        }, 150);
      }
    }, 50);

    return () => {
      clearTimeout(outerTimer);
      if (innerTimer) clearTimeout(innerTimer);
    };
  }, [currentView, rowData]);

  const onFilterChanged = () => {
    if (isApplyingView.current || isInitialMount.current || !gridRef.current?.api) return;
    setHasUnsavedChanges(true);
    setFilterModel(gridRef.current.api.getFilterModel());
  };

  const onSortChanged = () => {
    if (isApplyingView.current || isInitialMount.current || !gridRef.current?.api) return;
    setHasUnsavedChanges(true);
    setColState(gridRef.current.api.getColumnState() as any);
  };

  const onColumnMoved = () => { if (!isApplyingView.current && !isInitialMount.current) setHasUnsavedChanges(true); };
  const onColumnResized = () => { if (!isApplyingView.current && !isInitialMount.current) setHasUnsavedChanges(true); };
  const onColumnVisible = () => { if (!isApplyingView.current && !isInitialMount.current) setHasUnsavedChanges(true); };

  const getCurrentState = (): AgGridState => {
    if (!gridRef.current?.api) return {};
    return {
      filterModel: gridRef.current.api.getFilterModel() as Record<string, AgGridFilter>,
      colState: gridRef.current.api.getColumnState() as any,
    };
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <ViewManager 
        tableName="invoices"
        onApplyView={onApplyView}
        getCurrentState={getCurrentState}
        hasUnsavedChanges={hasUnsavedChanges}
        onStateSaved={() => setHasUnsavedChanges(false)}
      />
      <div className="flex-1">
        <AGGridTable 
          gridRef={gridRef}
          rowData={rowData} 
          columnDefs={DEFAULT_COLUMNS}
          onGridReady={onGridReady}
          onFilterChanged={onFilterChanged}
          onSortChanged={onSortChanged}
          onColumnMoved={onColumnMoved}
          onColumnResized={onColumnResized}
          onColumnVisible={onColumnVisible}
        />
      </div>
    </div>
  );
}