import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import StockInfos from "../../components/stock_DT/StockInfos"
import AjoutRetourChargeur from "../../components/stock_DT/AjoutRetourChargeur"

export default function GestionStock() {

    return(
        <>
            <div>
                <PageBreadcrumb pageTitle="Gestion de Stock"/>
                <div className="">
                    <div className="">
                        <StockInfos />
                    </div>
                </div>
            </div>
        </>
    )
}