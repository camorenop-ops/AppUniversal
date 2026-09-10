import { useState } from "react";
import { Icon } from "../components/Icon";
import { SectionLabel } from "../components/UI";
import { buscarPrestadoresSalud } from "../data/prestadores";

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
