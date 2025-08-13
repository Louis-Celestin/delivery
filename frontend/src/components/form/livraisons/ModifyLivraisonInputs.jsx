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
import { PlusIcon, ListIcon, PencilIcon } from "../../../icons/index.ts";
import 'primeicons/primeicons.css'; 
import { ProgressSpinner } from 'primereact/progressspinner';
import { useNavigate, useParams } from "react-router";
import { Merchants } from "../../../backend/livraisons/Merchants.js";
import { Users } from "../../../backend/users/Users.js";
import { ProductDeliveries } from "../../../backend/livraisons/ProductDeliveries.js";
import { Modal } from "../../ui/modal/index.tsx";
import Swal from 'sweetalert2'


export default function ModifyLivraisonInputs() {

  const merchants = new Merchants();
  const productDeliveries = new ProductDeliveries();
  const userId = localStorage.getItem('id');
  const usersData = new Users()
  const { id } = useParams();
  const navigate = useNavigate();


  const [isOrangeChecked, setOrangeChecked] = useState(false);
  const [isMTNChecked, setMTNChecked] = useState(false);
  const [isMOOVChecked, setMOOVChecked] = useState(false);
  const [terminals, setTerminals] = useState([]);
  const [terminalSN, setTerminalSN] = useState('');
  const [loadingDeliveryInfos, setLoadingDeliveryInfos] = useState(false);
  const [loadingMerchant, setLoadingMerchant] = useState(false);
  const [loadingDelivery, setLoadingDelivery] = useState(false);
  const [typeLivraison, setTypeLivraison] = useState('');
  const [livraisonID, setLivraisonID] = useState();
  const [message, setMessage] = useState("");
  const [mobileMoney, setMobileMoney] = useState([]);
  const [produitsLivreTable, setProduitsLivresTable] = useState([]);
  const [produitsLivre, setProduitsLivres] = useState([]);
  const [error, setError] = useState(null);
  const [errorFrom, setErrorForm] = useState(null);
  const [errorAjout, setErrorAjout] = useState(null);
  const [errorDeliver, setErrorDeliver] = useState(null);
  const [isConfirmModalOpen , setIsConfirmModalOpen] = useState(false);
  const [messageTPE, setMessageTPE] = useState('');
  
  const [optionLivraisons, setOptionLivraisons] = useState([])
  const [listTypeLivraison, setListTypeLivraison] = useState([])

  const [optionServices, setOptionServices] = useState([])
  const [listServices, setListService] = useState([])
  const [serviceRecepteur, setServiceRecepteur] = useState('')

  const [optionsRoles, setOptionsRoles] = useState([])
  const [selectedRole, setSelectedRole] = useState()
  const [nomRole, setNomRole] = useState('')
  const [listRoles, setListRoles] = useState([])

  const [serviceId, setServiceId] = useState(null)
  
  useEffect( ()=>{
    const fetchDeliveryInfos = async () => {
      setLoadingDeliveryInfos(true)
      try{
        let delivery_data;
        delivery_data = await productDeliveries.getOneLivraison(id);
        console.log(delivery_data)
        setMessage(delivery_data.commentaire);
        const parsedProduitsLivre = JSON.parse(delivery_data.produitsLivre);
        setProduitsLivres(parsedProduitsLivre);
        setProduitsLivresTable(parsedProduitsLivre);

        let type_delivery = await productDeliveries.getAllTypeLivraisonCommerciale()
        setListTypeLivraison(type_delivery)
        const optionsType = type_delivery.map((item) =>({
          value: item.id_type_livraison,
          label: item.nom_type_livraison,
        }))
        setOptionLivraisons(optionsType);
        let typeLivraison = type_delivery.find((item) =>{
          return item.id_type_livraison === delivery_data.type_livraison_id
        })
        if(typeLivraison){
          setTypeLivraison(typeLivraison.nom_type_livraison.toUpperCase())
          setLivraisonID(typeLivraison.id_type_livraison)
        }

        let services_data = await usersData.getAllServices()
        setListService(services_data)
        const optionsServices = services_data.map((item) =>({
          value: item.id,
          label: item.nom_service,
        }))
        setOptionServices(optionsServices)
        let service = services_data.find((item) =>{
          return item.id === delivery_data.service_id
        })
        if(service){
          setServiceRecepteur(service.nom_service.toUpperCase())
          setServiceId(service.id)
        }

        let roles_data = await usersData.getAllRoles()
        setListRoles(roles_data)
        const optionsRoles = roles_data.map((item) =>({
          value: item.id_role,
          label: item.nom_role.split('_').join(' ').toLowerCase(),
        }))
        setOptionsRoles(optionsRoles)
        let role = roles_data.find((item) =>{
          return item.id === delivery_data.role_id
        })
        if(role){
          setNomRole(role.nom_role.split('_').join(' ').toLowerCase())
          setSelectedRole(role.id_role)
        }

      }catch(error){
        console.log('Error fetching data ',error)
        setErrorForm('Erreur lors de la génération du formulaire')

      }finally{
        setLoadingDeliveryInfos(false)
      }
    }
    const fetchTerminalInfos = async () => {
      setLoadingMerchant(true)
      try{
        let data;
        data = await merchants.findMerchant();
        console.log(data)
        setTerminals(data)
      }catch(error){
        console.log('Error fetching data ',error)
        setErrorForm('Erreur lors de la génération du formulaire')

      }finally{
        setLoadingMerchant(false)
      }
  };
  fetchDeliveryInfos();
  fetchTerminalInfos();
  
  },[id])

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

    if(!livraisonID){
      setErrorAjout("Vous devez choisir le type de livraison !");
      return;
    }
    if(!serviceId){
      setErrorAjout("Vous devez choisir le service de réception !")
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
    
  const handleDeliver = async (e) => {
    e.preventDefault();

    if(produitsLivre.length == 0){
      Swal.fire({
        title: "Error",
        text: "Vous devez ajouter au moins un TPE",
        icon: "error"
      });
      return;
    }
    if(!livraisonID){
      Swal.fire({
        title: "Error",
        text: "Vous devez choisir un type de livraison",
        icon: "error"
      });
      return;
    }

    console.log(produitsLivre)
    const payload = {
      produitsLivre: JSON.stringify(produitsLivre),
      commentaire: message,
      type_livraison_id: livraisonID,
      user_id: userId,
      service_recepteur: serviceId,
      role_recepteur: selectedRole,
    }
    
    try{
      console.log('Executing : ',payload)
      setLoadingDelivery(true);
      const response = await productDeliveries.updateLivraison(id, payload)
      console.log(response);
      console.log('Formulaire modifié')
      Swal.fire({
        title: "Succès",
        text: "Formulaire modifié avec succès",
        icon: "success"
      });
      navigate('/toutes-les-livraisons');
    }catch (error) {
      console.log(error)
      setError('Erreur lors de la génération du formulaire');
      Swal.fire({
        title: "Attention",
        text: "Une erreur est survenue lors de la modification de la livraison",
        icon: "warning"
      });
      navigate('/toutes-les-livraisons');
      setLoadingDelivery(false)
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
  };

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
                    <ComponentCard className="w-1/2" title={`Livraison ${typeLivraison}`}>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b pb-3">
                            <span className="text-xs">Modifiez une livraison</span>
                            <span className="text-3xl"><PencilIcon /></span> 
                        </div>
                        <div className="pb-3 text-center">
                            <span className="text-sm font-semibold">Informations générales</span>
                        </div>
                        <div>
                          <Label>Type de Livraison <span className="text-red-700">*</span></Label>
                          <Select
                            options={optionLivraisons}
                            placeholder={typeLivraison}
                            onChange={ChangeTypeLivraison}
                            className="dark:bg-dark-900"
                            
                          />
                        </div>
                        <div>
                          <Label>Service recepteur <span className="text-red-700">*</span></Label>
                          <Select
                            options={optionServices}
                            placeholder={serviceRecepteur}
                            onChange={ChangeService}
                            className="dark:bg-dark-900"       
                          />
                        </div>
                        <div>
                          <Label>Associer un rôle</Label>
                          <Select
                            options={optionsRoles}
                            placeholder={nomRole}
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
                    </ComponentCard>
                  </>
            )
          )
        }
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
        <div className="w-full flex flex-col justify-center items-center">
          {loadingDelivery? 
            <span className="mt-6">
              <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" animationDuration=".5s" />
            </span>
          : 
            <div className="flex">
                <button onClick={handleDeliver} className=" mt-6 w-50 mx-1 bg-green-400 rounded-2xl h-10 flex justify-center items-center">
                    <span>Modifier formulaire</span>
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
    </>
  );
}
