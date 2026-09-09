import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icon";
import { Row, SectionLabel, QuickActionsRow, AdsStrip, SegmentedTabs, ProductCard, EstadoBadge } from "../components/UI";
import {
  FONDOS, PROYECTOS, ANUNCIOS, TITULAR_NOMBRE, PILARES, ASISTENCIA_INFO, PLAN_BASICO_SALUD, AFILIADOS_ARS_USADO,
} from "../data/data";

export function HomeTab() {
  const {
    activePilar, setPilar, products, asistenciaProducts, goTab,
    openProduct, openCotizar, openFondo, openFondoDetalle, openEstadoCuenta, openInfo, openStub, openProximamente,
    openRenovaciones, openEndosarPoliza, openPagoPolizas, openReclamo, openAfiliadoDetalle,
    openCoberturasDetalle, openArsTraspaso, openAsistenciaSolicitud, openReembolsos, openAutorizaciones,
  } = useApp();

  let content;
  if (activePilar === "seguros") {
    const arsUso = AFILIADOS_ARS_USADO[TITULAR_NOMBRE];
    const arsDisponible = PLAN_BASICO_SALUD.coberturaMedicamentos - arsUso.medicamentosUsado;
    content = (
      <>
        {products.map((p) => (
          <ProductCard
            key={p.key}
            icon={p.icon}
            title={p.label}
            sub={p.plan}
            badge={<EstadoBadge estado={p.noContratado ? "No contratado" : "Activo"} />}
            lines={p.noContratado ? [] : [
              ["Vigencia", p.renovacion || "—"],
              ["Balance pendiente", `RD$${(p.montoPendiente || 0).toLocaleString("es-DO")}`],
            ]}
            onClick={() => (p.noContratado ? openCotizar(p.key) : openProduct(p.key))}
          />
        ))}
        <ProductCard
          icon="heart"
          title="ARS"
          sub={PLAN_BASICO_SALUD.nombre}
          badge={<EstadoBadge estado="Activo" />}
          lines={[["Disponible medicamentos", `RD$${arsDisponible.toLocaleString("es-DO")} de RD$${PLAN_BASICO_SALUD.coberturaMedicamentos.toLocaleString("es-DO")}`]]}
          onClick={() => openAfiliadoDetalle(TITULAR_NOMBRE, "ars")}
        />
        <ProductCard
          icon="shieldplus"
          title="UNIT"
          sub="Nueva solución de Grupo Universal"
          badge={<EstadoBadge estado="Próximamente" />}
          lines={[]}
          onClick={() => openProximamente("UNIT")}
        />
      </>
    );
  } else if (activePilar === "financieras") {
    content = (
      <>
        {FONDOS.map((f) => (
          <ProductCard
            key={f.key}
            icon="chart"
            title={f.name}
            sub={f.perfilRiesgo}
            badge={<EstadoBadge estado={f.invertido ? "Activo" : "Sin inversión"} />}
            lines={f.invertido
              ? [["Saldo", `RD$${f.saldo.toLocaleString("es-DO")}`], ["Rendimiento anual", f.rendimientoAnual]]
              : [["Rendimiento anual", f.rendimientoAnual], ["Monto mínimo", `RD$${f.montoMinimo.toLocaleString("es-DO")}`]]}
            onClick={() => openFondoDetalle(f.key)}
          />
        ))}
        {PROYECTOS.map((p) => (
          <ProductCard
            key={p.name}
            icon="building"
            title={p.name}
            sub="Fiduciaria"
            lines={p.rows}
            onClick={() => openInfo("Fiduciaria", p.name)}
          />
        ))}
      </>
    );
  } else {
    content = (
      <>
        {asistenciaProducts.map((p) => (
          <ProductCard
            key={p.key}
            icon={p.icon}
            title={p.label}
            sub={p.noContratado ? undefined : "Asistencia"}
            badge={<EstadoBadge estado={p.noContratado ? "No contratado" : "Activo"} />}
            lines={p.noContratado ? [] : (ASISTENCIA_INFO[p.key] || []).filter(([k]) => k !== "Estado")}
            onClick={() => (p.noContratado ? openCotizar(p.key) : openInfo("Asistencia", p.key))}
          />
        ))}
        <ProductCard
          icon="car"
          title="Autonovo"
          sub="Nueva solución de Grupo Universal"
          badge={<EstadoBadge estado="Próximamente" />}
          lines={[]}
          onClick={() => openProximamente("Autonovo")}
        />
      </>
    );
  }

  const destacados = [
    ["car", "Asistencia vehicular", () => openAsistenciaSolicitud("vehicular")],
    ["search", "Mercado digital", () => openStub("Mercado digital")],
    ["arrowup", "Aporte a fondo", () => openFondo("aporte")],
    ["arrowdown", "Retiro de fondo", () => openFondo("rescate")],
    ["receipt", "Reembolsos", openReembolsos],
    ["stethoscope", "Autorizaciones médicas", openAutorizaciones],
    ["refresh", "Renovación", openRenovaciones],
    ["filedesc", "Endosar póliza", openEndosarPoliza],
    ["creditcard", "Pago de pólizas", openPagoPolizas],
    ["alerttriangle", "Reclamo", openReclamo],
    ["shieldplus", "Coberturas del PDSS", () => openCoberturasDetalle("PDSS")],
    ["network", "Traspaso de ARS", openArsTraspaso],
    ["home", "Asistencia de hogar", () => openAsistenciaSolicitud("hogar")],
    ["bank", "Estado de cuenta", openEstadoCuenta],
  ];

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "2px 0 12px" }}>
        <span className="greeting-name">¡Hola {TITULAR_NOMBRE.split(" ")[0]}!</span>
        <span onClick={() => goTab("cuenta")} style={{ cursor: "pointer", color: "var(--navy)" }}>
          <Icon name="list" size={22} />
        </span>
      </div>

      <div className="pilar-tabs-wrap">
        <SegmentedTabs
          items={PILARES.map((p) => ({ key: p.key, label: p.label }))}
          activeKey={activePilar}
          onChange={setPilar}
        />
      </div>

      <SectionLabel>Novedades</SectionLabel>
      <AdsStrip ads={ANUNCIOS} onSelect={openStub} />

      <SectionLabel>Mis productos</SectionLabel>
      <SegmentedTabs
        items={PILARES.map((p) => ({ key: p.key, label: p.misLabel }))}
        activeKey={activePilar}
        onChange={setPilar}
        size="small"
      />
      {content}

      <SectionLabel>Destacados</SectionLabel>
      <QuickActionsRow items={destacados} />

      <SectionLabel>Tienda en línea</SectionLabel>
      <div className="card">
        <div style={{ fontWeight: 600, fontSize: 14 }}>Solicitar productos</div>
        <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 6 }}>
          Nuestros especialistas están listos para ayudarte a encontrar el producto que necesitas.
        </div>
        <button className="solid" onClick={() => openStub("Tienda en línea")} style={{ width: "100%", marginTop: 12 }}>Ir a la tienda</button>
      </div>
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
