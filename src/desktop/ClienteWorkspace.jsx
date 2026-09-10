import { useState } from "react";
import { AppProvider, useApp } from "../context/AppContext";
import { Router } from "../Router";
import { Icon } from "../components/Icon";
import { SectionLabel, EstadoBadge, CoverageLine, Row } from "../components/UI";
import { CoberturasAccordion } from "../components/CoberturasAccordion";
import { COBERTURAS_LABEL, COBERTURAS_DATA, PLAN_BASICO_SALUD, LIMITE_POR_CASO_PLAN, COBERTURA_MEDICAMENTOS_PLAN } from "../data/data";
import { polizasActivas } from "../data/clientes";
import { getIntermediarioPorId } from "../data/intermediarios";

const PLANES_PROPIEDAD_DETALLE = ["hogar", "garantivilla"];
const money = (n) => `RD$ ${Number(n || 0).toLocaleString("es-DO")}`;

const PREFIJO_POLIZA = {
  salud: "SAL", auto: "VEH", vida: "VID", hogar: "CAS", garantivilla: "VIL", viaje: "VIA",
  goldassist: "GAS", asistenciahogar: "ASH",
};
function numeroPoliza(cliente, product) {
  const prefijo = PREFIJO_POLIZA[product.key] || "POL";
  const digitos = (cliente.contrato || "").replace(/\D/g, "").slice(-6) || "000000";
  return `${prefijo}-${digitos}-01`;
}
function iniciales(nombre) {
  return nombre.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

function AccionesRapidas({ items }) {
  return (
    <div className="agent-actions">
      {items.map(([icon, label, onClick], i) => (
        <button key={i} className="agent-action" onClick={onClick}>
          <Icon name={icon} size={15} /> {label}
        </button>
      ))}
    </div>
  );
}

export function ClienteWorkspace({ cliente, onAbrirIntermediario, onVolver }) {
  const initialData = { ...cliente, titular: cliente.nombre };
  return (
    <AppProvider key={cliente.id} initialData={initialData}>
      <ClienteWorkspaceInner cliente={cliente} onAbrirIntermediario={onAbrirIntermediario} onVolver={onVolver} />
    </AppProvider>
  );
}

function ClienteWorkspaceInner({ cliente, onAbrirIntermediario, onVolver }) {
  const app = useApp();
  const { current, products, reembolsos, autorizaciones, fondos, proyectos, estadoCuenta, traspasoArsPendiente, goTab } = app;
  const [tab, setTab] = useState("resumen");
  const [polizaSeleccionada, setPolizaSeleccionada] = useState(null);
  const intermediario = cliente.intermediarioId ? getIntermediarioPorId(cliente.intermediarioId) : null;
  const enFlujo = current.view !== "tab";

  const tabs = [
    ["resumen", "Resumen"],
    ["polizas", "Pólizas"],
    ["afiliados", "Afiliados de Salud"],
    ["ars", "ARS"],
    ...(reembolsos.length || autorizaciones.length ? [["tramites", "Reembolsos y autorizaciones"]] : []),
    ...(fondos.length ? [["afi", "AFI"]] : []),
    ...(proyectos.length || estadoCuenta ? [["fiduciaria", "Fiduciaria"]] : []),
    ["asistencia", "Asistencia"],
    ...(traspasoArsPendiente ? [["traspaso", "Traspaso ARS"]] : []),
  ];

  const activas = polizasActivas({ products });
  const primaTotal = products.filter((p) => !p.noContratado && p.primaActual).reduce((s, p) => s + p.primaActual, 0);
  const pendiente = products.filter((p) => !p.noContratado && p.montoPendiente).reduce((s, p) => s + p.montoPendiente, 0);
  const enRevision = [...reembolsos, ...autorizaciones].filter((r) => r.estado === "En revisión").length;

  return (
    <div>
      <div className="agent-clientheader">
        <div>
          <h2>{cliente.nombre}</h2>
          <div className="meta">
            <span>Cédula: <strong>{cliente.cedula}</strong></span>
            <span>Contrato: <strong>{cliente.contrato}</strong></span>
            <span>Cliente desde: <strong>{cliente.afiliadoDesde}</strong></span>
            <span>Tel: <strong>{cliente.telefono}</strong></span>
            <span>Correo: <strong>{cliente.correo}</strong></span>
            <span>
              Intermediario:{" "}
              {intermediario ? (
                <span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 700 }} onClick={() => onAbrirIntermediario(intermediario.id)}>
                  {intermediario.nombre}
                </span>
              ) : (
                <strong>Canal directo</strong>
              )}
            </span>
          </div>
        </div>
        <button onClick={onVolver}>Nueva búsqueda</button>
      </div>

      <div className="agent-kpis">
        <div className="agent-kpi"><div className="n">{activas}</div><div className="l">Pólizas activas</div></div>
        <div className="agent-kpi"><div className="n">{money(primaTotal)}</div><div className="l">Prima vigente total</div></div>
        <div className="agent-kpi"><div className="n">{money(pendiente)}</div><div className="l">Monto pendiente de pago</div></div>
        <div className="agent-kpi"><div className="n">{enRevision}</div><div className="l">Trámites en revisión</div></div>
      </div>

      <div className="agent-tabs">
        {tabs.map(([key, label]) => (
          <div key={key} className={"agent-tab" + (tab === key ? " on" : "")} onClick={() => setTab(key)}>{label}</div>
        ))}
      </div>

      {tab === "resumen" && <ResumenTab onAbrirPoliza={setPolizaSeleccionada} />}
      {tab === "polizas" && <PolizasTab />}
      {tab === "afiliados" && <AfiliadosSaludTab titular={cliente.nombre} />}
      {tab === "ars" && <ArsTab titular={cliente.nombre} />}
      {tab === "tramites" && <TramitesTab />}
      {tab === "afi" && <AfiTab />}
      {tab === "fiduciaria" && <FiduciariaTab />}
      {tab === "asistencia" && <AsistenciaTab />}
      {tab === "traspaso" && <TraspasoTab />}

      {enFlujo && (
        <div className="agent-flow-overlay" onClick={(e) => { if (e.target === e.currentTarget) goTab("home"); }}>
          <div className="agent-flow-panel">
            <div className="agent-flow-close" onClick={() => goTab("home")}>
              <Icon name="close" size={16} /> Cerrar
            </div>
            <div className="agent-flow-body">
              <Router />
            </div>
          </div>
        </div>
      )}

      {polizaSeleccionada && (
        <PolizaPanel
          cliente={cliente}
          product={polizaSeleccionada}
          intermediario={intermediario}
          onAbrirIntermediario={onAbrirIntermediario}
          onClose={() => setPolizaSeleccionada(null)}
        />
      )}
    </div>
  );
}

function PolizaPanel({ cliente, product, intermediario, onAbrirIntermediario, onClose }) {
  const { titular, dependientes, openCarnet, openCarnetBien, openCoberturasDetalle, openPagoPolizas, openReclamo, seleccionarPolizaReclamo, openInfo, openAsistenciaSolicitud } = useApp();
  const esAsistencia = product.key === "goldassist" || product.key === "asistenciahogar";

  function ejecutar(fn) {
    fn();
    onClose();
  }

  const acciones = esAsistencia
    ? [
        ["filedesc", "Ver detalle", "Cobertura y condiciones", () => ejecutar(() => openInfo("Asistencia", product.key))],
        ["alerttriangle", "Reportar incidente", "Solicitar asistencia ahora", () => ejecutar(() => openAsistenciaSolicitud(product.key === "asistenciahogar" ? "hogar" : "vehicular"))],
      ]
    : [
        ["creditcard", "Carnet Digital", "Enviar por WhatsApp", () => ejecutar(() => (product.key === "salud" ? openCarnet() : openCarnetBien(product.key)))],
        ["filedesc", "Condiciones", "Ver coberturas", () => ejecutar(() => openCoberturasDetalle(PLANES_PROPIEDAD_DETALLE.includes(product.key) ? "Amplia" : product.plan))],
        ["clock", "Historial de pagos", "Ver pagos y renovación", () => ejecutar(openPagoPolizas)],
        ["alerttriangle", "Reportar incidente", "Iniciar reclamación", () => ejecutar(() => { openReclamo(); seleccionarPolizaReclamo(product.key); })],
      ];

  return (
    <div className="poliza-panel-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="poliza-panel">
        <div className="poliza-panel-header">
          <div className="poliza-panel-close" onClick={onClose}><Icon name="close" size={18} color="#fff" /></div>
          <div className="poliza-panel-eyebrow">Ficha de póliza</div>
          <div className="poliza-panel-title">{product.label}{product.plan ? ` ${product.plan}` : ""}</div>
          <div className="poliza-panel-id">{numeroPoliza(cliente, product)}</div>
        </div>

        <div className="poliza-panel-body">
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
              <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Estado de la póliza</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--success-text)" }}>Al día</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid var(--border)" }}>
              <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Titular</span>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>{titular}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 4px", borderTop: "1px solid var(--border)" }}>
              <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Plan / Detalle</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, textAlign: "right" }}>
                {product.key === "salud" ? `${dependientes.length} dependientes` : (product.extra || product.sub)}
              </span>
            </div>
          </div>

          <SectionLabel>Acciones inmediatas</SectionLabel>
          <div className="poliza-actions-grid">
            {acciones.map(([icon, label, sub, onClick], i) => (
              <div key={i} className="poliza-action-btn" onClick={onClick}>
                <Icon name={icon} size={18} color="var(--accent)" />
                <div className="lbl">{label}</div>
                <div className="sub">{sub}</div>
              </div>
            ))}
          </div>

          <SectionLabel>Intermediario asignado</SectionLabel>
          {intermediario ? (
            <div className="poliza-intermediario-card" onClick={() => { onClose(); onAbrirIntermediario(intermediario.id); }}>
              <div className="poliza-avatar">{iniciales(intermediario.nombre)}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{intermediario.nombre}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>{intermediario.tipo} · Cód: {intermediario.codigo}</div>
                <div style={{ fontSize: 11.5, color: "var(--accent)", marginTop: 2 }}>{intermediario.correo} · {intermediario.telefono}</div>
              </div>
            </div>
          ) : (
            <div className="agent-empty">Canal directo, sin intermediario asignado.</div>
          )}
        </div>

        <div className="poliza-panel-footer">
          <button onClick={onClose}>Cerrar</button>
          <button className="solid" onClick={() => window.print()}>Imprimir extracto</button>
        </div>
      </div>
    </div>
  );
}

function ResumenTab({ onAbrirPoliza }) {
  const { products, asistenciaProducts } = useApp();
  return (
    <>
      <SectionLabel>Productos del cliente</SectionLabel>
      <div className="agent-grid2">
        {[...products, ...asistenciaProducts].map((p) => (
          <div
            className={"card" + (p.noContratado ? "" : " card-clickable")}
            key={p.key}
            onClick={() => !p.noContratado && onAbrirPoliza(p)}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name={p.icon} size={20} color={p.noContratado ? "var(--text-muted)" : "var(--accent)"} />
                <div style={{ fontWeight: 600, fontSize: 14 }}>{p.label}</div>
              </div>
              {!p.noContratado && <Icon name="chevronright" size={15} color="var(--text-muted)" />}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 6 }}>{p.sub}</div>
            {!p.noContratado && <div className="badge-active" style={{ marginTop: 8 }}>Activo</div>}
          </div>
        ))}
      </div>
    </>
  );
}

function PolizasTab() {
  const { products, openRenovaciones, openEndosarPoliza, openPagoPolizas, openReclamo, openCotizar } = useApp();
  return (
    <>
      <SectionLabel>Accesos rápidos</SectionLabel>
      <AccionesRapidas items={[
        ["refresh", "Renovación", openRenovaciones],
        ["filedesc", "Endosar póliza", openEndosarPoliza],
        ["creditcard", "Pago de pólizas", openPagoPolizas],
        ["alerttriangle", "Reclamo", openReclamo],
      ]} />
      <SectionLabel>Pólizas</SectionLabel>
      {products.map((p) => (
        <div className="card" key={p.key} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name={p.icon} size={22} color={p.noContratado ? "var(--text-muted)" : "var(--accent)"} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{p.label}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{p.sub}</div>
              </div>
            </div>
            {p.noContratado
              ? <button onClick={() => openCotizar(p.key)}>Cotizar</button>
              : <div className="badge-active">Activo</div>}
          </div>

          {!p.noContratado && (
            <>
              {p.extra && <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 10 }}>{p.extra}</div>}
              {p.vehiculos && (
                <div style={{ marginTop: 10 }}>
                  {p.vehiculos.map((v, i) => (
                    <div key={i} style={{ fontSize: 13, color: "var(--text)", marginTop: i > 0 ? 4 : 0 }}>
                      {v.marca} {v.modelo} {v.anio} — placa {v.placa}, color {v.color}
                    </div>
                  ))}
                </div>
              )}
              {(p.renovacion || p.primaActual != null) && (
                <div style={{ display: "flex", gap: 22, flexWrap: "wrap", marginTop: 12, fontSize: 12.5 }}>
                  {p.renovacion && <span style={{ color: "var(--muted)" }}>Renovación: <strong style={{ color: "var(--text)" }}>{p.renovacion}</strong></span>}
                  {p.primaActual != null && <span style={{ color: "var(--muted)" }}>Prima vigente: <strong style={{ color: "var(--text)" }}>{money(p.primaActual)}</strong></span>}
                  {p.primaRenovacion != null && <span style={{ color: "var(--muted)" }}>Prima renovación: <strong style={{ color: "var(--text)" }}>{money(p.primaRenovacion)}</strong></span>}
                  {!!p.montoPendiente && <span style={{ color: "var(--danger)" }}>Pendiente: <strong>{money(p.montoPendiente)}</strong></span>}
                </div>
              )}
              {p.plan && (
                <div style={{ marginTop: 14 }}>
                  <SectionLabel>{COBERTURAS_LABEL[p.key] || "Coberturas del plan"}</SectionLabel>
                  {PLANES_PROPIEDAD_DETALLE.includes(p.key)
                    ? <CoberturasAccordion planKey="Amplia" />
                    : (COBERTURAS_DATA[p.key]
                      ? COBERTURAS_DATA[p.key].map((item, i) => <CoverageLine key={i} item={item} />)
                      : <CoberturasAccordion planKey={p.plan} />)}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </>
  );
}

function AfiliadosSaludTab({ titular }) {
  const {
    products, dependientes, afiliadosSalud,
    openReembolsos, openRedMedica, openAutorizaciones, openCarnet, openCambioPlan, openAgregarCobertura, openAgregarDependiente,
    openAfiliadoDetalle,
  } = useApp();
  const salud = products.find((p) => p.key === "salud" && !p.noContratado);

  if (!salud) {
    return <div className="agent-empty">Este cliente no tiene un plan de Salud activo.</div>;
  }

  const limiteTotal = LIMITE_POR_CASO_PLAN[salud.plan];
  const medicamentosTotal = COBERTURA_MEDICAMENTOS_PLAN[salud.plan];
  const nombres = [titular, ...dependientes];
  const info = afiliadosSalud || {};

  return (
    <>
      <SectionLabel>Accesos rápidos</SectionLabel>
      <AccionesRapidas items={[
        ["receipt", "Reembolsos", openReembolsos],
        ["network", "Red médica", openRedMedica],
        ["stethoscope", "Autorizaciones", openAutorizaciones],
        ["creditcard", "Carnet", openCarnet],
        ["replace", "Cambiar de plan", openCambioPlan],
        ["plus", "Agregar cobertura", openAgregarCobertura],
        ["userplus", "Agregar dependiente", openAgregarDependiente],
      ]} />
      <SectionLabel>Consulta de afiliados</SectionLabel>
      <table className="agent-table">
        <thead>
          <tr><th>Afiliado</th><th>Parentesco</th><th>Edad</th><th>Límite por caso disponible</th><th>Medicamentos disponible</th></tr>
        </thead>
        <tbody>
          {nombres.map((n) => {
            const d = info[n] || { parentesco: n === titular ? "Titular" : "Dependiente", edad: null, limiteUsado: 0, medicamentosUsado: 0 };
            return (
              <tr key={n} onClick={() => openAfiliadoDetalle(n, "salud")} style={{ cursor: "pointer" }}>
                <td>{n}</td>
                <td>{d.parentesco}</td>
                <td>{d.edad ?? "—"}</td>
                <td>{limiteTotal != null ? money(limiteTotal - d.limiteUsado) : "—"}</td>
                <td>{medicamentosTotal != null ? money(medicamentosTotal - d.medicamentosUsado) : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function ArsTab({ titular }) {
  const { dependientes, afiliadosArsUsado, openAfiliadoDetalle, openCoberturasDetalle, openArsTraspaso } = useApp();
  const nombres = [titular, ...dependientes];
  const uso = afiliadosArsUsado || {};
  const { limitePorCaso, coberturaMedicamentos, nombre: nombrePlan } = PLAN_BASICO_SALUD;

  return (
    <>
      <SectionLabel>Accesos rápidos</SectionLabel>
      <AccionesRapidas items={[
        ["shieldplus", "Coberturas del PDSS", () => openCoberturasDetalle("PDSS")],
        ["network", "Solicitar traspaso", openArsTraspaso],
      ]} />
      <div style={{ fontSize: 12.5, color: "var(--muted)", margin: "12px 0" }}>Plan de Servicios de Salud (PDSS) — {nombrePlan}</div>
      <table className="agent-table">
        <thead>
          <tr><th>Afiliado</th><th>Límite por caso disponible</th><th>Medicamentos disponible</th></tr>
        </thead>
        <tbody>
          {nombres.map((n) => {
            const u = uso[n] || { limiteUsado: 0, medicamentosUsado: 0 };
            return (
              <tr key={n} onClick={() => openAfiliadoDetalle(n, "ars")} style={{ cursor: "pointer" }}>
                <td>{n}</td>
                <td>{money(limitePorCaso - u.limiteUsado)}</td>
                <td>{money(coberturaMedicamentos - u.medicamentosUsado)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function EstadoRow({ item }) {
  return (
    <div className="card" style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13.5 }}>{item.concepto}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{item.fecha}</div>
        </div>
        <EstadoBadge estado={item.estado} />
      </div>
      {item.prestador && <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 6 }}>Prestador: {item.prestador}</div>}
      {(item.monto || item.valorAutorizado) && (
        <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, marginTop: 6 }}>{item.monto || item.valorAutorizado}</div>
      )}
    </div>
  );
}

function TramitesTab() {
  const { reembolsos, autorizaciones, openSolicitarReembolso, openSolicitarAutorizacion } = useApp();
  return (
    <>
      <SectionLabel>Accesos rápidos</SectionLabel>
      <AccionesRapidas items={[
        ["receipt", "Solicitar reembolso", openSolicitarReembolso],
        ["stethoscope", "Solicitar autorización", openSolicitarAutorizacion],
      ]} />
      <SectionLabel>Autorizaciones</SectionLabel>
      {autorizaciones.length === 0 && <div className="agent-empty">Sin autorizaciones registradas.</div>}
      {autorizaciones.map((a, i) => <EstadoRow key={i} item={a} />)}
      <SectionLabel>Reembolsos</SectionLabel>
      {reembolsos.length === 0 && <div className="agent-empty">Sin reembolsos registrados.</div>}
      {reembolsos.map((r, i) => <EstadoRow key={i} item={r} />)}
    </>
  );
}

function AfiTab() {
  const { fondos, openFondo, openFondoDetalle } = useApp();
  return (
    <>
      <SectionLabel>Accesos rápidos</SectionLabel>
      <AccionesRapidas items={[
        ["arrowdown", "Solicitar rescate", () => openFondo("rescate")],
        ["arrowup", "Notificar aporte", () => openFondo("aporte")],
      ]} />
      <SectionLabel>Fondos</SectionLabel>
      <div className="agent-grid2">
        {fondos.map((f) => (
          <div className="card" key={f.key} style={{ cursor: "pointer" }} onClick={() => openFondoDetalle(f.key)}>
            <Icon name="chart" size={20} color={f.invertido ? "var(--accent)" : "var(--text-muted)"} />
            <div style={{ fontWeight: 600, fontSize: 14, marginTop: 8 }}>{f.name}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Perfil de riesgo: {f.perfilRiesgo}</div>
            {f.invertido ? (
              <>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>Saldo actual</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)" }}>{money(f.saldo)}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Invirtiendo desde {f.fechaInicio}</div>
              </>
            ) : (
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, fontStyle: "italic" }}>Sin inversión en este fondo.</div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function FiduciariaTab() {
  const { proyectos, estadoCuenta, openEstadoCuenta, openInfo } = useApp();
  return (
    <>
      <SectionLabel>Accesos rápidos</SectionLabel>
      <AccionesRapidas items={[["receipt", "Estado de cuenta", openEstadoCuenta]]} />
      {proyectos.length > 0 && (
        <>
          <SectionLabel>Proyectos</SectionLabel>
          {proyectos.map((p, i) => (
            <Row key={i} icon="building" label={p.name} onClick={() => openInfo("Fiduciaria", p.name)} />
          ))}
        </>
      )}
      {!estadoCuenta && proyectos.length === 0 && (
        <div className="agent-empty">No tienes proyectos con Fiduciaria.</div>
      )}
    </>
  );
}

function AsistenciaTab() {
  const { asistenciaProducts, openAsistenciaSolicitud, openInfo } = useApp();
  return (
    <>
      <SectionLabel>Accesos rápidos</SectionLabel>
      <AccionesRapidas items={[
        ["car", "Asistencia vehicular", () => openAsistenciaSolicitud("vehicular")],
        ["home", "Asistencia de hogar", () => openAsistenciaSolicitud("hogar")],
      ]} />
      <SectionLabel>Asistencias</SectionLabel>
      <div className="agent-grid2">
        {asistenciaProducts.map((p) => (
          <div
            className="card"
            key={p.key}
            style={{ cursor: p.noContratado ? "default" : "pointer" }}
            onClick={() => !p.noContratado && openInfo("Asistencia", p.key)}
          >
            <Icon name={p.icon} size={20} color={p.noContratado ? "var(--text-muted)" : "var(--accent)"} />
            <div style={{ fontWeight: 600, fontSize: 14, marginTop: 8 }}>{p.label}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>{p.sub}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function TraspasoTab() {
  const { traspasoArsPendiente: t, abrirArsTraspasoSolicitar } = useApp();
  if (!t) {
    return (
      <>
        <SectionLabel>Accesos rápidos</SectionLabel>
        <AccionesRapidas items={[["network", "Solicitar traspaso", abrirArsTraspasoSolicitar]]} />
        <div className="agent-empty">No tiene ninguna solicitud de traspaso de ARS en curso.</div>
      </>
    );
  }
  return (
    <div className="card" style={{ maxWidth: 420 }}>
      <div style={{ fontSize: 12, color: "var(--muted)" }}>Número de solicitud</div>
      <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{t.numeroSolicitud}</div>
      <div style={{ borderTop: "1px dashed var(--border)", margin: "10px 0" }} />
      <div style={{ fontSize: 12, color: "var(--muted)" }}>Estado</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)", marginTop: 2 }}>{t.estado}</div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>Fecha de solicitud</div>
      <div style={{ fontSize: 13, marginTop: 2 }}>{t.fechaSolicitud}</div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>Última actualización</div>
      <div style={{ fontSize: 13, marginTop: 2 }}>{t.ultimaActualizacion}</div>
      <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 14 }}>{t.siguientePaso}</div>
    </div>
  );
}
