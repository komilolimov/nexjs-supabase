'use client';

import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// Register AG Grid Modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface AGGridTableProps {
  rowData: any[];
  columnDefs: any[];
  onFilterChanged?: (event: any) => void;
  onSortChanged?: (event: any) => void;
  gridRef?: React.RefObject<AgGridReact<any> | null>;
}

export function AGGridTable({
  gridRef,
  ...props
}: any) {
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      filter: true,
      sortable: true,
      resizable: true,
    };
  }, []);

  return (
    <div className="w-full h-[600px] border border-foreground/20">
      <AgGridReact
        ref={gridRef as any}
        defaultColDef={defaultColDef}
        {...props}
      />
    </div>
  );
}
