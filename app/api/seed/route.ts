import { createClient } from '@/shared/api/supabase/server';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const supabase = await createClient();
  
  try {
    const ordersPath = path.join(process.cwd(), 'orders.json');
    const invoicesPath = path.join(process.cwd(), 'invoices.json');
    
    let ordersData = [];
    let invoicesData = [];

    if (fs.existsSync(ordersPath)) {
      ordersData = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
    } else {
      return NextResponse.json({ success: false, error: 'orders.json not found' }, { status: 404 });
    }

    if (fs.existsSync(invoicesPath)) {
      invoicesData = JSON.parse(fs.readFileSync(invoicesPath, 'utf8'));
    } else {
      return NextResponse.json({ success: false, error: 'invoices.json not found' }, { status: 404 });
    }
    
    // Insert orders
    const { error: ordersError } = await supabase.from('orders').insert(ordersData);
    if (ordersError) throw ordersError;
    
    // Insert invoices
    const { error: invoicesError } = await supabase.from('invoices').insert(invoicesData);
    if (invoicesError) throw invoicesError;
    
    return NextResponse.json({ success: true, message: 'Data seeded successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
