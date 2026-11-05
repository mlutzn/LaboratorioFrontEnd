# Laboratorio 2 - CRUD Front-end

Aplicación web en **Angular 17** para administrar **Productos** y **Categorías**, con inicio de sesión, registro de usuarios y control de acceso por roles. Consume la API del Laboratorio 1 (CRUD back-end), que autentica con **Keycloak** y guarda los datos en **PostgreSQL**.

- Front-end: https://github.com/mlutzn/LaboratorioFrontEnd
- Back-end: https://github.com/mlutzn/LaboratorioBackEnd

## Requisitos

- Node.js 20 (el proyecto incluye un `.nvmrc`; con `nvm use` se selecciona solo)
- Docker Desktop (para el back-end, PostgreSQL y Keycloak)
- Angular CLI 17 (opcional; se puede usar `npm start`)

## Cómo levantar el proyecto

### 1. Back-end (API + PostgreSQL + Keycloak)

```bash
git clone https://github.com/mlutzn/LaboratorioBackEnd.git
cd LaboratorioBackEnd/docker
docker compose up -d --build
```

Con esto quedan corriendo tres contenedores:

| Servicio | Puerto | Descripción |
|---|---|---|
| `laboratorio-api` | 8080 | API REST (Spring Boot) |
| `keycloak` | 8180 | Autenticación y roles |
| `postgres-lab` | 5432 | Base de datos (datos de la API y de Keycloak) |

Keycloak guarda sus usuarios y roles en la base de datos `keycloak` de este mismo PostgreSQL. Esa base se crea automáticamente la primera vez (`docker/init-db/01-keycloak.sql`). La consola de Keycloak queda en http://localhost:8180 (usuario `admin`, clave `admin`, solo para desarrollo local).

### 2. Front-end

```bash
git clone https://github.com/mlutzn/LaboratorioFrontEnd.git
cd LaboratorioFrontEnd
nvm use
npm install
npm start
```

Abrir http://localhost:4200.

## Usuarios de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| `mlutz` | `qwe123` | `SUPER-ADMIN-ROLE` |
| `pmunoz` | `asd123` | `USER` |

Los usuarios que se registran desde la aplicación siempre quedan con el rol `USER`.

## Roles y permisos

| Acción | USER | SUPER-ADMIN-ROLE |
|---|---|---|
| Ver productos y categorías | Sí | Sí |
| Crear, editar y eliminar productos y categorías | No | Sí |
| Ver el listado de usuarios | No | Sí |

El acceso está controlado en tres niveles:

- **Rutas:** `authGuard` exige sesión y `adminGuard` exige rol administrador.
- **Menú y botones:** las opciones de administración solo se muestran cuando el usuario es administrador.
- **API:** el back-end valida los permisos de cada petición, aunque el front-end las ocultara (responde 403 si no corresponden).

## Funcionalidades

- Inicio de sesión y registro de usuarios.
- CRUD de categorías y de productos, con un único formulario reutilizable para crear y editar cada entidad.
- Al eliminar una categoría que tiene productos, la API responde 409 y el front-end muestra un mensaje.
- Listado de usuarios registrados con su rol (solo administrador).
- Cierre de sesión automático cuando el token vence (dura 15 minutos).

## Rutas de la aplicación

| Ruta | Acceso |
|---|---|
| `/login`, `/register` | Público |
| `/categorias`, `/productos` | Usuario autenticado |
| `/categorias/nueva`, `/categorias/editar/:id` | Administrador |
| `/productos/nuevo`, `/productos/editar/:id` | Administrador |
| `/usuarios` | Administrador |

## Estructura del proyecto

```
src/app/
├── core/                 Código transversal de la aplicación
│   ├── guards/           authGuard y adminGuard
│   ├── interceptors/     Agrega el token a cada petición y maneja el 401
│   ├── models/           Interfaces (Categoria, Producto, Usuario, auth)
│   └── services/         Acceso a la API (auth, categoría, producto, usuario)
├── features/             Pantallas agrupadas por entidad
│   ├── auth/             login y register
│   ├── categorias/       lista y formulario
│   ├── productos/        lista y formulario
│   └── usuarios/         lista de usuarios
└── shared/
    └── navbar/           Menú de navegación
```

- `core/` reúne lo que usa toda la aplicación (servicios, guards, interceptor y modelos).
- `features/` agrupa cada pantalla con su HTML, estilos y lógica.
- `shared/` contiene componentes reutilizables.

## API que consume

Base: `http://localhost:8080/api/v1`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/login` | Inicio de sesión (devuelve el token) |
| POST | `/auth/register` | Registro de usuario (rol `USER`) |
| GET | `/usuario` | Lista de usuarios (administrador) |
| GET, POST | `/categoria` | Listar y crear categorías |
| GET, PUT, DELETE | `/categoria/{id}` | Consultar, actualizar y eliminar |
| GET, POST | `/producto` | Listar y crear productos |
| GET, PUT, DELETE | `/producto/{id}` | Consultar, actualizar y eliminar |

La dirección de la API se configura en `src/environments/environment.ts` y `environment.development.ts`.

## Tecnologías

Angular 17 (componentes standalone, formularios reactivos, guards e interceptor funcionales), Bootstrap 5, Spring Boot, Keycloak, PostgreSQL y Docker.