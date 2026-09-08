import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icon";
import { BackHeader, SectionLabel, Chip, Row } from "../components/UI";
import { RENOVACION_BENEFICIOS, BANCOS_RD } from "../data/data";

function money(n) {
  return `RD$ ${n.toLocaleString("es-DO")}`;
}

export function RenovacionesListScreen() {
  const { products, openRenovacionDetalle } = useApp();
  const activas = products.filter((p) => !p.noContratado && p.renovacion);
  return (
    <>
      <BackHeader title="Renovación de pólizas" />
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
        Consulta la fecha de renovación y la prima estimada para tu próxima vigencia.
      </div>
      {activas.map((p) => (
        <div key={p.key} onClick={() => openRenovacionDetalle(p.key)} className="card" style={{ marginBottom: 10, cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name={p.icon} size={20} color="var(--accent)" />
            <div style={{ fontWeight: 600, fontSize: 14 }}>{p.label}</div>
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>Fecha de renovación</div>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 2 }}>{p.renovacion}</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>Prima estimada próxima vigencia</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--accent)", marginTop: 2 }}>{money(p.primaRenovacion)}</div>
        </div>
      ))}
    </>
  );
}

export function RenovacionDetalleScreen() {
  const { products, current, aceptarRenovacion, openCoberturasDetalle } = useApp();
  const key = current.key;
  const p = products.find((x) => x.key === key);
  const beneficios = RENOVACION_BENEFICIOS[key] || [];
  const diff = p.primaRenovacion - p.primaActual;

  return (
    <>
      <BackHeader title={`Renovación · ${p.label}`} />
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Plan actual</div>
        <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{p.plan}</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>Fecha de renovación</div>
        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{p.renovacion}</div>
      </div>
      <SectionLabel>Nuevos beneficios para la próxima vigencia</SectionLabel>
      {beneficios.map((b, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
          <Icon name="sparkles" size={15} color="var(--accent)" />
          <span style={{ fontSize: 13 }}>{b}</span>
        </div>
      ))}
      <SectionLabel>Comparación de prima</SectionLabel>
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Prima actual</span>
          <span>{money(p.primaActual)}/año</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 6 }}>
          <span style={{ color: "var(--muted)" }}>Prima próxima vigencia</span>
          <span style={{ fontWeight: 600 }}>{money(p.primaRenovacion)}/año</span>
        </div>
        <div style={{ borderTop: "1px dashed var(--border)", margin: "10px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700 }}>
          <span>Diferencia</span>
          <span style={{ color: diff >= 0 ? "var(--danger)" : "var(--success-text)" }}>
            {diff >= 0 ? "+" : "−"}{money(Math.abs(diff))}
          </span>
        </div>
      </div>
      <div
        onClick={() => openCoberturasDetalle(p.plan)}
        style={{ textAlign: "center", padding: "8px 3px", borderRadius: 8, fontSize: 11.5, fontWeight: 600, color: "var(--accent)", border: "1px solid var(--accent)", cursor: "pointer", marginBottom: 14 }}
      >
        Ver detalle de coberturas
      </div>
      <button className="solid" onClick={aceptarRenovacion} style={{ width: "100%" }}>Aceptar renovación</button>
    </>
  );
}

function MetodoPagoRow({ icon, label, on, onClick }) {
  return (
    <div
      onClick={onClick}
      className="row"
      style={{ background: on ? "var(--ice)" : "transparent", borderRadius: 10, border: `1px solid ${on ? "var(--accent)" : "transparent"}`, padding: "9px 8px" }}
    >
      <span style={{ color: on ? "var(--accent)" : "var(--muted)" }}><Icon name={icon} size={17} /></span>
      <span className="label" style={{ color: on ? "var(--accent)" : "#1a1f2b", fontWeight: on ? 600 : 400 }}>{label}</span>
      {on && <Icon name="circlecheck" size={16} color="var(--accent)" />}
    </div>
  );
}

export function RenovacionPagoScreen() {
  const { products, renovacionForm, confirmarPagoRenovacion } = useApp();
  const p = products.find((x) => x.key === renovacionForm.key);
  const [metodo, setMetodo] = useState(null);

  return (
    <>
      <BackHeader title="Pago de renovación" />
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Total a pagar</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: "var(--accent)" }}>{money(p.primaRenovacion)}</div>
      </div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>Selecciona tu método de pago</div>
      <MetodoPagoRow icon="creditcard" label="Tarjeta terminada en 4417" on={metodo === "tarjeta"} onClick={() => setMetodo("tarjeta")} />
      <MetodoPagoRow icon="bank" label="Cuenta bancaria" on={metodo === "banco"} onClick={() => setMetodo("banco")} />
      <button className="solid" onClick={confirmarPagoRenovacion} disabled={!metodo} style={{ width: "100%", marginTop: 14 }}>
        {metodo === "tarjeta" ? "Confirmar tarjeta y pagar" : "Confirmar y pagar"}
      </button>
    </>
  );
}

export function RenovacionConfirmadaScreen() {
  const { products, current, goTab } = useApp();
  const p = products.find((x) => x.key === current.key);
  return (
    <div style={{ textAlign: "center", padding: "30px 10px" }}>
      <Icon name="circlecheck" size={40} color="var(--success-text)" />
      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 14 }}>Renovación confirmada</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
        Tu póliza de {p.label} quedó renovada hasta el {p.renovacion}.
      </div>
      <button className="solid" onClick={() => goTab("home")} style={{ width: "100%", marginTop: 24 }}>Ver en Inicio</button>
    </div>
  );
}

export function EndosoSeleccionarPolizaScreen() {
  const { products, seleccionarPolizaEndoso } = useApp();
  const activas = products.filter((p) => !p.noContratado);
  return (
    <>
      <BackHeader title="Endosar póliza" />
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>Selecciona la póliza que deseas endosar.</div>
      {activas.map((p) => (
        <Row key={p.key} icon={p.icon} label={`${p.label} · ${p.plan}`} onClick={() => seleccionarPolizaEndoso(p.key)} />
      ))}
    </>
  );
}

export function EndosoTipoScreen() {
  const { seleccionarTipoEndoso } = useApp();
  return (
    <>
      <BackHeader title="Endosar póliza" />
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>¿A quién se endosa la póliza?</div>
      <div onClick={() => seleccionarTipoEndoso("banco")} className="card" style={{ marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
        <Icon name="bank" size={20} color="var(--accent)" />
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Entidad bancaria</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Para trámites de financiamiento o garantía</div>
        </div>
      </div>
      <div onClick={() => seleccionarTipoEndoso("otro")} className="card" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
        <Icon name="user" size={20} color="var(--accent)" />
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Otra persona o entidad</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Beneficiario distinto a un banco</div>
        </div>
      </div>
    </>
  );
}

export function EndosoBancoScreen() {
  const { endosoForm, setEndosoField, continuarEndosoDatos } = useApp();
  const listo = !!(endosoForm.banco && endosoForm.sucursal && endosoForm.ejecutivo);
  return (
    <>
      <BackHeader title="Endosar a entidad bancaria" />
      <SectionLabel>Entidad bancaria</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
        {BANCOS_RD.map((b) => (
          <Chip key={b} label={b} on={endosoForm.banco === b} onClick={() => setEndosoField("banco", b)} />
        ))}
      </div>
      <SectionLabel>Sucursal</SectionLabel>
      <input
        className="u-input"
        placeholder="Ej. Sucursal Piantini"
        value={endosoForm.sucursal}
        onChange={(e) => setEndosoField("sucursal", e.target.value)}
      />
      <SectionLabel>Ejecutivo del banco</SectionLabel>
      <input
        className="u-input"
        placeholder="Nombre del ejecutivo"
        value={endosoForm.ejecutivo}
        onChange={(e) => setEndosoField("ejecutivo", e.target.value)}
      />
      <button className="solid" onClick={continuarEndosoDatos} disabled={!listo} style={{ width: "100%", marginTop: 8 }}>Continuar</button>
    </>
  );
}

export function EndosoOtroScreen() {
  const { endosoForm, setEndosoField, continuarEndosoDatos } = useApp();
  const listo = !!endosoForm.beneficiario;
  return (
    <>
      <BackHeader title="Endosar a otra persona o entidad" />
      <SectionLabel>Nombre del beneficiario del endoso</SectionLabel>
      <input
        className="u-input"
        placeholder="Nombre completo o razón social"
        value={endosoForm.beneficiario}
        onChange={(e) => setEndosoField("beneficiario", e.target.value)}
      />
      <button className="solid" onClick={continuarEndosoDatos} disabled={!listo} style={{ width: "100%", marginTop: 8 }}>Continuar</button>
    </>
  );
}

export function EndosoCondicionesScreen() {
  const { endosoForm, aceptarCondicionesEndoso } = useApp();
  const [aceptado, setAceptado] = useState(false);
  return (
    <>
      <BackHeader title="Condiciones del endoso" />
      <div className="card" style={{ marginBottom: 14, fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6 }}>
        Al endosar esta póliza, {endosoForm.tipo === "banco" ? "la entidad bancaria seleccionada" : "el beneficiario indicado"} pasa
        a tener derecho preferente sobre la indemnización en caso de siniestro, hasta el monto de su interés asegurable. El endoso
        se mantiene vigente hasta que sea revocado por escrito por el asegurado o hasta el vencimiento de la póliza. Esta gestión
        no modifica las coberturas ni el valor de la prima de tu póliza.
      </div>
      <div
        onClick={() => setAceptado(!aceptado)}
        style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 14, cursor: "pointer" }}
      >
        <Icon name={aceptado ? "circlecheck" : "circle"} size={18} color={aceptado ? "var(--success-text)" : "var(--text-muted)"} />
        <span style={{ fontSize: 12.5 }}>Acepto las condiciones del endoso.</span>
      </div>
      <button className="solid" onClick={aceptarCondicionesEndoso} disabled={!aceptado} style={{ width: "100%" }}>Generar endoso</button>
    </>
  );
}

export function EndosoGeneradoScreen() {
  const { products, endosoForm, enviarEndoso, goTab } = useApp();
  const p = products.find((x) => x.key === endosoForm.productKey);
  return (
    <>
      <BackHeader title="Endoso generado" />
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <Icon name="circlecheck" size={34} color="var(--success-text)" />
        <div style={{ fontSize: 15, fontWeight: 600, marginTop: 8 }}>Documento de endoso listo</div>
      </div>
      <div className="cert" style={{ border: "1px solid var(--border-strong)", borderRadius: 12, padding: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Póliza</div>
        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{p.label} · {p.plan}</div>
        <div style={{ borderTop: "1px dashed var(--border-strong)", margin: "10px 0" }} />
        {endosoForm.tipo === "banco" ? (
          <>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Endosado a</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{endosoForm.banco}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>Sucursal: {endosoForm.sucursal}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Ejecutivo: {endosoForm.ejecutivo}</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Endosado a</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{endosoForm.beneficiario}</div>
          </>
        )}
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 10 }}>Fecha: Hoy</div>
      </div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>Enviar documento de endoso</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button onClick={() => enviarEndoso("correo")} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Icon name="mail" size={15} /> Correo
        </button>
        <button onClick={() => enviarEndoso("whatsapp")} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Icon name="messagecircle" size={15} /> WhatsApp
        </button>
      </div>
      {endosoForm.enviadoPor && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--success-text)", marginBottom: 14 }}>
          <Icon name="circlecheck" size={15} /> Endoso enviado por {endosoForm.enviadoPor === "correo" ? "correo electrónico" : "WhatsApp"}
        </div>
      )}
      <button className="solid" onClick={() => goTab("home")} style={{ width: "100%", marginTop: 6 }}>Ver en Inicio</button>
    </>
  );
}
