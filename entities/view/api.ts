'use server';

import { createClient } from '@/shared/api/supabase/server';
import { CreateViewPayload, GridView, UpdateViewPayload } from './types';

export async function getViews(tableName: string): Promise<GridView[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('grid_views')
    .select('*')
    .eq('table_name', tableName)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as GridView[];
}

export async function createView(payload: CreateViewPayload): Promise<GridView> {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    console.error('Auth Error in createView:', userError);
    throw new Error('Unauthorized - User not found in session.');
  }

  const { data, error } = await supabase
    .from('grid_views')
    .insert([
      {
        view_name: payload.view_name,
        table_name: payload.table_name,
        grid_state: payload.grid_state,
        user_id: userData.user.id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Supabase Insert Error in createView:', error);
    throw new Error(error.message);
  }
  return data as GridView;
}

export async function updateView(id: string, payload: UpdateViewPayload): Promise<GridView> {
  const supabase = await createClient();
  
  const updateData: Partial<GridView> = {};
  if (payload.view_name !== undefined) updateData.view_name = payload.view_name;
  if (payload.grid_state !== undefined) updateData.grid_state = payload.grid_state;

  const { data, error } = await supabase
    .from('grid_views')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Supabase Update Error in updateView:', error);
    throw new Error(error.message);
  }
  return data as GridView;
}

export async function deleteView(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from('grid_views').delete().eq('id', id);

  if (error) throw new Error(error.message);
  return true;
}
