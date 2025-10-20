import { useState, useEffect } from "react"
import { Stock } from "../../../backend/stock/Stock"
import { Users } from "../../../backend/users/Users";
import ComponentCard from "../../common/ComponentCard";
import Input from "../input/InputField";
import Label from "../Label";
import Select from "../Select";
import { Modal } from "../../ui/modal";
import { useNavigate, useParams } from "react-router";
import Swal from 'sweetalert2'
import { ProgressSpinner } from 'primereact/progressspinner';

export default function ModifyPieceInputs() {

    const stock = new Stock();
    const usersData = new Users()
    const { id } = useParams();
    const userId = localStorage.getItem('id');
    const role = localStorage.getItem("role_id")
    const navigate = useNavigate();


    const [stockDT, setStockDT] = useState([])
    const [loadingStock, setLoadingStock] = useState(false)
    const [optionsPieces, setOptionsPieces] = useState([])
    const [nomPiece, setNomPiece] = useState('')
    const [titrePiece, setTitrePiece] = useState('')
    const [stockInitial, setStockInitial] = useState('')
    const [nouveauStock, setNouveauStock] = useState('')
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [errorInput, setErrorInput] = useState('')
    const [loadingModif, setLoadingModif] = useState(false);
    const [pieceId, setPieceId] = useState(null)
    const [piece, setPiece] = useState()

    const [optionsModels, setOptionsModels] = useState([])
    const [selectedModel, setSelectedModel] = useState()
    const [listeModels, setListeModels] = useState([])

    const [optionsService, setOptionsService] = useState([])
    const [selectedService, setSelectedService] = useState(null)
    const [nomService, setNomService] = useState('')
    const [listeServices, setListeServices] = useState([])
    const [pieceType, setPieceType] = useState(null)
    const [nomModel, setNomModel] = useState('')
    const [codePiece, setCodePiece] = useState('')

    useEffect( ()=>{
        const fetchStock = async () => {
            setLoadingStock(true)
            try{
                const piece_data = await stock.getPiece(id)
                setPiece(piece_data)
                setNomPiece(piece_data.nom_piece)
                setTitrePiece(piece_data.nom_piece)
                setSelectedService(piece_data.service)
                setPieceType(piece_data.type)
                setCodePiece(piece_data.code_piece)

                const models_data = await stock.getAllModels()
                const options_model = models_data.map((item) =>({
                    value: item.id_model,
                    label: item.nom_model.toUpperCase(),
                }))
                setOptionsModels(options_model)
                setListeModels(models_data)
                const pieceModel = models_data.find((item) => {
                    return item.id_model == piece_data.model_id
                })
                if(pieceModel){
                    setNomModel(pieceModel.nom_model.toUpperCase())
                }

                const service_data = await usersData.getAllServices()
                const options_services = service_data.map((item) =>({
                    value: item.id,
                    label: item.nom_service.toUpperCase(),
                }))
                setOptionsService(options_services)
                setListeServices(service_data)
                const pieceService = service_data.find((item) => {
                    return item.id == piece_data.service
                })
                if(pieceService){
                    setNomService(pieceService.nom_service.toUpperCase())
                }

            }catch (error){
                console.log('Error fetching data ',error)
            }finally{
                setLoadingStock(false)
            }
        };
        fetchStock();
    },[])

    const options_types = [
        { value: "PIECE", label: "PIECE"},
        { value: "TERMINAL", label: "TERMINAL"},
    ]

    const changeModel = (value) =>{
        console.log("Selected value : ",value)
        setSelectedModel(value);

        const model = listeModels.find((item) =>{
            return item.id_model == parseInt(value)
        })
        if(model){
            setNomModel(model.nom_model)
        }else{
            setNomModel('Inconnu')
        }
    }

    const changeType = (value) => {
        console.log("Selected value : ",value)
        setPieceType(value)
    }

    const changeService = (value) =>{
        console.log("Selected value : ",value)
        setSelectedService(value);

        const service = listeServices.find((item) =>{
            return item.id == value
        })

        setNomService(service.nom_service.toUpperCase())
    }

    const handleConfirm = () => {
        if((role != 1) && (role != 3)){
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
    
        if(!nomPiece.trim()){
            setErrorInput("Vous devez saisir un nom !")
            return
        }
        if(!selectedModel){
            setErrorInput("Vous devez choisir le model !")
            return
        }
        if(!pieceType){
            setErrorInput("Vous devez choisir le type de pièce !")
            return
        }
        if(!selectedService){
            setErrorInput("Vous devez choisir le service !")
            return
        }
    
        setErrorInput('')
        setIsConfirmModalOpen(true)
    }

    const handleModify = async (e) => {
        e.preventDefault();
        if(role != 1 && role != 3){
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
        setLoadingModif(true)

        const user_id = userId


        const payload = {
            nomPiece,
            modelId: selectedModel,
            type: pieceType,
            serviceId: selectedService,
            user_id,
            codePiece,
        }

        try{
            const response = await stock.modifyPiece(id, payload)
            console.log(response)
            console.log('pièce modifié')

            Swal.fire({
                title: "Succès",
                text: "Pièce modifié avec succès",
                icon: "success"
            });
            navigate('/gestion-stock')
        }catch(error){
            console.log('error : ',error)
            Swal.fire({
                title: "Attention",
                text: "Une erreur s'est produite lors de la modification",
                icon: "warning"
            });
            navigate('/gestion-stock')
        }finally{
            setLoadingModif(false)
        }

    }
    return(
        <>
            <div className="flex justify-center">
                <ComponentCard className="md:w-1/2 w-full" title={`Modifier pièce ${titrePiece}`}> 
                    <div className="space-y-6">
                        <div>
                            <Label>Nom pièce <span className="text-red-700">*</span></Label>
                            <Input
                                value={nomPiece}
                                onChange={(e) => {
                                    const value = e.target.value 
                                    setNomPiece(value)
                                }}
                            />
                        </div>
                        <div>
                            <Label>Type <span className="text-red-700">*</span></Label>
                            <Select 
                                options={options_types} 
                                placeholder="Choisir une option"
                                onChange={changeType}
                            />
                        </div>
                        <div>
                            <Label>Model <span className="text-red-700">*</span></Label>
                            <Select 
                                options={optionsModels}
                                placeholder="Choisir une option"
                                onChange={changeModel}
                            />
                        </div>
                        <div>
                            <Label htmlFor="input">Service propriétaire <span className="text-red-700">*</span></Label>
                            <Select 
                                options={optionsService}
                                defaultValue={selectedService}
                                className="dark:bg-dark-900"
                                onChange={changeService}
                            />
                        </div>
                        <div>
                            <Label htmlFor="input">Code pièce</Label>
                            <Input 
                                type="text" 
                                placeholder="##" 
                                value={codePiece}
                                onChange={(e) =>{
                                    const value = e.target.value
                                    setCodePiece(value)
                                }}    
                            />
                        </div>
                        <div className="text-center">
                            <span className="text-sm text-error-600">{errorInput}</span>
                        </div>
                    </div>
                    <div className='w-full flex justify-center items-center'>
                    {loadingModif ? 
                    (
                        <span className="">
                            <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" animationDuration=".5s" />
                        </span>
                    ) : (
                        <>
                            <button
                                onClick={handleConfirm}
                                className='w-1/2 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                                Valider
                            </button>
                        </>
                    )}
                    </div>               
                </ComponentCard>
            </div>
            <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} className="p-4 max-w-xl">
                <div className="space-y-4">
                    <div className="w-full text-center">
                        <span className="p-3 rounded bg-blue-200 text-blue-500 font-medium">Modification pièce</span>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <span>Nom pièce : <span className="font-bold text-red-700">{nomPiece}</span></span>
                        </div>
                        <div>
                            <span>Type : <span className="font-bold text-red-700">{pieceType}</span></span>
                        </div>
                        <div>
                            <span>Model : <span className="font-bold text-red-700">{nomModel}</span></span>
                        </div>
                        <div>
                            <span>Service : <span className="font-bold text-red-700">{nomService}</span></span>
                        </div>
                        <div>
                            <span>Code pièce : <span className="font-bold text-red-700">{codePiece}</span></span>
                        </div>
                    </div>
                    </div>
                    <div className='w-full mt-6 flex justify-center items-center'>
                    <button
                        onClick={handleModify}
                        className='w-1/4 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                        Valider
                    </button>
                </div>
            </Modal>
        </>
    )
}