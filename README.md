# Lila del Alba — E-commerce

## Descripción

Tienda online de **Lila del Alba**, emprendimiento de cosmética natural y aromatización:
jabones exfoliantes, cremas y aceites corporales, sérum hidratante, bálsamo labial,
shampoo y acondicionador sólidos, difusores ambientales, spray textil y velas de soja.

El proyecto avanza por etapas. Hasta ahora tiene la estructura base, el layout inicial
(barra de navegación y carrito), el **listado dinámico de productos** y la **vista de detalle de cada producto**,
con los datos cargados de forma asíncrona desde una API simulada. En las próximas entregas se irán
sumando las rutas, el carrito de compras, el checkout y la conexión con Firebase.

## Tecnologías utilizadas

- [React 19](https://react.dev/)
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

## Componentes

Todos los componentes viven en `src/components`, cada uno con su archivo `.jsx` y su hoja de estilos `.css`.

| Componente | Descripción |
|------------|-------------|
| `Navbar` | Barra de navegación fija en la parte superior. Muestra el logo y el nombre de la tienda, las categorías de productos (Jabones, Cremas, Aceites, Sérum, Bálsamo, Ducha y Hogar) generadas con `map` a partir de `src/mock/categories.js`, y el `CartWidget`. |
| `CartWidget` | Ícono de carrito con un contador de productos. Por ahora el número está fijo (hardcodeado); más adelante se conectará al estado del carrito. |
| `ItemListContainer` | Contenedor del catálogo. Obtiene los productos con `getProducts` dentro de un `useEffect` (solo al montarse), los guarda en el estado `items` y se los pasa por props a `ItemList`. Maneja los estados de carga y de error. No hace el `.map()`. |
| `ItemList` | Recibe los productos por props (`items`), los recorre con `.map()` y renderiza un `Item` por cada uno, usando el `id` del producto como `key`. |
| `Item` | Card con la información **resumida** de un producto: imagen, categoría, nombre y precio, más el botón "Ver detalle". |
| `ItemDetailContainer` | Contenedor del detalle. Recibe el `productId` por props, ejecuta `getProductById(productId)` dentro de un `useEffect`, guarda el producto en el estado `product` y se lo entrega por props a `ItemDetail`. Maneja los estados de carga y de error (producto inexistente). No contiene el diseño del producto. |
| `ItemDetail` | Presentación del detalle completo: imagen, categoría, nombre, precio, descripción, stock disponible y la información que no aparece en la card (presentación, envase, características, aromas disponibles y precio por pack x10). Incluye el `ItemCount`. No busca datos. |
| `ItemCount` | Contador de cantidad reutilizable. Recibe el `stock` por props: no permite superarlo ni bajar de cero. El botón "Agregar al carrito" informa la cantidad elegida a través de la prop `onAdd`. |
| `Cargando` | Indicador de carga que comparten los dos contenedores. |

`App.jsx` arma el layout con `<Navbar />` y muestra una de las dos vistas: el catálogo (`ItemListContainer`) o el detalle de un producto (`ItemDetailContainer`).
Esa navegación es **provisoria**: un estado `productoId` guarda el producto que se está viendo (`null` significa catálogo).
Cuando se incorpore React Router, el id vendrá de la URL y ese estado desaparecerá.

## Carga de datos asíncrona (simulada)

Todavía no hay un servidor ni una base de datos, así que la obtención de datos se simula
para que la aplicación se comporte como lo hará con datos reales (Firebase, en una etapa posterior).

**1. Los datos** (`src/mock/products.js`). Un array con los 23 productos de la lista de precios. Cada producto tiene las propiedades
`id`, `name`, `price`, `category`, `img`, `stock` y `description`, y algunos suman información extra
(`priceX10`, `presentation`, `container`, `features`, `aromas`) que solo se muestra en el detalle.

**2. Las funciones asíncronas** (`src/mock/asyncMock.js`). Cada una devuelve una `Promise` que usa `setTimeout` para resolverse con retraso,
imitando la demora de una conexión real:

```js
// Listado: se resuelve a los 2 segundos con el array de productos
export const getProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...products])
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
- `useEffect` dispara la carga: con `[]` en el listado (solo al montar) y con `[productId]` en el detalle (se repite si cambia el id).
- Dentro del efecto se define una función `async` que hace `await` de la promesa y guarda el resultado con el setter del estado.
- Si la promesa se rechaza, el `catch` muestra un mensaje de error en pantalla.

## Detalle de producto

```
getProductById       →  busca el producto por id y devuelve una promesa
ItemDetailContainer  →  ejecuta la promesa y administra el estado
   └─ ItemDetail     →  muestra la información completa
        └─ ItemCount →  controla la cantidad seleccionada (recibe el stock del producto)
```

`ItemCount` mantiene su lógica separada del detalle y respeta dos límites: la cantidad **no supera el stock** del producto y **no baja de cero**
(los botones se deshabilitan en cada extremo, y "Agregar al carrito" se deshabilita con cantidad cero).
Por ahora "Agregar al carrito" solo confirma la cantidad en pantalla: la conexión con el `CartWidget` llega con el carrito.

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
│   ├── CartWidget.jsx / .css
│   ├── Item.jsx / .css
│   ├── ItemCount.jsx / .css
│   ├── ItemDetail.jsx / .css
│   ├── ItemDetailContainer.jsx / .css
│   ├── ItemList.jsx / .css
│   ├── ItemListContainer.jsx / .css
│   └── Navbar.jsx / .css
├── mock/
│   ├── asyncMock.js      # getProducts y getProductById (Promises con retraso simulado)
│   ├── categories.js     # categorías de la tienda
│   └── products.js       # catálogo de productos
├── utils/
│   └── formatearPrecio.js
├── App.jsx
├── index.css
└── main.jsx
```
