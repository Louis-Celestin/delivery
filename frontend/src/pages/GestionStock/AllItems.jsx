import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import AllItemsList from "../../components/stock_DT/AllItemsList"

export default function AllItems() {

    return(
        <>
            <div>
                <PageBreadcrumb pageTitle="Gestion de Stock"/>
                <div className="">
                    <div className="">
                        <AllItemsList />
                    </div>
                </div>
            </div>
        </>
    )
}