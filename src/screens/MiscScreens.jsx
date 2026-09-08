import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Icon, LogoLockup } from "../components/Icon";
import { BackHeader, SectionLabel, Row, Chip, MapMock, InfoCard, CaptureCard } from "../components/UI";
import {
  PRESTADORES, ESPECIALIDADES, SINTOMAS, CENTROS, FONDOS, PROYECTOS, ESTADO_CUENTA,
  MEMBERS, PRODUCT_TITLES, CARNET_BIEN,
} from "../data/data";

export function ChatScreen() {
  return (
    <>
      <BackHeader title="Asistente Universal" />
      <div style={{ background: "#EEF1F6", borderRadius: 12, borderTopLeftRadius: 2, padding: "10px 12px", maxWidth: "85%", fontSize: 13, marginBottom: 10 }}>
        Hola Carlos, ¿en qué puedo ayudarte hoy?
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
        {["Ver mis pólizas", "Reportar un accidente", "Hablar con un asesor"].map((s) => (
          <div key={s} style={{ border: "1px solid var(--accent)", color: "var(--accent)", borderRadius: 999, padding: "7px 12px", fontSize: 12.5, display: "inline-block", width: "fit-content", cursor: "pointer" }}>{s}</div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", border: "1px solid var(--border)", borderRadius: 999, padding: "8px 12px" }}>
        <span style={{ fontSize: 12.5, color: "var(--text-muted)", flex: 1 }}>Escribe tu mensaje…</span>
        <Icon name="send" size={16} color="var(--accent)" />
      </div>
    </>
  );
}

export function EmergenciaScreen() {
  const { openStub, openMapaCentros, openRedMedica } = useApp();
  return (
    <>
      <BackHeader title="Guía médica" />
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>Elige cómo quieres recibir ayuda ahora mismo.</div>
      <Row icon="video" label="Telemedicina" onClick={() => openStub("Telemedicina")} />
      <Row icon="mappin" label="Centros médicos cercanos" onClick={openMapaCentros} />
      <Row icon="network" label="Red Médica" onClick={openRedMedica} />
    </>
  );
}

export function MapaCentrosScreen() {
  const { openStub } = useApp();
  return (
    <>
      <BackHeader title="Centros médicos cercanos" />
      <MapMock pins={CENTROS} />
      {CENTROS.filter((c) => !c.primary).map((c, i) => (
        <Row key={c.label} icon="building" label={`${c.label} · ${(1.2 + i * 1.1).toFixed(1)} km`} onClick={() => openStub(c.label)} />
      ))}
    </>
  );
}

export function RedMedicaScreen() {
  const { especialidadFiltro, setEspecialidadFiltro } = useApp();
  const lista = PRESTADORES.filter((p) => especialidadFiltro === "Todas" || p.especialidad === especialidadFiltro);
  return (
    <>
      <BackHeader title="Red Médica" />
      <div className="search-bar"><Icon name="search" size={15} /><span>Buscar por especialidad</span></div>
      <SectionLabel>Especialidades</SectionLabel>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
        {["Todas", ...ESPECIALIDADES].map((e) => (
          <Chip key={e} label={e} on={e === especialidadFiltro} onClick={() => setEspecialidadFiltro(e)} />
        ))}
      </div>
      <SectionLabel>Sugerencias por síntomas</SectionLabel>
      {SINTOMAS.map((s) => (
        <Row key={s[0]} icon="stethoscope" label={`${s[0]} → ${s[1]}`} onClick={() => setEspecialidadFiltro(s[1])} />
      ))}
      <SectionLabel>Prestadores{especialidadFiltro !== "Todas" ? ` · ${especialidadFiltro}` : ""}</SectionLabel>
      {lista.length === 0 && <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>No hay prestadores para este filtro.</div>}
      {lista.map((p) => (
        <div className="card" style={{ marginBottom: 8 }} key={p.nombre}>
          <div style={{ fontWeight: 600, fontSize: 13.5 }}>{p.nombre}</div>
          <div style={{ fontSize: 11.5, color: "var(--accent)", marginTop: 2 }}>{p.especialidad}</div>
          <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 6 }}><Icon name="phone" size={12} /> {p.telefono}</div>
          <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}><Icon name="mappin" size={12} /> {p.direccion}</div>
        </div>
      ))}
    </>
  );
}

export function AsistenciaAutoScreen() {
  const { openStub } = useApp();
  return (
    <>
      <BackHeader title="Solicitar asistencia" />
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>Confirma tu ubicación para enviar ayuda.</div>
      <MapMock pins={[{ x: 50, y: 55, label: "Tu ubicación", primary: true }]} />
      <SectionLabel>Tipo de servicio</SectionLabel>
      <Row icon="tool" label="Asistencia mecánica" onClick={() => openStub("Asistencia mecánica")} />
      <Row icon="alerttriangle" label="Asistencia por accidente" onClick={() => openStub("Asistencia por accidente")} />
    </>
  );
}

export function FondoScreen({ kind }) {
  const { goBack } = useApp();
  const [comprobante, setComprobante] = useState(false);
  const title = kind === "rescate" ? "Solicitar rescate" : "Notificar aporte al fondo";
  const actionLabel = kind === "rescate" ? "Confirmar rescate" : "Confirmar aporte";
  const f = FONDOS[0];

  if (kind === "aporte" && !comprobante) {
    return (
      <>
        <BackHeader title={title} />
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>
          Primero sube una foto del comprobante de tu pago o transferencia.
        </div>
        <CaptureCard label="Foto del comprobante de pago" captured={false} onClick={() => setComprobante(true)} />
      </>
    );
  }

  return (
    <>
      <BackHeader title={title} />
      {kind === "aporte" && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--success-text)", marginBottom: 12 }}>
          <Icon name="circlecheck" size={15} /> Comprobante cargado
        </div>
      )}
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>{f.name}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>Saldo disponible</div>
        <div style={{ fontSize: 20, fontWeight: 600, color: "var(--accent)" }}>{f.rows[0][1]}</div>
      </div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>Monto a {kind === "rescate" ? "rescatar" : "aportar"}</div>
      <div style={{ border: "1px solid var(--border-strong)", borderRadius: 10, padding: 12, fontSize: 18, color: "var(--text-muted)", marginBottom: 6 }}>RD$ 0.00</div>
      {kind === "rescate"
        ? <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, marginBottom: 14, cursor: "pointer" }}>Usar monto máximo disponible</div>
        : <div style={{ marginBottom: 14 }} />}
      <button className="solid" onClick={goBack} style={{ width: "100%" }}>{actionLabel}</button>
    </>
  );
}

export function EstadoCuentaScreen() {
  return (
    <>
      <BackHeader title="Estado de cuenta" />
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>{ESTADO_CUENTA.proyecto}</div>
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Saldo pendiente</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: "var(--accent)" }}>{ESTADO_CUENTA.saldoPendiente}</div>
      </div>
      <SectionLabel>Pagos realizados</SectionLabel>
      {ESTADO_CUENTA.pagos.map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
          <div>
            <div style={{ fontSize: 13 }}>{p[1]}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p[0]}</div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>{p[2]}</span>
        </div>
      ))}
    </>
  );
}

export function CarnetScreen() {
  const { memberIdx, setMember } = useApp();
  return (
    <>
      <BackHeader title="Mis carnets" />
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 14 }}>
        {MEMBERS.map((m, i) => (
          <Chip key={m} label={m} on={i === memberIdx} onClick={() => setMember(i)} />
        ))}
      </div>
      <div className="cert" style={{ border: "1px solid var(--border-strong)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: 14 }}>
          <LogoLockup size={16} />
          <div style={{ fontWeight: 600, fontSize: 15, marginTop: 10 }}>{MEMBERS[memberIdx]}</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Plan Alpha, salud local</div>
        </div>
        <div style={{ borderTop: "1px dashed var(--border-strong)" }} />
        <div style={{ padding: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6 }}>No. afiliado: 1639169<br />Contrato: 03003780-28817</div>
          <Icon name="qrcode" size={28} color="var(--accent)" />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button style={{ flex: 1 }}>Compartir</button>
        <button className="solid" style={{ flex: 1 }}>Guardar</button>
      </div>
    </>
  );
}

export function CarnetBienScreen({ productKey }) {
  const { products } = useApp();
  const title = PRODUCT_TITLES[productKey];

  if (productKey === "auto") {
    const ap = products.find((p) => p.key === "auto");
    return (
      <>
        <BackHeader title={`Carnet · ${title}`} />
        <div className="cert" style={{ border: "1px solid var(--border-strong)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: 14 }}>
            <LogoLockup size={16} />
            <div style={{ fontWeight: 600, fontSize: 15, marginTop: 10 }}>{ap.plan}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{title}</div>
          </div>
          <div style={{ borderTop: "1px dashed var(--border-strong)" }} />
          <div style={{ padding: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600, marginBottom: 4 }}>Bienes asegurados</div>
              {ap.vehiculos.map((v, i) => (
                <div key={i} style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6, marginTop: i > 0 ? 6 : 0 }}>
                  {i + 1}. {v.marca} {v.modelo} {v.anio} — placa {v.placa}
                </div>
              ))}
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>Contrato: 03003780-28817</div>
            </div>
            <Icon name="qrcode" size={28} color="var(--accent)" />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button style={{ flex: 1 }}>Compartir</button>
          <button className="solid" style={{ flex: 1 }}>Guardar</button>
        </div>
      </>
    );
  }

  const c = CARNET_BIEN[productKey];
  return (
    <>
      <BackHeader title={`Carnet · ${title}`} />
      <div className="cert" style={{ border: "1px solid var(--border-strong)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: 14 }}>
          <LogoLockup size={16} />
          <div style={{ fontWeight: 600, fontSize: 15, marginTop: 10 }}>{c.plan}</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{title}</div>
        </div>
        <div style={{ borderTop: "1px dashed var(--border-strong)" }} />
        <div style={{ padding: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6 }}>
            {c.label}:<br />{c.bien}<br />Contrato: 03003780-28817
          </div>
          <Icon name="qrcode" size={28} color="var(--accent)" />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button style={{ flex: 1 }}>Compartir</button>
        <button className="solid" style={{ flex: 1 }}>Guardar</button>
      </div>
    </>
  );
}

export function PagoScreen() {
  const { goBack } = useApp();
  return (
    <>
      <BackHeader title="Pago" />
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Monto a pagar</div>
        <div style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>3,450.00 pesos</div>
      </div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>Método de pago</div>
      <Row icon="creditcard" label="Tarjeta terminada en 4417" onClick={() => {}} />
      <Row icon="bank" label="Cuenta bancaria" onClick={() => {}} />
      <button className="solid" onClick={goBack} style={{ width: "100%", marginTop: 14 }}>Confirmar pago</button>
    </>
  );
}

export function StubScreen({ title }) {
  return (
    <>
      <BackHeader title={title} />
      <div style={{ padding: "16px 0", textAlign: "center" }}>
        <Icon name="filedesc" size={28} color="var(--text-muted)" />
        <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 10 }}>Aquí vive el formulario o detalle de {title.toLowerCase()}.</div>
      </div>
    </>
  );
}

export function InfoScreen({ title, icon, name, rows, sectionKind }) {
  let finalRows = rows;
  if (!finalRows) {
    if (sectionKind === "AFI") finalRows = FONDOS.find((f) => f.name === name)?.rows || [];
    else if (sectionKind === "Fiduciaria") finalRows = PROYECTOS.find((p) => p.name === name)?.rows || [];
  }
  return (
    <>
      <BackHeader title={title} />
      <InfoCard icon={icon} name={name} rows={finalRows} />
    </>
  );
}
