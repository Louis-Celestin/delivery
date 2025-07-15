import { useState, useEffect} from 'react';
import { useParams, Link } from 'react-router';

import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../../components/ui/table"

import 'primeicons/primeicons.css';

import { Demandes } from '../../backend/demandes/Demandes';
import { ProgressSpinner } from 'primereact/progressspinner';



export default function DemandeDeliveryDetails() {
    
    const demandes = new Demandes()
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingPrint, setLoadingPrint] = useState(false);
    const [demandeDetails, setDemandeDetails] = useState('')
    const [typeDemande, setTypeDemande] = useState('')
    const [dateDemande, setDateDemande] = useState('')
    const [actionButtons, setActionButtons] = useState(false);
    const [commentaire, setCommentaire] = useState('');
    const [commentaireValidation, setCommentaireValidation] = useState('');
    const [statutDemande, setStatutDemande] = useState('en attente');
    const [statutClass, setStatutClass] = useState('text-sm rounded-xl p-1 bg-orange-100 text-orange-500 font-bold')
    const [recu, setRecu] = useState(false);
    const [qteDemande , setQteDemande] = useState(0);
    const [isDelivered, setIsDelivered] = useState(false);

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR'); // or use any locale you want
      };


    useEffect( ()=>{
        if(id){
            const fetchDemandeDetails = async () =>{
                try{
                    setLoading(true);
                    let data;
                    data = await demandes.getOneDemande(id);
                    let index;
                    console.log(data)
                    setDemandeDetails({
                        ...data,
                        produit_demande: JSON.parse(data.produit_demande)
                      });
                    if(data.type_demande_id == 1){
                        setTypeDemande("CHARGEUR (DECOM RI NOK)")
                    }
                    
                    setDateDemande(formatDate(data.date_demande))
                    setCommentaire(data.commentaire)
                    setQteDemande(data.qte_total_demande)
                    if(data.statut_demande == 'valide'){
                        setActionButtons(true)
                        setStatutDemande('Validée')
                        setStatutClass('text-sm border rounded-xl p-1 bg-green-100 text-green-500 font-bold')
                        setRecu(true)
                        index = data.validation_demande.length-1
                        setCommentaireValidation(data.validation_demande[index].commentaire)
                    }
                    else if(data.statut_demande == 'retourne'){
                        // setActionButtons(false)
                        setRecu(true)
                        setStatutDemande('Retourné')
                        setStatutClass('text-sm border rounded-xl p-1 bg-red-100 text-red-500 font-bold')
                        index = data.validation_demande.length-1
                        setCommentaireValidation(data.validation_demande[index].commentaire)
                    } else if(data.statut_demande == 'refuse'){
                    setActionButtons(false)
                    setRecu(true)
                    setStatutDemande('Refusée')
                    setStatutClass('text-sm rounded-xl p-1 bg-gray-dark text-white font-bold')
                    index = data.validation_demande.length-1
                    setCommentaireValidation(data.validation_demande[index].commentaire)

                    // setCommentaireValidation(data.validations[0].commentaire)
                    }
                    if(data.demande_livree){
                        setIsDelivered(true);
                    }
                } catch(error){
                    console.log("Error fetchind data ", error)
                } finally{
                    setLoading(false)
                }
            };
            fetchDemandeDetails();
        }
    },[id]);

    const handleGeneratePdf = async () =>{
            setLoadingPrint(true);
            try{
                const blob = await demandes.getPdf(id);
                const fileURL = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
                window.open(fileURL, '_blank');
            }catch(error){
                console.log(error)
            }finally{
                setLoadingPrint(false);
            }
        }

    return (
        <>
            {loading ?
                (<>Loading...</>) :
            (<>
                <PageBreadcrumb pageTitle={`Demande | ${typeDemande}`}/>
                <div>
                    <div className='my-3 flex justify-between items-center'>
                        <span>{`Demande du ${dateDemande}`}</span>
                        {actionButtons? 
                        (
                            <div>
                                <>
                                    {loadingPrint ? (
                                        <span className='m-3'>
                                            <ProgressSpinner style={{width: '20px', height: '20px'}} strokeWidth="8" animationDuration=".5s" />
                                        </span>
                                    ) : (
                                        <button onClick={handleGeneratePdf} className='m-3 text-2xl'><span><i className="pi pi-print"></i></span></button>
                                    )}
                                </>
                                <>  
                                    {isDelivered ? (
                                        <></>
                                    ) : (
                                        <Link to={`/form-demande-support/${id}`}>
                                            <button className="mx-1">
                                                <i className="pi pi-send"></i>
                                            </button>
                                        </Link>
                                    )}
                                </>
                            </div>

                        ) : (
                            <>  
                                {/* {recu ? 
                                (
                                    <></>
                                ) : (
                                    <Link to={`/form-modify-nouvelle-demande-support/${demandeDetails.id_demande}`}>
                                        <button className='m-3 text-2xl'><span><i className="pi pi-pencil"></i></span></button>
                                    </Link>
                                )} */}
                            </>
                        )}
                    </div>
                    <div className='mb-3'>
                        <span className={statutClass}>
                            {statutDemande}
                        </span>
                    </div>
                    {isDelivered ? (
                        <div className='mb-3'>
                            <span className='rounded-2xl bg-cyan-400 p-1 text-sm text-white font-semibold'>
                                Cette demande a été livrée.
                            </span>
                        </div>
                    ) : (
                        <></>
                    )}
                    <div className='overflow-hidden mb-6 pt-2 p-6 rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
                        <div className='mb-6 pb-2 w-full border-b'>
                            <span className='text-sm mr-2'>Commentaire demandeur</span>
                            <span className='text-sm'><i className="pi pi-comment"></i></span>
                        </div>
                        {commentaire ? (
                            <p className='text-sm text-cyan-700'>{commentaire}</p>
                        ) : (
                            <p className='text-xs opacity-20'>Sans commentaire</p>
                        ) }
                    </div>
                    {recu ? (
                        <>
                            <div className='overflow-hidden mb-6 pt-2 p-6 rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
                                <div className='mb-6 pb-2 w-full border-b text-right'>
                                    <span className='text-sm mr-2'>Commentaire validateur</span>
                                    <span className='text-sm'><i className="pi pi-comment"></i></span>
                                </div>
                            {commentaireValidation ? (
                                <p className='text-sm text-orange-500 text-right'>{commentaireValidation}</p>
                            ) : (
                                <p className='text-xs opacity-20 text-right'>Sans commentaire</p>
                            ) }
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="pl-5 pt-3 text-theme-xs text-gray-500 ">
                            <span>Nombre de produits demandés : {qteDemande}</span>
                        </div>
                        <div className="max-w-full overflow-x-auto">
                            <Table>
                            {/* Table Header */}
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Point Marchand
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    S/N
                                </TableCell>
                                </TableRow>
                            </TableHeader>
                            {/* Table Body */}
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {demandeDetails.produit_demande?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                            {item.pointMarchand}
                                        </span>
                                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                            {item.caisse}
                                        </span>
                                        {item.commentaireTPE ? (
                                            <span className="block text-gray-700 text-theme-xs dark:text-gray-400">
                                            « {item.commentaireTPE} » 
                                            </span>
                                        ) : (
                                            <></>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {item.serialNumber}
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </>)
            }
            
        </>
    )
}