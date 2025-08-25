"use client"

import { useAuth } from "@/components/auth/AuthProvider"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Users, BarChart3, Calendar, Shield, Zap, Target } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  const features = [
    {
      icon: Users,
      title: "Gestión de Clientes",
      description: "Mantén organizada toda la información de tus clientes en un solo lugar.",
    },
    {
      icon: BarChart3,
      title: "Análisis de Ventas",
      description: "Visualiza el rendimiento de tus ventas con gráficos y métricas detalladas.",
    },
    {
      icon: Calendar,
      title: "Tareas y Recordatorios",
      description: "Nunca pierdas de vista las tareas importantes con nuestro sistema de recordatorios.",
    },
    {
      icon: Target,
      title: "Pipeline de Ventas",
      description: "Gestiona tus oportunidades de venta con un pipeline visual e intuitivo.",
    },
    {
      icon: Shield,
      title: "Seguridad Total",
      description: "Tus datos están protegidos con la más alta seguridad y encriptación.",
    },
    {
      icon: Zap,
      title: "Rápido y Eficiente",
      description: "Interfaz moderna y rápida que te permite trabajar de manera más eficiente.",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CRM Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Ingresar</Button>
              </Link>
              <Link href="/register">
                <Button>Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Gestiona tus{" "}
            <span className="text-primary-600">Clientes</span>{" "}
            como un profesional
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            CRM Pro es la solución completa para gestionar tus relaciones con clientes, 
            oportunidades de venta y tareas. Diseñado para equipos que quieren crecer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-4">
                Comenzar Gratis
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Ver Características
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para tu CRM
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Características diseñadas para hacer tu trabajo más eficiente y productivo
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para transformar tu gestión de clientes?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Únete a miles de profesionales que ya confían en CRM Pro
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Crear Cuenta Gratis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold">CRM Pro</span>
            </div>
            <p className="text-gray-400">
              © 2024 CRM Pro. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
