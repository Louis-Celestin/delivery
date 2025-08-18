import { useEffect, useState, useRef } from "react";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import Input from "../input/InputField.tsx";
import Checkbox from "../input/Checkbox.tsx";
import Select from "../Select.tsx";
import TextArea from "../input/TextArea.tsx";
import FileInput from "../input/FileInput.tsx"
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
import { useNavigate, useParams } from "react-router";
import { Demandes } from "../../../backend/demandes/Demandes.js";
import { Stock } from "../../../backend/stock/Stock.js"
import { Users } from "../../../backend/users/Users.js";
import Swal from 'sweetalert2'
import { Modal } from "../../ui/modal/index.tsx";

import SignatureCanvas from 'react-signature-canvas'

export default function ModifyDemandeInputs() {

  const demandes = new Demandes();
  const stock = new Stock();
  const users = new Users();
  const userId = localStorage.getItem('id');
  const navigate = useNavigate();
  const { id } = useParams();

  const [loadingDemandeData, setLoadingDemandeData] = useState(false);
  const [loadingDemande, setLoadingDemande] = useState(false);
  const [message, setMessage] = useState("");
  const [produitsDemande, setProduitsDemandes] = useState([]);
  const [error, setError] = useState(null);
  const [errorFrom, setErrorForm] = useState(null);
  const [errorAjout, setErrorAjout] = useState(null);
  const [errorDeliver, setErrorDeliver] = useState(null);
  const [isConfirmModalOpen , setIsConfirmModalOpen] = useState(false);
  
  const [typeDemande, setTypeDemande] = useState('');
  const [demandeID, setDemandeID] = useState(null);
  const [serviceDemandeur, setServiceDemandeur] = useState('');
  const [serviceId, setServiceId] = useState(null);

  const [qteDemande, setQteDemande] = useState(0);
  
  const [nomDemandeur, setNomDemandeur] = useState('');
  
  const [stockDT, setStockDT] = useState([])
  const [optionsPieces, setOptionsPieces] = useState([])
  const [stockInitial, setStockInitial] = useState(0);
  const [usersSelection, setUsersSelection] = useState([])
  const [usersOptions, setUsersOptions] = useState([])
  const [idDemandeur, setIdDemandeur] = useState(null);
  const [motifDemande, setMotifDemande] = useState('PIECES TPE');
  
  const [motifAutre, setMotifAutre] = useState(false);

  const [optionsServices, setOptionsServices] = useState([])
  const [servicesSelection, setServicesSelection] = useState([])

  const [userRoles, setUserRoles] = useState([])

  const [selectedFiles, setSelectedFiles] = useState([])

  const [demandeDetails, setDemandeDetails] = useState([])

  const [fields, setFields] = useState([])
  const [otherFields, setOtherFields] = useState([])

  const [optionsModels, setOptionsModels] = useState([])
  
  useEffect( ()=>{
    const fetchDemandeData = async () => {
      setLoadingDemandeData(true)
      try{

        let userRoles_data = await users.getUserRoles(parseInt(userId))
        const roles_id = userRoles_data.roles.map((role) =>{
          return role.id_role
        })
        setUserRoles(roles_id)

        const demandeData = await demandes.getOneDemande(id)
        setDemandeDetails(demandeData)
        setDemandeID(demandeData.type_demande_id)
        setMotifDemande(demandeData.motif_demande)
        setServiceId(demandeData.service_demandeur)
        setQteDemande(demandeData.qte_total_demande)
        setIdDemandeur(demandeData.id_demandeur)
        setMessage(demandeData.commentaire)
        let fieldsAutre = JSON.parse(demandeData.champs_autre)
        setFields(fieldsAutre)
        setOtherFields(fieldsAutre)
        
        let stock_data;
        stock_data = await stock.getAllStock()
        console.log(stock_data)
        setStockDT(stock_data)
        // const piecesA920 = stock_data.filter(item =>{
        //   return item.model_id == 1;
        // });
        // const options = piecesA920.map((item) => ({
        //   value: item.id_piece,
        //   label: item.nom_piece.toUpperCase(),
        // }));
        // setOptionsPieces(options);
        const selectedStockItem = stock_data.find(
          (item) => {
            return item.id_piece == demandeData.type_demande_id
          } 
        );
        if (selectedStockItem) {
          const nomPiece = selectedStockItem.nom_piece
          const stockPiece = selectedStockItem.quantite
          setTypeDemande(nomPiece.toUpperCase());
          setStockInitial(stockPiece)
        } else {
          setTypeDemande('');
        }
        
        const models_data = await stock.getAllModels()
        const options_model = models_data.map((item) =>({
          value: item.id_model,
          label: item.nom_model.toUpperCase(),
        }))
        setOptionsModels(options_model)

        let users_data = await users.getAllUsers()
        setUsersSelection(users_data)
        const options_user = users_data.map((item) => ({
          value: item.id_user,
          label: item.username.toUpperCase().replace("."," ")
        }));
        setUsersOptions(options_user);
        const selectedUser = users_data.find(
          (item) => {
            return item.id_user == demandeData.id_demandeur
          }
        )
        if(selectedUser){
          const nomUser = selectedUser.fullname.toUpperCase()
          setNomDemandeur(nomUser)
        }


        let services_data = await users.getAllServices()
        setServicesSelection(services_data)
        const options_services = services_data.map((item) => ({
          value: item.id,
          label: item.nom_service.toUpperCase()
        }))
        setOptionsServices(options_services)
        const selectedService = services_data.find(
          (item) => {
            return item.id == demandeData.service_demandeur
          }
        )
        if(selectedService){
          const nomSerivce = selectedService.nom_service.toUpperCase()
          setServiceDemandeur(nomSerivce)
        }

      }catch(error){
        console.log('Error fetching data ',error)
        setErrorForm('Erreur lors de la génération du formulaire')        
      }finally{
        setLoadingDemandeData(false)
      }
    };
    fetchDemandeData();
  },[])

  const ChangeModel = (value) => {
    const pieces_model = stockDT.filter((item) => {
      return item.model_id == value
    })
    const optionsPieces = pieces_model.map((item) => ({
      value: item.id_piece,
      label: item.nom_piece.toUpperCase(),
    }));
    setOptionsPieces(optionsPieces);
  }

  const ChangePieceType = (value) => {
    console.log("Selected value:", value);
    setDemandeID(value);
    const selectedStockItem = stockDT.find(
      (item) => {
        return item.id_piece == parseInt(value)
      } 
    );
    if (selectedStockItem) {
      const nomPiece = selectedStockItem.nom_piece
      const stockPiece = selectedStockItem.quantite
      setTypeDemande(nomPiece.toUpperCase());
      setStockInitial(stockPiece)
    } else {
      setTypeDemande('');
    }
  };
  
  const ChangeService = (value) => {
    console.log("Selected value:", value);
    setServiceId(value)
    const selectedService = servicesSelection.find(
      (item) => {
        return item.id == parseInt(value)
      }
    )
    if(selectedService){
      const nomSerivce = selectedService.nom_service.toUpperCase()
      setServiceDemandeur(nomSerivce)
    }   
  };

  const ChangeUser = (value) => {
    console.log("Selected value:", value);
    setIdDemandeur(value)
    const selectedUser = usersSelection.find(
      (item) => {
        return item.id_user == parseInt(value)
      }
    )
    if(selectedUser){
      const nomUser = selectedUser.fullname.toUpperCase()
      setNomDemandeur(nomUser)
    }
  }

  const ChangeMotif = (value) => {
    console.log("Selected value:", value);
    if(value == "AUTRE"){
      setMotifDemande('')
      setMotifAutre(true);
    }else{
      setMotifAutre(false);
      setMotifDemande(value);
    }
  }

  const options_motifs = [
    { value: "PIECES TPE", label:"PIECES TPE"},
    { value: "CHARGEURS DECOMMISSIONNES", label:"CHARGEURS DECOMMISSIONNES"},
    { value: "AUTRE", label:"AUTRE"},
  ]

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);

      // Avoid adding duplicate files (optional)
      const updatedFiles = [...selectedFiles];

      newFiles.forEach(file => {
        if (!updatedFiles.find(f => f.name === file.name && f.size === file.size)) {
          updatedFiles.push(file);
        }
      });

      setSelectedFiles(updatedFiles);
    }
  };

  const handleDeleteFile = (indexToRemove) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleAddField = () => {
    setFields((prev) => [
      ...prev,
      { id: Date.now(), titre: "", information: "" }
    ]);
  };

  const handleFieldChange = (id, fieldName, value) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, [fieldName]: value } : f
      )
    );
  };

  const handleRemoveField = (id) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleConfirm = () => {
    if(!userRoles.includes(3)){
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

    if(!demandeID){
      setErrorAjout("Vous devez choisir la pièce à demander !");
      return;
    }
    if(!serviceId){
      setErrorAjout("Vous devez choisir le service demandeur !");
      return;
    }
    if(!idDemandeur){
      setErrorAjout("Vous devez choisir le demandeur !");
      return;
    }
    if(!motifDemande){
      setErrorAjout("Vous devez choisir le motif de la demande !");
      return;
    }

    let qteProduit = qteDemande;

    console.log("Quantité demandée :", qteProduit)
    let stock = stockInitial;
    
    console.log("Stock initial :", stock)

    if(qteProduit == 0){
      setErrorAjout("Quantité demandée invalide !");
      return;
    }

    console.log("Stock épuisé ?  :",(qteProduit - stockInitial) )
    if(stock == 0){
      setErrorAjout("Stock épuisé !");
      return;
    }

    if((stock - qteProduit) < 0){
      setErrorAjout("Stock insuffisant !");
      return;
    }
   
    const newProduit = {
      typeProduit: typeDemande,
      stockDepart: stock,
      quantite: qteProduit,
    };
    setProduitsDemandes(newProduit)

    const filteredFields = fields.filter(
      (f) => f.titre.trim() !== "" && f.information.trim() !== ""
    );
    setOtherFields(filteredFields)

    setErrorAjout('')
    setIsConfirmModalOpen(true)
  }
    
  const handleDemande = async (e) => {
    e.preventDefault();
    if(!userRoles.includes(3)){
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
    setIsConfirmModalOpen(false)
    setLoadingDemande(true);

    const payload = {
      commentaire: message,
      type_demande_id: demandeID,
      user_id: userId,
      service_id: serviceId,
      role_validateur: 4,
      qte_total_demande: qteDemande,
      id_demandeur: idDemandeur,
      motif_demande: motifDemande,
      otherFields: JSON.stringify(otherFields),
    }

    try{
    console.log("Sending payload : ",payload)
    const response = await demandes.updateDemande(id, payload)

    console.log(response);
    console.log('Demande modifiée')
    Swal.fire({
      title: "Succès",
      text: "Demande modifiée avec succès",
      icon: "success"
    });
    navigate('/toutes-les-demandes');
    }catch (error) {
      console.log('error')
      setError('Une erreur est survenue lors de la modification de la demande');
      setProduitsDemandes([])
      setLoadingDemande(false)
      Swal.fire({
        title: "Attention",
        text: "Une erreur est survenue lors de la modification de la demande",
        icon: "warning"
      });
      navigate('/toutes-les-demandes');
    }finally{
      setProduitsDemandes([])
      setLoadingDemande(false)
    } 
  }
  
  return (
    <>
      <div className="flex justify-center mb-6">
        {loadingDemandeData ? (<>Loading...</>) : (
          <>
            {errorFrom ? (
              <div className="text-error-600 bg-error-300 font-medium flex items-center justify-center rounded-3xl text-sm p-4">
                {errorFrom}
              </div>
            ) : (
              <>
                <ComponentCard className="md:w-1/2 w-full" title={`Demande ${typeDemande}`}>
                  <div className="pb-3 text-center">
                    <span className="text-sm font-semibold">Informations générales</span>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <Label>Model pièce <span className="text-red-700">*</span></Label>
                      <Select
                        options={optionsModels}
                        placeholder="Choisir une option"
                        onChange={ChangeModel}
                        className="dark:bg-dark-900"                          
                      />
                    </div>
                    <div>
                      <Label>Pièce demandée <span className="text-red-700">*</span></Label>
                      <Select
                        options={optionsPieces}
                        placeholder={typeDemande}
                        onChange={ChangePieceType}
                        className="dark:bg-dark-900"                          
                      />
                    </div>
                    <div>
                      <Label>Service demandeur <span className="text-red-700">*</span></Label>
                      <Select
                        options={optionsServices}
                        placeholder={serviceDemandeur}
                        onChange={ChangeService}
                        className="dark:bg-dark-900"               
                      />
                    </div>
                    <div>
                      <Label>Demandeur <span className="text-red-700">*</span></Label>
                      <Select
                        options={usersOptions}
                        placeholder={nomDemandeur}
                        onChange={ChangeUser}
                        className="dark:bg-dark-900"               
                      />
                    </div>
                    <div>
                      <Label>Motif de demande <span className="text-red-700">*</span></Label>
                      <Select
                        options={options_motifs}
                        placeholder="Choisir une option"
                        onChange={ChangeMotif}
                        className="dark:bg-dark-900"
                        defaultValue={motifDemande}               
                      />
                    </div>
                    {motifAutre ? 
                    (
                      <>
                        <div>
                          <Label>Préciser le motif <span className="text-red-700">*</span></Label>
                          <Input
                            value={motifDemande} 
                            placeholder="Motif de la demande"
                            onChange={(e) => setMotifDemande(e.target.value)}
                          />
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                    <div>
                      <Label>Commentaire</Label>
                      <TextArea
                        value={message}
                        onChange={(value) => setMessage(value)}
                        rows={4}
                        placeholder="Ajoutez un commentaire"
                      />
                    </div>
                    {/* <div>
                      <Label>Importer des fichiers</Label>
                      <FileInput className="curstom-class" 
                        onChange={handleFileChange}
                        multiple 
                      />
                      {selectedFiles.length > 0 ? (
                        <div className="border border-gray-500 mt-3 rounded">
                          {selectedFiles.map((selectedFile, index) => (
                            <div key={index} className="border-gray-300 px-1 flex justify-between items-center border-b border-t">
                              <span className="text-xs text-gray-700 font-medium">
                                <i>{selectedFile.name}</i>
                              </span>
                              <button onClick={() => handleDeleteFile(index)}>
                                <span className="text-error-600"><i className="pi pi-times"></i></span>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div> */}
                    <div className="pb-3 text-center">
                      <span className="text-sm font-semibold">Informations sur produits</span>
                    </div>
                    <div className="">
                      <div className="flex justify-center items-center">
                        <div className="me-1">
                          <Label htmlFor="input">Stock de départ <span className="text-red-700">*</span></Label>
                          <Input type="number" id="input" value={stockInitial} onChange={(e) =>{
                            const value = e.target.value
                            if(value>=0){
                              setStockInitial(value)
                            }
                          }} />
                        </div>
                        <div className="ms-1">
                          <Label htmlFor="input">Quantité demandée <span className="text-red-700">*</span></Label>
                          <Input type="number" id="input" value={qteDemande} onChange={(e) =>{
                            const value = e.target.value
                            if(value>=0){
                              setQteDemande(value)
                            }
                          }} />
                        </div>
                      </div>                        
                    </div>
                    <div>
                      {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex justify-center items-center relative mb-2 rounded"
                      >
                        {/* Remove button */}
                        <div className="absolute right-0 top-0">
                          <button
                            type="button"
                            onClick={() => handleRemoveField(field.id)}
                            className="text-red-500"
                          >
                            <i className="pi pi-times"></i>
                          </button>
                        </div>

                        {/* First input */}
                        <div className="me-1">
                          <Label htmlFor={`titre-${field.id}`}>
                            Titre champ {index + 1}
                          </Label>
                          <Input
                            type="text"
                            id={`titre-${field.id}`}
                            value={field.titre}
                            onChange={(e) =>
                              handleFieldChange(field.id, "titre", e.target.value)
                            }
                            className="border rounded px-2 py-1"
                          />
                        </div>

                        {/* Second input */}
                        <div className="ms-1">
                          <Label htmlFor={`info-${field.id}`}>Information</Label>
                          <Input
                            type="text"
                            id={`info-${field.id}`}
                            value={field.information}
                            onChange={(e) =>
                              handleFieldChange(field.id, "information", e.target.value)
                            }
                            className="border rounded px-2 py-1"
                          />
                        </div>
                      </div>
                    ))}
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={handleAddField}
                      >
                        <span className="text-xs text-gray-500 font-medium"> <span className="underline">Ajouter un champ </span><span className="text-xl">+</span></span>
                      </button>
                    </div>
                    <div>
                      <span className="text-error-600 font-medium flex items-center justify-center text-sm p-1 mt-4">
                        {errorAjout}
                      </span>
                    </div>
                  </div>
                  <div className="w-full flex flex-col justify-center items-center">
                    {loadingDemande? 
                      <span className="">
                        <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" animationDuration=".5s" />
                      </span>
                    :
                      <button onClick={handleConfirm} className="w-1/2 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center">
                        <span>Valider demande</span>
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
                  <div className="text-right text-gray-500">
                    <span className="text-xs font-medium">
                      Les champs suivis par un <span className="text-red-700">*</span> sont obligatoires
                    </span>
                  </div>
                </ComponentCard>
              </>
            )}
          
          </>
          )
        }
      </div>
      <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} className="p-4 max-w-xl">
        <div className="p-6 mt-5">
          <div>
            <span>Vous allez effectuer un mouvement de stock de :  <span className="font-bold text-red-700">{typeDemande}</span></span>
          </div>
          <div>
            <div>
              <span>Motif de la demande : <span className="font-bold text-red-700">{motifDemande}</span></span>
            </div>
            <div>
              <span>Service demandeur : <span className="font-bold text-red-700">{serviceDemandeur}</span></span>
            </div>
            <div>
              <span>Nom demandeur : <span className="font-bold text-red-700">{nomDemandeur}</span></span>
            </div>
            <div>
              <span>Stock initial : <span className="font-bold text-red-700">{stockInitial}</span></span>
            </div>
            <div>
              <span>Quantité demandée : <span className="font-bold text-red-700">{qteDemande}</span></span>
            </div>
            <div>
              <span>Stock restant : <span className="font-bold text-red-700">{stockInitial - qteDemande}</span></span>
            </div>
            {otherFields.map((field) =>{
              return(
                <>
                  <div>
                    <span>{field.titre} : <span className="font-bold text-red-700">{field.information}</span></span>
                  </div>
                </>
              )
            })}
            {/* <div className="flex-col">
              <span>Fichiers upload : </span>
              {selectedFiles.length > 0 ? (
                <div className="border border-gray-500 mt-3 rounded">
                  {selectedFiles.map((selectedFile, index) => (
                    <div key={index} className="border-gray-300 px-1 flex justify-between items-center border-b border-t">
                      <span className="text-xs text-red-700 font-medium">
                        <i>{selectedFile.name}</i>
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <span>0</span>
                </>
              )}
            </div> */}
          </div>
        </div>
        <div className='w-full mt-6 flex justify-center items-center'>
          <button
            onClick={handleDemande}
            className='w-1/4 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
            Valider
          </button>
        </div>
      </Modal>
      {/* <Modal isOpen={isSignatureModalOpen} onClose={() => setIsSignatureModalOpen(false)} className="p-4 max-w-md">
        <div className='p-1'>
          <div className='text-center mb-3 text-sm'>
              <span>Signez manuellement pour valider la demande</span>
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
                    onClick={handleDemande}
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
      </Modal> */}
    </>
  );
}
