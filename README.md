# Cero Huella — Tienda de Productos Ecológicos

E-commerce de productos ecológicos desarrollado como proyecto final, con frontend en JavaScript Vanilla y backend REST en Spring Boot.

El proyecto implementa autenticación, registro con confirmación por email, login con Google, catálogo, categorías, carrito por usuario, checkout y despliegue en producción.

---

## Estado actual

El backend está terminado, probado y desplegado.

El frontend está integrado con el backend y las funcionalidades principales de autenticación, tienda, carrito y checkout inicial están funcionando.

### Completado y probado

- Registro de usuarios.
- Validación de formularios.
- Contraseña segura.
- Confirmación de email.
- Redirección a la página de confirmación.
- Login.
- Logout.
- JWT.
- Roles de usuario.
- Login con Google.
- Navbar dinámico según sesión y rol.
- Catálogo de productos.
- Categorías.
- Tarjetas de productos.
- Modal de detalle de producto.
- Paginación.
- Toasts.
- Spinner.
- Carrito asociado al usuario autenticado.
- Agregar productos.
- Aumentar cantidades.
- Disminuir cantidades.
- Eliminar productos.
- Vaciar carrito.
- Resumen del carrito.
- Badge del carrito.
- Modal de confirmación.
- Botón "Proceder al pago".
- Navegación carrito → checkout.
- Checkout.
- Carga de productos del carrito.
- Cantidades y precios en checkout.
- Subtotal, envío y total.
- Validación de datos de envío.
- Botón "Continuar al pago".
- Toast de confirmación de datos enviados.
- Responsive del formulario de registro.
- Despliegue del backend en Render.
- Base de datos en TiDB Cloud.
- Frontend desplegado en Vercel.

### Pendiente

- Verificación de stock en tiempo real al iniciar el pago.
- Creación y persistencia del pedido.
- Detalle del pedido.
- Reserva/descuento seguro de stock al confirmar.
- Integración del medio de pago.
- Confirmación final de compra.
- Comprobante/factura.
- Vaciar el carrito después de una compra confirmada.
- Revisión y tratamiento final de imágenes.
- Panel de administración.
- Endpoint específico para administración.
- Revisión responsive general.
- Revisión final de producción.
- Documentación definitiva.

---

# Arquitectura del proyecto

## Frontend

Tecnologías principales:

- HTML5
- CSS3
- JavaScript Vanilla
- Bootstrap 5
- Font Awesome
- Vercel

El frontend está organizado por responsabilidades:

```text
/
├── index.html
├── pages/
│   ├── carrito.html
│   ├── checkout.html
│   ├── confirmacion.html
│   ├── contacto.html
│   ├── login.html
│   ├── registro.html
│   └── tienda.html
│
├── css/
│   ├── style.css
│   ├── carrito.css
│   ├── pages/
│   │   └── checkout.css
│   └── components/
│       ├── banner.css
│       ├── modalProducto.css
│       ├── newsletter.css
│       ├── productoCard.css
│       └── toast.css
│
└── script/
    ├── api/
    │   ├── apiClient.js
    │   ├── authApi.js
    │   ├── carritoApi.js
    │   ├── categoriasApi.js
    │   └── productosApi.js
    │
    ├── components/
    │   ├── footer.js
    │   ├── modalConfirmacion.js
    │   ├── modalProducto.js
    │   ├── navbar.js
    │   ├── paginator.js
    │   ├── productoCard.js
    │   ├── spinner.js
    │   └── toast.js
    │
    ├── pages/
    │   ├── carrito.js
    │   ├── checkout.js
    │   ├── home.js
    │   ├── login.js
    │   ├── registro.js
    │   └── tienda.js
    │
    └── utils/
        ├── auth.js
        ├── constants.js
        ├── formatter.js
        ├── storage.js
        └── validator.js
```

---

# Backend

Tecnologías:

- Java
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- MySQL/TiDB Cloud
- Maven
- Lombok
- Bean Validation
- Swagger / OpenAPI
- Docker
- Render

Arquitectura:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Se utilizan DTOs y mappers para evitar devolver directamente las entidades JPA desde los endpoints.

También se implementa manejo global de excepciones mediante:

- `ApiResponse<T>`
- `ApiError`
- `GlobalExceptionHandler`

---

# Autenticación

El sistema utiliza JWT para autenticar usuarios.

Flujo:

```text
Registro
   ↓
Confirmación por email
   ↓
Login
   ↓
JWT
   ↓
Acceso a recursos protegidos
```

El frontend almacena el token y lo utiliza mediante `apiClient.js`.

El navbar se adapta según:

- Usuario autenticado.
- Usuario no autenticado.
- Rol del usuario.

## Registro

El formulario solicita:

- Username.
- Nombre.
- Apellido.
- Email.
- Contraseña.
- Repetición de contraseña.

La contraseña requiere:

- Mínimo 8 caracteres.
- Una mayúscula.
- Una minúscula.
- Un número.

## Confirmación de email

Después del registro se envía un correo de confirmación.

La confirmación redirige a:

```text
/pages/confirmacion.html
```

Una vez confirmada la cuenta, el usuario puede iniciar sesión.

## Google Login

El botón de Google está integrado y fue probado.

El backend devuelve la información de autenticación correspondiente, incluyendo token, username y rol.

---

# Tienda

La tienda obtiene los productos desde el backend.

Incluye:

- Listado de productos.
- Categorías.
- Paginación.
- Tarjetas de producto.
- Modal de detalle.
- Stock.
- Precio.
- Integración con carrito.

---

# Carrito

El carrito pertenece al usuario autenticado.

Funcionalidades:

- Agregar productos.
- Aumentar cantidad.
- Disminuir cantidad.
- Eliminar producto.
- Vaciar carrito.
- Mostrar subtotal.
- Mostrar envío.
- Mostrar total.
- Actualizar badge del navbar.
- Modal de confirmación.

Flujo actual:

```text
Tienda
   ↓
Agregar al carrito
   ↓
Carrito
   ↓
Proceder al pago
   ↓
Checkout
```

---

# Checkout

El checkout actualmente permite:

- Cargar productos del carrito.
- Mostrar cantidades.
- Mostrar precios.
- Mostrar subtotal.
- Mostrar envío.
- Mostrar total.
- Completar datos de envío.
- Validar los datos.
- Continuar al siguiente paso.

Datos solicitados:

- Nombre.
- Apellido.
- Email.
- Teléfono.
- Dirección.
- Ciudad.
- Provincia.
- Código postal.

Actualmente el botón "Continuar al pago" valida los datos y muestra un toast de confirmación.

## Próxima etapa del checkout

Para completar un flujo de compra real se debe implementar:

```text
Checkout
   ↓
Verificar stock actual
   ↓
Crear pedido
   ↓
Guardar datos de envío
   ↓
Guardar detalle del pedido
   ↓
Verificar stock nuevamente
   ↓
Descontar/reservar stock
   ↓
Procesar pago
   ↓
Confirmar pedido
   ↓
Generar comprobante
```

La comprobación definitiva del stock debe realizarse en el backend para evitar problemas cuando dos usuarios intentan comprar simultáneamente las mismas unidades.

---

# Pedido y factura

Esta etapa todavía está pendiente.

El pedido deberá conservar la información necesaria para que la compra no dependa de los valores actuales del catálogo.

Como mínimo:

```text
Pedido
├── id
├── usuario
├── fecha
├── estado
├── subtotal
├── envío
└── total
```

Y su detalle:

```text
DetallePedido
├── producto
├── cantidad
├── precio unitario
└── subtotal
```

Los datos de envío deberán quedar asociados al pedido.

El precio unitario utilizado en el pedido deberá conservarse aunque posteriormente cambie el precio del producto en el catálogo.

---

# Stock

La estrategia prevista para la compra es verificar el stock en más de un momento.

## Al iniciar el pago

Se comprueba el stock disponible actualmente.

Si el stock no alcanza, el usuario debe ser informado y no podrá continuar.

## Al confirmar la compra

El backend debe volver a comprobar el stock dentro de una operación segura/transaccional antes de confirmar el pedido.

Esto evita depender exclusivamente de una comprobación realizada en JavaScript.

---

# Validaciones

Las validaciones del frontend se centralizan en:

```text
script/utils/validator.js
```

Se utilizan para:

- Campos obligatorios.
- Email.
- Texto.
- Contraseña.
- Confirmación de contraseña.
- Teléfono.
- Código postal.

Los errores se muestran junto a los campos correspondientes.

---

# Componentes reutilizables

El frontend utiliza componentes independientes para:

- Navbar.
- Footer.
- Toast.
- Spinner.
- Modal de confirmación.
- Modal de producto.
- Producto.
- Paginación.

Esto permite reutilizar la misma estructura en las diferentes páginas.

---

# Manejo de API

Las llamadas al backend se centralizan mediante:

```text
script/api/apiClient.js
```

Los módulos específicos contienen las operaciones de cada recurso:

```text
authApi.js
productosApi.js
categoriasApi.js
carritoApi.js
```

No se utiliza `fetch` directamente desde las páginas.

---

# Variables de entorno

El backend utiliza variables de entorno para información sensible.

Ejemplo:

```env
JWT_SECRET=
DB_URL=
DB_USERNAME=
DB_PASSWORD=
APP_BASE_URL=
FRONTEND_URL=
RESEND_API_KEY=
RESEND_ADMIN_EMAIL=
```

Los valores reales no deben subirse al repositorio.

El archivo `.env` se encuentra excluido mediante `.gitignore`.

---

# Base de datos

La base de datos utilizada en producción es TiDB Cloud mediante conexión compatible con MySQL.

Base principal:

```text
productos_ecologicos
```

La conexión utiliza SSL y el puerto correspondiente de TiDB Cloud.

---

# Despliegue

## Backend

Repositorio:

https://github.com/AlanContreras784/EntregaFinal-BackEnd-Java

Plataforma:

Render

El backend se ejecuta mediante Docker.

## Frontend

Repositorio:

https://github.com/AlanContreras784/tiendaProductosEcologicos

Plataforma:

Vercel

## Base de datos

Plataforma:

TiDB Cloud

---

# Seguridad

Se aplican varias medidas:

- JWT.
- Spring Security.
- Contraseñas gestionadas por Spring Security.
- Roles `USER` y `ADMIN`.
- Variables de entorno para secretos.
- `.env` excluido de Git.
- Validaciones mediante Bean Validation.
- DTOs para las respuestas.
- Control de acceso a recursos protegidos.

El endpoint específico para administración queda pendiente para la etapa final.

---

# Responsive Design

Ya se trabajó especialmente el responsive del registro.

Incluye:

- Dos columnas en escritorio.
- Una columna en dispositivos pequeños.
- Botón adaptable.
- Ajustes para pantallas móviles.

Queda pendiente realizar una revisión responsive general de todas las páginas como parte de la revisión final.

---

# Flujo general actual

```text
Inicio
  ↓
Tienda
  ↓
Producto
  ↓
Agregar al carrito
  ↓
Carrito
  ↓
Proceder al pago
  ↓
Checkout
  ↓
Validación
  ↓
Continuar al pago
```

El siguiente bloque agregará:

```text
Verificación de stock
  ↓
Pedido
  ↓
Pago
  ↓
Confirmación
  ↓
Comprobante
```

---

# Problemas resueltos durante el desarrollo

## Confirmación de email

El enlace de confirmación inicialmente apuntaba a una ruta incorrecta del frontend.

La redirección fue corregida para utilizar:

```text
/pages/confirmacion.html
```

El flujo fue probado correctamente.

## Integración con Render

Se configuró el despliegue mediante Docker y variables de entorno.

El backend responde correctamente en producción.

## TiDB Cloud

La base de datos fue configurada para trabajar con el backend desplegado.

## Carrito por usuario

El carrito se obtiene asociado al usuario autenticado mediante JWT.

## Navbar

El navbar se adapta según el estado de autenticación y rol.

---

# Próximas etapas

## 1. Compra y pedido

- Verificación de stock.
- Crear pedido.
- Guardar datos de envío.
- Guardar detalle del pedido.
- Control transaccional del stock.
- Estado del pedido.

## 2. Pago

- Seleccionar método de pago.
- Integrar proveedor de pago.
- Procesar resultado.
- Manejar pago aprobado/rechazado.

## 3. Confirmación

- Confirmación de compra.
- Comprobante.
- Vaciar carrito después de compra confirmada.
- Estado final del pedido.

## 4. Imágenes

- Revisar imágenes de productos.
- Revisar imágenes de categorías.
- Revisar imágenes de secciones.
- Ajustar `object-fit`.
- Revisar tamaños.
- Revisar responsive.

## 5. Administración

- Panel administrativo.
- Crear productos.
- Editar productos.
- Eliminar productos.
- Gestionar categorías.
- Gestionar usuarios.
- Protección por rol `ADMIN`.
- Endpoint administrativo del backend.

## 6. Revisión final

- Navegación.
- Registro.
- Confirmación de email.
- Login.
- Logout.
- Google Login.
- Tienda.
- Categorías.
- Modal.
- Carrito.
- Checkout.
- Pago.
- Responsive.
- Consola del navegador.
- Network.
- Visual.
- Producción.

---

# Documentación

Durante el desarrollo se mantiene una bitácora con los cambios realizados y las funcionalidades probadas.

La documentación final deberá incluir:

- Descripción del proyecto.
- Tecnologías.
- Arquitectura.
- Instalación.
- Variables de entorno.
- URLs de producción.
- Funcionalidades.
- Capturas.
- Consideraciones.
- Flujo de compra.

---

# Autor

**Alan Contreras Flores**

GitHub:

https://github.com/AlanContreras784

Proyecto:

**Cero Huella — Productos Ecológicos**

> La tecnología al servicio de la gente.
