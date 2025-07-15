import {useState, useEffect} from "react";
import { Link } from "react-router";

import { Demandes } from "../../backend/demandes/Demandes";

import Input from "../form/input/InputField";
import { Calendar } from 'primereact/calendar';
import DatePicker from "../form/date-picker";

import 'primeicons/primeicons.css';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';

export default function AllDemandesDeliveriesList() {

    const demandes = new Demandes()
    const [demandeForms, setDemandeForms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [printingId, setPrintingId] = useState(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(null);
    const statusOptions = [
        { label: 'En cours', value: 'en_cours' },
        { label: 'Validée', value: 'valide' },
        { label : 'Refusée', value: 'refuse'},
    ];
    const [selectedType, setSelectedType] = useState(null)
    const typeOptions = [
        {label: 'Chargeur (Decom RI NOK)', value:[1]}, 
    ]
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect( ()=>{
        const fetchDemandeForms = async () =>{
            setLoading(true);
            try{
                let response = await demandes.getAllDemandes();
                console.log(response)
                setDemandeForms(response)
                
            } catch(error){
                console.log('Error fetching data ',error)
            } finally{
                setLoading(false);
            }
        }; fetchDemandeForms();
    },[])
    
    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR'); // or use any locale you want
      };

      const handleGeneratePdf = async (id) =>{
                  setPrintingId(id);
                  try{
                      const blob = await demandes.getPdf(id);
                      const fileURL = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
                      window.open(fileURL, '_blank');
                  }catch(error){
                      console.log(error)
                  }finally{
                      setPrintingId(null);
                  }
      }
    const titleTemplate = (demandeForms) =>{
        let title = '';
        let linkSee = `/demande-livraison/${demandeForms.id_demande}`;
        let titleClass = 'font-bold text-sm'

        if (demandeForms.type_demande_id === 1) {
            title = 'Demande CHARGEUR DECOM RI NOK';
        }
        return (
            <span className="flex flex-col">
                <Link key={demandeForms.id_demande}
                    to={linkSee} >
                    <span className={titleClass}>{title}</span>
                </Link>
              <span className="text-xs font-extralight">#{demandeForms.id_demande}</span>
            </span>
          );
    };
    const demandeDateTemplate = (demandeForms) =>{
        return (<span className="text-gray-500 text-theme-sm dark:text-gray-400">{formatDate(demandeForms.date_demande)}</span>)
    }
    const receiveDateTemplate = (demandeForms) =>{
        if(demandeForms.validation_demande.length>0){
            let index = demandeForms.validations.length-1
            return (<span className="text-gray-500 text-theme-sm dark:text-gray-400">{formatDate(demandeForms.validation_demande[index].date_validation_demande)}</span>) 
        }else{
            return (<></>)
        }
    }
    const statutTemplate = (demandeForms) =>{
        let statutClass = ''
        let statut =''
        if (demandeForms.statut_demande == 'en_cours'){
            statut = 'en cours';
            statutClass = 'text-xs border rounded-xl p-0.5 bg-orange-300'
        } else if (demandeForms.statut_demande == 'valide'){
            statut = 'validé';
            statutClass = 'text-xs border rounded-xl p-0.5 px-1 bg-green-300'
        } else if (demandeForms.statut_demande == 'retourne'){
            statut = 'retournée';
            statutClass = 'text-xs border rounded-xl p-0.5 px-1 bg-red-300'
        } else if (demandeForms.statut_demande == 'refuse'){
            statut = 'refusée';
            statutClass = 'text-xs text-white border rounded-xl p-0.5 px-1 bg-black'
        }
        return(
            <span className={statutClass}>{statut}</span>
        )
    }
    const actionTemplate = (demandeForms) =>{
        let linkSee = `/demande-livraison/${demandeForms.id_demande}`;
        let linkDelivery = `/form-demande-support/${demandeForms.id_demande}`;
        // let linkModify = `/form-modify-nouvelle-demande-support/${demandeForms.id_demande}`

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
                        <>
                            {printingId === demandeForms.id_demande ? (
                                <span className='mx-1'>
                                    <ProgressSpinner style={{width: '15px', height: '15px'}} strokeWidth="8" animationDuration=".5s" />
                                </span>
                            ) : (
                                <button onClick={() => handleGeneratePdf(demandeForms.id_demande)}><span className="mx-1 text-gray-500 text-theme-sm dark:text-gray-400"><i className="pi pi-print"></i></span></button>
                            )}
                        </>
                        <>  
                            {demandeForms.demande_livree ? 
                            
                            (
                                <></>
                            ) : (
                                <>
                                    <Link to={linkDelivery}>
                                        <button className="mx-1">
                                            <i className="pi pi-send"></i>
                                        </button>
                                    </Link>
                                </>
                            )}
                        </>
                    </>   
                ) : (
                    <>
                    </>
                    
                )}
            </span>
        )
    }
    const filteredDemandeForms = demandeForms.filter((item) => {
        let itemDate = new Date(item.date_demande);
        if(item.validation_demande.length > 0){
            let index = item.validations.length-1
            itemDate = new Date(item.validation_demande[index].date_validation_demande)
        }
        const matchesStatus = selectedStatus ? item.statut_demande === selectedStatus : true;
        const matchesType = selectedType ? selectedType.includes(item.type_demande_id) : true;
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
                <div className="flex justify-normal flex-wrap gap-3 mb-3 p-6">
                    <span>
                        <Input
                            className="relative"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Rechercher une demande..."
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
                        options={typeOptions}
                        onChange={(e) => setSelectedType(e.value)}
                        placeholder="Filtrer par type de demande"
                        showClear
                        className="w-full sm:w-64"
                    />
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
                                {/* <Calendar
                                value={startDate}
                                onChange={(e) => setStartDate(e.value)}
                                placeholder="Date de début"
                                dateFormat="dd/mm/yy"
                                showIcon
                                /> */}
                    {/* <div className="flex items-center">
                        <span>
                            <Link to={"/form-livraison"} className="bg-green-400 p-3 rounded-2xl ">
                                Nouvelle livraison
                            </Link>
                        </span>
                    </div> */}
                    
                </div>
                <div className="p-6 pt-0">
                    <span className="text-md text-gray-600 dark:text-gray-300">
                        {filteredDemandeForms.length} demande(s) trouvée(s)
                    </span>
                </div>
                <div className="card">
                    <DataTable
                        value={filteredDemandeForms}
                        loading={loading}
                        removableSort 
                        paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}
                        tableStyle={{ minWidth: '50rem' }}
                        emptyMessage="Aucune livraison trouvée"
                        className="p-datatable-sm">

                        <Column field="id_demande" header="Demande" body={titleTemplate} sortable></Column>
                        <Column field="qte_total_demande" header="Nbre produit" sortable></Column>
                        <Column field="date_demande" header="Date d'émission" body={demandeDateTemplate} sortable></Column>
                        <Column header="Date de cloture" body={receiveDateTemplate}></Column>
                        <Column field="statut_demande" header="Statut" body={statutTemplate}></Column>
                        <Column header="Actions" body={actionTemplate}></Column>
                    </DataTable>
                </div>
            </div>
        </>
    )
}