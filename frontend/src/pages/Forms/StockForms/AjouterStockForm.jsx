import PageBreadcrumb from "../../../components/common/PageBreadCrumb"
import { BaseLinePhoneIcon, CableDataIcon } from "../../../icons/index"
import { Link } from "react-router"

export default function AjouterStockForm() {
    return(
        <>
            <PageBreadcrumb pageTitle="Ajouter pièce stock" />
            <div className="flex justify-center items-center h-72">
                <div className="w-1/2 grid grid-cols-2 gap-2">
                    <Link to={'/ajouter-terminal'}>
                        <div className="border flex flex-col justify-center items-center text-8xl p-6 hover:text-white hover:border-cyan-700 hover:bg-cyan-700">
                            <BaseLinePhoneIcon />
                            <span className="text-xs">Ajouter un terminal</span>
                        </div>
                    </Link>
                    <Link to={'/ajouter-piece'}>
                        <div className="border flex flex-col justify-center items-center text-8xl p-6 hover:text-white hover:border-emerald-500 hover:bg-emerald-500">
                            <CableDataIcon />
                            <span className="text-xs">Ajouter une pièce</span>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    )
}