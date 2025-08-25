"use client"

import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { useAuth } from "@/components/auth/AuthProvider"
import { clientSchema } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { supabase } from "@/lib/supabase"
import { z } from "zod"

type ClientForm = z.infer<typeof clientSchema>

export default function NewClientPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
  })

  const onSubmit = async (data: ClientForm) => {
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("clients")
        .insert({
          ...data,
          user_id: user?.id,
        })

      if (error) throw error

      router.push("/clients")
    } catch (error) {
      console.error("Error creating client:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/clients">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Cliente</h1>
          <p className="text-gray-600 mt-2">
            Agrega un nuevo cliente a tu base de datos
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
            <Link href="/clients">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Guardando..." : "Guardar Cliente"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
