# RiwiTask 🚀

Proyecto Fullstack para la gestión eficiente de clientes y tareas con seguridad y control de acceso basado en roles (RBAC). El backend está desarrollado con **Spring Boot 4.1.1** y **Java 21**, protegido mediante **Spring Security y JWT**, completamente dockerizado con **Docker & Docker Compose**, y listo para integrarse con un frontend en el directorio `client/`.

---

## 📁 Estructura del Proyecto

```text
RiwiTask/
├── client/                 # Aplicación Frontend (Angular)
├── server/                 # Backend Spring Boot
│   ├── gradle/             # Wrapper de Gradle
│   ├── src/                # Código fuente Java y recursos
│   │   └── main/
│   │       ├── java/com/danilodoria/riwitask/
│   │       │   ├── config/          # SecurityConfig, JwtAuthenticationFilter
│   │       │   ├── controller/      # AuthController, ClientController, TaskController
│   │       │   ├── dto/             # Request & Response Records (Auth, Client, Task)
│   │       │   ├── entity/          # Entidades JPA (Client, Task, Role, Status, Priority)
│   │       │   ├── exception/       # GlobalExceptionHandler
│   │       │   ├── mappers/         # Interfaces MapStruct
│   │       │   ├── repository/      # Repositorios Spring Data JPA
│   │       │   ├── security/        # JwtService, CustomUserDetailsService, SecurityUtils
│   │       │   └── service/         # AuthService, ClientService, TaskService
│   │       └── resources/
│   │           └── application.yaml # Configuración de la aplicación
│   ├── Dockerfile          # Imagen Docker multi-stage (JDK 21 -> JRE 21 Alpine)
│   ├── docker-compose.yml  # Orquestación de backend y PostgreSQL 16
│   ├── build.gradle        # Dependencias y configuración de Gradle
│   └── gradlew             # Script ejecutable de Gradle
├── .gitignore              # Reglas de exclusión de Git para client y server
├── LICENSE                 # Licencia del proyecto
├── PROMPT_CLAUDE_FRONTEND.txt # Prompt exhaustivo para el desarrollo del frontend con Claude
└── README.md               # Documentación general
```

---

## 🛠️ Tecnologías Utilizadas

* **Java 21** - Lenguaje de programación.
* **Spring Boot 4.1.1** - Framework backend.
* **Spring Security 7** - Autenticación, autorización y filtros de seguridad.
* **JJWT (Java JSON Web Token) 0.12.6** - Creación y validación de tokens JWT sin estado (stateless).
* **Spring Data JPA & Hibernate** - Persistencia relacional y ORM.
* **PostgreSQL 16** - Motor de base de datos relacional.
* **Docker & Docker Compose** - Contenedorización y orquestación con healthchecks.
* **MapStruct** - Mapeo desacoplado entre Entidades y DTOs.
* **Jakarta Bean Validation** - Validación de datos (`@NotBlank`, `@NotNull`, `@Email`, etc.).
* **Lombok** - Reducción de boilerplate en entidades y servicios.

---

## 🔐 Seguridad y Control de Acceso (RBAC)

La aplicación implementa autenticación basada en **JWT** y control de acceso con dos roles:

| Rol | Permisos |
| :--- | :--- |
| **`ADMIN`** | Acceso global completo. Puede ver, crear, actualizar y eliminar cualquier cliente y cualquier tarea. |
| **`USER`** | Acceso restringido. Solo puede ver y editar su propio perfil (`/clients/me` o `/clients/{id}` propio) y realizar CRUD sobre sus propias tareas (`/tasks`). No puede ver ni modificar datos de otros clientes. |

> Todas las peticiones a endpoints protegidos deben incluir la cabecera HTTP:
> `Authorization: Bearer <token_jwt>`

---

## 🐳 Despliegue con Docker (Recomendado)

El backend y su base de datos PostgreSQL están completamente contenerizados.

### Pasos para iniciar:
1. Navegar a la carpeta del servidor:
   ```bash
   cd server
   ```

2. Levantar los contenedores en segundo plano:
   ```bash
   docker compose up -d --build
   ```

3. Verificar logs del backend:
   ```bash
   docker compose logs -f app
   ```

4. Detener los servicios:
   ```bash
   docker compose down
   ```

> **Servicios expuestos:**
> - **Backend API:** `http://localhost:8080`
> - **PostgreSQL:** `localhost:5435` (Usuario: `riwi_user` | Contraseña: `riwi_pass` | DB: `riwitask_db`)

---

## 💻 Ejecución Local sin Docker (Opcional)

Si prefieres ejecutar el backend directamente con Gradle:

1. Levanta la base de datos PostgreSQL en el puerto `5435`:
   ```bash
   cd server
   docker compose up -d postgres-db
   ```
2. Ejecuta el backend:
   ```bash
   ./gradlew bootRun
   ```

---

## 🔗 Endpoints de la API

### 1. Autenticación (`/auth`) - *Públicos*
| Método | Endpoint | Descripción | Body (JSON) | Respuesta |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | Registrar nuevo usuario | `{ name, email, password, role? }` | `201 Created` (`token`, `client`) |
| **POST** | `/auth/login` | Iniciar sesión | `{ email, password }` | `200 OK` (`token`, `client`) |

### 2. Clientes (`/clients`) - *Protegidos con JWT*
| Método | Endpoint | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/clients/me` | `USER` / `ADMIN` | Obtener perfil del usuario autenticado |
| **GET** | `/clients` | `ADMIN` | Listar todos los clientes |
| **GET** | `/clients/{id}` | Propietario o `ADMIN` | Obtener cliente por ID |
| **POST** | `/clients` | `ADMIN` | Crear cliente directo (o usar `/auth/register`) |
| **PUT** | `/clients/{id}` | Propietario o `ADMIN` | Actualizar cliente |
| **DELETE** | `/clients/{id}` | `ADMIN` | Eliminar cliente |

### 3. Tareas (`/tasks`) - *Protegidos con JWT*
| Método | Endpoint | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/tasks` | `USER` / `ADMIN` | `ADMIN` obtiene todas las tareas; `USER` obtiene solo las suyas |
| **GET** | `/tasks/{id}` | Propietario o `ADMIN` | Obtener tarea por ID |
| **POST** | `/tasks` | Propietario o `ADMIN` | Crear tarea (USER solo con su propio `clientId`) |
| **PUT** | `/tasks/{id}` | Propietario o `ADMIN` | Actualizar tarea existente |
| **DELETE** | `/tasks/{id}` | Propietario o `ADMIN` | Eliminar tarea |
| **GET** | `/tasks/client/{clientId}?status=VALOR` | Propietario o `ADMIN` | Filtrar tareas por cliente y estado (DESC) |

---

## 👨‍💻 Autor

* GitHub: **[Danilo-Doria](https://github.com/Danilo-Doria)**
* LinkedIn: **[Danilo Doria Diaz](https://www.linkedin.com/in/danilodd)**
* Email: **[danilodoria519@gmail.com](mailto:danilodoria519@gmail.com)**
