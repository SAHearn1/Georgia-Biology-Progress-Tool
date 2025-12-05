"use client"

import { signOut } from "next-auth/react"

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded hover:bg-blue-800 transition-colors"
    >
      Sign Out
    </button>
  )
}
