import {
  initialProducts, initialAsistenciaProducts, INITIAL_DEPENDIENTES,
  initialReembolsos, initialAutorizaciones,
  AFILIADOS_SALUD_INFO, AFILIADOS_ARS_USADO,
  FONDOS, PROYECTOS, ESTADO_CUENTA, TRASPASO_ARS_PENDIENTE,
  TITULAR_NOMBRE,
} from "./data";

// Datos simulados de clientes para la consola de escritorio (servicio al cliente,
// calle, sucursales y backoffice). No hay backend: cada cliente trae su propio
// paquete de productos, afiliados y trámites con la misma forma de datos que usa
// la app móvil, para poder reutilizar sus mismas pantallas de consulta.

export const CLIENTES = [
  {
    id: "CLI-1001",
    cedula: "001-1234567-8",
    nombre: TITULAR_NOMBRE,
    telefono: "809-555-0101",
    correo: "carlos.moreno@correo.com",
    contrato: "03003780-28817",
    afiliadoDesde: "01/02/2024",
    intermediarioId: "INT-01",
    products: initialProducts(),
    asistenciaProducts: initialAsistenciaProducts(),
    dependientes: INITIAL_DEPENDIENTES,
    reembolsos: initialReembolsos(),
    autorizaciones: initialAutorizaciones(),
    afiliadosSalud: AFILIADOS_SALUD_INFO,
    afiliadosArsUsado: AFILIADOS_ARS_USADO,
    fondos: FONDOS,
    proyectos: PROYECTOS,
    estadoCuenta: ESTADO_CUENTA,
    traspasoArs: TRASPASO_ARS_PENDIENTE,
  },
  {
    id: "CLI-1002",
    cedula: "001-2345678-9",
    nombre: "María Isabel Ramírez Cruz",
    telefono: "809-555-0212",
    correo: "maria.ramirez@correo.com",
    contrato: "03004521-11029",
    afiliadoDesde: "15/06/2022",
    intermediarioId: "INT-01",
    products: [
      { key: "salud", label: "Salud", plan: "Plan Esencial", sub: "Plan Esencial, 1 dependiente", icon: "stethoscope", renovacion: "05/04/2027", primaActual: 21000, primaRenovacion: 23500, montoPendiente: 1958 },
      { key: "auto", label: "Auto", sub: "Básico, Kia Rio 2019", icon: "car", plan: "Básico", vehiculos: [{ marca: "Kia", modelo: "Rio", anio: "2019", placa: "A987654", color: "Rojo" }], renovacion: "12/12/2026", primaActual: 15800, primaRenovacion: 16900, montoPendiente: 1408 },
      { key: "viaje", label: "Seguro de Viaje", sub: "No contratado", icon: "send", noContratado: true },
    ],
    asistenciaProducts: [
      { key: "goldassist", label: "Gold Assist", sub: "No contratado", icon: "shield", noContratado: true },
      { key: "asistenciahogar", label: "Asistencia Hogar", sub: "No contratado", icon: "home", noContratado: true },
    ],
    dependientes: ["Sofía Ramírez Cruz"],
    reembolsos: [
      { fecha: "01/08/2026", concepto: "Consulta médico general", monto: "1,000 pesos", estado: "Aprobado" },
    ],
    autorizaciones: [],
    afiliadosSalud: {
      "María Isabel Ramírez Cruz": { parentesco: "Titular", edad: 35, limiteUsado: 42000, medicamentosUsado: 5200 },
      "Sofía Ramírez Cruz": { parentesco: "Hija", edad: 8, limiteUsado: 9000, medicamentosUsado: 1200, autorizaciones: [], reembolsos: [] },
    },
    afiliadosArsUsado: {
      "María Isabel Ramírez Cruz": { limiteUsado: 20000, medicamentosUsado: 1800 },
      "Sofía Ramírez Cruz": { limiteUsado: 4000, medicamentosUsado: 600 },
    },
    fondos: [],
    proyectos: [],
    estadoCuenta: null,
    traspasoArs: null,
  },
  {
    id: "CLI-1003",
    cedula: "002-2345678-9",
    nombre: "Juan Carlos Peña Gómez",
    telefono: "809-555-0313",
    correo: "jc.pena@correo.com",
    contrato: "03005890-22040",
    afiliadoDesde: "20/09/2021",
    intermediarioId: "INT-02",
    products: [
      { key: "vida", label: "Vida Universal", sub: "3 millones asegurados", icon: "heart", plan: "Vida Universal", extra: "Monto asegurado: 3,000,000 pesos", renovacion: "18/02/2027", primaActual: 9600, primaRenovacion: 10100, montoPendiente: 0 },
      { key: "hogar", label: "GarantiCasa", sub: "Multiriesgo, Santiago", icon: "home", plan: "GarantiCasa Multiriesgo", extra: "Casa de 180 m², Santiago", renovacion: "22/05/2027", primaActual: 21000, primaRenovacion: 22500, montoPendiente: 1875 },
    ],
    asistenciaProducts: [
      { key: "goldassist", label: "Gold Assist", sub: "Activo", icon: "shield" },
      { key: "asistenciahogar", label: "Asistencia Hogar", sub: "No contratado", icon: "home", noContratado: true },
    ],
    dependientes: [],
    reembolsos: [],
    autorizaciones: [],
    afiliadosSalud: {},
    afiliadosArsUsado: {
      "Juan Carlos Peña Gómez": { limiteUsado: 0, medicamentosUsado: 0 },
    },
    fondos: [],
    proyectos: [],
    estadoCuenta: null,
    traspasoArs: null,
  },
  {
    id: "CLI-1004",
    cedula: "003-3456789-0",
    nombre: "Ana Lucía Fernández Solano",
    telefono: "809-555-0414",
    correo: "ana.fernandez@correo.com",
    contrato: "03006123-33051",
    afiliadoDesde: "10/01/2020",
    intermediarioId: "INT-02",
    products: [
      { key: "salud", label: "Salud", plan: "Plan Exclusivo", sub: "Plan Exclusivo, 0 dependientes", icon: "stethoscope", renovacion: "30/03/2027", primaActual: 34000, primaRenovacion: 37500, montoPendiente: 0 },
    ],
    asistenciaProducts: [
      { key: "goldassist", label: "Gold Assist", sub: "No contratado", icon: "shield", noContratado: true },
      { key: "asistenciahogar", label: "Asistencia Hogar", sub: "Activo", icon: "home" },
    ],
    dependientes: [],
    reembolsos: [],
    autorizaciones: [],
    afiliadosSalud: {
      "Ana Lucía Fernández Solano": { parentesco: "Titular", edad: 45, limiteUsado: 60000, medicamentosUsado: 8000 },
    },
    afiliadosArsUsado: {
      "Ana Lucía Fernández Solano": { limiteUsado: 30000, medicamentosUsado: 3000 },
    },
    fondos: [
      { key: "renta-fija", name: "Fondo Renta Fija Universal", invertido: true, saldo: 1250000, fechaInicio: "05/2019", rendimientoAnual: "6.2%", perfilRiesgo: "Conservador", montoMinimo: 5000, comision: "1.5% anual sobre saldo administrado", descripcion: "Invierte en instrumentos de renta fija dominicanos (certificados y bonos) buscando estabilidad y liquidez.", rendimientoHistorico: [["2023", "5.8%"], ["2024", "6.0%"], ["2025", "6.2%"]] },
      { key: "crecimiento", name: "Fondo Crecimiento Universal", invertido: true, saldo: 680000, fechaInicio: "02/2022", rendimientoAnual: "11.4%", perfilRiesgo: "Agresivo", montoMinimo: 25000, comision: "2.5% anual sobre saldo administrado", descripcion: "Enfocado en renta variable con mayor potencial de crecimiento a largo plazo y mayor volatilidad.", rendimientoHistorico: [["2023", "9.8%"], ["2024", "10.6%"], ["2025", "11.4%"]] },
    ],
    proyectos: [
      { name: "Residencial Vista Verde, apto 301", rows: [["Estado", "Entregado"], ["Entrega", "2023"], ["Contrato", "FID-2019-0087"]] },
    ],
    estadoCuenta: {
      proyecto: "Residencial Vista Verde, apto 301",
      saldoPendiente: "0 pesos",
      pagos: [["10/03/2019", "Inicial", "300,000 pesos"], ["10/06/2023", "Cuota final", "1,200,000 pesos"]],
    },
    traspasoArs: null,
  },
  {
    id: "CLI-1005",
    cedula: "004-4567890-1",
    nombre: "Luis Miguel Rodríguez Tejada",
    telefono: "809-555-0515",
    correo: "luis.rodriguez@correo.com",
    contrato: "03007456-44062",
    afiliadoDesde: "05/11/2023",
    intermediarioId: null,
    products: [
      { key: "salud", label: "Salud", sub: "No contratado", icon: "stethoscope", noContratado: true },
      { key: "auto", label: "Auto", sub: "No contratado", icon: "car", noContratado: true },
      { key: "vida", label: "Vida Universal", sub: "No contratado", icon: "heart", noContratado: true },
      { key: "hogar", label: "GarantiCasa", sub: "No contratado", icon: "home", noContratado: true },
      { key: "garantivilla", label: "GarantiVilla", sub: "No contratado", icon: "building", noContratado: true },
      { key: "viaje", label: "Seguro de Viaje", sub: "No contratado", icon: "send", noContratado: true },
    ],
    asistenciaProducts: [
      { key: "goldassist", label: "Gold Assist", sub: "No contratado", icon: "shield", noContratado: true },
      { key: "asistenciahogar", label: "Asistencia Hogar", sub: "Activo", icon: "home" },
    ],
    dependientes: ["Valentina Rodríguez Ureña"],
    reembolsos: [],
    autorizaciones: [],
    afiliadosSalud: {},
    afiliadosArsUsado: {
      "Luis Miguel Rodríguez Tejada": { limiteUsado: 120000, medicamentosUsado: 9500 },
      "Valentina Rodríguez Ureña": { limiteUsado: 15000, medicamentosUsado: 2000 },
    },
    fondos: [],
    proyectos: [],
    estadoCuenta: null,
    traspasoArs: {
      numeroSolicitud: "TR-2026-05127",
      fechaSolicitud: "20/08/2026",
      estado: "En proceso de validación",
      ultimaActualizacion: "01/09/2026",
      siguientePaso: "Un asesor te contactará para completar la documentación requerida del traspaso.",
    },
  },
  {
    id: "CLI-1006",
    cedula: "005-5678901-2",
    nombre: "Carmen Rosa Objío Vargas",
    telefono: "809-555-0616",
    correo: "carmen.objio@correo.com",
    contrato: "03008789-55073",
    afiliadoDesde: "12/07/2022",
    intermediarioId: "INT-03",
    products: [
      { key: "auto", label: "Auto", sub: "Súper Full, Honda CR-V 2022", icon: "car", plan: "Súper Full", vehiculos: [{ marca: "Honda", modelo: "CR-V", anio: "2022", placa: "A456789", color: "Blanco" }], renovacion: "14/09/2026", primaActual: 45000, primaRenovacion: 48200, montoPendiente: 4017 },
      { key: "garantivilla", label: "GarantiVilla", sub: "Villa, Las Terrenas", icon: "building", plan: "GarantiVilla", extra: "Villa vacacional, Las Terrenas, Samaná", renovacion: "08/12/2026", primaActual: 31000, primaRenovacion: 33500, montoPendiente: 2792 },
      { key: "viaje", label: "Seguro de Viaje", sub: "No contratado", icon: "send", noContratado: true },
    ],
    asistenciaProducts: [
      { key: "goldassist", label: "Gold Assist", sub: "Activo", icon: "shield" },
      { key: "asistenciahogar", label: "Asistencia Hogar", sub: "No contratado", icon: "home", noContratado: true },
    ],
    dependientes: [],
    reembolsos: [],
    autorizaciones: [],
    afiliadosSalud: {},
    afiliadosArsUsado: {
      "Carmen Rosa Objío Vargas": { limiteUsado: 18000, medicamentosUsado: 1200 },
    },
    fondos: [],
    proyectos: [],
    estadoCuenta: null,
    traspasoArs: null,
  },
  {
    id: "CLI-1007",
    cedula: "006-6789012-3",
    nombre: "Pedro Antonio Cabrera Núñez",
    telefono: "809-555-0717",
    correo: "pedro.cabrera@correo.com",
    contrato: "03009012-66084",
    afiliadoDesde: "03/03/2019",
    intermediarioId: "INT-03",
    products: [
      { key: "salud", label: "Salud", plan: "Plan Alpha", sub: "Plan Alpha, 2 dependientes", icon: "stethoscope", renovacion: "25/10/2026", primaActual: 38000, primaRenovacion: 41500, montoPendiente: 3458 },
    ],
    asistenciaProducts: [
      { key: "goldassist", label: "Gold Assist", sub: "No contratado", icon: "shield", noContratado: true },
      { key: "asistenciahogar", label: "Asistencia Hogar", sub: "No contratado", icon: "home", noContratado: true },
    ],
    dependientes: ["Katherine Cabrera Solís", "Pedro Antonio Cabrera Solís Jr."],
    reembolsos: [
      { fecha: "18/08/2026", concepto: "Terapia física", monto: "2,000 pesos", estado: "En revisión" },
    ],
    autorizaciones: [
      { fecha: "05/08/2026", concepto: "Resonancia magnética de rodilla", estado: "Aprobada", valorAutorizado: "RD$ 9,200", prestador: "Centro de Diagnóstico por Imágenes CEDIMAT" },
    ],
    afiliadosSalud: {
      "Pedro Antonio Cabrera Núñez": { parentesco: "Titular", edad: 44, limiteUsado: 210000, medicamentosUsado: 22000 },
      "Katherine Cabrera Solís": { parentesco: "Cónyuge", edad: 41, limiteUsado: 55000, medicamentosUsado: 8700, autorizaciones: [], reembolsos: [{ fecha: "18/08/2026", concepto: "Terapia física", monto: "2,000 pesos", estado: "En revisión" }] },
      "Pedro Antonio Cabrera Solís Jr.": { parentesco: "Hijo", edad: 14, limiteUsado: 12000, medicamentosUsado: 1900, autorizaciones: [{ fecha: "05/08/2026", concepto: "Resonancia magnética de rodilla", estado: "Aprobada", valorAutorizado: "RD$ 9,200", prestador: "Centro de Diagnóstico por Imágenes CEDIMAT" }], reembolsos: [] },
    },
    afiliadosArsUsado: {
      "Pedro Antonio Cabrera Núñez": { limiteUsado: 90000, medicamentosUsado: 6000 },
      "Katherine Cabrera Solís": { limiteUsado: 25000, medicamentosUsado: 2100 },
      "Pedro Antonio Cabrera Solís Jr.": { limiteUsado: 6000, medicamentosUsado: 900 },
    },
    fondos: [],
    proyectos: [],
    estadoCuenta: null,
    traspasoArs: null,
  },
  {
    id: "CLI-1008",
    cedula: "007-7890123-4",
    nombre: "Rosa Elena Disla Marte",
    telefono: "809-555-0818",
    correo: "rosa.disla@correo.com",
    contrato: "03010345-77095",
    afiliadoDesde: "22/02/2021",
    intermediarioId: null,
    products: [
      { key: "vida", label: "Vida Universal", sub: "8 millones asegurados", icon: "heart", plan: "Vida Universal", extra: "Monto asegurado: 8,000,000 pesos", renovacion: "11/01/2027", primaActual: 19500, primaRenovacion: 20800, montoPendiente: 0 },
    ],
    asistenciaProducts: [
      { key: "goldassist", label: "Gold Assist", sub: "No contratado", icon: "shield", noContratado: true },
      { key: "asistenciahogar", label: "Asistencia Hogar", sub: "No contratado", icon: "home", noContratado: true },
    ],
    dependientes: [],
    reembolsos: [],
    autorizaciones: [],
    afiliadosSalud: {},
    afiliadosArsUsado: {
      "Rosa Elena Disla Marte": { limiteUsado: 8000, medicamentosUsado: 500 },
    },
    fondos: [
      { key: "balanceado", name: "Fondo Balanceado Universal", invertido: true, saldo: 310000, fechaInicio: "07/2023", rendimientoAnual: "8.1%", perfilRiesgo: "Moderado", montoMinimo: 10000, comision: "2.0% anual sobre saldo administrado", descripcion: "Combina renta fija y variable buscando un balance entre estabilidad y crecimiento a mediano plazo.", rendimientoHistorico: [["2023", "7.2%"], ["2024", "7.9%"], ["2025", "8.1%"]] },
    ],
    proyectos: [],
    estadoCuenta: null,
    traspasoArs: null,
  },
  {
    id: "CLI-1009",
    cedula: "001-1425156-4",
    nombre: "Nelly Cruceta Feliz",
    telefono: "809-555-0919",
    correo: "nelly.cruceta@correo.com",
    contrato: "03011678-88106",
    afiliadoDesde: "14/04/2023",
    intermediarioId: "INT-03",
    products: [
      { key: "salud", label: "Salud", plan: "Plan Exclusivo", sub: "Plan Exclusivo, 0 dependientes", icon: "stethoscope", renovacion: "20/02/2027", primaActual: 39500, primaRenovacion: 43500, montoPendiente: 3300 },
      { key: "auto", label: "Auto", sub: "Súper Full, Mercedes-Benz S600 2026", icon: "car", plan: "Súper Full", vehiculos: [{ marca: "Mercedes-Benz", modelo: "Clase S600", anio: "2026", placa: "A778899", color: "Negro" }], renovacion: "05/07/2027", primaActual: 210000, primaRenovacion: 226000, montoPendiente: 17500 },
    ],
    asistenciaProducts: [
      { key: "goldassist", label: "Gold Assist", sub: "No contratado", icon: "shield", noContratado: true },
      { key: "asistenciahogar", label: "Asistencia Hogar", sub: "No contratado", icon: "home", noContratado: true },
    ],
    dependientes: [],
    reembolsos: [],
    autorizaciones: [],
    afiliadosSalud: {
      "Nelly Cruceta Feliz": { parentesco: "Titular", edad: 52, limiteUsado: 85000, medicamentosUsado: 9500 },
    },
    afiliadosArsUsado: {
      "Nelly Cruceta Feliz": { limiteUsado: 40000, medicamentosUsado: 3500 },
    },
    fondos: [
      { key: "renta-fija", name: "Fondo Renta Fija Universal", invertido: true, saldo: 15000000, fechaInicio: "03/2020", rendimientoAnual: "6.2%", perfilRiesgo: "Conservador", montoMinimo: 5000, comision: "1.5% anual sobre saldo administrado", descripcion: "Invierte en instrumentos de renta fija dominicanos (certificados y bonos) buscando estabilidad y liquidez.", rendimientoHistorico: [["2023", "5.8%"], ["2024", "6.0%"], ["2025", "6.2%"]] },
      { key: "crecimiento", name: "Fondo Crecimiento Universal", invertido: true, saldo: 50000000, fechaInicio: "01/2018", rendimientoAnual: "11.4%", perfilRiesgo: "Agresivo", montoMinimo: 25000, comision: "2.5% anual sobre saldo administrado", descripcion: "Enfocado en renta variable con mayor potencial de crecimiento a largo plazo y mayor volatilidad.", rendimientoHistorico: [["2023", "9.8%"], ["2024", "10.6%"], ["2025", "11.4%"]] },
    ],
    proyectos: [
      { name: "Villa Punta Espada, Cap Cana", rows: [["Estado", "En construcción"], ["Entrega estimada", "2027"], ["Contrato", "FID-2022-0356"]] },
    ],
    estadoCuenta: {
      proyecto: "Villa Punta Espada, Cap Cana",
      saldoPendiente: "12,500,000 pesos",
      pagos: [["15/03/2022", "Inicial", "20,000,000 pesos"], ["10/01/2025", "Avance de obra", "15,000,000 pesos"]],
    },
    traspasoArs: null,
  },
];

function normalizar(texto) {
  return (texto || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function getClientePorId(id) {
  return CLIENTES.find((c) => c.id === id) || null;
}

export function buscarClientes(query) {
  const q = normalizar(query).trim();
  if (!q) return [];
  return CLIENTES.filter((c) => {
    if (normalizar(c.nombre).includes(q)) return true;
    if (normalizar(c.cedula).includes(q)) return true;
    if (normalizar(c.contrato).includes(q)) return true;
    if (normalizar(c.telefono).includes(q)) return true;
    if (c.products.some((p) => normalizar(p.label).includes(q) || normalizar(p.plan).includes(q))) return true;
    return false;
  });
}

export function polizasActivas(cliente) {
  return cliente.products.filter((p) => !p.noContratado).length;
}

// ---------- Facturación, pagos y verificación de identidad ----------
// Derivados en tiempo real a partir de los productos de cada cliente (prima
// vigente / monto pendiente), sin necesidad de datos adicionales por cliente.

const HOY = new Date(2026, 8, 10);

function formatearFecha(date) {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${d}/${m}/${date.getFullYear()}`;
}
function sumarDias(date, dias) {
  const d = new Date(date);
  d.setDate(d.getDate() + dias);
  return d;
}
function parsearFecha(str) {
  const [d, m, y] = str.split("/").map(Number);
  return new Date(y, m - 1, d);
}

export function getFacturas(cliente) {
  const digitos = (cliente.contrato || "").replace(/\D/g, "").slice(-6) || "000000";
  const items = [...cliente.products, ...(cliente.asistenciaProducts || [])]
    .filter((p) => !p.noContratado && p.primaActual != null);

  return items.map((p, i) => {
    const emision = sumarDias(HOY, -10 - i * 10);
    const vencimiento = sumarDias(emision, 30);
    const saldo = p.montoPendiente || 0;
    let estado;
    if (saldo === 0) estado = "Pagada";
    else if (vencimiento < HOY) estado = "Vencida";
    else estado = "Pendiente";
    return {
      numero: `FAC-${digitos}-${String(i + 1).padStart(3, "0")}`,
      producto: p.label,
      fechaEmision: formatearFecha(emision),
      fechaVencimiento: formatearFecha(vencimiento),
      monto: p.primaActual,
      saldo,
      estado,
    };
  });
}

const METODOS_PAGO = ["Tarjeta de crédito", "Débito bancario automático", "Transferencia bancaria"];

export function getPagos(cliente) {
  const idNum = (cliente.id || "").replace(/\D/g, "");
  return getFacturas(cliente)
    .map((f, i) => {
      const pagado = f.monto - f.saldo;
      if (pagado <= 0) return null;
      const fechaPago = sumarDias(parsearFecha(f.fechaEmision), 6);
      return {
        fecha: formatearFecha(fechaPago),
        monto: pagado,
        metodo: METODOS_PAGO[i % METODOS_PAGO.length],
        factura: f.numero,
        referencia: `REF-${idNum}${1000 + i}`,
      };
    })
    .filter(Boolean)
    .sort((a, b) => parsearFecha(b.fecha) - parsearFecha(a.fecha));
}

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export function getPreguntasVerificacion(cliente) {
  const [, mes, anio] = (cliente.afiliadoDesde || "").split("/");
  const mesNombre = mes ? MESES[Number(mes) - 1] : null;
  return [
    { pregunta: "¿Cuáles son los últimos 4 dígitos de su cédula?", respuesta: cliente.cedula.replace(/\D/g, "").slice(-4) },
    { pregunta: "¿Cuál es el correo electrónico registrado en su cuenta?", respuesta: cliente.correo },
    { pregunta: "¿En qué mes y año se afilió a Universal?", respuesta: mesNombre ? `${mesNombre} ${anio}` : cliente.afiliadoDesde },
    { pregunta: "¿Cuál es el número de teléfono registrado?", respuesta: cliente.telefono },
  ];
}
