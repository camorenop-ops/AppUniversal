import { useApp } from "./context/AppContext";
import { HomeTab, TramitesTab, NotifTab, CuentaTab } from "./screens/TabScreens";
import { ProductScreen } from "./screens/ProductScreens";
import {
  CotizarScreen, SaludDestinoScreen, SaludFamiliaScreen, AutoLimiteScreen, CompraConfirmadaScreen,
} from "./screens/CotizarScreens";
import { CoberturasDetalleScreen } from "./screens/CoberturasDetalleScreen";
import {
  ReembolsosScreen, SolicitarReembolsoScreen, ReembolsoSometidoScreen,
  AutorizacionesScreen, SolicitarAutorizacionScreen, AutorizacionSometidaScreen,
  AgregarDependienteScreen, DependienteAgregadoScreen,
  AgregarCoberturaScreen, CoberturaAgregadaScreen,
} from "./screens/TramitesFlows";
import {
  ChatScreen, EmergenciaScreen, MapaCentrosScreen, RedMedicaScreen, AsistenciaAutoScreen,
  FondoScreen, EstadoCuentaScreen, CarnetScreen, CarnetBienScreen, PagoScreen, StubScreen, InfoScreen,
} from "./screens/MiscScreens";

export function Router() {
  const { current } = useApp();

  switch (current.view) {
    case "tab":
      if (current.tab === "home") return <HomeTab />;
      if (current.tab === "tramites") return <TramitesTab />;
      if (current.tab === "notif") return <NotifTab />;
      return <CuentaTab />;
    case "product":
      return <ProductScreen productKey={current.key} />;
    case "cotizar":
      return <CotizarScreen />;
    case "saludDestino":
      return <SaludDestinoScreen />;
    case "saludFamilia":
      return <SaludFamiliaScreen />;
    case "autoLimite":
      return <AutoLimiteScreen />;
    case "compraConfirmada":
      return <CompraConfirmadaScreen productKey={current.key} modo={current.modo} />;
    case "agregarCobertura":
      return <AgregarCoberturaScreen />;
    case "coberturaAgregada":
      return <CoberturaAgregadaScreen nombre={current.nombre} precio={current.precio} />;
    case "agregarDependiente":
      return <AgregarDependienteScreen />;
    case "dependienteAgregado":
      return <DependienteAgregadoScreen />;
    case "reembolsos":
      return <ReembolsosScreen />;
    case "solicitarReembolso":
      return <SolicitarReembolsoScreen />;
    case "reembolsoSometido":
      return <ReembolsoSometidoScreen />;
    case "autorizaciones":
      return <AutorizacionesScreen />;
    case "solicitarAutorizacion":
      return <SolicitarAutorizacionScreen />;
    case "autorizacionSometida":
      return <AutorizacionSometidaScreen />;
    case "coberturasDetalle":
      return <CoberturasDetalleScreen plan={current.plan} />;
    case "carnet":
      return <CarnetScreen />;
    case "carnetBien":
      return <CarnetBienScreen productKey={current.key} />;
    case "pago":
      return <PagoScreen />;
    case "stub":
      return <StubScreen title={current.title} />;
    case "info":
      return <InfoScreen title={current.title} icon={current.icon} name={current.name} rows={current.rows} sectionKind={current.sectionKind} />;
    case "chat":
      return <ChatScreen />;
    case "emergencia":
      return <EmergenciaScreen />;
    case "mapaCentros":
      return <MapaCentrosScreen />;
    case "redMedica":
      return <RedMedicaScreen />;
    case "asistenciaAuto":
      return <AsistenciaAutoScreen />;
    case "fondo":
      return <FondoScreen kind={current.kind} />;
    case "estadoCuenta":
      return <EstadoCuentaScreen />;
    default:
      return null;
  }
}
