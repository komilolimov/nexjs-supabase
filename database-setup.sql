-- Create the orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(100),
    order_date DATE NOT NULL,
    shipping_address TEXT,
    items_count INTEGER NOT NULL,
    subtotal NUMERIC(10, 2),
    shipping_cost NUMERIC(10, 2),
    discount NUMERIC(5, 2),
    total NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    tracking_number VARCHAR(100),
    estimated_delivery DATE
);

-- Create the invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id VARCHAR(50) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255),
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    amount NUMERIC(10, 2),
    tax NUMERIC(5, 2),
    total NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50),
    notes TEXT
);

-- Create the grid_views table
CREATE TABLE IF NOT EXISTS public.grid_views (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    view_name VARCHAR(100) NOT NULL,
    grid_state JSONB NOT NULL,
    is_default BOOLEAN DEFAULT false
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.grid_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Policies for grid_views: Users can only see and manage their own views
CREATE POLICY "Users can view their own grid views"
    ON public.grid_views FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own grid views"
    ON public.grid_views FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own grid views"
    ON public.grid_views FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own grid views"
    ON public.grid_views FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for invoices & orders: For this demo, all authenticated users can read all invoices and orders.
CREATE POLICY "Authenticated users can read orders"
    ON public.orders FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read invoices"
    ON public.invoices FOR SELECT
    USING (auth.role() = 'authenticated');
