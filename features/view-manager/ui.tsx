'use client';

import React, { useEffect, useState } from 'react';
import { GridView, AgGridState } from '@/entities/view/types';
import { getViews, createView, updateView, deleteView } from '@/entities/view/api';

import { useRouter } from 'next/navigation';

interface ViewManagerProps {
  tableName: string;
  onApplyView: (state: AgGridState | null) => void;
  getCurrentState: () => AgGridState;
  hasUnsavedChanges: boolean;
  onStateSaved: () => void;
}

export function ViewManager({ tableName, onApplyView, getCurrentState, hasUnsavedChanges, onStateSaved }: ViewManagerProps) {
  const router = useRouter();
  const [views, setViews] = useState<GridView[]>([]);
  const [selectedViewId, setSelectedViewId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newViewName, setNewViewName] = useState('');

  useEffect(() => {
    loadViews();
  }, [tableName]);

  async function loadViews() {
    try {
      const data = await getViews(tableName);
      setViews(data);
    } catch (e: unknown) {
      console.error('Failed to load views:', e);
    }
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    setSelectedViewId(val || null);
    if (val) {
      const view = views.find(v => v.id === val);
      if (view) onApplyView(view.grid_state);
    } else {
      onApplyView(null);
    }
  }

  async function handleUpdate() {
    if (!selectedViewId) return;
    const state = getCurrentState();
    
    const payload = { grid_state: state };
    
    try {
      await updateView(selectedViewId, payload);
      
      setViews(prev => prev.map(v => 
        v.id === selectedViewId ? { ...v, grid_state: state } : v
      ));

      onStateSaved();
      router.refresh();
    } catch (e: unknown) {
      console.error('Update View Error:', e);
      alert(`Failed to update view: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  async function handleSaveAsNew() {
    const state = getCurrentState();
    
    const payload = {
      view_name: newViewName,
      table_name: tableName,
      grid_state: state,
    };

    try {
      const newView = await createView(payload);
      setViews(prev => [newView, ...prev]);
      setSelectedViewId(newView.id);
      setIsModalOpen(false);
      setNewViewName('');
      onStateSaved();
      router.refresh();
    } catch (e: unknown) {
      console.error('Save As New Error:', e);
      alert(`Failed to save as new view: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  async function handleDelete() {
    if (!selectedViewId) return;

    try {
      await deleteView(selectedViewId);
      setViews(prev => prev.filter(v => v.id !== selectedViewId));
      setSelectedViewId(null);
      onApplyView(null);
      onStateSaved();
      router.refresh();
    } catch (e: unknown) {
      console.error('Delete View Error:', e);
      alert(`Failed to delete view: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  function handleReset() {
    setSelectedViewId(null);
    onApplyView(null);
    onStateSaved();
  }

  return (
    <div className="flex flex-wrap items-center gap-4 border border-foreground/20 p-4 mb-4">
      <div className="font-bold border-r border-foreground/20 pr-4">View:</div>
      
      <select 
        className="border border-foreground/20 px-4 py-2 appearance-none bg-transparent hover:underline cursor-pointer"
        value={selectedViewId || ''}
        onChange={handleSelectChange}
      >
        <option value="">Default View</option>
        {views.map(view => (
          <option key={view.id} value={view.id}>{view.view_name}</option>
        ))}
      </select>

      {hasUnsavedChanges && <span className="text-sm font-bold animate-pulse px-2">* Unsaved changes</span>}

      <div className="flex-1"></div>

      {selectedViewId && (
        <button onClick={handleUpdate} className="border border-foreground/20 px-4 py-2 text-foreground hover:underline">
          Save
        </button>
      )}

      <button onClick={() => setIsModalOpen(true)} className="border border-foreground/20 px-4 py-2 text-foreground hover:underline">
        Save As New
      </button>

      {selectedViewId && (
        <button onClick={handleDelete} className="border border-red-500/50 text-red-500 px-4 py-2 hover:underline">
          Delete
        </button>
      )}

      <button onClick={handleReset} className="border border-foreground/20 px-4 py-2 text-foreground hover:underline">
        Reset
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="border-2 border-foreground p-8 flex flex-col gap-6 bg-background max-w-md w-full">
            <h2 className="text-2xl font-bold uppercase tracking-wider border-b border-foreground/20 pb-2">Save As New View</h2>
            <input 
              className="border border-foreground/20 px-4 py-3 bg-transparent text-lg focus:outline-none focus:border-foreground/50"
              placeholder="View Name"
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
            />
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setIsModalOpen(false)} className="border border-foreground/20 text-foreground px-6 py-2 hover:underline">
                Cancel
              </button>
              <button onClick={handleSaveAsNew} className="border border-foreground/20 text-foreground px-6 py-2 font-bold hover:underline">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
