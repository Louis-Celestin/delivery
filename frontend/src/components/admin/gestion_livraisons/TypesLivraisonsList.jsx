import { useEffect, useState } from "react"
import { Users } from "../../../backend/users/Users"
import { ProductDeliveries } from "../../../backend/livraisons/ProductDeliveries"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Link } from "react-router"


export default function TypesLivraisonsList() {

    const usersData = new Users()
    const deliveryData = new ProductDeliveries()
    
    const [loading, setLoading] = useState(false)
    const [listLivraisons, setListLivraisons] = useState([])

    useEffect( () => {
        const fetchData = async () =>{
            try{
                setLoading(true)
                let typesLivraisons_data = await deliveryData.getAllTypeLivraisonCommerciale();
                let typesLivraisons = typesLivraisons_data.filter((type) =>{
                    return type.is_deleted == false
                })
                setListLivraisons(typesLivraisons)
            } catch(error){
                console.log(error)
            } finally{
                setLoading(false)
            }
        }
        fetchData()
    },[])

    const nomUserTemplate = (typeLivraison) =>{
        let nom = 'Inconnu'
        if(typeLivraison.created_by){
            nom = typeLivraison.created_by
        }
        return(
            <span className="flex items-center">
                {nom}
            </span>
        )
    }
    const actionsTemplate = (typeLivraison) =>{
        let linkModify = `/modifier-type-livraison/${typeLivraison.id_type_livraison}`
        return(
            <span className="flex items-center">
                <Link to={linkModify}>
                    <button className="mx-1 text-gray-500 text-theme-sm dark:text-gray-400">
                        <i className="pi pi-cog"></i>
                    </button>
                </Link>
            </span>
        )
    }
    return (
        <>
            <div>
                <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="card">
                        <DataTable 
                            value={listLivraisons}
                            loading={loading}
                            removableSort
                            paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]}
                             tableStyle={{ minWidth: '50rem' }}
                            emptyMessage="Aucun type de livraison trouvé"
                            className="p-datatable-sm">

                            <Column field="id_type_livraison" header="ID Livraison" sortable></Column>
                            <Column field="nom_type_livraison" header="Nom type Livraison" sortable></Column>
                            <Column field="created_by" body={nomUserTemplate} header="Modifié par" sortable></Column>
                            <Column header="Actions" body={actionsTemplate}></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    )
}