"use client"

import { signIn } from "next-auth/react"

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn("google")}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Sign in with Google
    </button>
  )
}

