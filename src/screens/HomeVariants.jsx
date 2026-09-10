import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icon";
import { SectionLabel, QuickActionsRow, EstadoBadge, Pill } from "../components/UI";
import { HomeHeader, FilialTabs, FilialContent } from "./HomeShared";
import {
  getGaps, getEcosistemaResumen, getTramitesActivos, getNextBestAction,
} from "../data/insights";

function useGapAction() {
  const { openCotizar, openFondo, openEndosarPoliza } = useApp();
  return (gap) => {
    if (gap.accion === "fondo") return openFondo("aporte", gap.fondoKey);
    if (gap.accion === "endoso") return openEndosarPoliza();
    return openCotizar(gap.key);
  };
}

function RecommendationCard({ gap, onAct }) {
  return (
    <div className="reco-card" onClick={() => onAct(gap)}>
      <div className="reco-icon" style={{ background: gap.color + "1F" }}>
        <Icon name={gap.icon} size={18} color={gap.color} />
      </div>
      <div className="reco-body">
        <div className="reco-title">{gap.titulo}</div>
        <div className="reco-text">{gap.texto}</div>
      </div>
      <Icon name="chevronright" size={16} color="var(--text-muted)" />
    </div>
  );
}

// ---------- Propuesta 1: Ecosistema Universal (venta cruzada) ----------
export function EcosistemaHome() {
  const { products, asistenciaProducts, setFilial } = useApp();
  const act = useGapAction();
  const gaps = getGaps(products, asistenciaProducts);
  const { areas, activas, total } = getEcosistemaResumen(products, asistenciaProducts);

  return (
    <>
      <HomeHeader />
      <div className="card eco-card">
        <div className="eco-card-top">
          <span className="eco-card-label">Tu ecosistema Universal</span>
          <span className="eco-card-count">{activas} de {total} áreas activas</span>
        </div>
        <div className="eco-bar">
          {areas.map((a) => (
            <span
              key={a.key}
              className={"eco-seg" + (a.activo ? " on" : "")}
              onClick={() => setFilial(a.key)}
              title={a.label}
            />
          ))}
        </div>
        <div className="eco-legend">
          {areas.map((a) => (
            <span key={a.key} className={"eco-legend-item" + (a.activo ? " on" : "")} onClick={() => setFilial(a.key)}>
              {a.label}
            </span>
          ))}
        </div>
      </div>

      {gaps.length > 0 && (
        <>
          <SectionLabel>Para ti</SectionLabel>
          {gaps.map((g) => <RecommendationCard key={g.key} gap={g} onAct={act} />)}
        </>
      )}

      <SectionLabel>Explorar por filial</SectionLabel>
      <FilialTabs />
      <FilialContent />
    </>
  );
}

// ---------- Propuesta 2: Autonomía total (autoservicio) ----------
function TramiteRow({ item, onClick }) {
  return (
    <div className="tramite-row" onClick={onClick}>
      <span className="tramite-icon"><Icon name={item.icon} size={16} color="var(--accent)" /></span>
      <div className="tramite-body">
        <div className="tramite-title">{item.titulo}</div>
        <div className="tramite-sub">{item.sub}</div>
      </div>
      <EstadoBadge estado={item.estado} />
    </div>
  );
}

export function AutonomiaHome() {
  const {
    products, reembolsos, autorizaciones,
    openReembolsos, openAutorizaciones, openRenovaciones,
    openAsistenciaSolicitud, openRedMedica, openReclamo, openEndosarPoliza,
    openPagoPolizas, openArsTraspaso, openFondo, openEstadoCuenta,
  } = useApp();
  const tramites = getTramitesActivos(products, reembolsos, autorizaciones);
  const destinoFn = { reembolsos: openReembolsos, autorizaciones: openAutorizaciones, renovaciones: openRenovaciones };

  return (
    <>
      <HomeHeader />
      <SectionLabel>Mis trámites</SectionLabel>
      {tramites.length > 0 ? (
        <div className="card" style={{ padding: "4px 12px" }}>
          {tramites.map((t) => (
            <TramiteRow key={t.key} item={t} onClick={destinoFn[t.destino]} />
          ))}
        </div>
      ) : (
        <div className="card" style={{ fontSize: 13, color: "var(--muted)" }}>No tienes trámites en curso.</div>
      )}

      <SectionLabel>Hazlo tú mismo</SectionLabel>
      <QuickActionsRow items={[
        ["car", "Grúa 24/7", () => openAsistenciaSolicitud("vehicular"), "#E5484D"],
        ["network", "Red médica", openRedMedica, "#0EA5A5"],
        ["alerttriangle", "Reclamo", openReclamo, "#E5484D"],
        ["filedesc", "Endosar póliza", openEndosarPoliza, "#7C5CFC"],
        ["creditcard", "Pago de pólizas", openPagoPolizas, "#1F9254"],
        ["refresh", "Renovación", openRenovaciones, "#2F6FE4"],
        ["network", "Traspaso ARS", openArsTraspaso, "#0EA5A5"],
        ["arrowup", "Aporte a fondo AFI", () => openFondo("aporte"), "#1F9254"],
        ["receipt", "Estado de cuenta", openEstadoCuenta, "#2F6FE4"],
      ]} />

      <SectionLabel>Explorar por filial</SectionLabel>
      <FilialTabs />
      <FilialContent />
    </>
  );
}

// ---------- Propuesta 3: Servicio intuitivo guiado ----------
function NextBestActionCard({ nba, onAct }) {
  return (
    <div className="nba-card">
      <div className="nba-title">{nba.titulo}</div>
      <div className="nba-text">{nba.texto}</div>
      {nba.cta && (
        <button className="solid" style={{ marginTop: 10 }} onClick={onAct}>{nba.cta}</button>
      )}
    </div>
  );
}

const INTENTS = [
  { label: "Pedir grúa", icon: "car", keywords: "grua asistencia vehicular carro", tipo: "asistencia", valor: "vehicular" },
  { label: "Reportar un accidente", icon: "alerttriangle", keywords: "reclamo choque accidente siniestro", tipo: "reclamo" },
  { label: "Pagar una póliza", icon: "creditcard", keywords: "pago pagar poliza factura", tipo: "pago" },
  { label: "Renovar una póliza", icon: "refresh", keywords: "renovacion renovar vencimiento", tipo: "renovacion" },
  { label: "Ver mi red médica", icon: "network", keywords: "medico clinica doctor red", tipo: "redmedica" },
  { label: "Endosar póliza a mi banco", icon: "filedesc", keywords: "endoso banco prestamo hipoteca", tipo: "endoso" },
  { label: "Ver mis fondos AFI", icon: "chart", keywords: "afi fondos pension ahorro inversion", tipo: "filial", valor: "AFI" },
  { label: "Ver mi proyecto Fiduciaria", icon: "building", keywords: "fiduciaria proyecto torre apartamento", tipo: "filial", valor: "Fiduciaria" },
  { label: "Consultar mi afiliación ARS", icon: "heart", keywords: "ars afiliado salud pdss", tipo: "filial", valor: "ARS" },
  { label: "Solicitar asistencia de hogar", icon: "home", keywords: "hogar plomeria electricidad cerrajero", tipo: "asistencia", valor: "hogar" },
  { label: "Cotizar Seguro de Viaje", icon: "send", keywords: "viaje cotizar nuevo vuelo", tipo: "cotizar", valor: "viaje" },
  { label: "Traspasar mi ARS", icon: "network", keywords: "traspaso ars cambiar administradora", tipo: "traspaso" },
];

export function IntuitivoHome() {
  const {
    products, reembolsos, asistenciaProducts, activeFilial, setFilial,
    openRenovaciones, openReembolsos, openCotizar, openEndosarPoliza,
    openAsistenciaSolicitud, openReclamo, openPagoPolizas, openRedMedica, openArsTraspaso,
  } = useApp();
  const [q, setQ] = useState("");
  const gaps = getGaps(products, asistenciaProducts);
  const nba = getNextBestAction(products, reembolsos, gaps);
  const act = useGapAction();

  function onAct() {
    if (nba.tipo === "renovacion") return openRenovaciones();
    if (nba.tipo === "reembolso") return openReembolsos();
    if (nba.tipo === "gap") return act(nba.gap);
  }

  function runIntent(it) {
    if (it.tipo === "asistencia") return openAsistenciaSolicitud(it.valor);
    if (it.tipo === "reclamo") return openReclamo();
    if (it.tipo === "pago") return openPagoPolizas();
    if (it.tipo === "renovacion") return openRenovaciones();
    if (it.tipo === "redmedica") return openRedMedica();
    if (it.tipo === "endoso") return openEndosarPoliza();
    if (it.tipo === "filial") return setFilial(it.valor);
    if (it.tipo === "cotizar") return openCotizar(it.valor);
    if (it.tipo === "traspaso") return openArsTraspaso();
  }

  const filtro = q.trim().toLowerCase();
  const intents = filtro
    ? INTENTS.filter((it) => (it.label + " " + it.keywords).toLowerCase().includes(filtro))
    : INTENTS;

  const FILIALES_SIMPLES = ["Seguros", "AFI", "Fiduciaria", "ARS", "Asistencia"];

  return (
    <>
      <HomeHeader />
      <NextBestActionCard nba={nba} onAct={onAct} />

      <SectionLabel>¿Qué necesitas hacer?</SectionLabel>
      <div className="search-bar">
        <Icon name="search" size={15} />
        <input
          className="intent-input"
          placeholder="Escribe lo que necesitas, por ejemplo: grúa, pago, viaje…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="intent-grid">
        {intents.map((it) => (
          <div key={it.label} className="intent-chip" onClick={() => runIntent(it)}>
            <Icon name={it.icon} size={16} color="var(--accent)" />
            <span>{it.label}</span>
          </div>
        ))}
        {intents.length === 0 && (
          <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Sin resultados para "{q}". Prueba con otra palabra.</div>
        )}
      </div>

      <SectionLabel>Filiales</SectionLabel>
      <div className="filial-pills">
        {FILIALES_SIMPLES.map((f) => (
          <Pill key={f} label={f} on={f === activeFilial} onClick={() => setFilial(f)} />
        ))}
      </div>
      <FilialContent />
    </>
  );
}
