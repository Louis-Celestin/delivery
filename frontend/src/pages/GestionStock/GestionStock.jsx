import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import StockDTInfos from "../../components/stock_DT/StockDTInfos"
import StockLivraisonInfos from "../../components/stock_DT/StockLivraisonInfos"
import AjoutRetourChargeur from "../../components/stock_DT/AjoutRetourChargeur"

export default function GestionStock() {

    return(
        <>
            <div>
                <PageBreadcrumb pageTitle="Gestion de Stock"/>
                <div className="">
                    {/* <div className="mb-6">
                        <StockLivraisonInfos />
                    </div> */}
                    {/* <div className="">
                        <StockDTInfos />
                    </div> */}
                </div>
            </div>
        </>
    )
}