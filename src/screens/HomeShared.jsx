import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icon";
import { FilialTab, Row, SectionLabel, Tile, QuickActionsRow } from "../components/UI";
import { FONDOS, PROYECTOS, TITULAR_NOMBRE } from "../data/data";

export const FILIAL_TABS = [
  ["Seguros", "shield"],
  ["AFI", "chart"],
  ["Fiduciaria", "bank"],
  ["ARS", "heart"],
  ["Asistencia", "firstaid"],
  ["UNIT", "network"],
  ["Propartes", "car"],
  ["Administraciones", "building"],
];

export const NOMBRE_CORTO = TITULAR_NOMBRE.split(" ").filter((_, i) => i === 0 || i === 2).join(" ");
const INICIALES = NOMBRE_CORTO.split(" ").map((w) => w[0]).join("");

export function HomeHeader() {
  const { goTab, openAsistenciaSolicitud } = useApp();
  return (
    <div className="home-header">
      <div className="home-header-user">
        <div className="home-avatar">{INICIALES}</div>
        <div>
          <div className="home-header-hello">Bienvenido</div>
          <div className="home-header-name">{NOMBRE_CORTO}</div>
        </div>
      </div>
      <div className="home-header-actions">
        <span onClick={() => goTab("notif")} className="home-header-bell"><Icon name="bell" size={18} color="#fff" /></span>
        <span onClick={() => openAsistenciaSolicitud("vehicular")} className="home-header-sos">SOS</span>
      </div>
    </div>
  );
}

export function FilialTabs() {
  const { activeFilial, setFilial } = useApp();
  return (
    <div className="toptabs">
      {FILIAL_TABS.map(([label, icon]) => (
        <FilialTab key={label} icon={icon} label={label} on={label === activeFilial} onClick={() => setFilial(label)} />
      ))}
    </div>
  );
}

export function FilialContent() {
  const {
    activeFilial,
    products, asistenciaProducts, dependientes,
    openProduct, openCotizar, openFondo, openFondoDetalle, openEstadoCuenta, openInfo,
    openRenovaciones, openEndosarPoliza, openPagoPolizas, openReclamo, openAfiliadoDetalle,
    openCoberturasDetalle, openArsTraspaso, openAsistenciaSolicitud, openRedMedica,
  } = useApp();

  let content;
  if (activeFilial === "Seguros") {
    content = (
      <>
        <SectionLabel>Accesos rápidos</SectionLabel>
        <QuickActionsRow items={[
          ["car", "Grúa 24/7", () => openAsistenciaSolicitud("vehicular"), "#E5484D"],
          ["network", "Red médica", openRedMedica, "#0EA5A5"],
          ["alerttriangle", "Reclamo", openReclamo, "#E5484D"],
          ["filedesc", "Endosar póliza", openEndosarPoliza, "#7C5CFC"],
          ["creditcard", "Pago", openPagoPolizas, "#1F9254"],
          ["refresh", "Renovación", openRenovaciones, "#2F6FE4"],
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
          ["arrowdown", "Solicitar rescate", () => openFondo("rescate"), "#E8871E"],
          ["arrowup", "Notificar aporte", () => openFondo("aporte"), "#1F9254"],
        ]} />
        <SectionLabel>Fondos</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 10 }}>
          {FONDOS.map((f) => (
            <div key={f.key} onClick={() => openFondoDetalle(f.key)} className={"tile" + (f.invertido ? "" : " off")}>
              <Icon name="chart" size={18} color={f.invertido ? "var(--accent)" : "var(--text-muted)"} />
              <div className="l">{f.name}</div>
              <div className="s">{f.invertido ? `Saldo: RD$ ${f.saldo.toLocaleString("es-DO")}` : "Sin inversión"}</div>
            </div>
          ))}
        </div>
      </>
    );
  } else if (activeFilial === "Fiduciaria") {
    content = (
      <>
        <SectionLabel>Accesos rápidos</SectionLabel>
        <QuickActionsRow items={[["receipt", "Estado de cuenta", openEstadoCuenta, "#2F6FE4"]]} />
        <SectionLabel>Mis proyectos</SectionLabel>
        {PROYECTOS.map((p) => (
          <Row key={p.name} icon="building" label={p.name} onClick={() => openInfo("Fiduciaria", p.name)} />
        ))}
      </>
    );
  } else if (activeFilial === "ARS") {
    content = (
      <>
        <SectionLabel>Accesos rápidos</SectionLabel>
        <QuickActionsRow items={[
          ["shieldplus", "Coberturas del PDSS", () => openCoberturasDetalle("PDSS"), "#0EA5A5"],
          ["network", "Solicitar traspaso", openArsTraspaso, "#7C5CFC"],
        ]} />
        <SectionLabel>Consulta de afiliados</SectionLabel>
        {[TITULAR_NOMBRE, ...dependientes].map((d) => (
          <Row key={d} icon="user" label={d} onClick={() => openAfiliadoDetalle(d, "ars")} />
        ))}
      </>
    );
  } else if (activeFilial === "Asistencia") {
    content = (
      <>
        <SectionLabel>Accesos rápidos</SectionLabel>
        <QuickActionsRow items={[
          ["car", "Asistencia vehicular", () => openAsistenciaSolicitud("vehicular"), "#E5484D"],
          ["home", "Asistencia de hogar", () => openAsistenciaSolicitud("hogar"), "#E8871E"],
        ]} />
        <SectionLabel>Mis asistencias</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 10 }}>
          {asistenciaProducts.map((p) => (
            <Tile
              key={p.key}
              product={p}
              onClick={() => (p.noContratado ? openCotizar(p.key) : openInfo("Asistencia", p.key))}
            />
          ))}
        </div>
      </>
    );
  } else {
    content = (
      <div style={{ textAlign: "center", padding: "50px 16px" }}>
        <Icon name="sparkles" size={34} color="var(--accent)" />
        <div style={{ fontSize: 15, fontWeight: 700, marginTop: 14 }}>Próximamente</div>
        <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 8, maxWidth: 240, marginLeft: "auto", marginRight: "auto" }}>
          Estamos preparando {activeFilial} para que pronto puedas acceder desde aquí.
        </div>
      </div>
    );
  }

  return content;
}
