import { useState, useEffect } from "react"
import {CableDataIcon, AlertIcon, InfoIcon, MiniTools, SimpleInfo} from "../../icons/index"
import { ProgressSpinner } from "primereact/progressspinner"
import { Stock } from "../../backend/stock/Stock"
import { Users } from "../../backend/users/Users"
import { Link } from "react-router"

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from "primereact/multiselect";

export default function StockDTInfos() {

    const stock = new Stock()
    const userData = new Users()

    const [loadingStock, setLoadingStock] = useState(false)
    const [stockDT, setStockDT] = useState([])

    const savedPagination = JSON.parse(sessionStorage.getItem("paginationState"));

    const [first, setFirst] = useState(savedPagination?.first || 0);
    const [rows, setRows] = useState(savedPagination?.rows || 10); 

    const [models, setModels] = useState([])

    const [services, setServices] = useState([])

    const [errorForm, setErrorForm] = useState('')

    useEffect( ()=>{
        const fetchStock = async () => {
            setLoadingStock(true)
            try{
                let data;
                data = await stock.getAllStock()
                console.log(data)
                const stock_dt = data
                setStockDT(stock_dt)

                const model_data = await stock.getAllModels()
                setModels(model_data)

                const services_data = await userData.getAllServices()
                setServices(services_data)
                
            }catch(error){
                console.log('Error fetching data ',error)
                setErrorForm('Erreur lors de la génération du formulaire')        
            }finally{
                setLoadingStock(false)
            }
        };
        fetchStock();
    },[])

    const handlePageChange = (e) => {
        setFirst(e.first);
        setRows(e.rows);
        sessionStorage.setItem("paginationState", JSON.stringify({ first: e.first, rows: e.rows }));
    };

    const idTemplate = (piece) => {
        return(
            <>
                <span className="text-theme-xs font-medium">{piece.id_piece}</span>
            </>
        )
    }
    const nomTemplate = (piece) => {
        return(
            <>
                <span className="text-sm text-gray-700 text- font-medium">{piece.nom_piece}</span>
            </>
        )
    }
    const typeTemplate = (piece) => {
        const classType = piece.type == 'TERMINAL' ? 'font-bold text-cyan-700 text-sm' : piece.type == 'PIECE' ? 'font-bold text-emerald-600 text-sm' : 'font-bold'

        return(
            <>
                <span className={classType}>{piece.type}</span>
            </>
        )
    }
    const stockCartonTemplate = (piece) => {
        const quantite = piece.stock_carton ? piece.stock_carton : 'N/A'

        return(
            <>
                <span>{quantite}</span>
            </>
        )
    }
    const modelTemplate = (piece) => {
        const model = models.find((item) => {
            return item.id_model == piece.model_id
        })
        const nom = model ? model.nom_model.toUpperCase() : 'N/A'
        return(
            <>
                <span className="p-1 rounded-2xl text-white bg-gray-dark text-xs font-bold">{nom}</span>
            </>
        )
    }
    const serviceTemplate = (piece) => {
        const service = services.find((item) => {
            return item.id == piece.service
        })
        const nom = service ? service.nom_service.toUpperCase() : 'N/A'
        return(
            <>
                <span className="text-theme-sm font-medium">{nom}</span>
            </>
        )
    }
    const actionTemplate = (piece) => {
        const modifLink = `/modifier-piece/${piece.id_piece}`
        const quantityLink = `/modifier-quantite-piece/${piece.id_piece}`
        return(
            <>
                <div className="flex justify-between">
                    <Link to={modifLink}>
                        <span><i className="pi pi-cog"></i></span>
                    </Link>
                    <Link to={quantityLink}>
                        <span><i className="pi pi-box"></i></span>
                    </Link>
                </div>
            </>
        )
    }

    return (
        <>
            <div>
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
                        tableStyle={{ minWidth: '50rem' }}
                        emptyMessage="Aucune pièce trouvée"
                        className="p-datatable-sm">

                        <Column field="id_piece" header="ID" body={idTemplate} sortable></Column>
                        <Column field="nom_piece" header="Nom pièce" body={nomTemplate} sortable></Column>
                        <Column field="type" header="Type" body={typeTemplate} sortable></Column>
                        <Column field="quantite" header="Quantité" sortable></Column>
                        <Column field="stock_carton" header="Stock Carton" body={stockCartonTemplate} sortable></Column>
                        <Column field="model_id" header="Model" body={modelTemplate} sortable></Column>
                        <Column field="service" header="Service" body={serviceTemplate} sortable></Column>
                        <Column header="Actions" body={actionTemplate}></Column>

                    </DataTable>
                </div>
            </div>
        </>
    )
}