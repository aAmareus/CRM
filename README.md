# CRM Pro - Sistema de Gestión de Clientes

Un sistema CRM moderno y completo construido con Next.js, TypeScript, Tailwind CSS y Supabase.

## 🚀 Características

### ✅ Funcionalidades Implementadas

- **Autenticación Completa**
  - Registro e inicio de sesión con email/contraseña
  - Rutas protegidas
  - Gestión de sesiones de usuario

- **Gestión de Clientes**
  - Crear, leer, actualizar y eliminar clientes
  - Búsqueda y filtrado avanzado
  - Información completa: nombre, email, teléfono, empresa, cargo
  - Estados de cliente (Activo, Inactivo, Prospecto)

- **Dashboard Interactivo**
  - Estadísticas en tiempo real
  - Resumen de actividad
  - Acceso rápido a funciones principales

- **Sistema de Tareas**
  - Crear y gestionar tareas
  - Prioridades (Alta, Media, Baja)
  - Fechas de vencimiento
  - Vinculación con clientes
  - Marcado de completado

- **Interfaz Moderna**
  - Diseño responsivo y limpio
  - Componentes reutilizables
  - Experiencia de usuario optimizada
  - Iconografía consistente

### 🔧 Stack Tecnológico

- **Frontend**: Next.js 14 con TypeScript
- **UI**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Formularios**: React Hook Form + Zod
- **Iconos**: Lucide React
- **Despliegue**: Netlify (recomendado)

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- Una cuenta en [Supabase](https://supabase.com/)

## 🛠️ Instalación

### 1. Clonar el Repositorio

```bash
git clone <tu-repositorio>
cd crm-app
```

### 2. Instalar Dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_here
```

### 4. Configurar Supabase

#### Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Copia la URL y la anon key de tu proyecto

#### Configurar Base de Datos

Ejecuta los siguientes comandos SQL en el SQL Editor de Supabase:

```sql
-- Habilitar RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Crear tabla de perfiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de clientes
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  position TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de interacciones
CREATE TABLE interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  notes TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de oportunidades
CREATE TABLE opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  amount DECIMAL(10,2),
  stage TEXT DEFAULT 'prospecting',
  probability INTEGER DEFAULT 0,
  expected_close_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de tareas
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas RLS para perfiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas RLS para clientes
CREATE POLICY "Users can view own clients" ON clients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients" ON clients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients" ON clients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients" ON clients
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para interacciones
CREATE POLICY "Users can view own interactions" ON interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interactions" ON interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interactions" ON interactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own interactions" ON interactions
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para oportunidades
CREATE POLICY "Users can view own opportunities" ON opportunities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own opportunities" ON opportunities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own opportunities" ON opportunities
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own opportunities" ON opportunities
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para tareas
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 5. Ejecutar el Proyecto

```bash
npm run dev
# o
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🚀 Despliegue

### Desplegar en Netlify

1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno en Netlify:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Configura el comando de build: `npm run build`
4. Configura el directorio de publicación: `.next`

### Desplegar en Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel
3. Vercel detectará automáticamente que es un proyecto Next.js

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── dashboard/         # Páginas del dashboard
│   ├── clients/          # Gestión de clientes
│   ├── tasks/            # Gestión de tareas
│   ├── login/            # Página de login
│   ├── register/         # Página de registro
│   ├── globals.css       # Estilos globales
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página de inicio
├── components/           # Componentes reutilizables
│   ├── auth/            # Componentes de autenticación
│   ├── layout/          # Componentes de layout
│   └── ui/              # Componentes de UI
└── lib/                 # Utilidades y configuración
    ├── supabase.ts      # Cliente de Supabase
    ├── utils.ts         # Utilidades generales
    └── validations.ts   # Esquemas de validación
```

## 🔐 Seguridad

- **Row Level Security (RLS)** habilitado en todas las tablas
- Los usuarios solo pueden acceder a sus propios datos
- Validación de entrada con Zod
- Variables de entorno seguras

## 🎨 Personalización

### Colores

Los colores principales se pueden personalizar en `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        // ... más tonos
        900: '#1e3a8a',
      },
    },
  },
},
```

### Componentes

Los componentes UI están en `src/components/ui/` y pueden ser personalizados según tus necesidades.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación de [Next.js](https://nextjs.org/docs)
2. Revisa la documentación de [Supabase](https://supabase.com/docs)
3. Abre un issue en el repositorio

## 🎯 Próximas Características

- [ ] Gestión de oportunidades de venta
- [ ] Sistema de notificaciones
- [ ] Reportes y analytics
- [ ] Integración con calendario
- [ ] Exportación de datos
- [ ] Múltiples usuarios por organización
- [ ] API REST para integraciones

---

¡Gracias por usar CRM Pro! 🚀
