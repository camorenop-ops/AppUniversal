import { useState } from "react";
import { Icon } from "./Icon";
import { COBERTURAS_DETALLE } from "../data/data";

export function CoberturasAccordion({ planKey, initialOpenFirst = false }) {
  const data = COBERTURAS_DETALLE[planKey] || {};
  const keys = Object.keys(data);
  const [openKey, setOpenKey] = useState(initialOpenFirst ? keys[0] : null);

  return (
    <>
      {keys.map((catKey) => {
        const [ic, nombre] = catKey.split("|");
        const open = openKey === catKey;
        return (
          <div className="cat-group" key={catKey}>
            <div className="cat-header" onClick={() => setOpenKey(open ? null : catKey)}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 600 }}>
                <Icon name={ic} size={15} color="var(--accent)" />
                {nombre}
              </span>
              <Icon name={open ? "chevronup" : "chevrondown"} size={14} color="var(--text-muted)" />
            </div>
            {open && data[catKey].map((r, i) => (
              <div className="cat-body-row" key={i}>
                <span className="lbl">{r[0]}</span>
                <span className="val">{r[1]}</span>
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}
