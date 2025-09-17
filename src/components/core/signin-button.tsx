"use client"
import { signIn } from "next-auth/react"

export function signinButton() {
    return <button onClick={() => signIn()}>Sign In</button>
}