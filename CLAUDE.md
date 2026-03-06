# VIMEX VACATION RENTALS — Frontend Master Prompt

## CONTEXTO DEL PROYECTO
Sitio de reservas de rentas vacacionales estilo Airbnb para destinos costeros en México.
El frontend está construido con datos mock y estamos iniciando la integración con el backend
Django REST Framework de manera paralela.

## STACK
- Next.js 14 (App Router), TypeScript strict mode
- Tailwind CSS (sin component libraries adicionales)
- React Context para estado global (ya implementado — no instalar Zustand ni ningún otro state manager)
- React Query (TanStack Query) para server state y fetching
- Leaflet para mapas (ya instalado)
- Zod para validación de formularios y schemas

## ESTRUCTURA DE CARPETAS
- La estructura de carpetas ya está definida y es la fuente de verdad
- Antes de crear cualquier archivo, identificar dónde encaja dentro de la estructura existente
- Si un archivo nuevo no tiene carpeta obvia, preguntar antes de crear una nueva
- Refactorización de carpetas solo si hay razón técnica sólida y previa confirmación
- Si se detecta que un archivo está en el lugar incorrecto, señalarlo antes de moverlo

## FILOSOFÍA DE CÓDIGO
- Zero deuda técnica: si algo está hackeado, proponer refactor antes de continuar
- Semántica HTML correcta: article, section, nav, main, aside, figure, time, address según corresponda
- Accesibilidad: aria-labels, roles, foco visible, contraste WCAG AA mínimo
- Componentes atómicos: cada componente hace una sola cosa
- Nombrado explícito: nada de `data`, `item`, `handleClick` genérico
- No duplicar lógica: si algo se repite dos veces, abstraer

## DISEÑO — NIVEL AWWWARDS
- Microinteracciones en hover, focus y transiciones de página
- Tipografía con escala modular consistente, no tamaños arbitrarios
- Spacing system basado en múltiplos de 4px via Tailwind
- Imágenes con aspect-ratio fijo, lazy loading y blur placeholder siempre
- Animaciones con Framer Motion solo donde agreguen valor perceptible al usuario
- Dark mode preparado desde el inicio con CSS variables
- Mobile first: cada componente funciona perfecto en 320px antes de escalar
- Skeleton loaders en lugar de spinners para contenido que tarda en cargar

## SEGURIDAD
### Variables de entorno
- Ninguna clave privada, secret, token o credencial se escribe jamás en el código
- Las claves privadas van ÚNICAMENTE en .env.local y nunca se exponen al cliente
- Solo las variables con prefijo NEXT_PUBLIC_ se exponen al navegador —
  revisar que ninguna clave sensible tenga ese prefijo
- El archivo .env.local debe estar en .gitignore — verificarlo antes de cualquier commit
- Siempre proveer un .env.example con los nombres de las variables pero sin valores reales
- Si se detecta una clave hardcodeada en el código existente, señalarlo como prioridad crítica
  antes de continuar con cualquier otra tarea

### Formularios y validación
- Toda entrada del usuario se valida con Zod antes de procesarse o enviarse
- Validación tanto en cliente (UX) como asumiendo que el backend también valida (nunca confiar solo en el frontend)
- Sanitizar cualquier campo que pueda renderizarse como HTML
- Prohibido usar dangerouslySetInnerHTML — si hay un caso necesario, consultar primero
- Los campos de búsqueda y texto libre deben tener longitud máxima definida
- Nunca concatenar input del usuario en queries, URLs o templates directamente

### Autenticación y sesiones
- Los tokens JWT o de sesión se almacenan en httpOnly cookies, nunca en localStorage ni sessionStorage
- Nunca loggear tokens, passwords ni datos sensibles del usuario en consola
- Implementar expiración y renovación de tokens desde el inicio, no como afterthought
- Las rutas protegidas usan middleware de Next.js, no solo condicionales en el componente
- Después de logout, limpiar completamente el estado de la sesión y redirigir

### Peticiones HTTP
- Todas las peticiones al backend usan HTTPS en producción — verificar que la base URL no permita HTTP
- Incluir headers de seguridad en cada request que lo requiera (Authorization, Content-Type)
- No exponer detalles de errores del servidor al usuario final — mostrar mensajes genéricos
- Implementar timeout en todas las peticiones para evitar hanging requests
- Validar y sanitizar los datos recibidos de la API antes de renderizarlos,
  no asumir que el backend siempre responde con el formato esperado

### Dependencias
- No instalar dependencias sin revisar su estado en npm (descargas, mantenimiento, vulnerabilidades)
- Después de instalar cualquier dependencia ejecutar: npm audit
- Preferir dependencias con bajo número de sub-dependencias

### Next.js específico
- Configurar Content Security Policy (CSP) en next.config.js desde el inicio
- Configurar headers de seguridad: X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy, Permissions-Policy
- Las API Routes de Next.js validan el método HTTP antes de procesar cualquier request
- Los Server Components no exponen lógica sensible que deba ser privada

## INTEGRACIÓN CON API
- Todos los fetches van a través de custom hooks, nunca directamente en un componente
- Variable de entorno: NEXT_PUBLIC_API_URL como base URL
- Tipado end-to-end: los tipos TypeScript deben coincidir con los schemas del backend
- Manejo de los cuatro estados siempre: loading / error / empty / success
- Optimistic UI donde tenga sentido (favoritos, filtros de amenidades)
- Mientras un endpoint no esté listo, usar el mock existente con feature flag:
  const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'
- Los mocks existentes no se eliminan hasta que el endpoint equivalente esté funcional y probado

## MAPA
- El mapa filtra propiedades al cambiar bounds (evento moveend)
- Los markers son custom SVG, no los default de Leaflet
- Clustering con leaflet.markercluster cuando hay más de 10 propiedades visibles
- No re-renderizar el mapa completo al filtrar, solo actualizar los markers
- El estado del bbox del mapa vive en URL como query param para que sea compartible

## FILTROS
- El estado de todos los filtros vive en la URL (searchParams) para que sean compartibles y persistentes
- Debounce de 300ms en el price range para no spamear la API
- Filtros de amenidades con toggle optimista
- El contador de filtros activos siempre visible en el botón de filtros
- Al limpiar filtros, la URL queda limpia sin params residuales

## TYPESCRIPT
- Strict mode activado, sin excepciones
- Prohibido usar any — si hay un caso extremo, usar unknown y narrowing explícito
- Todos los props de componentes tipados con interface, no inline
- Los tipos de respuesta de API viven en un archivo de types compartido, no inline en el hook

## LO QUE NO SE DEBE HACER
- No instalar dependencias sin preguntar primero, sin excepciones
- No usar any en TypeScript
- No dejar console.log en el código
- No crear componentes de más de 150 líneas sin fragmentar
- No hardcodear strings visibles al usuario, usar constants
- No hacer fetch directamente en un componente
- No crear un nuevo Context sin revisar si uno existente puede extenderse
- No escribir claves, tokens ni secrets en ningún archivo que no sea .env.local
- No usar dangerouslySetInnerHTML
- No almacenar información sensible en localStorage o sessionStorage

## REGLAS DE OPERACIÓN EN TERMINAL
- Al iniciar cada sesión, leer el CLAUDE.md y hacer un resumen del estado actual
  del proyecto antes de cualquier acción
- Nunca modificar más de 3 archivos por turno sin confirmación previa
- Si un cambio tiene efecto cascada en otros archivos, mapear todos los afectados
  antes de tocar cualquiera
- Preguntar antes de instalar cualquier dependencia, sin excepciones
- Si hay ambigüedad en un requerimiento, preguntar — nunca asumir
- Si se detecta deuda técnica durante el trabajo, señalarla aunque no sea parte del task actual
- Si se detecta cualquier vulnerabilidad de seguridad durante el trabajo,
  reportarla como prioridad antes de continuar

## FLUJO DE TRABAJO POR FEATURE
1. Antes de empezar: listar los archivos que se van a crear o modificar
2. Si hay refactor necesario previo, hacerlo primero en un paso separado
3. Al terminar: indicar qué endpoints necesita este feature para comunicarlo al equipo de backend
4. Al terminar: confirmar que los cuatro estados (loading/error/empty/success) están cubiertos
5. Al terminar: confirmar que el componente es responsive desde 320px
6. Al terminar: confirmar que no hay datos sensibles expuestos ni claves en el código