import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { Stock } from "../../backend/stock/Stock"
import { Users } from "../../backend/users/Users"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from "primereact/progressspinner"
import { Dropdown } from "primereact/dropdown"
import { TreeSelect } from "primereact/treeselect"

export default function StockDetails() {
    const stockData = new Stock()
    const userData = new Users()
    const { id } = useParams()

    const [loading, setLoading] = useState(false)
    const [codeStock, setCodeStock] = useState('')
    const [nomPiece, setNomPiece] = useState('')
    const [nomModel, setNomModel] = useState('')
    const [nomService, setNomService] = useState('')
    const [nomAuteur, setNomAuteur] = useState('')
    const [dateCreation, setDateCreation] = useState('')
    const [allMouvements, setAllMouvements] = useState([])

    const [quantitePiece, setQuantitePiece] = useState(0)
    const [quantiteCarton, setQuantiteCarton] = useState(0)
    const [quantiteLot, setQuantiteLot] = useState(0)

    const [cartonsStock, setCartonsStock] = useState([])

    const [lotsStock, setLotsStock] = useState([])
    const [cartonsLot, setCartonsLot] = useState([])

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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const stock_data = await stockData.getOneStock(id)
                setCodeStock(stock_data.code_stock)
                setQuantitePiece(stock_data.quantite_piece)
                setQuantiteCarton(stock_data.quantite_carton)
                setQuantiteLot(stock_data.quantite_lot)
                setDateCreation(formatDate(stock_data.created_at))

                const piece_data = await stockData.getPiece(stock_data.piece_id)
                setNomPiece(piece_data.nom_piece)

                const user_data = await userData.getOneUser(stock_data.created_by)
                setNomAuteur(user_data.fullname)

                const models = await stockData.getAllModels()
                const model = models.find((item) => {
                    return item.id_model = stock_data.model_id
                })
                const nom_model = model ? model.nom_model : ''
                setNomModel(nom_model)

                const cartons_data_all = await stockData.getCartonStock(id)
                const cartons_data_simple = cartons_data_all.filter((item) => {
                    return item.is_deleted == false && item.lot_id == null
                })
                const cartons_simples = cartons_data_simple.map((item) =>({
                    label: `Carton ${item.numero_carton} - ${item.quantite_totale_piece} pièce(s)`,
                    numero: item.numero_carton,
                }))
                setCartonsStock(cartons_simples)

                const lots_data_all = await stockData.getLotStock(id)
                const lots_data = lots_data_all.filter((item) => {
                    return item.is_deleted == false
                })
                const lots =  lots_data.map(async (item) =>{
                    const cartons_lot_all = await stockData.getCartonLot(item.id)
                    const cartons_lot = cartons_lot_all.filter((item) => {
                        return item.is_deleted == false
                    })
                    const cartons = cartons_lot.map((item) =>({
                        label: `Carton - ${item.numero_carton} - ${item.quantite_totale_piece} pièce(s)`
                    }))
                    return(
                        {
                            label: `Lot ${item.numero_lot} - ${item.quantite_carton} cartons - ${item.quantite_piece} pièces`,
                            liste: cartons,
                        }
                    )
                })
                setLotsStock(lots)

            } catch (error){    
                console.log('Error fetching the data ', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    },[])

    const cartonSimplesTemplate = (carton) => {
        return (
            <>
                <span>{carton.label}</span>
            </>
        )
    }
    const listeLotTemplate = (lot) => {
        return (
            <>
                <span>{lot.label}</span>
            </>
        )
    }


    return (
        <>
            <PageBreadcrumb pageTitle={`Stock #${id}`}/>
            {loading ? (
                <>
                    <div className="text-center">
                        <span>
                            Loading...
                        </span>
                    </div>
                </>
            ) : (
                <>    
                    <div className="border rounded-sm bg-white">
                        <div className="p-3">
                            <div>
                                <div className="flex justify-between border-b pb-3">
                                    <div className="flex flex-col">
                                        <span className="text-cyan-700 font-semibold text-xl">{codeStock}</span>
                                        <span className="text-sm font-normal">{nomPiece} - <span className="text-xs font-bold text-red-900">{nomModel}</span></span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span style={{fontSize: '11px'}}>Auteur</span>
                                        <span className="text-xs font-bold">{nomAuteur}</span>
                                        <span style={{fontSize: '11px'}}>Date</span>
                                        <span className="text-xs font-medium">{dateCreation}</span>
                                    </div>
                                </div>
                                <div className="border-b">
                                    <div className="grid grid-cols-3">
                                        <div className="border-r">
                                            <div className="flex flex-col ">
                                                <span className="text-sm">Quantité pièce</span>
                                                <span className="text-5xl font-medium">{quantitePiece}</span>
                                            </div>
                                            <div>
                                                <span className="font-light text-sm">Quantité cartons - </span>
                                                <span className="font-semibold">{quantiteCarton}</span>
                                            </div>
                                            <div>
                                                <span className="font-light text-sm">Quantité lot - </span>
                                                <span className="font-semibold">{quantiteLot}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <TreeSelect options={lotsStock}
                                                    optionLabel="label"
                                                    placeholder="Voir lots" 
                                                    filter
                                                    itemTemplate={listeLotTemplate}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-center items-center border-r">
                                            <div>
                                                <Dropdown options={cartonsStock} 
                                                    optionLabel="label"
                                                    placeholder="Voir Cartons Simples"     
                                                    filter filterDelay={400}
                                                    filterBy="numero"
                                                    filterPlaceholder="Numéro carton"
                                                    itemTemplate={cartonSimplesTemplate}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

        </>
    )
}