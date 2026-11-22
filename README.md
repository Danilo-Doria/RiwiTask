# RiwiTask 🚀

Proyecto Fullstack para la gestión eficiente de clientes y tareas con seguridad y control de acceso basado en roles (RBAC). El backend está desarrollado con **Spring Boot 4.1.1** y **Java 21**, protegido mediante **Spring Security y JWT**, y orquestado con **Docker & Docker Compose**. El frontend está construido como una Single Page Application (SPA) moderna con **Angular 22**, utilizando **Signals**, **Tailwind CSS v4** y componentes standalone.

---

## 📁 Estructura del Proyecto

```text
RiwiTask/
├── client/                                # Aplicación Frontend (Angular 22)
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/                      # Servicios y utilidades singleton
│   │   │   │   ├── guards/                # authGuard, guestGuard, roleGuard
│   │   │   │   ├── interceptors/          # authInterceptor (JWT), errorInterceptor (401 & 403 Toast)
│   │   │   │   ├── services/              # AuthService, ToastService (gestión con Signals)
│   │   │   │   └── utils/                 # api-error (getFieldErrors), validators
│   │   │   ├── features/                  # Módulos de funcionalidad (Lazy Loaded)
│   │   │   │   ├── auth/                  # login y register (con validación de errores por campo)
│   │   │   │   ├── clients/               # client-list y client-form (gestión ADMIN / perfil)
│   │   │   │   ├── not-found/             # Página 404 dedicada
│   │   │   │   └── tasks/                 # task-list y task-form (CRUD y filtros)
│   │   │   ├── models/                    # Modelos TypeScript y Enums (auth, client, task, error)
│   │   │   ├── services/                  # ClientService, TaskService
│   │   │   ├── shared/                    # Componentes reutilizables
│   │   │   │   ├── confirm-modal/         # Modal de confirmación accesible
│   │   │   │   ├── main-layout/           # Layout principal con Navbar integrada
│   │   │   │   ├── navbar/                # Barra de navegación con roles e info de sesión
│   │   │   │   ├── priority-badge/        # Badges visuales de prioridad (LOW, MEDIUM, HIGH)
│   │   │   │   ├── status-badge/          # Badges visuales de estado (PENDING, IN_PROGRESS, COMPLETED)
│   │   │   │   └── toast/                 # Componente global de notificaciones Toast
│   │   │   ├── app.config.ts              # Configuración de proveedores (HTTP, Router)
│   │   │   ├── app.routes.ts              # Enrutamiento con lazy loading y guards
│   │   │   └── app.ts / app.html          # Componente raíz con router-outlet y app-toast
│   │   ├── environments/                  # Variables de entorno (development / production)
│   │   └── styles.css                     # Tailwind CSS v4 import
│   ├── package.json                       # Dependencias y scripts de Angular
│   └── tsconfig.json                      # Configuración de TypeScript
├── server/                                # Backend (Spring Boot 4.1.1 + Java 21)
│   ├── gradle/                            # Wrapper de Gradle
│   ├── src/
│   │   └── main/
│   │       ├── java/com/danilodoria/riwitask/
│   │       │   ├── config/                # SecurityConfig, JwtAuthenticationFilter, CorsConfig
│   │       │   ├── controller/            # AuthController, ClientController, TaskController
│   │       │   ├── dto/                   # DTOs inmutables con Records (Request & Response)
│   │       │   ├── entity/                # Entidades JPA (Client, Task, Role, Status, Priority)
│   │       │   ├── exception/             # GlobalExceptionHandler (400, 401, 403, 404, 409, 500)
│   │       │   ├── mappers/               # Mapeadores con MapStruct
│   │       │   ├── repository/            # Repositorios Spring Data JPA
│   │       │   ├── security/              # JwtService, CustomUserDetailsService, SecurityUtils
│   │       │   └── service/               # AuthService, ClientService, TaskService
│   │       └── resources/
│   │           └── application.yaml       # Configuración de base de datos, JWT y JPA
│   ├── Dockerfile                         # Imagen Docker multi-stage (JDK 21 -> JRE 21 Alpine)
│   ├── docker-compose.yml                 # Orquestación de backend y PostgreSQL 16
│   ├── build.gradle                       # Dependencias y plugins de Gradle
│   └── gradlew                            # Script ejecutable de Gradle
├── .gitignore                             # Reglas de exclusión para client y server
├── LICENSE                                # Licencia MIT
└── README.md                              # Documentación general del proyecto
```

---

## 🛠️ Tecnologías Utilizadas

### Frontend (`client/`)
* **Angular 22** (`@angular/core: ^22.2.0`) - Framework reactivo con componentes Standalone y Signals.
* **TypeScript 6.0** - Tipado estático robusto y moderno.
* **Tailwind CSS v4** - Estilos utilitarios de última generación con directiva `@import "tailwindcss"`.
* **Angular Router** - Enrutamiento modular con Lazy Loading (`loadComponent`), Guards funcionales (`CanActivateFn`) y ruta comodín (`**`).
* **Angular Reactive Forms** - Formularios reactivos fuertemente tipados con validadores sincronizados y mapeo de errores del backend (`getFieldErrors`).
* **RxJS 7.8** - Programación reactiva para flujos HTTP e interceptores.
* **Vitest 5.0** - Suite de pruebas unitarias rápida y moderna integrada con Angular.

### Backend (`server/`)
* **Java 21** - Lenguaje base con soporte para Virtual Threads y características modernas.
* **Spring Boot 4.1.1** - Framework principal para desarrollo de microservicios y APIs REST.
* **Spring Security 7** - Filtro de seguridad stateless, autenticación por cabeceras y control de roles.
* **JJWT (Java JSON Web Token) 0.12.6** - Emisión, firma y verificación de tokens JWT.
* **Spring Data JPA & Hibernate** - Persistencia relacional, consultas derivadas y transaccionalidad.
* **PostgreSQL 16** - Base de datos relacional robusta.
* **MapStruct** - Mapeo de alto rendimiento y desacoplado entre Entidades y DTOs.
* **Jakarta Bean Validation** - Validación declarativa de modelos de entrada (`@NotBlank`, `@Email`, etc.).
* **Docker & Docker Compose** - Contenedorización reproducible con healthchecks.

---

## ✨ Características Principales

### 🔒 Autenticación y Autorización (RBAC)
* Flujo de inicio de sesión y registro protegido con JWT.
* Sesión persistida de forma segura y validación local de expiración del token (`exp`).
* **Roles:**
  * **`ADMIN`**: Control total. Gestión de todos los clientes (creación, edición, cambio de roles, eliminación) y visualización/gestión de todas las tareas.
  * **`USER`**: Acceso restringido. Gestión exclusiva de sus propias tareas y edición de su propio perfil de usuario.

### 🛡️ Interceptores y Manejo Global de Errores
* **`authInterceptor`**: Inyecta automáticamente el token JWT en el encabezado `Authorization: Bearer <token>` para todas las peticiones a la API.
* **`errorInterceptor`**:
  * **401 Unauthorized**: Limpia la sesión y redirige automáticamente a `/login` ante un token vencido o inválido.
  * **403 Forbidden**: Intercepta intentos de acceso denegado y dispara inmediatamente una notificación global vía `ToastService`.
* **`roleGuard`**: Protege rutas administrativas en el cliente, avisando al usuario con una notificación y redirigiéndolo a su pantalla principal.

### 🔔 Sistema Reactivo de Notificaciones (Toasts)
* **`ToastService`**: Servicio global basado en Angular Signals (`signal<Toast[]>()`) que administra una pila de mensajes flotantes (éxito, error, advertencia, información) con auto-cierre configurable y cierre manual.
* **`ToastComponent`**: Componente visual ubicado en la raíz (`App`) que presenta los avisos con animaciones y estilos acordes a su severidad.

### 📝 Formularios Reactivos Homogéneos
* Formularios con validaciones en tiempo real (longitud, correos válidos, coincidencia de contraseñas).
* Tratamiento uniforme de errores del servidor vía `getFieldErrors()` en todos los formularios (`Register`, `TaskForm`, `ClientForm`), permitiendo mostrar mensajes específicos debajo de cada campo afectado.

### 🔍 Página 404 Real
* Componente `NotFound` dedicado para capturar cualquier ruta inexistente o no configurada (`/404` y `**`), permitiendo volver a la navegación principal de manera amigable.

---

## 🔐 Matriz de Permisos (RBAC)

| Recurso / Acción | Endpoint Backend | Ruta Frontend | Rol ADMIN | Rol USER |
| :--- | :--- | :--- | :---: | :---: |
| Iniciar sesión / Registro | `/auth/*` | `/login`, `/register` | ✅ (Público) | ✅ (Público) |
| Ver listado de tareas | `GET /tasks` | `/tasks` | ✅ (Todas) | ✅ (Solo propias) |
| Crear tarea | `POST /tasks` | `/tasks/new` | ✅ (Cualquiera) | ✅ (Con su ID) |
| Editar tarea | `PUT /tasks/{id}` | `/tasks/:id/edit` | ✅ (Cualquiera) | ✅ (Solo propias) |
| Eliminar tarea | `DELETE /tasks/{id}` | En `/tasks` | ✅ (Cualquiera) | ✅ (Solo propias) |
| Filtrar tareas por estado | `GET /tasks/client/{id}?status=` | En `/tasks` | ✅ | ✅ (Solo propias) |
| Listado de clientes | `GET /clients` | `/clients` | ✅ | ❌ (Bloqueado) |
| Editar cualquier cliente / Rol | `PUT /clients/{id}` | `/clients/:id/edit` | ✅ | ❌ (Bloqueado) |
| Eliminar cliente | `DELETE /clients/{id}` | En `/clients` | ✅ | ❌ (Bloqueado) |
| Ver y editar mi perfil | `GET/PUT /clients/{mi_id}` | `/profile` | ✅ | ✅ |

> **Nota:** Al iniciar el servidor por primera vez, se genera automáticamente el usuario administrador:
> - **Correo:** `admin@gmail.com`
> - **Contraseña:** `admin12345678`
> - **Rol:** `ADMIN`

---

## 🚀 Guía de Puesta en Marcha

### Prerrequisitos
* **Node.js** 20.x o superior y **npm** 10+.
* **Java JDK 21** (si se ejecuta el backend localmente sin Docker).
* **Docker & Docker Compose** (opción recomendada para backend y base de datos).

---

### 1. Iniciar el Backend (`server/`)

#### Opción A: Con Docker (Recomendado)
```bash
# 1. Ingresar a la carpeta del servidor
cd server

# 2. Construir y levantar contenedores (API + PostgreSQL 16)
docker compose up -d --build

# 3. Ver logs en tiempo real
docker compose logs -f app
```
* **API Backend:** `http://localhost:8080`
* **Base de datos PostgreSQL:** `localhost:5435` (Usuario: `riwi_user`, Password: `riwi_pass`, BD: `riwitask_db`)

#### Opción B: Ejecución Local con Gradle
```bash
# 1. Levantar únicamente la base de datos PostgreSQL
cd server
docker compose up -d postgres-db

# 2. Ejecutar la aplicación Spring Boot con Gradle
./gradlew bootRun
```

---

### 2. Iniciar el Frontend (`client/`)

```bash
# 1. Abrir otra terminal e ingresar a la carpeta client
cd client

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo de Angular
npm start
```

* Abre tu navegador en: **`http://localhost:4200`**
* Las peticiones se dirigirán por defecto a `http://localhost:8080` según la configuración en `client/src/environments/environment.development.ts`.

#### Scripts útiles del Frontend:
```bash
npm run build         # Compilar para producción (dist/riwitask)
npm test -- --no-watch # Ejecutar pruebas unitarias con Vitest
```

---

## 🧭 Rutas del Frontend

| Ruta | Componente | Acceso / Guard | Descripción |
| :--- | :--- | :--- | :--- |
| `/login` | `Login` | `guestGuard` | Pantalla de inicio de sesión con JWT |
| `/register` | `Register` | `guestGuard` | Registro de nuevos usuarios con validación reactiva |
| `/tasks` | `TaskList` | `authGuard` | Tablero de tareas con filtros de estado y cliente |
| `/tasks/new` | `TaskForm` | `authGuard` | Formulario para registrar una nueva tarea |
| `/tasks/:id/edit` | `TaskForm` | `authGuard` | Edición de tareas existentes |
| `/clients` | `ClientList` | `authGuard` + `roleGuard` (`ADMIN`) | Administración y listado de usuarios del sistema |
| `/clients/:id/edit` | `ClientForm` | `authGuard` + `roleGuard` (`ADMIN`) | Edición de datos y roles de otros clientes |
| `/profile` | `ClientForm` | `authGuard` | Edición del perfil propio del usuario conectado |
| `/404` | `NotFound` | Público | Pantalla de página no encontrada con enlace de retorno |
| `**` | `NotFound` | Público | Comodín que captura cualquier enlace no registrado |

---

## 🔗 Endpoints del Backend

### Autenticación (`/auth`)
| Método | Endpoint | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | Público | Registro de nuevos usuarios (retorna token y datos del cliente) |
| **POST** | `/auth/login` | Público | Inicio de sesión (retorna token JWT y datos del cliente) |

### Clientes (`/clients`)
| Método | Endpoint | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/clients/me` | `USER` / `ADMIN` | Obtener datos del cliente autenticado |
| **GET** | `/clients` | `ADMIN` | Listar todos los clientes registrados |
| **GET** | `/clients/{id}` | Propietario o `ADMIN` | Obtener cliente específico por su ID |
| **POST** | `/clients` | `ADMIN` | Creación administrativa de clientes |
| **PUT** | `/clients/{id}` | Propietario o `ADMIN` | Actualización de perfil o credenciales |
| **DELETE** | `/clients/{id}` | `ADMIN` | Eliminación de cliente |

### Tareas (`/tasks`)
| Método | Endpoint | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/tasks` | `USER` / `ADMIN` | ADMIN lista todas; USER lista únicamente las propias |
| **GET** | `/tasks/{id}` | Propietario o `ADMIN` | Consultar tarea por ID |
| **POST** | `/tasks` | Propietario o `ADMIN` | Crear nueva tarea |
| **PUT** | `/tasks/{id}` | Propietario o `ADMIN` | Actualizar tarea existente |
| **DELETE** | `/tasks/{id}` | Propietario o `ADMIN` | Eliminar tarea |
| **GET** | `/tasks/client/{clientId}?status=VALOR` | Propietario o `ADMIN` | Consulta filtrada por cliente y estado (ordenada descendente) |

---

## 🧪 Pruebas Unitarias

### Ejecución en el Frontend:
```bash
cd client
npm test -- --no-watch
```
Valida la creación de la aplicación, el servicio reactivo de notificaciones `ToastService`, y el comportamiento del `errorInterceptor` ante errores 401 y 403.

### Ejecución en el Backend:
```bash
cd server
./gradlew test
```
Valida el contexto de Spring Boot, controladores, servicios y repositorios.

---

## 👨‍💻 Autor

* **Desarrollador:** Danilo Andrés Doria Diaz
* **GitHub:** [@Danilo-Doria](https://github.com/Danilo-Doria)
* **LinkedIn:** [Danilo Doria Diaz](https://www.linkedin.com/in/danilo-doria-diaz)
* **Email:** [danilodoria519@gmail.com](mailto:danilodoria519@gmail.com)
