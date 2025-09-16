import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DemandeTerminalInputs from "../../../components/form/demandes/DemandeTerminalInputs"


export default function DemandeTerminalForm() {
    return (
        <div>
          <PageBreadcrumb pageTitle="Demande TPE" />
          <div className="grid grid-cols-1 xl:grid-cols-1">
            <DemandeTerminalInputs />
          </div>  
        </div>
    )
}