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
import { useNavigate, useParams } from "react-router";
import { Merchants } from "../../../backend/livraisons/Merchants.js";
import { Demandes } from "../../../backend/demandes/Demandes.js";
import { Stock } from "../../../backend/stock/Stock.js"
import { Users } from "../../../backend/users/Users.js";
import Swal from 'sweetalert2'
import { Modal } from "../../ui/modal/index.tsx";

import SignatureCanvas from 'react-signature-canvas'

export default function ModifyDemandeInputs() {

  const merchants = new Merchants();
  const demandes = new Demandes();
  const stock = new Stock();
  const users = new Users();

  const userId = localStorage.getItem('id');
  const role = localStorage.getItem("role_id")
  const navigate = useNavigate();

  const { id } = useParams();
  const [loadingStock, setLoadingStock] = useState(false);
  const [loadingDemande, setLoadingDemande] = useState(false);
  const [message, setMessage] = useState("");
  const [produitsDemandes, setProduitsDemandes] = useState([]);
  const [error, setError] = useState(null);
  const [errorFrom, setErrorForm] = useState(null);
  const [errorAjout, setErrorAjout] = useState(null);
  const [errorDeliver, setErrorDeliver] = useState(null);
  const [isConfirmModalOpen , setIsConfirmModalOpen] = useState(false);
  const [roleInitiateur, setRoleInitiateur] = useState(null);

  const [typeDemande, setTypeDemande] = useState('');
  const [demandeID, setDemandeID] = useState(null);

  const [qteDemande, setQteDemande] = useState(0);
  
  const [nomDemandeur, setNomDemandeur] = useState('');

  const [loadingDemandeInfos, setLoadingDemandeInfos] = useState(false);

  const [serviceDemandeur, setServiceDemandeur] = useState('');

  const [stockDT, setStockDT] = useState([])
  const [optionsPieces, setOptionsPieces] = useState([])
  const [stockInitial, setStockInitial] = useState(0);
  const [usersSelection, setUsersSelection] = useState([])
  const [usersOptions, setUsersOptions] = useState([])
  const [idDemandeur, setIdDemandeur] = useState(null);
  const [motifDemande, setMotifDemande] = useState('PIECES TPE');
  
  const [motifAutre, setMotifAutre] = useState(false);
  
  useEffect( ()=>{
    const fetchDemandeInfos = async () => {
      setLoadingDemandeInfos(true)
      try{

        let userRoles_data = await users.getUserRoles(parseInt(userId))
        const roles_id = userRoles_data.roles.map((role) =>{
          return role.id_role
        })
        setUserRoles(roles_id)

        let demandeData;
        demandeData = await demandes.getOneDemande(id);
        console.log(demandeData)
        setMessage(demandeData.commentaire);
        const parsedProduitsDemandes = JSON.parse(demandeData.produit_demande);
        setProduitsDemandes(parsedProduitsDemandes);
        setDemandeID(demandeData.type_demande_id)
        setIdDemandeur(demandeData.id_demandeur)
        console.log("TYPE ID DE LA DEMANDE : ",demandeData.type_demande_id)
        setMotifDemande(demandeData.motif_demande)
        setStockInitial(parsedProduitsDemandes.stockDepart)
        setQteDemande(demandeData.qte_total_demande)
        setRoleInitiateur(demandeData.role_id_demandeur)
        setNomDemandeur(demandeData.nom_demandeur)

        let idService = demandeData.role_id_demandeur
        if(idService == 7){
            setServiceDemandeur('SUPPORT')
        } else if(idService == 6){
            setServiceDemandeur('MAINTENANCE')
        }

        let stockData;
        stockData = await stock.getAllStock()
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

      }catch(error){
        console.log('Error fetching data ',error)
        setErrorForm('Erreur lors de la génération du formulaire')

      }finally{
        setLoadingDemandeInfos(false)
      }
    }
    const fetchStock = async () => {
      setLoadingStock(true)
      try{
        let data;
        data = await stock.getAllStock()
        console.log(data)
        setStockDT(data)
        const piecesA920 = data.filter(item =>{
          return item.model_id == 1;
        });
        const options = piecesA920.map((item) => ({
          value: item.id_piece,
          label: item.nom_piece.toUpperCase(),
        }));
        setOptionsPieces(options);
      }catch(error){
        console.log('Error fetching data ',error)
        setErrorForm('Erreur lors de la génération du formulaire')        
      }finally{
        setLoadingStock(false)
      }
    };
    const fetchUsers = async () => {
      let data;
      data = await users.getAllUsers()
      setUsersSelection(data)
      const options = data.map((item) => ({
        value: item.id_user,
        label: item.username.toUpperCase().replace("."," ")
      }));
      setUsersOptions(options);
    }
    fetchDemandeInfos();
    fetchStock();
    fetchUsers();
  },[id])

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
    setServiceDemandeur(value);
    if(value == 'MAINTENANCE'){
      setRoleInitiateur(6);
    } else if(value == 'SUPPORT'){
      setRoleInitiateur(7);
    } else if(value == 'LIVRAISON'){
      setRoleInitiateur(1);
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
      const nomUser = selectedUser.username.toUpperCase().replace(".", " ")
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
  
  const options_services = [
    { value: "MAINTENANCE", label: "MAINTENANCE" },
    { value: "SUPPORT", label: "SUPPORT"},
    { value: "LIVRAISON", label: "LIVRAISON"},
  ];

  const options_motifs = [
    { value: "PIECES TPE", label:"PIECES TPE"},
    { value: "CHARGEURS DECOMMISSIONNES", label:"CHARGEURS DECOMMISSIONNES"},
    { value: "AUTRE", label:"AUTRE"},
  ]



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

    if(!demandeID){
      setErrorAjout("Vous devez choisir la pièce à demander !");
      return;
    }
    if(!roleInitiateur){
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
      id: id,
      produitsDemandes: JSON.stringify(produitsDemandes),
      commentaire: message,
      type_demande_id: demandeID,
      user_id: userId,
      role_validateur: 4,
      nom_demandeur: nomDemandeur,
      qte_total_demande: qteDemande,
      id_demandeur: idDemandeur,
      motif_demande: motifDemande
    }
    try{
    const response = await demandes.updateDemande(payload)

    console.log(response);
    console.log('Demande modifiée')
    Swal.fire({
      title: "Succès",
      text: "Demande modifiée avec succès",
      icon: "success"
    });
    navigate('/toutes-les-demandes');
    }catch (error) {
      Swal.fire({
        title: "Attention",
        text: "Une erreur est survenue lors de la modification de la demande",
        icon: "warning"
      });
      navigate('/toutes-les-demandes');
      console.log('error lors de la demande : ',error)
      setError('Erreur lors de la génération du formulaire');
    }finally{
      setProduitsDemandes([])
      setLoadingDemande(false)
    } 
  }
  
  return (
    <>
      <div className="flex justify-center mb-6">
        {loadingStock ? (<>Loading...</>) :
          (
            errorFrom ? (
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
                          <Label>Pièce demandée <span className="text-red-700">*</span></Label>
                          <Select
                            options={optionsPieces}
                            defaultValue={demandeID}                          
                            onChange={ChangePieceType}
                            className="dark:bg-dark-900"
                          />
                        </div>
                        <div>
                          <Label>Service demandeur <span className="text-red-700">*</span></Label>
                          <Select
                            options={options_services}
                            placeholder="Choisir une option"
                            onChange={ChangeService}
                            className="dark:bg-dark-900" 
                            defaultValue={serviceDemandeur}              
                          />
                        </div>
                        <div>
                          <Label>Demandeur <span className="text-red-700">*</span></Label>
                          <Select
                            options={usersOptions}
                            placeholder="Choisir une option"
                            onChange={ChangeUser}
                            className="dark:bg-dark-900"
                            defaultValue={idDemandeur}               
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
                          <span className="text-error-600 font-medium flex items-center justify-center text-sm p-1 mt-4">
                            {errorAjout}
                          </span>
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
      <div className="w-full flex flex-col justify-center items-center">
        {loadingDemande? 
          <span className="mt-6">
            <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" animationDuration=".5s" />
          </span>
        :
          <button onClick={handleConfirm} className="w-1/4 mt-6 bg-green-400 rounded-2xl h-10 flex justify-center items-center">
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
