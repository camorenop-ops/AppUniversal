# Universal App

Prototipo navegable de la app de seguros Universal (Salud, Auto, Vida, Hogar, GarantiVilla, Viaje, AFI, Fiduciaria, ARS y Asistencia), migrado del HTML/JS original a React + Vite.

Todos los datos son simulados en memoria (sin backend): productos, coberturas, prestadores, fondos, reembolsos y autorizaciones viven en el estado de la aplicación y se reinician al recargar la página.

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Estructura

- `src/context/AppContext.jsx` — estado global de la app (navegación tipo pila, productos contratados, formularios de los flujos de cotización/reembolsos/autorizaciones).
- `src/data/data.js` — datos simulados (productos, coberturas por plan, prestadores, fondos, etc.).
- `src/components/` — componentes de UI compartidos (iconos, tarjetas, filas, acordeón de coberturas, tabla comparativa).
- `src/screens/` — pantallas de la app agrupadas por dominio (tabs principales, productos, cotizador, trámites, pantallas varias).
- `src/Router.jsx` — despacha la vista activa a la pantalla correspondiente.
