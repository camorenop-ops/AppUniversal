import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icon";
import { Row, SectionLabel } from "../components/UI";
import { TITULAR_NOMBRE } from "../data/data";
import { EcosistemaHome, AutonomiaHome, IntuitivoHome } from "./HomeVariants";

export function HomeTab() {
  const { proposal } = useApp();
  if (proposal === "autonomia") return <AutonomiaHome />;
  if (proposal === "intuitivo") return <IntuitivoHome />;
  return <EcosistemaHome />;
}

function NotifItem({ icon, title, sub, onClick }) {
  return (
    <div onClick={onClick} className="card" style={{ padding: "10px 12px", marginBottom: 8 }}>
      <div style={{ fontSize: 13, fontWeight: 600 }}>
        <span style={{ color: "var(--accent)", marginRight: 6 }}><Icon name={icon} /></span>
        {title}
      </div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{sub}</div>
    </div>
  );
}

export function NotifTab() {
  const { openStub } = useApp();
  return (
    <>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Notificaciones</div>
      <SectionLabel>Salud</SectionLabel>
      <NotifItem icon="check" title="Reembolso aprobado" sub="1,200 pesos" onClick={() => openStub("Reembolso aprobado")} />
      <NotifItem icon="calendar" title="Cita de telemedicina" sub="Mañana, 10:00 am" onClick={() => openStub("Cita de telemedicina")} />
      <SectionLabel>Auto</SectionLabel>
      <NotifItem icon="clock" title="Renovación próxima" sub="Vence en 20 días" onClick={() => openStub("Renovación próxima")} />
      <SectionLabel>Vida</SectionLabel>
      <NotifItem icon="sparkles" title="Nueva cobertura disponible" sub="Para tu plan Vida Universal" onClick={() => openStub("Nueva cobertura disponible")} />
    </>
  );
}

export function CuentaTab() {
  const { openCarnet, openMetodosPago, openStub } = useApp();
  return (
    <>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Ficha del afiliado</div>
      <div className="card" style={{ marginBottom: 6 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{TITULAR_NOMBRE}</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Contrato: 03003780-28817</div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Afiliado desde: 01/02/2024</div>
      </div>
      <Row icon="creditcard" label="Mis carnets" onClick={openCarnet} />
      <Row icon="cash" label="Métodos de pago" onClick={openMetodosPago} />
      <Row icon="user" label="Datos personales" onClick={() => openStub("Datos personales")} />
      <Row icon="lock" label="Seguridad" onClick={() => openStub("Seguridad")} />
      <Row icon="bell" label="Preferencias de notificación" onClick={() => openStub("Preferencias de notificación")} />
      <div onClick={() => openStub("Cerrar sesión")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 2px", cursor: "pointer" }}>
        <span style={{ color: "var(--danger)" }}><Icon name="logout" size={17} /></span>
        <span style={{ fontSize: 14, color: "var(--danger)" }}>Cerrar sesión</span>
      </div>
    </>
  );
}
