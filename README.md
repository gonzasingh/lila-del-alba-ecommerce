# Lila del Alba — E-commerce

## Descripción

Tienda online de **Lila del Alba**, emprendimiento de cosmética natural y aromatización:
jabones exfoliantes, cremas y aceites corporales, sérum hidratante, bálsamo labial,
shampoo y acondicionador sólidos, difusores ambientales, spray textil y velas de soja.

El proyecto avanza por etapas. Hasta ahora tiene la estructura base y el layout inicial
(barra de navegación, carrito y mensaje de bienvenida). En las próximas entregas se irán
sumando el catálogo de productos, las rutas, el carrito de compras, el checkout y la
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
| `ItemListContainer` | Contenedor de la sección principal. Recibe la prop `greeting` desde `App` y la muestra centrada en un `<h1>`. Más adelante mostrará el listado de productos. |

`App.jsx` arma el layout: renderiza `<Navbar />` e `<ItemListContainer greeting="¡Bienvenidos a Lila del Alba!" />`,
pasando el mensaje de bienvenida de padre a hijo mediante props.

## Estructura del proyecto

```
src/
├── assets/
│   └── logo-flor.png
├── components/
│   ├── CartWidget.jsx
│   ├── CartWidget.css
│   ├── ItemListContainer.jsx
│   ├── ItemListContainer.css
│   ├── Navbar.jsx
│   └── Navbar.css
├── App.jsx
├── index.css
└── main.jsx
```