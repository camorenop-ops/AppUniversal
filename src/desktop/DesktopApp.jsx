import { useState } from "react";
import "./desktop.css";
import { Icon, LogoLockup } from "../components/Icon";
import { SearchScreen } from "./SearchScreen";
import { ClienteWorkspace } from "./ClienteWorkspace";
import { IntermediarioWorkspace } from "./IntermediarioWorkspace";
import { getClientePorId } from "../data/clientes";
import { getIntermediarioPorId } from "../data/intermediarios";

const AREAS = [
  ["Servicio al Cliente", "messagecircle"],
  ["Calle", "car"],
  ["Sucursales", "building"],
  ["Backoffice", "filedesc"],
];

function AreaLogin({ onEntrar }) {
  const [area, setArea] = useState(null);
  const [nombre, setNombre] = useState("");

  return (
    <div className="agent-login">
      <LogoLockup size={30} />
      <h1>Consola interna Universal</h1>
      <p>Selecciona tu área y tu nombre de usuario para consultar clientes e intermediarios con la misma información de la app Universal.</p>
      <div className="area-grid">
        {AREAS.map(([label, icon]) => (
          <div key={label} className={"area-option" + (area === label ? " on" : "")} onClick={() => setArea(label)}>
            <Icon name={icon} size={18} color={area === label ? "var(--accent)" : "var(--muted)"} />
            <div style={{ marginTop: 6 }}>{label}</div>
          </div>
        ))}
      </div>
      <input
        className="u-input"
        placeholder="Nombre del agente"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <button className="solid" style={{ width: "100%" }} disabled={!area || !nombre.trim()} onClick={() => onEntrar({ area, nombre: nombre.trim() })}>
        Entrar a la consola
      </button>
    </div>
  );
}

export default function DesktopApp() {
  const [sesion, setSesion] = useState(null);
  const [modo, setModo] = useState("cliente");
  const [query, setQuery] = useState("");
  const [vista, setVista] = useState({ view: "buscar" });

  if (!sesion) {
    return (
      <div className="agent-app">
        <AreaLogin onEntrar={setSesion} />
      </div>
    );
  }

  function irABusqueda() {
    setVista({ view: "buscar" });
  }
  function abrirCliente(id) {
    setVista({ view: "cliente", id });
  }
  function abrirIntermediario(id) {
    setVista({ view: "intermediario", id });
  }

  const cliente = vista.view === "cliente" ? getClientePorId(vista.id) : null;
  const intermediario = vista.view === "intermediario" ? getIntermediarioPorId(vista.id) : null;

  return (
    <div className="agent-app">
      <div className="agent-header">
        <div className="brand">
          <LogoLockup size={20} />
          <span>Consola interna</span>
        </div>
        <span className="area-badge">{sesion.area}</span>
        <div className="agent-searchbar">
          <div className="agent-scope">
            <span className={modo === "cliente" ? "on" : ""} onClick={() => setModo("cliente")}>Cliente</span>
            <span className={modo === "intermediario" ? "on" : ""} onClick={() => setModo("intermediario")}>Intermediario</span>
          </div>
          <Icon name="search" size={14} color="rgba(255,255,255,.8)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") setVista({ view: "buscar" }); }}
            placeholder={modo === "cliente" ? "Buscar cliente…" : "Buscar intermediario…"}
          />
        </div>
        <span className="agent-name">{sesion.nombre}</span>
        <div className="spacer" />
        <button className="ghost" onClick={() => setSesion(null)}>Cerrar sesión</button>
      </div>

      <div className="agent-breadcrumb">
        <span className="link" onClick={irABusqueda}>Inicio</span>
        {cliente && <> {" › "} {cliente.nombre}</>}
        {intermediario && <> {" › "} {intermediario.nombre}</>}
      </div>

      <div className="agent-main">
        {vista.view === "buscar" && (
          <SearchScreen
            modo={modo}
            setModo={setModo}
            query={query}
            setQuery={setQuery}
            onAbrirCliente={abrirCliente}
            onAbrirIntermediario={abrirIntermediario}
          />
        )}
        {vista.view === "cliente" && cliente && (
          <ClienteWorkspace cliente={cliente} onAbrirIntermediario={abrirIntermediario} onVolver={irABusqueda} />
        )}
        {vista.view === "intermediario" && intermediario && (
          <IntermediarioWorkspace intermediario={intermediario} onAbrirCliente={abrirCliente} onVolver={irABusqueda} />
        )}
      </div>
    </div>
  );
}
