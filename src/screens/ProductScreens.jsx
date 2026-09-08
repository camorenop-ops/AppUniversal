import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icon";
import { BackHeader, SectionLabel, Row, AddRow, QuickActionsRow, CoverageLine } from "../components/UI";
import { CoberturasAccordion } from "../components/CoberturasAccordion";
import { COBERTURAS_LABEL, COBERTURAS_DATA, TITULAR_NOMBRE } from "../data/data";

const PLANES_PROPIEDAD_DETALLE = ["hogar", "garantivilla"];

export function SaludScreen() {
  const {
    products, dependientes, openCarnet, openAgregarCobertura, openCambioPlan,
    openAgregarDependiente, openAfiliadoDetalle, openReembolsos, openRedMedica, openAutorizaciones,
  } = useApp();
  const p = products.find((x) => x.key === "salud");
  return (
    <>
      <BackHeader title="Salud" />
      <div style={{ fontSize: 17, fontWeight: 600 }}>{p.plan}</div>
      <div className="badge-active">Activo</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 8 }}>{dependientes.length} dependientes afiliados</div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Contrato: 03003780-28817</div>
      <SectionLabel>Accesos rápidos</SectionLabel>
      <QuickActionsRow items={[
        ["receipt", "Reembolsos", openReembolsos],
        ["network", "Red médica", openRedMedica],
        ["stethoscope", "Autorizaciones", openAutorizaciones],
        ["creditcard", "Carnet", openCarnet],
        ["replace", "Cambiar de plan", openCambioPlan],
        ["plus", "Agregar cobertura", openAgregarCobertura],
      ]} />
      <SectionLabel>Consulta de afiliados</SectionLabel>
      {[TITULAR_NOMBRE, ...dependientes].map((d) => (
        <Row key={d} icon="user" label={d} onClick={() => openAfiliadoDetalle(d, "salud")} />
      ))}
      <AddRow icon="userplus" label="Agregar dependiente" onClick={openAgregarDependiente} />
      <SectionLabel>Coberturas del plan</SectionLabel>
      <CoberturasAccordion planKey={p.plan} />
    </>
  );
}

export function AutoScreen() {
  const { products, openAsistenciaSolicitud, openCarnetBien } = useApp();
  const ap = products.find((p) => p.key === "auto");
  return (
    <>
      <BackHeader title="Auto" />
      <div style={{ fontSize: 17, fontWeight: 600 }}>{ap.plan}</div>
      <div className="badge-active">Activo</div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>Contrato: 03003780-28817</div>
      <SectionLabel>Accesos rápidos</SectionLabel>
      <QuickActionsRow items={[
        ["phone", "Solicitar asistencia", () => openAsistenciaSolicitud("vehicular")],
        ["creditcard", "Carnet", () => openCarnetBien("auto")],
      ]} />
      <SectionLabel>Vehículos asegurados ({ap.vehiculos.length} de 4)</SectionLabel>
      {ap.vehiculos.map((v, i) => (
        <div className="card" style={{ marginBottom: 8 }} key={i}>
          <Icon name="car" size={22} color="var(--accent)" />
          <div style={{ fontWeight: 600, fontSize: 14, marginTop: 8 }}>{v.marca} {v.modelo} {v.anio}</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Placa: {v.placa}, color {v.color}</div>
        </div>
      ))}
      <SectionLabel>Coberturas del plan</SectionLabel>
      <CoberturasAccordion planKey={ap.plan} />
    </>
  );
}

function GenericProductScreen({ productKey }) {
  const { products, openCarnetBien } = useApp();
  const p = products.find((x) => x.key === productKey);
  return (
    <>
      <BackHeader title={p.label} />
      <div style={{ fontSize: 17, fontWeight: 600 }}>{p.plan}</div>
      <div className="badge-active">Activo</div>
      <div className="card" style={{ marginTop: 12, marginBottom: 14 }}>
        <Icon name={p.icon} size={22} color="var(--accent)" />
        <div style={{ fontWeight: 600, fontSize: 15, marginTop: 8 }}>{p.extra}</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>Contrato: 03003780-28817</div>
      </div>
      <SectionLabel>{COBERTURAS_LABEL[productKey] || "Coberturas del plan"}</SectionLabel>
      {PLANES_PROPIEDAD_DETALLE.includes(productKey)
        ? <CoberturasAccordion planKey="Amplia" initialOpenFirst />
        : COBERTURAS_DATA[productKey].map((item, i) => <CoverageLine key={i} item={item} />)}
      <button className="solid" onClick={() => openCarnetBien(productKey)} style={{ width: "100%", marginTop: 14 }}>Ver carnet</button>
    </>
  );
}

export function ProductScreen({ productKey }) {
  if (productKey === "salud") return <SaludScreen />;
  if (productKey === "auto") return <AutoScreen />;
  return <GenericProductScreen productKey={productKey} />;
}
