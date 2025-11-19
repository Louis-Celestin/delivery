import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import AllStocksList from "../../components/stock_DT/AllStocksList"

export default function AllStocks() {

    return(
        <>
            <div>
                <PageBreadcrumb pageTitle="Tous les Stocks"/>
                <div className="">
                    <div className="">
                        <AllStocksList />
                    </div>
                </div>
            </div>
        </>
    )
}