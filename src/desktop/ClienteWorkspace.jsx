import { AppProvider } from "../context/AppContext";
import { PhoneFrame } from "../components/PhoneFrame";
import { polizasActivas } from "../data/clientes";
import { getIntermediarioPorId } from "../data/intermediarios";

const money = (n) => `RD$ ${Number(n || 0).toLocaleString("es-DO")}`;

export function ClienteWorkspace({ cliente, onAbrirIntermediario, onVolver }) {
  const intermediario = cliente.intermediarioId ? getIntermediarioPorId(cliente.intermediarioId) : null;
  const activas = polizasActivas(cliente);
  const primaTotal = cliente.products.filter((p) => !p.noContratado && p.primaActual).reduce((s, p) => s + p.primaActual, 0);
  const pendiente = cliente.products.filter((p) => !p.noContratado && p.montoPendiente).reduce((s, p) => s + p.montoPendiente, 0);
  const enRevision = [...cliente.reembolsos, ...cliente.autorizaciones].filter((r) => r.estado === "En revisión").length;

  const initialData = { ...cliente, titular: cliente.nombre };

  return (
    <div>
      <div className="agent-clientheader">
        <div>
          <h2>{cliente.nombre}</h2>
          <div className="meta">
            <span>Cédula: <strong>{cliente.cedula}</strong></span>
            <span>Contrato: <strong>{cliente.contrato}</strong></span>
            <span>Cliente desde: <strong>{cliente.afiliadoDesde}</strong></span>
            <span>Tel: <strong>{cliente.telefono}</strong></span>
            <span>Correo: <strong>{cliente.correo}</strong></span>
            <span>
              Intermediario:{" "}
              {intermediario ? (
                <span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 700 }} onClick={() => onAbrirIntermediario(intermediario.id)}>
                  {intermediario.nombre}
                </span>
              ) : (
                <strong>Canal directo</strong>
              )}
            </span>
          </div>
        </div>
        <button onClick={onVolver}>Nueva búsqueda</button>
      </div>

      <div className="agent-kpis">
        <div className="agent-kpi"><div className="n">{activas}</div><div className="l">Pólizas activas</div></div>
        <div className="agent-kpi"><div className="n">{money(primaTotal)}</div><div className="l">Prima vigente total</div></div>
        <div className="agent-kpi"><div className="n">{money(pendiente)}</div><div className="l">Monto pendiente de pago</div></div>
        <div className="agent-kpi"><div className="n">{enRevision}</div><div className="l">Trámites en revisión</div></div>
      </div>

      <div className="agent-note">
        Esta es la misma app que usa el cliente: el asesor puede consultar y ejecutar aquí cualquier trámite (cotizar, comprar, reclamos, reembolsos, autorizaciones, renovaciones, endosos, pagos, telemedicina, traspaso de ARS) en su nombre.
      </div>

      <div className="agent-phone-stage">
        <AppProvider key={cliente.id} initialData={initialData}>
          <PhoneFrame />
        </AppProvider>
      </div>
    </div>
  );
}
