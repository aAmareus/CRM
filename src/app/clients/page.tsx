"use client"

import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { useAuth } from "@/components/auth/AuthProvider"
import { supabase } from "@/lib/supabase"
import { Edit, Plus, Search, Trash2, User, Mail, Phone, Building } from "lucide-react"
import Link from "next/link"
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

export default function ClientsPage() {
  const { user } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    if (user) {
      fetchClients()
    }
  }, [user])

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setClients(data || [])
    } catch (error) {
      console.error("Error fetching clients:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteClient = async (clientId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este cliente?")) return

    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", clientId)

      if (error) throw error
      fetchClients()
    } catch (error) {
      console.error("Error deleting client:", error)
    }
  }

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = filterStatus === "all" || client.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-2">
            Gestiona tu base de datos de clientes y contactos
          </p>
        </div>
        <Link href="/clients/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Cliente
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="prospect">Prospecto</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{client.name}</h3>
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
              <div className="flex space-x-2">
                <Link href={`/clients/${client.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteClient(client.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{client.email}</span>
              </div>
              {client.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{client.phone}</span>
                </div>
              )}
              {client.company && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Building className="w-4 h-4" />
                  <span>{client.company}</span>
                  {client.position && <span>• {client.position}</span>}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link href={`/clients/${client.id}`}>
                <Button variant="outline" className="w-full">
                  Ver Detalles
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterStatus !== "all" ? "No se encontraron clientes" : "No hay clientes"}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterStatus !== "all" 
              ? "Intenta ajustar los filtros de búsqueda"
              : "Comienza agregando tu primer cliente"
            }
          </p>
          <Link href="/clients/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Cliente
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
