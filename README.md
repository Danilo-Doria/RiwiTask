# RiwiTask 🚀

Proyecto Fullstack para la gestión eficiente de clientes y tareas. El backend está desarrollado con **Spring Boot 4.1.1** y **Java 21**, completamente dockerizado con **Docker & Docker Compose**, y preparado para integrarse con un frontend en el directorio `client/`.

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
│   │       │   ├── controller/      # Controladores REST (@RestController)
│   │       │   ├── dto/             # DTOs inmutables (Java Records)
│   │       │   ├── entity/          # Entidades JPA (Client, Task, Status, Priority)
│   │       │   ├── exception/       # Manejador global de excepciones
│   │       │   ├── mappers/         # Interfaces MapStruct
│   │       │   ├── repository/      # Repositorios Spring Data JPA
│   │       │   └── service/         # Servicios con lógica de negocio
│   │       └── resources/
│   │           └── application.yaml # Configuración de la aplicación
│   ├── Dockerfile          # Imagen Docker multi-stage (JDK 21 -> JRE 21 Alpine)
│   ├── docker-compose.yml  # Orquestación de backend y PostgreSQL 16
│   ├── build.gradle        # Dependencias y configuración de Gradle
│   └── gradlew             # Script ejecutable de Gradle
├── .gitignore              # Reglas de exclusión de Git para client y server
├── LICENSE                 # Licencia del proyecto
└── README.md               # Documentación general
```

---

## 🛠️ Tecnologías Utilizadas

* **Java 21** - Lenguaje de programación.
* **Spring Boot 4.1.1** - Framework backend.
* **Spring Data JPA & Hibernate** - Persistencia relacional y ORM.
* **PostgreSQL 16** - Motor de base de datos relacional.
* **Docker & Docker Compose** - Contenedorización y orquestación de servicios.
* **MapStruct** - Mapeo de Entidades a DTOs.
* **Jakarta Bean Validation** - Validación de datos (`@NotBlank`, `@NotNull`, `@Email`, etc.).
* **Lombok** - Reducción de boilerplate en entidades y servicios.

---

## 🐳 Despliegue con Docker (Recomendado)

El backend y su base de datos PostgreSQL están completamente contenerizados mediante un Dockerfile multi-stage y Docker Compose con healthcheck integrado.

### Prerrequisitos
- Docker instalado y en ejecución.
- Docker Compose v2+.

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

1. Asegúrate de tener una instancia de PostgreSQL corriendo en el puerto `5435` con la base de datos `riwitask_db` (o ajusta las variables en `server/src/main/resources/application.yaml`).
2. Entra a la carpeta del backend y ejecuta:
   ```bash
   cd server
   ./gradlew bootRun
   ```

---

## 🔗 Endpoints de la API

### Clientes (`/clients`)
| Método | Endpoint | Descripción | Body (JSON) | Respuesta exitosa |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/clients` | Crear un cliente | `{ name, email, password }` | `201 Created` |
| **GET** | `/clients` | Listar todos los clientes | Ninguno | `200 OK` |
| **GET** | `/clients/{id}` | Obtener cliente por ID | Ninguno | `200 OK` |
| **PUT** | `/clients/{id}` | Actualizar cliente por ID | `{ name, email, password }` | `200 OK` |
| **DELETE** | `/clients/{id}` | Eliminar cliente por ID | Ninguno | `204 No Content` |

### Tareas (`/tasks`)
| Método | Endpoint | Descripción | Body / Parámetros | Respuesta exitosa |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/tasks` | Crear una tarea | `{ title, description, status, priority, clientId }` | `201 Created` |
| **GET** | `/tasks` | Listar todas las tareas | Ninguno | `200 OK` |
| **GET** | `/tasks/{id}` | Obtener tarea por ID | Ninguno | `200 OK` |
| **GET** | `/tasks/client/{clientId}?status=VALOR` | Filtrar tareas por cliente y estado (DESC por fecha) | `status` (PENDIENTE, EN_PROCESO, COMPLETADA) | `200 OK` |
| **PUT** | `/tasks/{id}` | Actualizar tarea por ID | `{ title, description, status, priority, clientId }` | `200 OK` |
| **DELETE** | `/tasks/{id}` | Eliminar tarea por ID | Ninguno | `204 No Content` |

---

## 👨‍💻 Autor

* GitHub: **[Danilo-Doria](https://github.com/Danilo-Doria)**
* LinkedIn: **[Danilo Doria Diaz](https://www.linkedin.com/in/danilodd)**
* Email: **[danilodoria519@gmail.com](mailto:danilodoria519@gmail.com)**
