import { useState, useEffect } from "react"
import { CableDataIcon, AlertIcon, InfoIcon, MiniTools, SimpleInfo } from "../../icons/index"
import { ProgressSpinner } from "primereact/progressspinner"
import { Stock } from "../../backend/stock/Stock"
import { Users } from "../../backend/users/Users"
import { Link } from "react-router"

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from "primereact/multiselect";

export default function AllItemsList() {

    const stock = new Stock()
    const userData = new Users()

    const [loadingStock, setLoadingStock] = useState(false)
    const [stockDT, setStockDT] = useState([])

    const savedPagination = JSON.parse(sessionStorage.getItem("paginationState"));

    const [first, setFirst] = useState(savedPagination?.first || 0);
    const [rows, setRows] = useState(savedPagination?.rows || 10);

    const [models, setModels] = useState([])
    const [itemModels, setItemModels] = useState([])

    const [services, setServices] = useState([])
    const [itemServices, setItemServices] = useState([])

    const [isTerminal, setIsTerminal] = useState(false)

    const [errorForm, setErrorForm] = useState('')

    useEffect(() => {
        const fetchStock = async () => {
            setLoadingStock(true)
            try {
                let data;
                data = await stock.getAllItems()
                const stock_dt = data.filter((item) => {
                    return item.is_deleted == false
                })
                setStockDT(stock_dt)

                const terminal = stock_dt.find((item) => {
                    return item.type == 'TERMINAL'
                })
                if(terminal){
                    setIsTerminal(true)
                }

                const model_data = await stock.getAllModels()
                setModels(model_data)

                const itemModels_data = await stock.getAllItemModels()
                setItemModels(itemModels_data)

                const services_data = await userData.getAllServices()
                setServices(services_data)

                const itemServices_data = await stock.getAllItemServices()
                setItemServices(itemServices_data)

            } catch (error) {
                console.log('Error fetching data ', error)
                setErrorForm('Erreur lors de la génération du formulaire')
            } finally {
                setLoadingStock(false)
            }
        };
        fetchStock();
    }, [])

    const handlePageChange = (e) => {
        setFirst(e.first);
        setRows(e.rows);
        sessionStorage.setItem("paginationState", JSON.stringify({ first: e.first, rows: e.rows }));
    };

    const idTemplate = (piece) => {
        return (
            <>
                <span className="text-theme-xs font-medium">{piece.id_piece}</span>
            </>
        )
    }
    const nomTemplate = (piece) => {
        return (
            <>
                <span className="text-sm text-gray-700 text- font-medium">{piece.nom_piece}</span>
            </>
        )
    }
    const modelsTemplate = (piece) => {
        const models_list = itemModels.map((item) => {
            if (item.item_id == piece.id_piece) {
                return item.model_id
            }
            return []
        })

        const item_models = models.filter((item) => {
            return models_list.includes(item.id_model)
        })

        return (
            <>
                <div className="space-y-1 space-x-1">
                    {item_models.map((model) => {
                        return (
                            <>
                                <span className="px-1 bg-gray-200 font-bold">{model.nom_model}</span>
                            </>
                        )
                    })}
                </div>
            </>
        )
    }
    const servicesTemplate = (piece) => {
        const services_list = itemServices.map((item) => {
            if (item.item_id == piece.id_piece) {
                return item.service_id
            }
            return []
        })

        const item_services = services.filter((item) => {
            return services_list.includes(item.id)
        })

        return (
            <>
                <div className="space-y-1 space-x-1">
                    {item_services.map((service) => {
                        return (
                            <>
                                <div>
                                    <span className="px-1 bg-gray-200 font-bold">{service.nom_service}</span>
                                </div>
                            </>
                        )
                    })}
                </div>
            </>
        )
    }
    const typeTemplate = (piece) => {
        const classType = piece.type == 'TERMINAL' ? 'font-bold text-cyan-700' : piece.type == 'PIECE' ? 'font-bold text-emerald-600' : 'font-bold'

        return (
            <>
                <span className={classType}>{piece.type}</span>
            </>
        )
    }
    const stockCartonTemplate = (piece) => {
        const quantite = piece.stock_carton ? piece.stock_carton : 'N/A'

        return (
            <>
                <span>{quantite}</span>
            </>
        )
    }
    const actionTemplate = (piece) => {
        const modifLink = `/modifier-piece/${piece.id_piece}`
        return (
            <>
                <div className="flex justify-between">
                    <Link to={modifLink}>
                        <span><i className="pi pi-pencil"></i></span>
                    </Link>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="border rounded-2xl bg-white p-2">
                <div className="flex justify-end text-sm space-x-2 mb-1">
                    {isTerminal ? (
                        <></>
                    ) : (
                        <>
                            <div>
                                <Link to={'/ajouter-terminal'} className="rounded p-1 bg-cyan-700 text-white font-semibold">
                                    Créer Terminal
                                </Link>
                            </div>
                        </>
                    )}
                    <div>
                        <Link to={'/ajouter-piece'} className="rounded p-1 bg-red-700 text-white font-semibold">
                            Ajouter pièce
                        </Link>
                    </div>
                </div>
                <div className="card">
                    <DataTable
                        value={stockDT}
                        loading={loadingStock}
                        removableSort
                        paginator
                        rows={rows}
                        first={first}
                        onPage={handlePageChange}
                        rowsPerPageOptions={[5, 10, 25, 50, 100, 200, 300, 500, 1000]}
                        tableStyle={{ minWidth: '50rem', fontSize: '11px' }}
                        emptyMessage="Aucune pièce trouvée"
                        className="p-datatable-sm">

                        <Column field="id_piece" header="ID" body={idTemplate} sortable></Column>
                        <Column field="nom_piece" header="Nom pièce" body={nomTemplate} sortable></Column>
                        <Column header="Modèles" body={modelsTemplate}></Column>
                        <Column header="Services" body={servicesTemplate}></Column>
                        <Column field="type" header="Type" body={typeTemplate} sortable></Column>
                        <Column header="Actions" body={actionTemplate}></Column>

                    </DataTable>
                </div>
            </div>
        </>
    )
}