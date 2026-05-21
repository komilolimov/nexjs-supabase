import { fetchOrders } from '@/widgets/orders-table/api/actions';
import { OrdersTableWidget } from '@/widgets/orders-table/ui/orders-table';

export default async function OrdersPage() {
  const initialData = await fetchOrders();

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-100px)]">
      <h1 className="text-2xl font-bold uppercase tracking-wider border-b border-foreground/20 pb-2">Orders</h1>
      <OrdersTableWidget initialRowData={initialData} />
    </div>
  );
}
