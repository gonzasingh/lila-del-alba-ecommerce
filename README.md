# Lila del Alba — E-commerce

## Descripción

Tienda online de **Lila del Alba**, emprendimiento de cosmética natural y aromatización:
jabones exfoliantes, cremas y aceites corporales, sérum hidratante, bálsamo labial,
shampoo y acondicionador sólidos, difusores ambientales, spray textil y velas de soja.

El proyecto avanza por etapas. Hasta ahora tiene la estructura base, el **listado dinámico de productos**
(con filtro por categoría), la **vista de detalle de cada producto**, la **navegación con React Router**
(rutas anidadas con un layout compartido) y un **carrito de compras funcional** basado en Context API: se agrega desde el detalle,
se ve en el `CartWidget` del Navbar y en la página `/cart`, donde se puede quitar cada producto, vaciar todo y ver el total. Los datos se cargan de forma asíncrona
desde una API simulada. La interfaz sigue la **identidad visual refinada** de la marca (ver "Identidad visual"), es **responsive** (menú hamburguesa y
grilla de 2 columnas en celulares) y la home incluye un **banner en forma de carrusel cuyas promociones se editan sin tocar el código** (ver "Banner de novedades y promociones"). Está **conectada con Firebase (Firestore)**: productos, banners, órdenes de compra y stock (ver "Firebase"); sin credenciales funciona con datos locales.

## Tecnologías utilizadas

- [React 19](https://react.dev/)
- [React Router](https://reactrouter.com/) (`react-router-dom`)
- [Vite](https://vite.dev/)
- JavaScript (ES Modules)
- CSS tradicional (un archivo por componente y variables de color globales)
- [Firebase](https://firebase.google.com/) (Cloud Firestore)
- Tipografía [Outfit](https://fonts.google.com/specimen/Outfit) (Google Fonts), la misma del sitio de la marca
- ESLint
- Node.js y npm
- Git y GitHub

## Instalación y ejecución

Requisito: tener instalado [Node.js](https://nodejs.org/) (versión 20 o superior).

```bash
# 1. Clonar el repositorio
git clone https://github.com/gonzasingh/lila-del-alba-ecommerce.git

# 2. Entrar a la carpeta del proyecto
cd lila-del-alba-ecommerce

# 3. Instalar dependencias
npm install

# 4. Iniciar el servidor de desarrollo
npm run dev
```

Luego abrir en el navegador la dirección que indica la terminal (por defecto `http://localhost:5173`).

## Rutas

La navegación usa React Router. `BrowserRouter` envuelve la aplicación en `App.jsx`, y las rutas están **anidadas**:
una ruta padre sin `path` renderiza el `Layout` (Navbar + Footer) y todas las demás se dibujan dentro de su `<Outlet />`.
Así el Navbar, el `CartWidget` y el Footer están presentes en todas las páginas, incluso en el error 404.

```jsx
<BrowserRouter>
  <CartProvider>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ItemListContainer greeting="..." />} />
        <Route path="/category/:id" element={<ItemListContainer />} />
        <Route path="/item/:id" element={<ItemDetailContainer />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </CartProvider>
</BrowserRouter>
```

| Ruta | Muestra |
|------|---------|
| `/` | Catálogo completo (`ItemListContainer`) |
| `/category/:id` | Catálogo filtrado por la categoría de la URL (`ItemListContainer`). Si la categoría no existe, muestra `NotFound`. |
| `/item/:id` | Detalle del producto cuyo id está en la URL (`ItemDetailContainer`) |
| `/cart` | Carrito de compras (`Cart`) |
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
| `Navbar` | Barra de navegación fija en la parte superior: arriba de todo se ve **integrada en la página** (transparente) y al bajar más de 24 px se convierte en una **píldora de vidrio translúcido** y redondeada (estilo liquid glass). Muestra el logo horizontal de la marca, las categorías de productos (generadas con `map` a partir de `src/mock/categories.js`) como `NavLink` a `/category/:categoryId`, y el `CartWidget`. En pantallas de hasta 900 px las categorías pasan a un **menú desplegable tipo hamburguesa**: se abre y cierra con el botón (`aria-expanded`), se cierra al elegir una categoría, con la tecla Escape o al tocar fuera de la barra. |
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
| `Cart` | Página del carrito (ruta `/cart`). Con el carrito vacío muestra un mensaje y un link para volver al catálogo. Con productos lista, de cada uno, nombre, cantidad, precio unitario y subtotal, con un botón "Eliminar" por producto; además muestra el **total**, el botón "Vaciar carrito" y "Finalizar compra", que abre el `CheckoutForm` y al confirmar muestra el número de orden. |
| `CheckoutForm` | Formulario del comprador (nombre, teléfono, email y su repetición) con validación. |
| `Footer` | Pie de página sobre fondo oscuro con la versión del logo para fondo oscuro, las categorías y links a la tienda y al carrito (con `Link`). Se muestra en todas las rutas gracias al `Layout`. |
| `NotFound` | Mensaje para rutas o categorías inexistentes, con un link al catálogo. |
| `Cargando` | Indicador de carga que comparten los contenedores. |
| `ScrollToTop` | Vuelve al inicio de la página cada vez que cambia la ruta. |

## Carga de datos asíncrona

Los contenedores piden los datos a `src/services/products.js`. Con Firebase configurado, esa función consulta Firestore (ver "Firebase");
sin configurar, usa el mock que se describe a continuación, que devuelve los datos con el mismo formato y una demora simulada.

**1. Los datos** (`src/mock/products.js`). Un array con los 23 productos de la lista de precios. Cada producto tiene las propiedades
`id`, `name`, `price`, `category`, `img`, `stock` y `description`, y algunos suman información extra
(`priceX10`, `presentation`, `container`, `features`, `aromas`, `options`) que solo se usa en el detalle.

**2. Las funciones asíncronas** (`src/mock/asyncMock.js`). Cada una devuelve una `Promise` que usa `setTimeout` para resolverse con retraso,
imitando la demora de una conexión real:

```js
// Listado: se resuelve a los 2 segundos. Si recibe una categoría, filtra los productos.
export const getProducts = (categoryId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lista = categoryId
        ? products.filter((product) => product.category === categoryId)
        : products
      resolve([...lista])
    }, 2000)
  })
}

// Detalle: busca UN producto por su id y se resuelve al segundo.
// Si no existe, la Promise se rechaza con un error.
export const getProductById = (productId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = products.find((item) => String(item.id) === String(productId))
      if (product) {
        resolve({ ...product })
      } else {
        reject(new Error(`No existe un producto con id "${productId}"`))
      }
    }, 1000)
  })
}
```

**3. La llamada desde React.** Los dos contenedores usan el mismo patrón:

- `useState` guarda el resultado (`items` en el listado, `product` en el detalle) y los estados de carga y de error.
- `useEffect` dispara la carga. Su array de dependencias es `[categoryId]` en el listado y `[productId]` en el detalle,
  así que la carga ocurre al montar el componente y se repite cuando cambia la URL (por ejemplo, al pasar de una categoría a otra).
- Dentro del efecto se define una función `async` que hace `await` de la promesa y guarda el resultado con el setter del estado.
  Si el componente se desmonta o cambia la URL antes de que llegue la respuesta, ese resultado se descarta.
- Si la promesa se rechaza, el `catch` muestra un mensaje de error en pantalla.

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
poder agregar. Son la fragancia (`aromas`) y las opciones declaradas en `options` en `products.js`: color de la arcilla (jabones con arcilla), tipo de cabello
(shampoo) y con o sin color (bálsamos). Las versiones con y sin fragancia son productos separados del catálogo.

**Descuento por pack x10** (`src/utils/precios.js`): el pack son 10 unidades **exactamente iguales** (mismo producto, misma fragancia y mismas opciones).
Por cada 10 se aplica `priceX10` y las restantes van a precio normal (11 = 10 en pack + 1 normal; 20 = 20 en pack). Combinar variedades no cuenta:
6 de una fragancia y 5 de otra no tienen descuento. Los productos de **hogar** no tienen precio por pack. El carrito muestra el desglose en la línea y el
descuento en el resumen. Con el stock de ejemplo, los productos con menos de 10 unidades nunca llegan al pack.

**Flujo de compra:** en el detalle, `ItemCount` recibe como stock lo que **todavía queda disponible** (stock menos lo que ya está en el carrito),
así que nunca se puede agregar más que el stock total. Al tocar "Agregar al carrito", `ItemDetail` llama a `addItem` y muestra el aviso
con "Ver carrito" y "Seguir comprando". En el carrito el cliente ve cada producto con sus opciones, cantidad,
precio unitario y subtotal, puede eliminarlos de a uno o vaciar el carrito, y ve el total antes de decidir. "Finalizar compra" genera la orden en Firestore.
El carrito vive en memoria, por lo que se vacía al recargar la página.

## Firebase

`src/services/firebase.js` lee la configuración de las variables `VITE_FIREBASE_*`. Si están cargadas, la tienda usa Firestore; si no, usa los datos locales
(`asyncMock` y `banners.json`) y el checkout avisa que no está disponible.

| Colección | Contenido | Quién la usa |
|-----------|-----------|--------------|
| `products` | Un documento por producto (el id del documento es el id del producto), con `order` para ordenar. | `services/products.js` (listado, categoría con `where` y detalle). |
| `banners` | Una diapositiva por documento (mismos campos que `banners.json`, más `order`). Las fechas `from` / `to` se escriben como texto `AAAA-MM-DD`. | `services/banners.js` |
| `orders` | `buyer`, `items` (con las opciones elegidas), `subtotal`, `discount`, `total`, `status` y `date`. | `services/orders.js` |

**Compra:** `crearOrden` usa una **transacción**: lee el stock actual, y solo si alcanza descuenta las unidades y guarda la orden. Si no alcanza, no cambia nada
y se informa qué producto falta.

### Si la base es la del sitio ya publicado

La tienda puede **leer** el catálogo de un proyecto que ya usa otra versión del sitio (campo `image` y opciones `{ label, values }`): `services/products.js`
convierte los datos al leerlos, sin modificar la base. En ese caso **la compra queda desactivada** (`crearOrden` no escribe nada si los productos no tienen
el campo `img` que carga `npm run seed`), y el banner usa `banners.json` si las reglas no permiten leer `banners`.
**No publiques `firestore.rules` ni cargues datos en ese proyecto**: reemplazaría sus reglas y su sitio dejaría de funcionar.

### Puesta en marcha (proyecto de Firebase nuevo, exclusivo de esta tienda)

1. En la [consola de Firebase](https://console.firebase.google.com/) elegí tu proyecto, creá **Firestore Database** y registrá una **app web**.
2. Copiá `.env.example` como `.env` y completá los valores de la configuración de esa app.
3. Con las reglas en **modo de prueba** (permiten escribir), cargá los datos: `npm run seed`.
4. Publicá las reglas de `firestore.rules` (Firestore Database → Reglas → pegar → Publicar). **No dejes el modo de prueba.**
5. Reiniciá `npm run dev`. En Vercel, cargá las mismas variables en *Environment Variables* y volvé a desplegar.

`npm run seed -- --force` reemplaza productos y banners (vuelve el stock a los valores del archivo); con las reglas publicadas hay que volver a permitir la escritura.

**Límites de seguridad (sin servidor propio):** las reglas impiden crear o cambiar productos, subir stock y leer órdenes desde el sitio, pero la compra se arma
en el navegador: alguien con conocimientos podría enviar una orden con precios alterados o descontar stock sin comprar. Revisá los totales antes de cobrar;
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
.env.example              # plantilla de las variables de Firebase
firestore.rules           # reglas de seguridad para publicar en la consola
scripts/
└── seed-firestore.mjs    # npm run seed: carga productos y banners
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
│   ├── Banner.jsx / .css
│   ├── Cargando.jsx / .css
│   ├── Cart.jsx / .css
│   ├── CheckoutForm.jsx / .css
│   ├── CartWidget.jsx / .css
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
│   └── ScrollToTop.jsx
├── context/
│   └── CartContext.jsx   # CartContext, CartProvider y el hook useCart
├── mock/
│   ├── asyncMock.js      # getProducts y getProductById (Promises con retraso simulado)
│   ├── categories.js     # categorías de la tienda
│   └── products.js       # catálogo de productos
├── services/
│   ├── banners.js        # getBanners: lee y valida las diapositivas del carrusel
│   ├── firebase.js       # inicialización de Firebase
│   ├── orders.js         # crearOrden: orden + descuento de stock
│   └── products.js       # getProducts y getProductById (Firestore o mock)
├── utils/
│   ├── filtrarProductos.js  # búsqueda y orden de la lista
│   ├── formatearPrecio.js
│   └── precios.js        # calcularPrecios: descuento por pack x10
├── App.jsx               # BrowserRouter, CartProvider y definición de las rutas
├── index.css
└── main.jsx              # punto de entrada
```
