"use client"

import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { useAuth } from "@/components/auth/AuthProvider"
import { clientSchema } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { supabase } from "@/lib/supabase"
import { z } from "zod"

type ClientForm = z.infer<typeof clientSchema>

export default function EditClientPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const clientId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
  })

  useEffect(() => {
    if (user && clientId) {
      fetchClient()
    }
  }, [user, clientId])

  const fetchClient = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .eq("user_id", user?.id)
        .single()

      if (error) throw error

      reset({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        company: data.company || "",
        position: data.position || "",
        status: data.status,
      })
    } catch (error) {
      console.error("Error fetching client:", error)
      router.push("/clients")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ClientForm) => {
    setSaving(true)

    try {
      const { error } = await supabase
        .from("clients")
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          company: data.company || null,
          position: data.position || null,
          status: data.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", clientId)
        .eq("user_id", user?.id)

      if (error) throw error

      router.push(`/clients/${clientId}`)
    } catch (error) {
      console.error("Error updating client:", error)
    } finally {
      setSaving(false)
    }
  }

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
      <div className="flex items-center space-x-4">
        <Link href={`/clients/${clientId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Cliente</h1>
          <p className="text-gray-600 mt-2">
            Actualiza la información del cliente
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Nombre *"
                placeholder="Nombre completo del cliente"
                error={errors.name?.message}
                {...register("name")}
              />
            </div>
            <div>
              <Input
                label="Email *"
                type="email"
                placeholder="email@ejemplo.com"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>
            <div>
              <Input
                label="Teléfono"
                placeholder="+1 (555) 123-4567"
                error={errors.phone?.message}
                {...register("phone")}
              />
            </div>
            <div>
              <Input
                label="Empresa"
                placeholder="Nombre de la empresa"
                error={errors.company?.message}
                {...register("company")}
              />
            </div>
            <div>
              <Input
                label="Cargo"
                placeholder="Director, Gerente, etc."
                error={errors.position?.message}
                {...register("position")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado *
              </label>
              <select
                {...register("status")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="prospect">Prospecto</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link href={`/clients/${clientId}`}>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
