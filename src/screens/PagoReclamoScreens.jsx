import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icon";
import { BackHeader, SectionLabel, Row, CaptureCard, MetodoPagoRow } from "../components/UI";
import { TIPOS_RECLAMO_AUTO, REQUISITOS_RECLAMO_HOGAR } from "../data/data";

const TIPO_RECLAMO_LABEL = Object.fromEntries(TIPOS_RECLAMO_AUTO.map(([, tipo, label]) => [tipo, label]));

export function PagoSeleccionScreen() {
  const { products, pagoPolizasForm, toggleSeleccionPago, continuarPagoPolizas } = useApp();
  const activas = products.filter((p) => !p.noContratado && p.montoPendiente);
  const total = activas
    .filter((p) => pagoPolizasForm.seleccion.includes(p.key))
    .reduce((sum, p) => sum + p.montoPendiente, 0);

  return (
    <>
      <BackHeader title="Pagar pólizas" />
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>Selecciona una o varias pólizas para pagar.</div>
      {activas.map((p) => {
        const on = pagoPolizasForm.seleccion.includes(p.key);
        return (
          <div
            key={p.key}
            onClick={() => toggleSeleccionPago(p.key)}
            className="card"
            style={{ marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, background: on ? "var(--ice)" : "#fff", borderColor: on ? "var(--accent)" : "var(--border)" }}
          >
            <Icon name={on ? "circlecheck" : "circle"} size={20} color={on ? "var(--accent)" : "var(--text-muted)"} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{p.label}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{p.plan}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>RD$ {p.montoPendiente.toLocaleString("es-DO")}</div>
          </div>
        );
      })}
      <div className="card" style={{ marginTop: 14, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700 }}>
          <span>Total a pagar</span>
          <span style={{ color: "var(--accent)" }}>RD$ {total.toLocaleString("es-DO")}</span>
        </div>
      </div>
      <button className="solid" onClick={continuarPagoPolizas} disabled={pagoPolizasForm.seleccion.length === 0} style={{ width: "100%" }}>Continuar</button>
    </>
  );
}

export function PagoMetodoScreen() {
  const { products, pagoPolizasForm, setMetodoPagoPolizas, confirmarPagoPolizas } = useApp();
  const seleccionadas = products.filter((p) => pagoPolizasForm.seleccion.includes(p.key));
  const total = seleccionadas.reduce((sum, p) => sum + p.montoPendiente, 0);
  const metodo = pagoPolizasForm.metodo;

  return (
    <>
      <BackHeader title="Método de pago" />
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Total a pagar ({seleccionadas.length} póliza{seleccionadas.length > 1 ? "s" : ""})</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: "var(--accent)" }}>RD$ {total.toLocaleString("es-DO")}</div>
      </div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>Selecciona tu método de pago</div>
      <MetodoPagoRow icon="creditcard" label="Tarjeta terminada en 4417" on={metodo === "tarjeta"} onClick={() => setMetodoPagoPolizas("tarjeta")} />
      <MetodoPagoRow icon="bank" label="Transferencia bancaria" on={metodo === "transferencia"} onClick={() => setMetodoPagoPolizas("transferencia")} />
      {metodo === "transferencia" && (
        <div className="card" style={{ marginTop: 8, fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
          Realiza la transferencia a la cuenta 100-2345678-9 de Seguros Universal (Banreservas) y confirma aquí para registrar tu pago.
        </div>
      )}
      <button className="solid" onClick={confirmarPagoPolizas} disabled={!metodo} style={{ width: "100%", marginTop: 14 }}>
        {metodo === "tarjeta" ? "Confirmar tarjeta y pagar" : metodo === "transferencia" ? "Confirmar transferencia" : "Confirmar y pagar"}
      </button>
    </>
  );
}

export function PagoConfirmadoScreen() {
  const { products, pagoPolizasForm, goTab } = useApp();
  const seleccionadas = products.filter((p) => pagoPolizasForm.seleccion.includes(p.key));
  const total = seleccionadas.reduce((sum, p) => sum + p.montoPendiente, 0);
  return (
    <div style={{ textAlign: "center", padding: "30px 10px" }}>
      <Icon name="circlecheck" size={40} color="var(--success-text)" />
      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 14 }}>Pago confirmado</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
        Pagaste RD$ {total.toLocaleString("es-DO")} por {seleccionadas.length} póliza{seleccionadas.length > 1 ? "s" : ""}: {seleccionadas.map((p) => p.label).join(", ")}.
      </div>
      <button className="solid" onClick={() => goTab("home")} style={{ width: "100%", marginTop: 24 }}>Ver en Inicio</button>
    </div>
  );
}

export function ReclamoSeleccionarPolizaScreen() {
  const { products, seleccionarPolizaReclamo } = useApp();
  const activas = products.filter((p) => !p.noContratado);
  return (
    <>
      <BackHeader title="Reportar un reclamo" />
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>¿Sobre cuál póliza es tu reclamo?</div>
      {activas.map((p) => (
        <Row key={p.key} icon={p.icon} label={`${p.label} · ${p.plan}`} onClick={() => seleccionarPolizaReclamo(p.key)} />
      ))}
    </>
  );
}

export function ReclamoAutoTipoScreen() {
  const { seleccionarTipoReclamoAuto } = useApp();
  return (
    <>
      <BackHeader title="Reclamo · Auto" />
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>¿Qué tipo de situación quieres reportar?</div>
      {TIPOS_RECLAMO_AUTO.map(([icon, tipo, label]) => (
        <div
          key={tipo}
          onClick={() => seleccionarTipoReclamoAuto(tipo)}
          className="card"
          style={{ marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
        >
          <Icon name={icon} size={20} color="var(--accent)" />
          <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
        </div>
      ))}
    </>
  );
}

export function ReclamoAutoFormScreen() {
  const { reclamoForm, capturarFotoReclamo, setReclamoDescripcion, someterReclamo, goBack } = useApp();
  const listo = !!(reclamoForm.fotoCapturada && reclamoForm.descripcion);
  return (
    <>
      <BackHeader title={`Reclamo · ${TIPO_RECLAMO_LABEL[reclamoForm.tipoAuto]}`} />
      <SectionLabel>Evidencia fotográfica</SectionLabel>
      <CaptureCard label="Foto del vehículo o daño" captured={reclamoForm.fotoCapturada} onClick={capturarFotoReclamo} />
      <SectionLabel>Describe lo sucedido</SectionLabel>
      <input
        className="u-input"
        placeholder="Ej. Choqué por detrás en la Av. Kennedy"
        value={reclamoForm.descripcion}
        onChange={(e) => setReclamoDescripcion(e.target.value)}
      />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={goBack} style={{ flex: 1 }}>Atrás</button>
        <button className="solid" onClick={someterReclamo} disabled={!listo} style={{ flex: 2 }}>Someter reclamo</button>
      </div>
    </>
  );
}

export function ReclamoDocumentosScreen() {
  const { reclamoForm, toggleDocumentoReclamo, someterReclamo, goBack } = useApp();
  const todos = REQUISITOS_RECLAMO_HOGAR.every((d) => reclamoForm.documentos[d]);
  return (
    <>
      <BackHeader title="Reclamo · Documentación" />
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>Sube cada uno de los documentos requeridos para procesar tu reclamo.</div>
      {REQUISITOS_RECLAMO_HOGAR.map((d) => (
        <CaptureCard key={d} label={d} captured={!!reclamoForm.documentos[d]} onClick={() => toggleDocumentoReclamo(d)} />
      ))}
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={goBack} style={{ flex: 1 }}>Atrás</button>
        <button className="solid" onClick={someterReclamo} disabled={!todos} style={{ flex: 2 }}>Someter reclamo</button>
      </div>
    </>
  );
}

export function ReclamoGenericoScreen() {
  const { reclamoForm, setReclamoDescripcion, someterReclamo, goBack } = useApp();
  return (
    <>
      <BackHeader title="Reportar un reclamo" />
      <SectionLabel>Describe tu reclamo</SectionLabel>
      <input
        className="u-input"
        placeholder="Cuéntanos qué sucedió"
        value={reclamoForm.descripcion}
        onChange={(e) => setReclamoDescripcion(e.target.value)}
      />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={goBack} style={{ flex: 1 }}>Atrás</button>
        <button className="solid" onClick={someterReclamo} disabled={!reclamoForm.descripcion} style={{ flex: 2 }}>Someter reclamo</button>
      </div>
    </>
  );
}

export function ReclamoSometidoScreen() {
  const { goTab } = useApp();
  return (
    <div style={{ textAlign: "center", padding: "30px 10px" }}>
      <Icon name="circlecheck" size={40} color="var(--success-text)" />
      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 14 }}>Reclamo enviado</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>Nuestro equipo revisará tu reclamo y te contactará pronto.</div>
      <button className="solid" onClick={() => goTab("home")} style={{ width: "100%", marginTop: 24 }}>Ver en Inicio</button>
    </div>
  );
}
