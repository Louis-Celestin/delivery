import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router"
import { Stock } from "../../backend/stock/Stock"
import { Users } from "../../backend/users/Users"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from "primereact/progressspinner"
import { Dropdown } from "primereact/dropdown"
import { TreeSelect } from "primereact/treeselect"
import DatePicker from "../../components/form/date-picker"

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

    const [initialisation, setInitialisation] = useState([])
    const [detailsInitialisation, setDetailsInitialisation] = useState([])

    const [services, setServices] = useState([])

    const [typesMouvement, setTypesMouvement] = useState([])

    const savedPagination = JSON.parse(sessionStorage.getItem("paginationState"));
    const [first, setFirst] = useState(savedPagination?.first || 0);
    const [rows, setRows] = useState(savedPagination?.rows || 3);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

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
                const cartons_simples = cartons_data_simple.map((item) => ({
                    label: `Carton ${item.numero_carton} - ${item.quantite_totale_piece} pièce(s)`,
                    numero: item.numero_carton,
                }))
                setCartonsStock(cartons_simples)

                const lots_data_all = await stockData.getLotStock(id)
                const lots_data = lots_data_all.filter((item) => {
                    return item.is_deleted == false
                })
                // const lots =  lots_data.map(async (item) =>{
                //     const cartons_lot_all = await stockData.getCartonLot(item.id)
                //     const cartons_lot = cartons_lot_all.filter((item) => {
                //         return item.is_deleted == false
                //     })
                //     console.log(cartons_lot)
                //     const cartons = cartons_lot.map((item) =>({
                //         label: `Carton - ${item.numero_carton} - ${item.quantite_totale_piece} pièce(s)`
                //     }))
                //     return(
                //         {
                //             label: `Lot ${item.numero_lot} - ${item.quantite_carton} cartons - ${item.quantite_piece} pièces`,
                //             liste: cartons,
                //         }
                //     )
                // })
                const lots = await Promise.all(
                    lots_data.map(async (lot, lotIndex) => {
                        const cartons_lot_all = await stockData.getCartonLot(lot.id);
                        const cartons_lot = cartons_lot_all.filter((item) => !item.is_deleted);

                        const cartons = cartons_lot.map((carton, cartonIndex) => ({
                            key: `${lotIndex}-${cartonIndex}`,
                            label: `Carton ${carton.numero_carton} - ${carton.quantite_totale_piece} pièce(s)`
                        }));

                        return {
                            key: `${lotIndex}`,
                            label: `Lot ${lot.numero_lot} - ${lot.quantite_carton} cartons - ${lot.quantite_piece} pièces`,
                            children: cartons
                        };
                    })
                );
                setLotsStock(lots)

                const mouvements = await stockData.getOneStockMouvements(id)
                const first = mouvements[mouvements.length - 1]
                console.log(first)
                setInitialisation(first)
                const details_first = JSON.parse(first.details_mouvement)
                setDetailsInitialisation(details_first)
                console.log(details_first)

                const services_data = await userData.getAllServices()
                setServices(services_data)

                const mouvement_data = await stockData.getOneStockMouvements(id)
                setAllMouvements(mouvement_data)

                const typesMouvement_data = await stockData.getAllTypeMouvementStock()
                setTypesMouvement(typesMouvement_data)

            } catch (error) {
                console.log('Error fetching the data ', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

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

    const handlePageChange = (e) => {
        setFirst(e.first);
        setRows(e.rows);
        sessionStorage.setItem("paginationState", JSON.stringify({ first: e.first, rows: e.rows }));
    };

    const idTemplate = (mouvement) => {
        return (
            <>
                <span className="text-theme-xs font-medium">{mouvement.id}</span>
            </>
        )
    }
    const typeTemplate = (mouvement) => {
        const type = mouvement.type
        const textClass = type == 'entree' ? 'text-theme-xs text-green-600 font-bold' : 'text-theme-xs text-red-600 font-bold'

        return (
            <>
                <span className={textClass}>{type}</span>
            </>
        )
    }
    const mouvementTemplate = (mouvement) => {
        const type = typesMouvement.find((item) => {
            return mouvement.mouvement == item.id
        })

        const nomType = type ? type.titre : 'N/A'

        return (
            <>
                <span className="text-theme-xs font-medium text-gray-800">{nomType}</span>
            </>
        )
    }
    const initialTemplate = (mouvement) => {
        return (
            <>
                <span className="text-sm font-bold">{mouvement.stock_initial}</span>
            </>
        )
    }
    const quantiteTemplate = (mouvement) => {
        const isEntree = mouvement.type == 'entree' ? true : false
        const textClass = isEntree ? 'text-sm font-bold text-green-700' : 'text-sm font-bold text-red-700'
        const quantite = isEntree ? `+${mouvement.quantite}` : `-${mouvement.quantite}`

        return (
            <>
                <span className={textClass}>{quantite}</span>
            </>
        )
    }
    const finalTemplate = (mouvement) => {
        return (
            <>
                <span className="text-sm font-bold">{mouvement.stock_final}</span>
            </>
        )
    }
    const totalTemplate = (mouvement) => {
        return (
            <>
                <span className="text-sm font-bold">{mouvement.quantite_totale_piece}</span>
            </>
        )
    }
    const origineTemplate = (mouvement) => {
        const service = services.find((item) => {
            return mouvement.service_origine == item.id
        })
        const origine = mouvement.origine

        const nomService = service ? service.nom_service : origine ? origine : 'N/A'

        return (
            <>
                <span className="text-theme-xs font-bold">{nomService}</span>
            </>
        )
    }
    const destinationTemplate = (mouvement) => {
        const service = services.find((item) => {
            return mouvement.service_destination == item.id
        })

        const destination = mouvement.destination

        const nomService = service ? service.nom_service : destination ? destination : 'N/A'

        return (
            <>
                <span className="text-theme-xs font-bold">{nomService}</span>
            </>
        )
    }
    const dateTemplate = (mouvement) => {
        return (
            <>
                <span className="text-theme-xs text-gray-700 font-medium">{formatDate(mouvement.date)}</span>
            </>
        )
    }
    const actionsTemplate = (mouvement) => {
        const linkSee = `/details-mouvement/${mouvement.id}`
        return (
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

    const filteredMouvements = allMouvements.filter((item) => {
        let itemDate = new Date(item.date)

        const matchesStartDate = startDate ? itemDate >= startDate : true;
        const matchesEndDate = endDate ? itemDate <= endDate : true;

        return matchesStartDate && matchesEndDate
    })

    return (
        <>
            <PageBreadcrumb pageTitle={`Stock #${id}`} />
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
                                <div className="border-b flex justify-between pb-3">
                                    <div className="flex flex-col">
                                        <span className="text-cyan-700 font-semibold text-xl">{codeStock}</span>
                                        <span className="text-sm font-normal">{nomPiece} - <span className="text-xs font-bold text-red-900">{nomModel}</span></span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span style={{ fontSize: '11px' }}>Auteur</span>
                                        <span className="text-xs font-bold">{nomAuteur}</span>
                                        <span style={{ fontSize: '11px' }}>Date</span>
                                        <span className="text-xs font-medium">{dateCreation}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col border-b py-3">
                                    <div>
                                        <span className="font-bold text-red-800">Initialisation de stock le {formatDate(initialisation.date)} </span>
                                    </div>
                                    <div className="flex flex-col text-sm">
                                        <span>Quantité initiale lot(s) :
                                            <span className="text-cyan-800 font-semibold"> {detailsInitialisation.stockFinalLot ? detailsInitialisation.stockFinalLot : 0}</span>
                                        </span>
                                        <span>Quantité initiale carton(s) :
                                            <span className="text-cyan-800 font-semibold"> {detailsInitialisation.stockFinalCarton ? detailsInitialisation.stockFinalCarton : 0}</span>
                                        </span>
                                        <span>Quantité initiale pièce(s) :
                                            <span className="text-cyan-800 font-semibold"> {detailsInitialisation.stockFinalPiece ? detailsInitialisation.stockFinalPiece : 0}</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-center mt-3">
                                        <span className="font-semibold text-gray-800">Tous les mouvements du stock</span>
                                    </div>
                                    <div>
                                        <div className="flex justify-normal flex-wrap gap-3">
                                            <div className="flex gap-2">
                                                <DatePicker
                                                    id="date-picker-debut"
                                                    label="Date de début"
                                                    placeholder="Date de début"
                                                    value={startDate}
                                                    onChange={(dates) => {
                                                        setStartDate(dates[0])
                                                    }}
                                                    dateFormat="dd/mm/yy" />
                                                <DatePicker
                                                    id="date-picker-fin"
                                                    label="Date de fin"
                                                    placeholder="Date de fin"
                                                    value={endDate}
                                                    onChange={(dates) => {
                                                        if (dates && dates[0]) {
                                                            let selectedDate = new Date(dates[0]);
                                                            let nextDay = new Date(selectedDate);
                                                            nextDay.setDate(selectedDate.getDate() + 1);
                                                            setEndDate(nextDay);
                                                        }
                                                    }}
                                                    dateFormat="dd/mm/yy" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs">
                                            {filteredMouvements.length} mouvement(s) trouvé(s).
                                        </span>
                                    </div>
                                    <div>
                                        <DataTable
                                            value={filteredMouvements}
                                            loading={loading}
                                            removableSort
                                            paginator
                                            rows={rows}
                                            first={first}
                                            onPage={handlePageChange}
                                            rowsPerPageOptions={[1, 2, 3, 4, 5, 10, 20, 50, 100]}
                                            tableStyle={{ minWidth: '50rem', fontSize: '11px' }}
                                            emptyMessage="Aucun mouvement trouvé"
                                            className="p-datatable-sm flex-wrap">

                                            <Column field="id" header="ID" body={idTemplate} sortable></Column>
                                            <Column field="type" header="Type" body={typeTemplate}></Column>
                                            <Column field="mouvement" header="Mouvement" body={mouvementTemplate}></Column>
                                            <Column field="stock_initial" header="Stock Initial" body={initialTemplate} sortable></Column>
                                            <Column field="quantite" header="Quantité" body={quantiteTemplate} sortable></Column>
                                            <Column field="stock_final" header="Stock Final" body={finalTemplate} sortable></Column>
                                            <Column field="quantite_totale_piece" header="Quantité totale" body={totalTemplate} sortable></Column>
                                            <Column header="Demandeur"></Column>
                                            <Column header="Receveur"></Column>
                                            {/* <Column field="service_origine" header="Origine" body={origineTemplate}></Column> */}
                                            {/* <Column field="service_destination" header="Destination" body={destinationTemplate}></Column> */}
                                            <Column field="date" header="Date" body={dateTemplate} sortable></Column>
                                            {/* <Column header="Actions" body={actionsTemplate}></Column> */}
                                            {/* <Column field="formulaire_id" header="ID Livraison" body={livraisonTemplate} sortable></Column> */}
                                            {/* <Column field="demande_id" header="ID Demande" body={demandeTemplate} sortable></Column> */}

                                        </DataTable>
                                    </div>
                                </div>
                                 <div className="border-b">
                                    <div className="grid grid-cols-3">
                                        <div className="border-r">
                                            <div>
                                                <span className="font-bold text-red-800">Etat actuel du stock</span>
                                            </div>
                                            <div className="flex flex-col ">
                                                <span className="text-sm">Quantité pièces</span>
                                                <span className="text-5xl font-medium">{quantitePiece}</span>
                                            </div>
                                            <div>
                                                <span className="font-light text-sm">Quantité cartons: </span>
                                                <span className="font-semibold">{quantiteCarton}</span>
                                            </div>
                                            <div>
                                                <span className="font-light text-sm">Quantité lots: </span>
                                                <span className="font-semibold">{quantiteLot}</span>
                                            </div>
                                        </div>
                                        {lotsStock.length > 0 ? (
                                            <>
                                                <div className="flex justify-center items-center border-r">
                                                    <div>
                                                        <TreeSelect options={lotsStock}
                                                            placeholder="Voir lots"
                                                            filter
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                        {cartonsStock.length > 0 ? (
                                            <>
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
                                            </>
                                        ) : (
                                            <></>
                                        )}
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