import { createClient } from '@/shared/api/supabase/server'
import { redirect } from 'next/navigation'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const params = await searchParams;
  const message = params?.message;

  const signIn = async (formData: FormData) => {
    'use strict';
    'use server';

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/login?message=Could not authenticate user')
    }

    return redirect('/dashboard')
  }

const signUp = async (formData: FormData) => {
    'use strict';
    'use server';

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
    
        emailRedirectTo: `${origin}/login?message=Email confirmed successfully! You can now sign in.`,
      }
    })

    if (error) {
      return redirect('/login?message=Could not sign up user')
    }

    return redirect('/login?message=Check your email to confirm your account')
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto pt-20">
      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <h1 className="text-2xl font-bold mb-4">Sign In / Sign Up</h1>
        
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        
        <button
          formAction={signIn}
          className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
        >
          Sign In
        </button>
        <button
          formAction={signUp}
          className="border border-foreground/20 rounded-md px-4 py-2 text-foreground"
        >
          Sign Up
        </button>
        
        {message && (
          <p className="mt-4 p-4 text-center border border-foreground/20 rounded-md text-foreground">
            {message}
          </p>
        )}
      </form>
    </div>
  )
}
