import { useState, useEffect} from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import 'primeicons/primeicons.css';
import { Demandes } from '../../backend/demandes/Demandes';
import { Stock } from '../../backend/stock/Stock';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Users } from '../../backend/users/Users';
import { ProductDeliveries } from '../../backend/livraisons/ProductDeliveries';
import {Modal} from "../../components/ui/modal/index"
import Swal from 'sweetalert2'
import SignatureCanvas from 'react-signature-canvas'
import Label from "../../components/form/Label";
import TextArea from "../../components/form/input/TextArea";



export default function DemandeDetails() {
    
    const demandes = new Demandes()
    const stock = new Stock()
    const { id } = useParams();
    const user_id = localStorage.getItem('id')
    const usersData = new Users() 
    const livraisonData = new ProductDeliveries()
    const navigate = useNavigate();


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

    const [userRoles, setUserRoles] = useState([])
    const [isCompleted, setIsCompleted] = useState(false)
    const [isValidateur, setIsValidateur] = useState(false)
    const [isModificateur, setIsModificateur] = useState(false)
    const [isDemandeur, setIsDemandeur] = useState(false)
    const [isLivreur, setIsLivreur] = useState(false)
    const [isReception, setIsReception] = useState(false)

    const [signature, setSignature] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalReturnOpen, setIsModalReturnOpen] = useState(false);
    const [errorReturn, setErrorReturn] = useState('');
    const [errorSign, setErrorSign] = useState('');
    const [isModalCancelOpen, setIsModalCancelOpen] = useState(false);
    const [errorCancel, setErrorCancel] = useState('');
    const [loadingDemande , setLoadingDemande] = useState(false);
    const [message, setMessage] = useState("");
    const [messageReturn, setMessageReturn] = useState("");
    const [messageCancel, setMessageCancel] = useState("");

    const [pieceId, setPieceId] = useState(null);

    const [livraisonDetails, setLivraisonDetails] = useState([]);
    const [livraisonID, setLivraisonID] = useState(null)
    const [statutLivraison, setStatutLivraison] = useState('en attente')
    const [statutClassLivraison, setStatutClassLivraison] = useState('text-sm rounded-xl p-1 bg-orange-100 text-orange-500 font-bold')
    const [dateLivraison, setDateLivraison] = useState('')
    const [commentaireLivraison, setCommentaireLivraison] = useState('')
    const [quantiteLivraison, setQuantiteLivraison] = useState('')
    const [nomLivreur, setNomLivreur] = useState('')
    

    const [loadingReception, setLoadingReception] = useState(false);
    const [isModalReceptionOpen, setIsModalReceptionOpen] = useState(false);
    const [isModalReturnLivraisonOpen, setIsModalReturnLivraisonOpen] = useState(false)
    const [messageReception, setMessageReception] = useState('')
    const [messageReturnLivraison, setMessageReturnLivraison] = useState('')
    const [errorSignReception, setErrorSignReception] = useState('')
    const [errorReturnLivraison, setErrorReturnLivraison] = useState('')
    const [signatureReception, setSignatureReception] = useState()

    const [commentaireReception, setCommentaireReception] = useState('')
    const [nomRecepteur, setNomRecepteur] = useState('')
    const [isReceived, setIsReceived] = useState(false)

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR'); // or use any locale you want
    };

    useEffect( ()=>{
        if(id){
            const fetchDemandeDetails = async () =>{
                try{
                    setLoading(true);

                    let userRoles_data = await usersData.getUserRoles(parseInt(user_id))
                    const roles_id = userRoles_data.roles.map((role) =>{
                        return role.id_role
                    })
                    setUserRoles(roles_id)
                    if(roles_id.includes(6)){
                        setIsModificateur(true)
                    }

                    let demandeData = await demandes.getOneDemande(id);
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

                    let idService = demandeData.service_demandeur

                    let servicesData = await usersData.getAllServices()
                    const service = servicesData.find((item) => {
                        return item.id == idService
                    })
                    console.log(idService)
                    setServiceDemandeur(service.nom_service.toUpperCase())

                    if(demandeData.statut_demande == 'en_cours'){
                        if(roles_id.includes(4)){
                            setIsValidateur(true)
                        }
                        if(roles_id.includes(3)){
                            setIsDemandeur(true)
                        }
                    }
                    if(demandeData.statut_demande == 'valide'){
                        setActionButtons(true)
                        setStatutDemande('Validée')
                        setAttente(false)
                        setStatutClass('text-sm rounded-xl p-1 bg-green-100 text-green-500 font-bold')
                        setRecu(true)
                        index = demandeData.validation_demande.length-1
                        setCommentaireValidation(demandeData.validation_demande[index].commentaire)
                        setIsCompleted(true)
                        if(demandeData.demande_livree){
                            setIsDelivered(true);
                        }else{
                            if(roles_id.includes(1)){
                                setIsLivreur(true)
                            }
                        }
                    }
                    else if(demandeData.statut_demande == 'retourne'){
                        if(roles_id.includes(3)){
                            setIsDemandeur(true)
                        }            
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

                    let livraison_data = await livraisonData.getOneLivraisonDemande(id)
                    let index_reception
                    console.log(livraison_data)
                    setLivraisonID(livraison_data.id)
                    setNomLivreur(livraison_data.Livraisons.nom_livreur)
                    setQuantiteLivraison(livraison_data.Livraisons.quantite_livraison)
                    setDateLivraison(formatDate(livraison_data.Livraisons.date_livraison))
                    setCommentaireLivraison(livraison_data.Livraisons.commentaire_livraison)


                    let statut_livraison = livraison_data.Livraisons.statut_livraison
                    if(statut_livraison == 'livre' || statut_livraison == 'retourne'){
                        setIsReceived(true)
                        index_reception = livraison_data.Livraisons.reception_livraison.length - 1
                        setCommentaireReception(livraison_data.Livraisons.reception_livraison[index_reception].commentaire_reception)
                        setNomRecepteur(livraison_data.Livraisons.reception_livraison[index_reception].nom_recepteur)

                        if(statut_livraison == 'livre'){
                            setStatutLivraison('Livrée')
                            setStatutClassLivraison('text-sm rounded-xl p-1 bg-green-100 text-green-500 font-bold')
                        } 
                        
                        else if(statut_livraison == 'retourne'){
                            if(roles_id.includes(12)){
                                setIsReception(true)
                            }
                            setStatutLivraison('Retournée')
                            setStatutClassLivraison('text-sm rounded-xl p-1 bg-red-100 text-red-500 font-bold')       
                        }
                    }
                    
                    else if(statut_livraison == 'en_cours'){
                        if(roles_id.includes(12)){
                            setIsReception(true)
                        }
                        setStatutLivraison('En attente')
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
            setLoadingPrint(false)
            Swal.fire({
                title: "Attention",
                text: "Une erreur s'est produite lors de la génération du formulaire",
                icon: "warning"
            });

        }finally{
            setLoadingPrint(false);
        }
    }

    const handleClear = () =>{
        
        signature.clear()
    }

    const handleClearReception = () =>{
        signatureReception.clear()
    }

    const handleValidate = async (e) =>{
        e.preventDefault();
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
            // if(pieceId != 1){
            //     modifStock = await stock.setStock(piece_id, stock_initial, nouveau_stock, utilisateur_id)
            // }
            // console.log(modifStock)
            // console.log('Stock modifié')
            Swal.fire({
                title: "Succès",
                text: "Demande validée avec succès",
                icon: "success"
                });
            console.log(response)
            navigate('/toutes-les-demandes');
        } catch(error){
            console.log(error)
            Swal.fire({
                title: "Attention",
                text: "Une erreur est survenue lors de la validation",
                icon: "warning"
            });
            navigate('/toutes-les-demandes');
        } finally{
            setLoadingDemande(false)
        }
    }

    const handleReturn = async (e) =>{
        e.preventDefault();
        if(!messageReturn){
            setErrorReturn("Ajoutez un commentaire avant de retourner une demande!")
            return;
        }

        const payload = {
            demande_id: id,
            commentaire_return: messageReturn,
            user_id: user_id,
        }
        try{
            setLoadingDemande(true);
            setIsModalReturnOpen(false);
            const response = await demandes.returnDemande(payload);

            Swal.fire({
                title: "Succès",
                text: "Demande retournée avec succès",
                icon: "success"
            });
            console.log(response)
            setIsModalReturnOpen(false)
            navigate('/toutes-les-demandes');
        } catch(error){
            console.log(error)
            Swal.fire({
                title: "Attention",
                text: "Une erreur est survenue lors du retour",
                icon: "warning"
            });
            navigate('/toutes-les-demandes');
        } finally{
            setLoadingDemande(false)
        }
    }

    const handleCancel = async (e) =>{
        e.preventDefault();
        
        if(!messageCancel){
            setErrorCancel("Ajoutez un commentaire avant de refuser la demande!")
            return;
        }

        const payload = {
            demande_id: id,
            commentaire_refus: messageCancel,
            user_id: user_id,
        }
        try{
            setLoadingDemande(true);
            setIsModalCancelOpen(false);
            const response = await demandes.cancelDemande(payload);
            Swal.fire({
                title: "Succès",
                text: "Demande refusée avec succès",
                icon: "success"
            });
            console.log(response)
            setIsModalReturnOpen(false)
            navigate('/toutes-les-demandes');
        } catch(error){
            console.log(error)
            Swal.fire({
                title: "Attention",
                text: "Une erreur est survenue lors du refus",
                icon: "warning"
            });
            navigate('/toutes-les-demandes');
        } finally{
            setLoadingDemande(false)
        }
    }

    const handleReception = async (e) =>{
        e.preventDefault();
        if(signatureReception.isEmpty()){
            setErrorSignReception('Vous devez signer pour valider !')
            return;
        }
        try{
            setLoadingReception(true);
            setIsModalReceptionOpen(false)
            const sign = signatureReception.toDataURL('image/png')
            const fd = new FormData();
            fd.append('livraison_id', livraisonID);
            fd.append('user_id', user_id);
            fd.append('commentaire', messageReception);
            if (sign) {
            const blob = await fetch(sign).then(res => res.blob());
            fd.append('signature', blob, 'signature.png');
            }
            for (let [key, value] of fd.entries()) {
                console.log(`${key}:`, value);
            }
            const response = await livraisonData.receiveStock(fd);
            
            // let piece_id = 1
            // let stock_initial = piece.quantite
            // let nouveau_stock = stock_initial - quantiteProduit
            // let utilisateur_id = null
            
            // let modifStock = null
            // if(livraisonID == 7 || livraisonID == 8 || livraisonID == 5){
            //     modifStock = await stock.setStock(piece_id, stock_initial, nouveau_stock, utilisateur_id)
            //     console.log(modifStock)
            //     console.log("Diminution stock chargeur")
            // }
            Swal.fire({
                title: "Succès",
                text: "Formulaire réceptionné avec succès",
                icon: "success"
            });
            console.log(response)
            navigate('/toutes-les-demandes');
        } catch(error){
            setLoadingReception(false)
            console.log(error)
            Swal.fire({
                title: "Attention",
                text: "Une erreur s'est produite lors de la réception",
                icon: "warning"
            });
            navigate('/toutes-les-demandes');
        } finally{
            setLoadingReception(false)
        }
    }

    const handleReturnLivraison = async (e) =>{
        e.preventDefault();
        if(!commentaire_return){
            setErrorReturnLivraison("Ajoutez un commentaire avant de retourner une livraison!")
            return;
        }
        const payload = {
            userId: user_id,
            livraison_id: livraisonID,
            commentaire_return: messageReturn,
        }
        try{
            setLoadingReception(true);
            setIsModalReturnLivraisonOpen(false);
            console.log("Sending payload: ", payload);
            // const response = await reception.returnDelivery(payload);
            Swal.fire({
                title: "Succès",
                text: "Livraison retournée avec succès",
                icon: "success"
            });
            // console.log(response)
            navigate('/toutes-les-demandes');
        } catch(error){
            console.log(error)
            Swal.fire({
                title: "Attention",
                text: "Une erreur s'est produite lors du retour de la livraison",
                icon: "warning"
            });
            console.log(response)
            navigate('/toutes-les-demandes');
        } finally{
            setLoadingReception(false)
        }
    }

    return (
        <>
            {loading ?
                (<>Loading...</>) :
            (<>
                <PageBreadcrumb pageTitle="Mouvement de stock"/>
                <div>
                    <div className='grid grid-cols-2 justify-between items-center mb-6'>
                        <div>
                            <div>
                                <span>{`Demande du ${dateDemande}`}</span>
                            </div>
                            <div className='mt-3'>
                                <span className={statutClass}>
                                    {statutDemande}
                                </span>
                            </div>
                            {isDelivered ? (
                                <div className='mt-3'>
                                    <span className='rounded-2xl bg-cyan-400 p-1 text-sm text-white font-semibold'>
                                        Cette demande a été livrée.
                                    </span>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className='text-right'>
                            <div className='grid grid-cols-2'>
                                <div className='col-start-2 space-y-0.5'>
                                    {isCompleted ? (
                                        <>
                                            {loadingPrint ? (
                                                <>
                                                    <div className='text-center'>
                                                        <span className=''>
                                                            <ProgressSpinner style={{width: '20px', height: '20px'}} strokeWidth="8" animationDuration=".5s" />
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <button className='bg-gray-100 rounded py-3 px-5 h-8 w-full flex items-center hover:bg-gray-200'
                                                        onClick={handleGeneratePdf}>
                                                        <span className='mr-4'><i className="pi pi-print"></i></span>
                                                        <span className='text-sm text-gray-700 font-medium'>Voir formulaire PDF</span> 
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    {isModificateur ? (
                                        <>
                                            <button className='bg-gray-100 rounded py-3 px-5 h-8 w-full flex items-center hover:bg-gray-200'>
                                               <span className='mr-4'><i className="pi pi-cog"></i></span>
                                               <span className='text-sm text-gray-700 font-medium'>Modification Admin</span> 
                                            </button>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    {isDemandeur ? (
                                        <>
                                            <Link to={`/modifier-demande/${demandeDetails.id_demande}`} className='bg-gray-100 rounded py-3 px-5 h-8 w-full flex items-center hover:bg-gray-200'>
                                               <span className='mr-4'><i className="pi pi-pencil"></i></span>
                                               <span className='text-sm text-gray-700 font-medium'>Modifier demande</span> 
                                            </Link>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    {isValidateur ? (
                                        <>
                                            {loadingDemande ? (
                                                <>
                                                    <div className='text-center'>
                                                        <span className=''>
                                                            <ProgressSpinner style={{width: '20px', height: '20px'}} strokeWidth="8" animationDuration=".5s" />
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <button className='bg-gray-100 rounded py-3 px-5 h-8 w-full flex items-center hover:bg-gray-200'
                                                        onClick={() =>{
                                                            setIsModalOpen(true)
                                                        }}>
                                                        <span className='mr-4'><i className="pi pi-check"></i></span>
                                                        <span className='text-sm text-gray-700 font-medium'>Valider demande</span> 
                                                    </button>
                                                    <button className='bg-gray-100 rounded py-3 px-5 h-8 w-full flex items-center hover:bg-gray-200'
                                                        onClick={() =>{
                                                            setIsModalReturnOpen(true)
                                                        }}>
                                                        <span className='mr-4'><i className="pi pi-arrow-left"></i></span>
                                                        <span className='text-sm text-gray-700 font-medium'>Retourner demande</span> 
                                                    </button>
                                                    <button className='bg-gray-100 rounded py-3 px-5 h-8 w-full flex items-center hover:bg-gray-200'
                                                        onClick={() =>{
                                                            setIsModalCancelOpen(true)
                                                        }}>
                                                        <span className='mr-4'><i className="pi pi-times"></i></span>
                                                        <span className='text-sm text-gray-700 font-medium'>Refuser demande</span> 
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    {isLivreur ? (
                                        <>
                                            <Link to={`/livraison-pieces/${demandeDetails.id_demande}`} className='bg-gray-100 rounded py-3 px-5 h-8 w-full flex items-center hover:bg-gray-200'>
                                               <span className='mr-4'><i className="pi pi-send"></i></span>
                                               <span className='text-sm text-gray-700 font-medium'>Faire livraison</span> 
                                            </Link>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    {isReception ? (
                                        <>
                                            {loadingReception ? (
                                                <>
                                                    <div className='text-center'>
                                                        <span className=''>
                                                            <ProgressSpinner style={{width: '20px', height: '20px'}} strokeWidth="8" animationDuration=".5s" />
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <button className='bg-gray-100 rounded py-3 px-5 h-8 w-full flex items-center hover:bg-gray-200'
                                                        onClick={() =>{
                                                            setIsModalReceptionOpen(true)
                                                        }}>
                                                        <span className='mr-4'><i className="pi pi-inbox"></i></span>
                                                        <span className='text-sm text-gray-700 font-medium'>Réceptionner livraison</span> 
                                                    </button>
                                                    <button className='bg-gray-100 rounded py-3 px-5 h-8 w-full flex items-center hover:bg-gray-200'
                                                        onClick={() =>{
                                                            setIsModalReturnLivraisonOpen(true)
                                                        }}>
                                                        <span className='mr-4'><i className="pi pi-arrow-left"></i></span>
                                                        <span className='text-sm text-gray-700 font-medium'>Retourner livraison</span> 
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
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
                    {
                        isDelivered ? (
                            <>
                                <div className='grid grid-cols-2 justify-between items-center mb-6'>
                                    <div>
                                        <div>
                                            <span>{`Livraison du ${dateLivraison}`}</span>
                                        </div>
                                        <div className='mt-3'>
                                            <span className={statutClassLivraison}>
                                                {statutLivraison}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className='overflow-hidden mb-6 pt-2 p-6 rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
                                        <div className='mb-6 pb-2 w-full border-b'>
                                            <span className='text-sm mr-2'>Commentaire livraison</span>
                                            <span className='text-sm'><i className="pi pi-comment"></i></span>
                                        </div>
                                        {commentaireLivraison ? (
                                            <p className='text-sm text-cyan-700'>{commentaireLivraison}</p>
                                        ) : (
                                            <p className='text-xs opacity-20'>Sans commentaire</p>
                                        ) }
                                    </div>
                                </div>
                                {isReceived ? (
                                    <div>
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
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </>
                        ) : (
                            <></>
                        )
                    }

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
                                    {isDelivered ? (
                                        <>  
                                            <tr className='border h-15'>
                                                <th className='border w-1/2'>Livreur</th>
                                                <th className='border w-1/2'>{nomLivreur}</th>
                                            </tr>
                                            <tr className='border h-15'>
                                                <th className='border w-1/2'>Quantité livrée</th>
                                                <th className='border w-1/2'>{quantiteLivraison}</th>
                                            </tr>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    {isReceived ? (
                                        <>
                                            <tr className='border h-15'>
                                                <th className='border w-1/2'>Recepteur</th>
                                                <th className='border w-1/2'>{nomRecepteur}</th>
                                            </tr>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            </>)
            }

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
            <Modal isOpen={isModalReceptionOpen} onClose={() => setIsModalReceptionOpen(false)} className="p-4 max-w-md">
                <div className='p-1'>
                    <div className='text-center mb-3 text-sm'>
                        <span>Signez manuellement pour valider la livraison</span>
                    </div>
                    <div className='flex flex-col justify-center items-center'>
                        <SignatureCanvas
                            ref={data=>setSignatureReception(data)}
                            canvasProps={{ width: 300, height: 250, className: 'sigCanvas border border-gray-300 rounded' }}
                        />
                        <div className='w-full mt-3'>
                            <Label>Commentaire</Label>
                            <TextArea
                                value={messageReception}
                                onChange={(value) => setMessageReception(value)}
                                rows={4}
                                placeholder="Ajoutez un commentaire"
                            />
                        </div>
                        <div className='w-full mt-6 flex justify-center items-center'>
                            <button
                                onClick={handleClearReception}
                                className='w-1/4 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                                Clear
                                </button>
                                <button
                                onClick={handleReception}
                                className='w-1/4 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                                Valider
                            </button>
                        </div>  
                    </div>
                    <div className="text-center">
                        <span className="text-error-500 text-xs">
                            {errorSignReception}
                        </span>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={isModalReturnLivraisonOpen} onClose={() => setIsModalReturnLivraisonOpen(false)} className="p-4 max-w-md">
                <div className='p-1'>
                    <div className='text-center mb-3 text-sm'>
                        <span>Indiquez la raison du retour pour valider</span>
                    </div>
                    <div className='flex flex-col justify-center items-center'>
                        <div className='w-full mt-3'>
                            <Label>Commentaire *</Label>
                            <TextArea
                                value={messageReturnLivraison}
                                onChange={(value) => setMessageReturnLivraison(value)}
                                rows={4}
                                placeholder="Ajoutez un commentaire"
                                error={errorReturnLivraison}
                                hint={errorReturnLivraison}
                            />
                        </div>
                        <div className='w-full mt-6 flex justify-center items-center'>
                            <button
                                onClick={handleReturnLivraison}
                                className='w-48 mx-3 bg-red-400 rounded-2xl h-10 flex justify-center items-center'>
                                Retourner
                            </button>
                            <button
                                onClick={() =>{
                                    setIsModalReturnLivraisonOpen(false);
                                    setErrorReturn('')
                                }}
                                className='w-48 mx-3 bg-gray-400 rounded-2xl h-10 flex justify-center items-center'>
                                Annuler
                            </button>
                        </div>  
                    </div>
                </div>
            </Modal>
            
        </>
    )
}