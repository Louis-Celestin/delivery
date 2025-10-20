import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import ComponentCard from "../../common/ComponentCard"
import Label from "../Label"
import Input from "../input/InputField"
import Select from "../Select"
import Swal from "sweetalert2"
import { Modal } from "../../ui/modal"
import { ProgressSpinner } from "primereact/progressspinner"

import { Stock } from "../../../backend/stock/Stock"
import { Users } from "../../../backend/users/Users"

export default function AjouterPieceInputs() {

    const stockData = new Stock()
    const usersData = new Users()
    const userId = localStorage.getItem("id")
    const navigate = useNavigate()

    const [loadingInfos, setLoadingInfos] = useState(false)
    const [loadingCreate, setLoadindCreate] = useState(false)
    const [errorForm, setErrorForm] = useState('')
    const [errorInput, setErrorInput] = useState('')

    const [stock, setStock] = useState([])
    const [listeServices, setListeServices] = useState([])

    const [nomPiece, setNomPiece] = useState('')

    const [optionsModel, setOptionsModel] = useState([])
    const [selectedModel, setSelectedModel] = useState()
    const [nomModel, setNomModel] = useState('')
    const [listeModels, setListeModels] = useState([])

    const [optionsService, setOptionsService] = useState([])
    const [selectedService, setSelectedService] = useState()
    const [nomService, setNomService] = useState('')

    const [quantitePiece, setQuantitePiece] = useState(0)

    const [codePiece, setCodePiece] = useState('')

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

    const [pieceType, setPieceType] = useState('')

    useEffect( () =>{
        const fetchData = async () =>{
            try{
                setLoadingInfos(true)
                const stock_data = await stockData.getAllStock()
                setStock(stock_data)

                const service_data = await usersData.getAllServices()
                const options_services = service_data.map((item) =>({
                    value: item.id,
                    label: item.nom_service.toUpperCase(),
                }))
                setOptionsService(options_services)
                setListeServices(service_data)

                const models_data = await stockData.getAllModels()
                setListeModels(models_data)
                const options_models = models_data.map((item) =>({
                    value: item.id_model,
                    label: item.nom_model,
                }))
                setOptionsModel(options_models)
            } catch(error){
                setErrorForm("Une erreur s'est produite lors de la génération du formulaire.")
                console.log(error)
            } finally{
                setLoadingInfos(false)
            }
        }
        fetchData()
    },[])

    const options_types = [
        { value: "PIECE", label: "PIECE"},
        { value: "TERMINAL", label: "TERMINAL"},
    ]

    const changeModel = (value) =>{
        console.log("Selected value : ",value)
        setSelectedModel(value);

        const model = listeModels.find((item) =>{
            return item.id_model == value
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

        const existingPiece = stock.find((item) =>{
            const sameName = item.nom_piece.toLowerCase().trim() == nomPiece.toLowerCase().trim()
            const sameModel = item.model_id == selectedModel
            return sameName && sameModel
        })

        if(existingPiece){
            setErrorInput("Cette pièce existe déjà !")
            return
        }

        setIsConfirmModalOpen(true)
        setErrorInput('')
    }

    const handleCreate = async (e) => {
        e.preventDefault()

        const payload = {
            nomPiece: nomPiece,
            modelId: selectedModel,
            type: pieceType,
            serviceId: selectedService,
            code_piece: codePiece,
            user_id: userId,
        }

        try{
            setLoadindCreate(true)
            setIsConfirmModalOpen(false)
            console.log("Sending payload: ", payload);
            const response = await stockData.addPiece(payload)
            console.log(response)
            Swal.fire({
                title: "Succès",
                text: "Nouvelle pièce ajouté au stock",
                icon: "success"
            })
            navigate('/gestion-stock')
        } catch(error){
            Swal.fire({
                title: "Attention",
                text: "Une erreur est survenue lors de la création",
                icon: "warning"
            })
            navigate('/gestion-stock')
        } finally{
            setLoadindCreate(false)
        }
    }

    return(
        <>
            <div className="flex justify-center mb-6">
                {loadingInfos? (<>Loading...</>) : (
                    <>
                        {errorForm ? (
                            <div className="text-error-600 bg-error-300 font-medium flex items-center justify-center rounded-3xl text-sm p-4">
                                {errorForm}
                            </div>
                        ) : (
                            <>
                                <ComponentCard className="md:w-1/2 w-full" title="Ajouter une nouvelle pièce">
                                    <div className="space-y-6">
                                        <div>
                                            <Label htmlFor="input">Nom pièce <span className="text-red-700">*</span></Label>
                                            <Input 
                                                type="text" 
                                                value={nomPiece}
                                                placeholder="TPE"
                                                onChange={(e) =>{
                                                    const value = e.target.value
                                                    setNomPiece(value)
                                                }}    
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="input">Model de la pièce <span className="text-red-700">*</span></Label>
                                            <Select 
                                                options={optionsModel}
                                                placeholder="Choisir une option"
                                                onChange={changeModel}
                                                className="dark:bg-dark-900"
                                            />
                                        </div>
                                        <div>
                                            <Label>Type <span className="text-red-700">*</span></Label>
                                            <Select 
                                                options={options_types}
                                                placeholder="Choisir une option"
                                                onChange={changeType}
                                                className="dark:bg-dark-900"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="input">Service propriétaire <span className="text-red-700">*</span></Label>
                                            <Select 
                                                options={optionsService}
                                                placeholder="Choisir une option"
                                                onChange={changeService}
                                                className="dark:bg-dark-900"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="input">Code pièce</Label>
                                            <Input type="text" placeholder="##" value={codePiece}
                                                onChange={(e) =>{
                                                    const value = e.target.value
                                                    setCodePiece(value)
                                                }}    
                                            />
                                        </div>
                                        {/* <div>
                                            <Label htmlFor="input">Quantitée initiale</Label>
                                            <Input type="number" value={quantitePiece} 
                                                onChange={(e) =>{
                                                    let value = e.target.value
                                                    if(value >=0){
                                                        setQuantitePiece(value)
                                                    }
                                                }}
                                            />
                                        </div> */}
                                        <div className="text-center">
                                            <span className="text-sm text-error-600">{errorInput}</span>
                                        </div>
                                        <div className='w-full mt-6 flex justify-center items-center'>
                                            {loadingCreate ? 
                                                (
                                                    <span className="">
                                                        <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" animationDuration=".5s" />
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={handleConfirm}
                                                        className='w-1/2 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                                                        Valider
                                                    </button>
                                                )
                                            }
                                        </div>
                                        <div className="text-right text-gray-500">
                                            <span className="text-xs font-medium">
                                                Les champs suivis par un <span className="text-red-700">*</span> sont obligatoires
                                            </span>
                                        </div>
                                    </div>
                                </ComponentCard>
                            </>
                        )}
                    </>
                )}
            </div>
            <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} className="p-6 max-w-xl">
                <div className="space-y-6">
                    <div className="w-full text-center">
                        <span className="p-3 rounded bg-blue-200 text-blue-500 font-medium">Nouvelle pièce</span>
                    </div>
                    <div>
                        <span>Vous allez ajouter une nouvelle pièce : <span className="text-red-500 font-medium">{nomPiece}</span></span>
                    </div>
                    <div>
                        <span>Code pièce : <span className="text-red-500 font-medium">{codePiece}</span></span>
                    </div>
                    <div>
                        <span>Modèle : <span className="text-red-500 font-medium">{nomModel}</span></span>
                    </div>
                    <div>
                        <span>Type : <span className="text-red-500 font-medium">{pieceType}</span></span>
                    </div>
                    <div>
                        <span>Service : <span className="text-red-500 font-medium">{nomService}</span></span>
                    </div>
                    <div className='w-full flex justify-center items-center'>
                        <button className='w-1/3 mx-3 bg-gray-400 rounded-2xl h-10 flex justify-center items-center'
                            onClick={() =>{
                                setIsConfirmModalOpen(false);
                            }}
                        >
                            Annuler
                        </button>
                        <button className='w-1/3 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'
                            onClick={handleCreate}
                        >
                            Valider
                        </button>
                    </div>
                </div>
            </Modal> 
        </>
    )
}