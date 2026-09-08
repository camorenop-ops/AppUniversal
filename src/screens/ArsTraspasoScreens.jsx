import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icon";
import { BackHeader, SectionLabel } from "../components/UI";
import { TRASPASO_ARS_PENDIENTE } from "../data/data";

export function ArsTraspasoMenuScreen() {
  const { abrirArsTraspasoSolicitar, abrirArsTraspasoEstado } = useApp();
  return (
    <>
      <BackHeader title="Traspaso de ARS" />
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>
        Solicita el traspaso de tu afiliación a otra ARS o consulta el estado de una solicitud en curso.
      </div>
      <div onClick={abrirArsTraspasoSolicitar} className="card" style={{ marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
        <Icon name="network" size={20} color="var(--accent)" />
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Solicitar traspaso</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Déjanos tus datos y un asesor te contactará</div>
        </div>
      </div>
      <div onClick={abrirArsTraspasoEstado} className="card" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
        <Icon name="clock" size={20} color="var(--accent)" />
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Consultar estado de mi solicitud</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Revisa el avance de una solicitud de traspaso pendiente</div>
        </div>
      </div>
    </>
  );
}

export function ArsTraspasoSolicitarScreen() {
  const { traspasoForm, setTraspasoField, enviarArsTraspaso } = useApp();
  const listo = !!(traspasoForm.nombre && traspasoForm.telefono);
  return (
    <>
      <BackHeader title="Solicitar traspaso" />
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>
        Completa tus datos de contacto y un asesor te contactará para gestionar el traspaso de tu ARS.
      </div>
      <SectionLabel>Nombre completo</SectionLabel>
      <input
        className="u-input"
        placeholder="Nombre completo"
        value={traspasoForm.nombre}
        onChange={(e) => setTraspasoField("nombre", e.target.value)}
      />
      <SectionLabel>Teléfono de contacto</SectionLabel>
      <input
        className="u-input"
        placeholder="809-000-0000"
        value={traspasoForm.telefono}
        onChange={(e) => setTraspasoField("telefono", e.target.value)}
      />
      <SectionLabel>Correo electrónico (opcional)</SectionLabel>
      <input
        className="u-input"
        placeholder="correo@ejemplo.com"
        value={traspasoForm.correo}
        onChange={(e) => setTraspasoField("correo", e.target.value)}
      />
      <button className="solid" onClick={enviarArsTraspaso} disabled={!listo} style={{ width: "100%", marginTop: 8 }}>Solicitar traspaso</button>
    </>
  );
}

export function ArsTraspasoEnviadoScreen() {
  const { traspasoForm, goTab } = useApp();
  return (
    <div style={{ textAlign: "center", padding: "30px 10px" }}>
      <Icon name="circlecheck" size={40} color="var(--success-text)" />
      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 14 }}>Solicitud recibida</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
        Un asesor se comunicará contigo al {traspasoForm.telefono} para continuar con el traspaso de tu ARS.
      </div>
      <button className="solid" onClick={() => goTab("home")} style={{ width: "100%", marginTop: 24 }}>Ver en Inicio</button>
    </div>
  );
}

export function ArsTraspasoEstadoScreen() {
  const t = TRASPASO_ARS_PENDIENTE;
  return (
    <>
      <BackHeader title="Estado de mi traspaso" />
      <div className="card">
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Número de solicitud</div>
        <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{t.numeroSolicitud}</div>
        <div style={{ borderTop: "1px dashed var(--border)", margin: "10px 0" }} />
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Estado</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)", marginTop: 2 }}>{t.estado}</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>Fecha de solicitud</div>
        <div style={{ fontSize: 13, marginTop: 2 }}>{t.fechaSolicitud}</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>Última actualización</div>
        <div style={{ fontSize: 13, marginTop: 2 }}>{t.ultimaActualizacion}</div>
      </div>
      <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 14 }}>{t.siguientePaso}</div>
    </>
  );
}
