import { useEffect } from "react";
import { AppProvider } from "./context/AppContext";
import { PhoneFrame } from "./components/PhoneFrame";

export default function App() {
  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    if (isStandalone) document.body.classList.add("standalone");
  }, []);

  return (
    <AppProvider>
      <div className="topbar">
        <p className="eyebrow">UNIVERSAL APP · PROPUESTA B</p>
        <h1>Panel por Línea de Negocio</h1>
        <p>Navegación superior segmentada por filial (Seguros, AFI, Fiduciaria, ARS, Asistencia), coberturas agrupadas por categoría y carnet estilo certificado.</p>
      </div>
      <div className="stage">
        <PhoneFrame />
      </div>
    </AppProvider>
  );
}
