import { fetchInvoices } from '@/widgets/invoices-table/api/actions';
import { InvoicesTableWidget } from '@/widgets/invoices-table/ui/invoices-table';

export default async function InvoicesPage() {
  const initialData = await fetchInvoices();

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-100px)]">
      <h1 className="text-2xl font-bold uppercase tracking-wider border-b border-foreground/20 pb-2">Invoices</h1>
      <InvoicesTableWidget initialRowData={initialData} />
    </div>
  );
}
