# Universal App

Prototipo navegable de la app de seguros Universal (Salud, Auto, Vida, Hogar, GarantiVilla, Viaje, AFI, Fiduciaria, ARS y Asistencia), migrado del HTML/JS original a React + Vite.

Todos los datos son simulados en memoria (sin backend): productos, coberturas, prestadores, fondos, reembolsos y autorizaciones viven en el estado de la aplicación y se reinician al recargar la página.

Este repositorio contiene dos aplicaciones:

1. **App móvil (cliente final)** — `index.html` / `src/main.jsx`. Es el prototipo original: un solo cliente (titular) navega sus propios productos dentro de un mockup de teléfono.
2. **Consola interna de escritorio** — `desktop.html` / `src/main-desktop.jsx`. Pensada para las áreas de Servicio al Cliente, Calle, Sucursales y Backoffice: permite buscar **cualquier cliente** y ver sus productos/coberturas/trámites, o buscar **cualquier intermediario** (corredor/agente) y ver su cartera completa de clientes, con la misma información y componentes visuales que la app Universal.

## Desarrollo

```bash
npm install
npm run dev
```

- App móvil: `http://localhost:5173/`
- Consola de escritorio: `http://localhost:5173/desktop.html`

## Build

```bash
npm run build
```

Genera ambos entry points (`dist/index.html` y `dist/desktop.html`).

## Estructura

- `src/context/AppContext.jsx` — estado global de la app móvil (navegación tipo pila, productos contratados, formularios de los flujos de cotización/reembolsos/autorizaciones).
- `src/data/data.js` — datos simulados de referencia (coberturas por plan, prestadores, fondos, programas de salud, etc.) y los datos del cliente único de la app móvil.
- `src/data/clientes.js` — cartera simulada de clientes para la consola de escritorio (cada uno con sus propios productos, dependientes, reembolsos, autorizaciones, fondos AFI, etc.) y utilidades de búsqueda.
- `src/data/intermediarios.js` — intermediarios (corredores/agentes) simulados y su cartera de clientes.
- `src/components/` — componentes de UI compartidos (iconos, tarjetas, filas, acordeón de coberturas, tabla comparativa), reutilizados por ambas apps.
- `src/screens/` — pantallas de la app móvil agrupadas por dominio (tabs principales, productos, cotizador, trámites, pantallas varias).
- `src/Router.jsx` — despacha la vista activa de la app móvil a la pantalla correspondiente.
- `src/desktop/` — consola de escritorio: selector de área/agente, buscador de clientes/intermediarios y la ficha 360° del cliente (pólizas, afiliados de Salud, ARS, reembolsos/autorizaciones, AFI, Fiduciaria, Asistencia, traspaso de ARS) e intermediario (datos y cartera de clientes).

## Próximos pasos posibles

La consola de escritorio es de solo consulta (lectura). Si se necesita que el personal interno también pueda **ejecutar** trámites en nombre del cliente (reclamos, reembolsos, endosos, cotizaciones), el siguiente paso natural es reutilizar `AppContext`/`Router` de la app móvil dentro de la ficha de cliente de escritorio, parametrizando su estado inicial con los datos del cliente seleccionado en `src/data/clientes.js`.
