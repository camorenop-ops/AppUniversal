import { useApp } from "../context/AppContext";
import { BackHeader, SectionLabel, EstadoBadge } from "../components/UI";
import {
  TITULAR_NOMBRE, AFILIADOS_SALUD_INFO, AFILIADOS_ARS_USADO, LIMITE_POR_CASO_PLAN, COBERTURA_MEDICAMENTOS_PLAN, PLAN_BASICO_SALUD,
} from "../data/data";

const INFO_POR_DEFECTO = { parentesco: "Dependiente", limiteUsado: 0, medicamentosUsado: 0, autorizaciones: [], reembolsos: [] };
const USO_ARS_POR_DEFECTO = { limiteUsado: 0, medicamentosUsado: 0 };
const ES_MEDICAMENTO = (item) => item.concepto.toLowerCase().includes("medicamento");

export function AfiliadoDetalleScreen() {
  const { current, products, openAfiliadoCobertura, openCoberturasDetalle } = useApp();
  const { nombre, origen } = current;
  const info = AFILIADOS_SALUD_INFO[nombre] || INFO_POR_DEFECTO;
  const esArs = origen === "ars";
  const uso = esArs ? (AFILIADOS_ARS_USADO[nombre] || USO_ARS_POR_DEFECTO) : info;
  const plan = products.find((p) => p.key === "salud").plan;
  const nombrePlan = esArs ? PLAN_BASICO_SALUD.nombre : plan;
  const limiteTotal = esArs ? PLAN_BASICO_SALUD.limitePorCaso : LIMITE_POR_CASO_PLAN[plan];
  const medicamentosTotal = esArs ? PLAN_BASICO_SALUD.coberturaMedicamentos : COBERTURA_MEDICAMENTOS_PLAN[plan];
  const limiteDisponible = limiteTotal - uso.limiteUsado;
  const medicamentosDisponible = medicamentosTotal - uso.medicamentosUsado;

  return (
    <>
      <BackHeader title={nombre} />
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>{info.parentesco} · {nombrePlan}</div>
      <SectionLabel>Coberturas y saldos disponibles</SectionLabel>
      <div onClick={() => openAfiliadoCobertura(nombre, "limite", origen)} className="card" style={{ marginBottom: 10, cursor: "pointer" }}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Límite por caso</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)", marginTop: 4 }}>RD$ {limiteDisponible.toLocaleString("es-DO")} disponible</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>de RD$ {limiteTotal.toLocaleString("es-DO")} anual</div>
      </div>
      <div onClick={() => openAfiliadoCobertura(nombre, "medicamentos", origen)} className="card" style={{ cursor: "pointer" }}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Cobertura de medicamentos</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)", marginTop: 4 }}>RD$ {medicamentosDisponible.toLocaleString("es-DO")} disponible</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>de RD$ {medicamentosTotal.toLocaleString("es-DO")} anual</div>
      </div>
      {esArs && (
        <div onClick={() => openCoberturasDetalle("PDSS")} className="card" style={{ marginTop: 10, cursor: "pointer" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>Ver coberturas del PDSS</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Detalle completo del Plan de Servicios de Salud según la Ley 87-01</div>
        </div>
      )}
    </>
  );
}

export function AfiliadoCoberturaHistorialScreen() {
  const { current, reembolsos, autorizaciones } = useApp();
  const { nombre, tipo } = current;
  const esTitular = nombre === TITULAR_NOMBRE;
  const info = AFILIADOS_SALUD_INFO[nombre] || INFO_POR_DEFECTO;
  const todosReembolsos = esTitular ? reembolsos : info.reembolsos;

  if (tipo === "medicamentos") {
    const consumos = todosReembolsos.filter(ES_MEDICAMENTO);
    return (
      <>
        <BackHeader title={`Cobertura de medicamentos · ${nombre}`} />
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>Consumos de medicamentos de la vigencia actual.</div>
        <SectionLabel>Consumos de medicamentos</SectionLabel>
        {consumos.length === 0 && (
          <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>Sin consumos de medicamentos en esta vigencia.</div>
        )}
        {consumos.map((r, i) => (
          <div className="card" style={{ marginBottom: 8 }} key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{r.concepto}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{r.fecha}</div>
              </div>
              <EstadoBadge estado={r.estado} />
            </div>
            <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, marginTop: 6 }}>{r.monto}</div>
          </div>
        ))}
      </>
    );
  }

  const listaAutorizaciones = esTitular ? autorizaciones : info.autorizaciones;
  const listaReembolsos = todosReembolsos.filter((r) => !ES_MEDICAMENTO(r));

  return (
    <>
      <BackHeader title={`Límite por caso · ${nombre}`} />
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>Autorizaciones y reembolsos de la vigencia actual.</div>
      <SectionLabel>Autorizaciones</SectionLabel>
      {listaAutorizaciones.length === 0 && (
        <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 10 }}>Sin autorizaciones en esta vigencia.</div>
      )}
      {listaAutorizaciones.map((a, i) => (
        <div className="card" style={{ marginBottom: 8 }} key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{a.concepto}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{a.fecha}</div>
            </div>
            <EstadoBadge estado={a.estado} />
          </div>
        </div>
      ))}
      <SectionLabel>Reembolsos</SectionLabel>
      {listaReembolsos.length === 0 && (
        <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>Sin reembolsos en esta vigencia.</div>
      )}
      {listaReembolsos.map((r, i) => (
        <div className="card" style={{ marginBottom: 8 }} key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{r.concepto}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{r.fecha}</div>
            </div>
            <EstadoBadge estado={r.estado} />
          </div>
          <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, marginTop: 6 }}>{r.monto}</div>
        </div>
      ))}
    </>
  );
}
