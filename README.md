# Lila del Alba — E-commerce

## Descripción

Tienda online de **Lila del Alba**, emprendimiento de cosmética natural y aromatización:
jabones exfoliantes, cremas y aceites corporales, sérum hidratante, bálsamo labial,
shampoo y acondicionador sólidos, difusores ambientales, spray textil y velas de soja.

El proyecto avanza por etapas. Hasta ahora tiene el **listado dinámico de productos** (con filtro por categoría), la **vista de detalle**,
la **navegación con React Router** (rutas anidadas con un layout compartido) y un **carrito de compras** basado en Context API.
En esta etapa se integró **Firebase**: el catálogo se lee de **Cloud Firestore**, los usuarios se **registran, inician y cierran sesión**
con **Firebase Authentication** (el estado se maneja con un `AuthContext` y se mantiene al recargar la página), el **checkout está protegido**
(solo lo usan usuarios con sesión iniciada) y cada compra se guarda como una **orden** en Firestore, asociada al usuario.

La interfaz sigue la **identidad visual refinada** de la marca (ver "Identidad visual"), es **responsive** (menú hamburguesa y
grilla de 2 columnas en celulares) y la home incluye un **banner en forma de carrusel cuyas promociones se editan sin tocar el código**
(ver "Banner de novedades y promociones").

## Tecnologías utilizadas

- [React 19](https://react.dev/)
- [React Router](https://reactrouter.com/) (`react-router-dom`)
- [Vite](https://vite.dev/)
- JavaScript (ES Modules)
- CSS tradicional (un archivo por componente y variables de color globales)
- [Firebase](https://firebase.google.com/): **Cloud Firestore** (catálogo y órdenes) y **Firebase Authentication** (email y contraseña)
- Tipografía [Outfit](https://fonts.google.com/specimen/Outfit) (Google Fonts), la misma del sitio de la marca
- ESLint
- Node.js y npm
- Git y GitHub

## Instalación y ejecución

Requisitos: [Node.js](https://nodejs.org/) (versión 20 o superior) y un proyecto de Firebase propio (ver "Firebase").

```bash
# 1. Clonar el repositorio
git clone https://github.com/gonzasingh/lila-del-alba-ecommerce.git

# 2. Entrar a la carpeta del proyecto
cd lila-del-alba-ecommerce

# 3. Instalar dependencias
npm install

# 4. Crear el archivo .env a partir de la plantilla y completarlo con los datos de tu app de Firebase
cp .env.example .env        # en Windows (PowerShell): copy .env.example .env

# 5. Iniciar el servidor de desarrollo
npm run dev
```

Luego abrir en el navegador la dirección que indica la terminal (por defecto `http://localhost:5173`).
Otros comandos: `npm run build` (versión de producción), `npm run lint` y `npm run seed` (carga inicial de datos en Firestore).

### Variables de entorno

La configuración de Firebase **no está escrita en el código**: se lee de variables de entorno que van en un archivo `.env`
(que **no se sube a GitHub**: está en `.gitignore`). `.env.example` es la plantilla, sin valores.

| Variable | Qué es |
|----------|--------|
| `VITE_FIREBASE_API_KEY` | API key de la app web de Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Dominio de Authentication (`<proyecto>.firebaseapp.com`) |
| `VITE_FIREBASE_PROJECT_ID` | Id del proyecto |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket de Storage |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Id del remitente de mensajes |
| `VITE_FIREBASE_APP_ID` | Id de la app web |
| `VITE_BANNERS_URL` | *(opcional)* URL remota con el JSON de banners |

Todos los datos salen de *Consola de Firebase → Configuración del proyecto → Tus apps → Configuración del SDK*.
Después de cambiar el `.env` hay que reiniciar `npm run dev`.

## Rutas

La navegación usa React Router. `BrowserRouter` envuelve la aplicación en `App.jsx`, y las rutas están **anidadas**:
una ruta padre sin `path` renderiza el `Layout` (Navbar + Footer) y todas las demás se dibujan dentro de su `<Outlet />`.
Así el Navbar, el `CartWidget` y el Footer están presentes en todas las páginas, incluso en el error 404.

```jsx
<BrowserRouter>
  <AuthProvider>
    <CartProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<ItemListContainer greeting="..." />} />
          <Route path="/category/:id" element={<ItemListContainer />} />
          <Route path="/item/:id" element={<ItemDetailContainer />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<AuthForm modo="login" />} />
          <Route path="/registro" element={<AuthForm modo="registro" />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </CartProvider>
  </AuthProvider>
</BrowserRouter>
```

| Ruta | Muestra |
|------|---------|
| `/` | Catálogo completo (`ItemListContainer`) |
| `/category/:id` | Catálogo filtrado por la categoría de la URL (`ItemListContainer`). Si la categoría no existe, muestra `NotFound`. |
| `/item/:id` | Detalle del producto cuyo id está en la URL (`ItemDetailContainer`) |
| `/cart` | Carrito de compras (`Cart`) |
| `/login` | Inicio de sesión (`AuthForm modo="login"`). Si ya hay sesión iniciada, redirige a donde el usuario quería ir (o al inicio). |
| `/registro` | Registro con email y contraseña (`AuthForm modo="registro"`) |
| `/checkout` | **Ruta protegida** (`ProtectedRoute` + `Checkout`): datos de entrega y confirmación de la compra. Sin sesión iniciada redirige a `/login`; con el carrito vacío redirige a `/cart`. |
| `*` | Error 404: página no encontrada (`NotFound`) |

- **Links sin recargas:** toda la navegación interna usa `Link` / `NavLink` (nunca `<a>`), así que la página no se recarga y el estado de React se conserva.
- **Sincronía de datos:** `ItemListContainer` lee el `:id` con `useParams` y lo incluye en el array de dependencias de su `useEffect`,
  por lo que el listado se vuelve a filtrar solo cuando cambia la URL (por ejemplo, al elegir otra categoría o con el botón "atrás" del navegador).
- **Sin ids "a mano":** hay una única ruta `/item/:id` para todos los productos; `ItemDetailContainer` toma el id de la URL y busca los datos.

## Componentes

Todos los componentes viven en `src/components`, cada uno con su archivo `.jsx` y su hoja de estilos `.css`.

| Componente | Descripción |
|------------|-------------|
| `Layout` | Estructura compartida por todas las rutas: `Navbar`, `Footer` y un `<Outlet />` donde se dibuja la página de la ruta actual. También incluye `ScrollToTop`. |
| `Navbar` | Barra de navegación fija en la parte superior: arriba de todo se ve **integrada en la página** (transparente) y al bajar más de 24 px se convierte en una **píldora de vidrio translúcido** y redondeada (estilo liquid glass). Muestra el logo horizontal de la marca, las categorías de productos (generadas con `map` a partir de `src/constants/categories.js`) como `NavLink` a `/category/:categoryId`, el `UserWidget` y el `CartWidget`. En pantallas de hasta 900 px las categorías pasan a un **menú desplegable tipo hamburguesa**: se abre y cierra con el botón (`aria-expanded`), se cierra al elegir una categoría, con la tecla Escape o al tocar fuera de la barra. |
| `Banner` | Carrusel de novedades y promociones de la home. Lee sus diapositivas de un JSON editable (ver más abajo), avanza solo cada 6 segundos, se pausa con el mouse encima, con el foco o con el botón de pausa, y se puede recorrer con las flechas, los puntos, deslizando con el dedo o con las teclas ← →. |
| `CartWidget` | Link a `/cart` con el ícono y un círculo con la cantidad total de unidades (`totalItems`, que lee del contexto con `useCart`). Con el carrito vacío no muestra el número. |
| `ItemListContainer` | Contenedor del catálogo. Lee el `id` de la URL (`/category/:id`), obtiene los productos con `getProducts(categoryId)` dentro de un `useEffect`, los guarda en el estado `items` y se los pasa por props a `ItemList`. Maneja los estados de carga y de error. En la home (`/`) muestra el `Banner` arriba; en todas las rutas muestra el título, la cantidad de productos, el buscador y el orden (`ProductToolbar`). No hace el `.map()`. |
| `ProductToolbar` | Buscador y selector de orden (orden de la lista, precio de menor a mayor o de mayor a menor). La búsqueda mira nombre, descripción y presentación, sin distinguir mayúsculas ni tildes; sin coincidencias se ofrece "Limpiar búsqueda". La lógica está en `utils/filtrarProductos.js`. |
| `ItemList` | Recibe los productos por props (`items`), los recorre con `.map()` y renderiza un `Item` por cada uno, usando el `id` del producto como `key`. En celulares (hasta 600 px) la grilla pasa a **2 columnas**, de modo que en cada pantalla se ven 4 productos (2 filas de 2). |
| `Item` | Card con la información **resumida** de un producto (imagen, categoría, nombre y precio) y un link "Ver detalle" a `/item/:id`. |
| `ItemDetailContainer` | Contenedor del detalle. Lee el `id` de la URL (`/item/:id`), ejecuta `getProductById` dentro de un `useEffect`, guarda el producto en el estado `product` y se lo entrega por props a `ItemDetail`. No contiene el diseño del producto ni toca el carrito. |
| `ItemDetail` | Presentación del detalle completo: imagen, categoría, nombre, precio, descripción, stock y la información que no aparece en la card (presentación, envase, características y precio por pack x10). Antes de agregar se eligen con botones la **fragancia** y las **opciones propias** del producto (arcilla, tipo de cabello, color). **Consume el contexto** (`useCart`): al confirmar una cantidad en `ItemCount` llama a `addItem({ ...product, selection }, quantity)` y, una vez agregado, muestra un aviso con **"Ver carrito"** y **"Seguir comprando"** (vuelve a mostrar las opciones para agregar otra variedad). El link "Volver" lleva a la **categoría** del producto. |
| `OptionPicker` | Grupo de opciones con forma de botón, de elección única (radios nativos, accesibles por teclado). |
| `ItemCount` | Contador de cantidad reutilizable. Recibe el `stock` por props: no permite superarlo ni bajar de cero. El botón "Agregar al carrito" informa la cantidad elegida a través de la prop `onAdd`. |
| `Cart` | Página del carrito (ruta `/cart`). Con el carrito vacío muestra un mensaje y un link para volver al catálogo. Con productos lista, de cada uno, nombre, cantidad, precio unitario y subtotal, con un botón "Eliminar" por producto; además muestra el **total**, el botón "Vaciar carrito" y "Finalizar compra", que lleva a `/checkout`. |
| `ResumenCompra` | Resumen (unidades, descuento por pack y total) que comparten el carrito y el checkout. |
| `AuthForm` | Formulario de **inicio de sesión** y de **registro** (la prop `modo` elige cuál). Valida email y contraseña, muestra los errores de Firebase traducidos (cuenta repetida, contraseña débil, credenciales incorrectas...) y, al ingresar, redirige a la página que el usuario quería ver. |
| `ProtectedRoute` | Envuelve una ruta que requiere sesión. Mientras Firebase valida la sesión muestra un indicador de carga; sin usuario redirige a `/login` guardando a dónde quería ir. |
| `UserWidget` | En el Navbar: link "Ingresar" si no hay sesión; con sesión, el **email del usuario** y el botón **"Cerrar sesión"** (en celulares van dentro del menú desplegable). |
| `Checkout` | Página `/checkout`: muestra el pedido y el resumen, incluye el `CheckoutForm` y genera la orden con `crearOrden`. Antes de crearla vuelve a verificar que haya usuario y productos. Si sale bien muestra el **id de la orden** y recién ahí **vacía el carrito**; si falla, muestra el error y el carrito queda intacto. |
| `CheckoutForm` | Formulario de entrega (nombre y apellido, teléfono, dirección, ciudad e información adicional opcional) con validación: no entrega los datos si falta alguno o es inválido. Muestra el email de la cuenta con la que se compra. |
| `Footer` | Pie de página sobre fondo oscuro con la versión del logo para fondo oscuro, las categorías y links a la tienda y al carrito (con `Link`). Se muestra en todas las rutas gracias al `Layout`. |
| `NotFound` | Mensaje para rutas o categorías inexistentes, con un link al catálogo. |
| `Cargando` | Indicador de carga que comparten los contenedores. |
| `ScrollToTop` | Vuelve al inicio de la página cada vez que cambia la ruta. |

## Carga de datos asíncrona

Los contenedores piden los datos a `src/services/products.js`, que consulta **Cloud Firestore** (la tienda ya no tiene arrays ni promesas simuladas).
Mientras llega la respuesta se muestra un indicador de carga (`Cargando`) y, si falla, un mensaje de error.

**1. Los servicios** (`src/services/products.js`). Funciones `async` que usan el SDK de Firestore:

```js
// Listado: todos los productos, o solo los de una categoría (el filtro lo hace Firestore con where)
export const getProducts = async (categoryId) => {
  const coleccion = collection(db, 'products')
  const consulta = categoryId ? query(coleccion, where('category', '==', categoryId)) : coleccion
  const respuesta = await getDocs(consulta)
  return respuesta.docs.map(aProducto) // el id del documento pasa a ser el id del producto
}

// Detalle: UN producto por su id, con doc() y getDoc(). Si no existe, lanza un error.
export const getProductById = async (productId) => {
  const documento = await getDoc(doc(db, 'products', String(productId)))
  if (!documento.exists()) throw new Error(...)
  return aProducto(documento)
}
```

**2. La carga inicial de datos.** Los productos se suben a Firestore una sola vez con `npm run seed`, que lee `scripts/data/products.js`
(es solo el material de la carga: la tienda nunca importa ese archivo).

**3. La llamada desde React.** Los dos contenedores usan el mismo patrón:

- `useState` guarda el resultado (`items` en el listado, `product` en el detalle) y los estados de carga y de error.
- `useEffect` dispara la carga. Su array de dependencias es `[categoryId]` en el listado y `[productId]` en el detalle,
  así que la carga ocurre al montar el componente y se repite cuando cambia la URL (por ejemplo, al pasar de una categoría a otra).
- Dentro del efecto se define una función `async` que hace `await` de la promesa y guarda el resultado con el setter del estado.
  Si el componente se desmonta o cambia la URL antes de que llegue la respuesta, ese resultado se descarta.
- Si la promesa se rechaza, el `catch` muestra un mensaje de error en pantalla (en el detalle distingue "el producto no existe" de "falló la consulta").

## Detalle de producto

```
getProductById       →  busca el producto por id y devuelve una promesa
ItemDetailContainer  →  ejecuta la promesa y administra el estado (carga, error, producto)
   └─ ItemDetail     →  muestra la información completa y agrega al carrito con useCart()
        └─ ItemCount →  controla la cantidad seleccionada (recibe el stock que todavía queda disponible)
```

`ItemCount` mantiene su lógica separada del detalle y respeta dos límites: la cantidad **no supera el stock** y **no baja de cero**
(los botones se deshabilitan en cada extremo, y "Agregar al carrito" se deshabilita con cantidad cero).

## Carrito

El estado del carrito se comparte con toda la aplicación mediante Context API. Todo vive en `src/context/CartContext.jsx`, que exporta:

- `CartContext`: el contexto (`createContext`).
- `CartProvider`: componente que guarda el carrito (un array) en un `useState` y expone el valor del contexto. Envuelve todas las rutas en `App.jsx`,
  por eso el carrito **no se pierde al navegar** entre páginas.
- `useCart()`: custom hook (`useContext`) para usar el carrito desde cualquier componente; avisa si se usa fuera del `CartProvider`.

| Valor del contexto | Qué hace |
|--------------------|----------|
| `cart` | Array de líneas agregadas: `{ lineId, id, name, price, priceX10, img, category, stock, selection, quantity }`. `selection` guarda lo elegido (`[{ label, value }]`). Hay una línea por cada combinación distinta de producto y opciones. |
| `lines` | Las mismas líneas con el precio ya calculado: `unidadesPack`, `unidadesNormales`, `subtotalSinDescuento` y `subtotal`. |
| `addItem(item, quantity)` | Agrega un producto (lo elegido viaja en `item.selection`). Si ya hay uno idéntico (mismo `id` y mismas opciones) **no lo duplica**: suma la cantidad (sin superar el stock del producto, contando todas sus variedades). |
| `removeItem(itemId, lineId?)` | Elimina un producto por su id. Si se indica el `lineId`, quita solo esa variedad. |
| `clear()` | Vacía el carrito por completo. |
| `isInCart(id)` | Devuelve un booleano: `true` si el producto ya está en el carrito. |
| `getQuantity(id)` | Unidades de ese producto que hay en el carrito, sumando sus variedades (0 si no está). |
| `totalItems` | Suma de las cantidades de todos los productos (es el número del `CartWidget`). |
| `subtotal` / `discount` / `totalPrice` | Total a precio de lista, descuento por packs y total a pagar. |

**Inmutabilidad:** todas las actualizaciones crean copias y nunca modifican el array original: `addItem` usa `.map()` para sumar la cantidad
a una línea existente y `[...prev, nueva]` para agregar una nueva; `removeItem` usa `.filter()`; `clear` reemplaza el estado por un array nuevo.
Los totales se calculan a partir del carrito, no se guardan aparte.

**Opciones antes de agregar:** en el detalle las elecciones son **botones** (`OptionPicker`, radios nativos con forma de botón) y hay que completarlas todas para
poder agregar. Son la fragancia (`aromas`) y las opciones declaradas en el campo `options` de cada producto: color de la arcilla (jabones con arcilla), tipo de cabello
(shampoo) y con o sin color (bálsamos). Las versiones con y sin fragancia son productos separados del catálogo.

**Descuento por pack x10** (`src/utils/precios.js`): el pack son 10 unidades **exactamente iguales** (mismo producto, misma fragancia y mismas opciones).
Por cada 10 se aplica `priceX10` y las restantes van a precio normal (11 = 10 en pack + 1 normal; 20 = 20 en pack). Combinar variedades no cuenta:
6 de una fragancia y 5 de otra no tienen descuento. Los productos de **hogar** no tienen precio por pack. El carrito muestra el desglose en la línea y el
descuento en el resumen. Con el stock de ejemplo, los productos con menos de 10 unidades nunca llegan al pack.

**Flujo de compra:** en el detalle, `ItemCount` recibe como stock lo que **todavía queda disponible** (stock menos lo que ya está en el carrito),
así que nunca se puede agregar más que el stock total. Al tocar "Agregar al carrito", `ItemDetail` llama a `addItem` y muestra el aviso
con "Ver carrito" y "Seguir comprando". En el carrito el cliente ve cada producto con sus opciones, cantidad,
precio unitario y subtotal, puede eliminarlos de a uno o vaciar el carrito, y ve el total antes de decidir. "Finalizar compra" lleva al checkout (ver "Firebase").
El carrito vive en memoria, por lo que se vacía al recargar la página (la **sesión** del usuario, en cambio, sí se conserva).

## Firebase

La conexión se centraliza en **`src/firebase/config.js`**: inicializa la app con las variables `VITE_FIREBASE_*` (ver "Variables de entorno") y exporta
`db` (Cloud Firestore) y `auth` (Firebase Authentication). Los componentes no usan el SDK directamente: pasan por los servicios
(`src/services/products.js`, `orders.js`, `auth.js`) y por los contextos.

### Colecciones de Firestore

| Colección | Contenido | Quién la usa |
|-----------|-----------|--------------|
| `products` | Un documento por producto (el id del documento es el id del producto), con `order` para ordenar. | `services/products.js` (listado, categoría con `where` y detalle con `getDoc`) |
| `orders` | Una orden por compra, asociada al usuario autenticado. | `services/orders.js` (`addDoc`) |
| `banners` | Una diapositiva por documento (mismos campos que `banners.json`, más `order`). | `services/banners.js` |

**Documento de `products`** (el id del documento, por ejemplo `"2"`, es el id del producto; `aromas`, `presentation` y `container` aparecen solo en los productos que los tienen):

```json
{
  "name": "Jabón exfoliante masajeador con arcilla, sin aroma",
  "description": "Jabón exfoliante masajeador que suma arcilla a la base de avena o carbón activado. Se presenta sin aroma.",
  "price": 2500,
  "priceX10": 2300,
  "category": "jabones",
  "img": "/productos/jabon-avena-carbon.jpg",
  "stock": 32,
  "order": 2,
  "features": ["Con avena coloidal / carbón activado", "Con arcilla blanca / café", "Sin aroma"],
  "options": [
    { "id": "arcilla", "label": "Arcilla", "title": "Elegí el color de la arcilla", "choices": ["Blanca", "Café"] }
  ]
}
```

**Documento de `orders`** (el id lo genera Firestore con `addDoc` y es el que se muestra como confirmación):

```json
{
  "userId": "uid-del-usuario-autenticado",
  "userEmail": "cliente@mail.com",
  "buyer": {
    "name": "Ana Pérez",
    "phone": "11 5555 5555",
    "address": "Av. Siempre Viva 742, piso 3",
    "city": "Rosario",
    "notes": "Tocar el timbre B"
  },
  "items": [
    {
      "id": "2",
      "name": "Jabón exfoliante masajeador con arcilla, sin aroma",
      "selection": [{ "label": "Arcilla", "value": "Blanca" }],
      "quantity": 2,
      "price": 2500,
      "priceX10": 2300,
      "packUnits": 0,
      "subtotal": 5000
    }
  ],
  "subtotal": 5000,
  "discount": 0,
  "total": 5000,
  "status": "generada",
  "date": "<serverTimestamp(): fecha y hora que pone el servidor>"
}
```

### Autenticación

- **`src/context/AuthContext.jsx`** exporta `AuthContext`, `AuthProvider` y el hook `useAuth()`. Expone `user` (el usuario actual o `null`), `loading`
  (true mientras Firebase valida la sesión guardada) y las funciones `register`, `login` y `logout`.
- El estado se mantiene con **`onAuthStateChanged`** (en `services/auth.js`, usado desde el Provider): Firebase guarda la sesión en el navegador, así que al recargar
  la página el usuario sigue conectado. Al cerrar sesión llega `null` y la interfaz deja de mostrar el email.
- **Registro** (`/registro`) e **inicio de sesión** (`/login`) con email y contraseña. Los errores de Firebase se traducen a mensajes claros (`utils/erroresAuth.js`).
- Con sesión iniciada, el Navbar muestra el **email** y el botón **"Cerrar sesión"**.

### Checkout protegido y órdenes

1. En el carrito, "Finalizar compra" lleva a **`/checkout`**, envuelto en `ProtectedRoute`: sin sesión iniciada redirige a `/login` (con un aviso) y, al ingresar,
   vuelve al checkout. Con el carrito vacío redirige a `/cart`, así que no se puede generar una orden sin productos.
2. El usuario completa los datos de entrega (nombre y apellido, teléfono, dirección y ciudad obligatorios; información adicional opcional). Si falta algo, **no se crea la orden**.
3. Al confirmar, `crearOrden` (`services/orders.js`): verifica que haya stock, guarda la orden con **`addDoc`** en `orders` (con el `userId` y el `userEmail` del usuario,
   los datos del comprador, los productos con id, nombre, precio unitario y cantidad, el total y la fecha con **`serverTimestamp()`**) y luego descuenta el stock comprado.
4. Solo si la orden se creó bien se muestra su **id** y se **vacía el carrito**. Si ocurre un error (sin stock, sin conexión, permisos...) se muestra el mensaje y el carrito queda como estaba.

### Reglas de seguridad (`firestore.rules`)

La seguridad **no depende de la interfaz**: aunque alguien llame a Firestore por su cuenta, las reglas exigen autenticación.

- `orders`: **solo un usuario autenticado puede crear** una orden, y el `userId` / `userEmail` deben ser los de su propia sesión. Se valida la estructura y el tamaño de los campos y que la
  fecha sea la del servidor. Nadie puede leer, modificar ni borrar órdenes desde el sitio (se consultan en la consola de Firebase).
- `products`: lectura pública. Solo un usuario autenticado puede **restar** stock (única modificación permitida); no se pueden crear ni borrar productos.
- `banners`: lectura pública, sin escritura.

### Si la base es la del sitio ya publicado

La tienda puede **leer** el catálogo de un proyecto que ya usa otra versión del sitio (campo `image` y opciones `{ label, values }`): `services/products.js`
convierte los datos al leerlos, sin modificar la base. En ese caso **la compra queda desactivada** (`crearOrden` no escribe nada si los productos no tienen
el campo `img` que carga `npm run seed`), y el banner usa `banners.json` si las reglas no permiten leer `banners`.
**No publiques `firestore.rules` ni cargues datos en ese proyecto**: reemplazaría sus reglas y su sitio dejaría de funcionar.

### Puesta en marcha (proyecto de Firebase nuevo, exclusivo de esta tienda)

1. En la [consola de Firebase](https://console.firebase.google.com/) creá el proyecto, **Firestore Database** y registrá una **app web**.
2. En **Authentication → Método de acceso**, habilitá **Correo electrónico/contraseña**.
3. Copiá `.env.example` como `.env` y completá los valores de la configuración de esa app.
4. Con las reglas de Firestore en **modo de prueba** (permiten escribir), cargá los datos: `npm run seed`.
5. Publicá las reglas de `firestore.rules` (Firestore Database → Reglas → pegar → Publicar). **No dejes el modo de prueba.**
6. Reiniciá `npm run dev`. Al desplegar (por ejemplo en Vercel), cargá las mismas variables en *Environment Variables* y agregá el dominio de producción en
   *Authentication → Configuración → Dominios autorizados*.

`npm run seed -- --force` reemplaza productos y banners (vuelve el stock a los valores del archivo); con las reglas publicadas hay que volver a permitir la escritura.

**Límites de seguridad (sin servidor propio):** las reglas exigen sesión iniciada y validan la forma de la orden, pero la compra se arma
en el navegador: un usuario registrado con conocimientos podría enviar una orden con precios alterados o descontar stock sin comprar. Revisá los totales antes de cobrar;
para impedirlo hace falta validar en el servidor (Cloud Functions).

## Identidad visual

El diseño sigue el documento *Lila del Alba — Identidad mejorada* (sistema de marca, versión refinada):

| Color | Hex | Uso |
|-------|-----|-----|
| Lila | `#B7A4FB` | Detalles, bordes del contador, íconos |
| Violeta | `#3B2B73` | Títulos, precios, botones principales y categoría activa |
| Amanecer | `#F7B58E` | Acentos: contador del carrito, trazo bajo el título, etiquetas |
| Bruma | `#F3EFFF` | Fondo de la página y de las imágenes |
| Noche | `#1C1535` | Texto, pie de página y estado "hover" de los botones |

- Los colores están definidos como variables CSS en `src/index.css` (`--lila`, `--violeta`, `--amanecer`, `--bruma`, `--noche`), junto con la tipografía, el radio de los bordes y la sombra.
- **Logos** (en `src/assets`, extraídos del SVG de la marca): `logo-horizontal.svg` (cabecera web), `logo-horizontal-oscuro.svg` (sobre fondo oscuro, usado en el pie de página) y `logo-flor.svg` (isotipo, usado en el carrito vacío).
- **Íconos** (en `public`): `favicon.svg` y `favicon.png` (ícono de app) y `apple-touch-icon.png`.
- **Tipografía:** Outfit (pesos 400, 500, 600 y 700), cargada desde Google Fonts en `index.html`, igual que en el sitio de la marca. Se define en la variable `--fuente-texto` (y `--fuente-titulos`) de `src/index.css`, con fuentes del sistema como respaldo.

## Banner de novedades y promociones

El carrusel de la home (`src/components/Banner.jsx`) no tiene las promociones escritas en el código: las lee de un **archivo JSON** mediante `getBanners()`
(`src/services/banners.js`). Para cambiar, agregar o quitar promociones solo hay que editar ese JSON.

**¿De dónde se lee?**

1. Si existe la variable de entorno `VITE_BANNERS_URL`, de esa **URL remota**. Así las promociones se modifican **sin volver a publicar el sitio**:
   se edita el archivo en su lugar de hosting y al recargar la página el banner ya cambió. Ejemplos de dónde alojarlo: un archivo en un repositorio de GitHub
   (URL `raw.githubusercontent.com/...`) o un Gist. El servidor debe permitir pedidos desde otro origen (CORS); GitHub lo hace, y los cambios pueden tardar unos minutos por su caché.
   Se configura en un archivo `.env` local o en las variables de entorno de Vercel:
   ```
   VITE_BANNERS_URL=https://raw.githubusercontent.com/USUARIO/REPO/main/banners.json
   ```
2. Si no existe, del archivo `public/banners.json` del proyecto (se edita y se vuelve a publicar).
3. Si no se puede leer (sin conexión, JSON roto, etc.), se muestra una diapositiva de respaldo para que el banner nunca quede vacío.

Con Firebase configurado, la colección `banners` de Firestore tiene prioridad: se editan desde la consola y los puntos anteriores quedan de respaldo.

**Formato del JSON** (un objeto con un array `slides`; el orden del array es el orden del carrusel):

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| `title` | Sí | Título de la diapositiva. |
| `id` | No | Identificador único (si falta, se genera uno). |
| `text` | No | Texto debajo del título. |
| `buttonText` y `link` | No | Texto y destino del botón (se muestra si están los dos). `link` puede ser una ruta interna (`/category/hogar`), un ancla (`#catalogo`, baja al listado) o una URL `https://` externa. |
| `image` y `imageAlt` | No | Imagen (ruta interna o `https://`) y su descripción para lectores de pantalla. |
| `imageFit` | No | `contain` (por defecto): foto recortada, apoyada abajo a la derecha, como la del sitio. `cover`: foto completa que ocupa toda la mitad derecha. |
| `theme` | No | Color de fondo: `lila` (por defecto), `amanecer` o `noche`. |
| `active` | No | `false` para ocultarla sin borrarla. |
| `from` y `to` | No | Período de vigencia (`AAAA-MM-DD`): la diapositiva aparece sola desde `from` y desaparece después de `to`. |

```json
{
  "slides": [
    {
      "id": "novedad-vela",
      "title": "Nueva vela de soja",
      "text": "Ya disponible en todas las fragancias.",
      "buttonText": "Ver hogar",
      "link": "/category/hogar",
      "image": "/productos/vela-soja-90g.jpg",
      "imageAlt": "Vela de soja en lata",
      "imageFit": "cover",
      "theme": "amanecer",
      "from": "2026-12-01",
      "to": "2026-12-31"
    }
  ]
}
```

Por seguridad, `getBanners()` valida lo que lee: descarta las diapositivas sin título, inactivas o fuera de su período, acepta como `link` solo rutas internas, anclas o `https://`
(nunca `javascript:` ni `//otro-sitio`), y muestra como máximo 10 diapositivas.

## Diseño responsive

- **Pantallas de hasta 900 px (tablet y celular):** las categorías pasan a un menú hamburguesa y el Navbar queda en una sola fila (logo, carrito y botón del menú).
- **Celulares (hasta 600 px):** la lista de productos usa 2 columnas con cards compactas (nombre en 2 líneas como máximo, precio y botón debajo), por lo que se ven **4 productos por pantalla**.
- El banner conserva el diseño del sitio de la marca: texto a la izquierda y foto a la derecha en pantallas grandes; texto arriba y foto abajo en celulares.

## Datos y fotos

- Los precios, el precio por pack x10, los envases y los aromas salen de la lista de precios y de la lista de fragancias de la marca.
- El **stock es de ejemplo**: con Firebase, cargá los valores reales en cada documento de `products`.
- Las fotos de `public/productos` son las del sitio de la marca ([liladelalba.vercel.app](https://liladelalba.vercel.app/)). Los productos que ahí
  no tienen una foto propia comparten la de su categoría, igual que en el sitio: cremas (`cremas.webp`), aceites (`aceites.webp`),
  shampoo sólido (`shampoo-solido.webp`) y hogar (`hogar.webp`, para el difusor de 60 ml, el difusor para auto y el spray textil).
  Los dos jabones sin aroma (con y sin arcilla) usan la misma foto, como en el sitio.

## Estructura del proyecto

```
.env.example              # plantilla de las variables de Firebase (el .env real NO se sube)
firestore.rules           # reglas de seguridad para publicar en la consola
scripts/
├── seed-firestore.mjs    # npm run seed: carga productos y banners en Firestore
└── data/
    └── products.js       # datos de la carga inicial de productos (la tienda no lo importa)
public/
├── banners.json          # diapositivas del carrusel (editable)
├── banners/
│   └── hero.webp         # foto de la primera diapositiva
├── productos/            # fotos de los productos (.jpg / .webp)
├── favicon.svg / .png    # ícono de la marca
└── apple-touch-icon.png
src/
├── assets/
│   ├── logo-horizontal.svg
│   ├── logo-horizontal-oscuro.svg
│   └── logo-flor.svg
├── components/
│   ├── AuthForm.jsx / .css          # inicio de sesión y registro
│   ├── Banner.jsx / .css
│   ├── Cargando.jsx / .css
│   ├── Cart.jsx / .css
│   ├── CartWidget.jsx / .css
│   ├── Checkout.jsx / .css          # página /checkout (datos de entrega y confirmación)
│   ├── CheckoutForm.jsx / .css
│   ├── Footer.jsx / .css
│   ├── Item.jsx / .css
│   ├── ItemCount.jsx / .css
│   ├── ItemDetail.jsx / .css
│   ├── ItemDetailContainer.jsx / .css
│   ├── ItemList.jsx / .css
│   ├── ItemListContainer.jsx / .css
│   ├── Layout.jsx / .css
│   ├── Navbar.jsx / .css
│   ├── NotFound.jsx / .css
│   ├── OptionPicker.jsx / .css
│   ├── ProductToolbar.jsx / .css
│   ├── ProtectedRoute.jsx           # protege rutas que requieren sesión
│   ├── ResumenCompra.jsx            # resumen compartido por carrito y checkout
│   ├── ScrollToTop.jsx
│   └── UserWidget.jsx / .css        # "Ingresar" o email + "Cerrar sesión"
├── constants/
│   └── categories.js     # categorías de la tienda
├── context/
│   ├── AuthContext.jsx   # AuthContext, AuthProvider y el hook useAuth (onAuthStateChanged)
│   └── CartContext.jsx   # CartContext, CartProvider y el hook useCart
├── firebase/
│   └── config.js         # inicialización de Firebase: exporta db y auth (variables de entorno)
├── services/
│   ├── auth.js           # registrar, iniciar y cerrar sesión; observar la sesión
│   ├── banners.js        # getBanners: lee y valida las diapositivas del carrusel
│   ├── orders.js         # crearOrden: addDoc en "orders" + descuento de stock
│   └── products.js       # getProducts y getProductById (Firestore)
├── utils/
│   ├── erroresAuth.js    # mensajes en español para los errores de Authentication
│   ├── filtrarProductos.js  # búsqueda y orden de la lista
│   ├── formatearPrecio.js
│   └── precios.js        # calcularPrecios: descuento por pack x10
├── App.jsx               # BrowserRouter, providers y definición de las rutas
├── index.css
└── main.jsx              # punto de entrada
```
