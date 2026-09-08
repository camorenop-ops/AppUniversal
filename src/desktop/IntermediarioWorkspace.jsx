import { Icon } from "../components/Icon";
import { SectionLabel } from "../components/UI";
import { polizasActivas } from "../data/clientes";
import { clientesDeIntermediario } from "../data/intermediarios";

export function IntermediarioWorkspace({ intermediario, onAbrirCliente, onVolver }) {
  const clientes = clientesDeIntermediario(intermediario.id);

  return (
    <div>
      <div className="agent-clientheader">
        <div>
          <h2>{intermediario.nombre}</h2>
          <div className="meta">
            <span>Código: <strong>{intermediario.codigo}</strong></span>
            <span>Tipo: <strong>{intermediario.tipo}</strong></span>
            <span>Tel: <strong>{intermediario.telefono}</strong></span>
            <span>Correo: <strong>{intermediario.correo}</strong></span>
          </div>
        </div>
        <button onClick={onVolver}>Nueva búsqueda</button>
      </div>

      <div className="agent-kpis">
        <div className="agent-kpi"><div className="n">{clientes.length}</div><div className="l">Clientes en cartera</div></div>
        <div className="agent-kpi">
          <div className="n">{clientes.reduce((s, c) => s + polizasActivas(c), 0)}</div>
          <div className="l">Pólizas activas</div>
        </div>
      </div>

      <SectionLabel>Cartera de clientes</SectionLabel>
      {clientes.length === 0 ? (
        <div className="agent-empty">Este intermediario no tiene clientes asignados.</div>
      ) : (
        <table className="agent-table">
          <thead>
            <tr><th>Cliente</th><th>Cédula</th><th>Contrato</th><th>Pólizas activas</th></tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id} onClick={() => onAbrirCliente(c.id)}>
                <td style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="user" size={15} color="var(--accent)" />{c.nombre}
                </td>
                <td>{c.cedula}</td>
                <td>{c.contrato}</td>
                <td>{polizasActivas(c)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
