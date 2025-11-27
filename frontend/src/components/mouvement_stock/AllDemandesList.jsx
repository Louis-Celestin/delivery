import {useState, useEffect} from "react";
import { Link } from "react-router";

import { Demandes } from "../../backend/demandes/Demandes";
import { Stock } from "../../backend/stock/Stock";
import { Users } from "../../backend/users/Users";
import { ProductDeliveries } from "../../backend/livraisons/ProductDeliveries";

import Input from "../form/input/InputField";
import { Calendar } from 'primereact/calendar';
import DatePicker from "../form/date-picker";
import { MultiSelect } from "primereact/multiselect";
// import MultiSelect from "../form/MultiSelect"

import 'primeicons/primeicons.css';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown'

import Swal from "sweetalert2";

export default function AllDemandesList() {

    const demandes = new Demandes()
    const stock = new Stock()
    const usersData = new Users()
    const livraisonsData = new ProductDeliveries()

    const savedPagination = JSON.parse(sessionStorage.getItem("demandesP    aginationState"));
    
    const [first, setFirst] = useState(savedPagination?.first || 0);
    const [rows, setRows] = useState(savedPagination?.rows || 5);

    const FILTERS_KEY = "allDemandesFilters";

    const saveFilters = (filters) => {
        sessionStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
    };

    const loadFilters = () => {
        const stored = sessionStorage.getItem(FILTERS_KEY);
        return stored ? JSON.parse(stored) : null;
    };

    const savedFilters = loadFilters();

    const [demandeForms, setDemandeForms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [printingId, setPrintingId] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(savedFilters?.globalFilter || "");
    const [selectedStatus, setSelectedStatus] = useState(savedFilters?.selectedStatus || []);
    const statusOptions = [
        { label: 'En cours', value: 'en_cours' },
        { label: 'Validée', value: 'valide' },
        { label: 'Retournée', value: 'retourne'},
        { label : 'Refusée', value: 'refuse'},
    ];
    const [selectedStatusLivraison, setSelectedStatusLivraison] = useState(savedFilters?.selectedStatusLivraison || [])
    const statusLivraison = [
        { label: 'En cours', value: 'en_cours' },
        { label: 'Livré', value: 'livre' },
        { label : 'Retourné', value: 'retourne'},
    ];
    const [selectedTypes, setSelectedTypes] = useState(savedFilters?.selectedTypes || []);
    const [startDate, setStartDate] = useState(savedFilters?.startDate ? new Date(savedFilters.startDate) : null);
    const [endDate, setEndDate] = useState(savedFilters?.endDate ? new Date(savedFilters.endDate) : null);
    
    const [optionsPieces, setOptionsPieces] = useState([])
    const [items, setItems] = useState([])
    const [serviceDemandeurs, setServiceDemandeurs] = useState(savedFilters?.serviceDemandeurs || []);

    const [optionsServices, setOptionsServices] = useState([])

    const [livraisonsPieces, setLivraisonsPieces] = useState([])
    const [dateLivraison, setDateLivraison] = useState('')
    const [statutLivraison, setStatutLivraison] = useState('')

    const [optionsModels, setOptionsModels] = useState([])
    const [selectedModels, setSelectedModels] = useState(savedFilters?.selectedModels || []);

    const [typesMouvement, setTypesMouvement] = useState([])

    useEffect(() => {
        saveFilters({
            globalFilter,
            selectedStatus,
            selectedTypes,
            startDate,
            endDate,
            serviceDemandeurs,
            selectedModels
        });
    }, [globalFilter, selectedStatus, selectedTypes, startDate, endDate, serviceDemandeurs, selectedModels]);

    useEffect( ()=>{
        const fetchDemandeData = async () =>{
            setLoading(true);
            try{
                let demande_data_all = await demandes.getAllDemandes();
                const demande_data = demande_data_all.filter((item) =>{
                    return item.is_deleted == false
                })
                setDemandeForms(demande_data)

                const models_data = await stock.getAllModels()
                const options_model = models_data.map((item) =>({
                value: item.id_model,
                label: item.nom_model.toUpperCase(),
                }))
                setOptionsModels(options_model)
                
                let stock_data_all = await stock.getAllStock()
                const stock_data = stock_data_all.filter((item) =>{
                    return item.is_deleted == false
                })
                setItems(stock_data)

                let services_data = await usersData.getAllServices()
                const options_services = services_data.map((item) => ({
                    value: item.id,
                    label: item.nom_service.toUpperCase(),
                }))
                setOptionsServices(options_services)
                
                let livraisons_pieces_data = await livraisonsData.getAllStockDeliveries()
                setLivraisonsPieces(livraisons_pieces_data)

                const typesMouvement_data = await stock.getAllTypeMouvementStock()
                setTypesMouvement(typesMouvement_data)

            } catch(error){
                console.log('Error fetching data ',error)
            } finally{
                setLoading(false);
            }
        }; 
        fetchDemandeData();
    },[])

    const handlePageChange = (e) => {
        setFirst(e.first);
        setRows(e.rows);
        sessionStorage.setItem("demandesP   aginationState", JSON.stringify({ first: e.first, rows: e.rows }));
    };
    
    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR'); // or use any locale you want
    };

    const ChangeModel = (value) => {
        const pieces_model = stockDT.filter((item) => {
        return item.model_id == value
        })
        const optionsPieces = pieces_model.map((item) => ({
        value: item.id_piece,
        label: item.nom_piece.toUpperCase(),
        }));
        setOptionsPieces(optionsPieces);
    }

    const handleGeneratePdf = async (id) =>{
        setPrintingId(id);
        try{
            const blob = await demandes.getPdf(id);
            const fileURL = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
            window.open(fileURL, '_blank');
        }catch(error){
            console.log(error)
            setPrintingId(null)
            Swal.fire({
                title: "Attention",
                text: "Une erreur s'est produite lors de la génération du formulaire",
                icon: "warning"
            });
        }finally{
            setPrintingId(null);
        }
    }
    
    const idTemplate = (demandeForms) =>{
        return(
            <>
                <span className="text-theme-xs font-medium">{demandeForms.id}</span>
            </>
        )
    }
    const titleTemplate = (demandeForms) =>{
        let linkSee = `/demande-details/${demandeForms.id}`;
        let titleClass = 'font-bold text-sm'
        let motif = `${demandeForms.motif_demande}`
        const piece = items.find((item) => {
            return item.id_piece == demandeForms.item_id
        })
        const nomPiece = piece ? piece.nom_piece : ''

        return (
            <span className="">
                <Link key={demandeForms.id_demande} className="flex flex-col"
                    to={linkSee} >
                    <span className={titleClass}>{nomPiece}</span>
                    <span className="text-xs font-light">{motif}</span>
                </Link>
            </span>
          );
    };
    const mouvementTemplate = (demandeForms) =>{
        const detailsDemande = JSON.parse(demandeForms.details_demande)
        const type = typesMouvement.find((item) =>{
            return detailsDemande.typeMouvement == item.id
        })

        const nomType = type ? type.titre : 'N/A'

        return(
            <>
                <span className="text-theme-xs font-medium text-gray-800">{nomType}</span>
            </>
        )
    }
    const demandeDateTemplate = (demandeForms) =>{
        return (
            <span className="text-theme-xs text-gray-700 font-medium dark:text-gray-400">{formatDate(demandeForms.date_demande)}</span>
        )
    }
    const dateValidationTemplate = (demandeForms) =>{
        if(demandeForms.validation_demande.length>0 && demandeForms.statut_demande != 'en_cours'){
            let index = demandeForms.validation_demande.length-1
            return (<span className="text-gray-500 text-theme-sm dark:text-gray-400">{formatDate(demandeForms.validation_demande[index].date_validation_demande)}</span>) 
        }else{
            return (<span className="text-xs">N/A</span>)
        }
    }
    const statutTemplate = (demandeForms) =>{
        let statutClass = ''
        let statut =''
        if (demandeForms.statut_demande == 'en_cours'){
            statut = 'en cours';
            statutClass = 'grid text-center text-xs rounded-xl p-0.5 bg-orange-300'
        } else if (demandeForms.statut_demande == 'valide'){
            statut = 'validée';
            statutClass = 'grid grid-cols-1 text-center text-xs rounded-xl p-0.5 bg-green-300'
        } else if (demandeForms.statut_demande == 'retourne'){
            statut = 'retournée';
            statutClass = 'grid grid-cols-1 text-center text-xs rounded-xl p-0.5 bg-red-300'
        } else if (demandeForms.statut_demande == 'refuse'){
            statut = 'refusée';
            statutClass = 'grid grid-cols-1 text-center text-xs text-white rounded-xl p-0.5 bg-black'
        }
        return(
            <span className={statutClass}>{statut}</span>
        )
    }
    const actionTemplate = (demandeForms) =>{
        let linkSee = `/demande-details/${demandeForms.id}`;
        let linkModify = `/modifier-demande/${demandeForms.id_demande}`

        return(
            <span className="flex items-center">
                <Link to={linkSee}>
                    <button className="mx-1">
                        <i className="pi pi-eye"></i>
                    </button>
                </Link>
                {demandeForms.statut_demande == 'valide' ? 
                (
                    <>
                        {printingId === demandeForms.id_demande ? (
                            <span className='mx-1'>
                                <ProgressSpinner style={{width: '15px', height: '15px'}} strokeWidth="8" animationDuration=".5s" />
                            </span>
                        ) : (
                            <button onClick={() => handleGeneratePdf(demandeForms.id_demande)}><span className="mx-1 text-gray-500 text-theme-sm dark:text-gray-400"><i className="pi pi-print"></i></span></button>
                        )}
                    </>
                ) : (
                    <>
                        {/* {demandeForms.statut_demande == 'refuse' ? 
                            (
                                <>
                                </>
                            ) : (
                                <Link to={linkModify}>
                                    <button className="mx-1 text-gray-500 text-theme-sm dark:text-gray-400">
                                        <i className="pi pi-pencil"></i>
                                    </button>
                                </Link>
                            )
                        } */}
                    </>
                    
                )}
            </span>
        )
    }
    const dateLivraisonTemplate = (demandeForms) =>{
        let date = 'N/A'
        let livraison = livraisonsPieces.find((item) => {
            return item.demande_id == demandeForms.id_demande
        })
        if(livraison){
            date = formatDate(livraison.Livraisons.date_livraison)
        }
         return (<span className="text-gray-500 text-theme-sm dark:text-gray-400">{date}</span>)
        

    }
    const statutLivraisonTemplate = (demandeForms) =>{
        let statutClass = 'text-xs'
        let statut = 'N/A'
        let livraison = livraisonsPieces.find((item) => {
            return item.demande_id == demandeForms.id_demande
        })
        if(livraison){
            if(livraison.Livraisons.statut_livraison == 'en_cours'){
                statut = 'en cours'
                statutClass = 'grid grid-cols-1 text-center text-xs rounded-xl p-0.5 bg-orange-300' 
            } else if (livraison.Livraisons.statut_livraison == 'livre'){
                statut = 'livrée';
                statutClass = 'grid grid-cols-1 text-center text-xs rounded-xl p-0.5 bg-green-300'
            } else if (livraison.Livraisons.statut_livraison == 'retourne'){
                statut = 'retournée';
                statutClass = 'grid grid-cols-1 text-center text-xs rounded-xl p-0.5 bg-red-300'
            } else if (livraison.Livraisons.statut_livraison == 'refuse'){
                statut = 'refusée';
                statutClass = 'grid grid-cols-1 text-center text-xs text-white rounded-xl p-0.5 bg-black'
            }
        }
        return(
            <span className={statutClass}>{statut}</span>
        )
    }
    const dateReceptionTemplate = (demandeForms) =>{
        let date = 'N/A'
        let livraison = livraisonsPieces.find((item) => {
            return item.demande_id == demandeForms.id_demande
        })
        let index
        if(livraison){
            if(livraison.Livraisons.reception_livraison.length > 0){
                index = livraison.Livraisons.reception_livraison.length - 1
                date = formatDate(livraison.Livraisons.reception_livraison[index].date_reception)
            }
        }
         return (<span className="text-gray-500 text-theme-sm dark:text-gray-400">{date}</span>)
    }

    const handleClearFilters = () =>{
        setGlobalFilter("");
        setSelectedStatus([]);
        setSelectedTypes([]);
        setServiceDemandeurs([]);
        setSelectedModels([]);
        setSelectedStatusLivraison([]);
        setStartDate(null);
        setEndDate(null);
        sessionStorage.removeItem(FILTERS_KEY);
    }
    const filteredDemandeForms = demandeForms.filter((item) => {
        let itemDate = new Date(item.date_demande);
        if(item.validation_demande.length > 0){
            let index = item.validation_demande.length-1
            itemDate = new Date(item.validation_demande[index].date_validation_demande)
        }
        let livraison = livraisonsPieces.find((l) => {
            return l.demande_id == item.id_demande
        })
        let matchesStatusLivraison = null
        if(livraison){
            matchesStatusLivraison = selectedStatusLivraison.length > 0 ? selectedStatusLivraison.includes(livraison.Livraisons.statut_livraison) : true
        }
        const matchesStatus = selectedStatus.length > 0 ? selectedStatus.includes(item.statut_demande) : true;
        const matchesType = selectedTypes.length > 0 ? selectedTypes.includes(item.type_demande_id) : true;
        const matchesStartDate = startDate ? itemDate >= startDate : true;
        const matchesEndDate = endDate ? itemDate <= endDate : true;
        const matchesService = serviceDemandeurs.length > 0 ? serviceDemandeurs.includes(item.service_demandeur) : true;
        const matchesModel = selectedModels.length > 0 ? selectedModels.includes(item.model_id) : true;
        const matchesGlobalFilter = globalFilter
          ? JSON.stringify(item).toLowerCase().includes(globalFilter.toLowerCase())
          : true;
        return matchesStatus && matchesType && matchesStartDate && matchesEndDate && matchesService && matchesModel && matchesGlobalFilter;
    });


    return(
        <>  
            <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                {/* <div className="px-6 pt-6 flex items-center">
                    <div className="relative w-full">
                        <Input
                            className="pl-10"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Rechercher une demande..."
                            />
                        <span className="absolute top-1/4 left-3"><i className="pi pi-search"></i></span>
                    </div>
                    <span className="pl-4">
                        <button onClick={handleClearFilters}>
                            <i className="pi pi-refresh"></i>
                        </button>
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-3 p-6 pb-0">
                    <MultiSelect
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.value)}
                        options={statusOptions}
                        display="chip"
                        optionLabel="label"
                        maxSelectedLabels={2}
                        placeholder="Filtrer par statut demande"
                        className=""
                    />
                    <MultiSelect
                        value={serviceDemandeurs}
                        options={optionsServices}
                        display="chip"
                        optionLabel="label"
                        maxSelectedLabels={2}
                        onChange={(e) => setServiceDemandeurs(e.value)}
                        placeholder="Filtrer par service demandeur"
                        className=""
                    />                  
                    <MultiSelect
                        label="Type de demande"
                        options={optionsPieces}
                        display="chip"
                        value={selectedTypes}
                        optionLabel="label"
                        maxSelectedLabels={2}
                        placeholder="Type de demande"
                        className=""
                        onChange={(e) => setSelectedTypes(e.value)}
                    />
                    <MultiSelect
                        label="Model"
                        options={optionsModels}
                        display="chip"
                        value={selectedModels}
                        optionLabel="label"
                        maxSelectedLabels={2}
                        placeholder="Model produit"
                        className=""
                        onChange={(e) => setSelectedModels(e.value)}
                    />
                    <MultiSelect
                        value={selectedStatusLivraison}
                        onChange={(e) => setSelectedStatusLivraison(e.value)}
                        options={statusLivraison}
                        display="chip"
                        optionLabel="label"
                        maxSelectedLabels={2}
                        placeholder="Filtrer par statut livraison"
                        className=""
                    />
                </div>
                <div className="flex justify-normal flex-wrap gap-3 mb-3 p-6">
                    <div className="flex gap-2">
                        <DatePicker
                            id="date-picker-debut"
                            label="Date de début"
                            placeholder={startDate ? formatDate(startDate) : 'Date de début' }
                            value={startDate}
                            onChange={(dates, currentDateString) => {
                                setStartDate(dates[0])
                            }}
                            dateFormat="dd/mm/yy"/>
                        <DatePicker
                            id="date-picker-fin"
                            label="Date de fin"
                            placeholder={endDate ? formatDate(endDate) : 'Date de fin' }
                            value={endDate}
                            onChange={(dates, currentDateString) => {
                                if (dates && dates[0]) {
                                let selectedDate = new Date(dates[0]);
                                let nextDay = new Date(selectedDate);
                                nextDay.setDate(selectedDate.getDate() + 1);
                                setEndDate(nextDay);
                            }}}
                            dateFormat="dd/mm/yy"/>
                    </div>
                </div>
                <div className="p-6 pt-0">
                    <span className="text-md text-gray-600 dark:text-gray-300">
                        {filteredDemandeForms.length} demande(s) trouvée(s)
                    </span>
                </div> */}
                <div className="card">
                    <DataTable
                        value={filteredDemandeForms}
                        loading={loading}
                        removableSort 
                        paginator 
                        rows={rows} 
                        first={first}
                        onPage={handlePageChange}
                        rowsPerPageOptions={[5, 10, 25, 50, 100, 200, 300, 500, 1000]}
                        tableStyle={{ minWidth: '50rem', fontSize: '11px' }}
                        emptyMessage="Aucune demande trouvée"
                        className="p-datatable-sm">

                        <Column field="id" header="ID" body={idTemplate} sortable></Column>
                        <Column field="item_id" header="Demande" body={titleTemplate} sortable></Column>
                        {/* <Column header="Mouvement" body={mouvementTemplate}></Column> */}
                        <Column field="qte_total_demande" header="Quantité" sortable></Column>
                        <Column field="date_demande" header="Date d'émission" body={demandeDateTemplate} sortable></Column>
                        <Column field="statut_demande" header="Statut Validation" body={statutTemplate}></Column>
                        <Column header="Date Validation" body={dateValidationTemplate}></Column>
                        <Column header="Date Livraison" body={dateLivraisonTemplate}></Column>
                        <Column header="Statut Livraison" body={statutLivraisonTemplate}></Column>
                        <Column header="Date Reception" body={dateReceptionTemplate}></Column>
                        <Column header="Actions" body={actionTemplate}></Column>
                    </DataTable>
                </div>
            </div>
        </>
    )
}