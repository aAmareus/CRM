"use client"

import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { useAuth } from "@/components/auth/AuthProvider"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Edit, Mail, Phone, Building, Calendar, DollarSign, Plus } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Client {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  position: string | null
  status: string
  created_at: string
}

interface Interaction {
  id: string
  type: string
  notes: string | null
  date: string
  created_at: string
}

interface Opportunity {
  id: string
  title: string
  amount: number | null
  stage: string
  probability: number
  expected_close_date: string | null
  created_at: string
}

export default function ClientDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const clientId = params.id as string

  const [client, setClient] = useState<Client | null>(null)
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && clientId) {
      fetchClientData()
    }
  }, [user, clientId])

  const fetchClientData = async () => {
    try {
      // Fetch client
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .eq("user_id", user?.id)
        .single()

      if (clientError) throw clientError
      setClient(clientData)

      // Fetch interactions
      const { data: interactionsData, error: interactionsError } = await supabase
        .from("interactions")
        .select("*")
        .eq("client_id", clientId)
        .eq("user_id", user?.id)
        .order("date", { ascending: false })

      if (interactionsError) throw interactionsError
      setInteractions(interactionsData || [])

      // Fetch opportunities
      const { data: opportunitiesData, error: opportunitiesError } = await supabase
        .from("opportunities")
        .select("*")
        .eq("client_id", clientId)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (opportunitiesError) throw opportunitiesError
      setOpportunities(opportunitiesData || [])
    } catch (error) {
      console.error("Error fetching client data:", error)
      router.push("/clients")
    } finally {
      setLoading(false)
    }
  }

  const deleteClient = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar este cliente?")) return

    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", clientId)

      if (error) throw error
      router.push("/clients")
    } catch (error) {
      console.error("Error deleting client:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Cliente no encontrado</h2>
        <Link href="/clients">
          <Button>Volver a Clientes</Button>
        </Link>
      </div>
    )
  }

  const totalOpportunities = opportunities.length
  const totalValue = opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0)
  const activeOpportunities = opportunities.filter(opp => opp.stage !== "closed" && opp.stage !== "lost").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/clients">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-gray-600 mt-2">
              Cliente desde {new Date(client.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link href={`/clients/${client.id}/edit`}>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Button variant="danger" onClick={deleteClient}>
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Info */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-primary-600">
                  {client.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{client.name}</h2>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  client.status === "active" ? "bg-green-100 text-green-800" :
                  client.status === "inactive" ? "bg-red-100 text-red-800" :
                  "bg-yellow-100 text-yellow-800"
                }`}>
                  {client.status === "active" ? "Activo" :
                   client.status === "inactive" ? "Inactivo" : "Prospecto"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{client.email}</span>
              </div>
              {client.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{client.phone}</span>
                </div>
              )}
              {client.company && (
                <div className="flex items-center space-x-3">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">
                    {client.company}
                    {client.position && <span className="text-gray-500"> • {client.position}</span>}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Oportunidades</span>
                <span className="font-semibold">{totalOpportunities}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Valor Total</span>
                <span className="font-semibold">${totalValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Activas</span>
                <span className="font-semibold">{activeOpportunities}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Opportunities */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Oportunidades</h3>
              <Link href={`/opportunities/new?clientId=${client.id}`}>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Oportunidad
                </Button>
              </Link>
            </div>
            
            {opportunities.length > 0 ? (
              <div className="space-y-3">
                {opportunities.map((opportunity) => (
                  <div key={opportunity.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{opportunity.title}</h4>
                      <p className="text-sm text-gray-600">
                        {opportunity.stage} • {opportunity.probability}% de probabilidad
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${opportunity.amount?.toLocaleString() || "0"}
                      </p>
                      {opportunity.expected_close_date && (
                        <p className="text-sm text-gray-600">
                          {new Date(opportunity.expected_close_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No hay oportunidades registradas</p>
                <Link href={`/opportunities/new?clientId=${client.id}`}>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primera Oportunidad
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Recent Interactions */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Interacciones Recientes</h3>
              <Link href={`/interactions/new?clientId=${client.id}`}>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Interacción
                </Button>
              </Link>
            </div>
            
            {interactions.length > 0 ? (
              <div className="space-y-3">
                {interactions.slice(0, 5).map((interaction) => (
                  <div key={interaction.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{interaction.type}</h4>
                      {interaction.notes && (
                        <p className="text-sm text-gray-600 mt-1">{interaction.notes}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(interaction.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No hay interacciones registradas</p>
                <Link href={`/interactions/new?clientId=${client.id}`}>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Registrar Primera Interacción
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
