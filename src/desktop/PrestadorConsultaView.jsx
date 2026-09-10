import { useState } from "react";
import { Icon } from "../components/Icon";
import { SectionLabel } from "../components/UI";

export function PrestadorConsultaView({ cliente, onVolver }) {
  const [prestadorNombre, setPrestadorNombre] = useState("");
  const [servicio, setServicio] = useState("");
  const [observacion, setObservacion] = useState("");
  const [validacion, setValidacion] = useState(null);
  const [registros, setRegistros] = useState([]);

  const salud = cliente.products.find((p) => p.key === "salud" && !p.noContratado);

  function validarCobertura() {
    setValidacion({
      ok: !!salud,
      mensaje: salud
        ? `Cobertura vigente — ${salud.plan}. El afiliado está activo y puede recibir el servicio.`
        : "El cliente no cuenta con un plan de Salud activo. No se puede validar cobertura.",
    });
  }

  function registrarAutorizacion() {
    if (!prestadorNombre.trim() || !servicio.trim()) return;
    const numero = `AUT-${Date.now().toString().slice(-6)}`;
    setRegistros((r) => [
      { numero, prestador: prestadorNombre.trim(), servicio: servicio.trim(), observacion: observacion.trim(), fecha: new Date().toLocaleDateString("es-DO") },
      ...r,
    ]);
    setPrestadorNombre("");
    setServicio("");
    setObservacion("");
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
      <div className="card" style={{ marginBottom: 16, maxWidth: 420 }}>
        <input
          className="u-input"
          placeholder="Nombre del prestador"
          value={prestadorNombre}
          onChange={(e) => setPrestadorNombre(e.target.value)}
          style={{ marginBottom: 8, width: "100%" }}
        />
        <input
          className="u-input"
          placeholder="Servicio solicitado"
          value={servicio}
          onChange={(e) => setServicio(e.target.value)}
          style={{ marginBottom: 8, width: "100%" }}
        />
        <input
          className="u-input"
          placeholder="Observación (opcional)"
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
          style={{ width: "100%" }}
        />
        <button
          className="solid"
          style={{ marginTop: 10, width: "100%" }}
          disabled={!prestadorNombre.trim() || !servicio.trim()}
          onClick={registrarAutorizacion}
        >
          Registrar autorización
        </button>
      </div>

      {registros.length > 0 && (
        <>
          <SectionLabel>Autorizaciones registradas en esta consulta</SectionLabel>
          {registros.map((r) => (
            <div className="card" key={r.numero} style={{ marginBottom: 8, maxWidth: 420 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: 13.5 }}>{r.numero}</strong>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{r.fecha}</span>
              </div>
              <div style={{ fontSize: 12.5, marginTop: 4 }}>{r.servicio} — {r.prestador}</div>
              {r.observacion && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{r.observacion}</div>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
