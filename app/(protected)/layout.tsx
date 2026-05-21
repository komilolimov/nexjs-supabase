import Link from 'next/link';
import { LogoutButton } from '@/features/auth/ui/logout-button';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-foreground/20 p-4 flex gap-6 items-center">
        <div className="font-bold">Next.js + Supabase App</div>
        <nav className="flex gap-4">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/invoices" className="hover:underline">Invoices</Link>
          <Link href="/orders" className="hover:underline">Orders</Link>
        </nav>
        <div className="flex-1" />
        <LogoutButton />
      </header>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
