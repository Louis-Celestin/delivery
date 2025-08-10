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
import { Stock } from "../../../backend/stock/Stock.js";
import { Users } from "../../../backend/users/Users.js";
import Swal from 'sweetalert2'
import { Modal } from "../../ui/modal/index.tsx";
import { useNavigate, useParams } from "react-router";
import SignatureCanvas from 'react-signature-canvas'



export default function LivraisonPiecesInputs() {

  const productDeliveries = new ProductDeliveries();
  const demandes = new Demandes()
  const stock = new Stock();
  const usersData = new Users()
  const userId = localStorage.getItem('id'); 
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

  const [stockDT, setStockDT] = useState([])

  const [servicesSelection, setServicesSelection] = useState([]);
  const [optionsServices, setOptionsServices] = useState([])
  const [serviceId, setServiceId] = useState(null)
  const [selectedService, setSelectedService] = useState('')
  const [quantiteProduit, setQuantiteProduit] = useState(0)

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR'); // or use any locale you want
  };
  
  useEffect( ()=>{
    const fetchDemandeInfos = async () => {
      setLoadingDemandeInfos(true)
      try{
        let demande_data = await demandes.getOneDemande(id);
        console.log(demande_data)
        setDemandeForm(demande_data);
        setLivraisonID(demande_data.type_demande_id)
        setQuantiteProduit(demande_data.qte_total_demande)

        let stock_data = await stock.getAllStock()
        setStockDT(stock_data)
        const stockItem = stock_data.find((item) => {
          return item.id_piece == demande_data.type_demande_id
        })
        if(stockItem){
          setTypeLivraison(stockItem.nom_piece.toUpperCase())
        }

        let services_data = await usersData.getAllServices()
        setServicesSelection(services_data)
        const options_services = services_data.map((item) => ({
          value: item.id,
          label: item.nom_service.toUpperCase()
        }))
        setOptionsServices(options_services)
        const defaultService = services_data.find((item) => {
          return item.id == demande_data.service_demandeur
        })
        setSelectedService(defaultService.nom_service.toUpperCase())
        setServiceId(demande_data.service_demandeur)
        console.log("Default service : ", defaultService.id)
        console.log("Selected service :", demande_data.service_demandeur)

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
      // if(role != 1){
      //   Swal.fire({
      //       title: "Error",
      //       text: "Vous n'êtes pas authorisé à faire cette action !",
      //       icon: "error"
      //   });
      //   localStorage.removeItem('token');
      //   localStorage.removeItem('username');
      //   navigate('/signin');
      //   return
      // }
      if(demandeForm.statut_demande != 'valide'){
          Swal.fire({
              title: "Error",
              text: "La demande n'est pas validée !",
              icon: "error"
          });
          navigate('/toutes-les-demandes');
          return
      }
      if(demandeForm.demande_livree){
        Swal.fire({
              title: "Error",
              text: "La demande a déjà été livrée!",
              icon: "error"
          });
          navigate('/toutes-les-demandes');
          return
      }
      setIsSignatureModalOpen(true)
  }

const handleClear = () =>{
    console.log(signUrl)
    signature.clear()
}

const handleDeliver = async (e) => {
    e.preventDefault();

    if(signature.isEmpty()){
      setErrorSign('Vous devez signer pour valider !')
      return;
    }
    // setSignUrl(signature.toDataURL('image/png'))
    const sign = signature.toDataURL('image/png')
    
    const fd = new FormData();
    
    fd.append('commentaire',message);
    fd.append('type_livraison_id',livraisonID);
    fd.append('user_id',userId);
    fd.append('role_reception', 12)
    fd.append('quantite', quantiteProduit)
    fd.append('service_reception', serviceId)
    fd.append('demande_id', id);
    if (sign){
      const blob = await fetch(sign).then(res => res.blob());
      fd.append('signature_expediteur', blob, 'signature.png');
    }
  
    try{
      setLoadingDelivery(true);
      setIsSignatureModalOpen(false)
      const response = await productDeliveries.deliverStock(fd)

      console.log(response);
      console.log('Formulaire créé')
      Swal.fire({
        title: "Succès",
        text: "Formulaire créé avec succès",
        icon: "success"
      });
      navigate('/toutes-les-demandes');
    }catch (error) {
      console.log('error')
      setError('Erreur lors de la génération du formulaire');
      Swal.fire({
        title: "Attention",
        text: "Il y a eu une erreur lors de la livraison",
        icon: "warning"
      });
    }finally{
      setProduitsLivres([])
      setProduitsLivresTable([])
      setLoadingDelivery(false)
    } 
}

  // const filteredPointMarchand = terminalSN ? 
  // terminals.filter((terminal) => 
  //       terminal.SERIAL_NUMBER.includes(terminalSN)) : [];

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
                    <div>
                      <div className="pb-3 text-center">
                        <span className="text-sm font-semibold">Informations générales</span>
                      </div>
                      <Label>Service <span className="text-red-700">*</span></Label>
                      <Input 
                        type="text"
                        value={selectedService}
                        className="dark:bg-dark-900"
                      />
                    </div>
                    <div>
                        <Label>Commentaire</Label>
                        <TextArea
                        value={message}
                        onChange={(value) => setMessage(value)}
                        rows={4}
                        placeholder="Ajoutez un commentaire"
                        />
                    </div>
                    <div className="pb-3 text-center">
                      <span className="text-sm font-semibold">Informations produits</span>
                    </div>
                    <div>
                      <Label>Quantité produit <span className="text-red-700">*</span></Label>
                      <Input 
                        type="number" 
                        value={quantiteProduit}
                        onChange={(e) =>{
                          const value = e.target.value
                          if(value>0){
                            setQuantiteProduit(value)
                          }
                        }}
                      />
                    </div>
                </div>
            </ComponentCard>
        </>
      </div>
      <div>
        <div className="w-full flex flex-col justify-center items-center">
          {loadingDelivery? 
            <span className="">
              <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" animationDuration=".5s" />
            </span>
          : 
            <div className="flex">
              <button onClick={handleValidate} className="w-50 mx-1 bg-green-400 rounded-2xl h-10 flex justify-center items-center">
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
      
      <Modal isOpen={isSignatureModalOpen} onClose={() => setIsSignatureModalOpen(false)} className="p-3 max-w-md">
            <div className='p-1 space-y-6'>
              <div className="w-full text-center">
                <span className="p-3 rounded bg-blue-200 text-blue-500 font-medium hover:cursor-default">Confirmation</span>
              </div>
              <div className="text-sm text-center font-semibold">
                <span>Vous allez effectuer une livraison de
                  <span className="text-red-500"> {quantiteProduit} {typeLivraison} </span>
                  au service 
                  <span className="text-red-500"> {selectedService}</span>
                </span>
              </div>
              <div className='text-center text-sm'>
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
