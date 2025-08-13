import { useEffect, useState, useRef } from "react";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import Input from "../input/InputField.tsx";
import Checkbox from "../input/Checkbox.tsx";
import Select from "../Select.tsx";
import TextArea from "../input/TextArea.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table/index.tsx";
import { PlusIcon } from "../../../icons/index.ts";
import { ListIcon } from "../../../icons/index.ts";
import 'primeicons/primeicons.css'; 
import { ProgressSpinner } from 'primereact/progressspinner';
import { useNavigate } from "react-router";
import { Merchants } from "../../../backend/livraisons/Merchants.js";
import { ProductDeliveries } from "../../../backend/livraisons/ProductDeliveries.js";
import Swal from 'sweetalert2'
import { Modal } from "../../ui/modal/index.tsx";
import SignatureCanvas from 'react-signature-canvas'
import { Users } from "../../../backend/users/Users.js"

export default function LivraisonInputs() {

  const merchants = new Merchants();
  const productDeliveries = new ProductDeliveries();
  const usersData = new Users()
  const userId = localStorage.getItem('id');
  const navigate = useNavigate();


  const [isOrangeChecked, setOrangeChecked] = useState(false);
  const [isMTNChecked, setMTNChecked] = useState(false);
  const [isMOOVChecked, setMOOVChecked] = useState(false);
  const [terminals, setTerminals] = useState([]);
  const [terminalSN, setTerminalSN] = useState('');
  const [terminalBanque, setTerminalBanque] = useState('');
  const [loadingMerchant, setLoadingMerchant] = useState(false);
  const [loadingDelivery, setLoadingDelivery] = useState(false);
  const [typeLivraison, setTypeLivraison] = useState('');
  const [livraisonID, setLivraisonID] = useState(null);
  const [message, setMessage] = useState("");
  const [mobileMoney, setMobileMoney] = useState([]);
  const [produitsLivreTable, setProduitsLivresTable] = useState([]);
  const [produitsLivre, setProduitsLivres] = useState([]);
  const [error, setError] = useState(null);
  const [errorFrom, setErrorForm] = useState(null);
  const [errorAjout, setErrorAjout] = useState(null);
  const [errorDeliver, setErrorDeliver] = useState(null);
  const [messageTPE, setMessageTPE] = useState('');
  const [isConfirmModalOpen , setIsConfirmModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signature, setSignature] = useState();
  const [signUrl, setSignUrl] = useState();
  const [errorSign, setErrorSign] = useState('');

  const [optionLivraisons, setOptionLivraisons] = useState([])
  const [listTypeLivraison, setListTypeLivraison] = useState([])

  const [optionServices, setOptionServices] = useState([])
  const [listServices, setListService] = useState([])
  const [serviceRecepteur, setServiceRecepteur] = useState('')

  const [optionsRoles, setOptionsRoles] = useState([])
  const [selectedRole, setSelectedRole] = useState([])
  const [listRoles, setListRoles] = useState([])

  const [serviceId, setServiceId] = useState(null)

  const [quantiteLivraison, setQuantiteLivraison] = useState(0)

  useEffect( ()=>{
    const fetchTerminalInfos = async () => {
      setLoadingMerchant(true)
      try{
        let data;
        data = await merchants.findMerchant();
        setTerminals(data)

        let type_delivery_data = await productDeliveries.getAllTypeLivraisonCommerciale()
        let type_delivery = type_delivery_data.filter((type) =>{
          return type.is_deleted == false
        })
        setListTypeLivraison(type_delivery)
        const optionsType = type_delivery.map((item) =>({
          value: item.id_type_livraison,
          label: item.nom_type_livraison,
        }))
        setOptionLivraisons(optionsType);

        let services_data = await usersData.getAllServices()
        setListService(services_data)
        const optionsServices = services_data.map((item) =>({
          value: item.id,
          label: item.nom_service,
        }))
        setOptionServices(optionsServices)

        let roles_data = await usersData.getAllRoles()
        setListRoles(roles_data)
        const optionsRoles = roles_data.map((item) =>({
          value: item.id_role,
          label: item.nom_role.split('_').join(' ').toLowerCase(),
        }))
        setOptionsRoles(optionsRoles)


      }catch(error){
        console.log('Error fetching data ',error)
        setErrorForm('Erreur lors de la génération du formulaire')
        
      }finally{
        setLoadingMerchant(false)
      }
    };fetchTerminalInfos();
  },[])
  
  const filteredPointMarchand = terminalSN ? 
  terminals.filter((terminal) => 
  terminal.SERIAL_NUMBER.includes(terminalSN)) : [];

  const ChangeRole = (value) => {
    console.log("Selected value : ",value)
    setSelectedRole(value);
  }
  
  const ChangeTypeLivraison = (value) => {
    console.log("Selected value:", value);
    setLivraisonID(value);
    
    const selectedTypeLivraison = listTypeLivraison.find(
      (item) => {
        return item.id_type_livraison == parseInt(value)
      }
    );

    if(selectedTypeLivraison){
      const nomType = selectedTypeLivraison.nom_type_livraison.toUpperCase()
      setTypeLivraison(nomType)
    } else{
      setTypeLivraison('');
    }    
  };
  
  const ChangeService = (value) => {
    console.log("Selected value:", value);
    setServiceId(value);
    
    const selectedService = listServices.find(
      (item) => {
        return item.id == parseInt(value)
      }
    );

    if(selectedService){
      const nomService = selectedService.nom_service.toUpperCase()
      setServiceRecepteur(nomService)
    } else{
      setServiceRecepteur('');
    }    
  }

  const handleConfirm = () => {
    
    let banque = ''
    banque = filteredPointMarchand.map((terminal) => terminal.BANQUE).join("-");
    console.log(banque)

    if(!livraisonID){
      setErrorAjout("Vous devez choisir le type de livraison !");
      return;
    }
    if(!serviceId){
      setErrorAjout("Vous devez choisir le service réceptionneur !");
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
    if (livraisonID == 3 && !banque){
      setErrorAjout("Ce Terminal n'est pas bancaire !");
      return;
    }
    if (livraisonID == 6 && !(banque === 'ECOBANK' || banque === 'ECOBANK ACI' || banque === 'ECOBANK CI')){
      setErrorAjout("Ce Terminal n'est pas ecobank !");
      return;
    }
    if (livraisonID == 1 && (banque === 'ECOBANK' || banque === 'ECOBANK ACI' || banque === 'ECOBANK CI')){
      setErrorAjout("Ce Terminal n'est pas GIM !");
      return;
    }
    if (livraisonID == 3 && (banque === 'ECOBANK' || banque === 'ECOBANK ACI' || banque === 'ECOBANK CI')){
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
    if (filteredPointMarchand.length > 0 && filteredPointMarchand.some((terminal) => terminal.NUM_ORANGE?.startsWith("07"))){
      localMobileMoney.push("OM")};
    if (filteredPointMarchand.length > 0 && filteredPointMarchand.some((terminal) => terminal.NUM_MTN?.startsWith("05"))){
      localMobileMoney.push("MTN")};
    if (filteredPointMarchand.length > 0 && filteredPointMarchand.some((terminal) => terminal.NUM_MOOV?.startsWith("01"))){
      localMobileMoney.push("MOOV")};
    // if(!livraisonID){
    //   setErrorAjout("Vous devez choisir le type de livraison !");
    //   return;
    // }
    // if (!filteredPointMarchand || filteredPointMarchand.length === 0) {
    //   setErrorAjout("S/N invalide !");
    //   return;
    // }

    // const isDuplicate = produitsLivre.some(prod => prod.serialNumber === terminalSN);
    // if (isDuplicate) {
    //   setErrorAjout("Ce numéro de série a déjà été ajouté.");
    //   return;
    // }
    // if (livraisonID == 1 && !filteredPointMarchand.map((terminal) => terminal.BANQUE).join("-")){
    //   setErrorAjout("Ce Ternminal n'est pas un TPE GIM");
    //   return;
    // }
    
    const newProduit = {
      pointMarchand: filteredPointMarchand.map((terminal) => terminal.POINT_MARCHAND).join(","),
      caisse: filteredPointMarchand.map((terminal) => terminal.TPE).join(","),
      serialNumber: terminalSN,
      banque: filteredPointMarchand.map((terminal) => terminal.BANQUE).join(","),
      mobile_money: localMobileMoney,
      commentaireTPE: messageTPE,
    };
  
    setProduitsLivresTable((prev) => [...prev, newProduit]);
    setProduitsLivres((prev) => [...prev, newProduit]);
    setQuantiteLivraison(quantiteLivraison + 1)
  
    // Optional: Reset form fields
    setTerminalSN('');
    setMessageTPE('')
    setOrangeChecked(false);
    setMTNChecked(false);
    setMOOVChecked(false);
    setMobileMoney([]);

    setErrorAjout('')
    setIsConfirmModalOpen(false)
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
    
    
    fd.append('commentaire',commentaire);
    fd.append('type_livraison_id',livraisonID);
    fd.append('user_id',userId);
    fd.append('isAncienne',isAncienne)
    fd.append('produitsLivre',JSON.stringify(produitsLivre))
    fd.append('service_recepteur', serviceId)
    fd.append('role_recepteur', selectedRole)
    if (sign) {
      const blob = await fetch(sign).then(res => res.blob());
      fd.append('signature_expediteur', blob, 'signature.png');
    }

    // console.log(blob)
    console.log('Trying to create form...')
    console.log('Commentaire : ',commentaire)
    console.log('ID Livraison : ',type_livraison_id)
    console.log('ID User', user_id)
    console.log('Ancienne ? ', isAncienne)
    console.log('Produits livrés : ',produitsLivre)
    

    try{
    // const response = await productDeliveries.deliver(commentaire, type_livraison_id, user_id, isAncienne, produitsLivre)
    const response = await productDeliveries.deliver(fd)

    console.log(response);
    console.log('Formulaire créé')
    Swal.fire({
      title: "Succès",
      text: "Formulaire créé avec succès",
      icon: "success"
    });
    navigate('/toutes-les-livraisons');
    }catch (error) {
      setLoadingDelivery(false)
      console.log('error')
      setError('Erreur lors de la génération du formulaire');
      Swal.fire({
        title: "Attention",
        text: "Une erreur s'est produite lors de la livraison.",
        icon: "warning"
      });
      navigate('/toutes-les-livraisons');
    }finally{
      setProduitsLivres([])
      setProduitsLivresTable([])
      setLoadingDelivery(false)
    } 
  }

  const handleDelete = (indexToRemove) => {
    setProduitsLivresTable((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    setProduitsLivres((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    setQuantiteLivraison(quantiteLivraison - 1)
  };

  const handleValidate = () =>{
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

  
  return (
    <>
      <div className="flex justify-center mb-6">
        {loadingMerchant ? (<>Loading...</>) :
          (
            errorFrom ? (
              <div className="text-error-600 bg-error-300 font-medium flex items-center justify-center rounded-3xl text-sm p-4">
                {errorFrom}
              </div>
            ) : (
                  <>
                    <ComponentCard className="md:w-1/2 w-full" title={`Livraison ${typeLivraison}`}>
                      <div className="pb-3 text-center">
                            <span className="text-sm font-semibold">Informations générales</span>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <Label>Type de Livraison <span className="text-red-700">*</span></Label>
                          <Select
                            options={optionLivraisons}
                            placeholder="Select an option"
                            onChange={ChangeTypeLivraison}
                            className="dark:bg-dark-900"
                            
                          />
                        </div>
                        <div>
                          <Label>Service recepteur <span className="text-red-700">*</span></Label>
                          <Select
                            options={optionServices}
                            placeholder="Select an option"
                            onChange={ChangeService}
                            className="dark:bg-dark-900"
                            
                          />
                        </div>
                        <div>
                          <Label>Associer un rôle</Label>
                          <Select
                            options={optionsRoles}
                            placeholder="Choisir un rôle"
                            onChange={ChangeRole}
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
                            <span className="text-sm font-semibold">Informations sur produits</span>
                        </div>
                        <div>
                          <Label htmlFor="input">Numéro de série <span className="text-red-700">*</span></Label>
                          <Input type="text" id="input" value={terminalSN} onChange={(e) =>{
                            const value = e.target.value
                            // Allow only digits
                            if (/^\d*$/.test(value)){
                            // Only allow up to 10 characters
                              if (value.length <= 10) {
                                setTerminalSN(value);
                              }} 
                              }}/>
                        </div>
                        <div>
                          <Label>Commentaire pour terminal</Label>
                          <TextArea
                          value={messageTPE}
                          onChange={(value) => setMessageTPE(value)}
                          rows={2}
                          placeholder="Ajoutez un commentaire"
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
                        </div>
                      </div>
                      <div className="text-right text-gray-500">
                        <span className="text-xs font-medium">
                          Les champs suivis par un <span className="text-red-700">*</span> sont obligatoires
                        </span>
                      </div>
                    </ComponentCard>
                  </>
            )
          )
        }
      </div>
      <div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className='p-4 text-xs text-gray-600'>
            <span>Quantité : {quantiteLivraison}</span>
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
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Supprimer
                  </TableCell>
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
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(index)}
                        >
                        <i className="pi pi-trash" style={{ color: 'black' }}></i>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </div>
        </div>
        <div className="w-full flex flex-col justify-center items-center mt-6">
          {loadingDelivery? 
            <span className="">
              <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" animationDuration=".5s" />
            </span>
          :
            <button onClick={handleValidate} className="w-1/4 bg-green-400 rounded-2xl h-10 flex justify-center items-center">
              <span>Valider formulaire</span>
              <span className="text-2xl"><ListIcon /></span>
            </button> 
            }
            {errorDeliver?
              <span className="text-error-600 font-medium flex items-center justify-center text-sm p-1">
                {errorDeliver}
              </span>
            :
              <></>
            }
        </div>
      </div>
      <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} className="p-4 max-w-xl">
        <div className="p-6 mt-5">
          <div>
            <span>Vous allez ajouter un terminal pour livraison :  <span className="font-bold text-red-700">{typeLivraison}</span></span>
          </div>
          <div>
            <div>
              <span>Service : <span className="font-bold text-red-700">{serviceRecepteur}</span></span>
            </div>
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
      </Modal>
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
