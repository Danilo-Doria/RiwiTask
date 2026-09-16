# RiwiTask API 🚀

API RESTful para la gestión eficiente de clientes y sus tareas asociadas, desarrollada con **Spring Boot 4.1.1** y **Java 21** aplicando principios de Arquitectura Limpia, DTOs inmutables con Java Records, mapeo automático con MapStruct y manejo centralizado de excepciones.

---

## 🛠️ Tecnologías Utilizadas

* **Java 21** - Lenguaje de programación base.
* **Spring Boot 4.1.1** - Framework de desarrollo.
* **Spring Data JPA & Hibernate** - Persistencia de datos y ORM.
* **PostgreSQL** - Base de datos relacional.
* **MapStruct** - Mapeo desacoplado entre Entidades y DTOs.
* **Lombok** - Reducción de código repetitivo (`@Getter`, `@Setter`, `@Builder`).
* **Jakarta Bean Validation** - Validación de reglas de entrada (`@NotBlank`, `@NotNull`, etc.).
* **Springdoc OpenAPI 3 (Swagger UI)** - Documentación interactiva de la API.

---

## 📁 Estructura del Proyecto

```text
src/main/java/com/danilodoria/riwitask/
├── config/          # Configuración de OpenAPI / Swagger
├── controller/      # Endpoints REST (@RestController)
├── dto/             # Data Transfer Objects (Request / Response Records)
├── entity/          # Entidades JPA (Client, Task)
├── enums/           # Enumeraciones (Status, Priority)
├── exception/       # Excepciones personalizadas y GlobalExceptionHandler
├── mappers/         # Interfaces de MapStruct
├── repository/      # Repositorios Spring Data JPA
└── service/         # Lógica de negocio (ClientService, TaskService)# RiwiTask
```
---

## 📌 Características Principales

* **Gestión de Clientes:** CRUD completo con validación de correo único (`EmailAlreadyExistsException`).
* **Gestión de Tareas:** CRUD completo con asociación estricta a un cliente existente.
* **Filtros Avanzados:** Consulta de tareas por cliente y estado (`PENDIENTE`, `COMPLETADA`, etc.) ordenadas descendentemente por fecha de creación (`createdAt DESC`).
* **Manejo Centralizado de Errores:** Respuestas estandarizadas (`ErrorResponseDTO`) con códigos HTTP semánticos (`201`, `200`, `204`, `400`, `404`, `409`, `500`).

---

## ⚙️ Configuración del Entorno

Asegúrate de tener creada la base de datos `riwitask_db` en PostgreSQL e incluye las credenciales en `src/main/resources/application.properties`:

```properties
spring.application.name=riwitask
spring.datasource.url=jdbc:postgresql://localhost:5432/riwitask_db
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

---

## 🚀 Ejecución del Proyecto

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Danilo-Doria/RiwiTask.git
   cd RiwiTask
   ```
2. **Compilar y ejecutar:**
   ```bash
   mvn spring-boot:run
   ```

---

## 🔗 Tabla de Endpoints
| Método | Ruta | Descripción | Estado HTTP |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/clients` | Registrar un cliente | `201 Created` |
| **GET** | `/api/v1/clients` | Listar todos los clientes | `200 OK` |
| **GET** | `/api/v1/clients/{id}` | Obtener cliente por ID | `200 OK` |
| **PUT** | `/api/v1/clients/{id}` | Actualizar cliente | `200 OK` |
| **DELETE** | `/api/v1/clients/{id}` | Eliminar cliente | `204 No Content` |
| **POST** | `/api/v1/tasks` | Crear tarea para un cliente | `201 Created` |
| **GET** | `/api/v1/tasks` | Listar todas las tareas | `200 OK` |
| **GET** | `/api/v1/tasks/{id}` | Obtener tarea por ID | `200 OK` |
| **GET** | `/api/v1/tasks/client/{clientId}?status=PENDIENTE` | Filtrar tareas por cliente y estado (DESC) | `200 OK` |
| **PUT** | `/api/v1/tasks/{id}` | Actualizar tarea | `200 OK` |
| **DELETE** | `/api/v1/tasks/{id}` | Eliminar tarea | `204 No Content` |

---

## 👨‍💻 Autor

* GitHub: **[Danilo-Doria](https://github.com/Danilo-Doria)**
* LinkedIn: **[Danilo Doria Diaz](https://www.linkedin.com/in/danilodd)**
* Email: **[danilodoria519@gmail.com](mailto:danilodoria519@gmail.com)**