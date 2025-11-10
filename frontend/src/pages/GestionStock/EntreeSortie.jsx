import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import AllMouvementStockList from "../../components/mouvement_stock/AllMouvementStockList"

export default function EntreeSortie() {
    return(
        <>
            <div>
                <PageBreadcrumb pageTitle="Entrée & Sorties de Stock" />
                <div>
                    <AllMouvementStockList />
                </div>
            </div>
        </>
    )
}