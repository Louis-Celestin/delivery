import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import AllUsers from "../../components/accounts/AllUsers"

export default function AllUsersPage() {
    
    return(
        <>
            <div>
                <PageBreadcrumb pageTitle="Tous les utilisateurs"/>
                <div className="grid grid-cols-1">
                    <div className="space-y-6">
                        <AllUsers />
                    </div>
                </div>  
            </div>
        </>
    )

}