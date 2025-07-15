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

import { ProductDeliveries } from '../../backend/livraisons/ProductDeliveries';
import { generatePdf } from '../../backend/receptions/GeneratePDF';
import { ProgressSpinner } from 'primereact/progressspinner';



export default function DeliveryDetails() {
    
    const productDeliveries = new ProductDeliveries()
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingPrint, setLoadingPrint] = useState(false);
    const [deliveryDetails, setDeliveryDetails] = useState('')
    const [typeLivraison, setTypeLivraison] = useState('')
    const [dateLivraison, setDateLivraison] = useState('')
    const [commentaire, setCommentaire] = useState('');
    const [commentaireReception, setCommentaireReception] = useState('');
    const [statutLivraison, setStatutLivraison] = useState('en attente');
    const [statutClass, setStatutClass] = useState('text-sm rounded-xl p-1 bg-orange-100 text-orange-500 font-bold')
    const [recu, setRecu] = useState(false);
    const [actionButtons, setActionButtons] = useState(false);
    const [attente, setAttente] = useState(true)

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR'); // or use any locale you want
      };


    useEffect( ()=>{
        if(id){
            const fetchDeliveryDetails = async () =>{
                try{
                    setLoading(true);
                    let data;
                    data = await productDeliveries.getOneLivraison(id);
                    let index;
                    console.log(data)
                    setDeliveryDetails({
                        ...data,
                        produitsLivre: JSON.parse(data.produitsLivre)
                      });
                      if(data.type_livraison_id == 1){
                        setTypeLivraison("TPE GIM")
                      } else if(data.type_livraison_id == 2){
                        setTypeLivraison("TPE REPARE")
                      } else if(data.type_livraison_id == 3){
                        setTypeLivraison("TPE MAJ")
                      } else if(data.type_livraison_id == 4){
                        setTypeLivraison("TPE MOBILE")
                      } else if(data.type_livraison_id == 5){
                        setTypeLivraison("CHARGEUR")
                      } else if(data.type_livraison_id == 6){
                        setTypeLivraison("TPE ECOBANK")
                      }
                      
                      setDateLivraison(formatDate(data.date_livraison))
                      setCommentaire(data.commentaire)
                      if(data.statut_livraison == 'livre'){
                        setActionButtons(true)
                        setStatutLivraison('Livré')
                        setAttente(false)
                        setStatutClass('text-sm border rounded-xl p-1 bg-green-100 text-green-500 font-bold')
                        setRecu(true)
                        index = data.validations.length-1
                        setCommentaireReception(data.validations[index].commentaire)
                      }
                      else if(data.statut_livraison == 'en_attente'){
                        setActionButtons(false)
                        setRecu(true)
                        setAttente(true)
                        setStatutLivraison('Retourné')
                        setStatutClass('text-sm border rounded-xl p-1 bg-red-100 text-red-500 font-bold')
                        index = data.validations.length-1
                        setCommentaireReception(data.validations[index].commentaire)
                      }
                } catch(error){
                    console.log("Error fetchind data ", error)
                } finally{
                    setLoading(false)
                }
            };
            fetchDeliveryDetails();
        }
    },[id]);

    const handleGeneratePdf = async () =>{
            setLoadingPrint(true);
            try{
                const blob = await generatePdf(id);
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
                <PageBreadcrumb pageTitle={`Livraison | ${typeLivraison}`}/>
                <div>
                    <div className='my-3 flex justify-between items-center'>
                        <span>{`Livraison du ${dateLivraison}`}</span>
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
                            </div>

                        ) : (
                            <>  
                                {attente ? 
                                (
                                   <Link to={`/form-modify-nouvelle-livraison/${deliveryDetails.id_livraison}`}>
                                        <button className='m-3 text-2xl'><span><i className="pi pi-pencil"></i></span></button>
                                   </Link>
                                ) : (
                                    
                                    <></>
                                )}
                            </>
                        )}
                    </div>
                    <div className='mb-3'>
                        <span className={statutClass}>
                            {statutLivraison}
                        </span>
                    </div>
                    <div className='overflow-hidden mb-6 pt-2 p-6 rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
                        <div className='mb-6 pb-2 w-full border-b'>
                            <span className='text-sm mr-2'>Commentaire livraison</span>
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
                                    <span className='text-sm mr-2'>Commentaire réception</span>
                                    <span className='text-sm'><i className="pi pi-comment"></i></span>
                                </div>
                            {commentaireReception ? (
                                <p className='text-sm text-orange-500 text-right'>{commentaireReception}</p>
                            ) : (
                                <p className='text-xs opacity-20 text-right'>Sans commentaire</p>
                            ) }
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Banque
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    OM
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    MTN
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    MOOV
                                </TableCell>
                                </TableRow>
                            </TableHeader>
                            {/* Table Body */}
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {deliveryDetails.produitsLivre?.map((item, index) => (
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
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {item.banque}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {item.mobile_money.includes("OM") ?
                                        ( <i className="pi pi-check" style={{ color: 'green' }}></i> ) : ""}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {item.mobile_money.includes("MTN") ?
                                        ( <i className="pi pi-check" style={{ color: 'green' }}></i> ) : ""}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {item.mobile_money.includes("MOOV") ?
                                        ( <i className="pi pi-check" style={{ color: 'green' }}></i> ) : ""}
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