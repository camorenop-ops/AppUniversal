import { useApp } from "../context/AppContext";
import { LogoLockup, Icon } from "../components/Icon";
import { FilialTab, Row, SectionLabel, Tile, QuickActionsRow, AdsStrip } from "../components/UI";
import { FONDOS, PROYECTOS, ANUNCIOS, TITULAR_NOMBRE } from "../data/data";

const FILIALES = [
  ["Seguros", "shield"],
  ["AFI", "chart"],
  ["Fiduciaria", "bank"],
  ["ARS", "heart"],
  ["Asistencia", "tool"],
];

export function HomeTab() {
  const {
    activeFilial, setFilial, products, asistenciaProducts, dependientes,
    openProduct, openCotizar, openFondo, openEstadoCuenta, openInfo, openStub,
    openRenovaciones, openEndosarPoliza, openPagoPolizas, openReclamo, openAfiliadoDetalle,
  } = useApp();

  let content;
  if (activeFilial === "Seguros") {
    content = (
      <>
        <SectionLabel>Accesos rápidos</SectionLabel>
        <QuickActionsRow items={[
          ["refresh", "Renovación", openRenovaciones],
          ["filedesc", "Endosar póliza", openEndosarPoliza],
          ["creditcard", "Pago", openPagoPolizas],
          ["alerttriangle", "Reclamo", openReclamo],
        ]} />
        <SectionLabel>Mis pólizas</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 10 }}>
          {products.map((p) => (
            <Tile
              key={p.key}
              product={p}
              onClick={() => (p.noContratado ? openCotizar(p.key) : openProduct(p.key))}
              onCotizar={openCotizar}
            />
          ))}
        </div>
      </>
    );
  } else if (activeFilial === "AFI") {
    content = (
      <>
        <SectionLabel>Accesos rápidos</SectionLabel>
        <QuickActionsRow items={[
          ["arrowdown", "Solicitar rescate", () => openFondo("rescate")],
          ["arrowup", "Notificar aporte", () => openFondo("aporte")],
        ]} />
        <SectionLabel>Mis fondos</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 10 }}>
          {FONDOS.map((f) => (
            <div key={f.name} onClick={() => openInfo("AFI", f.name)} className="tile">
              <div style={{ fontWeight: 600, fontSize: 14, marginTop: 8 }}>{f.name}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{f.rows[0][1]}</div>
            </div>
          ))}
        </div>
      </>
    );
  } else if (activeFilial === "Fiduciaria") {
    content = (
      <>
        <SectionLabel>Accesos rápidos</SectionLabel>
        <QuickActionsRow items={[["receipt", "Estado de cuenta", openEstadoCuenta]]} />
        <SectionLabel>Mis proyectos</SectionLabel>
        {PROYECTOS.map((p) => (
          <Row key={p.name} icon="building" label={p.name} onClick={() => openInfo("Fiduciaria", p.name)} />
        ))}
      </>
    );
  } else if (activeFilial === "ARS") {
    content = [TITULAR_NOMBRE, ...dependientes].map((d) => (
      <Row key={d} icon="user" label={d} onClick={() => openAfiliadoDetalle(d)} />
    ));
  } else {
    content = (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 10 }}>
        {asistenciaProducts.map((p) => (
          <Tile
            key={p.key}
            product={p}
            onClick={() => (p.noContratado ? openCotizar(p.key) : openInfo("Asistencia", p.key))}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <LogoLockup size={28} className="home-logo" />
      <div className="greeting-name" style={{ margin: "6px 0 12px" }}>{TITULAR_NOMBRE}</div>
      <AdsStrip ads={ANUNCIOS} onSelect={openStub} />
      <div className="toptabs">
        {FILIALES.map(([label, icon]) => (
          <FilialTab key={label} icon={icon} label={label} on={label === activeFilial} onClick={() => setFilial(label)} />
        ))}
      </div>
      {content}
    </>
  );
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
  const { openCarnet, openStub } = useApp();
  return (
    <>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Ficha del afiliado</div>
      <div className="card" style={{ marginBottom: 6 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{TITULAR_NOMBRE}</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Contrato: 03003780-28817</div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Afiliado desde: 01/02/2024</div>
      </div>
      <Row icon="creditcard" label="Mis carnets" onClick={openCarnet} />
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
