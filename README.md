# Universal App

Prototipo navegable de la app de seguros Universal (Salud, Auto, Vida, Hogar, GarantiVilla, Viaje, AFI, Fiduciaria, ARS y Asistencia), migrado del HTML/JS original a React + Vite.

Todos los datos son simulados en memoria (sin backend): productos, coberturas, prestadores, fondos, reembolsos y autorizaciones viven en el estado de la aplicación y se reinician al recargar la página.

Este repositorio contiene dos aplicaciones:

1. **App móvil (cliente final)** — `index.html` / `src/main.jsx`. Es el prototipo original: un solo cliente (titular) navega sus propios productos dentro de un mockup de teléfono.
2. **Consola interna de escritorio** — `desktop.html` / `src/main-desktop.jsx`. Pensada para las áreas de Servicio al Cliente, Calle, Sucursales y Backoffice: permite buscar **cualquier cliente** o **cualquier intermediario** (corredor/agente) y su cartera. Al abrir un cliente, la consola incrusta la **misma app móvil** (mismo `AppContext`/`Router`/pantallas) inicializada con los datos de ese cliente, así que el asesor tiene exactamente las mismas consultas y puede ejecutar las mismas acciones que el cliente en su propia app (cotizar, comprar, reclamos, reembolsos, autorizaciones, renovaciones, endosos, pagos, telemedicina, traspaso de ARS, etc.), sin duplicar pantallas.

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

- `src/context/AppContext.jsx` — estado global de la app (navegación tipo pila, productos contratados, formularios de los flujos de cotización/reembolsos/autorizaciones). Acepta un `initialData` opcional (titular, contrato, productos, afiliados, fondos, etc.) para inicializar el estado con los datos de un cliente distinto al de la app móvil; sin ese prop se comporta exactamente igual que antes.
- `src/data/data.js` — datos simulados de referencia (coberturas por plan, prestadores, programas de salud, etc.) y los datos por defecto del cliente único de la app móvil.
- `src/data/clientes.js` — cartera simulada de clientes para la consola de escritorio (cada uno con sus propios productos, dependientes, reembolsos, autorizaciones, afiliados de Salud/ARS, fondos AFI, proyectos de Fiduciaria, traspaso de ARS, etc.) y utilidades de búsqueda.
- `src/data/intermediarios.js` — intermediarios (corredores/agentes) simulados y su cartera de clientes.
- `src/components/` — componentes de UI compartidos (iconos, tarjetas, filas, acordeón de coberturas, tabla comparativa, `PhoneFrame`), reutilizados por ambas apps.
- `src/screens/` — pantallas de la app agrupadas por dominio (tabs principales, productos, cotizador, trámites, pantallas varias). Todas leen los datos del cliente activo desde `useApp()`, nunca de constantes fijas, para poder mostrar cualquier cliente.
- `src/Router.jsx` — despacha la vista activa a la pantalla correspondiente.
- `src/desktop/` — consola de escritorio: selector de área/agente, buscador de clientes/intermediarios, la ficha del intermediario (datos y cartera de clientes) y la ficha del cliente (resumen con KPIs + la app móvil real incrustada, inicializada con los datos de ese cliente vía `AppProvider initialData`).
