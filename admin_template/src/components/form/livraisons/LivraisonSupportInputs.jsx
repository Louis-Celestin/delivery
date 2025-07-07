import { useEffect, useState, useRef } from "react";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import Input from "../input/InputField.tsx";
import Checkbox from "../input/Checkbox";
import Select from "../Select.tsx";
import DatePicker from "../date-picker.tsx";
import TextArea from "../input/TextArea";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { PlusIcon, ListIcon, RefreshTimeIcon } from "../../../icons/index.ts";
import 'primeicons/primeicons.css'; 
import { ProgressSpinner } from 'primereact/progressspinner';
import { Merchants } from "../../../backend/livraisons/Merchants.js";
import { ProductDeliveries } from "../../../backend/livraisons/ProductDeliveries.js";
import { Demandes } from "../../../backend/demandes/Demandes.js";
import Swal from 'sweetalert2'
import { Modal } from "../../ui/modal/index.tsx";
import { useNavigate, useParams } from "react-router";
import SignatureCanvas from 'react-signature-canvas'



export default function LivraisonSupportInputs() {

    const productDeliveries = new ProductDeliveries();
    const demandes = new Demandes()
    const userId = localStorage.getItem('id');
    const role = localStorage.getItem("role_id")
    const { id } = useParams();
    const navigate = useNavigate();
    const [terminalSN, setTerminalSN] = useState('');
    const [pointMarchand, setPointMarchand] = useState('')
    const [loadingMerchant, setLoadingMerchant] = useState(false);
    const [loadingDelivery, setLoadingDelivery] = useState(false);
    const [message, setMessage] = useState("");
    const [produitsLivreTable, setProduitsLivresTable] = useState([]);
    const [produitsLivre, setProduitsLivres] = useState([]);
    const [error, setError] = useState(null);
    const [errorForm, setErrorForm] = useState(null);
    const [errorDeliver, setErrorDeliver] = useState(null);
    const [loadingDemandeInfos, setLoadingDemandeInfos] = useState(false);
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [signature, setSignature] = useState();
    const [signUrl, setSignUrl] = useState();
    const [typeLivraison, setTypeLivraison] = useState('');
    const [livraisonID, setLivraisonID] = useState(null);
    const [errorSign, setErrorSign] = useState('');
    const [demandeForm, setDemandeForm] = useState([]);

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR'); // or use any locale you want
      };
  
    // const ChangeTypeLivraison = (value) => {
    //   console.log("Selected value:", value);
    //   setTypeLivraison(value);
    //   if(value == 'TPE GIM'){
    //     setLivraisonID(1);
    //   }else if(value == 'TPE REPARE'){
    //     setLivraisonID(2);
    //   }else if(value == 'TPE MAJ GIM'){
    //     setLivraisonID(3)
    //   }else if(value == 'TPE MOBILE'){
    //     setLivraisonID(4)
    //   }else if(value == 'CHARGEUR'){
    //     setLivraisonID(5)
    //   }else if(value == 'TPE ECOBANK'){
    //   setLivraisonID(6)
    // }
    // };
    
    useEffect( ()=>{
        const fetchDemandeInfos = async () => {
        setLoadingDemandeInfos(true)
        try{
            let data;
            data = await demandes.getOneDemande(id);
            console.log(data)
            const parsedProduitsDemandes = JSON.parse(data.produit_demande);
            setDemandeForm(data);
            setProduitsLivres(parsedProduitsDemandes);
            setProduitsLivresTable(parsedProduitsDemandes);
            switch (data.type_demande_id) {
            case 1: 
            setTypeLivraison("CHARGEUR (DECOM RI NOK)"); 
            setLivraisonID(8);
            break;

            default: setTypeLivraison("Inconnu"); break;
        }
        }catch(error){
            console.log('Error fetching data ',error)
            setErrorForm('Erreur lors de la génération du formulaire')

        }finally{
            setLoadingDemandeInfos(false)
        }
    }
    // const fetchTerminalInfos = async () => {
    //     setLoadingMerchant(true)
    //     try{
    //       let data;
    //       data = await merchants.findMerchant();
    //       console.log(data)
    //       setTerminals(data)
    //     }catch(error){
    //       console.log('Error fetching data ',error)
    //       setErrorForm('Erreur lors de la génération du formulaire')
  
    //     }finally{
    //       setLoadingMerchant(false)
    //     }
    // };
    fetchDemandeInfos();
    // fetchTerminalInfos();
    
    },[id])

  const handleConfirm = () => {

    if(role != 1){
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
    
    let banque = ''
    banque = filteredPointMarchand.map((terminal) => terminal.BANQUE).join("-");

    if(!livraisonID){
      setErrorAjout("Vous devez choisir le type de livraison !");
      return;
    }
    if (!filteredPointMarchand || filteredPointMarchand.length === 0 || terminalSN.length < 10) {
      setErrorAjout("S/N invalide !");
      return;
    }
    const isDuplicate = produitsLivre.some(prod => prod.serialNumber === terminalSN);
    if (isDuplicate) {
      setErrorAjout("Ce numéro de série a déjà été ajouté !");
      return;
    }
    if (livraisonID == 1 && !banque){
      setErrorAjout("Ce Terminal n'est pas bancaire !");
      return;
    }
    if (livraisonID == 6 && !banque){
      setErrorAjout("Ce Terminal n'est pas bancaire !");
      return;
    }
    if (livraisonID == 6 && !(banque === 'ECOBANK' || banque === 'ECOBANK CI')){
      setErrorAjout("Ce Terminal n'est pas ecobank !");
      return;
    }
    if (livraisonID == 1 && (banque === 'ECOBANK' || banque === 'ECOBANK CI')){
      setErrorAjout("Ce Terminal n'est pas GIM !");
      return;
    }
    if(livraisonID == 4 && banque){
      setErrorAjout("Ce terminal est bancaire.");
      return;
    }
    const localMobileMoney = [];
     if (filteredPointMarchand.length > 0 && filteredPointMarchand.some((terminal) => terminal.NUM_ORANGE?.startsWith("07"))){
      setOrangeChecked(true)};
    if (filteredPointMarchand.length > 0 && filteredPointMarchand.some((terminal) => terminal.NUM_MTN?.startsWith("05"))){
      setMTNChecked(true)};
    if (filteredPointMarchand.length > 0 && filteredPointMarchand.some((terminal) => terminal.NUM_MOOV?.startsWith("01"))){
      setMOOVChecked(true)};
    
    // if (isOrangeChecked) localMobileMoney.push("OM");
    // if (isMTNChecked) localMobileMoney.push("MTN");
    // if (isMOOVChecked) localMobileMoney.push("MOOV");
    
    setErrorAjout('')
    setIsConfirmModalOpen(true)
  }

    

  const handleAjout = (e) => {
    e.preventDefault(); // prevent page reload

    console.log('Trying to ADD.....')
    const localMobileMoney = [];
    if (isOrangeChecked) localMobileMoney.push("OM");
    if (isMTNChecked) localMobileMoney.push("MTN");
    if (isMOOVChecked) localMobileMoney.push("MOOV");

    if (!filteredPointMarchand || filteredPointMarchand.length === 0) {
      setErrorAjout("S/N invalide");
      return;
    }
    const isDuplicate = produitsLivre.some(prod => prod.serialNumber === terminalSN);
    if (isDuplicate) {
      setErrorAjout("Ce numéro de série a déjà été ajouté.");
      return;
    }

    const newProduit = {
      pointMarchand: filteredPointMarchand.map((terminal) => terminal.POINT_MARCHAND).join(", "),
      caisse: filteredPointMarchand.map((terminal) => terminal.TPE).join(","),
      serialNumber: terminalSN,
      banque: filteredPointMarchand.map((terminal) => terminal.BANQUE).join(", "),
      mobile_money: localMobileMoney,
      commentaireTPE: messageTPE,
    };
  
    setProduitsLivresTable((prev) => [...prev, newProduit]);
    setProduitsLivres((prev) => [...prev, newProduit]);
  
    // Optional: Reset form fields
    setTerminalSN('');
    setMessageTPE('')
    setOrangeChecked(false);
    setMTNChecked(false);
    setMOOVChecked(false);
    setMobileMoney([]);
    setIsConfirmModalOpen(false)
}

const handleValidate = () =>{
    if(role != 1){
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
    if(demandeForm.statut_demande != 'valide'){
        Swal.fire({
            title: "Error",
            text: "La demande n'est pas validée !",
            icon: "error"
        });
        navigate('/toutes-les-demandes-livraison');
        return
    }
    if(demandeForm.demande_livree){
      Swal.fire({
            title: "Error",
            text: "La demande a déjà été livrée!",
            icon: "error"
        });
        navigate('/toutes-les-demandes-livraison');
        return
    }
    if(produitsLivre.length == 0){
       Swal.fire({
      title: "Error",
      text: "Vous devez ajouter au moins un TPE.",
      icon: "error"
      });
      return;
    }
    setIsSignatureModalOpen(true)
}

  // const handleSignature = () =>{
  //   setSignUrl(signature.toDataURL('image/png'))
  //   setIsModalOpen(false)
  //   setShowSignButton(false)
  //   setShowValidateButton(true)
  // }

const handleClear = () =>{
    console.log(signUrl)
    signature.clear()
}

const handleDeliver = async (e) => {
    e.preventDefault();

    if(produitsLivre.length == 0){
       Swal.fire({
      title: "Error",
      text: "Vous devez ajouter au moins un TPE.",
      icon: "error"
      });
      return;
    }

    if(signature.isEmpty()){
      setErrorSign('Vous devez signer pour valider !')
      return;
    }
    setLoadingDelivery(true);
    setIsSignatureModalOpen(false)
    // setSignUrl(signature.toDataURL('image/png'))
    const sign = signature.toDataURL('image/png')

    const fd = new FormData();

    const commentaire = message;
    const type_livraison_id = livraisonID
    const user_id = userId;
    const isAncienne = false;
    const demande_id = id;
    
    
    fd.append('commentaire',commentaire);
    fd.append('type_livraison_id',livraisonID);
    fd.append('user_id',userId);
    fd.append('isAncienne',isAncienne)
    fd.append('produitsLivre',JSON.stringify(produitsLivre))
    if (sign) {
      const blob = await fetch(sign).then(res => res.blob());
      fd.append('signature_expediteur', blob, 'signature.png');
    }
    fd.append('demande_id', demande_id);


    // console.log(blob)
    console.log('Trying to create form...')
    console.log('Commentaire : ',commentaire)
    console.log('ID Livraison : ',type_livraison_id)
    console.log('ID User', user_id)
    console.log('Ancienne ? ', isAncienne)
    console.log('Produits livrés : ',produitsLivre)
    console.log('ID Demande : ', demande_id)
    

    try{
    // const response = await productDeliveries.deliver(commentaire, type_livraison_id, user_id, isAncienne, produitsLivre)
    const response = await productDeliveries.deliverDemande(fd)

    console.log(response);
    console.log('Formulaire créé')
    Swal.fire({
      title: "Succès",
      text: "Formulaire créé avec succès",
      icon: "success"
    });
    navigate('/toutes-les-livraisons');
    }catch (error) {
      console.log('error')
      setError('Erreur lors de la génération du formulaire');
    }finally{
      setProduitsLivres([])
      setProduitsLivresTable([])
      setLoadingDelivery(false)
    } 
}

  const filteredPointMarchand = terminalSN ? 
  terminals.filter((terminal) => 
        terminal.SERIAL_NUMBER.includes(terminalSN)) : [];

  const handleDelete = (indexToRemove) => {
    if(role != 1){
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
    setProduitsLivresTable((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    setProduitsLivres((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  
  return (
    <>
      <div className="flex justify-center mb-6">
        <>
            <ComponentCard className="w-1/2" title={`Livraison ${typeLivraison}`}>
                <div className="space-y-6">
                    <div className="pb-3 text-center">
                        <span className="text-sm font-semibold">Informations générales</span>
                    </div>
                    {/* <div>
                        <Label>Type de Livraison *</Label>
                        <Select
                        options={options_livraison}
                        defaultValue={typeLivraison}
                        placeholder="Select an option"
                        onChange={ChangeTypeLivraison}
                        className="dark:bg-dark-900"
                        
                        />
                    </div> */}
                    <div>
                        <Label>Description</Label>
                        <TextArea
                        value={message}
                        onChange={(value) => setMessage(value)}
                        rows={4}
                        placeholder="Ajoutez un commentaire"
                        />
                    </div>

                    {/* <div className="pb-3 text-center">
                        <span className="text-sm font-semibold">Informations sur produits</span>
                    </div>

                    <div>
                        <Label htmlFor="input">Numéro de série *</Label>
                        <Input type="text" id="input" value={terminalSN} onChange={(e) =>{
                        const value = e.target.value
                        // Allow only digits
                        if (/^\d*$/.test(value)){
                        // Only allow up to 10 characters
                            if (value.length <= 10) {
                            setTerminalSN(value);
                            }} 
                            }}
                        />
                    </div>
                    <div>
                        <Label>Point Marchand</Label>
                        <Input type="text" id="input"
                                className="cursor-default"
                                value={filteredPointMarchand.map((terminal) => terminal.POINT_MARCHAND).join(" - ")}
                                readOnly
                                />
                    </div>
                    {selectedChargeur ? 
                    (<></>) : 
                    (
                        <>
                        <div>
                            <Label>Banque</Label>
                            <Input type="text" id="input" 
                                    className="cursor-default"
                                    value={filteredPointMarchand.map((terminal) => terminal.BANQUE).join(" - ")}
                                    readOnly
                                    />
                        </div>
                        <div>
                            <Input type="text" id="input" 
                                    value={filteredPointMarchand.map((terminal) => terminal.TPE).join(" - ")}
                                    className="hidden"/>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3 my-2">
                            <Checkbox
                            checked={
                                filteredPointMarchand.length > 0 &&
                                filteredPointMarchand.some((terminal) =>
                                    terminal.NUM_ORANGE?.startsWith("07")
                                )
                                }
                                onChange={(e)=>{}}
                                readOnly
                                label="Orange Money" />
                            </div>
                            <div className="flex items-center gap-3 my-2">
                            <Checkbox 
                            checked={
                                filteredPointMarchand.length > 0 &&
                                filteredPointMarchand.some((terminal) =>
                                    terminal.NUM_MTN?.startsWith("05")
                                )
                                }
                                onChange={(e)=>{}}
                                readOnly
                            label="MTN Money" />
                            </div>
                            <div className="flex items-center gap-3 my-2">
                            <Checkbox 
                            checked={
                                filteredPointMarchand.length > 0 &&
                                filteredPointMarchand.some((terminal) =>
                                    terminal.NUM_MOOV?.startsWith("01")
                                )
                                }
                                onChange={(e)=>{}}
                                readOnly 
                            label="MOOV Money" />
                            </div>
                        </div>
                        </>
                    )}
                    <div>
                        <button onClick={handleConfirm} className="w-full bg-green-400 rounded-2xl h-10 flex items-center justify-center">
                        <span>Ajouter</span>
                        <span className="text-2xl"><PlusIcon /></span>
                        </button>
                        <div>
                        <span className="text-error-600 font-medium flex items-center justify-center text-sm p-1 mt-4">
                            {errorAjout}
                        </span>
                        </div>
                    </div> */}
                </div>
            </ComponentCard>
        </>
      </div>
      <div>
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
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Supprimer
                  </TableCell> */}
                </TableRow>
              </TableHeader>
              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {produitsLivreTable.map((item, index) => (
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
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(index)}
                        >
                        <i className="pi pi-trash" style={{ color: 'black' }}></i>
                      </button>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </div>
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          {loadingDelivery? 
            <span className="mt-20">
              <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" animationDuration=".5s" />
            </span>
          : 
            <div className="flex">
                <button onClick={handleValidate} className=" mt-20 w-50 mx-1 bg-green-400 rounded-2xl h-10 flex justify-center items-center">
                    <span>Valider livraison</span>
                    <span className="text-2xl"><ListIcon /></span>
                </button> 
            </div>
            }
            {errorDeliver?
              <span className="text-error-600 font-medium flex items-center justify-center text-sm p-1 mt-4">
                {errorDeliver}
              </span>
            :
              <></>
            }
        </div>
      </div>
      {/* <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} className="p-4 max-w-xl">
        <div className="p-6 mt-5">
          <div>
            <span>Vous allez ajouter un terminal pour livraison :  <span className="font-bold text-red-700">{typeLivraison}</span></span>
          </div>
          <div>
            <div>
              <span>S/N terminal : <span className="font-bold text-red-700">{terminalSN}</span></span>
            </div>
            <div>
              <span>Point Marchand : <span className="font-bold text-red-700">{filteredPointMarchand.map((terminal) => terminal.POINT_MARCHAND).join("%")}</span></span>
            </div>
            <div>
              <span> Banque : <span className="font-bold text-red-700">{filteredPointMarchand.map((terminal) => terminal.BANQUE).join("%")}</span></span>
            </div>
            <div className="flex flex-col">
              <span>Mobile Money : </span>
              <ul>
                <li className="font-bold text-red-700">
                  {isOrangeChecked ? 
                    (<> Orange Money </>):
                    (<></>)
                  }
                </li>
                <li className="font-bold text-red-700">
                  {isMTNChecked ? 
                    (<> MTN Money </>):
                    (<></>)
                  }
                </li>
                <li className="font-bold text-red-700">
                  {isMOOVChecked ? 
                    (<> MOOV Money </>):
                    (<></>)
                  }
                </li>
              </ul>
              
              
            </div>
          </div>
        </div>
        <div className='w-full mt-6 flex justify-center items-center'>
          <button
            onClick={handleAjout}
            className='w-1/4 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
            Valider
          </button>
        </div>
      </Modal> */}
      <Modal isOpen={isSignatureModalOpen} onClose={() => setIsSignatureModalOpen(false)} className="p-4 max-w-md">
            <div className='p-1'>
            <div className='text-center mb-3 text-sm'>
                <span>Signez manuellement pour valider la livraison</span>
            </div>
            <div className='flex flex-col justify-center items-center'>
                <SignatureCanvas
                    ref={data=>setSignature(data)}
                    canvasProps={{ width: 300, height: 250, className: 'sigCanvas border border-gray-300 rounded' }}
                />
                <div className='w-full mt-6 flex justify-center items-center'>
                    <button
                        onClick={handleClear}
                        className='w-1/4 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                        Clear
                    </button>
                    <button
                        onClick={handleDeliver}
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
    </>
  );
}
