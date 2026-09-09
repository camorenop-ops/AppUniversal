import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icon";
import { BackHeader, SectionLabel, EstadoBadge, CoverageLine } from "../components/UI";
import {
  LIMITE_POR_CASO_PLAN, COBERTURA_MEDICAMENTOS_PLAN, PLAN_BASICO_SALUD,
  PROGRAMAS_SALUD, elegiblePrograma,
} from "../data/data";

const INFO_POR_DEFECTO = { parentesco: "Dependiente", edad: null, limiteUsado: 0, medicamentosUsado: 0, autorizaciones: [], reembolsos: [] };
const USO_ARS_POR_DEFECTO = { limiteUsado: 0, medicamentosUsado: 0 };
const ES_MEDICAMENTO = (item) => item.concepto.toLowerCase().includes("medicamento");

export function AfiliadoDetalleScreen() {
  const { current, products, titular, afiliadosSalud, afiliadosArsUsado, openAfiliadoCobertura, openProgramaSalud } = useApp();
  const { nombre, origen } = current;
  const info = afiliadosSalud[nombre] || { ...INFO_POR_DEFECTO, parentesco: nombre === titular ? "Titular" : "Dependiente" };
  const esArs = origen === "ars";
  const saludProduct = products.find((p) => p.key === "salud" && !p.noContratado);
  const plan = saludProduct ? saludProduct.plan : null;
  const nombrePlan = esArs ? PLAN_BASICO_SALUD.nombre : plan;
  const medicamentosTotal = esArs ? PLAN_BASICO_SALUD.coberturaMedicamentos : COBERTURA_MEDICAMENTOS_PLAN[plan];

  if (esArs) {
    const uso = afiliadosArsUsado[nombre] || USO_ARS_POR_DEFECTO;
    const medicamentosDisponible = medicamentosTotal - uso.medicamentosUsado;
    return (
      <>
        <BackHeader title={nombre} />
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>{info.parentesco} · {nombrePlan}</div>
        <SectionLabel>Cobertura disponible</SectionLabel>
        <div onClick={() => openAfiliadoCobertura(nombre, "medicamentos", origen)} className="card" style={{ cursor: "pointer" }}>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Cobertura de medicamentos</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)", marginTop: 4 }}>RD$ {medicamentosDisponible.toLocaleString("es-DO")} disponible</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>de RD$ {medicamentosTotal.toLocaleString("es-DO")} anual</div>
        </div>
      </>
    );
  }

  const limiteTotal = LIMITE_POR_CASO_PLAN[plan];
  const limiteDisponible = limiteTotal - info.limiteUsado;
  const medicamentosDisponible = medicamentosTotal - info.medicamentosUsado;

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

      <SectionLabel>Programas de cobertura</SectionLabel>
      {Object.entries(PROGRAMAS_SALUD).map(([key, prog]) => {
        const elegible = elegiblePrograma(prog, info.edad);
        return (
          <div
            key={key}
            onClick={() => openProgramaSalud(nombre, key)}
            className="card"
            style={{ marginBottom: 8, cursor: "pointer", opacity: elegible ? 1 : 0.55 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name={prog.icon} size={18} color={elegible ? "var(--accent)" : "var(--text-muted)"} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{prog.nombre}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2, fontStyle: elegible ? "normal" : "italic" }}>
                  {elegible ? prog.resumen : "No aplica para tu edad actual"}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export function ProgramaSaludDetalleScreen() {
  const { current, afiliadosSalud, openSolicitarEvaluacion } = useApp();
  const { nombre, key } = current;
  const prog = PROGRAMAS_SALUD[key];
  const info = afiliadosSalud[nombre] || INFO_POR_DEFECTO;
  const elegible = elegiblePrograma(prog, info.edad);

  return (
    <>
      <BackHeader title={prog.nombre} />
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>{prog.resumen}</div>
      {!elegible && (
        <div className="card" style={{ marginBottom: 14, background: "#EEF1F6" }}>
          <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
            {prog.elegibilidad.edadMinima != null && `Este programa aplica a partir de los ${prog.elegibilidad.edadMinima} años. `}
            {prog.elegibilidad.edadMaxima != null && `Este programa aplica hasta los ${prog.elegibilidad.edadMaxima} años.`}
          </div>
        </div>
      )}
      <SectionLabel>Detalle del programa</SectionLabel>
      {prog.detalle.map((r, i) => <CoverageLine key={i} item={r} />)}
      {prog.vacunas && (
        <>
          <SectionLabel>Esquema de vacunación</SectionLabel>
          {prog.vacunas.map((r, i) => <CoverageLine key={i} item={r} />)}
        </>
      )}
      {elegible && (
        <button className="solid" onClick={() => openSolicitarEvaluacion(nombre, key)} style={{ width: "100%", marginTop: 16 }}>
          Solicitar evaluación
        </button>
      )}
    </>
  );
}

export function AfiliadoCoberturaHistorialScreen() {
  const { current, reembolsos, autorizaciones, titular, afiliadosSalud } = useApp();
  const { nombre, tipo } = current;
  const esTitular = nombre === titular;
  const info = afiliadosSalud[nombre] || INFO_POR_DEFECTO;
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
          {a.prestador && (
            <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 6 }}>Prestador: {a.prestador}</div>
          )}
          {a.valorAutorizado && (
            <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, marginTop: 6 }}>{a.valorAutorizado}</div>
          )}
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
