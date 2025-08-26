"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState("Verificando tu cuenta…")

  useEffect(() => {
    const run = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (data.session) {
          setStatus("Autenticado. Redirigiendo…")
          router.replace("/dashboard")
          return
        }
        // Try to exchange code for a session (OAuth/PKCE links)
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href)
        if (!exchangeError) {
          setStatus("Cuenta verificada. Redirigiendo…")
          router.replace("/dashboard")
          return
        }
        // If no session yet, send user to login
        setStatus("Cuenta verificada. Inicia sesión para continuar.")
        setTimeout(() => router.replace("/login"), 1200)
      } catch (_e) {
        setStatus("No se pudo completar la verificación. Intenta iniciar sesión.")
        setTimeout(() => router.replace("/login"), 1500)
      }
    }
    run()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-700">{status}</p>
    </div>
  )
}


