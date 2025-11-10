import PageBreadcrumb from "../../../components/common/PageBreadCrumb"
import AjouterTerminalInputs from "../../../components/form/stock/AjouterTerminalInputs"

export default function AjouterTerminalForm() {
    return(
        <>
            <PageBreadcrumb pageTitle="Ajouter pièce stock" />
            <div className="grid grid-cols-1">
                <AjouterTerminalInputs />
            </div>
        </>
    )
}