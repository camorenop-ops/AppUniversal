import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icon";
import { BackHeader, SectionLabel, MapPicker } from "../components/UI";

const TITULOS = { vehicular: "Asistencia vehicular", hogar: "Asistencia de hogar" };

export function AsistenciaSolicitudScreen() {
  const {
    asistenciaSolicitudForm: f, usarUbicacionActualAsistencia, marcarUbicacionAsistencia,
    setAsistenciaSolicitudField, enviarAsistenciaSolicitud,
  } = useApp();
  const listo = !!(f.ubicacion && f.telefono);

  return (
    <>
      <BackHeader title={TITULOS[f.tipo]} />
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>
        Indícanos tu ubicación para enviarte ayuda lo antes posible.
      </div>
      <button onClick={usarUbicacionActualAsistencia} style={{ width: "100%", marginBottom: 10 }}>Usar mi ubicación actual</button>
      <MapPicker pin={f.ubicacion} onPick={marcarUbicacionAsistencia} />
      {f.ubicacion && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--success-text)", margin: "10px 0 0" }}>
          <Icon name="circlecheck" size={15} /> {f.ubicacion.label}
        </div>
      )}
      <SectionLabel>Observación (opcional)</SectionLabel>
      <input
        className="u-input"
        placeholder={f.tipo === "vehicular" ? "Ej. vehículo varado en el km 5" : "Ej. fuga de agua en la cocina"}
        value={f.observacion}
        onChange={(e) => setAsistenciaSolicitudField("observacion", e.target.value)}
      />
      <SectionLabel>Teléfono de contacto</SectionLabel>
      <input
        className="u-input"
        placeholder="809-000-0000"
        value={f.telefono}
        onChange={(e) => setAsistenciaSolicitudField("telefono", e.target.value)}
      />
      <button className="solid" onClick={enviarAsistenciaSolicitud} disabled={!listo} style={{ width: "100%", marginTop: 8 }}>Solicitar asistencia</button>
    </>
  );
}

export function AsistenciaSolicitudEnviadaScreen() {
  const { asistenciaSolicitudForm: f, goTab } = useApp();
  return (
    <div style={{ textAlign: "center", padding: "30px 10px" }}>
      <Icon name="circlecheck" size={40} color="var(--success-text)" />
      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 14 }}>Solicitud enviada</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
        Estaremos comunicándonos contigo al {f.telefono} para coordinar tu {TITULOS[f.tipo].toLowerCase()}.
      </div>
      <button className="solid" onClick={() => goTab("home")} style={{ width: "100%", marginTop: 24 }}>Ver en Inicio</button>
    </div>
  );
}
