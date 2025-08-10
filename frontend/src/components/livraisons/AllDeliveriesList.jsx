import {useState, useEffect} from "react";
import { Link } from "react-router";

import { ProductDeliveries } from "../../backend/livraisons/productDeliveries"
import { generatePdf } from "../../backend/receptions/GeneratePDF";
import { Users } from "../../backend/users/Users";

import Input from "../form/input/InputField";
import { Calendar } from 'primereact/calendar';
import DatePicker from "../../components/form/date-picker";

import 'primeicons/primeicons.css';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';

export default function AllDeliveriesList({ filterType }) {

    const productDeliveries = new ProductDeliveries();
    const userData = new Users();

    const [deliveryForms, setDeliveryForms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [printingId, setPrintingId] = useState(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(null);
    const statusOptions = [
        { label: 'En cours', value: 'en_cours' },
        { label: 'Livré', value: 'livre' },
        { label : 'Retourné', value: 'en_attente'},
    ];
    const typeOptions = [
        {label: 'TPE GIM', value:[1]},
        {label: 'TPE Réparé', value:[2]},
        {label: 'MAJ GIM', value:[3]},
        {label: 'TPE MOBILE', value:[4]},
        {label: 'TPE ECOBANK', value:[6]},
        {label: 'Chargeur', value:[5, 7]},
        {label: 'Chargeur (DECOM RI NOK)', value:[8]} 
    ]
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    
    const [optionsServices, setOptionsServices] = useState([])
    const [selectedService, setselectedService] = useState('')
    
    const [optionsType, setOptionsType] = useState([])
    const [selectedType, setSelectedType] = useState(null)


    useEffect( ()=>{
        const fetchDeliveriesData = async () =>{
            setLoading(true);
            try{
                let delivery_data = await productDeliveries.getAllLivraisons();
                console.log(delivery_data)
                setDeliveryForms(delivery_data)

                let type_deliveries_data = await productDeliveries.getAllTypeLivraisonCommerciale();
                const options_type = type_deliveries_data.map((item) => ({
                    value: item.id_type_livraison,
                    label: item.nom_type_livraison,
                }))
                setOptionsType(options_type)

                let services_data = await userData.getAllServices();
                const options_services = services_data.map((item) => ({
                    value: item.id,
                    label: item.nom_service.toUpperCase()
                }))
                setOptionsServices(options_services)
                
            } catch(error){
                console.log('Error fetching data ',error)
            } finally{
                setLoading(false);
            }
        }; fetchDeliveriesData();
    },[])
    
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
            }finally{
                setPrintingId(null);
            }
      }
    const titleTemplate = (deliveryForms) =>{
        let title = '';
        let linkSee = `/formulaire/${deliveryForms.id_livraison}`;
        let titleClass = 'font-bold text-sm'


        if (deliveryForms.type_livraison_id === 1) {
            title = 'Livraison TPE GIM';
            titleClass = "font-bold text-sm text-fuchsia-400"
        } else if (deliveryForms.type_livraison_id === 2) {
            title = 'Livraison TPE REPARE'; // fallback or other types
            titleClass = "font-bold text-sm text-red-400"
        } else if (deliveryForms.type_livraison_id === 3) {
            title = 'Livraison TPE MAJ GIM'; // fallback or other types
            titleClass = "font-bold text-sm text-purple-400"
        } else if (deliveryForms.type_livraison_id === 4) {
            title = 'Livraison TPE MOBILE'; // fallback or other types
            titleClass = "font-bold text-sm text-green-400"
        } else if (deliveryForms.type_livraison_id === 5 || deliveryForms.type_livraison_id === 7) {
            title = 'Livraison CHARGEUR'; // fallback or other types
            titleClass = "font-bold text-sm text-yellow-400"
            linkSee = `/formulaire-chargeur/${deliveryForms.id_livraison}`
        } else if (deliveryForms.type_livraison_id === 6) {
            title = 'Livraison TPE ECOBANK'; // fallback or other types
            titleClass = "font-bold text-sm text-cyan-400"
        } else if (deliveryForms.type_livraison_id === 8) {
            title = 'Livraison CHARGEUR (DECOM RI NOK)'; // fallback or other types
            titleClass = "font-bold text-sm text-yellow-600";
            linkSee = `/formulaire-chargeur/${deliveryForms.id_livraison}`;
        }
        return (
            <span className="flex flex-col">
                <Link key={deliveryForms.id_livraison}
                    to={linkSee} >
                    <span className={titleClass}>{title}</span>
                </Link>
              <span className="text-xs font-extralight">#{deliveryForms.id_livraison}</span>
            </span>
          );
    };
    const deliveryDateTemplate = (deliveryForms) =>{
        return (<span className="text-gray-500 text-theme-sm dark:text-gray-400">{formatDate(deliveryForms.date_livraison)}</span>)
    }
    const receiveDateTemplate = (deliveryForms) =>{
        if(deliveryForms.validations.length>0 && deliveryForms.statut_livraison != 'en_cours'){
            let index = deliveryForms.validations.length-1
            return (<span className="text-gray-500 text-theme-sm dark:text-gray-400">{formatDate(deliveryForms.validations[index].date_validation)}</span>) 
        }else{
            return (<></>)
        }
    }
    const statutTemplate = (deliveryForms) =>{
        let statutClass = ''
        let statut =''
        if (deliveryForms.statut_livraison == 'en_cours'){
            statut = 'en cours';
            statutClass = 'text-xs border rounded-xl p-0.5 bg-orange-300'
        } else if (deliveryForms.statut_livraison == 'livre'){
            statut = 'Livré';
            statutClass = 'text-xs border rounded-xl p-0.5 px-1 bg-green-300'
        } else if (deliveryForms.statut_livraison == 'en_attente'){
            statut = 'retourné';
            statutClass = 'text-xs border rounded-xl p-0.5 px-1 bg-red-300'
        }
        return(
            <span className={statutClass}>{statut}</span>
        )
    }
    const actionTemplate = (deliveryForms) =>{
        let linkSee = `/formulaire/${deliveryForms.id_livraison}`;
        let linkModify = `/form-modify-nouvelle-livraison/${deliveryForms.id_livraison}`

        if (deliveryForms.type_livraison_id === 5 || deliveryForms.type_livraison_id === 7) {
            linkSee = `/formulaire-chargeur/${deliveryForms.id_livraison}`
            // linkModify = `/form-modify-livraison-chargeur/${deliveryForms.id_livraison}`
        } else if (deliveryForms.type_livraison_id === 8){
            linkSee = `/formulaire-chargeur/${deliveryForms.id_livraison}`;
        }

        return(
            <span className="flex items-center">
                <Link to={linkSee}>
                    <button className="mx-1">
                        <i className="pi pi-eye"></i>
                    </button>
                </Link>
                {deliveryForms.statut_livraison == 'livre' ? 
                (
                    <>
                        {printingId === deliveryForms.id_livraison ? (
                            <span className='mx-1'>
                                <ProgressSpinner style={{width: '15px', height: '15px'}} strokeWidth="8" animationDuration=".5s" />
                            </span>
                        ) : (
                            <button onClick={() => handleGeneratePdf(deliveryForms.id_livraison)}><span className="mx-1 text-gray-500 text-theme-sm dark:text-gray-400"><i className="pi pi-print"></i></span></button>
                        )}
                    </>
                ) : (
                    <>
                        <>    
                            <Link to={linkModify}>
                                    <button className="mx-1 text-gray-500 text-theme-sm dark:text-gray-400">
                                        <i className="pi pi-pencil"></i>
                                    </button>
                            </Link>
                        </>
                    </>
                    
                )}
            </span>
        )
    }
    const filteredDeliveryForms = deliveryForms.filter((item) => {
        let itemDate = new Date(item.date_livraison);
        if(item.validations.length > 0){
            let index = item.validations.length-1
            itemDate = new Date(item.validations[index].date_validation)
        }
        const matchesStatus = selectedStatus ? item.statut_livraison === selectedStatus : true;
        const matchesType = selectedType ? selectedType.includes(item.type_livraison_id) : true;
        const matchesStartDate = startDate ? itemDate >= startDate : true;
        const matchesEndDate = endDate ? itemDate <= endDate : true;
        const matchesGlobalFilter = globalFilter
          ? JSON.stringify(item).toLowerCase().includes(globalFilter.toLowerCase())
          : true;
        return matchesStatus && matchesType && matchesStartDate && matchesEndDate && matchesGlobalFilter;
    });


    return(
        <>  
            <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="flex justify-normal flex-wrap gap-3 p-6">
                    <span>
                        <Input
                            className="relative"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Rechercher un formulaire..."
                        />
                    </span>
                    <Dropdown
                        value={selectedStatus}
                        options={statusOptions}
                        onChange={(e) => setSelectedStatus(e.value)}
                        placeholder="Filtrer par statut"
                        showClear
                        className="w-full sm:w-64"
                    />
                    <Dropdown
                        value={selectedType}
                        options={optionsType}
                        onChange={(e) => setSelectedType(e.value)}
                        placeholder="Filtrer par type de livraison"
                        showClear
                        className="w-full sm:w-64"
                    />
                    <Dropdown
                        value={selectedService}
                        options={optionsServices}
                        onChange={(e) => setselectedService(e.value)}
                        placeholder="Filtrer par service"
                        showClear
                        className="w-full sm:w-64"
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
                <div className="p-6 pt-0">
                    <span className="text-md text-gray-600 dark:text-gray-300">
                        {filteredDeliveryForms.length} formulaire(s) trouvé(s)
                    </span>
                </div>
                <div className="card">
                    <DataTable
                        value={filteredDeliveryForms}
                        loading={loading}
                        removableSort 
                        paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}
                        tableStyle={{ minWidth: '50rem' }}
                        emptyMessage="Aucune livraison trouvée"
                        className="p-datatable-sm">

                        <Column field="id_livraison" header="Formulaire" body={titleTemplate} sortable></Column>
                        <Column field="qte_totale_livraison" header="Nbre produit" sortable></Column>
                        <Column field="date_livraison" header="Date d'émission" body={deliveryDateTemplate} sortable></Column>
                        <Column header="Date de cloture" body={receiveDateTemplate}></Column>
                        <Column field="statut_livraison" header="Statut" body={statutTemplate}></Column>
                        <Column header="Actions" body={actionTemplate}></Column>
                    </DataTable>
                </div>
            </div>
        </>
    )
}