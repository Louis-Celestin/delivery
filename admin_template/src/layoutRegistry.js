import AppLayoutDelivery from './layouts/deliveryAdminLayout/AppLayoutDelivery'
import AppLayoutReceive from './layouts/receiveAdminLayout/AppLayoutReceive'
import AppLayoutSuperviseur from './layouts/superviseurAdminLayout/AppLayoutSuperviseur'
import AppLayoutMaintenance from './layouts/maintenanceAdminLayout/AppLayoutMaintenance'
import AppLayoutSupport from './layouts/supportAdminLayout/AppLayoutSupport'

export const layoutMap = {
  livreur: AppLayoutDelivery,
  recepteur: AppLayoutReceive,
  superviseur: AppLayoutSuperviseur,
  maintenance: AppLayoutMaintenance,
  support: AppLayoutSupport,
};
