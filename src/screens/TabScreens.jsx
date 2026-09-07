import { useApp } from "../context/AppContext";
import { LogoLockup, Icon } from "../components/Icon";
import { Pill, Row, SectionLabel, Tile, QuickActionsRow, AdsStrip } from "../components/UI";
import { FONDOS, PROYECTOS, SALUD_ITEMS, AUTO_ITEMS, ANUNCIOS } from "../data/data";

export function HomeTab() {
  const {
    activeFilial, setFilial, products, asistenciaProducts, dependientes,
    openProduct, openCotizar, openFondo, openEstadoCuenta, openInfo, openStub,
  } = useApp();
  const FILIALES = ["Seguros", "AFI", "Fiduciaria", "ARS", "Asistencia"];

  let content;
  if (activeFilial === "Seguros") {
    content = (
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
    content = dependientes.map((d) => <Row key={d} icon="user" label={d} onClick={() => openStub(d)} />);
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
      <div className="greeting-name" style={{ margin: "6px 0 12px" }}>Carlos Andrés Moreno Prieto</div>
      <AdsStrip ads={ANUNCIOS} onSelect={openStub} />
      <div className="toptabs">
        {FILIALES.map((f) => <Pill key={f} label={f} on={f === activeFilial} onClick={() => setFilial(f)} />)}
      </div>
      {content}
    </>
  );
}

export function TramitesTab() {
  const { openReembolsos, openAutorizaciones, openStub, openPago, openCoberturasDetalle } = useApp();
  return (
    <>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Trámites por línea</div>
      <SectionLabel>Salud</SectionLabel>
      <Row icon="receipt" label="Reembolsos" onClick={openReembolsos} />
      <Row icon="stethoscope" label="Autorizaciones" onClick={openAutorizaciones} />
      {SALUD_ITEMS.map((it) => <Row key={it[1]} icon={it[0]} label={it[1]} onClick={() => openStub(it[1])} />)}
      <SectionLabel>Auto</SectionLabel>
      {AUTO_ITEMS.map((it) => <Row key={it[1]} icon={it[0]} label={it[1]} onClick={() => openStub(it[1])} />)}
      <SectionLabel>Pago</SectionLabel>
      <Row icon="creditcard" label="Pagar cualquier trámite" onClick={openPago} />
      <SectionLabel>Consulta de coberturas</SectionLabel>
      <Row icon="search" label="Consultar coberturas" onClick={() => openCoberturasDetalle("Plan Alpha")} />
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
        <div style={{ fontWeight: 600, fontSize: 14 }}>Carlos Andrés Moreno Prieto</div>
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
