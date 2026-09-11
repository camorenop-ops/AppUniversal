import { useState } from "react";
import { Icon } from "../components/Icon";
import { SectionLabel, EstadoBadge } from "../components/UI";
import { buscarPrestadoresSalud } from "../data/prestadores";

const TIPOS_AUTORIZACION = ["Consulta médica", "Laboratorio", "Imágenes diagnósticas", "Medicamentos", "Procedimiento/Cirugía", "Hospitalización", "Terapia/Rehabilitación"];
const ORIGENES = ["Enfermedad común", "Accidente de tránsito", "Accidente laboral", "Maternidad", "Enfermedad profesional"];

function money(n) {
  return `RD$ ${n.toLocaleString("es-DO")}`;
}

function FieldLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".03em", margin: "14px 0 8px" }}>{children}</div>;
}

export function IdentificarPrestadorForm({ onIdentificar }) {
  const [query, setQuery] = useState("");
  const [seleccionado, setSeleccionado] = useState(null);
  const [telefono, setTelefono] = useState("");
  const resultados = buscarPrestadoresSalud(query);

  return (
    <div>
      <SectionLabel>Consulta de prestador de salud</SectionLabel>
      <h1 style={{ fontSize: 20, color: "var(--navy)", margin: "2px 0 4px" }}>Identifica al prestador</h1>
      <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 16px" }}>
        Antes de consultar al cliente, busca y selecciona quién está solicitando la validación de cobertura o la autorización.
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--border-strong)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, background: "var(--surface)", maxWidth: 520 }}>
        <Icon name="search" size={16} color="var(--text-muted)" />
        <input
          autoFocus
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSeleccionado(null); }}
          placeholder="Nombre del prestador, ciudad o tipo…"
          style={{ flex: 1, border: "none", outline: "none", fontSize: 14 }}
        />
      </div>

      {!seleccionado && (
        resultados.length === 0 ? (
          <div className="agent-empty">No se encontraron prestadores para "{query}".</div>
        ) : (
          <table className="agent-table" style={{ maxWidth: 720 }}>
            <thead>
              <tr><th>Prestador</th><th>Tipo</th><th>Ciudad</th><th>Código</th></tr>
            </thead>
            <tbody>
              {resultados.map((p) => (
                <tr key={p.id} onClick={() => setSeleccionado(p)}>
                  <td style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon name="buildinghospital" size={15} color="var(--accent)" />{p.nombre}
                  </td>
                  <td>{p.tipo}</td>
                  <td>{p.ciudad}</td>
                  <td>{p.codigo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {seleccionado && (
        <div className="card" style={{ maxWidth: 420 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="buildinghospital" size={18} color="var(--accent)" />
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>{seleccionado.nombre}</div>
            </div>
            <span style={{ color: "var(--accent)", cursor: "pointer", fontSize: 12, fontWeight: 600 }} onClick={() => setSeleccionado(null)}>Cambiar</span>
          </div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>{seleccionado.tipo} · {seleccionado.ciudad} · Cód: {seleccionado.codigo}</div>
          <input
            className="u-input"
            placeholder="Teléfono de contacto de quien llama (opcional)"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            style={{ marginTop: 12, width: "100%" }}
          />
          <button
            className="solid"
            style={{ marginTop: 12, width: "100%" }}
            onClick={() => onIdentificar({ ...seleccionado, telefonoContacto: telefono.trim() })}
          >
            Continuar a la búsqueda del cliente
          </button>
        </div>
      )}
    </div>
  );
}

export function PrestadorConsultaView({ prestador, cliente, onVolver }) {
  const [validacion, setValidacion] = useState(null);
  const [registros, setRegistros] = useState([]);

  const [tipoAutorizacion, setTipoAutorizacion] = useState(TIPOS_AUTORIZACION[0]);
  const [urgencia, setUrgencia] = useState(false);
  const [medicoNombre, setMedicoNombre] = useState("");
  const [medicoCodigo, setMedicoCodigo] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [origen, setOrigen] = useState(ORIGENES[0]);
  const [observacion, setObservacion] = useState("");
  const [prestaciones, setPrestaciones] = useState([]);
  const [nuevaPrestacion, setNuevaPrestacion] = useState({ descripcion: "", codigo: "", cantidad: "1", valorUnitario: "" });

  const salud = cliente.products.find((p) => p.key === "salud" && !p.noContratado);
  const totalPrestaciones = prestaciones.reduce((sum, p) => sum + p.cantidad * p.valorUnitario, 0);

  function validarCobertura() {
    setValidacion({
      ok: !!salud,
      mensaje: salud
        ? `Cobertura vigente — ${salud.plan}. El afiliado está activo y puede recibir el servicio.`
        : "El cliente no cuenta con un plan de Salud activo. No se puede validar cobertura.",
    });
  }

  function agregarPrestacion() {
    if (!nuevaPrestacion.descripcion.trim()) return;
    const cantidad = Number(nuevaPrestacion.cantidad) || 1;
    const valorUnitario = Number(nuevaPrestacion.valorUnitario) || 0;
    setPrestaciones((p) => [
      ...p,
      { id: `${Date.now()}-${p.length}`, descripcion: nuevaPrestacion.descripcion.trim(), codigo: nuevaPrestacion.codigo.trim(), cantidad, valorUnitario },
    ]);
    setNuevaPrestacion({ descripcion: "", codigo: "", cantidad: "1", valorUnitario: "" });
  }

  function quitarPrestacion(id) {
    setPrestaciones((p) => p.filter((x) => x.id !== id));
  }

  function registrarAutorizacion() {
    if (prestaciones.length === 0) return;
    const numero = `AUT-${Date.now().toString().slice(-6)}`;
    setRegistros((r) => [
      {
        numero,
        fecha: new Date().toLocaleDateString("es-DO"),
        estado: "Pendiente",
        tipo: tipoAutorizacion,
        urgencia,
        medicoNombre: medicoNombre.trim(),
        medicoCodigo: medicoCodigo.trim(),
        diagnostico: diagnostico.trim(),
        origen,
        observacion: observacion.trim(),
        prestaciones,
        total: totalPrestaciones,
      },
      ...r,
    ]);
    setTipoAutorizacion(TIPOS_AUTORIZACION[0]);
    setUrgencia(false);
    setMedicoNombre("");
    setMedicoCodigo("");
    setDiagnostico("");
    setOrigen(ORIGENES[0]);
    setObservacion("");
    setPrestaciones([]);
  }

  return (
    <div>
      <div className="agent-clientheader">
        <div>
          <h2>{cliente.nombre}</h2>
          <div className="meta">
            <span>Cédula: <strong>{cliente.cedula}</strong></span>
            <span>Contrato: <strong>{cliente.contrato}</strong></span>
            <span>Cliente desde: <strong>{cliente.afiliadoDesde}</strong></span>
          </div>
        </div>
        <button onClick={onVolver}>Nueva búsqueda</button>
      </div>

      <SectionLabel>Cobertura de Salud</SectionLabel>
      <div className="card" style={{ marginBottom: 16, maxWidth: 420 }}>
        {salud ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>Plan</span>
              <strong>{salud.plan}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>Estado</span>
              <strong style={{ color: "var(--success-text)" }}>Activo</strong>
            </div>
            {salud.renovacion && (
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>Vigente hasta</span>
                <strong>{salud.renovacion}</strong>
              </div>
            )}
          </>
        ) : (
          <div className="agent-empty">Este cliente no tiene un plan de Salud activo.</div>
        )}
      </div>

      <div className="agent-actions">
        <button className="agent-action" onClick={validarCobertura}>
          <Icon name="shieldplus" size={15} /> Validar cobertura
        </button>
      </div>

      {validacion && (
        <div className="card" style={{ marginBottom: 20, maxWidth: 420, borderColor: validacion.ok ? "var(--success-text)" : "var(--danger)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: validacion.ok ? "var(--success-text)" : "var(--danger)" }}>
            {validacion.ok ? "Cobertura validada" : "Cobertura no válida"}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>{validacion.mensaje}</div>
        </div>
      )}

      <SectionLabel>Registrar solicitud de autorización</SectionLabel>
      <div className="card" style={{ marginBottom: 16, maxWidth: 640 }}>
        <FieldLabel>Tipo de solicitud</FieldLabel>
        <div className="agent-chiprow">
          {TIPOS_AUTORIZACION.map((t) => (
            <span key={t} className={"agent-chip" + (tipoAutorizacion === t ? " on" : "")} onClick={() => setTipoAutorizacion(t)}>{t}</span>
          ))}
          <span className={"agent-chip warn" + (urgencia ? " on" : "")} onClick={() => setUrgencia((u) => !u)}>
            <Icon name="alerttriangle" size={12} style={{ marginRight: 4 }} />Urgencia
          </span>
        </div>

        <FieldLabel>Médico tratante (opcional)</FieldLabel>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input className="u-input" placeholder="Nombre del médico" value={medicoNombre} onChange={(e) => setMedicoNombre(e.target.value)} style={{ flex: "2 1 200px" }} />
          <input className="u-input" placeholder="Exequátur / código" value={medicoCodigo} onChange={(e) => setMedicoCodigo(e.target.value)} style={{ flex: "1 1 140px" }} />
        </div>

        <FieldLabel>Diagnóstico y origen</FieldLabel>
        <input className="u-input" placeholder="Diagnóstico (CIE-10 y descripción)" value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} style={{ width: "100%" }} />
        <div className="agent-chiprow">
          {ORIGENES.map((o) => (
            <span key={o} className={"agent-chip" + (origen === o ? " on" : "")} onClick={() => setOrigen(o)}>{o}</span>
          ))}
        </div>

        <FieldLabel>Prestaciones solicitadas</FieldLabel>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-start" }}>
          <input className="u-input" placeholder="Descripción del servicio" value={nuevaPrestacion.descripcion} onChange={(e) => setNuevaPrestacion((p) => ({ ...p, descripcion: e.target.value }))} style={{ flex: "2 1 180px" }} />
          <input className="u-input" placeholder="Código" value={nuevaPrestacion.codigo} onChange={(e) => setNuevaPrestacion((p) => ({ ...p, codigo: e.target.value }))} style={{ flex: "1 1 90px" }} />
          <input className="u-input" type="number" min="1" placeholder="Cant." value={nuevaPrestacion.cantidad} onChange={(e) => setNuevaPrestacion((p) => ({ ...p, cantidad: e.target.value }))} style={{ flex: "1 1 70px" }} />
          <input className="u-input" type="number" min="0" placeholder="Valor unitario" value={nuevaPrestacion.valorUnitario} onChange={(e) => setNuevaPrestacion((p) => ({ ...p, valorUnitario: e.target.value }))} style={{ flex: "1 1 110px" }} />
          <button className="agent-action" disabled={!nuevaPrestacion.descripcion.trim()} onClick={agregarPrestacion}>
            <Icon name="plus" size={14} />Agregar
          </button>
        </div>

        {prestaciones.length > 0 && (
          <>
            <table className="agent-table" style={{ marginTop: 4, marginBottom: 10 }}>
              <thead>
                <tr><th>Descripción</th><th>Código</th><th>Cant.</th><th>Valor unit.</th><th>Total</th><th /></tr>
              </thead>
              <tbody>
                {prestaciones.map((p) => (
                  <tr key={p.id}>
                    <td>{p.descripcion}</td>
                    <td>{p.codigo || "—"}</td>
                    <td>{p.cantidad}</td>
                    <td>{money(p.valorUnitario)}</td>
                    <td>{money(p.cantidad * p.valorUnitario)}</td>
                    <td style={{ cursor: "pointer" }} onClick={() => quitarPrestacion(p.id)}>
                      <Icon name="trash" size={14} color="var(--danger)" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: "flex", justifyContent: "flex-end", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
              Total solicitado:&nbsp;<span style={{ color: "var(--accent)" }}>{money(totalPrestaciones)}</span>
            </div>
          </>
        )}

        <FieldLabel>Observación</FieldLabel>
        <input className="u-input" placeholder="Observación (opcional)" value={observacion} onChange={(e) => setObservacion(e.target.value)} style={{ width: "100%" }} />

        <button
          className="solid"
          style={{ marginTop: 6, width: "100%" }}
          disabled={prestaciones.length === 0}
          onClick={registrarAutorizacion}
        >
          Registrar solicitud de autorización
        </button>
      </div>

      {registros.length > 0 && (
        <>
          <SectionLabel>Autorizaciones registradas en esta consulta</SectionLabel>
          {registros.map((r) => (
            <div className="card" key={r.numero} style={{ marginBottom: 10, maxWidth: 640 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <strong style={{ fontSize: 13.5 }}>{r.numero}</strong>
                  <EstadoBadge estado={r.estado} />
                  {r.urgencia && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10.5, fontWeight: 700, color: "var(--danger)" }}>
                      <Icon name="alerttriangle" size={12} color="var(--danger)" />Urgencia
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{r.fecha}</span>
              </div>

              <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 8 }}>
                {r.tipo} · {prestador.nombre}
                {r.medicoNombre && <> · Dr(a). {r.medicoNombre}{r.medicoCodigo ? ` (${r.medicoCodigo})` : ""}</>}
              </div>
              {(r.diagnostico || r.origen) && (
                <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>
                  {r.diagnostico && <>Diagnóstico: <strong style={{ color: "var(--text)" }}>{r.diagnostico}</strong> · </>}
                  Origen: <strong style={{ color: "var(--text)" }}>{r.origen}</strong>
                </div>
              )}

              <table className="agent-table" style={{ marginTop: 10 }}>
                <thead>
                  <tr><th>Descripción</th><th>Código</th><th>Cant.</th><th>Valor unit.</th><th>Total</th></tr>
                </thead>
                <tbody>
                  {r.prestaciones.map((p) => (
                    <tr key={p.id}>
                      <td>{p.descripcion}</td>
                      <td>{p.codigo || "—"}</td>
                      <td>{p.cantidad}</td>
                      <td>{money(p.valorUnitario)}</td>
                      <td>{money(p.cantidad * p.valorUnitario)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: "flex", justifyContent: "flex-end", fontSize: 12.5, fontWeight: 700, marginTop: 8 }}>
                Total:&nbsp;<span style={{ color: "var(--accent)" }}>{money(r.total)}</span>
              </div>

              {r.observacion && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>{r.observacion}</div>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
