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
        <h1>Universal App</h1>
        <p>Prototipo navegable — planes reales de Salud y Auto con detalle de coberturas por categorías.</p>
      </div>
      <div className="stage">
        <PhoneFrame />
      </div>
    </AppProvider>
  );
}
