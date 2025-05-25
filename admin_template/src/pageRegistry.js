import DeliveryDashboard from './pages/Dashboards/DeliveryDashboard';
import ReceiveDashboard from './pages/Dashboards/ReceiveDashboard';
import SuperviseurDashboard from './pages/Dashboards/SuperviseurDashboard';
import MaintenanceDashboard from './pages/Dashboards/MaintenanceDashboard';


export const pageMap = {
  livreur: DeliveryDashboard,
  recepteur: ReceiveDashboard,
  superviseur: SuperviseurDashboard,
  maintenance: MaintenanceDashboard,
};
