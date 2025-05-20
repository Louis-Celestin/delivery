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

import DeliveryDashboard from "./pages/Dashboards/DeliveryDashboard";

import DashboardRedirector from "./DashboardRedirector";
import AdminRenderer from "./AdminRenderer";

import LivraisonForm from "./pages/Forms/LivraisonForms/LivraisonForm";
import AncienneLivraisonForm from "./pages/Forms/LivraisonForms/AncienneLivraisonForm";
import ModifyLivraisonForm from "./pages/Forms/LivraisonForms/ModifyLivraisonForm";
import LivraisonChargeurForm from "./pages/Forms/LivraisonForms/LivraisonChargeurForm";
import ModifyLivraisonChargeurForm from "./pages/Forms/LivraisonForms/ModifyLivraisonChargeurForm";

import AllDeliveries from "./pages/DeliveryPages/AllDeliveries";
import DeliveryDetails from "./pages/DeliveryPages/DeliveryDetails";
import DeliveryChargeurDetails from "./pages/DeliveryPages/DeliveryChargeurDetails"

import ProtectedRoutes from "./ProtectedRoutes";

import AllReceptions from "./pages/ReceivePages/AllReceptions";
import ReceptionDetails from "./pages/ReceivePages/ReceptionDetails";
import ReceptionChargeurDetails from "./pages/ReceivePages/ReceptionChargeurDetails"

import StatistiquesLivraisons from "./components/livraisons/StatistiquesLivraisons"
import GestionStockChargeur from "./pages/GestionStock/GestionStockChargeur";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
            <Route element={<ProtectedRoutes><AdminRenderer /></ProtectedRoutes>}>

              {/* Dashboard */}
              <Route index element={<DashboardRedirector />} />
              <Route path="/statistiques-livraisons" element={<StatistiquesLivraisons />} />
              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />

              {/* Forms */}
              <Route path="/form-elements" element={<FormElements />} />
              <Route path="/form-livraison" element={<LivraisonForm />} />
              <Route path="/form-ancienne-livraison" element={<AncienneLivraisonForm />} />
              <Route path="/form-modify-nouvelle-livraison/:id" element={<ModifyLivraisonForm />} />
              <Route path="/form-livraison-chargeur" element={<LivraisonChargeurForm />} />
              <Route path="/form-modify-livraison-chargeur/:id" element={<ModifyLivraisonChargeurForm />} />

              {/* Livraisons */}
              <Route path="/toutes-les-livraisons" element={<AllDeliveries/>} />
              <Route path="/formulaire/:id" element={<DeliveryDetails/>} />
              <Route path="/formulaire-chargeur/:id" element={<DeliveryChargeurDetails />} />

              {/* Receptions */}
              <Route path="/toutes-les-receptions" element={<AllReceptions />} />
              <Route path="/formulaire-recu/:id" element={<ReceptionDetails />} />
              <Route path="/formulaire-chargeur-recu/:id" element={<ReceptionChargeurDetails />} />

              {/* Stock chargeurs */}
              <Route path="/gestion-stock-chargeur" element={<GestionStockChargeur />} />

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
