import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import AllRemplacementsList from "../../components/remplacements/AllRemplacementsList"

export default function AllRemplacements(){
    return (
        <>
        <div>
                <PageBreadcrumb pageTitle="Retrouvez les remplacements"/>
                <div className="grid grid-cols-1">
                    <div className="space-y-6">
                        <AllRemplacementsList />
                    </div>
                </div>  
            </div>
        </>
    )
}