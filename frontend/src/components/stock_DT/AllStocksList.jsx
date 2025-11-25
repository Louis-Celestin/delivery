import { useEffect, useState } from "react"
import { Stock } from "../../backend/stock/Stock"
import { Users } from "../../backend/users/Users";

import { Link, Links } from "react-router"

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { PackagePlus } from 'lucide-react'

export default function AllStocksList() {

    const stockData = new Stock()
    const userData = new Users()


    const savedPagination = JSON.parse(sessionStorage.getItem("paginationState"));

    const [first, setFirst] = useState(savedPagination?.first || 0);
    const [rows, setRows] = useState(savedPagination?.rows || 10);

    const [loading, setLoading] = useState(false)
    const [stocks, setStocks] = useState([])

    const [items, setItems] = useState([])

    const [models, setModels] = useState([])

    const [services, setServices] = useState([])

    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const stocks_data_all = await stockData.getAllStocks()
                const stocks_data = stocks_data_all.filter((item) => {
                    return item.is_deleted == false
                })
                setStocks(stocks_data)

                const piece_data_all = await stockData.getAllItems()
                const piece_data = piece_data_all.filter((item) => {
                    return item.is_deleted == false
                })
                setItems(piece_data)

                const models_data = await stockData.getAllModels()
                setModels(models_data)

                const services_data = await userData.getAllServices()
                setServices(services_data)

                const users_data_all = await userData.getAllUsers()
                const users_data = users_data_all.filter((item) =>{
                    return item.is_deleted == false
                })
                setUsers(users_data)

            } catch (error) {
                console.log('Error fetching the data ', error)
            } finally {
                setLoading(false)
            }
        };
        fetchData()
    }, [])

    // const formatDate = (date) => {
    //     const d = new Date(date);
    //     return d.toLocaleDateString('fr-FR'); // or use any locale you want
    // };
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleString("fr-FR", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const handlePageChange = (e) => {
        setFirst(e.first);
        setRows(e.rows);
        sessionStorage.setItem("paginationState", JSON.stringify({ first: e.first, rows: e.rows }));
    };

    const idTemplate = (stock) => {
        return (
            <>
                <span className="text-theme-xs font-medium">{stock.id}</span>
            </>
        )
    }
    const codeTemplate = (stock) => {
        return (
            <>
                <span className="text-theme-xs font-bold">{stock.code_stock}</span>
            </>
        )
    }
    const pieceTemplate = (stock) => {
        const piece = items.find((item) => {
            return stock.piece_id == item.id_piece
        })
        const nomPiece = piece ? piece.nom_piece : 'N/A'

        const model = models.find((item) => {
            return stock.model_id == item.id_model
        })
        const nomModel = model ? model.nom_model : 'N/A'

        const service = services.find((item) => {
            return stock.service_id == item.id
        })
        const nomService = service ? service.nom_service : 'N/A'

        return (
            <>
                <div className="flex flex-col">
                    <span className="text-gray-600 font-medium text-sm">{nomPiece}</span>
                    <span className="text-cyan-900 text-xs" style={{ fontSize: '10px' }}>
                        <span className="font-bold">{nomModel} </span>|
                        <span className="font-medium"> {nomService}</span>
                    </span>
                </div>
            </>
        )
    }
    const quantitePieceTemplate = (stock) => {
        return (
            <>
                <span className="text-sm font-semibold">{stock.quantite_piece}</span>
            </>
        )
    }
    const quantiteCartonTemplate = (stock) => {
        return (
            <>
                <span className="text-sm font-semibold">{stock.quantite_carton}</span>
            </>
        )
    }
    const quantiteLotTemplate = (stock) => {
        return (
            <>
                <span className="text-sm font-semibold">{stock.quantite_lot}</span>
            </>
        )
    }
    const dateTemplate = (stock) => {
        return (
            <>
                <span className="text-gray-700 ">{formatDate(stock.last_update)}</span>
            </>
        )
    }
    const userTemplate = (stock) => {
        const user = users.find((item) => {
            return item.id_user == stock.updated_by
        })

        const nomUser = user ? user.fullname : 'N/A'

        return(
            <>
                <span className="font-semibold">{nomUser}</span>
            </>
        )
    }
    const actionsTemplate = (stock) =>{
        const linkSee = `/details-stock/${stock.id}`
        return(
            <>
                <div className="flex items-center justify-between">
                    <Link to={linkSee}>
                        <button>
                            <i className="pi pi-eye"></i>
                        </button>
                    </Link>
                    {/* <Link to={`/modifier-stock/${stock.id}`}>
                        <button>
                            <i className="pi pi-pencil"></i>
                        </button>
                    </Link> */}
                </div>
            </>
        )
    }



    return (
        <>
            <div className="border rounded-2xl bg-white p-2">
                <div className="card rounded-2xl">
                    <DataTable
                        value={stocks}
                        loading={loading}
                        removableSort
                        paginator
                        rows={rows}
                        first={first}
                        onPage={handlePageChange}
                        rowsPerPageOptions={[5, 10, 25, 50, 100, 200, 300, 500, 1000]}
                        tableStyle={{ minWidth: '50rem', fontSize: '11px' }}
                        emptyMessage="Aucun stock trouvé"
                        className="p-datatable-sm">

                        <Column field="id" header="ID" body={idTemplate} sortable></Column>
                        <Column field="code_stock" body={codeTemplate} header="Code Stock"></Column>
                        <Column field="piece_id" header="Pièce" body={pieceTemplate}></Column>
                        <Column field="quantite_piece" header="Qte Pièce" body={quantitePieceTemplate} sortable></Column>
                        <Column field="quantite_carton" header="Qte Carton" body={quantiteCartonTemplate} sortable></Column>
                        <Column field="quantite_lot" header="Qte Lot" body={quantiteLotTemplate} sortable></Column>
                        <Column field="last_update" header="Dernière Modification" body={dateTemplate} sortable></Column>
                        <Column field="updated_by" header="Utilisateur" body={userTemplate}></Column>
                        <Column header="Actions" body={actionsTemplate}></Column>

                    </DataTable>
                </div>
            </div>
        </>
    )
}