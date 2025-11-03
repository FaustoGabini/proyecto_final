"use client"

import { Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth authentication
    console.log("[v0] Google login clicked")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 space-y-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary">
              <Brain className="h-10 w-10 text-primary-foreground" />
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Bienvenido</h1>
              <p className="text-muted-foreground">Inicia sesión en tu cuenta de InmobIA</p>
            </div>
          </div>

          {/* Google Sign In Button */}
          <div className="space-y-4">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full h-12 text-base font-medium gap-3 hover:bg-accent bg-transparent"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              ¿No tienes cuenta?{" "}
              <Link href="/registro" className="text-primary font-medium hover:underline">
                Regístrarse
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
