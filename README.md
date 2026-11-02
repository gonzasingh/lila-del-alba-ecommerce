# Lila del Alba — E-commerce

## Descripción

Tienda online de **Lila del Alba**, emprendimiento de cosmética natural y aromatización:
jabones exfoliantes, cremas y aceites corporales, sérum hidratante, bálsamo labial,
shampoo y acondicionador sólidos, difusores ambientales, spray textil y velas de soja.

El proyecto avanza por etapas. Hasta ahora tiene la estructura base, el layout inicial
(barra de navegación, carrito y mensaje de bienvenida) y el **listado dinámico de productos**,
que se carga de forma asíncrona desde una API simulada. En las próximas entregas se irán
sumando las rutas, el detalle de producto, el carrito de compras, el checkout y la
conexión con Firebase.

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
| `Navbar` | Barra de navegación fija en la parte superior. Muestra el logo y el nombre de la tienda a la izquierda, las categorías de productos (Jabones, Cremas, Aceites, Sérum, Bálsamo, Ducha y Hogar) generadas con `map` a partir de un array, y el `CartWidget` a la derecha. |
| `CartWidget` | Ícono de carrito con un contador de productos. Por ahora el número está fijo (hardcodeado); más adelante se conectará al estado del carrito. |
| `ItemListContainer` | Contenedor de la sección principal. Recibe la prop `greeting` desde `App` y la muestra en un `<h1>`. Obtiene los productos llamando a `getProducts` dentro de un `useEffect` (solo al montarse), los guarda en el estado `items` y se los pasa por props a `ItemList`. También maneja los estados de carga y de error. No hace el `.map()`. |
| `ItemList` | Recibe los productos por props (`items`), los recorre con `.map()` y renderiza un `Item` por cada uno, usando el `id` del producto como `key`. |
| `Item` | Card de un producto: imagen, nombre, descripción, precio y, cuando quedan pocas unidades, un aviso de stock. Solo se ocupa de la presentación visual. |

`App.jsx` arma el layout: renderiza `<Navbar />` e `<ItemListContainer greeting="¡Bienvenidos a Lila del Alba!" />`,
pasando el mensaje de bienvenida de padre a hijo mediante props.

## Carga de datos asíncrona (simulada)

Todavía no hay un servidor ni una base de datos, así que la carga de productos se simula
para que la aplicación se comporte como lo hará con datos reales (Firebase, en una etapa posterior).

**1. El mock de datos** (`src/mock/asyncMock.js`). Contiene un array con 9 productos y exporta la función `getProducts`.
Cada producto tiene las propiedades `id`, `name`, `price`, `category`, `img`, `stock` y `description`.

**2. La Promise con retraso.** `getProducts` devuelve una `Promise` que usa `setTimeout` para resolverse
recién a los **2 segundos** con el array de productos. Ese retraso imita la demora de una conexión real,
por lo que los productos no aparecen de inmediato:

```js
export const getProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...products])
    }, 2000)
  })
}
```

**3. La llamada desde React.** En `ItemListContainer`:

- `useState([])` crea el estado `items`, que arranca como un array vacío.
- `useEffect` con el array de dependencias vacío (`[]`) dispara la carga **una sola vez, cuando el componente se monta**.
- Dentro del efecto se define una función `async` que hace `await getProducts()` y guarda el resultado con `setItems`.
- Mientras la promesa no se resuelve se muestra el mensaje "Cargando productos...". Si la promesa fallara, se muestra un mensaje de error.

**4. El flujo de componentes.** Cada componente tiene una única responsabilidad:

```
ItemListContainer  →  obtiene los datos y los guarda en el estado (items)
   └─ ItemList     →  recorre items con .map() y usa product.id como key
        └─ Item    →  muestra la card de un producto
```

Las imágenes de los productos son ilustraciones provisorias que están en `public/productos`
y se referencian por URL en el campo `img`, igual que se haría con imágenes alojadas en un servidor.

## Estructura del proyecto

```
public/
└── productos/            # ilustraciones provisorias de los productos (SVG)
src/
├── assets/
│   └── logo-flor.png
├── components/
│   ├── CartWidget.jsx
│   ├── CartWidget.css
│   ├── Item.jsx
│   ├── Item.css
│   ├── ItemList.jsx
│   ├── ItemList.css
│   ├── ItemListContainer.jsx
│   ├── ItemListContainer.css
│   ├── Navbar.jsx
│   └── Navbar.css
├── mock/
│   └── asyncMock.js      # productos de ejemplo + getProducts (Promise con 2 s de retraso)
├── App.jsx
├── index.css
└── main.jsx
```
