# MensajeríaPro - Plataforma de Mensajería Masiva

Aplicación profesional para gestionar campañas de WhatsApp y SMS con programación, segmentación y reportes detallados.

## Características

### 🚀 Landing Page
- Diseño elegante y profesional
- Información clara de características
- Call-to-actions estratégicos

### 🔐 Autenticación
- Sistema de login seguro
- Arquitectura clean code con separación de features

### 📤 Panel de Envío
- **Envío Manual**: Envía mensajes instantáneos a destinatarios específicos o todos
- **Envío Programado**: Programa mensajes para fechas y horas específicas
- **Carga Masiva**: Importa contactos desde CSV, JSON o Excel

### 📊 Sistema de Registro
- Historial completo de mensajes enviados y programados
- Filtros avanzados: estado, canal, fecha, búsqueda
- Paginación inteligente
- Estados: Enviado, Pendiente, Programado, Fallido

### 💾 Exportación de Datos
- Exporta a CSV, JSON o Excel
- Descarga instantánea de reportes
- Datos filtrados según selección

## Arquitectura

```
features/
├── auth/              # Autenticación
│   └── components/
├── dashboard/         # Layout principal
│   └── components/
├── messaging/         # Envío de mensajes
│   ├── components/
│   ├── types/
│   └── utils/
└── history/          # Historial y registro
    ├── components/
    ├── hooks/
    ├── types/
    └── utils/
```

## Tecnologías

- **Framework**: Next.js 16 (App Router)
- **Diseño**: Tailwind CSS v4 + shadcn/ui
- **TypeScript**: Tipado completo
- **Componentes**: Separación por features

## Páginas

- `/` - Landing page
- `/login` - Autenticación
- `/dashboard` - Panel de envío de mensajes
- `/dashboard/history` - Historial y registro
- `/dashboard/profile` - Perfil de usuario

## Clean Code

Cada feature está organizada en su propia carpeta con:
- `components/` - Componentes React
- `types/` - Definiciones TypeScript
- `utils/` - Funciones auxiliares
- `hooks/` - Custom hooks

## Instalación

```bash
npm install
npm run dev
```

Visita `http://localhost:3000` para ver la aplicación.
