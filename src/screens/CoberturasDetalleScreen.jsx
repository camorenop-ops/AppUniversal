import { BackHeader } from "../components/UI";
import { CoberturasAccordion } from "../components/CoberturasAccordion";

export function CoberturasDetalleScreen({ plan }) {
  return (
    <>
      <BackHeader title={`Coberturas · ${plan}`} />
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>Toca cada categoría para ver el detalle completo.</div>
      <CoberturasAccordion planKey={plan} initialOpenFirst />
    </>
  );
}
