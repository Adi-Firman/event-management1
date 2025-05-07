'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export default function AuthButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <span>{session.user?.name}</span>
        <button onClick={() => signOut()} className="text-blue-600">
          Logout
        </button>
      </div>
    )
  }

  return (
    <button onClick={() => signIn('google')} className="text-blue-600">
      Login dengan Google
    </button>
  )
}
