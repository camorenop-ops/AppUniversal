import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icon";
import { BackHeader, SectionLabel, Row, AddRow, Chip } from "../components/UI";
import { BANCOS_RD, TIPOS_CUENTA_BANCARIA, DIAS_PAGO_DEBITO, PROYECTOS, FONDOS } from "../data/data";

function ConfirmarEliminar({ onCancelar, onEliminar }) {
  return (
    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
      <button onClick={onCancelar} style={{ padding: "6px 10px", fontSize: 11.5 }}>Cancelar</button>
      <button
        className="solid"
        onClick={onEliminar}
        style={{ padding: "6px 10px", fontSize: 11.5, background: "var(--danger)", borderColor: "var(--danger)" }}
      >
        Eliminar
      </button>
    </div>
  );
}

export function MetodosPagoScreen() {
  const { tarjetas, debitosAutomaticos, eliminarTarjeta, eliminarDebito, openAgregarTarjeta, openAgregarDebito } = useApp();
  const [confirmar, setConfirmar] = useState(null);

  return (
    <>
      <BackHeader title="Métodos de pago" />

      <SectionLabel>Tarjetas de crédito</SectionLabel>
      {tarjetas.length === 0 && (
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>No tienes tarjetas registradas.</div>
      )}
      {tarjetas.map((t) => (
        <div key={t.id} className="card" style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="creditcard" size={20} color="var(--accent)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{t.marca} terminada en {t.ultimos4}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Vence {t.vencimiento} · {t.titular}</div>
          </div>
          {confirmar?.tipo === "tarjeta" && confirmar.id === t.id ? (
            <ConfirmarEliminar onCancelar={() => setConfirmar(null)} onEliminar={() => { eliminarTarjeta(t.id); setConfirmar(null); }} />
          ) : (
            <span onClick={() => setConfirmar({ tipo: "tarjeta", id: t.id })} style={{ color: "var(--danger)", cursor: "pointer", flexShrink: 0 }}>
              <Icon name="trash" size={18} />
            </span>
          )}
        </div>
      ))}
      <AddRow icon="plus" label="Agregar tarjeta" onClick={openAgregarTarjeta} />

      <div style={{ marginTop: 18 }}>
        <SectionLabel>Débito bancario con descuento automático</SectionLabel>
      </div>
      {debitosAutomaticos.length === 0 && (
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>No tienes débitos automáticos registrados.</div>
      )}
      {debitosAutomaticos.map((d) => (
        <div key={d.id} className="card" style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="bank" size={20} color="var(--accent)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{d.productoLabel}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{d.filial} · {d.banco}, {d.tipoCuenta}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Se debita el día {d.diaPago} de cada mes</div>
          </div>
          {confirmar?.tipo === "debito" && confirmar.id === d.id ? (
            <ConfirmarEliminar onCancelar={() => setConfirmar(null)} onEliminar={() => { eliminarDebito(d.id); setConfirmar(null); }} />
          ) : (
            <span onClick={() => setConfirmar({ tipo: "debito", id: d.id })} style={{ color: "var(--danger)", cursor: "pointer", flexShrink: 0 }}>
              <Icon name="trash" size={18} />
            </span>
          )}
        </div>
      ))}
      <AddRow icon="plus" label="Agregar cuenta con débito" onClick={openAgregarDebito} />
    </>
  );
}

export function AgregarTarjetaScreen() {
  const { tarjetaForm, setTarjetaField, guardarTarjeta, goBack } = useApp();
  const numero = tarjetaForm.numero.replace(/\s/g, "");
  const listo = numero.length >= 12 && !!tarjetaForm.titular && !!tarjetaForm.vencimiento;

  return (
    <>
      <BackHeader title="Agregar tarjeta" />
      <SectionLabel>Número de tarjeta</SectionLabel>
      <input
        className="u-input"
        placeholder="0000 0000 0000 0000"
        inputMode="numeric"
        value={tarjetaForm.numero}
        onChange={(e) => setTarjetaField("numero", e.target.value)}
      />
      <SectionLabel>Nombre del titular</SectionLabel>
      <input
        className="u-input"
        placeholder="Como aparece en la tarjeta"
        value={tarjetaForm.titular}
        onChange={(e) => setTarjetaField("titular", e.target.value)}
      />
      <SectionLabel>Vencimiento</SectionLabel>
      <input
        className="u-input"
        placeholder="MM/AA"
        value={tarjetaForm.vencimiento}
        onChange={(e) => setTarjetaField("vencimiento", e.target.value)}
      />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={goBack} style={{ flex: 1 }}>Atrás</button>
        <button className="solid" onClick={guardarTarjeta} disabled={!listo} style={{ flex: 2 }}>Guardar tarjeta</button>
      </div>
    </>
  );
}

export function TarjetaAgregadaScreen() {
  const { volverAMetodosPago } = useApp();
  return (
    <div style={{ textAlign: "center", padding: "30px 10px" }}>
      <Icon name="circlecheck" size={40} color="var(--success-text)" />
      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 14 }}>Tarjeta agregada</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>Ya puedes usarla para pagar cualquiera de tus productos.</div>
      <button className="solid" onClick={volverAMetodosPago} style={{ width: "100%", marginTop: 24 }}>Volver a métodos de pago</button>
    </div>
  );
}

export function AgregarDebitoDestinoScreen() {
  const { products, elegirDestinoDebito } = useApp();
  const polizas = products.filter((p) => !p.noContratado);
  const fondosInvertidos = FONDOS.filter((f) => f.invertido);

  return (
    <>
      <BackHeader title="¿A qué deseas aplicar el débito?" />
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>Elige el producto al que se aplicará el descuento automático.</div>
      <SectionLabel>Seguros</SectionLabel>
      {polizas.map((p) => (
        <Row key={p.key} icon={p.icon} label={p.label} onClick={() => elegirDestinoDebito("Seguros", p.key, p.label)} />
      ))}
      <SectionLabel>Fiduciaria</SectionLabel>
      {PROYECTOS.map((proy) => (
        <Row key={proy.name} icon="building" label={proy.name} onClick={() => elegirDestinoDebito("Fiduciaria", proy.name, proy.name)} />
      ))}
      <SectionLabel>AFI</SectionLabel>
      {fondosInvertidos.map((f) => (
        <Row key={f.key} icon="chart" label={f.name} onClick={() => elegirDestinoDebito("AFI", f.key, f.name)} />
      ))}
    </>
  );
}

export function AgregarDebitoDetalleScreen() {
  const { debitoForm, setDebitoField, guardarDebito, goBack } = useApp();
  const listo = !!(debitoForm.banco && debitoForm.tipoCuenta && debitoForm.numeroCuenta && debitoForm.diaPago);

  return (
    <>
      <BackHeader title="Débito bancario automático" />
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Aplicará a</div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{debitoForm.productoLabel}</div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>{debitoForm.filial}</div>
      </div>
      <SectionLabel>Banco</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
        {BANCOS_RD.map((b) => (
          <Chip key={b} label={b} on={debitoForm.banco === b} onClick={() => setDebitoField("banco", b)} />
        ))}
      </div>
      <SectionLabel>Tipo de cuenta</SectionLabel>
      <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
        {TIPOS_CUENTA_BANCARIA.map((t) => (
          <Chip key={t} label={t} on={debitoForm.tipoCuenta === t} onClick={() => setDebitoField("tipoCuenta", t)} />
        ))}
      </div>
      <SectionLabel>Número de cuenta</SectionLabel>
      <input
        className="u-input"
        placeholder="Ej. 100-2345678-9"
        value={debitoForm.numeroCuenta}
        onChange={(e) => setDebitoField("numeroCuenta", e.target.value)}
      />
      <SectionLabel>Día del mes para hacer el pago</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
        {DIAS_PAGO_DEBITO.map((dia) => (
          <Chip key={dia} label={`Día ${dia}`} on={debitoForm.diaPago === dia} onClick={() => setDebitoField("diaPago", dia)} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={goBack} style={{ flex: 1 }}>Atrás</button>
        <button className="solid" onClick={guardarDebito} disabled={!listo} style={{ flex: 2 }}>Registrar débito</button>
      </div>
    </>
  );
}

export function DebitoRegistradoScreen() {
  const { debitoForm, volverAMetodosPago } = useApp();
  return (
    <div style={{ textAlign: "center", padding: "30px 10px" }}>
      <Icon name="circlecheck" size={40} color="var(--success-text)" />
      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 14 }}>Débito automático registrado</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
        Se debitará de tu cuenta en {debitoForm.banco} el día {debitoForm.diaPago} de cada mes para el pago de {debitoForm.productoLabel}.
      </div>
      <button className="solid" onClick={volverAMetodosPago} style={{ width: "100%", marginTop: 24 }}>Volver a métodos de pago</button>
    </div>
  );
}
