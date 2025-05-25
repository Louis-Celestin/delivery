import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import ChargeurInfos from "../../components/stock_chargeurs/ChargeurInfos"
import AjoutRetourChargeur from "../../components/stock_chargeurs/AjoutRetourChargeur"

export default function GestionStockChargeur() {

    return(
        <>
            <div>
                <PageBreadcrumb pageTitle="Stock de chargeurs"/>
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-3">
                        <ChargeurInfos />
                    </div>
                </div>
            </div>
        </>
    )
}