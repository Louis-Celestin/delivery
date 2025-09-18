import {useState, useEffect} from "react";
import { Link } from "react-router";

import { Remplacements } from "../../backend/livraisons/Remplacements";
import { generatePdf } from "../../backend/receptions/GeneratePDF";
import { Users } from "../../backend/users/Users";
import { Stock } from "../../backend/stock/Stock";

import Input from "../form/input/InputField";
import { Calendar } from 'primereact/calendar';
import DatePicker from "../../components/form/date-picker";

import 'primeicons/primeicons.css';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from "primereact/multiselect";

import Swal from "sweetalert2";

export default function AllRemplacementsList() {

    const remplacements = new Remplacements();
    const userData = new Users();
    const stockData = new Stock();

    const savedPagination = JSON.parse(sessionStorage.getItem("remplacementPaginationState"));

    const [first, setFirst] = useState(savedPagination?.first || 0);
    const [rows, setRows] = useState(savedPagination?.rows || 5); 

    const FILTERS_KEY = "allRemplacementsFilters";

    const saveFilters = (filters) => {
        sessionStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
    };

    const loadFilters = () => {
        const stored = sessionStorage.getItem(FILTERS_KEY);
        return stored ? JSON.parse(stored) : null;
    };

    const savedFilters = loadFilters();

    const [deliveryForms, setDeliveryForms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [printingId, setPrintingId] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(savedFilters?.globalFilter || "");
    const [selectedStatus, setSelectedStatus] = useState(savedFilters?.selectedStatus || []);
    const statusOptions = [
        { label: 'En cours', value: 'en_cours' },
        { label: 'Livré', value: 'livre' },
        { label : 'Retourné', value: 'en_attente'},
    ];
    const [startDate, setStartDate] = useState(savedFilters?.startDate ? new Date(savedFilters.startDate) : null);
    const [endDate, setEndDate] = useState(savedFilters?.endDate ? new Date(savedFilters.endDate) : null);
    
    const [optionsServices, setOptionsServices] = useState([])
    const [selectedService, setselectedService] = useState(savedFilters?.selectedService || [])
    
    const [optionsType, setOptionsType] = useState([])
    const [selectedType, setSelectedType] = useState(savedFilters?.selectedType || [])

    const [optionsModels, setOptionsModels] = useState([])
    const [selectedOldModels, setSelectedOldModels] = useState(savedFilters?.selectedOldModels || [])
    const [selectedNewModels, setSelectedNewModels] = useState(savedFilters?.selectedNewModels || [])
    const [listModels, setListModels] = useState([])

    const [loadingDownload, setLoadingDownload] = useState(false)

    useEffect(() => {
        saveFilters({
            globalFilter,
            selectedStatus,
            selectedType,
            startDate,
            endDate,
            selectedService,
            selectedOldModels,
            selectedNewModels,
        });
    }, [globalFilter, selectedStatus, startDate, endDate, selectedService, selectedOldModels, selectedNewModels]);

    useEffect( ()=>{
        const fetchDeliveriesData = async () =>{
            setLoading(true);
            try{
                let delivery_data = await remplacements.getAllRemplacements();
                console.log(delivery_data)
                setDeliveryForms(delivery_data)

                let services_data = await userData.getAllServices();
                const options_services = services_data.map((item) => ({
                    value: item.id,
                    label: item.nom_service.toUpperCase()
                }))
                setOptionsServices(options_services)

                let models_data = await stockData.getAllModels();
                setListModels(models_data)
                const options_models = models_data.map((item) => ({
                    value: item.id_model,
                    label: item.nom_model.toUpperCase()
                }))
                setOptionsModels(options_models)
                
            } catch(error){
                console.log('Error fetching data ',error)
            } finally{
                setLoading(false);
            }
        }; fetchDeliveriesData();
    },[])

    const handlePageChange = (e) => {
        setFirst(e.first);
        setRows(e.rows);
        sessionStorage.setItem("remplacementPaginationState", JSON.stringify({ first: e.first, rows: e.rows }));
    };
    
    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR'); // or use any locale you want
    };
    const handleGeneratePdf = async (id) =>{
        setPrintingId(id);
        try{
            const blob = await generatePdf(id);
            const fileURL = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
            window.open(fileURL, '_blank');
        }catch(error){
            console.log(error)
            Swal.fire({
                title: "Attention",
                text: "Une erreur s'est produite lors de la génération du pdf",
                icon: "warning"
            });
        }finally{
            setPrintingId(null);
        }
    }
    const titleTemplate = (deliveryForms) =>{
        let title = '';
        let linkSee = `/remplacement-details/${deliveryForms.id}`;
        let titleClass = 'font-bold text-sm'
        const model = listModels.find((item) =>{
            return item.id_model == deliveryForms.old_model_id
        })
        if(model){
            title = `Remplacement TPE ${model.nom_model.toUpperCase()}`
        }
        return(
            <span className="flex flex-col">
                <Link key={deliveryForms.id}
                    to={linkSee} >
                    <span className={titleClass}>{title}</span>
                </Link>
              <span className="text-xs font-extralight">#{deliveryForms.id}</span>
            </span>
        );
    };
    const newModelTemplate = (deliveryForms) =>{
        const model = listModels.find((item) =>{
            return item.id_model == deliveryForms.new_model_id
        })
        let nomModel = ''
        if(model){
            nomModel = model.nom_model.toUpperCase()
        }

        return(
            <>
                <span className="font-bold text-sm">{nomModel}</span>
            </>
        )
    }
    const deliveryDateTemplate = (deliveryForms) =>{
        return (<span className="text-gray-500 text-theme-sm dark:text-gray-400">{formatDate(deliveryForms.date_remplacement)}</span>)
    }
    const receiveDateTemplate = (deliveryForms) =>{
        if(deliveryForms.validation_remplacement.length>0 && deliveryForms.statut != 'en_cours'){
            let index = deliveryForms.validation_remplacement.length-1
            return (<span className="text-gray-500 text-theme-sm dark:text-gray-400">{formatDate(deliveryForms.validation_remplacement[index].date_validation)}</span>) 
        }else{
            return (<></>)
        }
    }
    const statutTemplate = (deliveryForms) =>{
        let statutClass = ''
        let statut =''
        if (deliveryForms.statut == 'en_cours'){
            statut = 'en cours';
            statutClass = 'grid grid-cols-1 text-center text-xs rounded-xl p-0.5 bg-orange-300'
        } else if (deliveryForms.statut == 'livre'){
            statut = 'Livré';
            statutClass = 'grid grid-cols-1 text-center text-xs rounded-xl p-0.5 bg-green-300'
        } else if (deliveryForms.statut == 'en_attente'){
            statut = 'retourné';
            statutClass = 'grid grid-cols-1 text-center text-xs rounded-xl p-0.5 bg-red-300'
        }
        return(
            <div>
                <span className={statutClass}>{statut}</span>
            </div>
        )
    }
    const actionTemplate = (deliveryForms) =>{
        let linkSee = `/remplacement-details/${deliveryForms.id}`;

        return(
            <span className="flex items-center">
                <Link to={linkSee}>
                    <button className="mx-1">
                        <i className="pi pi-eye"></i>
                    </button>
                </Link>
                {deliveryForms.statut == 'livre' ? 
                (
                    <>
                        {/* {printingId === deliveryForms.id ? (
                            <span className='mx-1'>
                                <ProgressSpinner style={{width: '15px', height: '15px'}} strokeWidth="8" animationDuration=".5s" />
                            </span>
                        ) : (
                            <button onClick={() => handleGeneratePdf(deliveryForms.id)}><span className="mx-1 text-gray-500 text-theme-sm dark:text-gray-400"><i className="pi pi-print"></i></span></button>
                        )} */}
                    </>
                ) : (
                    <>
                    </>                
                )}
            </span>
        )
    }

    const handleClearFilters = () =>{
        setGlobalFilter("");
        setSelectedStatus([]);
        setselectedService([]);
        setStartDate(null);
        setEndDate(null);
        setSelectedNewModels([]);
        setSelectedOldModels([]);
        sessionStorage.removeItem(FILTERS_KEY);
    }

    const filteredDeliveryForms = deliveryForms.filter((item) => {
        let itemDate = new Date(item.date_remplacement);
        if(item.validation_remplacement.length > 0){
            let index = item.validation_remplacement.length-1
            itemDate = new Date(item.validation_remplacement[index].date_validation)
        }
        const matchesStatus = selectedStatus.length > 0 ? selectedStatus.includes(item.statut) : true;
        const matchesService = selectedService.length > 0 ? selectedService.includes(item.service_id) : true;
        const matchesOldModel = selectedOldModels.length > 0 ? selectedOldModels.includes(item.old_model_id) : true;
        const matchesNewModel = selectedNewModels.length > 0 ? selectedNewModels.includes(item.new_model_id) : true;
        const matchesStartDate = startDate ? itemDate >= startDate : true;
        const matchesEndDate = endDate ? itemDate <= endDate : true;
        const matchesGlobalFilter = globalFilter
          ? JSON.stringify(item).toLowerCase().includes(globalFilter.toLowerCase())
          : true;
        return matchesStatus && matchesService && matchesOldModel && matchesNewModel && matchesStartDate && matchesEndDate && matchesGlobalFilter;
    });

    const handleGlobalDownload = async () =>{
        console.log(filteredDeliveryForms)
        try{
            setLoadingDownload(true)
            const listId = filteredDeliveryForms.map((f) => f.id);
            if(listId.length == 0){
                Swal.fire({
                    title: "Attention",
                    text: "Aucune livraison enregistrée",
                    icon: "warning"
                });
                return
            }
            const blob = await productDeliveries.generateTotalPf(listId)

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            a.download = `livraisons_${timestamp}.zip`;
            a.click();
            window.URL.revokeObjectURL(url);

        }catch(error){
            console.log(error)
            Swal.fire({
                title: "Attention",
                text: "Une erreur s'est produite lors du téléchargement",
                icon: "warning"
            });
        }finally{
            setLoadingDownload(false);
        }
    }


    return(
        <>  
            <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                 <div className="px-6 pt-6 flex items-center">
                    <div className="relative w-full">
                        <Input
                            className="pl-10"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Rechercher un formulaire..."
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
                        options={statusOptions}
                        display="chip"
                        optionLabel="label"
                        maxSelectedLabels={2}
                        onChange={(e) => setSelectedStatus(e.value)}
                        placeholder="Filtrer par statut"
                        className=""
                    />
                    <MultiSelect
                        value={selectedService}
                        options={optionsServices}
                        display="chip"
                        optionLabel="label"
                        maxSelectedLabels={2}
                        onChange={(e) => setselectedService(e.value)}
                        placeholder="Filtrer par service"
                        className=""
                    />
                    <MultiSelect
                        value={selectedOldModels}
                        options={optionsModels}
                        display="chip"
                        optionLabel="label"
                        maxSelectedLabels={2}
                        onChange={(e) => setSelectedOldModels(e.value)}
                        placeholder="Filtrer par model remplaçé"
                        className=""
                    />
                    <MultiSelect
                        value={selectedNewModels}
                        options={optionsModels}
                        display="chip"
                        optionLabel="label"
                        maxSelectedLabels={2}
                        onChange={(e) => setSelectedNewModels(e.value)}
                        placeholder="Filtrer par model remplaçant"
                        className=""
                    />
                </div>
                <div className="flex justify-normal flex-wrap gap-3 mb-3 p-6">
                    <div className="flex gap-2">
                        <DatePicker
                            id="date-picker-debut"
                            label="Date de début"
                            placeholder="Date de début"
                            value={startDate}
                            onChange={(dates, currentDateString) => {
                                setStartDate(dates[0])}}
                            dateFormat="dd/mm/yy"/>
                        <DatePicker
                            id="date-picker-fin"
                            label="Date de fin"
                            placeholder="Date de fin"
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
                <div className="flex justify-between p-6 pt-0 items-center">
                    <span className="text-md text-gray-600 dark:text-gray-300">
                        {filteredDeliveryForms.length} formulaire(s) trouvé(s)
                    </span>
                    {/* {loadingDownload ? 
                    (
                        <span className='flex items-center justify-center'>
                            <ProgressSpinner style={{width: '20px', height: '20px'}} strokeWidth="8" animationDuration=".5s" />
                        </span>
                    ) : (
                        <>
                            {filteredDeliveryForms.length > 0 ? 
                                (
                                    <>
                                        <button className="flex items-center justify-center border rounded-full h-5 w-5 p-5 hover:text-white hover:bg-gray-dark hover:border-black transition-colors"
                                            onClick={handleGlobalDownload}
                                            >
                                            <span className="">
                                                <i className="pi pi-download"></i>
                                            </span>
                                        </button>
                                    </>
                                ) : (
                                    <></>
                                )
                            }
                        </>
                    )} */}
                </div>
                <div className="card">
                    <DataTable
                        value={filteredDeliveryForms}
                        loading={loading}
                        removableSort 
                        paginator 
                        rows={rows} 
                        first={first}
                        onPage={handlePageChange}
                        rowsPerPageOptions={[5, 10, 25, 50, 100, 200, 300, 500, 1000]}
                        tableStyle={{ minWidth: '50rem' }}
                        emptyMessage="Aucun remplacement trouvé"
                        className="p-datatable-sm">

                        <Column field="id" header="Formulaire" body={titleTemplate} sortable></Column>
                        <Column field="new_model_id" header="Model remplaçant" body={newModelTemplate} sortable></Column>
                        <Column field="quantite" header="Nbre produit" sortable></Column>
                        <Column field="date_remplacement" header="Date d'émission" body={deliveryDateTemplate} sortable></Column>
                        <Column header="Date de cloture" body={receiveDateTemplate}></Column>
                        <Column field="statut" header="Statut" body={statutTemplate}></Column>
                        <Column header="Actions" body={actionTemplate}></Column>
                    </DataTable>
                </div>
            </div>
        </>
    )
}