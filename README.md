<div align="center">

# 🌱 Cero Huella — Tienda de Productos Ecológicos

### 🛍️ Ecommerce Full Stack

Frontend de una tienda online de productos ecológicos, desarrollado con HTML5, CSS3 y JavaScript modular, integrado con una API REST desarrollada con Spring Boot.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

</div>

---

## 📖 Descripción

**Cero Huella** es un proyecto ecommerce desarrollado en el marco del programa **Talento Tech - Java Full Stack**.

El proyecto comenzó como una tienda desarrollada con HTML y CSS y evolucionó progresivamente hacia una aplicación web integrada con un backend REST desarrollado con **Spring Boot**.

Actualmente el frontend consume la API mediante JavaScript y cuenta con una arquitectura modular que separa:

- Comunicación con la API.
- Componentes reutilizables.
- Lógica específica de cada página.
- Funciones administrativas.
- Utilidades generales.
- Estilos globales y específicos.

El objetivo es ofrecer una experiencia de compra completa, con catálogo de productos, categorías, carrito de compras, autenticación de usuarios y administración del contenido.

---

# 🏗️ Arquitectura del proyecto

El frontend utiliza una estructura modular basada en responsabilidades.

```text
Frontend
│
├── pages
│   └── Páginas HTML
│
├── script
│   ├── api
│   │   └── Comunicación con el backend
│   │
│   ├── components
│   │   └── Componentes reutilizables
│   │
│   ├── pages
│   │   └── Lógica de cada página
│   │
│   ├── admin
│   │   └── Funcionalidades administrativas
│   │
│   └── utils
│       └── Utilidades generales
│
├── css
│   ├── components
│   │   └── Estilos de componentes
│   │
│   └── pages
│       └── Estilos específicos de páginas
│
└── img
    └── Recursos gráficos
```

---

# 📁 Estructura

```text
tiendaProductosEcologicos/
│
├── index.html
│
├── pages/
│   ├── admin.html
│   ├── carrito.html
│   ├── contacto.html
│   ├── login.html
│   ├── registro.html
│   └── tienda.html
│
├── css/
│   ├── style.css
│   │
│   ├── components/
│   │   ├── banner.css
│   │   ├── modalDetalles.css
│   │   ├── newslleter.css
│   │   ├── productoCard.css
│   │   └── toast.css
│   │
│   └── pages/
│       ├── admin.css
│       ├── carrito.css
│       ├── contacto.css
│       ├── home.css
│       ├── login.css
│       └── tienda.css
│
├── script/
│   │
│   ├── admin/
│   │   ├── adminCategorias.js
│   │   ├── adminProductos.js
│   │   └── adminUsuarios.js
│   │
│   ├── api/
│   │   ├── apiClient.js
│   │   ├── authApi.js
│   │   ├── carritoApi.js
│   │   ├── categoriasApi.js
│   │   ├── productosApi.js
│   │   └── usuariosApi.js
│   │
│   ├── components/
│   │   ├── footer.js
│   │   ├── modalConfirmacion.js
│   │   ├── modalDetalles.js
│   │   ├── navbar.js
│   │   ├── paginator.js
│   │   ├── productoCard.js
│   │   ├── spinner.js
│   │   └── toast.js
│   │
│   ├── pages/
│   │   ├── admin.js
│   │   ├── carrito.js
│   │   ├── contacto.js
│   │   ├── home.js
│   │   ├── login.js
│   │   ├── registro.js
│   │   └── tienda.js
│   │
│   └── utils/
│       ├── auth.js
│       ├── constants.js
│       ├── storage.js
│       └── validator.js
│
├── img/
│   ├── banner/
│   ├── pay/
│   ├── people/
│   └── productos/
│
└── README.md
```

---

# 🚀 Tecnologías utilizadas

## Frontend

| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura de las páginas |
| **CSS3** | Diseño y responsive |
| **JavaScript ES Modules** | Lógica de la aplicación |
| **Fetch API** | Comunicación con el backend |
| **Font Awesome** | Iconografía |
| **SVG** | Iconos personalizados, incluido Google |

## Backend

El frontend se encuentra integrado con una API REST desarrollada utilizando:

| Tecnología | Uso |
|---|---|
| **Java** | Lenguaje principal |
| **Spring Boot 4** | Framework backend |
| **Spring Security** | Seguridad |
| **JWT** | Autenticación |
| **Spring Data JPA** | Persistencia |
| **Hibernate** | ORM |
| **MySQL** | Base de datos |
| **Bean Validation** | Validación |
| **Swagger / OpenAPI** | Documentación de API |
| **OAuth2** | Autenticación mediante Google |
| **Spring Mail** | Confirmación de correo |

Repositorio del backend:

🔗 https://github.com/AlanContreras784/EntregaFinal-BackEnd-Java

---

# ✨ Funcionalidades

## 🏠 Página de inicio

La página principal incluye:

- Hero principal.
- Productos destacados.
- Secciones informativas.
- Reseñas.
- Newsletter.
- Navbar reutilizable.
- Footer reutilizable.
- Diseño responsive.

---

## 🛍️ Tienda

La tienda permite:

- Visualizar productos.
- Consultar información de cada producto.
- Filtrar productos por categoría.
- Buscar productos.
- Utilizar paginación.
- Agregar productos al carrito.
- Abrir el detalle de un producto.
- Controlar disponibilidad según stock.

Los productos son obtenidos desde la API REST.

---

## 🔎 Detalle de producto

Se implementó un componente reutilizable para mostrar información detallada del producto.

Incluye:

- Imagen.
- Nombre.
- Descripción.
- Precio.
- Categoría.
- Stock.
- Acción para agregar al carrito.

El detalle se muestra mediante un modal reutilizable.

---

# 🛒 Carrito de compras

El carrito se encuentra integrado con el backend.

Las operaciones principales son:

- Consultar carrito del usuario.
- Agregar productos.
- Incrementar cantidades.
- Descontar unidades.
- Eliminar productos.
- Vaciar carrito.
- Consultar resumen.
- Actualizar el badge del navbar.
- Controlar stock.
- Confirmar acciones mediante modal.

El carrito está asociado al usuario autenticado.

### Flujo actual

```text
Producto
   ↓
Agregar al carrito
   ↓
API REST
   ↓
Carrito del usuario
   ↓
Actualización de stock
   ↓
Actualización del frontend
```

---

# 🔐 Autenticación

El frontend está integrado con el sistema de autenticación del backend.

Actualmente incluye:

- Registro de usuarios.
- Login mediante usuario y contraseña.
- JWT.
- Persistencia de sesión.
- Control del usuario autenticado.
- Roles `USER` y `ADMIN`.
- Confirmación de correo electrónico.
- Validación de formularios.
- Manejo de errores.

La autenticación se centraliza mediante:

```text
script/api/authApi.js
script/utils/auth.js
script/utils/storage.js
script/utils/validator.js
```

---

# 📧 Confirmación de correo

El registro de usuarios incorpora un proceso de confirmación mediante correo electrónico.

El backend genera un token de verificación y el usuario debe confirmar su cuenta antes de poder utilizarla mediante el flujo tradicional de autenticación.

Esto permite mantener las cuentas registradas deshabilitadas hasta completar la verificación.

---

# 🔵 Login con Google

El proyecto incorpora integración con autenticación mediante Google utilizando OAuth2 en el backend.

En el frontend se encuentra implementado el acceso visual mediante:

```text
Continuar con Google
```

El botón utiliza el logotipo de Google mediante SVG.

La integración completa del flujo frontend/OAuth2 continúa en proceso de verificación.

---

# 👨‍💼 Panel administrativo

El frontend cuenta con una sección administrativa:

```text
pages/admin.html
```

La lógica administrativa se encuentra separada en:

```text
script/pages/admin.js

script/admin/
├── adminCategorias.js
├── adminProductos.js
└── adminUsuarios.js
```

También existe una API específica para usuarios:

```text
script/api/usuariosApi.js
```

El panel está preparado para trabajar con la administración de:

- Productos.
- Categorías.
- Usuarios.

La implementación continúa en evolución y será ampliada con las funcionalidades administrativas restantes.

---

# 🧩 Componentes reutilizables

El proyecto utiliza componentes JavaScript reutilizables.

### Navbar

```text
script/components/navbar.js
```

Se encarga de:

- Mostrar la navegación.
- Gestionar el estado del usuario.
- Mostrar opciones según autenticación/rol.
- Actualizar el badge del carrito.

### Footer

```text
script/components/footer.js
```

Permite reutilizar el footer en las distintas páginas.

### Producto Card

```text
script/components/productoCard.js
```

Componente reutilizable para representar productos.

### Paginador

```text
script/components/paginator.js
```

Gestiona la navegación entre páginas del catálogo.

### Modal de confirmación

```text
script/components/modalConfirmacion.js
```

Reemplaza el uso de `confirm()` del navegador por un modal visual reutilizable.

### Modal de detalles

```text
script/components/modalDetalles.js
```

Muestra la información detallada de un producto.

### Toast

```text
script/components/toast.js
```

Permite mostrar mensajes de éxito, error o información.

### Spinner

```text
script/components/spinner.js
```

Se utiliza para indicar estados de carga.

---

# 🔌 Comunicación con la API

La comunicación con el backend está centralizada mediante:

```text
script/api/apiClient.js
```

A partir de este cliente se organizan las diferentes APIs:

```text
script/api/
├── authApi.js
├── carritoApi.js
├── categoriasApi.js
├── productosApi.js
└── usuariosApi.js
```

Esto permite separar la comunicación HTTP de la lógica de presentación.

---

# 🧰 Utilidades

Las funciones generales se encuentran organizadas en:

```text
script/utils/
```

### auth.js

Funciones relacionadas con:

- Usuario autenticado.
- Token.
- Roles.
- Sesión.

### storage.js

Centraliza operaciones de almacenamiento en el navegador.

### constants.js

Contiene constantes utilizadas por la aplicación.

### validator.js

Centraliza validaciones reutilizables de formularios.

---

# 📱 Responsive Design

El proyecto utiliza:

- CSS Flexbox.
- CSS Grid.
- Media queries.
- Diseño adaptable para dispositivos móviles.
- Componentes específicos para diferentes tamaños de pantalla.

Los estilos se encuentran separados entre:

```text
css/style.css
```

y los estilos específicos:

```text
css/components/
css/pages/
```

---

# 📡 API REST

El frontend consume principalmente los siguientes recursos del backend:

### Productos

```text
GET    /productos
GET    /productos/{id}
POST   /productos
PUT    /productos/{id}
DELETE /productos/{id}
```

### Categorías

```text
GET    /categorias
GET    /categorias/{id}
POST   /categorias
PUT    /categorias/{id}
DELETE /categorias/{id}
```

### Autenticación

```text
POST /auth/register
POST /auth/login
```

### Carrito

```text
GET    /carritos/mi-carrito
GET    /carritos/mi-carrito/resumen
POST   /carritos/productos/{productoId}
PUT    /carritos/productos/{productoId}/descontar
DELETE /carritos/productos/{productoId}
DELETE /carritos/mi-carrito/vaciar
```

> La API completa y su documentación se encuentra en el repositorio del backend.

---

# 📊 Estado actual del proyecto

## 🛍️ Tienda

- [x] Página de inicio
- [x] Catálogo de productos
- [x] Búsqueda
- [x] Filtros
- [x] Paginación
- [x] Modal de producto
- [x] Producto reutilizable
- [x] Carrito desde card
- [x] Carrito desde modal
- [x] Badge del carrito
- [x] Responsive

## 🛒 Carrito

- [x] Integración con backend
- [x] Carrito por usuario autenticado
- [x] Agregar productos
- [x] Incrementar cantidades
- [x] Descontar cantidades
- [x] Eliminar productos
- [x] Vaciar carrito
- [x] Control de stock
- [x] Resumen del carrito
- [x] Modal de confirmación

## 🔐 Autenticación

- [x] Registro
- [x] Login
- [x] JWT
- [x] Gestión de sesión
- [x] Roles USER / ADMIN
- [x] Validaciones
- [x] Confirmación de email
- [ ] Integración completa de Google en frontend

## 👨‍💼 Administración

- [x] Estructura del panel administrativo
- [x] Gestión de productos
- [x] Gestión de categorías
- [x] Gestión de usuarios
- [ ] Revisión y finalización de funcionalidades administrativas

## 💳 Checkout

- [ ] Página de checkout
- [ ] Confirmación de compra
- [ ] Integración de pago
- [ ] Gestión del estado del carrito después de una compra

## 🔧 Finalización

- [ ] Pruebas responsive generales
- [ ] Optimización
- [ ] Limpieza final del código
- [ ] Revisión de seguridad
- [ ] Documentación final
- [ ] Bitácora completa

---

# 🔗 Repositorios

### Frontend

https://github.com/AlanContreras784/tiendaProductosEcologicos

### Backend

https://github.com/AlanContreras784/EntregaFinal-BackEnd-Java

---

# 🧪 Entorno de desarrollo

Para ejecutar el frontend localmente se recomienda utilizar un servidor local debido al uso de:

- JavaScript ES Modules.
- `fetch()`.
- Comunicación con la API REST.
- Recursos externos.

El backend debe encontrarse ejecutándose para utilizar las funcionalidades conectadas a la API.

Backend:

```text
http://localhost:8080
```

Swagger:

```text
http://localhost:8080/swagger-ui/index.html
```

---

# 🌱 Evolución del proyecto

El proyecto comenzó como una tienda web desarrollada principalmente con HTML5 y CSS3.

Posteriormente fue evolucionando hacia una arquitectura frontend modular e integrada con un backend profesional.

```text
HTML + CSS
     ↓
JavaScript
     ↓
JavaScript modular
     ↓
Componentes reutilizables
     ↓
API REST
     ↓
Spring Boot
     ↓
JWT + Spring Security
     ↓
Usuarios + Roles
     ↓
Confirmación de email
     ↓
Carrito asociado al usuario
     ↓
Control de stock
     ↓
OAuth2 / Google
     ↓
Panel administrativo
     ↓
Checkout / Pago
```

---

# 👨‍💻 Autor

Proyecto desarrollado por:

**Alan Contreras**

GitHub:

🔗 https://github.com/AlanContreras784

Proyecto realizado en el marco del programa:

**Talento Tech — Java Full Stack**

---

# 📌 Próximas etapas

El desarrollo continuará con:

1. Finalización de la integración de Google en frontend.
2. Revisión y finalización del Panel Administrativo.
3. Desarrollo del Checkout.
4. Integración del proceso de pago.
5. Pruebas integrales.
6. Optimización y limpieza.
7. Documentación y bitácora final.

---

<div align="center">

### 🌱 Cero Huella

**Tecnología para una experiencia de compra más simple y responsable.**

</div>
