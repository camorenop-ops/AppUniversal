import { createContext, useContext, useState } from "react";
import {
  initialProducts,
  initialAsistenciaProducts,
  INITIAL_DEPENDIENTES,
  initialReembolsos,
  initialAutorizaciones,
  PRODUCT_TITLES,
  CATEGORIA,
  ASISTENCIA_INFO,
  UBICACIONES_MUESTRA,
  TITULAR_NOMBRE,
} from "../data/data";

function avanzarUnAnio(fecha) {
  const [d, m, y] = fecha.split("/");
  return `${d}/${m}/${Number(y) + 1}`;
}

const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

function findIn(list, key) {
  return list.find((p) => p.key === key);
}

export function AppProvider({ children }) {
  const [stack, setStack] = useState([]);
  const [current, setCurrent] = useState({ view: "tab", tab: "home" });
  const [activeTab, setActiveTab] = useState("home");
  const [activeFilial, setActiveFilial] = useState("Seguros");
  const [memberIdx, setMemberIdx] = useState(0);

  const [products, setProducts] = useState(initialProducts);
  const [asistenciaProducts, setAsistenciaProducts] = useState(initialAsistenciaProducts);
  const [dependientes, setDependientes] = useState(INITIAL_DEPENDIENTES);
  const [reembolsos, setReembolsos] = useState(initialReembolsos);
  const [autorizaciones, setAutorizaciones] = useState(initialAutorizaciones);
  const [especialidadFiltro, setEspecialidadFiltro] = useState("Todas");

  const [cot, setCot] = useState(null);
  const [reembolsoForm, setReembolsoForm] = useState(null);
  const [autForm, setAutForm] = useState(null);
  const [depForm, setDepForm] = useState(null);
  const [cambioPlanForm, setCambioPlanForm] = useState(null);
  const [renovacionForm, setRenovacionForm] = useState(null);
  const [endosoForm, setEndosoForm] = useState(null);
  const [pagoPolizasForm, setPagoPolizasForm] = useState(null);
  const [reclamoForm, setReclamoForm] = useState(null);
  const [traspasoForm, setTraspasoForm] = useState(null);
  const [asistenciaSolicitudForm, setAsistenciaSolicitudForm] = useState(null);
  const [evaluacionForm, setEvaluacionForm] = useState(null);

  // ---------- navegación ----------
  function navigate(v) {
    setStack([...stack, current]);
    setCurrent(v);
  }
  function goBack() {
    if (stack.length === 0) {
      setCurrent({ view: "tab", tab: activeTab });
      return;
    }
    const copy = stack.slice();
    const prev = copy.pop();
    setStack(copy);
    setCurrent(prev);
  }
  function goTab(t) {
    setStack([]);
    setActiveTab(t);
    setCurrent({ view: "tab", tab: t });
  }
  function setFilial(f) {
    setActiveFilial(f);
  }
  function setMember(i) {
    setMemberIdx(i);
  }

  function findProduct(key) {
    return findIn(products, key) || findIn(asistenciaProducts, key);
  }

  const openChat = () => navigate({ view: "chat" });
  const openMapaCentros = () => navigate({ view: "mapaCentros" });
  const openRedMedica = () => navigate({ view: "redMedica" });
  const openFondo = (kind, fondoKey) => navigate({ view: "fondo", kind, fondoKey });
  const openFondoDetalle = (fondoKey) => navigate({ view: "fondoDetalle", fondoKey });
  const openEstadoCuenta = () => navigate({ view: "estadoCuenta" });
  const openCarnetBien = (key) => navigate({ view: "carnetBien", key });
  const openProduct = (key) => navigate({ view: "product", key });
  const openCarnet = () => navigate({ view: "carnet" });
  const openStub = (title) => navigate({ view: "stub", title });
  const openEmergencia = () => navigate({ view: "emergencia" });

  function openInfo(section, keyOrName) {
    if (section === "Asistencia") {
      const ap = asistenciaProducts.find((x) => x.key === keyOrName);
      const infoRows = ASISTENCIA_INFO[keyOrName] || [["Estado", ap ? ap.sub : "—"]];
      navigate({ view: "info", title: "Asistencia", icon: ap ? ap.icon : "shield", name: ap ? ap.label : keyOrName, rows: infoRows });
      return;
    }
    navigate({ view: "info", title: section, icon: section === "AFI" ? "chart" : "building", name: keyOrName, sectionKind: section });
  }

  // ---------- cotizador ----------
  function resetCot(key) {
    setCot({
      key,
      cat: CATEGORIA[key],
      step: 1,
      destino: null,
      sexo: null,
      edad: null,
      parentesco: null,
      cuestionarioSalud: {},
      personas: [],
      personaEmisionIdx: 0,
      plan: null,
      tarifa: null,
      marca: "",
      modelo: "",
      anio: "",
      precioVehiculo: "",
      matricula: false,
      tipoInmueble: null,
      ubicacion: null,
      aseguraMuebles: null,
      mueblesSeleccionados: [],
      valorMuebles: "",
      precioPropiedad: "",
      emisionDocCapturado: false,
      emisionNombre: "",
      emisionApellidos: "",
      emisionFechaNacimiento: "",
      emisionCedula: "",
      declaracionVeraz: false,
      terminosAceptados: false,
    });
  }
  function addPersonaCotizador() {
    if (!(cot.sexo && cot.edad && cot.parentesco)) return;
    setCot({
      ...cot,
      personas: [...cot.personas, { sexo: cot.sexo, edad: cot.edad, parentesco: cot.parentesco }],
      sexo: null,
      edad: null,
      parentesco: null,
    });
  }
  function removePersonaCotizador(index) {
    setCot({ ...cot, personas: cot.personas.filter((_, i) => i !== index) });
  }
  const DOCUMENTOS_MUESTRA = [
    { sexo: "Femenino", nombre: "María Isabel", apellidos: "Ramírez Cruz", fechaNacimiento: "14/05/1990", identificacion: "001-1234567-8" },
    { sexo: "Masculino", nombre: "Juan Carlos", apellidos: "Peña Gómez", fechaNacimiento: "22/11/1985", identificacion: "002-2345678-9" },
    { sexo: "Femenino", nombre: "Ana Lucía", apellidos: "Fernández Solano", fechaNacimiento: "03/08/2012", identificacion: "003-3456789-0" },
    { sexo: "Masculino", nombre: "Luis Miguel", apellidos: "Rodríguez Tejada", fechaNacimiento: "30/01/1978", identificacion: "004-4567890-1" },
    { sexo: "Femenino", nombre: "Carmen Rosa", apellidos: "Objío Vargas", fechaNacimiento: "19/09/1995", identificacion: "005-5678901-2" },
    { sexo: "Masculino", nombre: "Pedro Antonio", apellidos: "Cabrera Núñez", fechaNacimiento: "05/02/1982", identificacion: "006-6789012-3" },
  ];
  function capturarDocumentoVida() {
    const pool = DOCUMENTOS_MUESTRA.filter((d) => d.sexo === cot.sexo);
    const list = pool.length > 0 ? pool : DOCUMENTOS_MUESTRA;
    const m = list[Math.floor(Math.random() * list.length)];
    setCot({
      ...cot,
      emisionDocCapturado: true,
      emisionNombre: m.nombre,
      emisionApellidos: m.apellidos,
      emisionFechaNacimiento: m.fechaNacimiento,
      emisionCedula: m.identificacion,
    });
  }
  function capturarDocumentoPersona(index) {
    const persona = cot.personas[index];
    const nombresUsados = cot.personas.filter((p, i) => i !== index && p.nombre).map((p) => p.nombre);
    const porSexo = DOCUMENTOS_MUESTRA.filter((d) => d.sexo === persona.sexo && !nombresUsados.includes(d.nombre));
    const disponibles = DOCUMENTOS_MUESTRA.filter((d) => !nombresUsados.includes(d.nombre));
    const pool = porSexo.length > 0 ? porSexo : (disponibles.length > 0 ? disponibles : DOCUMENTOS_MUESTRA);
    const m = pool[Math.floor(Math.random() * pool.length)];
    setCot({
      ...cot,
      personas: cot.personas.map((p, i) => (i === index ? {
        ...p,
        documentoCapturado: true,
        nombre: m.nombre,
        apellidos: m.apellidos,
        fechaNacimiento: m.fechaNacimiento,
      } : p)),
    });
  }
  function setPersonaCampo(index, field, val) {
    setCot({ ...cot, personas: cot.personas.map((p, i) => (i === index ? { ...p, [field]: val } : p)) });
  }
  function confirmarPersonaEmision(index) {
    setCot({
      ...cot,
      personas: cot.personas.map((p, i) => (i === index ? { ...p, datosConfirmados: true } : p)),
      personaEmisionIdx: cot.personaEmisionIdx + 1,
    });
  }
  function retrocederPersonaEmision() {
    if (cot.personaEmisionIdx > 0) {
      setCot({ ...cot, personaEmisionIdx: cot.personaEmisionIdx - 1 });
    } else {
      prevCot();
    }
  }
  function openCotizar(key) {
    if (key === "salud") {
      navigate({ view: "saludDestino" });
      return;
    }
    if (key === "auto") {
      const ap = findIn(products, "auto");
      if (ap && ap.vehiculos.length >= 4) {
        navigate({ view: "autoLimite" });
        return;
      }
    }
    resetCot(key);
    navigate({ view: "cotizar" });
  }
  function elegirSaludDestino(destino) {
    if (destino === "familia") {
      navigate({ view: "saludFamilia" });
    } else {
      resetCot("salud");
      setCot((c) => ({ ...c, destino: "empleado" }));
      navigate({ view: "cotizar" });
    }
  }
  function setCotField(field, val) {
    setCot({ ...cot, [field]: val });
  }
  function responderCuestionario(campo, val) {
    setCot({ ...cot, cuestionarioSalud: { ...cot.cuestionarioSalud, [campo]: val } });
  }
  function nextCot() {
    setCot({ ...cot, step: cot.step + 1 });
  }
  function prevCot() {
    if (cot.step <= 1) {
      goBack();
    } else {
      setCot({ ...cot, step: cot.step - 1 });
    }
  }
  function seleccionarPlan(nombre, precio) {
    setCot({ ...cot, plan: nombre, tarifa: precio });
  }
  function capturarMatricula() {
    const muestras = [["Honda", "CR-V", "2023"], ["Hyundai", "Tucson", "2025"], ["Kia", "Sportage", "2024"]];
    const m = muestras[Math.floor(Math.random() * muestras.length)];
    setCot({ ...cot, matricula: true, marca: m[0], modelo: m[1], anio: m[2] });
  }
  function validarAutoCaracteristicas() {
    if (cot.precioVehiculo) nextCot();
  }
  function usarUbicacionActual() {
    const label = UBICACIONES_MUESTRA[Math.floor(Math.random() * UBICACIONES_MUESTRA.length)];
    setCot({ ...cot, ubicacion: { x: 50, y: 52, label } });
  }
  function marcarUbicacionMapa({ x, y }) {
    setCot({ ...cot, ubicacion: { x, y, label: "Ubicación marcada en el mapa" } });
  }
  function toggleMueble(nombre) {
    const ya = cot.mueblesSeleccionados.includes(nombre);
    setCot({
      ...cot,
      mueblesSeleccionados: ya
        ? cot.mueblesSeleccionados.filter((m) => m !== nombre)
        : [...cot.mueblesSeleccionados, nombre],
    });
  }
  function validarPropiedadValores() {
    if (cot.precioPropiedad && (!cot.aseguraMuebles || cot.valorMuebles)) nextCot();
  }

  function comprarPoliza() {
    const key = cot.key;
    const inProducts = findIn(products, key);
    const inAsistencia = findIn(asistenciaProducts, key);
    const existente = inProducts || inAsistencia;

    if (key === "auto" && inProducts) {
      const nuevo = {
        marca: cot.marca || "Vehículo",
        modelo: cot.modelo || "",
        anio: cot.anio || "",
        placa: "B" + Math.floor(100000 + Math.random() * 900000),
        color: "N/D",
      };
      setProducts(products.map((p) => {
        if (p.key !== "auto") return p;
        const vehiculos = [...p.vehiculos, nuevo];
        const sub = vehiculos.length > 1
          ? `${cot.plan}, ${vehiculos.length} vehículos`
          : `${cot.plan}, ${nuevo.marca} ${nuevo.modelo} ${nuevo.anio}`;
        return { ...p, vehiculos, plan: cot.plan, sub };
      }));
      navigate({ view: "compraConfirmada", key, modo: "vehiculo" });
      return;
    }

    if (key === "salud") {
      const n = cot.personas.length || 1;
      const label = cot.destino === "empleado"
        ? (n > 1 ? "Salud (empleados domésticos)" : "Salud (empleado doméstico)")
        : "Salud (nueva)";
      setProducts([...products, {
        key: "salud_" + Date.now(),
        label,
        sub: `${cot.plan || "Nueva"} · ${n} asegurado${n > 1 ? "s" : ""} · pendiente de emisión`,
        icon: "stethoscope",
      }]);
      navigate({ view: "compraConfirmada", key });
      return;
    }

    if (existente && existente.noContratado) {
      const patch = (p) => (p.key === key ? { ...p, noContratado: false, sub: `${cot.plan || "Contratado"} · Activo` } : p);
      if (inProducts) setProducts(products.map(patch));
      else setAsistenciaProducts(asistenciaProducts.map(patch));
    } else {
      setProducts([...products, {
        key: key + "_" + Date.now(),
        label: `${PRODUCT_TITLES[key] || key} (nueva)`,
        sub: `${cot.plan || "Nueva"} · pendiente de emisión`,
        icon: existente ? existente.icon : "shield",
      }]);
    }
    navigate({ view: "compraConfirmada", key });
  }

  // ---------- agregar cobertura (salud) ----------
  const openAgregarCobertura = () => navigate({ view: "agregarCobertura" });
  const agregarCobertura = (nombre, precio) => navigate({ view: "coberturaAgregada", nombre, precio });

  // ---------- reembolsos ----------
  const openReembolsos = () => navigate({ view: "reembolsos" });
  function openSolicitarReembolso() {
    setReembolsoForm({ step: 1, factura: false, documento: false, monto: "" });
    navigate({ view: "solicitarReembolso" });
  }
  const capturarFactura = () => setReembolsoForm({ ...reembolsoForm, factura: true });
  const capturarDocReembolso = () => setReembolsoForm({ ...reembolsoForm, documento: true });
  const setReembolsoMonto = (val) => setReembolsoForm({ ...reembolsoForm, monto: val });
  const nextReembolso = () => setReembolsoForm({ ...reembolsoForm, step: 2 });
  function prevReembolso() {
    if (reembolsoForm.step <= 1) goBack();
    else setReembolsoForm({ ...reembolsoForm, step: reembolsoForm.step - 1 });
  }
  function someterReembolso() {
    setReembolsos([{
      fecha: "Hoy",
      concepto: "Nueva solicitud",
      monto: reembolsoForm.monto ? `${reembolsoForm.monto} pesos` : "Por confirmar",
      estado: "En revisión",
    }, ...reembolsos]);
    navigate({ view: "reembolsoSometido" });
  }
  function volverAReembolsos() {
    setStack([]);
    setActiveTab("home");
    setCurrent({ view: "reembolsos" });
  }

  // ---------- autorizaciones ----------
  const openAutorizaciones = () => navigate({ view: "autorizaciones" });
  function openSolicitarAutorizacion() {
    setAutForm({ capturada: false });
    navigate({ view: "solicitarAutorizacion" });
  }
  const capturarIndicacion = () => setAutForm({ ...autForm, capturada: true });
  function someterAutorizacion() {
    setAutorizaciones([{ fecha: "Hoy", concepto: "Nueva autorización", estado: "En revisión" }, ...autorizaciones]);
    navigate({ view: "autorizacionSometida" });
  }
  function volverAAutorizaciones() {
    setStack([]);
    setActiveTab("home");
    setCurrent({ view: "autorizaciones" });
  }

  // ---------- agregar dependiente ----------
  function openAgregarDependiente() {
    setDepForm({ fotoCapturada: false, datos: null });
    navigate({ view: "agregarDependiente" });
  }
  function capturarDocumento() {
    setDepForm({
      fotoCapturada: true,
      datos: { nombre: "Isabella Moreno Pereyra", fecha: "12/03/2015", identificacion: "402-1234567-8" },
    });
  }
  function guardarDependiente() {
    setDependientes([...dependientes, depForm.datos.nombre]);
    navigate({ view: "dependienteAgregado" });
  }
  function volverASalud() {
    setStack([]);
    setActiveTab("home");
    setCurrent({ view: "product", key: "salud" });
  }

  // ---------- coberturas detalle ----------
  const openCoberturasDetalle = (planKey) => navigate({ view: "coberturasDetalle", plan: planKey });

  // ---------- consulta de afiliados (salud) ----------
  const openAfiliadoDetalle = (nombre, origen) => navigate({ view: "afiliadoDetalle", nombre, origen });
  const openAfiliadoCobertura = (nombre, tipo, origen) => navigate({ view: "afiliadoCoberturaHistorial", nombre, tipo, origen });
  const openProgramaSalud = (nombre, key) => navigate({ view: "programaSalud", nombre, key });

  // ---------- solicitar evaluación de ingreso a programa de salud ----------
  function openSolicitarEvaluacion(nombre, key) {
    setEvaluacionForm({ programaKey: key, nombre, respuestas: {}, fecha: null, hora: null });
    navigate({ view: "evaluacionCuestionario" });
  }
  function responderEvaluacion(campo, val) {
    setEvaluacionForm({ ...evaluacionForm, respuestas: { ...evaluacionForm.respuestas, [campo]: val } });
  }
  const continuarEvaluacionCita = () => navigate({ view: "evaluacionCita" });
  function seleccionarFechaEvaluacion(fecha) {
    setEvaluacionForm({ ...evaluacionForm, fecha, hora: null });
  }
  function seleccionarHoraEvaluacion(hora) {
    setEvaluacionForm({ ...evaluacionForm, hora });
  }
  const confirmarEvaluacion = () => navigate({ view: "evaluacionConfirmada" });

  // ---------- cambio de plan (salud) ----------
  function openCambioPlan() {
    setCambioPlanForm({ nuevoPlan: null });
    navigate({ view: "cambioPlan" });
  }
  function seleccionarNuevoPlan(plan) {
    setCambioPlanForm({ nuevoPlan: plan });
    navigate({ view: "cambioPlanConfirmar" });
  }
  function confirmarCambioPlan() {
    const nuevoPlan = cambioPlanForm.nuevoPlan;
    setProducts(products.map((p) => (
      p.key === "salud" ? { ...p, plan: nuevoPlan, sub: `${nuevoPlan}, ${dependientes.length} dependientes` } : p
    )));
    navigate({ view: "cambioPlanHecho" });
  }

  // ---------- renovación de pólizas ----------
  const openRenovaciones = () => navigate({ view: "renovaciones" });
  function openRenovacionDetalle(key) {
    setRenovacionForm({ key });
    navigate({ view: "renovacionDetalle", key });
  }
  const aceptarRenovacion = () => navigate({ view: "renovacionPago" });
  function confirmarPagoRenovacion() {
    const key = renovacionForm.key;
    setProducts(products.map((p) => (p.key === key ? {
      ...p,
      renovacion: avanzarUnAnio(p.renovacion),
      primaActual: p.primaRenovacion,
      primaRenovacion: Math.round(p.primaRenovacion * 1.08),
    } : p)));
    navigate({ view: "renovacionConfirmada", key });
  }

  // ---------- endoso de pólizas ----------
  function openEndosarPoliza() {
    setEndosoForm({
      productKey: null, tipo: null, banco: null, sucursal: "", ejecutivo: "",
      beneficiario: "", condicionesAceptadas: false, enviadoPor: null,
    });
    navigate({ view: "endosoSeleccionar" });
  }
  function seleccionarPolizaEndoso(key) {
    setEndosoForm({ ...endosoForm, productKey: key });
    navigate({ view: "endosoTipo" });
  }
  function seleccionarTipoEndoso(tipo) {
    setEndosoForm({ ...endosoForm, tipo });
    navigate({ view: tipo === "banco" ? "endosoBanco" : "endosoOtro" });
  }
  function setEndosoField(field, val) {
    setEndosoForm({ ...endosoForm, [field]: val });
  }
  const continuarEndosoDatos = () => navigate({ view: "endosoCondiciones" });
  function aceptarCondicionesEndoso() {
    setEndosoForm({ ...endosoForm, condicionesAceptadas: true });
    navigate({ view: "endosoGenerado" });
  }
  function enviarEndoso(medio) {
    setEndosoForm({ ...endosoForm, enviadoPor: medio });
  }

  // ---------- pago de pólizas ----------
  function openPagoPolizas() {
    setPagoPolizasForm({ seleccion: [], metodo: null });
    navigate({ view: "pagoPolizas" });
  }
  function toggleSeleccionPago(key) {
    const ya = pagoPolizasForm.seleccion.includes(key);
    setPagoPolizasForm({
      ...pagoPolizasForm,
      seleccion: ya ? pagoPolizasForm.seleccion.filter((k) => k !== key) : [...pagoPolizasForm.seleccion, key],
    });
  }
  const continuarPagoPolizas = () => navigate({ view: "pagoPolizasMetodo" });
  function setMetodoPagoPolizas(metodo) {
    setPagoPolizasForm({ ...pagoPolizasForm, metodo });
  }
  const confirmarPagoPolizas = () => navigate({ view: "pagoPolizasConfirmado" });

  // ---------- reclamos ----------
  function openReclamo() {
    setReclamoForm({ productKey: null, tipoAuto: null, fotoCapturada: false, descripcion: "", documentos: {} });
    navigate({ view: "reclamoSeleccionar" });
  }
  function seleccionarPolizaReclamo(key) {
    setReclamoForm({ ...reclamoForm, productKey: key });
    if (key === "salud") {
      navigate({ view: "reclamoSaludTipo" });
      return;
    }
    if (key === "auto") {
      navigate({ view: "reclamoAutoTipo" });
      return;
    }
    if (key === "hogar" || key === "garantivilla") {
      navigate({ view: "reclamoDocumentos" });
      return;
    }
    navigate({ view: "reclamoGenerico" });
  }
  function seleccionarTipoReclamoAuto(tipo) {
    if (tipo === "asistencia") {
      openAsistenciaSolicitud("vehicular");
      return;
    }
    setReclamoForm({ ...reclamoForm, tipoAuto: tipo });
    navigate({ view: "reclamoAutoForm" });
  }
  function capturarFotoReclamo() {
    setReclamoForm({ ...reclamoForm, fotoCapturada: true });
  }
  function setReclamoDescripcion(val) {
    setReclamoForm({ ...reclamoForm, descripcion: val });
  }
  function toggleDocumentoReclamo(nombre) {
    setReclamoForm({ ...reclamoForm, documentos: { ...reclamoForm.documentos, [nombre]: !reclamoForm.documentos[nombre] } });
  }
  const someterReclamo = () => navigate({ view: "reclamoSometido" });

  // ---------- traspaso de ARS ----------
  const openArsTraspaso = () => navigate({ view: "arsTraspaso" });
  function abrirArsTraspasoSolicitar() {
    setTraspasoForm({ nombre: TITULAR_NOMBRE, telefono: "", correo: "" });
    navigate({ view: "arsTraspasoSolicitar" });
  }
  function setTraspasoField(field, val) {
    setTraspasoForm({ ...traspasoForm, [field]: val });
  }
  const enviarArsTraspaso = () => navigate({ view: "arsTraspasoEnviado" });
  const abrirArsTraspasoEstado = () => navigate({ view: "arsTraspasoEstado" });

  // ---------- solicitar asistencia (vehicular / hogar) ----------
  function openAsistenciaSolicitud(tipo) {
    setAsistenciaSolicitudForm({ tipo, ubicacion: null, observacion: "", telefono: "" });
    navigate({ view: "asistenciaSolicitud" });
  }
  function usarUbicacionActualAsistencia() {
    setAsistenciaSolicitudForm({ ...asistenciaSolicitudForm, ubicacion: { x: 50, y: 52, label: "Ubicación actual detectada" } });
  }
  function marcarUbicacionAsistencia({ x, y }) {
    setAsistenciaSolicitudForm({ ...asistenciaSolicitudForm, ubicacion: { x, y, label: "Ubicación marcada en el mapa" } });
  }
  function setAsistenciaSolicitudField(field, val) {
    setAsistenciaSolicitudForm({ ...asistenciaSolicitudForm, [field]: val });
  }
  const enviarAsistenciaSolicitud = () => navigate({ view: "asistenciaSolicitudEnviada" });

  const value = {
    stack, current, activeTab, activeFilial, memberIdx,
    products, asistenciaProducts, dependientes, reembolsos, autorizaciones,
    especialidadFiltro, setEspecialidadFiltro,
    cot, reembolsoForm, autForm, depForm, cambioPlanForm, renovacionForm, endosoForm, pagoPolizasForm, reclamoForm, traspasoForm,
    asistenciaSolicitudForm, evaluacionForm,
    navigate, goBack, goTab, setFilial, setMember, findProduct,
    openChat, openMapaCentros, openRedMedica, openFondo, openFondoDetalle,
    openEstadoCuenta, openCarnetBien, openProduct, openCarnet, openStub,
    openEmergencia, openInfo,
    resetCot, openCotizar, elegirSaludDestino, setCotField, responderCuestionario, nextCot, prevCot,
    addPersonaCotizador, removePersonaCotizador,
    capturarDocumentoPersona, setPersonaCampo, confirmarPersonaEmision, retrocederPersonaEmision,
    capturarDocumentoVida,
    seleccionarPlan, capturarMatricula, validarAutoCaracteristicas,
    usarUbicacionActual, marcarUbicacionMapa, toggleMueble, validarPropiedadValores,
    comprarPoliza,
    openAgregarCobertura, agregarCobertura,
    openReembolsos, openSolicitarReembolso, capturarFactura, capturarDocReembolso,
    setReembolsoMonto, nextReembolso, prevReembolso, someterReembolso, volverAReembolsos,
    openAutorizaciones, openSolicitarAutorizacion, capturarIndicacion, someterAutorizacion, volverAAutorizaciones,
    openAgregarDependiente, capturarDocumento, guardarDependiente, volverASalud,
    openCoberturasDetalle, openAfiliadoDetalle, openAfiliadoCobertura, openProgramaSalud,
    openCambioPlan, seleccionarNuevoPlan, confirmarCambioPlan,
    openRenovaciones, openRenovacionDetalle, aceptarRenovacion, confirmarPagoRenovacion,
    openEndosarPoliza, seleccionarPolizaEndoso, seleccionarTipoEndoso, setEndosoField,
    continuarEndosoDatos, aceptarCondicionesEndoso, enviarEndoso,
    openPagoPolizas, toggleSeleccionPago, continuarPagoPolizas, setMetodoPagoPolizas, confirmarPagoPolizas,
    openReclamo, seleccionarPolizaReclamo, seleccionarTipoReclamoAuto, capturarFotoReclamo,
    setReclamoDescripcion, toggleDocumentoReclamo, someterReclamo,
    openArsTraspaso, abrirArsTraspasoSolicitar, setTraspasoField, enviarArsTraspaso, abrirArsTraspasoEstado,
    openAsistenciaSolicitud, usarUbicacionActualAsistencia, marcarUbicacionAsistencia,
    setAsistenciaSolicitudField, enviarAsistenciaSolicitud,
    openSolicitarEvaluacion, responderEvaluacion, continuarEvaluacionCita,
    seleccionarFechaEvaluacion, seleccionarHoraEvaluacion, confirmarEvaluacion,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
