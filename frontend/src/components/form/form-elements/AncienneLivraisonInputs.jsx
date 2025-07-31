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
import { useNavigate } from "react-router";
import { Merchants } from "../../../backend/livraisons/Merchants.js";
import { ProductDeliveries } from "../../../backend/livraisons/ProductDeliveries.js";
import Swal from 'sweetalert2'
import { Modal } from "../../ui/modal/index.tsx";


export default function AncienneLivraisonInputs() {

    const merchants = new Merchants();
    const productDeliveries = new ProductDeliveries();
    const userId = localStorage.getItem('id');
    const role = localStorage.getItem("role_id")
    const navigate = useNavigate();
    const [isOrangeChecked, setOrangeChecked] = useState(false);
    const [isMTNChecked, setMTNChecked] = useState(false);
    const [isMOOVChecked, setMOOVChecked] = useState(false);
    const [terminals, setTerminals] = useState([]);
    const [terminalSN, setTerminalSN] = useState('');
    const [pointMarchand, setPointMarchand] = useState('')
    const [banque, setBanque] = useState('');
    const [caisse, setCaisse] = useState('');
    const [livreurName, setLivreurName] = useState('');
    const [dateLivraison, setDateLivraison] = useState('');
    const [loadingMerchant, setLoadingMerchant] = useState(false);
    const [loadingDelivery, setLoadingDelivery] = useState(false);
    const [typeLivraison, setTypeLivraison] = useState('');
    const [livraisonID, setLivraisonID] = useState(null);
    const [message, setMessage] = useState("Ancienne livraison.");
    const [mobileMoney, setMobileMoney] = useState([]);
    const [produitsLivreTable, setProduitsLivresTable] = useState([]);
    const [produitsLivre, setProduitsLivres] = useState([]);
    const [error, setError] = useState(null);
    const [errorFrom, setErrorForm] = useState(null);
    const [errorAjout, setErrorAjout] = useState(null);
    const [errorDeliver, setErrorDeliver] = useState(null);
    const [messageTPE, setMessageTPE] = useState('');
    const [isConfirmModalOpen , setIsConfirmModalOpen] = useState(false);
    const [validateurName, setValidateurName] = useState('');

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR'); // or use any locale you want
      };
  
    const ChangeTypeLivraison = (value) => {
      console.log("Selected value:", value);
      setTypeLivraison(value);
      if(value == 'TPE GIM'){
        setLivraisonID(1);
      }else if(value == 'TPE REPARE'){
        setLivraisonID(2);
      }else if(value == 'TPE MAJ GIM'){
        setLivraisonID(3)
      }else if(value == 'TPE MOBILE'){
        setLivraisonID(4)
      }else if(value == 'CHARGEUR'){
        setLivraisonID(5)
      }else if(value == 'TPE ECOBANK'){
      setLivraisonID(6)
    }
    };
    
    // useEffect( ()=>{
    //   const fetchTerminalInfos = async () => {
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
    //   };fetchTerminalInfos();
    // },[])

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
    
      // let banque = ''
      // banque = filteredPointMarchand.map((terminal) => terminal.BANQUE).join("-");
      // console.log(banque)
      let dateToday = new Date()
      let date = new Date(dateLivraison)

      console.log("date today : ",dateToday.getDate())
      console.log("date livraison : ",date.getDate())

      if(!livraisonID){
        setErrorAjout("Vous devez choisir le type de livraison !");
        return;
      }

      if(date.getDate() >= dateToday.getDate()){
        setErrorAjout("Date de livraison invalide !")
        return;
      }
      // if (!filteredPointMarchand || filteredPointMarchand.length === 0 || terminalSN.length < 10) {
      //   setErrorAjout("S/N invalide !");
      //   return;
      // }
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
        setErrorAjout("Ce Terminal n'est pas Ecobank !");
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
      if(!livreurName){
        setErrorAjout("Vous devez préciser le nom du livreur !")
        return;
      }
      if(!validateurName){
        setErrorAjout("Vous devez préciser le nom du receveur !")
        return;
      }
      if(!dateLivraison){
        setErrorAjout("Vous devez préciser la date de livraison !")
        return;
      }
      if(!pointMarchand){
        setErrorAjout("Vous devez préciser le nom du point marchand !")
        return;
      }
      if(!caisse){
        setErrorAjout("Vous devez préciser la caisse TPE !")
        return;
      }
      if(livraisonID == 4 && banque){
      setErrorAjout("Ce terminal est bancaire.");
      return;
      }
      // const localMobileMoney = [];
      // if (filteredPointMarchand.length > 0 && filteredPointMarchand.some((terminal) => terminal.NUM_ORANGE?.startsWith("07"))){
      //   setOrangeChecked(true)};
      // if (filteredPointMarchand.length > 0 && filteredPointMarchand.some((terminal) => terminal.NUM_MTN?.startsWith("05"))){
      //   setMTNChecked(true)};
      // if (filteredPointMarchand.length > 0 && filteredPointMarchand.some((terminal) => terminal.NUM_MOOV?.startsWith("01"))){
      //   setMOOVChecked(true)};
      
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

      const newProduit = {
        pointMarchand: pointMarchand,
        caisse: caisse,
        serialNumber: terminalSN,
        banque: banque,
        mobile_money: localMobileMoney,
        commentaireTPE: messageTPE,
      };
  
      setProduitsLivresTable((prev) => [...prev, newProduit]);
      setProduitsLivres((prev) => [...prev, newProduit]);
  
      // Optional: Reset form fields
      setTerminalSN('');
      setMessageTPE('');
      setPointMarchand('')
      setCaisse('');
      setBanque('');
      setOrangeChecked(false);
      setMTNChecked(false);
      setMOOVChecked(false);
      setMobileMoney([]);

      setErrorAjout('')
      setIsConfirmModalOpen(false)
    }
      
  
    const handleDeliver = async (e) => {
      e.preventDefault();
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
      if(produitsLivre.length == 0){
        Swal.fire({
        title: "Error",
        text: "Vous devez ajouter au moins un TPE.",
        icon: "error"
        });
        return;
      }
      
      setLoadingDelivery(true);
      const commentaire = message;
      const type_livraison_id = livraisonID
      const user_id = userId;
      const isAncienne = true;
      const nom_livreur = livreurName
      const nom_validateur = validateurName
  
      console.log('Trying to create form...')
      console.log('Commentaire : ',commentaire)
      console.log('ID Livraison : ',type_livraison_id)
      console.log('ID User : ', user_id)
      console.log('Ancienne ? ', isAncienne)
      console.log('Nom livreur : ', nom_livreur)
      console.log('Date livraison : ', dateLivraison)
      console.log('Produits livrés : ',produitsLivre)
  
      try{
      const response = await productDeliveries.deliverOld(commentaire, type_livraison_id, user_id, isAncienne, dateLivraison, nom_livreur, nom_validateur, produitsLivre)
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
    
  
    // const filteredPointMarchand = terminalSN ? 
    // terminals.filter((terminal) => 
    //       terminal.SERIAL_NUMBER.includes(terminalSN)) : [];
  
    const options_livraison = [
      { value: "TPE GIM", label: "TPE GIM" },
      { value: "TPE MOBILE", label: "TPE MOBILE" },
      { value: "TPE MAJ GIM", label: "MISE A JOUR GIM" },
      { value: "TPE REPARE", label: "TPE REPARE" },
      { value: "CHARGEUR", label: "CHARGEUR" },
      { value: "TPE ECOBANK", label: "TPE ECOBANK" },
    ];
  
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
                      <ComponentCard className="md:w-1/2 w-full border-green-500" title={`Ancienne Livraison ${typeLivraison}`}>
                        <div className="flex items-center justify-between border-b pb-3 text-green-600">
                            <span className="text-xs">Rédigez une ancienne livraison</span>
                           <span className="text-3xl"><RefreshTimeIcon /></span> 
                        </div>
                        <div className="pb-3 text-center">
                            <span className="text-sm font-semibold">Informations générales</span>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <Label>Type de Livraison <span className="text-red-700">*</span></Label>
                            <Select
                              options={options_livraison}
                              placeholder="Select an option"
                              onChange={ChangeTypeLivraison}
                              className="dark:bg-dark-900"
                            />
                          </div>
                          <div>
                            <Label>Nom du Livreur <span className="text-red-700">*</span></Label>
                            <Input type="text" id="input"
                                    value={livreurName} onChange={(e) => setLivreurName(e.target.value)}
                                    />
                          </div>
                          <div>
                            <Label>Nom du Receveur <span className="text-red-700">*</span></Label>
                            <Input type="text" id="input"
                                    value={validateurName} onChange={(e) => setValidateurName(e.target.value)}
                                    />
                          </div>
                          <div>
                            <DatePicker
                              id="date-picker"
                              label="Date Livraison *"
                              placeholder="Select a date"
                              onChange={(dates, currentDateString) => {
                              // Handle your logic
                                  console.log(currentDateString)
                                  setDateLivraison(currentDateString)
                              }}
                            />
                          </div>
                          <div>
                            <Label>Description</Label>
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
                                setTerminalSN(value);}}}}/>
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
                            <Label>Point Marchand <span className="text-red-700">*</span></Label>
                            <Input type="text" id="input"
                                    value={pointMarchand} onChange={(e) => setPointMarchand(e.target.value)}
                                    />
                          </div>
                          <div>
                            <Label>Caisse <span className="text-red-700">*</span></Label>
                            <Input type="text" id="input"
                                    value={caisse} onChange={(e) => setCaisse(e.target.value)}
                                    />
                          </div>
                          <div>
                            <Label>Banque</Label>
                            <Input type="text" id="input" 
                                    value={banque} onChange={(e) => setBanque(e.target.value)}
                                    />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-3 my-2">
                              <Checkbox checked={isOrangeChecked} onChange={setOrangeChecked} label="Orange Money" />
                            </div>
                            <div className="flex items-center gap-3 my-2">
                              <Checkbox checked={isMTNChecked} onChange={setMTNChecked} label="MTN Money" />
                            </div>
                            <div className="flex items-center gap-3 my-2">
                              <Checkbox checked={isMOOVChecked} onChange={setMOOVChecked} label="MOOV Money" />
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
              <span className="mt-20">
                <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" animationDuration=".5s" />
              </span>
            :
              <button onClick={handleDeliver} className="w-1/4 mt-20 bg-green-400 rounded-2xl h-10 flex justify-center items-center">
                <span>Créer formulaire</span>
                <span className="text-2xl"><ListIcon /></span>
              </button> 
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
                <span>S/N terminal : <span className="font-bold text-red-700">{terminalSN}</span></span>
              </div>
              <div>
                <span>Point Marchand : <span className="font-bold text-red-700">{pointMarchand}</span></span>
              </div>
              <div>
                <span> Banque : <span className="font-bold text-red-700">{banque}</span></span>
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