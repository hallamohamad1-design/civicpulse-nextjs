'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Navbar() {
  const router = useRouter()
  
  // Safe Supabase initialization
  const [supabase] = useState(() => {
    try {
      return createClient()
    } catch (e) {
      console.warn("Supabase client failed to initialize:", e)
      return null
    }
  })
  
  const [user, setUser] = useState<{ user_metadata: { avatar_url?: string; full_name?: string }; id: string } | null>(null)

  useEffect(() => {
    if (!supabase) return;
    
    const authClient = supabase.auth
    const { data: { subscription } } = authClient.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })
    
    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogin = async () => {
    if (!supabase) {
      alert("Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.")
      return
    }
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`
      }
    })
  }

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          onClick={() => router.push('/')} 
          className="font-bold text-xl cursor-pointer text-blue-600 flex items-center gap-2"
        >
          📍 CivicPulse
        </div>
        
        <div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.user_metadata.avatar_url} />
                  <AvatarFallback>{user.user_metadata.full_name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push(`/profile/${user.id}`)}>
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Button onClick={handleLogin}>Continue with Google</Button>
          )}
        </div>
      </div>
    </header>
  )
}
