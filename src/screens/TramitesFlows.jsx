import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icon";
import { BackHeader, SectionLabel, CaptureCard, EstadoBadge } from "../components/UI";
import { COBERTURAS_DISPONIBLES_SALUD } from "../data/data";

export function ReembolsosScreen() {
  const { reembolsos, openSolicitarReembolso } = useApp();
  return (
    <>
      <BackHeader title="Reembolsos" />
      <button className="solid" onClick={openSolicitarReembolso} style={{ width: "100%", marginBottom: 14 }}>+ Solicitar nuevo reembolso</button>
      <SectionLabel>Reembolsos solicitados</SectionLabel>
      {reembolsos.map((r, i) => (
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

export function SolicitarReembolsoScreen() {
  const {
    reembolsoForm, capturarFactura, capturarDocReembolso, nextReembolso, prevReembolso,
    setReembolsoMonto, someterReembolso,
  } = useApp();

  if (reembolsoForm.step === 1) {
    return (
      <>
        <BackHeader title="Nuevo reembolso" />
        <SectionLabel>Sube los documentos</SectionLabel>
        <CaptureCard label="Foto de la factura" captured={reembolsoForm.factura} onClick={capturarFactura} />
        <CaptureCard label="Foto de documentos de soporte" captured={reembolsoForm.documento} onClick={capturarDocReembolso} />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={prevReembolso} style={{ flex: 1 }}>Atrás</button>
          <button className="solid" onClick={nextReembolso} disabled={!(reembolsoForm.factura && reembolsoForm.documento)} style={{ flex: 2 }}>Continuar</button>
        </div>
      </>
    );
  }
  return (
    <>
      <BackHeader title="Revisar solicitud" />
      <SectionLabel>Documentos</SectionLabel>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
        <Icon name="circlecheck" size={16} color="var(--success-text)" />
        <span style={{ fontSize: 13 }}>Factura cargada</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
        <Icon name="circlecheck" size={16} color="var(--success-text)" />
        <span style={{ fontSize: 13 }}>Documentos de soporte cargados</span>
      </div>
      <SectionLabel>Monto a reembolsar</SectionLabel>
      <input className="u-input" placeholder="Ej. 1,500" onChange={(e) => setReembolsoMonto(e.target.value)} />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={prevReembolso} style={{ flex: 1 }}>Atrás</button>
        <button className="solid" onClick={someterReembolso} style={{ flex: 2 }}>Someter solicitud</button>
      </div>
    </>
  );
}

export function ReembolsoSometidoScreen() {
  const { volverAReembolsos } = useApp();
  return (
    <div style={{ textAlign: "center", padding: "30px 10px" }}>
      <Icon name="circlecheck" size={40} color="var(--success-text)" />
      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 14 }}>Solicitud enviada</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>Te notificaremos cuando tu reembolso sea revisado.</div>
      <button className="solid" onClick={volverAReembolsos} style={{ width: "100%", marginTop: 24 }}>Ver mis reembolsos</button>
    </div>
  );
}

export function AutorizacionesScreen() {
  const { autorizaciones, openSolicitarAutorizacion } = useApp();
  return (
    <>
      <BackHeader title="Autorizaciones" />
      <button className="solid" onClick={openSolicitarAutorizacion} style={{ width: "100%", marginBottom: 14 }}>+ Solicitar nueva autorización</button>
      <SectionLabel>Autorizaciones solicitadas</SectionLabel>
      {autorizaciones.map((a, i) => (
        <div className="card" style={{ marginBottom: 8 }} key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{a.concepto}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{a.fecha}</div>
            </div>
            <EstadoBadge estado={a.estado} />
          </div>
        </div>
      ))}
    </>
  );
}

export function SolicitarAutorizacionScreen() {
  const { autForm, capturarIndicacion, goBack, someterAutorizacion } = useApp();
  return (
    <>
      <BackHeader title="Nueva autorización" />
      <SectionLabel>Indicación médica</SectionLabel>
      <CaptureCard label="Foto de la indicación médica" captured={autForm.capturada} onClick={capturarIndicacion} />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={goBack} style={{ flex: 1 }}>Atrás</button>
        <button className="solid" onClick={someterAutorizacion} disabled={!autForm.capturada} style={{ flex: 2 }}>Someter solicitud</button>
      </div>
    </>
  );
}

export function AutorizacionSometidaScreen() {
  const { volverAAutorizaciones } = useApp();
  return (
    <div style={{ textAlign: "center", padding: "30px 10px" }}>
      <Icon name="circlecheck" size={40} color="var(--success-text)" />
      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 14 }}>Solicitud enviada</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>Te notificaremos cuando tu autorización sea revisada.</div>
      <button className="solid" onClick={volverAAutorizaciones} style={{ width: "100%", marginTop: 24 }}>Ver mis autorizaciones</button>
    </div>
  );
}

export function AgregarDependienteScreen() {
  const { depForm, capturarDocumento, guardarDependiente } = useApp();
  if (!depForm.fotoCapturada) {
    return (
      <>
        <BackHeader title="Agregar dependiente" />
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>Toma una foto del documento de identidad y completamos los datos por ti.</div>
        <CaptureCard label="Tomar foto del documento" captured={false} onClick={capturarDocumento} />
      </>
    );
  }
  const d = depForm.datos;
  return (
    <>
      <BackHeader title="Agregar dependiente" />
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--success-text)", marginBottom: 12 }}>
        <Icon name="circlecheck" size={15} /> Documento procesado, verifica los datos
      </div>
      <SectionLabel>Datos detectados</SectionLabel>
      <input className="u-input" defaultValue={d.nombre} placeholder="Nombre completo" />
      <input className="u-input" defaultValue={d.fecha} placeholder="Fecha de nacimiento" />
      <input className="u-input" defaultValue={d.identificacion} placeholder="Número de identificación" />
      <button className="solid" onClick={guardarDependiente} style={{ width: "100%", marginTop: 8 }}>Agregar dependiente</button>
    </>
  );
}

export function DependienteAgregadoScreen() {
  const { depForm, volverASalud } = useApp();
  return (
    <div style={{ textAlign: "center", padding: "30px 10px" }}>
      <Icon name="circlecheck" size={40} color="var(--success-text)" />
      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 14 }}>Dependiente agregado</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>{depForm.datos.nombre} ya aparece en tu póliza de Salud.</div>
      <button className="solid" onClick={volverASalud} style={{ width: "100%", marginTop: 24 }}>Volver a Salud</button>
    </div>
  );
}

export function AgregarCoberturaScreen() {
  const { agregarCobertura } = useApp();
  return (
    <>
      <BackHeader title="Agregar cobertura" />
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>Coberturas disponibles para tu plan</div>
      {COBERTURAS_DISPONIBLES_SALUD.map((c) => (
        <div key={c[0]} onClick={() => agregarCobertura(c[0], c[1])} className="card" style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13.5 }}>{c[0]}</span>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--accent)" }}>RD$ {c[1].toLocaleString("es-DO")}/mes</span>
        </div>
      ))}
    </>
  );
}

export function CoberturaAgregadaScreen({ nombre, precio }) {
  const { goTab } = useApp();
  return (
    <div style={{ textAlign: "center", padding: "30px 10px" }}>
      <Icon name="circlecheck" size={40} color="var(--success-text)" />
      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 14 }}>Cobertura agregada</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>{nombre} · RD$ {precio.toLocaleString("es-DO")}/mes se sumó a tu plan de Salud.</div>
      <button className="solid" onClick={() => goTab("home")} style={{ width: "100%", marginTop: 24 }}>Volver al inicio</button>
    </div>
  );
}
