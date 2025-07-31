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

import {Modal} from "../../components/ui/modal/index"
import Swal from 'sweetalert2'
import SignatureCanvas from 'react-signature-canvas'
import { useNavigate } from "react-router";

import Label from "../../components/form/Label";
import TextArea from "../../components/form/input/TextArea";



export default function DemandeSupervisionDetails() {
    
    const demandes = new Demandes()
    const stock = new Stock()

    const { id } = useParams();
    const user_id = localStorage.getItem("id")
    const role = localStorage.getItem("role_id")
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
    const [signature, setSignature] = useState();
    const [signUrl, setSignUrl] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalReturnOpen, setIsModalReturnOpen] = useState(false);
    const [showSignButton, setShowSignButton] = useState(true);
    const [showValidateButton, setShowValidateButton] = useState(false);
    const [commentaireReception, setCommentaireReception] = useState('');
    const [errorReturn, setErrorReturn] = useState('');
    const [loadingReturn, setLoadingReturn] = useState(false);
    const [errorSign, setErrorSign] = useState('');
    const [isModalCancelOpen, setIsModalCancelOpen] = useState(false);
    const [errorCancel, setErrorCancel] = useState('');
    const [loadingValidate, setLoadingValidate] = useState(false);
    const [loadingDemande , setLoadingDemande] = useState(false);
    const [message, setMessage] = useState("");
    const [messageReturn, setMessageReturn] = useState("");
    const [messageCancel, setMessageCancel] = useState("");
    const navigate = useNavigate();
    const [isDelivered, setIsDelivered] = useState(false);
    const [typeDemandeId, setTypeDemandeId] = useState(null);

    const [serviceDemandeur, setServiceDemandeur] = useState('');
    const [nomDemandeur, setNomDemandeur] = useState('')
    const [stockDepart, setStockDepart] = useState('');
    const [quantiteDemandee, setQuantiteDemandee] = useState('')
    const [stockFinal, setStockFinal] = useState('')

    const [stockDT, setStockDT] = useState([])

    const [motifDemande, setMotifDemande] = useState('');

    const [pieceId, setPieceId] = useState(null);
    

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
                        setPieceId(pieceDemande.id_piece)
                    }
                    if(demandeData.statut_demande == 'valide'){
                        setActionButtons(true)
                        setShowSignButton(false)
                        setStatutDemande('Validée')
                        setStatutClass('text-sm border rounded-xl p-1 bg-green-100 text-green-500 font-bold')
                        setRecu(true)
                        index = demandeData.validation_demande.length-1
                        setCommentaireValidation(demandeData.validation_demande[index].commentaire)
                    }
                    else if(demandeData.statut_demande == 'retourne'){
                    setShowSignButton(false)
                    setActionButtons(false)
                    setRecu(true)
                    setStatutDemande('Retournée')
                    setStatutClass('text-sm border rounded-xl p-1 bg-red-100 text-red-500 font-bold')
                    index = demandeData.validation_demande.length-1
                    setCommentaireValidation(demandeData.validation_demande[index].commentaire)
                    }
                    else if(demandeData.statut_demande == 'refuse'){
                    setShowSignButton(false)
                    setActionButtons(false)
                    setRecu(true)
                    setStatutDemande('Refusée')
                    setStatutClass('text-sm rounded-xl p-1 bg-gray-dark text-white font-bold')
                    index = demandeData.validation_demande.length-1
                    setCommentaireValidation(demandeData.validation_demande[index].commentaire)
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
    // const handleDeleteSign = () =>{
    //     // signature.clear()
    //     setSignUrl(null)
    //     setShowSignButton(true)
    //     setShowValidateButton(false)
    // }
    // const handleSignature = () =>{
    //     if(signature.isEmpty()){
    //         setErrorSign('Vous devez signer pour valider !')
    //         return;
    //     }
    //     console.log(signature)
    //     setSignUrl(signature.toDataURL('image/png'))
    //     setIsModalOpen(false)
    //     setShowSignButton(false)
    //     setShowValidateButton(true)
    // }
        const handleClear = () =>{
            console.log(signUrl)
            signature.clear()
        }
        const handleValidate = async (e) =>{
            e.preventDefault();
            if(role != 3){
                Swal.fire({
                    title: "Error",
                    text: "Vous n'êtes pas authorisé à faire cette action !",
                    icon: "error"
                });
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                navigate('/signin');
                return
            }
            if(signature.isEmpty()){
                setErrorSign('Vous devez signer pour valider !')
                return;
            }
            const sign = signature.toDataURL('image/png')           
            let commentaire = message


            const stock_initial = stockDepart
            const nouveau_stock = stockFinal
            const piece_id = pieceId
            try{
                setLoadingDemande(true);
                setIsModalOpen(false)
                const fd = new FormData();
                fd.append('demande_id', id);
                fd.append('user_id', user_id);
                fd.append('commentaire', commentaire);
    
                if (sign) {
                const blob = await fetch(sign).then(res => res.blob());
                fd.append('signature', blob, 'signature.png');
                }

                for (let [key, value] of fd.entries()) {
                    console.log(`${key}:`, value);
                }
                const response = await demandes.validateDemande(fd);
                let modifStock = null
                let ajoutStock = null
                let utilisateur_id = null
                if(pieceId != 1){
                    modifStock = await stock.setStock(piece_id, stock_initial, nouveau_stock, utilisateur_id)
                }
                console.log(modifStock)
                console.log('Stock modifié')
                Swal.fire({
                        title: "Succès",
                        text: "Demande validée avec succès",
                        icon: "success"
                      });
                console.log(response)
                navigate('/toutes-les-demandes-supervision');
            } catch(error){
                console.log(error)
            } finally{
                setLoadingDemande(false)
            }
        }
    
        const handleReturn = async (e) =>{
            e.preventDefault();
            if(role != 3){
                Swal.fire({
                    title: "Error",
                    text: "Vous n'êtes pas authorisé à faire cette action !",
                    icon: "error"
                });
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                navigate('/signin');
                return
            }
            const demande_id = id;
            const type_demande_id = typeDemandeId;
            const commentaire_return = messageReturn;
    
            if(!commentaire_return){
                setErrorReturn("Ajoutez un commentaire avant de retourner une demande!")
                return;
            }
    
            try{
                setLoadingDemande(true);
                setIsModalReturnOpen(false);
                const response = await demandes.returnDemande(demande_id, commentaire_return, user_id, type_demande_id);

                Swal.fire({
                        title: "Succès",
                        text: "Demande retournée avec succès",
                        icon: "success"
                        });
                console.log(response)
                setIsModalReturnOpen(false)
                navigate('/toutes-les-demandes-supervision');
            } catch(error){
                console.log(error)
            } finally{
                setLoadingDemande(false)
            }
        }

        const handleCancel = async (e) =>{
            e.preventDefault();
            if(role != 3){
                Swal.fire({
                    title: "Error",
                    text: "Vous n'êtes pas authorisé à faire cette action !",
                    icon: "error"
                });
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                navigate('/signin');
                return
            }

            const demande_id = id;
            const type_demande_id = typeDemandeId;
            const commentaire_refus = messageCancel;
            
            if(!commentaire_refus){
                setErrorCancel("Ajoutez un commentaire avant de refuser la demande!")
                return;
            }
            try{
                setLoadingDemande(true);
                setIsModalCancelOpen(false);
                const response = await demandes.cancelDemande(demande_id, commentaire_refus, user_id, type_demande_id);
                Swal.fire({
                        title: "Succès",
                        text: "Demande refusée avec succès",
                        icon: "success"
                        });
                console.log(response)
                setIsModalReturnOpen(false)
                navigate('/toutes-les-demandes-supervision');
            } catch(error){
                console.log(error)
            } finally{
                setLoadingDemande(false)
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
                    <div className='w-full flex flex-col justify-center items-center'>
                        {showSignButton ? 
                        (
                            <>
                                {loadingDemande ? 
                                    <span className="mt-20">
                                        <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" animationDuration=".5s" />
                                    </span>
                                :
                                    <div className='flex'>
                                        <button onClick={() => {
                                            if(role != 3){
                                                Swal.fire({
                                                    title: "Error",
                                                    text: "Vous n'êtes pas authorisé à faire cette action !",
                                                    icon: "error"
                                                });
                                                localStorage.removeItem('token');
                                                localStorage.removeItem('username');
                                                navigate('/signin');
                                                return
                                            }
                                            setIsModalCancelOpen(true)
                                            }}
                                            className='w-48 my-10 text-white mx-3 bg-gray-dark rounded-2xl h-10 flex justify-center items-center'>
                                            Refuser
                                        </button>
                                        <button onClick={() => {
                                            if(role != 3){
                                                Swal.fire({
                                                    title: "Error",
                                                    text: "Vous n'êtes pas authorisé à faire cette action !",
                                                    icon: "error"
                                                });
                                                localStorage.removeItem('token');
                                                localStorage.removeItem('username');
                                                navigate('/signin');
                                                return
                                            }
                                            setIsModalReturnOpen(true)
                                            }}
                                            className='w-48 my-10 mx-3 bg-red-400 rounded-2xl h-10 flex justify-center items-center'>
                                            Retourner
                                        </button>
                                        <button onClick={() => {
                                            if(role != 3){
                                                Swal.fire({
                                                    title: "Error",
                                                    text: "Vous n'êtes pas authorisé à faire cette action !",
                                                    icon: "error"
                                                });
                                                localStorage.removeItem('token');
                                                localStorage.removeItem('username');
                                                navigate('/signin');
                                                return
                                            }
                                            setIsModalOpen(true)
                                            }}
                                            className='w-48 my-10 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                                            Valider
                                        </button>                                             
                                    </div>
                                }
                            
                            </> 
                        )
                            : (<></>)}
                    </div>
                    
                </div>
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="p-4 max-w-md">
                    <div className='p-1'>
                        <div className='text-center mb-3 text-sm'>
                            <span>Signez manuellement pour valider la demande</span>
                        </div>
                        <div className='flex flex-col justify-center items-center'>
                            <SignatureCanvas
                                ref={data=>setSignature(data)}
                                canvasProps={{ width: 300, height: 250, className: 'sigCanvas border border-gray-300 rounded' }}
                            />
                            <div className='w-full mt-3'>
                                <Label>Commentaire</Label>
                                <TextArea
                                    value={message}
                                    onChange={(value) => setMessage(value)}
                                    rows={4}
                                    placeholder="Ajoutez un commentaire"
                                />
                            </div>
                            <div className='w-full mt-6 flex justify-center items-center'>
                                <button
                                    onClick={handleClear}
                                    className='w-1/4 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                                    Clear
                                    </button>
                                    <button
                                    onClick={handleValidate}
                                    className='w-1/4 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                                    Valider
                                </button>
                            </div>  
                        </div>
                        <div className="text-center">
                            <span className="text-error-500 text-xs">
                                {errorSign}
                            </span>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={isModalReturnOpen} onClose={() => setIsModalReturnOpen(false)} className="p-4 max-w-md">
                    <div className='p-1'>
                        <div className='text-center mb-3 text-sm'>
                            <span>Indiquez la raison du retour pour valider</span>
                        </div>
                        <div className='flex flex-col justify-center items-center'>
                            <div className='w-full mt-3'>
                                <Label>Commentaire *</Label>
                                <TextArea
                                    value={messageReturn}
                                    onChange={(value) => setMessageReturn(value)}
                                    rows={4}
                                    placeholder="Ajoutez un commentaire"
                                    error={errorReturn}
                                    hint={errorReturn}
                                />
                            </div>
                            <div className='w-full mt-6 flex justify-center items-center'>
                                <button
                                    onClick={handleReturn}
                                    className='w-48 mx-3 bg-red-400 rounded-2xl h-10 flex justify-center items-center'>
                                    Retourner
                                </button>
                                <button
                                    onClick={() =>{
                                        setIsModalReturnOpen(false);
                                        setErrorReturn('')
                                    }}
                                    className='w-48 mx-3 bg-gray-400 rounded-2xl h-10 flex justify-center items-center'>
                                    Annuler
                                </button>
                            </div>  
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={isModalCancelOpen} onClose={() => setIsModalCancelOpen(false)} className='p-4 max-w-md'>
                    <div className='p-1'>
                        <div className='text-center mb-3 text-sm'>
                            <span>Indiquez la raison du refus pour valider</span>
                        </div>
                        <div className='flex flex-col justify-center items-center'>
                            <div className='w-full mt-3'>
                                <Label>Commentaire *</Label>
                                <TextArea
                                    value={messageCancel}
                                    onChange={(value) => setMessageCancel(value)}
                                    rows={4}
                                    placeholder="Ajoutez un commentaire"
                                    error={errorCancel}
                                    hint={errorCancel}
                                />
                            </div>
                            <div className='w-full mt-6 flex justify-center items-center'>
                                <button
                                    onClick={handleCancel}
                                    className='w-48 mx-3 bg-red-400 rounded-2xl h-10 flex justify-center items-center'>
                                    Refuser
                                </button>
                                <button
                                    onClick={() =>{
                                        setIsModalCancelOpen(false);
                                        setErrorCancel('')
                                    }}
                                    className='w-48 mx-3 bg-gray-400 rounded-2xl h-10 flex justify-center items-center'>
                                    Annuler
                                </button>
                            </div>  
                        </div>
                    </div>
                </Modal>
                
            </>)
            }
            
        </>
    )
}