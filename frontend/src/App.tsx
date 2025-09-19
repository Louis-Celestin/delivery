import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
// import AppLayout from "./layouts/deliveryAdminLayout/AppLayoutDelivery";
import { ScrollToTop } from "./components/common/ScrollToTop";
// import DeliveryDashboard from "./pages/Dashboards/DeliveryDashboard";

// @ts-ignore
import DashboardRedirector from "./DashboardRedirector";
// @ts-ignore
import AdminRenderer from "./AdminRenderer";
// @ts-ignore
import LivraisonForm from "./pages/Forms/LivraisonForms/LivraisonForm";
// @ts-ignore
import AncienneLivraisonForm from "./pages/Forms/LivraisonForms/AncienneLivraisonForm";
// @ts-ignore
import ModifyLivraisonForm from "./pages/Forms/LivraisonForms/ModifyLivraisonForm";
// @ts-ignore
import LivraisonChargeurForm from "./pages/Forms/LivraisonForms/LivraisonChargeurForm";
// @ts-ignore
import ModifyLivraisonChargeurForm from "./pages/Forms/LivraisonForms/ModifyLivraisonChargeurForm";
// @ts-ignore
import AllDeliveries from "./pages/DeliveryPages/AllDeliveries";
// @ts-ignore
import DeliveryDetails from "./pages/DeliveryPages/DeliveryDetails";
// @ts-ignore
import DeliveryChargeurDetails from "./pages/DeliveryPages/DeliveryChargeurDetails"
// @ts-ignore
import ProtectedRoutes from "./ProtectedRoutes";
// @ts-ignore
import AllReceptions from "./pages/ReceivePages/AllReceptions";
// @ts-ignore
import ReceptionDetails from "./pages/ReceivePages/ReceptionDetails";
// @ts-ignore
import ReceptionChargeurDetails from "./pages/ReceivePages/ReceptionChargeurDetails"
// @ts-ignore
import StatistiquesLivraisons from "./components/livraisons/StatistiquesLivraisons"
// @ts-ignore
import GestionStockChargeur from "./pages/GestionStock/GestionStock";
// @ts-ignore
import AllDeliveriesVue from "./pages/VueOnlyPages/AllDeliveriesVue";
// @ts-ignore
import DeliveryDetailsVue from "./pages/VueOnlyPages/DeliveryDetailsVue";
// @ts-ignore
import DeliveryChargeurDetailsVue from "./pages/VueOnlyPages/DeliveryChargeurDetailsVue";
// @ts-ignore
import AllMaintenanceDeliveries from "./pages/MaintenancePages/AllMaintenanceDeliveries";
// @ts-ignore
import DonneeGenerales from "./pages/DeliveryPages/DonneeGenerales"
// @ts-ignore
import ResetPassword from "./pages/AuthPages/ResetPassword"
// @ts-ignore
import ReceptionMaintenanceDetails from "./pages/MaintenancePages/ReceptionMaintenanceDetails"



// @ts-ignore
import DemandeForm from "./pages/Forms/DemandesForms/DemandeForm"
// @ts-ignore
import DemandeTerminalForm from "./pages/Forms/DemandesForms/DemandeTerminalForm"
// @ts-ignore
import AllDemandes from "./pages/DemandesPages/AllDemandes"
// @ts-ignore
import DemandeDetails from "./pages/DemandesPages/DemandeDetails"
// @ts-ignore
import ModifyDemandeForm from "./pages/Forms/DemandesForms/ModifyDemandeForm"
// @ts-ignore
import DemandeVueDetails from "./pages/DemandesPages/DemandeVueDetails"


// @ts-ignore
import AllDemandesSupervision from "./pages/SuperviseurPages/AllDemandesSupervision"
// @ts-ignore
import DemandeSupervisionDetails from "./pages/SuperviseurPages/DemandeSupervisionDetails"
// @ts-ignore
import AllDemandesSupport from "./pages/SupportPages/AllDemandesSupport"
// @ts-ignore
import AllDemandesMaintenance from "./pages/MaintenancePages/AllDemandesMaintenance"


// @ts-ignore
import AllDemandesDeliveries from "./pages/DeliveryPages/AllDemandesDeliveries"
// @ts-ignore
import DemandeDeliveryDetails from "./pages/DeliveryPages/DemandeDeliveryDetails"
// @ts-ignore
import LivraisonPiecesForm from "./pages/Forms/LivraisonForms/LivraisonPiecesForm"
// @ts-ignore
import DeliveryChargeurDecomDetails from "./pages/DeliveryPages/DeliveryChargeurDecomDetails"

// @ts-ignore
import AllSupportDeliveries from "./pages/SupportPages/AllSupportDeliveries"
// @ts-ignore
import ReceptionSupportDetails from "./pages/SupportPages/ReceptionSupportDetails"

// @ts-ignore
import ModifyStockForm from "./pages/Forms/StockForms/ModifyStockForm"
// @ts-ignore
import AjouterPieceForm from "./pages/Forms/StockForms/AjouterPieceForm"


// @ts-ignore
import Dashboard from "./pages/Dashboards/Dashboard";
// @ts-ignore
import AppLayout from "./layouts/AdminLayout/AppLayout";

// @ts-ignore
import AllUsersPage from "./pages/Accounts/AllUsersPage"
// @ts-ignore
import ModifyProfilForm from "./pages/Forms/UserForms/ModifyProfilForm"
// @ts-ignore
import CreateUserForm from "./pages/Forms/UserForms/CreateUserForm"

// @ts-ignore
import TypesLivraisonsPage from "./pages/Admin/AdminLivraisons/TypesLivraisonsPage"
// @ts-ignore
import AjouterTypeLivraisonForm from "./pages/Forms/AdminForms/AjouterTypeLivraisonForm"
// @ts-ignore
import ModifyTypeLivraisonForm from "./pages/Forms/AdminForms/ModifyTypeLivraisonForm"

// @ts-ignore
import ModifyLivraisonPiecesForm from "./pages/Forms/LivraisonForms/ModifyLivraisonPiecesForm"

// @ts-ignore
import ModifyDemandeAdminForm from "./pages/Forms/AdminForms/ModifyDemandeAdminForm"

// @ts-ignore
import RemplacementForm from "./pages/Forms/RemplacementForms/RemplacementForm"
// @ts-ignore
import AllRemplacements from "./pages/RemplacementPages/AllRemplacements"
// @ts-ignore
import RemplacementDetails from "./pages/RemplacementPages/RemplacementDetails"
// @ts-ignore
import ModifyRemplacementForm from "./pages/Forms/RemplacementForms/ModifyRemplacementForm"


export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
            <Route element={<ProtectedRoutes><AppLayout /></ProtectedRoutes>}>

              {/* Dashboard */}
              <Route index element={<Dashboard />} />
              <Route path="/statistiques-livraisons" element={<StatistiquesLivraisons />} />
              <Route path="/donnees-generales" element={<DonneeGenerales />} />
              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />

              {/* Forms */}
              <Route path="/form-elements" element={<FormElements />} />
              <Route path="/form-livraison" element={<LivraisonForm />} />
              <Route path="/form-ancienne-livraison" element={<AncienneLivraisonForm />} />
              <Route path="/modifier-livraison/:id" element={<ModifyLivraisonForm />} />
              <Route path="/form-livraison-chargeur" element={<LivraisonChargeurForm />} />
              <Route path="/form-modify-livraison-chargeur/:id" element={<ModifyLivraisonChargeurForm />} />

              {/* Livraisons */}
              <Route path="/toutes-les-livraisons" element={<AllDeliveries/>} />
              <Route path="/formulaire/:id" element={<DeliveryDetails/>} />
              <Route path="/formulaire-chargeur/:id" element={<DeliveryChargeurDetails />} />
              <Route path="/toutes-les-demandes-livraison" element={<AllDemandesDeliveries />} />
              <Route path="/demande-livraison/:id" element={<DemandeDeliveryDetails />} />
              <Route path="/livraison-pieces/:id" element={<LivraisonPiecesForm />} />
              <Route path="/formulaire-chargeur-decom/:id" element={<DeliveryChargeurDecomDetails />} />
              <Route path="/modifier-livraison-pieces/:id" element={<ModifyLivraisonPiecesForm />} />
      

              {/* Receptions */}
              <Route path="/toutes-les-receptions" element={<AllReceptions />} />
              <Route path="/formulaire-recu/:id" element={<ReceptionDetails />} />
              <Route path="/formulaire-chargeur-recu/:id" element={<ReceptionChargeurDetails />} />

              {/* Supervision */}
              <Route path="/toutes-les-livraisons-vue" element={<AllDeliveriesVue />} />
              <Route path="/formulaire-vue/:id" element={<DeliveryDetailsVue/>} />
              <Route path="/formulaire-chargeur-vue/:id" element={<DeliveryChargeurDetailsVue />} />
              <Route path="/toutes-les-demandes-supervision" element={<AllDemandesSupervision />} />
              <Route path="/demande-supervision-details/:id" element={<DemandeSupervisionDetails />} />

              {/* Stock DT */}
              <Route path="/gestion-stock" element={<GestionStockChargeur />} />
              <Route path="/modifier-stock" element={<ModifyStockForm />} />
              <Route path="/ajouter-piece" element={<AjouterPieceForm />} />

              {/* Maintenance */}
              <Route path="/toutes-les-livraisons-maintenance" element={<AllMaintenanceDeliveries />} />
              <Route path="/formulaire-maintenance-chargeur-recu/:id" element={<ReceptionMaintenanceDetails />} />
              <Route path="/toutes-les-demandes-maintenance" element={<AllDemandesMaintenance />} />

              {/* Support */}
              <Route path="/toutes-les-livraisons-support" element={<AllSupportDeliveries />} />
              <Route path="/formulaire-support-chargeur-recu/:id" element={<ReceptionSupportDetails />} />
              <Route path="/toutes-les-demandes-support" element={<AllDemandesSupport />} />

              {/* Demandes */}
              <Route path="/nouvelle-demande" element={<DemandeForm />} />
              <Route path="/nouvelle-demande-terminal" element={<DemandeTerminalForm />} />
              <Route path="/toutes-les-demandes" element={<AllDemandes />} />
              <Route path="/demande-details/:id" element={<DemandeDetails />} />
              <Route path="/modifier-demande/:id" element={<ModifyDemandeForm />} />
              <Route path="/demande-vue-details/:id" element={<DemandeVueDetails />} />

              {/* Remplacement */}
              <Route path="/nouveau-remplacement" element={<RemplacementForm />} />
              <Route path="/tous-les-remplacements" element={<AllRemplacements />} />
              <Route path="/remplacement-details/:id" element={<RemplacementDetails />} />
              <Route path="/modifier-remplacement/:id" element={<ModifyRemplacementForm />} />


              {/****** Gestion *******/}

              {/* Utilisateurs */}
              <Route path="/tous-les-utilisateurs" element={<AllUsersPage />} />
              <Route path="/modifier-profil/:id" element={<ModifyProfilForm />} />
              <Route path="/créer-utilisateur" element={<CreateUserForm />} />
              {/* Types Livraisons */}
              <Route path="/types-livraison" element={<TypesLivraisonsPage />} />
              <Route path="/ajouter-type-livraison" element={<AjouterTypeLivraisonForm />} />
              <Route path="/modifier-type-livraison/:id" element={<ModifyTypeLivraisonForm />} />
              {/* Formulaire mouvement de stock */}
              <Route path="/modification-admin-demande/:id" element={<ModifyDemandeAdminForm />} />



              {/* Reset Password */}
              <Route path="/modifier-mot-de-passe" element={<ResetPassword />} />

              {/* Tables */}
              <Route path="/basic-tables" element={<BasicTables />} />

              {/* Ui Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />

              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
