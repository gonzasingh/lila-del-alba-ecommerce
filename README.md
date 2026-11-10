# Lila del Alba — E-commerce

## Descripción

Tienda online de **Lila del Alba**, emprendimiento de cosmética natural y aromatización:
jabones exfoliantes, cremas y aceites corporales, sérum hidratante, bálsamo labial,
shampoo y acondicionador sólidos, difusores ambientales, spray textil y velas de soja.

El proyecto avanza por etapas. Hasta ahora tiene la estructura base, el **listado dinámico de productos**
(con filtro por categoría), la **vista de detalle de cada producto**, la **navegación con React Router**
y un **carrito de compras** conectado al contador de cantidad. Los datos se cargan de forma asíncrona
desde una API simulada. En las próximas entregas se irán sumando el checkout y la conexión con Firebase.

## Tecnologías utilizadas

- [React 19](https://react.dev/)
- [React Router](https://reactrouter.com/) (`react-router-dom`)
- [Vite](https://vite.dev/)
- JavaScript (ES Modules)
- CSS tradicional (un archivo por componente y variables de color globales)
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

La navegación usa React Router (`BrowserRouter` en `main.jsx` y las rutas definidas en `App.jsx`):

| Ruta | Muestra |
|------|---------|
| `/` | Catálogo completo (`ItemListContainer`) |
| `/category/:categoryId` | Catálogo filtrado por categoría (`ItemListContainer`). Si la categoría no existe, muestra `NotFound`. |
| `/item/:id` | Detalle de un producto (`ItemDetailContainer`) |
| `/cart` | Carrito de compras (`Cart`) |
| `*` | Página no encontrada (`NotFound`) |

El logo y las categorías de la `Navbar` son links (`Link` / `NavLink`); la categoría que se está viendo queda resaltada.

## Componentes

Todos los componentes viven en `src/components`, cada uno con su archivo `.jsx` y su hoja de estilos `.css`.

| Componente | Descripción |
|------------|-------------|
| `Navbar` | Barra de navegación fija en la parte superior. Muestra el logo, las categorías de productos (generadas con `map` a partir de `src/mock/categories.js`) como `NavLink` a `/category/:categoryId`, y el `CartWidget`. |
| `CartWidget` | Link al carrito con el ícono y la cantidad total de unidades, que lee del carrito con el hook `useCart`. |
| `ItemListContainer` | Contenedor del catálogo. Lee `categoryId` de la URL, obtiene los productos con `getProducts(categoryId)` dentro de un `useEffect`, los guarda en el estado `items` y se los pasa por props a `ItemList`. Maneja los estados de carga y de error. No hace el `.map()`. |
| `ItemList` | Recibe los productos por props (`items`), los recorre con `.map()` y renderiza un `Item` por cada uno, usando el `id` del producto como `key`. |
| `Item` | Card con la información **resumida** de un producto (imagen, categoría, nombre y precio) y un link "Ver detalle" a `/item/:id`. |
| `ItemDetailContainer` | Contenedor del detalle. Lee el `id` de la URL, ejecuta `getProductById` dentro de un `useEffect`, guarda el producto en el estado `product` y se lo entrega por props a `ItemDetail`. También conecta el detalle con el carrito: le pasa la cantidad que ya hay en el carrito y la función para agregar. No contiene el diseño del producto. |
| `ItemDetail` | Presentación del detalle completo: imagen, categoría, nombre, precio, descripción, stock y la información que no aparece en la card (presentación, envase, características, aromas y precio por pack x10). Incluye el `ItemCount`. No busca datos ni conoce el carrito. |
| `ItemCount` | Contador de cantidad reutilizable. Recibe el `stock` por props: no permite superarlo ni bajar de cero. El botón "Agregar al carrito" informa la cantidad elegida a través de la prop `onAdd`. |
| `Cart` | Vista del carrito: lista los productos agregados con su subtotal, permite quitarlos o vaciar el carrito y muestra el total. |
| `NotFound` | Mensaje para rutas o categorías inexistentes, con un link al catálogo. |
| `Cargando` | Indicador de carga que comparten los contenedores. |
| `ScrollToTop` | Vuelve al inicio de la página cada vez que cambia la ruta. |

## Carga de datos asíncrona (simulada)

Todavía no hay un servidor ni una base de datos, así que la obtención de datos se simula
para que la aplicación se comporte como lo hará con datos reales (Firebase, en una etapa posterior).

**1. Los datos** (`src/mock/products.js`). Un array con los 23 productos de la lista de precios. Cada producto tiene las propiedades
`id`, `name`, `price`, `category`, `img`, `stock` y `description`, y algunos suman información extra
(`priceX10`, `presentation`, `container`, `features`, `aromas`) que solo se muestra en el detalle.

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
ItemDetailContainer  →  ejecuta la promesa, administra el estado y conecta con el carrito
   └─ ItemDetail     →  muestra la información completa
        └─ ItemCount →  controla la cantidad seleccionada (recibe el stock que todavía queda disponible)
```

`ItemCount` mantiene su lógica separada del detalle y respeta dos límites: la cantidad **no supera el stock** y **no baja de cero**
(los botones se deshabilitan en cada extremo, y "Agregar al carrito" se deshabilita con cantidad cero).

## Carrito

El estado del carrito se comparte con toda la aplicación mediante Context API:

- `src/context/CartContext.js`: crea el contexto.
- `src/context/CartProvider.jsx`: guarda el carrito en un `useState` y expone `addItem`, `removeItem`, `clearCart`, `getQuantity`,
  `totalQuantity` y `totalPrice`. Si un producto ya está en el carrito, suma la cantidad sin superar su stock.
- `src/hooks/useCart.js`: custom hook para usar el contexto desde cualquier componente.

Al tocar "Agregar al carrito", `ItemDetailContainer` llama a `addItem`. `ItemCount` recibe como stock lo que **todavía queda disponible**
(stock menos lo que ya está en el carrito), por lo que nunca se puede agregar más que el stock total. El carrito vive en memoria:
se vacía al recargar la página.

## Datos y fotos

- Los precios, el precio por pack x10, los envases y los aromas salen de la lista de precios y de la lista de fragancias de la marca.
- El **stock es de ejemplo**: se reemplazará por los valores reales cuando los datos vengan de Firebase.
- Las fotos de `public/productos` (`.jpg`) son del material de la marca. Los productos que todavía no tienen foto
  (bálsamo en envase plástico, acondicionador sólido, body splash, difusor para auto y vela de soja) usan una ilustración provisoria (`.svg`).

## Estructura del proyecto

```
public/
└── productos/            # fotos (.jpg) e ilustraciones provisorias (.svg) de los productos
src/
├── assets/
│   └── logo-flor.png
├── components/
│   ├── Cargando.jsx / .css
│   ├── Cart.jsx / .css
│   ├── CartWidget.jsx / .css
│   ├── Item.jsx / .css
│   ├── ItemCount.jsx / .css
│   ├── ItemDetail.jsx / .css
│   ├── ItemDetailContainer.jsx / .css
│   ├── ItemList.jsx / .css
│   ├── ItemListContainer.jsx / .css
│   ├── Navbar.jsx / .css
│   ├── NotFound.jsx / .css
│   └── ScrollToTop.jsx
├── context/
│   ├── CartContext.js
│   └── CartProvider.jsx
├── hooks/
│   └── useCart.js
├── mock/
│   ├── asyncMock.js      # getProducts y getProductById (Promises con retraso simulado)
│   ├── categories.js     # categorías de la tienda
│   └── products.js       # catálogo de productos
├── utils/
│   └── formatearPrecio.js
├── App.jsx               # definición de las rutas
├── index.css
└── main.jsx              # BrowserRouter
```
