import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import ComponentCard from "../../common/ComponentCard"
import Label from "../Label"
import Input from "../input/InputField"
import Swal from "sweetalert2"
import { Modal } from "../../ui/modal"
import { ProgressSpinner } from "primereact/progressspinner"

import { ProductDeliveries } from "../../../backend/livraisons/ProductDeliveries"

export default function ModifyTypeLivraisonInputs() {

    const deliveryData = new ProductDeliveries()
    const navigate = useNavigate()
    const userId = localStorage.getItem("id")
    const { id } = useParams() 

    const [loadingInfos, setLoadingInfos] = useState(false)
    const [loadingCreate, setLoadindCreate] = useState(false)
    const [errorForm, setErrorForm] = useState('')
    const [errorInput, setErrorInput] = useState('')

    const [nomLivraison, setNomLivraison] = useState('')
    const [ancienNom, setAncienNom] = useState('')
    const [listLivraisons, setListLivraisons] = useState([])
    const [typeLivraison, setTypeLivraison] = useState('')

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [isDeleteModalOpen, setisDeleteModalOpen] = useState(false)

    useEffect( () =>{
        const fetchData = async () =>{
            try{
                setLoadingInfos(true)
                const typesLivraison = await deliveryData.getAllTypeLivraisonCommerciale()
                setListLivraisons(typesLivraison)

                const typeLivraison = await deliveryData.getOneTypeLivraison(id)
                setNomLivraison(typeLivraison.nom_type_livraison)
                setAncienNom(typeLivraison.nom_type_livraison)
            } catch(error){
                setErrorForm("Une erreur est survenue lors de la génération du formulaire.")
                console.log(error)
            } finally{
                setLoadingInfos(false)
            }
        }
        fetchData()
    },[])

    const handleConfirm = () => {
        if(!nomLivraison.trim()){
            setErrorInput("Vous devez saisir un type !")
            return
        }

        const existingType = listLivraisons.find((item) =>{
            return item.nom_type_livraison.toLowerCase().trim() == nomLivraison.toLowerCase().trim()
        })

        if(existingType){
            setErrorInput("Ce type existe déjà !")
            return
        }

        setIsConfirmModalOpen(true)
        setTypeLivraison(nomLivraison.toUpperCase().trim())
        setErrorInput('')
    }

    const handleUpdate = async (e) => {
        e.preventDefault()

        const payload = {
            typeLivraison: typeLivraison,
            user_id: userId,
        }

        try{
            setLoadindCreate(true)
            setIsConfirmModalOpen(false)
            console.log("Sending payload: ", payload);
            const response = await deliveryData.updateTypeLivraison(id, payload)
            console.log(response)
            Swal.fire({
                title: "Succès",
                text: "Type de livraison modifié avec succès",
                icon: "success"
            })
            navigate('/types-livraison')
        } catch(error){
            Swal.fire({
                title: "Attention",
                text: "Une erreur est survenue lors de la modification",
                icon: "warning"
            })
            navigate('/types-livraison')
        } finally{
            setLoadindCreate(false)
        }
    }

    const handleConfirmDelete = () => {
        setisDeleteModalOpen(true)

    }

    const handleDelete = async (e) => {
        e.preventDefault()

        const payload = {
            user_id: userId
        }

        try{
            setLoadindCreate(true)
            setisDeleteModalOpen(false)
            console.log("Sending payload: ", payload);
            const response = await deliveryData.deleteTypeLivraison(id, payload)
            console.log(response)
            Swal.fire({
                title: "Succès",
                text: "Type de livraison supprimé avec succès",
                icon: "success"
            })
            navigate('/types-livraison')
        } catch(error){
            Swal.fire({
                title: "Attention",
                text: "Une erreur est survenue lors de la suppression",
                icon: "warning"
            })
            navigate('/types-livraison')
        } finally{
            setLoadindCreate(false)
        }
    }

    return (
        <>
            <div className="flex justify-center mb-6">
                {loadingInfos ? (<>Loading...</>) : (
                    <>
                        {errorForm ? (
                            <div className="text-error-600 bg-error-300 font-medium flex items-center justify-center rounded-3xl text-sm p-4">
                                {errorForm}
                            </div>
                        ) : (
                            <>
                                <ComponentCard className="md:w-1/2 w-full" title="Modifier type Livraison">
                                    <div className="space-y-6">
                                        <div>
                                            <Label htmlFor="input">Nom Livraison <span className="text-red-700">*</span></Label>
                                            <Input type="text" placeholder="Nouveau type de livraison" value={nomLivraison}
                                                onChange={(e) =>{
                                                    const value = e.target.value
                                                    setNomLivraison(value)
                                                }}
                                            />
                                        </div>
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
                                                    <>
                                                        <button
                                                            onClick={handleConfirmDelete}
                                                            className='w-1/2 mx-3 bg-error-400 rounded-2xl h-10 flex justify-center items-center'>
                                                            Supprimer
                                                        </button>
                                                        <button
                                                            onClick={handleConfirm}
                                                            className='w-1/2 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                                                            Valider
                                                        </button>
                                                    </>
                                                )}
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
                        <span className="p-3 rounded bg-blue-200 text-blue-500 font-medium">Modifier type livraison</span>
                    </div>
                    <div className="flex flex-col">
                        <span>Vous allez modifier un type de livraison : </span>
                        <span>Ancien type : <span className="text-red-600 font-medium">{ancienNom}</span></span>
                        <span>Nouveau type : <span className="text-red-600 font-medium">{nomLivraison}</span></span>
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
                            onClick={handleUpdate}
                        >
                            Valider
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={isDeleteModalOpen} onClose={() => setisDeleteModalOpen(false)} className="p-6 max-w-xl">
                <div className="space-y-6">
                    <div className="w-full text-center">
                        <span className="p-3 rounded bg-blue-200 text-blue-500 font-medium">Supprimer type livraison</span>
                    </div>
                    <div className="flex flex-col">
                        <span>Vous allez supprimer un type de livraison : <span className="text-red-500 font-medium">{ancienNom}</span></span>
                        <span>ID du type de la livraison : <span className="text-red-500 font-medium">{id}</span></span>
                        <span className="text-center font-medium">Êtes-vous sûr ?</span>
                    </div>
                    <div className='w-full flex justify-center items-center'>
                        <button className='w-1/3 mx-3 bg-gray-400 rounded-2xl h-10 flex justify-center items-center'
                            onClick={() =>{
                                setisDeleteModalOpen(false);
                            }}
                        >
                            Annuler
                        </button>
                        <button className='w-1/3 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'
                            onClick={handleDelete}
                        >
                            Valider
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}