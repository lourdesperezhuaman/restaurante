# Sistema de Pedidos para Restaurante

Sistema web de gestión de pedidos para restaurantes desarrollado con Angular 18 y Firebase. Permite a meseros tomar pedidos en tiempo real y a administradores gestionar el menú del establecimiento.

## Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Demo y Repositorio](#demo-y-repositorio)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Manual de Usuario](#manual-de-usuario)
- [Despliegue](#despliegue)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## Descripción del Proyecto

Aplicación web moderna que digitaliza el proceso de toma de pedidos en restaurantes. Los meseros pueden crear pedidos por mesa, seleccionar platos del menú disponible y hacer seguimiento del estado de cada pedido. Los administradores tienen control total sobre el menú, pueden gestionar la disponibilidad de platos y supervisar todos los pedidos en tiempo real.

### Características Principales

- Sistema de autenticación con roles diferenciados (Mesero/Administrador)
- Diseño responsive adaptable a dispositivos móviles, tablets y escritorio
- Gestión completa de platos (CRUD con categorías)
- Gestión de pedidos por mesa con estados en tiempo real
- Filtros avanzados para búsqueda de pedidos y platos
- Cálculo automático de totales y subtotales
- Interfaz moderna con efecto glassmorphism y animaciones CSS
- Actualizaciones en tiempo real mediante Firestore
- Índices optimizados en Firestore para consultas eficientes

---

## Demo y Repositorio

**Aplicación Desplegada:** [https://restaurante-pedidos-878fc.web.app/](https://restaurante-pedidos-878fc.web.app/)

**Repositorio GitHub:** [https://github.com/lourdesperezhuaman/restaurante.git](https://github.com/lourdesperezhuaman/restaurante.git)

### Usuarios de Prueba

**Administrador:**
- Email: lourdesperez@gmail.com
- Contraseña: 123123

**Mesero:**
- Email: mesero@test.com
- Contraseña: 123456

---

## Tecnologías Utilizadas

### Frontend
- **Angular 18.2.14** - Framework principal
- **TypeScript 5.5.4** - Lenguaje de programación tipadog
- **Standalone Components** - Arquitectura moderna sin módulos NgModule
- **Reactive Forms** - Manejo avanzado de formularios
- **RxJS 7.8.2** - Programación reactiva y observables
- **CSS3** - Estilos personalizados con glassmorphism

### Backend y Base de Datos
- **Firebase Authentication** - Sistema de autenticación seguro
- **Cloud Firestore** - Base de datos NoSQL en tiempo real
- **Firebase Hosting** - Alojamiento y despliegue de la aplicación
- **@angular/fire 18.0.0** - Integración de Firebase con Angular

### Herramientas de Desarrollo
- **Node.js 22.12.0** - Entorno de ejecución de JavaScript
- **npm 10.9.0** - Gestor de paquetes
- **Angular CLI 18.2.21** - Herramientas de línea de comandos
- **Git** - Control de versiones

---

## Requisitos Previos

Antes de instalar el proyecto, asegúrate de tener instalado:

- **Node.js** versión 18 o superior
- **npm** versión 9 o superior
- **Angular CLI** versión 18 o superior

Verificar versiones instaladas:

```bash
node --version
npm --version
ng version
```

---

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/lourdesperezhuaman/restaurante.git
cd restaurante
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Firebase

El proyecto ya está configurado con las credenciales de Firebase necesarias en `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyC86l9F9h8tQ0hlnzvL7UY_8_oaeDJnQJA",
    authDomain: "restaurante-pedidos-878fc.firebaseapp.com",
    projectId: "restaurante-pedidos-878fc",
    storageBucket: "restaurante-pedidos-878fc.firebasestorage.app",
    messagingSenderId: "569417203324",
    appId: "1:569417203324:web:26c8e6058746a2f84913f9"
  }
};
```

### 4. Iniciar el servidor de desarrollo

```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200/`

### 5. Compilar para producción

```bash
ng build --configuration production
```

Los archivos compilados se generarán en el directorio `dist/restaurante-pedidos/`

---

## Arquitectura del Proyecto

### Estructura de Carpetas

```
src/app/
├── caracteristicas/              # Módulos funcionales por característica
│   ├── administracion/           # Gestión administrativa
│   ├── autenticacion/            # Sistema de autenticación
│   │   ├── login/
│   │   └── registro/
│   ├── inicio/                   # Página principal
│   ├── pedidos/                  # Gestión de pedidos
│   │   ├── detalle-pedido/
│   │   ├── formulario-pedido/
│   │   └── lista-pedidos/
│   └── platos/                   # Gestión del menú
│       ├── formulario-plato/
│       └── lista-platos/
├── compartido/                   # Componentes y utilidades reutilizables
│   ├── componentes/
│   │   ├── barra-navegacion/
│   │   ├── diseño/
│   │   └── pagina-no-encontrada/
│   ├── directivas/               # Directivas personalizadas
│   │   └── resaltar.directive.ts
│   └── tubos/                    # Pipes personalizados
│       ├── fecha-firebase.pipe.ts
│       └── moneda.pipe.ts
├── modelos/                      # Interfaces y tipos TypeScript
│   ├── pedido.modelo.ts
│   ├── plato.modelo.ts
│   └── usuario.modelo.ts
├── nucleo/guardias/              # Route Guards
│   ├── administrador.guard.ts
│   └── autenticacion.guard.ts
├── servicios/                    # Servicios de negocio
│   ├── autenticacion.service.ts
│   ├── pedidos.service.ts
│   └── platos.service.ts
└── environments/                 # Configuración por entorno
```

### Componentes Principales

#### Autenticación
- **LoginComponent**: Formulario de inicio de sesión con validaciones en tiempo real
- **RegistroComponent**: Registro de nuevos usuarios con selección de rol

#### Gestión de Pedidos
- **ListaPedidosComponent**: Visualización de pedidos con filtros por estado y mesa
- **FormularioPedidoComponent**: Creación de pedidos con selección de platos y cálculo automático
- **DetallePedidoComponent**: Vista detallada con información completa del pedido

#### Gestión de Platos
- **ListaPlatosComponent**: Catálogo completo con filtros por categoría y disponibilidad
- **FormularioPlatoComponent**: Crear y editar platos del menú

#### Navegación
- **BarraNavegacionComponent**: Menú de navegación responsive con información del usuario
- **DiseñoComponent**: Layout principal con contenedor para vistas anidadas

### Servicios Principales

#### AutenticacionService
Gestiona toda la lógica de autenticación y autorización de usuarios.

**Métodos principales:**
```typescript
registrar(email, password, nombre, rol): Promise<void>
iniciarSesion(email, password): Promise<void>
cerrarSesion(): Promise<void>
estaAutenticado(): boolean
esAdministrador(): boolean
obtenerUsuarioActual(): Usuario | null
```

#### PedidosService
Maneja todas las operaciones CRUD relacionadas con pedidos.

**Métodos principales:**
```typescript
obtenerPedidos(): Observable<Pedido[]>
obtenerPedidosPorMesero(meseroId): Observable<Pedido[]>
crearPedido(pedido): Promise<string>
actualizarEstado(id, estado): Promise<void>
eliminarPedido(id): Promise<void>
```

#### PlatosService
Gestiona el catálogo de platos del menú.

**Métodos principales:**
```typescript
obtenerPlatos(): Observable<Plato[]>
obtenerPlatosDisponibles(): Observable<Plato[]>
agregarPlato(plato): Promise<string>
actualizarPlato(id, plato): Promise<void>
cambiarDisponibilidad(id, disponible): Promise<void>
eliminarPlato(id): Promise<void>
```

### Guards de Seguridad

- **autenticacionGuard**: Protege rutas que requieren autenticación, redirige a /login si no está autenticado
- **administradorGuard**: Protege rutas exclusivas para administradores, redirige a / si no tiene permisos

### Modelos de Datos

```typescript
interface Usuario {
  uid: string;
  nombre: string;
  email: string;
  rol: 'mesero' | 'administrador';
  fechaCreacion: Date;
  activo: boolean;
}

interface Plato {
  id?: string;
  nombre: string;
  descripcion: string;
  categoria: CategoriaPlato;
  precio: number;
  disponible: boolean;
  imagenUrl?: string;
  fechaCreacion: Date;
}

interface Pedido {
  id?: string;
  numeroMesa: number;
  meseroId: string;
  meseroNombre: string;
  articulos: ArticuloPedido[];
  estado: EstadoPedido;
  total: number;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  notas?: string;
}

enum EstadoPedido {
  PENDIENTE = 'Pendiente',
  EN_PREPARACION = 'En Preparación',
  LISTO = 'Listo',
  ENTREGADO = 'Entregado',
  CANCELADO = 'Cancelado'
}
```

### Base de Datos (Firestore)

#### Colecciones

**usuarios**
```
{
  uid: string,
  nombre: string,
  email: string,
  rol: "mesero" | "administrador",
  fechaCreacion: timestamp,
  activo: boolean
}
```

**platos**
```
{
  nombre: string,
  descripcion: string,
  categoria: string,
  precio: number,
  disponible: boolean,
  imagenUrl?: string,
  fechaCreacion: timestamp
}
```

**pedidos**
```
{
  numeroMesa: number,
  meseroId: string,
  meseroNombre: string,
  articulos: [
    {
      platoId: string,
      platoNombre: string,
      cantidad: number,
      precioUnitario: number,
      subtotal: number,
      notas?: string
    }
  ],
  estado: string,
  total: number,
  fechaCreacion: timestamp,
  fechaActualizacion: timestamp,
  notas?: string
}
```

#### Índices Compuestos Requeridos

**pedidos**
- `meseroId` (Ascendente) + `fechaCreacion` (Descendente)
- `estado` (Ascendente) + `fechaCreacion` (Descendente)

**platos**
- `disponible` (Ascendente) + `nombre` (Ascendente)

---

## Manual de Usuario

### Acceso al Sistema

#### Iniciar Sesión

1. Ingresa a la aplicación: [https://restaurante-pedidos-878fc.web.app/](https://restaurante-pedidos-878fc.web.app/)
2. Introduce tu correo electrónico y contraseña
3. Haz clic en **"Iniciar Sesión"**

Puedes usar los usuarios de prueba mencionados anteriormente.

#### Cerrar Sesión

1. Haz clic en tu nombre de usuario en la esquina superior derecha
2. Selecciona **"Cerrar Sesión"**

---

### Guía para Meseros

#### Panel Principal

Al iniciar sesión como mesero verás:
- Resumen de tus pedidos activos
- Acceso rápido para crear nuevos pedidos
- Lista de tus pedidos recientes

#### Crear un Nuevo Pedido

1. Haz clic en el botón **"Nuevo Pedido"** o en el ícono **+**
2. Ingresa el **número de mesa**
3. Haz clic en **"Agregar Artículo"**

Para cada artículo:
1. Selecciona el **plato** del menú desplegable
2. Indica la **cantidad**
3. Agrega **notas especiales** si es necesario (ej: "sin cebolla")
4. El sistema calculará automáticamente el subtotal

Puedes:
- Agregar más artículos con **"Agregar Artículo"**
- Eliminar artículos con el ícono de papelera
- Agregar **notas generales** para el pedido

5. Verifica el **total del pedido** en la parte inferior
6. Haz clic en **"Crear Pedido"**

#### Ver Mis Pedidos

1. Selecciona **"Pedidos"** en el menú principal
2. Verás una lista con todos tus pedidos activos

Información mostrada:
- Número de mesa
- Estado del pedido
- Total del pedido
- Fecha y hora de creación

#### Filtrar Pedidos

Utiliza los filtros disponibles:
- **Por Estado**: Selecciona un estado específico del menú desplegable
- **Por Mesa**: Escribe el número de mesa en el campo de búsqueda

#### Ver Detalle de un Pedido

1. En la lista de pedidos, haz clic en **"Ver Detalle"**
2. Verás la información completa:
   - Datos del pedido (mesa, mesero, fecha)
   - Lista detallada de artículos con cantidades y precios
   - Estado actual del pedido
   - Total del pedido

#### Cambiar Estado de un Pedido

Los meseros pueden actualizar el estado siguiendo el flujo:

**Pendiente** → **En Preparación** → **Listo** → **Entregado**

Para cambiar el estado:
1. Abre el detalle del pedido
2. Haz clic en el botón con el siguiente estado disponible
3. El cambio se guardará automáticamente

**Nota:** Los estados siguen un orden secuencial y no se pueden saltar pasos.

#### Consultar el Menú

1. Selecciona **"Platos"** en el menú principal
2. Verás el catálogo completo con:
   - Nombre del plato
   - Descripción
   - Categoría
   - Precio
   - Disponibilidad

Filtros disponibles:
- **Categoría**: Entradas, Platos Principales, Postres, Bebidas
- **Disponibilidad**: Solo mostrar platos disponibles
- **Búsqueda**: Escribe el nombre del plato

---

### Guía para Administradores

Los administradores tienen acceso a todas las funciones de los meseros, además de:

#### Panel de Administración

Muestra:
- Estadísticas generales del restaurante
- Resumen de pedidos activos de todos los meseros
- Acceso a gestión de menú

#### Gestionar Platos del Menú

##### Ver Todos los Platos

1. Selecciona **"Platos"** en el menú
2. Verás el catálogo completo
3. Utiliza los filtros para buscar platos específicos

##### Agregar un Nuevo Plato

1. Haz clic en **"Agregar Plato"**
2. Completa el formulario:
   - **Nombre**: Mínimo 3 caracteres
   - **Descripción**: Mínimo 10 caracteres
   - **Categoría**: Selecciona del menú
   - **Precio**: Debe ser mayor a 0
   - **Disponible**: Marca si estará disponible inmediatamente
   - **URL de Imagen**: Opcional
3. Haz clic en **"Guardar"**

##### Editar un Plato

1. En la lista de platos, haz clic en el ícono de **editar** (lápiz)
2. Modifica los campos necesarios
3. Haz clic en **"Guardar Cambios"**

##### Cambiar Disponibilidad

1. Localiza el plato en la lista
2. Haz clic en el interruptor de **disponibilidad**
3. El cambio se guardará automáticamente

**Nota:** Los platos no disponibles no aparecen al crear pedidos.

##### Eliminar un Plato

1. Busca el plato a eliminar
2. Haz clic en el ícono de **eliminar** (papelera)
3. Confirma la eliminación

**Advertencia:** Esta acción no se puede deshacer.

#### Gestionar Todos los Pedidos

##### Ver Todos los Pedidos

1. Selecciona **"Pedidos"** en el menú
2. Verás todos los pedidos del restaurante
3. Cada pedido muestra:
   - Número de mesa
   - Nombre del mesero
   - Estado actual
   - Total
   - Fecha y hora

##### Filtrar Pedidos

Utiliza los filtros:
- **Por Estado**: Filtra por estado específico
- **Por Mesa**: Busca pedidos de una mesa
- **Por Mesero**: Los administradores ven todos los meseros

##### Actualizar Estado de Cualquier Pedido

1. Abre el detalle del pedido
2. Haz clic en el botón del siguiente estado
3. El cambio se aplica inmediatamente

##### Eliminar Pedidos

Solo los administradores pueden eliminar pedidos:

1. Localiza el pedido en la lista
2. Haz clic en el ícono de **eliminar**
3. Confirma la eliminación

**Advertencia:** Esta acción es permanente.

#### Registrar Nuevos Usuarios

1. Cierra sesión de tu cuenta
2. En el login, haz clic en **"Regístrate aquí"**
3. Completa el formulario:
   - Nombre completo
   - Correo electrónico
   - Contraseña (mínimo 6 caracteres)
   - Confirmar contraseña
   - Rol: Mesero o Administrador
4. Haz clic en **"Registrar"**

---

### Preguntas Frecuentes

**¿Cómo recupero mi contraseña?**  
Contacta al administrador del sistema para restablecer tu acceso.

**¿Puedo editar un pedido después de crearlo?**  
No, los pedidos no se pueden editar. Solo se puede actualizar su estado. El administrador puede eliminar y crear uno nuevo si es necesario.

**¿Los cambios se ven en tiempo real?**  
Sí, el sistema utiliza Firestore, por lo que cualquier cambio se refleja automáticamente en todas las sesiones activas.

**¿Puedo ver pedidos de otros meseros?**  
No, los meseros solo ven sus propios pedidos. Los administradores ven todos los pedidos.

**¿Qué significa cada estado del pedido?**
- **Pendiente**: Pedido creado, aún no iniciado
- **En Preparación**: Se está preparando en cocina
- **Listo**: Completado y listo para servir
- **Entregado**: Entregado exitosamente al cliente
- **Cancelado**: Pedido cancelado (solo administradores)

**¿Puedo agregar platos sin precio?**  
No, todos los platos deben tener un precio mayor a 0 para calcular correctamente los totales.

**¿Por qué un plato no aparece al crear un pedido?**  
Verifica que el plato esté marcado como **disponible**. Solo los platos disponibles aparecen en el formulario.

**¿El sistema funciona en dispositivos móviles?**  
Sí, tiene diseño responsive adaptable a móviles, tablets y computadoras.

**¿Puedo usar el sistema sin internet?**  
No, el sistema requiere conexión a internet ya que toda la información está en la nube (Firebase).

**¿Hay límite de pedidos?**  
No hay límite en la cantidad de pedidos que se pueden crear.

---

## Despliegue

### Configuración Firebase Hosting

1. Instalar Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Iniciar sesión:
```bash
firebase login
```

3. Configurar `firebase.json`:
```json
{
  "hosting": {
    "public": "dist/restaurante-pedidos/browser",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Desplegar a Firebase

```bash
# Compilar para producción
ng build --configuration production

# Desplegar
firebase deploy --only hosting
```

### Solución de Problemas

| Error | Causa | Solución |
|-------|-------|----------|
| Missing permissions | Reglas Firestore restrictivas | Verificar reglas en Firebase Console |
| No index found | Falta índice compuesto | Crear índice desde el enlace del error |
| auth/user-not-found | Usuario no existe | Verificar email o registrarse |
| App no carga | Rutas incorrectas | Verificar firebase.json |
---

## LINK DEL VIDEO POR DRIVE

[https://drive.google.com/drive/folders/133JHTQm-6kMw1jnlL7nqFZtrMgZ92yhF?usp=sharing](https://drive.google.com/drive/folders/133JHTQm-6kMw1jnlL7nqFZtrMgZ92yhF?usp=sharing)

---

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

## Autor

**Lourdes Pérez Huamán**

## Contacto

- **Repositorio**: [https://github.com/lourdesperezhuaman/restaurante](https://github.com/lourdesperezhuaman/restaurante)
- **Issues**: [https://github.com/lourdesperezhuaman/restaurante/issues](https://github.com/lourdesperezhuaman/restaurante/issues)

---

**Versión:** 1.0.0  
**Última actualización:** Diciembre 2025