import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icon";
import { BackHeader, SectionLabel, Chip, Progress, StepNav, CaptureCard, Row, TablaComparativa } from "../components/UI";
import {
  PRODUCT_TITLES, CATEGORIA, BASE_PERSONA, edadFactor, AUTO_FACTOR, PROPIEDAD_FACTOR,
  ASISTENCIA_HOGAR_PRECIOS, COMPARATIVO_FILAS,
} from "../data/data";

function ChipGroup({ options, current, field }) {
  const { setCotField } = useApp();
  return options.map((o) => (
    <span key={o} style={{ display: "inline-block", margin: "0 6px 6px 0" }}>
      <Chip label={o} on={current === o} onClick={() => setCotField(field, o)} />
    </span>
  ));
}

function PersonaDatosStep({ title }) {
  const { cot, prevCot, nextCot, setCotField, addPersonaCotizador, removePersonaCotizador } = useApp();
  const ctx = cot.key === "salud" && cot.destino === "empleado";
  const isSalud = cot.key === "salud";
  const draftComplete = !!(cot.sexo && cot.edad && cot.parentesco);
  const canContinue = isSalud ? cot.personas.length > 0 : draftComplete;

  return (
    <>
      <BackHeader title={`Cotizar ${title}`} />
      <Progress pasoActual={1} />
      {ctx && <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>Para: empleado doméstico</div>}
      {isSalud && cot.personas.length > 0 && (
        <>
          <SectionLabel>Personas a asegurar ({cot.personas.length})</SectionLabel>
          {cot.personas.map((p, i) => (
            <div key={i} className="card" style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13.5 }}>{p.parentesco} · {p.sexo} · {p.edad} años</span>
              <span onClick={() => removePersonaCotizador(i)} style={{ color: "var(--danger)", cursor: "pointer" }}>
                <Icon name="userminus" size={16} />
              </span>
            </div>
          ))}
        </>
      )}
      <SectionLabel>{isSalud ? `${cot.personas.length > 0 ? "Agregar otra persona" : "Agregar persona"} · Sexo` : "Sexo"}</SectionLabel>
      <ChipGroup options={["Masculino", "Femenino"]} current={cot.sexo} field="sexo" />
      <SectionLabel>Edad</SectionLabel>
      <input
        className="u-input"
        type="number"
        inputMode="numeric"
        min="0"
        max="99"
        placeholder="Ej. 34"
        value={cot.edad || ""}
        onChange={(e) => setCotField("edad", e.target.value)}
      />
      <SectionLabel>Parentesco</SectionLabel>
      <ChipGroup options={["Titular", "Cónyuge", "Hijo/a", "Padre/Madre"]} current={cot.parentesco} field="parentesco" />
      {isSalud && (
        <button onClick={addPersonaCotizador} disabled={!draftComplete} style={{ width: "100%", marginTop: 8 }}>
          + Agregar persona
        </button>
      )}
      <StepNav onBack={prevCot} onForward={nextCot} forwardLabel="Continuar" disabled={!canContinue} />
    </>
  );
}

function SexoChipsPersona({ idx, current }) {
  const { setPersonaCampo } = useApp();
  return ["Masculino", "Femenino"].map((o) => (
    <span key={o} style={{ display: "inline-block", margin: "0 6px 6px 0" }}>
      <Chip label={o} on={current === o} onClick={() => setPersonaCampo(idx, "sexo", o)} />
    </span>
  ));
}

function PersonaEmisionSaludStep({ title }) {
  const {
    cot, nextCot, capturarDocumentoPersona, setPersonaCampo, confirmarPersonaEmision, retrocederPersonaEmision,
  } = useApp();
  const idx = cot.personaEmisionIdx || 0;
  const total = cot.personas.length;

  if (idx >= total) {
    return (
      <>
        <BackHeader title={`Cotizar ${title}`} />
        <Progress pasoActual={3} />
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--success-text)", marginBottom: 12 }}>
          <Icon name="circlecheck" size={15} /> Datos confirmados de {total} beneficiario{total > 1 ? "s" : ""}
        </div>
        {cot.personas.map((p, i) => (
          <div key={i} className="card" style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{p.nombre} {p.apellidos}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{p.parentesco} · {p.sexo} · Nac. {p.fechaNacimiento}</div>
          </div>
        ))}
        <StepNav onBack={retrocederPersonaEmision} onForward={nextCot} forwardLabel="Continuar a pago" disabled={false} />
      </>
    );
  }

  const persona = cot.personas[idx];
  const listo = !!(persona.documentoCapturado && persona.nombre && persona.apellidos && persona.fechaNacimiento && persona.sexo);

  return (
    <>
      <BackHeader title={`Cotizar ${title}`} />
      <Progress pasoActual={3} />
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
        Beneficiario {idx + 1} de {total} · {persona.parentesco}
      </div>
      <SectionLabel>Documento de identidad</SectionLabel>
      <CaptureCard
        label="Foto del documento de identidad"
        captured={!!persona.documentoCapturado}
        onClick={() => capturarDocumentoPersona(idx)}
      />
      {persona.documentoCapturado && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--success-text)", margin: "12px 0" }}>
            <Icon name="circlecheck" size={15} /> Documento procesado, verifica los datos
          </div>
          <SectionLabel>Nombres</SectionLabel>
          <input className="u-input" value={persona.nombre || ""} onChange={(e) => setPersonaCampo(idx, "nombre", e.target.value)} />
          <SectionLabel>Apellidos</SectionLabel>
          <input className="u-input" value={persona.apellidos || ""} onChange={(e) => setPersonaCampo(idx, "apellidos", e.target.value)} />
          <SectionLabel>Fecha de nacimiento</SectionLabel>
          <input className="u-input" value={persona.fechaNacimiento || ""} onChange={(e) => setPersonaCampo(idx, "fechaNacimiento", e.target.value)} />
          <SectionLabel>Sexo</SectionLabel>
          <SexoChipsPersona idx={idx} current={persona.sexo} />
        </>
      )}
      <StepNav
        onBack={retrocederPersonaEmision}
        onForward={() => confirmarPersonaEmision(idx)}
        forwardLabel={idx === total - 1 ? "Confirmar y continuar" : "Confirmar y siguiente"}
        disabled={!listo}
      />
    </>
  );
}

function PersonaEmisionStep({ title }) {
  const { cot, prevCot, nextCot } = useApp();
  if (cot.key === "salud") return <PersonaEmisionSaludStep title={title} />;
  return (
    <>
      <BackHeader title={`Cotizar ${title}`} />
      <Progress pasoActual={3} />
      <SectionLabel>Datos para emitir la póliza</SectionLabel>
      <input className="u-input" placeholder="Nombre completo" />
      <input className="u-input" placeholder="Cédula" />
      <input className="u-input" placeholder="Teléfono" />
      <StepNav onBack={prevCot} onForward={nextCot} forwardLabel="Continuar a pago" disabled={false} />
    </>
  );
}

function AutoMatriculaStep({ title }) {
  const { cot, prevCot, nextCot, capturarMatricula } = useApp();
  return (
    <>
      <BackHeader title={`Cotizar ${title}`} />
      <Progress pasoActual={1} />
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>Empieza con la matrícula del vehículo que quieres asegurar.</div>
      <SectionLabel>Matrícula del vehículo</SectionLabel>
      <CaptureCard label="Foto de la matrícula del vehículo" captured={cot.matricula} onClick={capturarMatricula} />
      <StepNav onBack={prevCot} onForward={nextCot} forwardLabel="Continuar" disabled={!cot.matricula} />
    </>
  );
}

function AutoCaracteristicasStep({ title }) {
  const { cot, setCotField, prevCot, validarAutoCaracteristicas } = useApp();
  return (
    <>
      <BackHeader title={`Cotizar ${title}`} />
      <Progress pasoActual={2} />
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--success-text)", marginBottom: 12 }}>
        <Icon name="circlecheck" size={15} /> Matrícula procesada, verifica los datos
      </div>
      <SectionLabel>Marca</SectionLabel>
      <input className="u-input" value={cot.marca} onChange={(e) => setCotField("marca", e.target.value)} />
      <SectionLabel>Modelo</SectionLabel>
      <input className="u-input" value={cot.modelo} onChange={(e) => setCotField("modelo", e.target.value)} />
      <SectionLabel>Año</SectionLabel>
      <input className="u-input" value={cot.anio} onChange={(e) => setCotField("anio", e.target.value)} />
      <SectionLabel>Precio del vehículo (RD$)</SectionLabel>
      <input className="u-input" placeholder="Ej. 1,500,000" onChange={(e) => setCotField("precioVehiculo", e.target.value)} />
      <StepNav onBack={prevCot} onForward={validarAutoCaracteristicas} forwardLabel="Continuar" disabled={false} />
    </>
  );
}

function PropiedadDatosStep({ title }) {
  const { prevCot, validarPropiedadDatos, setCotField } = useApp();
  return (
    <>
      <BackHeader title={`Cotizar ${title}`} />
      <Progress pasoActual={1} />
      <SectionLabel>Precio de la propiedad (RD$)</SectionLabel>
      <input className="u-input" placeholder="Ej. 6,000,000" onChange={(e) => setCotField("precioPropiedad", e.target.value)} />
      <StepNav onBack={prevCot} onForward={validarPropiedadDatos} forwardLabel="Continuar" disabled={false} />
    </>
  );
}

function PropiedadConfirmarStep({ title }) {
  const { cot, prevCot, nextCot } = useApp();
  return (
    <>
      <BackHeader title={`Cotizar ${title}`} />
      <Progress pasoActual={3} />
      <SectionLabel>Resumen</SectionLabel>
      <div className="card">
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Plan seleccionado</div>
        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{cot.plan}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 10 }}>Prima estimada</div>
        <div style={{ fontSize: 20, fontWeight: 600, color: "var(--accent)" }}>RD$ {cot.tarifa.toLocaleString("es-DO")} anual</div>
      </div>
      <StepNav onBack={prevCot} onForward={nextCot} forwardLabel="Comprar cobertura" disabled={false} />
    </>
  );
}

function OfertaComparadaStep({ title }) {
  const { cot, seleccionarPlan, prevCot, nextCot, openCoberturasDetalle } = useApp();
  const key = cot.key;
  const cat = CATEGORIA[key];
  let columnas, calc, intro;
  if (cat === "persona") {
    columnas = Object.keys(BASE_PERSONA[key]);
    if (key === "salud" && cot.personas.length > 0) {
      calc = (c) => Math.round(cot.personas.reduce((sum, p) => sum + BASE_PERSONA[key][c] * edadFactor(p.edad), 0));
      intro = `Según los ${cot.personas.length} asegurado(s) que agregaste, así se comparan tus opciones:`;
    } else {
      const factor = edadFactor(cot.edad);
      calc = (c) => Math.round(BASE_PERSONA[key][c] * factor);
      intro = "Según los datos que diste, así se comparan tus opciones:";
    }
  } else if (cat === "vehiculo") {
    const precio = parseFloat((cot.precioVehiculo + "").replace(/[^0-9.]/g, "")) || 500000;
    columnas = ["Básico", "Pérdida Total", "Full", "Súper Full"];
    calc = (c) => Math.round(precio * AUTO_FACTOR[c]);
    intro = `Con base en el valor de tu ${cot.marca} ${cot.modelo} ${cot.anio}:`;
  } else if (cat === "asistenciaHogar") {
    columnas = ["Básica", "Premium"];
    calc = (c) => ASISTENCIA_HOGAR_PRECIOS[c];
    intro = "Elige tu plan de asistencia para el hogar:";
  } else {
    const precioProp = parseFloat((cot.precioPropiedad + "").replace(/[^0-9.]/g, "")) || 3000000;
    columnas = ["Básica", "Amplia"];
    calc = (c) => Math.round(precioProp * PROPIEDAD_FACTOR[c]);
    intro = "Con base en el valor de tu propiedad:";
  }
  const progIdx = cat === "vehiculo" ? 3 : 2;
  const filas = COMPARATIVO_FILAS[key];

  return (
    <>
      <BackHeader title={`Cotizar ${title}`} />
      <Progress pasoActual={progIdx} />
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>{intro}</div>
      <TablaComparativa filas={filas} columnas={columnas} calcularPrecio={calc} plan={cot.plan} onSeleccionar={seleccionarPlan} />
      {(key === "salud" || key === "auto") && (
        <>
          <div style={{ fontSize: 11, color: "var(--muted)", margin: "2px 0 10px" }}>Ver detalle completo:</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {columnas.map((c) => (
              <span
                key={c}
                onClick={() => openCoberturasDetalle(c)}
                style={{ flex: 1, minWidth: 60, textAlign: "center", padding: "6px 3px", borderRadius: 8, fontSize: 9.5, fontWeight: 600, color: "var(--accent)", border: "1px solid var(--accent)", cursor: "pointer" }}
              >
                {c}
              </span>
            ))}
          </div>
        </>
      )}
      <StepNav onBack={prevCot} onForward={nextCot} forwardLabel="Continuar" disabled={!cot.plan} />
    </>
  );
}

function CotizarPagoStep() {
  const { cot, comprarPoliza } = useApp();
  return (
    <>
      <BackHeader title="Pago de póliza" />
      <Progress pasoActual={4} />
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Total a pagar</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: "var(--accent)" }}>RD$ {cot.tarifa.toLocaleString("es-DO")}</div>
      </div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>Método de pago</div>
      <Row icon="creditcard" label="Tarjeta terminada en 4417" onClick={() => {}} />
      <Row icon="bank" label="Cuenta bancaria" onClick={() => {}} />
      <button className="solid" onClick={comprarPoliza} style={{ width: "100%", marginTop: 14 }}>Confirmar y pagar</button>
    </>
  );
}

export function CotizarScreen() {
  const { cot } = useApp();
  const { key, cat, step } = cot;
  const title = PRODUCT_TITLES[key];

  if (cat === "asistenciaHogar") {
    if (step === 1) return <OfertaComparadaStep title={title} />;
    return <CotizarPagoStep />;
  }
  if (step === 4) return <CotizarPagoStep />;
  if (cat === "persona") {
    if (step === 1) return <PersonaDatosStep title={title} />;
    if (step === 2) return <OfertaComparadaStep title={title} />;
    if (step === 3) return <PersonaEmisionStep title={title} />;
  }
  if (cat === "vehiculo") {
    if (step === 1) return <AutoMatriculaStep title={title} />;
    if (step === 2) return <AutoCaracteristicasStep title={title} />;
    if (step === 3) return <OfertaComparadaStep title={title} />;
  }
  if (step === 1) return <PropiedadDatosStep title={title} />;
  if (step === 2) return <OfertaComparadaStep title={title} />;
  if (step === 3) return <PropiedadConfirmarStep title={title} />;
  return null;
}

export function SaludDestinoScreen() {
  const { elegirSaludDestino } = useApp();
  return (
    <>
      <BackHeader title="Seguro de Salud" />
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>¿Para quién es este seguro?</div>
      <div onClick={() => elegirSaludDestino("empleado")} className="card" style={{ marginBottom: 10 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>Empleado doméstico</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Nueva póliza independiente</div>
      </div>
      <div onClick={() => elegirSaludDestino("familia")} className="card">
        <div style={{ fontWeight: 600, fontSize: 14 }}>Mi familia</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Se agrega a tu póliza actual</div>
      </div>
    </>
  );
}

export function SaludFamiliaScreen() {
  const { openCambioPlan, openAgregarCobertura } = useApp();
  return (
    <>
      <BackHeader title="Seguro de Salud" />
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>
        Para tu familia, esto no es una póliza nueva: es un cambio de plan o agregar coberturas a la póliza que ya tienes.
      </div>
      <button onClick={openCambioPlan} style={{ width: "100%", marginBottom: 8 }}>Cambiar de plan</button>
      <button onClick={openAgregarCobertura} style={{ width: "100%" }}>Agregar coberturas</button>
    </>
  );
}

export function AutoLimiteScreen() {
  const { goBack } = useApp();
  return (
    <>
      <BackHeader title="Auto" />
      <div style={{ textAlign: "center", padding: "20px 10px" }}>
        <Icon name="car" size={28} color="var(--text-muted)" />
        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 10 }}>Ya tienes el máximo de 4 vehículos en tu póliza</div>
        <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 6 }}>Para agregar otro, primero retira uno desde Trámites.</div>
        <button onClick={goBack} style={{ width: "100%", marginTop: 16 }}>Entendido</button>
      </div>
    </>
  );
}

export function CompraConfirmadaScreen({ productKey, modo }) {
  const { goTab } = useApp();
  const msg = modo === "vehiculo"
    ? "El vehículo se agregó a tu póliza de Auto."
    : `Tu póliza de ${PRODUCT_TITLES[productKey]} ya está reflejada en Inicio.`;
  return (
    <div style={{ textAlign: "center", padding: "30px 10px" }}>
      <Icon name="circlecheck" size={40} color="var(--success-text)" />
      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 14 }}>Póliza actualizada</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>{msg}</div>
      <button className="solid" onClick={() => goTab("home")} style={{ width: "100%", marginTop: 24 }}>Ver en Inicio</button>
    </div>
  );
}

export function CambioPlanScreen() {
  const { products, seleccionarNuevoPlan, openCoberturasDetalle } = useApp();
  const p = products.find((x) => x.key === "salud");
  const columnas = Object.keys(BASE_PERSONA.salud);
  const calc = (c) => BASE_PERSONA.salud[c];
  const filas = COMPARATIVO_FILAS.salud;

  return (
    <>
      <BackHeader title="Cambiar de plan" />
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
        Tu plan actual es <strong>{p.plan}</strong>. Toca otro plan para comparar coberturas y precio, y cambiarte.
      </div>
      <TablaComparativa
        filas={filas}
        columnas={columnas}
        calcularPrecio={calc}
        plan={p.plan}
        onSeleccionar={(c) => { if (c !== p.plan) seleccionarNuevoPlan(c); }}
      />
      <div style={{ fontSize: 11, color: "var(--muted)", margin: "2px 0 10px" }}>Ver detalle completo:</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {columnas.map((c) => (
          <span
            key={c}
            onClick={() => openCoberturasDetalle(c)}
            style={{ flex: 1, minWidth: 60, textAlign: "center", padding: "6px 3px", borderRadius: 8, fontSize: 9.5, fontWeight: 600, color: "var(--accent)", border: "1px solid var(--accent)", cursor: "pointer" }}
          >
            {c}
          </span>
        ))}
      </div>
    </>
  );
}

export function CambioPlanConfirmarScreen() {
  const { products, cambioPlanForm, goBack, confirmarCambioPlan } = useApp();
  const p = products.find((x) => x.key === "salud");
  const actual = p.plan;
  const nuevo = cambioPlanForm.nuevoPlan;
  const precioActual = BASE_PERSONA.salud[actual];
  const precioNuevo = BASE_PERSONA.salud[nuevo];
  const diff = precioNuevo - precioActual;

  return (
    <>
      <BackHeader title="Confirmar cambio de plan" />
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
          <span style={{ color: "var(--muted)" }}>Plan actual</span>
          <span style={{ fontWeight: 600 }}>{actual}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Nuevo plan</span>
          <span style={{ fontWeight: 600, color: "var(--accent)" }}>{nuevo}</span>
        </div>
        <div style={{ borderTop: "1px dashed var(--border)", margin: "10px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Prima actual</span>
          <span>RD$ {precioActual.toLocaleString("es-DO")}/mes</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 4 }}>
          <span style={{ color: "var(--muted)" }}>Prima nueva</span>
          <span>RD$ {precioNuevo.toLocaleString("es-DO")}/mes</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, marginTop: 10 }}>
          <span>{diff >= 0 ? "Aumento" : "Ahorro"} mensual</span>
          <span style={{ color: diff >= 0 ? "var(--danger)" : "var(--success-text)" }}>
            {diff >= 0 ? "+" : "−"}RD$ {Math.abs(diff).toLocaleString("es-DO")}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={goBack} style={{ flex: 1 }}>Cancelar</button>
        <button className="solid" onClick={confirmarCambioPlan} style={{ flex: 2 }}>Confirmar cambio</button>
      </div>
    </>
  );
}

export function CambioPlanHechoScreen() {
  const { products, goTab } = useApp();
  const p = products.find((x) => x.key === "salud");
  return (
    <div style={{ textAlign: "center", padding: "30px 10px" }}>
      <Icon name="circlecheck" size={40} color="var(--success-text)" />
      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 14 }}>Plan actualizado</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>Ahora tienes {p.plan} en tu póliza de Salud.</div>
      <button className="solid" onClick={() => goTab("home")} style={{ width: "100%", marginTop: 24 }}>Ver en Inicio</button>
    </div>
  );
}
