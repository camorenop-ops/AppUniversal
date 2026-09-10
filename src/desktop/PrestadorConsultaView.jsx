import { useState } from "react";
import { Icon } from "../components/Icon";
import { SectionLabel } from "../components/UI";

const TIPOS_PRESTADOR = ["Centro médico", "Laboratorio clínico", "Farmacia", "Médico independiente", "Centro de rehabilitación"];

export function IdentificarPrestadorForm({ onIdentificar }) {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState(null);
  const [codigo, setCodigo] = useState("");
  const [telefono, setTelefono] = useState("");

  return (
    <div>
      <SectionLabel>Consulta de prestador de salud</SectionLabel>
      <h1 style={{ fontSize: 20, color: "var(--navy)", margin: "2px 0 4px" }}>Identifica al prestador</h1>
      <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 16px" }}>
        Antes de consultar al cliente, registra quién está solicitando la validación de cobertura o la autorización.
      </p>

      <div className="card" style={{ maxWidth: 420 }}>
        <input
          className="u-input"
          placeholder="Nombre del prestador o centro médico"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ marginBottom: 10, width: "100%" }}
        />
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Tipo de prestador</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
          {TIPOS_PRESTADOR.map((t) => (
            <div
              key={t}
              onClick={() => setTipo(t)}
              className={"agent-tab" + (tipo === t ? " on" : "")}
            >
              {t}
            </div>
          ))}
        </div>
        <input
          className="u-input"
          placeholder="RNC o código del prestador (opcional)"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          style={{ marginBottom: 10, width: "100%" }}
        />
        <input
          className="u-input"
          placeholder="Teléfono de contacto"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          style={{ width: "100%" }}
        />
        <button
          className="solid"
          style={{ marginTop: 12, width: "100%" }}
          disabled={!nombre.trim() || !tipo}
          onClick={() => onIdentificar({ nombre: nombre.trim(), tipo, codigo: codigo.trim(), telefono: telefono.trim() })}
        >
          Continuar a la búsqueda del cliente
        </button>
      </div>
    </div>
  );
}

export function PrestadorConsultaView({ prestador, cliente, onVolver, onCambiarPrestador }) {
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
    if (!servicio.trim()) return;
    const numero = `AUT-${Date.now().toString().slice(-6)}`;
    setRegistros((r) => [
      { numero, servicio: servicio.trim(), observacion: observacion.trim(), fecha: new Date().toLocaleDateString("es-DO") },
      ...r,
    ]);
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

      <div className="agent-empty" style={{ marginBottom: 16 }}>
        Atendiendo solicitud de <strong style={{ color: "var(--text)" }}>{prestador.nombre}</strong> ({prestador.tipo}).{" "}
        <span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }} onClick={onCambiarPrestador}>Cambiar prestador</span>
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
          disabled={!servicio.trim()}
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
              <div style={{ fontSize: 12.5, marginTop: 4 }}>{r.servicio} — {prestador.nombre}</div>
              {r.observacion && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{r.observacion}</div>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
