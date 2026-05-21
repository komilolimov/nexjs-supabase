import { createClient } from '@/shared/api/supabase/server';
import { redirect } from 'next/navigation';

export async function LogoutButton() {
  const signOut = async () => {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
  };

  return (
    <form action={signOut}>
      <button className="border border-foreground/20 rounded-md px-4 py-2 text-foreground">
        Logout
      </button>
    </form>
  );
}
