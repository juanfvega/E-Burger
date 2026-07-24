# 🍔 Burger House - App de Hamburguesas

¡Bienvenido a **Burger House**! Esta es una aplicación web moderna y premium diseñada para una hamburguesería, permitiendo a los usuarios explorar el menú por categorías, gestionar un carrito de compras y realizar pedidos que se envían directamente por WhatsApp y se guardan de forma centralizada en una base de datos.

---

## 🚀 Introducción

Burger House es una solución Full-Stack moderna construida sobre **Next.js** y **Payload CMS**. Su principal objetivo es ofrecer una experiencia de usuario (UX) sumamente fluida, interactiva y móvil-primero (Mobile-First) para realizar pedidos online, combinando la flexibilidad de un gestor de contenidos (CMS) para el dueño del negocio con un flujo de checkout automatizado hacia WhatsApp.

---

## 🛠️ Arquitectura y Stack Tecnológico

La aplicación se divide en tres capas principales perfectamente sincronizadas:

### 1. 💻 Frontend (Next.js)
El frontend está desarrollado utilizando las últimas características de **Next.js (App Router)** y **React 19**.
* **Estructura de Rutas:**
  * `/categories`: Página de inicio responsiva que muestra las categorías del menú de forma dinámica con imágenes administrables.
  * `/categories/[categories]`: Listado dinámico de productos filtrados por la categoría seleccionada.
  * `/detailCategories/[id]`: Ficha técnica y visual de cada hamburguesa o producto con selector de cantidad.
  * `/checkout`: Formulario de datos de envío y facturación con desglose de precios en tiempo real.
* **Gestión del Estado:** 
  * `CartContext` con persistencia en `localStorage` para retener los productos seleccionados incluso si el usuario recarga la página.
* **Integración con WhatsApp:**
  * Un hook personalizado (`useWhatsApp`) que genera un mensaje enriquecido y formateado detallando: nombre del cliente, método de entrega (envío/retiro), dirección completa, desglose de hamburguesas y el costo final de la compra.

### 2. ⚙️ Backend (Payload CMS 3.x)
El backend actúa como un motor headless autohospedado dentro de la misma aplicación Next.js, proveyendo un Panel de Administración intuitivo y seguro para el negocio.
* **Colecciones del CMS:**
  * **Categories:** Gestión dinámica de categorías con nombre, slug, emoji e imágenes de portada.
  * **Products:** Menú autoadministrable (nombre, descripción, precio, stock, categoría y fotos).
  * **Clients:** Registro de información de contacto de los clientes que han comprado.
  * **Orders:** Registro de transacciones con un hook de servidor (`beforeChange`) que calcula el total de forma segura en el servidor, asocia los precios históricos de compra y añade el costo de envío dinámicamente si corresponde.
  * **Media:** Repositorio centralizado de imágenes optimizadas con soporte para recorte y redimensionamiento automático.

### 3. 🗄️ Base de Datos (MongoDB)
Toda la información del negocio se almacena en una base de datos no relacional **MongoDB**, conectada mediante el adaptador oficial de Mongoose en Payload CMS.
* Almacena de forma persistente los productos, categorías dinámicas, usuarios administradores, registros de clientes y el histórico de pedidos generados.

---

## ⚙️ Reglas de Negocio Clave

* **Costo de Envío Centralizado:** 
  El costo de envío a domicilio está definido en un único archivo de configuración (`src/constants/delivery.ts`). Esto alimenta tanto al checkout visual en el frontend como al cálculo transaccional del total en el servidor de base de datos.
* **Integración Atómica:**
  El proceso de compra realiza una única petición `POST` al endpoint `/api/checkout`. Este crea de manera atómica el perfil del cliente y la orden asociada en el backend antes de proceder con el redireccionamiento a WhatsApp, asegurando que nunca se pierda un registro de venta.

---

## 🛠️ Instalación y Desarrollo Local

### Requisitos Previos
* **Node.js** (Versión 18.20.2 o superior compatible con Next.js 16/Payload 3)
* Una instancia de **MongoDB** activa (local o en MongoDB Atlas)

### Pasos para iniciar el proyecto

1. **Clonar el repositorio e instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar las variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto con la siguiente estructura:
   ```env
   DATABASE_URL=mongodb://localhost:27017/burger-house
   PAYLOAD_SECRET=tu_secreto_seguro_aqui
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000` y el panel de administración en `http://localhost:3000/admin`.

4. **Crear el primer usuario Administrador:**
   Al acceder por primera vez a `http://localhost:3000/admin`, Payload te solicitará ingresar un correo y contraseña para crear tu cuenta de administrador inicial.
