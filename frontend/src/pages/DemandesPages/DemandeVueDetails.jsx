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
import { Stock } from '../../backend/stock/Stock';
import { ProgressSpinner } from 'primereact/progressspinner';



export default function DemandeVueDetails() {
    
    const demandes = new Demandes()
    const stock = new Stock()

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
    const [attente, setAttente] = useState(true)
    const [serviceDemandeur, setServiceDemandeur] = useState('');
    const [nomDemandeur, setNomDemandeur] = useState('')
    const [stockDepart, setStockDepart] = useState('');
    const [quantiteDemandee, setQuantiteDemandee] = useState('')
    const [stockFinal, setStockFinal] = useState('')

    const [stockDT, setStockDT] = useState([])
    const [motifDemande, setMotifDemande] = useState('');


    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR'); // or use any locale you want
      };


    useEffect( ()=>{
        if(id){
            const fetchDemandeDetails = async () =>{
                try{
                    setLoading(true);
                    let demandeData;
                    demandeData = await demandes.getOneDemande(id);
                    let index;
                    console.log(demandeData)

                    setDemandeDetails({
                        ...demandeData,
                        produit_demande: JSON.parse(demandeData.produit_demande)
                      });

                    let produits = JSON.parse(demandeData.produit_demande)
                    setStockDepart(produits.stockDepart)
                    setQuantiteDemandee(produits.quantite)
                    setStockFinal(produits.stockDepart - produits.quantite)

                    setMotifDemande(demandeData.motif_demande)
                    setNomDemandeur(demandeData.nom_demandeur)
                    setDateDemande(formatDate(demandeData.date_demande))
                    setCommentaire(demandeData.commentaire)
                      
                    let idService = demandeData.role_id_demandeur
                    if(idService == 7){
                        setServiceDemandeur('SUPPORT')
                    } else if(idService == 6){
                        setServiceDemandeur('MAINTENANCE')
                    } else if(idService == 1){
                        setServiceDemandeur('LIVRAISON')
                    }

                    let stockData;
                    stockData = await stock.getAllStock()
                    console.log(stockData)
                    setStockDT(stockData)
                    const piecesA920 = stockData.filter(item =>{
                    return item.model_id == 1;
                    });
                    const pieceDemande = piecesA920.find(
                        (item) =>{
                            return item.id_piece == demandeData.type_demande_id
                        }
                    )
                    if(pieceDemande){
                        setTypeDemande(pieceDemande.nom_piece.toUpperCase())
                    }

                    if(demandeData.statut_demande == 'valide'){
                        setActionButtons(true)
                        setStatutDemande('Validée')
                        setAttente(false)
                        setStatutClass('text-sm rounded-xl p-1 bg-green-100 text-green-500 font-bold')
                        setRecu(true)
                        index = demandeData.validation_demande.length-1
                        setCommentaireValidation(demandeData.validation_demande[index].commentaire)
                    }
                    else if(demandeData.statut_demande == 'retourne'){
                        setActionButtons(false)
                        setRecu(true)
                        setAttente(true)
                        setStatutDemande('Retournée')
                        setStatutClass('text-sm rounded-xl p-1 bg-red-100 text-red-500 font-bold')
                        index = demandeData.validation_demande.length-1
                        setCommentaireValidation(demandeData.validation_demande[index].commentaire)
                    }
                    else if(demandeData.statut_demande == 'refuse'){
                        setActionButtons(false)
                        setRecu(true)
                        setAttente(false)
                        setStatutDemande('Refusée')
                        setStatutClass('text-sm rounded-xl p-1 bg-gray-dark text-white font-bold')
                        index = demandeData.validation_demande.length-1
                        setCommentaireValidation(demandeData.validation_demande[index].commentaire)

                    // setCommentaireValidation(demandeData.validations[0].commentaire)
                    }
                    if(demandeData.demande_livree){
                        setIsDelivered(true);
                    }
                } catch(error){
                    console.log("Error fetchind data ", error)
                } finally{
                    setLoading(false)
                }
            };
            const fetchStock = async () =>{
                try{
                    // let stockData;
                    // stockData = await stock.getAllStock()
                    // console.log(stockData)
                    // setStockDT(stockData)
                    // const piecesA920 = stockData.filter(item =>{
                    // return item.model_id == 1;
                    // });
                    // const pieceDemande = piecesA920.find(
                    //     (item) =>{
                    //         return item.id_piece == demandeDetails.type_demande_id
                    //     }
                    // )
                    // if(pieceDemande){
                    //     setTypeDemande(pieceDemande.nom_piece.toUpperCase())
                    // }
                }catch(error){
                    console.log('Error fetching data ',error)
                } finally{
                    setLoading(false);
                }
            };
            fetchDemandeDetails();
            fetchStock();
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
                <PageBreadcrumb pageTitle="Mouvement de stock"/>
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
                            </div>

                        ) : (
                            <>  
                                {attente ? 
                                (
                                    // <Link to={`/modifier-demande/${demandeDetails.id_demande}`}>
                                    //     <button className='m-3 text-2xl'><span><i className="pi pi-pencil"></i></span></button>
                                    // </Link>
                                    <></>
                                ) : (
                                    <></>
                                )}
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
                    <div className='flex justify-center items-center'>
                        <div className='w-9/12 px-20 py-6 bg-white rounded-2xl border'>
                            <div className='w-full text-center mb-4'>
                                <span className='text-md underline'>
                                    Mouvement de stock DT
                                </span>
                            </div>
                            <div className='w-full text-center mb-4'>
                                <span className='font-bold'>
                                    {motifDemande}
                                </span>
                            </div>
                            <table className='border w-full'>
                                <tbody>
                                    <tr className='border h-15'>
                                        <th className='border w-1/2'>Pièce demandée</th>
                                        <th className='border w-1/2'>{typeDemande}</th>
                                    </tr>
                                    <tr className='border h-15'>
                                        <th className='border w-1/2'>Service demandeur</th>
                                        <th className='border w-1/2'>{serviceDemandeur}</th>
                                    </tr>
                                    <tr className='border h-15'>
                                        <th className='border w-1/2'>Demandeur</th>
                                        <th className='border w-1/2'>{nomDemandeur}</th>
                                    </tr>
                                    <tr className='border h-15'>
                                        <th className='border w-1/2'>Stock de départ</th>
                                        <th className='border w-1/2'>{stockDepart}</th>
                                    </tr>
                                    <tr className='border h-15'>
                                        <th className='border w-1/2'>Quantité demandée</th>
                                        <th className='border w-1/2'>{quantiteDemandee}</th>
                                    </tr>
                                    <tr className='border h-15'>
                                        <th className='border w-1/2'>Stock final</th>
                                        <th className='border w-1/2'>{stockFinal}</th>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            </>)
            }
            
        </>
    )
}