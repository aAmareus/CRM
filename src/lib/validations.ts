import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
})

export const clientSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  status: z.string().default("active"),
})

export const interactionSchema = z.object({
  type: z.string().min(1, "El tipo es requerido"),
  notes: z.string().optional(),
  date: z.string().min(1, "La fecha es requerida"),
})

export const opportunitySchema = z.object({
  title: z.string().min(2, "El título debe tener al menos 2 caracteres"),
  amount: z.number().optional(),
  stage: z.string().min(1, "La etapa es requerida"),
  probability: z.number().min(0).max(100),
  expectedCloseDate: z.string().optional(),
  notes: z.string().optional(),
})

export const taskSchema = z.object({
  title: z.string().min(2, "El título debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.string().default("medium"),
  completed: z.boolean().default(false),
  // Optional relation to a client selected from a dropdown
  clientId: z.string().optional(),
})
