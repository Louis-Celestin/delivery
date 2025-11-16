import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import StockDTInfos from "../../components/stock_DT/StockDTInfos"

export default function GestionStock() {

    return(
        <>
            <div>
                <PageBreadcrumb pageTitle="Gestion de Stock"/>
                <div className="">
                    <div className="">
                        <StockDTInfos />
                    </div>
                </div>
            </div>
        </>
    )
}