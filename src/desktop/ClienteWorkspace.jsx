import { useState } from "react";
import { Icon } from "../components/Icon";
import { SectionLabel, EstadoBadge, CoverageLine } from "../components/UI";
import { CoberturasAccordion } from "../components/CoberturasAccordion";
import { COBERTURAS_LABEL, COBERTURAS_DATA, PLAN_BASICO_SALUD, LIMITE_POR_CASO_PLAN, COBERTURA_MEDICAMENTOS_PLAN } from "../data/data";
import { polizasActivas } from "../data/clientes";
import { getIntermediarioPorId } from "../data/intermediarios";

const PLANES_PROPIEDAD_DETALLE = ["hogar", "garantivilla"];
const money = (n) => `RD$ ${Number(n || 0).toLocaleString("es-DO")}`;

export function ClienteWorkspace({ cliente, onAbrirIntermediario, onVolver }) {
  const tabs = [
    ["resumen", "Resumen"],
    ["polizas", "Pólizas"],
    ["afiliados", "Afiliados de Salud"],
    ["ars", "ARS"],
    ...(cliente.reembolsos.length || cliente.autorizaciones.length ? [["tramites", "Reembolsos y autorizaciones"]] : []),
    ...(cliente.fondos.length ? [["afi", "AFI"]] : []),
    ...(cliente.proyectos.length || cliente.estadoCuenta ? [["fiduciaria", "Fiduciaria"]] : []),
    ["asistencia", "Asistencia"],
    ...(cliente.traspasoArs ? [["traspaso", "Traspaso ARS"]] : []),
  ];
  const [tab, setTab] = useState("resumen");
  const intermediario = cliente.intermediarioId ? getIntermediarioPorId(cliente.intermediarioId) : null;

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
                <span className="link" style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 700 }} onClick={() => onAbrirIntermediario(intermediario.id)}>
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

      <div className="agent-tabs">
        {tabs.map(([key, label]) => (
          <div key={key} className={"agent-tab" + (tab === key ? " on" : "")} onClick={() => setTab(key)}>{label}</div>
        ))}
      </div>

      {tab === "resumen" && <ResumenTab cliente={cliente} />}
      {tab === "polizas" && <PolizasTab cliente={cliente} />}
      {tab === "afiliados" && <AfiliadosSaludTab cliente={cliente} />}
      {tab === "ars" && <ArsTab cliente={cliente} />}
      {tab === "tramites" && <TramitesTab cliente={cliente} />}
      {tab === "afi" && <AfiTab cliente={cliente} />}
      {tab === "fiduciaria" && <FiduciariaTab cliente={cliente} />}
      {tab === "asistencia" && <AsistenciaTab cliente={cliente} />}
      {tab === "traspaso" && <TraspasoTab cliente={cliente} />}
    </div>
  );
}

function ResumenTab({ cliente }) {
  const activas = polizasActivas(cliente);
  const primaTotal = cliente.products.filter((p) => !p.noContratado && p.primaActual).reduce((s, p) => s + p.primaActual, 0);
  const pendiente = cliente.products.filter((p) => !p.noContratado && p.montoPendiente).reduce((s, p) => s + p.montoPendiente, 0);
  const enRevision = [...cliente.reembolsos, ...cliente.autorizaciones].filter((r) => r.estado === "En revisión").length;

  return (
    <>
      <div className="agent-kpis">
        <div className="agent-kpi"><div className="n">{activas}</div><div className="l">Pólizas activas</div></div>
        <div className="agent-kpi"><div className="n">{money(primaTotal)}</div><div className="l">Prima vigente total</div></div>
        <div className="agent-kpi"><div className="n">{money(pendiente)}</div><div className="l">Monto pendiente de pago</div></div>
        <div className="agent-kpi"><div className="n">{enRevision}</div><div className="l">Trámites en revisión</div></div>
      </div>
      <SectionLabel>Productos del cliente</SectionLabel>
      <div className="agent-grid2">
        {cliente.products.map((p) => (
          <div className="card" key={p.key}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name={p.icon} size={20} color={p.noContratado ? "var(--text-muted)" : "var(--accent)"} />
              <div style={{ fontWeight: 600, fontSize: 14 }}>{p.label}</div>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 6 }}>{p.sub}</div>
            {!p.noContratado && <div className="badge-active" style={{ marginTop: 8 }}>Activo</div>}
          </div>
        ))}
        {cliente.asistenciaProducts.map((p) => (
          <div className="card" key={p.key}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name={p.icon} size={20} color={p.noContratado ? "var(--text-muted)" : "var(--accent)"} />
              <div style={{ fontWeight: 600, fontSize: 14 }}>{p.label}</div>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 6 }}>{p.sub}</div>
            {!p.noContratado && <div className="badge-active" style={{ marginTop: 8 }}>Activo</div>}
          </div>
        ))}
      </div>
    </>
  );
}

function PolizasTab({ cliente }) {
  return (
    <>
      {cliente.products.map((p) => (
        <div className="card" key={p.key} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name={p.icon} size={22} color={p.noContratado ? "var(--text-muted)" : "var(--accent)"} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{p.label}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{p.sub}</div>
              </div>
            </div>
            {!p.noContratado && <div className="badge-active">Activo</div>}
          </div>

          {!p.noContratado && (
            <>
              {p.extra && <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 10 }}>{p.extra}</div>}
              {p.vehiculos && (
                <div style={{ marginTop: 10 }}>
                  {p.vehiculos.map((v, i) => (
                    <div key={i} style={{ fontSize: 13, color: "#1a1f2b", marginTop: i > 0 ? 4 : 0 }}>
                      {v.marca} {v.modelo} {v.anio} — placa {v.placa}, color {v.color}
                    </div>
                  ))}
                </div>
              )}
              {(p.renovacion || p.primaActual != null) && (
                <div style={{ display: "flex", gap: 22, flexWrap: "wrap", marginTop: 12, fontSize: 12.5 }}>
                  {p.renovacion && <span style={{ color: "var(--muted)" }}>Renovación: <strong style={{ color: "#1a1f2b" }}>{p.renovacion}</strong></span>}
                  {p.primaActual != null && <span style={{ color: "var(--muted)" }}>Prima vigente: <strong style={{ color: "#1a1f2b" }}>{money(p.primaActual)}</strong></span>}
                  {p.primaRenovacion != null && <span style={{ color: "var(--muted)" }}>Prima renovación: <strong style={{ color: "#1a1f2b" }}>{money(p.primaRenovacion)}</strong></span>}
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

function AfiliadosSaludTab({ cliente }) {
  const nombres = [cliente.nombre, ...cliente.dependientes];
  const info = cliente.afiliadosSalud || {};
  const salud = cliente.products.find((p) => p.key === "salud" && !p.noContratado);

  if (!salud) {
    return <div className="agent-empty">Este cliente no tiene un plan de Salud activo.</div>;
  }

  const limiteTotal = LIMITE_POR_CASO_PLAN[salud.plan];
  const medicamentosTotal = COBERTURA_MEDICAMENTOS_PLAN[salud.plan];

  return (
    <table className="agent-table">
      <thead>
        <tr>
          <th>Afiliado</th><th>Parentesco</th><th>Edad</th>
          <th>Límite por caso disponible</th><th>Medicamentos disponible</th>
        </tr>
      </thead>
      <tbody>
        {nombres.map((n) => {
          const d = info[n] || { parentesco: n === cliente.nombre ? "Titular" : "Dependiente", edad: null, limiteUsado: 0, medicamentosUsado: 0 };
          return (
            <tr key={n}>
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
  );
}

function ArsTab({ cliente }) {
  const nombres = [cliente.nombre, ...cliente.dependientes];
  const uso = cliente.afiliadosArsUsado || {};
  const { limitePorCaso, coberturaMedicamentos, nombre: nombrePlan } = PLAN_BASICO_SALUD;

  return (
    <>
      <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 12 }}>Plan de Servicios de Salud (PDSS) — {nombrePlan}</div>
      <table className="agent-table">
        <thead>
          <tr><th>Afiliado</th><th>Límite por caso disponible</th><th>Medicamentos disponible</th></tr>
        </thead>
        <tbody>
          {nombres.map((n) => {
            const u = uso[n] || { limiteUsado: 0, medicamentosUsado: 0 };
            return (
              <tr key={n}>
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

function EstadoRow({ item, extra }) {
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
      {extra}
    </div>
  );
}

function TramitesTab({ cliente }) {
  return (
    <>
      <SectionLabel>Autorizaciones</SectionLabel>
      {cliente.autorizaciones.length === 0 && <div className="agent-empty">Sin autorizaciones registradas.</div>}
      {cliente.autorizaciones.map((a, i) => <EstadoRow key={i} item={a} />)}
      <SectionLabel>Reembolsos</SectionLabel>
      {cliente.reembolsos.length === 0 && <div className="agent-empty">Sin reembolsos registrados.</div>}
      {cliente.reembolsos.map((r, i) => <EstadoRow key={i} item={r} />)}
    </>
  );
}

function AfiTab({ cliente }) {
  return (
    <div className="agent-grid2">
      {cliente.fondos.map((f) => (
        <div className="card" key={f.key}>
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
  );
}

function FiduciariaTab({ cliente }) {
  return (
    <>
      {cliente.proyectos.length > 0 && (
        <>
          <SectionLabel>Proyectos</SectionLabel>
          {cliente.proyectos.map((p, i) => (
            <div className="card" key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
              {p.rows.map((r, j) => <CoverageLine key={j} item={r} />)}
            </div>
          ))}
        </>
      )}
      {cliente.estadoCuenta && (
        <>
          <SectionLabel>Estado de cuenta — {cliente.estadoCuenta.proyecto}</SectionLabel>
          <div className="card" style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Saldo pendiente</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>{cliente.estadoCuenta.saldoPendiente}</div>
          </div>
          {cliente.estadoCuenta.pagos.map((p, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <div>
                <div style={{ fontSize: 13 }}>{p[1]}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p[0]}</div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>{p[2]}</span>
            </div>
          ))}
        </>
      )}
    </>
  );
}

function AsistenciaTab({ cliente }) {
  return (
    <div className="agent-grid2">
      {cliente.asistenciaProducts.map((p) => (
        <div className="card" key={p.key}>
          <Icon name={p.icon} size={20} color={p.noContratado ? "var(--text-muted)" : "var(--accent)"} />
          <div style={{ fontWeight: 600, fontSize: 14, marginTop: 8 }}>{p.label}</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>{p.sub}</div>
        </div>
      ))}
    </div>
  );
}

function TraspasoTab({ cliente }) {
  const t = cliente.traspasoArs;
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
