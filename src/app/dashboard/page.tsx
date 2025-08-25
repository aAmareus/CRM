"use client"

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Users, DollarSign, Calendar, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth/AuthProvider"

interface DashboardStats {
  totalClients: number
  totalOpportunities: number
  totalTasks: number
  totalRevenue: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalOpportunities: 0,
    totalTasks: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardStats()
    }
  }, [user])

  const fetchDashboardStats = async () => {
    try {
      const userId = user?.id

      // Fetch clients count
      const { count: clientsCount } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)

      // Fetch opportunities count and revenue
      const { data: opportunities } = await supabase
        .from("opportunities")
        .select("amount")
        .eq("user_id", userId)

      const totalRevenue = opportunities?.reduce((sum, opp) => sum + (opp.amount || 0), 0) || 0

      // Fetch tasks count
      const { count: tasksCount } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)

      setStats({
        totalClients: clientsCount || 0,
        totalOpportunities: opportunities?.length || 0,
        totalTasks: tasksCount || 0,
        totalRevenue,
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Clientes",
      value: stats.totalClients,
      icon: Users,
      color: "bg-blue-500",
      href: "/clients",
    },
    {
      title: "Oportunidades",
      value: stats.totalOpportunities,
      icon: TrendingUp,
      color: "bg-green-500",
      href: "/opportunities",
    },
    {
      title: "Tareas Pendientes",
      value: stats.totalTasks,
      icon: Calendar,
      color: "bg-yellow-500",
      href: "/tasks",
    },
    {
      title: "Ingresos Totales",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-purple-500",
      href: "/opportunities",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Bienvenido de vuelta. Aquí tienes un resumen de tu actividad.
          </p>
        </div>
        <div className="flex space-x-4">
          <Link href="/clients/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Cliente
            </Button>
          </Link>
          <Link href="/opportunities/new">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Oportunidad
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link key={index} href={stat.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Clientes Recientes</h3>
          <div className="space-y-4">
            {/* This would be populated with actual recent clients */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Juan Pérez</p>
                <p className="text-sm text-gray-600">juan@empresa.com</p>
              </div>
              <span className="text-xs text-gray-500">Hace 2 días</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">María García</p>
                <p className="text-sm text-gray-600">maria@empresa.com</p>
              </div>
              <span className="text-xs text-gray-500">Hace 5 días</span>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/clients">
              <Button variant="outline" className="w-full">
                Ver Todos los Clientes
              </Button>
            </Link>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tareas Pendientes</h3>
          <div className="space-y-4">
            {/* This would be populated with actual pending tasks */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Llamar a cliente</p>
                <p className="text-sm text-gray-600">Seguimiento de propuesta</p>
              </div>
              <span className="text-xs text-red-500">Hoy</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Enviar cotización</p>
                <p className="text-sm text-gray-600">Proyecto web</p>
              </div>
              <span className="text-xs text-yellow-500">Mañana</span>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/tasks">
              <Button variant="outline" className="w-full">
                Ver Todas las Tareas
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
