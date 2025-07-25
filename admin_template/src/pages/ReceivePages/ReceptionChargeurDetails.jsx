import { useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router';
import SignatureCanvas from 'react-signature-canvas'
import { useNavigate } from "react-router";

import Label from "../../components/form/Label";
import TextArea from "../../components/form/input/TextArea";

import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../../components/ui/table"
import {Modal} from "../../components/ui/modal/index"
import 'primeicons/primeicons.css';
import { ProgressSpinner } from 'primereact/progressspinner';

import { ProductDeliveries } from '../../backend/livraisons/productDeliveries';
import { Reception } from '../../backend/receptions/Reception';
import { generatePdf } from '../../backend/receptions/GeneratePDF';
import Swal from 'sweetalert2'
import { Stock } from '../../backend/stock/Stock';



export default function ReceptionChargeurDetails() {
    
    const productDeliveries = new ProductDeliveries();
    const reception = new Reception();
    const { id } = useParams();
    const user_id = localStorage.getItem("id")
    const role = localStorage.getItem("role_id")
    const navigate = useNavigate();

    const stock = new Stock()
    // const signatureRef = useRef(null);
    // const fd = new window.FormData()
    const [loading, setLoading] = useState(false);
    const [loadingValidate, setLoadingValidate] = useState(false);
    const [message, setMessage] = useState("");
    const [loadingPrint, setLoadingPrint] = useState(false);
    const [deliveryDetails, setDeliveryDetails] = useState('')
    const [typeLivraison, setTypeLivraison] = useState('')
    const [livraisonID, setLivraisonID] = useState('')
    const [dateLivraison, setDateLivraison] = useState('')
    const [signature, setSignature] = useState();
    const [signUrl, setSignUrl] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalReturnOpen, setIsModalReturnOpen] = useState(false);
    const [showSignButton, setShowSignButton] = useState(true);
    const [showValidateButton, setShowValidateButton] = useState(false);
    const [actionButtons, setActionButtons] = useState(false);
    const [commentaire, setCommentaire] = useState('');
    const [commentaireReception, setCommentaireReception] = useState('');
    const [statutLivraison, setStatutLivraison] = useState('en attente');
    const [statutClass, setStatutClass] = useState('text-sm rounded-xl p-1 bg-orange-100 text-orange-500 font-bold')
    const [recu, setRecu] = useState(false);
    const [errorReturn, setErrorReturn] = useState('');
    const [loadingReturn, setLoadingReturn] = useState(false);

    const [quantiteProduit, setQuantiteProduit] = useState(null)

    const [piece, setPiece] = useState(null)
    

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
                    console.log(data)
                    let index;
                    setDeliveryDetails({
                        ...data,
                        produitsLivre: JSON.parse(data.produitsLivre)
                      });
                    //   if(data.type_livraison_id == 1){
                    //     setTypeLivraison("TPE GIM")
                    //   } else if(data.type_livraison_id == 2){
                    //     setTypeLivraison("TPE REPARE")
                    //   } else if(data.type_livraison_id == 3){
                    //     setTypeLivraison("TPE MAJ")
                    //   } else if(data.type_livraison_id == 4){
                    //     setTypeLivraison("TPE MOBILE")
                    //   } else if(data.type_livraison_id == 5){
                    //     setTypeLivraison("CHARGEUR")
                    //   }
                      setDateLivraison(formatDate(data.date_livraison))
                      setLivraisonID(data.type_livraison_id)
                      setCommentaire(data.commentaire)

                      const produits = JSON.parse(data.produitsLivre)
                      setQuantiteProduit(produits.length)

                        let stockData;
                        stockData = await stock.getAllStock()
                        const chargeur = stockData.find(
                            (item) =>{
                                return item.id_piece == 1
                            }
                        )
                        if(chargeur){
                            setPiece(chargeur)
                        }
                      if(data.statut_livraison == 'livre'){
                        setShowSignButton(false)
                        setActionButtons(true)
                        setRecu(true)
                        setStatutLivraison('Livré')
                        setStatutClass('text-sm border rounded-xl p-1 bg-green-100 text-green-500 font-bold')
                        index = data.validations.length-1
                        setCommentaireReception(data.validations[index].commentaire)
                      }else if(data.statut_livraison == 'en_attente'){
                        setShowSignButton(false)
                        setActionButtons(false)
                        setRecu(true)
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
    // const handleSignature = () =>{
    //     console.log('yes')
    //     setSignUrl(signature.toDataURL('image/png'))
    //     setIsModalOpen(false)
    //     setShowSignButton(false)
    //     setShowValidateButton(true)
    // }
    // const handleDeleteSign = () =>{
    //     // signature.clear()
    //     setSignUrl(null)
    //     setShowSignButton(true)
    //     setShowValidateButton(false)
    // }
    const handleClear = () =>{
        console.log(signUrl)
        signature.clear()
    }
    const handleValidate = async (e) =>{
        e.preventDefault();
        
        setLoadingValidate(true);
        setIsModalOpen(false)
        let commentaire = message
        let is_old_validation = false

        if(signature.isEmpty()){
            setErrorSign('Vous devez signer pour valider !')
            return;
        }
        const sign = signature.toDataURL('image/png')

        try{
            const fd = new FormData();
            fd.append('livraison_id', id);
            fd.append('user_id', user_id);
            fd.append('commentaire', commentaire);
            fd.append('is_old_validation', is_old_validation);

            if (sign) {
                const blob = await fetch(sign).then(res => res.blob());
                fd.append('signature', blob, 'signature.png');
            }

            for (let [key, value] of fd.entries()) {
                console.log(`${key}:`, value);
            }

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
            const response = await reception.receive(fd);
            Swal.fire({
                    title: "Succès",
                    text: "Formulaire réceptionné avec succès",
                    icon: "success"
                  });
            console.log(response)
            navigate('/toutes-les-receptions');
        } catch(error){
            console.log(error)
        } finally{
            setLoadingValidate(false)
        }
    }


    const handleReturn = async (e) =>{
        e.preventDefault();
        e.preventDefault();
        if(role != 2){
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
        setLoadingValidate(true);
        setIsModalReturnOpen(false)
        const commentaire_return = message
        const livraison_id = id
        
        console.log('Commentaire de retour : ', commentaire_return)
        console.log('id livraison : ', livraison_id)
        console.log('user id : ', user_id)

        if(!commentaire_return){
            setErrorReturn("Ajoutez un commentaire avant de retourner une livraison!")
            return;
        }

        try{
            const response = await reception.returnDelivery(livraison_id, commentaire_return, user_id);
            Swal.fire({
                    title: "Succès",
                    text: "Livraison retournée avec succès",
                    icon: "success"
                    });
            console.log(response)
            
            navigate('/toutes-les-receptions');
        } catch(error){
            console.log(error)
        } finally{
            setLoadingReturn(false)
        }
    }

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
                <PageBreadcrumb pageTitle="Réception | CHARGEUR"/>
                <div>
                    <div className='my-6 flex justify-between items-center'>
                        <div>
                            <span>{`Réception du ${dateLivraison}`}</span>
                        </div>
                        {actionButtons? 
                        (
                            <div>
                                {/* <button className='m-3 text-2xl'><span><i className="pi pi-pencil"></i></span></button> */}
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
                            <></>
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
                                {/* <TableCell
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
                                </TableCell> */}
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
                                    {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
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
                                    </TableCell> */}
                                </TableRow>
                                ))}
                            </TableBody>

                            </Table>
                        </div>
                    </div>
                    <div className='w-full flex flex-col justify-center items-center'>
                        {showSignButton ? 
                        ( 
                            <>
                                {loadingValidate ? 
                                    <span className="mt-20">
                                        <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" animationDuration=".5s" />
                                    </span>
                                :
                                    <div className='flex'>
                                        <button onClick={() => {
                                            if(role != 2){
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
                                            if(role != 2){
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
                                            Réceptionner
                                        </button>
                                    </div>
                                }   
                            </>
                        )
                         : (<></>)}
                    </div>
                </div>
            </>)
            }
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="p-4 max-w-md">
                <div className='p-1'>
                    <div className='text-center mb-3 text-sm'>
                        <span>Signez manuellement pour valider la livraison</span>
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
                                value={message}
                                onChange={(value) => setMessage(value)}
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
        </>
    )
}