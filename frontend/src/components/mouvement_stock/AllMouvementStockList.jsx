import { useEffect, useState } from "react"
import { Stock } from "../../backend/stock/Stock"
import { Users } from "../../backend/users/Users";

import { Link } from "react-router"

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


export default function AllMouvementStockList() {

    const stockData = new Stock()
    const userData = new Users()

    const [loading, setLoading] = useState(false)
    const [allMouvement, setAllMouvement] = useState([])
    const savedPagination = JSON.parse(sessionStorage.getItem("paginationState"));

    const [first, setFirst] = useState(savedPagination?.first || 0);
    const [rows, setRows] = useState(savedPagination?.rows || 10); 

    const [items, setItems] = useState([])

    const [models, setModels] = useState([])

    const [typesMouvement, setTypesMouvement] = useState([])

    const [services, setServices] = useState([])

    const [stocks, setStocks] = useState([])

    useEffect( ()=>{
        const fetchData = async () => {
            setLoading(true)
            try{
                const mouvement_data = await stockData.getAllMouvementStock()
                setAllMouvement(mouvement_data)

                const piece_data = await stockData.getAllItems()
                setItems(piece_data)

                const models_data = await stockData.getAllModels()
                setModels(models_data)

                const typesMouvement_data = await stockData.getAllTypeMouvementStock()
                setTypesMouvement(typesMouvement_data)

                const services_data = await userData.getAllServices()
                setServices(services_data)

                const stocks_data_all = await stockData.getAllStocks()
                const stocks_data = stocks_data_all.filter((item) => {
                    return item.is_deleted == false
                })
                setStocks(stocks_data)

            } catch(error){
                console.log('Error fetching data ',error)
            } finally{
                setLoading(false)
            }
        };
        fetchData()
    },[])

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR'); // or use any locale you want
    };

    const handlePageChange = (e) => {
        setFirst(e.first);
        setRows(e.rows);
        sessionStorage.setItem("paginationState", JSON.stringify({ first: e.first, rows: e.rows }));
    };

    const idTemplate = (mouvement) =>{
        return(
            <>
                <span className="text-theme-xs font-medium">{mouvement.id}</span>
            </>
        )
    }
    const typeTemplate = (mouvement) =>{
        const type = mouvement.type
        const textClass = type == 'entree' ? 'text-theme-xs text-green-600 font-bold' : 'text-theme-xs text-red-600 font-bold'

        return(
            <>
                <span className={textClass}>{type}</span>
            </>
        )
    }
    const codeStockTemplate = (mouvement) =>{
        const stock = stocks.find((item) =>{
            return item.id == mouvement.stock_id
        })
        const codeStock = stock ? stock.code_stock : 'N/A'

        return(
            <>
                <span className="font-bold text-gray-700">{codeStock}</span>
            </>
        )
    }
    const pieceTemplate = (mouvement) =>{
        const piece = items.find((item) =>{
            return mouvement.piece_id == item.id_piece
        })
        const nomPiece = piece ? piece.nom_piece : 'N/A'

        const model = models.find((item) =>{
            return mouvement.model_id == item.id_model
        })
        const nomModel = model ? model.nom_model : 'N/A'

        return(
            <>
                <div className="flex flex-col">
                    <span className="text-theme-xs font-medium text-gray-700">{nomPiece}</span>
                    <span className="text-cyan-700 font-bold">{nomModel}</span>
                </div>
            </>
        )
    }
    const modelTemplate = (mouvement) =>{
        const model = models.find((item) =>{
            return mouvement.model_id == item.id_model
        })

        const nomModel = model ? model.nom_model : 'N/A'

        return(
            <>
                <span className="p-1 rounded-2xl text-white bg-gray-dark text-xs font-bold">{nomModel}</span>
            </>
        )
    }
    const mouvementTemplate = (mouvement) =>{
        const type = typesMouvement.find((item) =>{
            return mouvement.mouvement == item.id
        })

        const nomType = type ? type.titre : 'NaN'

        return(
            <>
                <span className="text-theme-xs font-medium text-gray-800">{nomType}</span>
            </>
        )
    }
    const initialTemplate = (mouvement) =>{
        return(
            <>
                <span className="text-sm font-bold">{mouvement.stock_initial}</span>
            </>
        )
    }
    const quantiteTemplate = (mouvement) =>{
        const isEntree = mouvement.type == 'entree' ? true : false
        const textClass = isEntree ? 'text-sm font-bold text-green-700' : 'text-sm font-bold text-red-700'
        const quantite = isEntree ? `+${mouvement.quantite}` : `-${mouvement.quantite}`
        
        return(
            <>
                <span className={textClass}>{quantite}</span>
            </>
        )
    }
    const finalTemplate = (mouvement) =>{
        return(
            <>
                <span className="text-sm font-bold">{mouvement.stock_final}</span>
            </>
        )
    }
    const totalTemplate = (mouvement) =>{
        return(
            <>
                <span className="text-sm font-bold">{mouvement.quantite_totale_piece}</span>
            </>
        )
    }
    const origineTemplate = (mouvement) =>{
        const service = services.find((item) =>{
            return mouvement.service_origine == item.id
        })
        const origine = mouvement.origine

        const nomService = service ? service.nom_service : origine ? origine : 'N/A'

        return(
            <>
                <span className="text-theme-xs font-bold">{nomService}</span>
            </>
        )
    }
    const destinationTemplate = (mouvement) =>{
        const service = services.find((item) =>{
            return mouvement.service_destination == item.id
        })

        const destination = mouvement.destination

        const nomService = service ? service.nom_service : destination ? destination : 'N/A'

        return(
            <>
                <span className="text-theme-xs font-bold">{nomService}</span>
            </>
        )
    }
    const dateTemplate = (mouvement) =>{
        return(
            <>
                <span className="text-theme-xs text-gray-700 font-medium">{formatDate(mouvement.date)}</span>
            </>
        )
    }
    const livraisonTemplate = (mouvement) =>{
        const idLivraison = mouvement.formulaire_id ? `#${mouvement.formulaire_id}` : 'N/A'
        const textClass = mouvement.formulaire_id ? 'text-xs font-bold italic' : 'text-xs font-bold'
        return(
            <>
                <span className={textClass}>{idLivraison}</span>
            </>
        )
    }
    const demandeTemplate = (mouvement) =>{
        const idDemande = mouvement.demande_id ? `#${mouvement.demande_id}` : 'N/A'
        const textClass = mouvement.demande_id ? 'text-xs font-bold italic' : 'text-xs font-bold'
        return(
            <>
                <span className={textClass}>{idDemande}</span>
            </>
        )
    }
    const actionsTemplate = (mouvement) =>{
        const linkSee = `/details-mouvement/${mouvement.id}`
        return(
            <>
                <span className="flex items-center justify-center">
                    <Link to={linkSee}>
                        <button>
                            <i className="pi pi-eye"></i>
                        </button>
                    </Link>
                </span>
            </>
        )
    }

    return (
        <>
            <div className="border rounded-2xl bg-white p-2">
                <div className="card rounded-2xl">
                    <DataTable
                        value={allMouvement}
                        loading={loading}
                        removableSort
                        paginator
                        rows={rows} 
                        first={first}
                        onPage={handlePageChange}
                        rowsPerPageOptions={[5, 10, 25, 50, 100, 200, 300, 500, 1000]}
                        tableStyle={{ minWidth: '50rem', fontSize: '11px' }}
                        emptyMessage="Aucun mouvement trouvé"
                        className="p-datatable-sm flex-wrap">
                            
                        <Column field="id" header="ID" body={idTemplate} sortable></Column>
                        <Column field="type" header="Type" body={typeTemplate}></Column>
                        <Column field="stock_id" header="Code Stock" body={codeStockTemplate}></Column>
                        <Column field="piece_id" header="Pièce" body={pieceTemplate}></Column>
                        {/* <Column field="model_id" header="Modèle" body={modelTemplate}></Column> */}
                        <Column field="mouvement" header="Mouvement" body={mouvementTemplate}></Column>
                        <Column field="stock_initial" header="Stock Initial" body={initialTemplate} sortable></Column>
                        <Column field="quantite" header="Quantité" body={quantiteTemplate} sortable></Column>
                        <Column field="stock_final" header="Stock Final" body={finalTemplate} sortable></Column>
                        <Column field="quantite_totale_piece" header="Quantité totale" body={totalTemplate} sortable></Column>
                        <Column field="service_origine" header="Origine" body={origineTemplate}></Column>
                        <Column field="service_destination" header="Destination" body={destinationTemplate}></Column>
                        <Column field="date" header="Date" body={dateTemplate} sortable></Column>
                        <Column header="Actions" body={actionsTemplate}></Column>
                        {/* <Column field="formulaire_id" header="ID Livraison" body={livraisonTemplate} sortable></Column> */}
                        {/* <Column field="demande_id" header="ID Demande" body={demandeTemplate} sortable></Column> */}

                    </DataTable>
                </div>
            </div>
        </>
    )
}