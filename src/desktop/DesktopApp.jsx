import { useState } from "react";
import "./desktop.css";
import { Icon, LogoLockup } from "../components/Icon";
import { SectionLabel } from "../components/UI";
import { SearchScreen } from "./SearchScreen";
import { ClienteWorkspace } from "./ClienteWorkspace";
import { IntermediarioWorkspace } from "./IntermediarioWorkspace";
import { IdentificarPrestadorForm, PrestadorConsultaView } from "./PrestadorConsultaView";
import { getClientePorId } from "../data/clientes";
import { getIntermediarioPorId } from "../data/intermediarios";

const AREAS = [
  ["Servicio al Cliente", "messagecircle"],
  ["Calle", "car"],
  ["Sucursales", "building"],
  ["Backoffice", "filedesc"],
];

const NOVEDADES = [
  { icon: "sparkles", titulo: "Nueva cobertura de Telemedicina 24/7", detalle: "Los planes Alpha y Exclusivo ahora incluyen consultas de telemedicina sin límite mensual." },
  { icon: "creditcard", titulo: "Carnet Digital desde la consola", detalle: "Ya puedes generar y enviar el carnet digital de cualquier cliente directamente por WhatsApp desde la ficha de póliza." },
  { icon: "clock", titulo: "Nuevo plazo de reembolsos", detalle: "El plazo máximo para solicitar un reembolso se redujo de 30 a 15 días desde la fecha del servicio." },
  { icon: "shieldplus", titulo: "Promoción Asistencia Vehicular", detalle: "2 meses gratis de Gold Assist para clientes que renueven su póliza de Auto este mes." },
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

function ContextoBar({ prestador, intermediario, onSalirPrestador, onSalirIntermediario }) {
  if (!prestador && !intermediario) return null;
  return (
    <div className="agent-context-bar">
      {prestador && (
        <div className="agent-context-chip">
          <Icon name="buildinghospital" size={14} color="var(--accent)" />
          <span>Consulta de prestador: <strong>{prestador.nombre}</strong> ({prestador.tipo})</span>
          <span className="agent-context-close" onClick={onSalirPrestador}><Icon name="close" size={12} /></span>
        </div>
      )}
      {intermediario && (
        <div className="agent-context-chip">
          <Icon name="userplus" size={14} color="var(--accent)" />
          <span>Cartera de: <strong>{intermediario.nombre}</strong></span>
          <span className="agent-context-close" onClick={onSalirIntermediario}><Icon name="close" size={12} /></span>
        </div>
      )}
    </div>
  );
}

function Briefing({ sesion, onContinuar }) {
  return (
    <div className="agent-login" style={{ maxWidth: 520 }}>
      <LogoLockup size={28} />
      <h1>Hola, {sesion.nombre}</h1>
      <p>
        Ingresaste por el canal <strong style={{ color: "var(--accent)" }}>{sesion.area}</strong>.
        Antes de continuar, revisa las novedades de esta semana.
      </p>
      <div style={{ textAlign: "left" }}>
        <SectionLabel>Novedades para tu canal</SectionLabel>
        {NOVEDADES.map((n, i) => (
          <div key={i} className="card" style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name={n.icon} size={17} color="var(--accent)" />
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{n.titulo}</div>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>{n.detalle}</div>
          </div>
        ))}
      </div>
      <button className="solid" style={{ width: "100%", marginTop: 6 }} onClick={onContinuar}>
        Continuar a la consola
      </button>
    </div>
  );
}

export default function DesktopApp() {
  const [sesion, setSesion] = useState(null);
  const [mostrarBriefing, setMostrarBriefing] = useState(false);
  const [modo, setModo] = useState("cliente");
  const [query, setQuery] = useState("");
  const [vista, setVista] = useState({ view: "buscar" });
  const [prestadorIdentificado, setPrestadorIdentificado] = useState(null);
  const [intermediarioActivo, setIntermediarioActivo] = useState(null);

  if (!sesion) {
    return (
      <div className="agent-app">
        <AreaLogin onEntrar={(s) => { setSesion(s); setMostrarBriefing(true); }} />
      </div>
    );
  }

  if (mostrarBriefing) {
    return (
      <div className="agent-app">
        <Briefing sesion={sesion} onContinuar={() => setMostrarBriefing(false)} />
      </div>
    );
  }

  function irABusqueda() {
    setVista({ view: "buscar" });
  }
  function abrirCliente(id) {
    setVista(modo === "prestador" ? { view: "prestador", id } : { view: "cliente", id });
  }
  function abrirIntermediario(id) {
    setVista({ view: "intermediario", id });
    setIntermediarioActivo(getIntermediarioPorId(id));
  }
  function cambiarModo(m) {
    setModo(m);
    setVista({ view: "buscar" });
    if (m !== "prestador") {
      setPrestadorIdentificado(null);
    }
    if (m !== "intermediario") {
      setIntermediarioActivo(null);
    }
  }

  const cliente = vista.view === "cliente" ? getClientePorId(vista.id) : null;
  const intermediario = vista.view === "intermediario" ? getIntermediarioPorId(vista.id) : null;
  const clientePrestador = vista.view === "prestador" ? getClientePorId(vista.id) : null;

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
            <span className={modo === "cliente" ? "on" : ""} onClick={() => cambiarModo("cliente")}>Cliente</span>
            <span className={modo === "intermediario" ? "on" : ""} onClick={() => cambiarModo("intermediario")}>Intermediario</span>
            <span className={modo === "prestador" ? "on" : ""} onClick={() => cambiarModo("prestador")}>Prestador</span>
          </div>
          <Icon name="search" size={14} color="rgba(255,255,255,.8)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") setVista({ view: "buscar" }); }}
            placeholder={modo === "cliente" ? "Buscar cliente…" : modo === "intermediario" ? "Buscar intermediario…" : "Buscar cliente para consulta de prestador…"}
          />
        </div>
        <span className="agent-name">{sesion.nombre}</span>
        <div className="spacer" />
        <button className="ghost" onClick={() => setSesion(null)}>Cerrar sesión</button>
      </div>

      <ContextoBar
        prestador={prestadorIdentificado}
        intermediario={intermediarioActivo}
        onSalirPrestador={() => { setPrestadorIdentificado(null); irABusqueda(); }}
        onSalirIntermediario={() => { setIntermediarioActivo(null); irABusqueda(); }}
      />

      <div className="agent-breadcrumb">
        <span className="link" onClick={irABusqueda}>Inicio</span>
        {cliente && <> {" › "} {cliente.nombre}</>}
        {intermediario && <> {" › "} {intermediario.nombre}</>}
        {clientePrestador && <> {" › "} Consulta de prestador · {clientePrestador.nombre}</>}
      </div>

      <div className="agent-main">
        {vista.view === "buscar" && modo === "prestador" && !prestadorIdentificado && (
          <IdentificarPrestadorForm onIdentificar={setPrestadorIdentificado} />
        )}
        {vista.view === "buscar" && (modo !== "prestador" || prestadorIdentificado) && (
          <SearchScreen
            modo={modo}
            setModo={cambiarModo}
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
        {vista.view === "prestador" && clientePrestador && prestadorIdentificado && (
          <PrestadorConsultaView
            prestador={prestadorIdentificado}
            cliente={clientePrestador}
            onVolver={irABusqueda}
          />
        )}
      </div>
    </div>
  );
}
