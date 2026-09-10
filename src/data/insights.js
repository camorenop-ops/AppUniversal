import { FONDOS, PROYECTOS, PRODUCT_TITLES } from "./data";

// Puntos de contacto derivados del estado actual de la app (sin datos inventados):
// se leen directamente de products / asistenciaProducts / FONDOS, ya presentes en data.js.

export function getGaps(products, asistenciaProducts) {
  const gaps = [];

  const viaje = products.find((p) => p.key === "viaje");
  if (viaje && viaje.noContratado) {
    gaps.push({
      key: "viaje",
      icon: "send",
      titulo: "Aún no tienes Seguro de Viaje",
      texto: "Cotízalo en minutos para tu próximo vuelo o cita internacional.",
      accion: "cotizar",
      color: "#E8871E",
    });
  }

  const asistHogar = asistenciaProducts.find((p) => p.key === "asistenciahogar");
  if (asistHogar && asistHogar.noContratado) {
    gaps.push({
      key: "asistenciahogar",
      icon: "home",
      titulo: "Activa Asistencia Hogar",
      texto: "Plomería, electricidad y cerrajería cubiertas las 24 horas.",
      accion: "cotizar",
      color: "#E8871E",
    });
  }

  const fondosSinInvertir = FONDOS.filter((f) => !f.invertido);
  if (fondosSinInvertir.length > 0) {
    const f = fondosSinInvertir[0];
    gaps.push({
      key: "fondo-" + f.key,
      icon: "chart",
      titulo: `Tienes RD$0 en ${f.name}`,
      texto: `Rendimiento histórico ${f.rendimientoAnual} anual · perfil ${f.perfilRiesgo}.`,
      accion: "fondo",
      fondoKey: f.key,
      color: "#154C8C",
    });
  }

  if (PROYECTOS.length > 0) {
    gaps.push({
      key: "endoso",
      icon: "filedesc",
      titulo: "Pon tu póliza a nombre del banco",
      texto: "Endosa tu seguro de hogar o auto si tienes un préstamo vigente.",
      accion: "endoso",
      color: "#7C5CFC",
    });
  }

  return gaps;
}

export function getEcosistemaResumen(products, asistenciaProducts) {
  const areas = [
    { key: "Seguros", label: "Seguros", activo: products.some((p) => !p.noContratado) },
    { key: "AFI", label: "AFI", activo: FONDOS.some((f) => f.invertido) },
    { key: "Fiduciaria", label: "Fiduciaria", activo: PROYECTOS.length > 0 },
    { key: "ARS", label: "ARS", activo: true }, // afiliación de salud obligatoria: el titular siempre está afiliado
    { key: "Asistencia", label: "Asistencia", activo: asistenciaProducts.some((p) => !p.noContratado) },
  ];
  const activas = areas.filter((a) => a.activo).length;
  return { areas, activas, total: areas.length };
}

function parseFechaDMY(fecha) {
  const [d, m, y] = fecha.split("/").map(Number);
  return new Date(y, m - 1, d);
}

export function getRenovacionMasProxima(products) {
  const conRenovacion = products.filter((p) => p.renovacion);
  if (conRenovacion.length === 0) return null;
  const ordenado = [...conRenovacion].sort((a, b) => parseFechaDMY(a.renovacion) - parseFechaDMY(b.renovacion));
  const proxima = ordenado[0];
  const dias = Math.round((parseFechaDMY(proxima.renovacion) - new Date()) / 86400000);
  return { producto: proxima, dias };
}

export function getTramitesActivos(products, reembolsos, autorizaciones) {
  const items = [];
  reembolsos.slice(0, 2).forEach((r) => items.push({
    key: "reembolso-" + r.fecha + r.concepto,
    icon: "receipt",
    titulo: r.concepto,
    sub: `Reembolso · ${r.monto}`,
    estado: r.estado,
    destino: "reembolsos",
  }));
  autorizaciones.slice(0, 1).forEach((a) => items.push({
    key: "autorizacion-" + a.fecha + a.concepto,
    icon: "shieldplus",
    titulo: a.concepto,
    sub: "Autorización",
    estado: a.estado,
    destino: "autorizaciones",
  }));
  const renovacion = getRenovacionMasProxima(products);
  if (renovacion && renovacion.dias <= 45) {
    items.push({
      key: "renovacion-" + renovacion.producto.key,
      icon: "refresh",
      titulo: `Renovación de ${PRODUCT_TITLES[renovacion.producto.key] || renovacion.producto.label}`,
      sub: renovacion.dias >= 0 ? `Vence en ${renovacion.dias} días` : "Vencida",
      estado: "En revisión",
      destino: "renovaciones",
    });
  }
  return items;
}

export function getNextBestAction(products, reembolsos, gaps) {
  const aprobado = reembolsos.find((r) => r.estado === "Aprobado");
  const renovacion = getRenovacionMasProxima(products);
  if (renovacion && renovacion.dias >= 0 && renovacion.dias <= 20) {
    return {
      tipo: "renovacion",
      titulo: `Tu póliza de ${PRODUCT_TITLES[renovacion.producto.key] || renovacion.producto.label} vence en ${renovacion.dias} días`,
      texto: "Revisa los beneficios de renovar y confirma el pago en dos pasos.",
      cta: "Ver renovación",
    };
  }
  if (aprobado) {
    return {
      tipo: "reembolso",
      titulo: `Tu reembolso de ${aprobado.monto} fue aprobado`,
      texto: `${aprobado.concepto} · listo para acreditarse a tu cuenta registrada.`,
      cta: "Ver reembolsos",
    };
  }
  if (gaps.length > 0) {
    return {
      tipo: "gap",
      titulo: gaps[0].titulo,
      texto: gaps[0].texto,
      cta: "Cotizar",
      gap: gaps[0],
    };
  }
  return {
    tipo: "info",
    titulo: "Todo está al día",
    texto: "No tienes trámites pendientes en este momento.",
    cta: null,
  };
}
