import { useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { PhoneFrame } from "./components/PhoneFrame";

const PROPUESTAS = [
  {
    key: "ecosistema",
    label: "1 · Ecosistema",
    eyebrow: "UNIVERSAL APP · PROPUESTA 1 · VENTA CRUZADA",
    title: "Un ecosistema, no cinco apps con el mismo logo",
    desc: "Inicio resume cuántas de las áreas del grupo (Seguros, AFI, Fiduciaria, ARS, Asistencia) están activas y recomienda la siguiente, en vez de esconder cada filial detrás de su propia pestaña.",
  },
  {
    key: "autonomia",
    label: "2 · Autonomía",
    eyebrow: "UNIVERSAL APP · PROPUESTA 2 · AUTOSERVICIO",
    title: "Todo lo que puedes resolver tú mismo, al frente",
    desc: "Inicio abre con \"Mis trámites\" (estado real de reembolsos, autorizaciones y renovaciones) y una fila única de accesos rápidos global, sin repartir el autoservicio por filial.",
  },
  {
    key: "intuitivo",
    label: "3 · Intuitiva",
    eyebrow: "UNIVERSAL APP · PROPUESTA 3 · SERVICIO INTUITIVO",
    title: "Dile a la app qué necesitas, no busques dónde está",
    desc: "Inicio prioriza un solo próximo paso y un buscador de intenciones en lenguaje simple, dejando las 8 pestañas de filial como una fila secundaria de texto.",
  },
];

function TopBar() {
  const { proposal, setProposal } = useApp();
  const activa = PROPUESTAS.find((p) => p.key === proposal) || PROPUESTAS[0];
  return (
    <div className="topbar">
      <p className="eyebrow">{activa.eyebrow}</p>
      <h1>{activa.title}</h1>
      <p>{activa.desc}</p>
      <div className="proposal-switcher">
        {PROPUESTAS.map((p) => (
          <button
            key={p.key}
            type="button"
            className={"proposal-btn" + (p.key === proposal ? " on" : "")}
            onClick={() => setProposal(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    if (isStandalone) document.body.classList.add("standalone");
  }, []);

  return (
    <AppProvider>
      <TopBar />
      <div className="stage">
        <PhoneFrame />
      </div>
    </AppProvider>
  );
}
