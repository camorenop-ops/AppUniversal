# Universal App

Prototipo navegable de la app de seguros Universal (Salud, Auto, Vida, Hogar, GarantiVilla, Viaje, AFI, Fiduciaria, ARS y Asistencia), migrado del HTML/JS original a React + Vite.

Todos los datos son simulados en memoria (sin backend): productos, coberturas, prestadores, fondos, reembolsos y autorizaciones viven en el estado de la aplicación y se reinician al recargar la página.

Este repositorio contiene dos aplicaciones:

1. **App móvil (cliente final)** — `index.html` / `src/main.jsx`. Es el prototipo original: un solo cliente (titular) navega sus propios productos dentro de un mockup de teléfono.
2. **Consola interna de escritorio** — `desktop.html` / `src/main-desktop.jsx`. Pensada para las áreas de Servicio al Cliente, Calle, Sucursales y Backoffice: permite buscar **cualquier cliente** o **cualquier intermediario** (corredor/agente) y su cartera. La ficha del cliente es un tablero nativo de escritorio (pestañas por dominio: Resumen, Pólizas, Afiliados de Salud, ARS, Reembolsos y autorizaciones, AFI, Fiduciaria, Asistencia, Traspaso ARS) con los mismos accesos rápidos que tiene el cliente en su app — Renovación, Endosar póliza, Pago, Reclamo, Reembolsos, Red médica, Autorizaciones, Carnet, Cambiar de plan, Agregar cobertura/dependiente, Coberturas del PDSS, Solicitar traspaso de ARS, Solicitar rescate/aporte AFI, Estado de cuenta, Asistencia vehicular/hogar, Cotizar, etc. Cada acceso rápido ejecuta el flujo real (mismo `AppContext`/`Router`/pantallas que la app móvil, sin duplicar lógica) dentro de un panel superpuesto sobre el tablero, en vez de simular un teléfono.

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
- `src/Router.jsx` — despacha la vista activa a la pantalla correspondiente; no depende de `PhoneFrame`, así que se puede montar en cualquier contenedor (el mockup de teléfono de la app móvil, o el panel superpuesto de la consola de escritorio).
- `src/desktop/` — consola de escritorio: selector de área/agente, buscador de clientes/intermediarios, la ficha del intermediario (datos y cartera de clientes) y `ClienteWorkspace.jsx`, el tablero nativo del cliente (KPIs, pestañas por dominio y accesos rápidos) que envuelve `AppProvider initialData={cliente}` + `Router` para ejecutar cada acción en un panel superpuesto.
