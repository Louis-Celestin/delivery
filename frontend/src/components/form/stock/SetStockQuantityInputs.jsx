import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import ComponentCard from "../../common/ComponentCard"
import { Stock } from "../../../backend/stock/Stock"
import { Users } from "../../../backend/users/Users"
import { Modal } from "../../ui/modal"
import Swal from 'sweetalert2'
import { ProgressSpinner } from 'primereact/progressspinner';
import Input from "../input/InputField"
import Label from "../Label"
import TextArea from "../input/TextArea"

export default function SetStockQuantityInputs() {
    
    const stockData = new Stock()
    const userData = new Users()

    const { id } = useParams()
    const navigate = useNavigate();
    const userId = localStorage.getItem('id');

    const [loading, setLoading] = useState(false)
    const [pieceStock, setPieceStock] = useState(0)
    const [pieceCarton, setPieceCarton] = useState(0)
    const [nomPiece, setNomPiece] = useState('')
    const [nomModel, setNomModel] = useState('')
    const [nomService, setNomService] = useState('')

    const [entreeModalOpen, setEntreeModelOpen] = useState(false)
    const [sortieModalOpen, setSortieModelOpen] = useState(false)

    const [motif, setMotif]  = useState('')
    const [commentaire, setCommentaire] = useState('')

    const [quantite, setQuantite] = useState(0)
    const [stockCarton, setStockCarton] = useState(0)
    const [stockFinal, setStockFinal] = useState(0)
    const [stockCartonFinal, setStockCartonFinal] = useState(0)

    const [error, setError] = useState('')
    const [loadingValidation, setLoadingValidation] = useState(false)

    const [isEntree, setIsEntree] = useState(false)

    useEffect( ()=> {
        const fetchPiece = async () => {
            setLoading(true)
            try{
                const piece_data = await stockData.getPiece(id)
                setPieceStock(parseInt(piece_data.quantite))
                setNomPiece(piece_data.nom_piece)
                if(piece_data.stock_carton){
                    setPieceCarton(piece_data.stock_cartonn)
                }

                const model_data = await stockData.getAllModels()
                const model = model_data.find((item) => {
                    return item.id_model == piece_data.model_id
                })
                if(model){
                    setNomModel(model.nom_model)
                }

                const service_data = await userData.getAllServices()
                const service = service_data.find((item) => {
                    return item.id == piece_data.service
                })
                if(service){
                    setNomService(service.nom_service.toUpperCase())
                }

            } catch (error){
                console.log('Error fetching the data ',error)
            } finally{
                setLoading(false)
            }
        };
        fetchPiece()
    }, [])

    const handleEntree = () => {
        if(!motif){
            setError('Vous devez renseigner un motif !')
            return
        }
        if(quantite == 0){
            setError('Quantité invalide !')
            return
        }
        let final = pieceStock + quantite
        setStockFinal(final)
        setStockCartonFinal(pieceCarton + stockCarton)
        setError('')
        setEntreeModelOpen(true)
        setIsEntree(true)
    }
    const handleSortie = () => {
        if(!motif){
            setError('Vous devez renseigner un motif !')
            return
        }
        if(quantite == 0 || quantite > pieceStock){
            setError('Quantité invalide !')
            return
        }
        if(stockCarton > pieceCarton){
            setError('Stock carton invalide !')
            return
        }

        setStockFinal(pieceStock - quantite)
        setStockCartonFinal(pieceCarton - stockCarton)
        setError('')
        setSortieModelOpen(true)
        setIsEntree(false)
    }

    const handleValidate = async () => {
        setEntreeModelOpen(false)
        setSortieModelOpen(false)

        const piece_id = id
        const payload = {
            stockFinal,
            motif: motif,
            commentaire,
            isEntree,
            userId
        }

        try{
            setLoadingValidation(true)
            console.log('Sendind payload...')

            const response = await stockData.setStock(piece_id, payload)

            console.log(response)
            Swal.fire({
                title: "Succès",
                text: "Modification effectuée avec succès !",
                icon: "success"
            })
            navigate('/entree-sortie-stock')

        } catch(error){
            Swal.fire({
                title: "Error",
                text: "Une erreur est survenue lors de la modification !",
                icon: "error"
            })
            navigate('/entree-sortie-stock')
        } finally{
            setLoadingValidation(false)
        }
        

    }

    return(
        <>
            <div className="flex justify-center">
                <ComponentCard className="md:w-1/2 w-full" title={`Stock ${nomPiece}`}>
                    <div className="space-y-5">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col  border-b pb-2 border-black">
                                <span className="text-xs text-gray-700 font-normal">{nomPiece} {nomModel} - {nomService}</span>
                                <span className="font-medium">QUANTITE ACTUELLE</span>
                                <span className="text-title-md font-bold">{pieceStock}</span>
                                <span className="text-sm">Stock carton - {pieceCarton ? (pieceCarton) : ('N/A')}</span>
                            </div>
                            <div>
                                <span><i className="pi pi-box" style={{ fontSize: '3rem' }}></i></span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <Label>Motif <span className="text-red-700">*</span></Label>
                                <Input 
                                    type="text"
                                    value={motif}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        setMotif(value)
                                    }}
                                />
                            </div>
                            <div>
                                <Label>Commentaire</Label>
                                <TextArea 
                                    type="text"
                                    value={commentaire}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        setCommentaire(value)
                                    }}
                                />
                            </div>
                            <div>
                                <Label>Quantité <span className="text-red-700">*</span></Label>
                                <Input type="number" id="input" value={quantite} 
                                    onChange={(e) =>{
                                        const value = Number(e.target.value)
                                        if(value>=0){
                                            setQuantite(value)
                                        }
                                    }} 
                                />
                            </div>
                            <div>
                                <Label>Stock Carton</Label>
                                <Input type="number" id="input" value={stockCarton} 
                                    onChange={(e) =>{
                                        const value = Number(e.target.value)
                                        if(value>=0){
                                            setStockCarton(value)
                                        }
                                    }} 
                                />
                            </div>
                            <div>
                                <span className="text-error-600 font-medium flex items-center justify-center text-sm p-1 mt-4">
                                    {error}
                                </span>
                            </div>
                        </div>
                        <div className="text-center">
                            {loadingValidation ? (
                                <>
                                    <div>
                                        <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" animationDuration=".5s" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <button className="w-full flex items-center justify-between bg-green-400 p-2 rounded-2xl"
                                                onClick={handleEntree}
                                            >
                                                <span>Faire une entrée</span>
                                                <i className="pi pi-arrow-circle-down"></i>
                                            </button>
                                        </div>
                                        <div>
                                            <button className="w-full flex items-center justify-between bg-red-400 p-2 rounded-2xl"
                                                onClick={handleSortie}
                                            >
                                                <span>Faire une sortie</span>
                                                <i className="pi pi-arrow-circle-up"></i>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </ComponentCard>
            </div>
            <Modal isOpen={entreeModalOpen} onClose={() => setEntreeModelOpen(false)} className="p-4 max-w-md">
                <div className="space-y-5">
                    <div className="w-full text-center">
                        <span className="p-3 rounded bg-blue-200 text-blue-500 font-medium">Entrée stock</span>
                    </div>
                    <div className="ms-5 text-center">
                        <span className="text-sm text-gray-800">{motif}</span>
                    </div>
                    <div className="space-y-1 ms-5">
                        <div>
                            <span>Quantité initiale : {pieceStock}</span>
                        </div>
                        <div>
                            <span>Mouvement : <span className="text-green-600 font-bold">+{quantite}</span></span>
                        </div>
                        <div>
                            <span>Stock final : {stockFinal}</span>
                        </div>
                    </div>
                    {stockCarton > 0 ? (
                        <div className="space-y-1 ms-5 border-t pt-3">
                            <div>
                                <span>Stock carton : {pieceCarton}</span>
                            </div>
                            <div>
                                <span>Mouvement : <span className="text-green-600 font-bold">+{stockCarton}</span></span>
                            </div>
                            <div>
                                <span>Stock carton final : {stockCartonFinal}</span>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                    <div className='w-full mt-6 flex justify-center items-center'>
                        <button
                         onClick={handleValidate}
                         className='w-1/4 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                            Valider
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={sortieModalOpen} onClose={() => setSortieModelOpen(false)} className="p-4 max-w-md">
                <div className="space-y-5">
                    <div className="w-full text-center">
                        <span className="p-3 rounded bg-blue-200 text-blue-500 font-medium">Sortie stock</span>
                    </div>
                    <div className="ms-5 text-center">
                        <span className="text-sm text-gray-800">{motif}</span>
                    </div>
                    <div className="space-y-1 ms-5">
                        <div>
                            <span>Quantité initiale : {pieceStock}</span>
                        </div>
                        <div>
                            <span>Mouvement : <span className="text-red-600 font-bold">-{quantite}</span></span>
                        </div>
                        <div>
                            <span>Stock final : {stockFinal}</span>
                        </div>
                    </div>
                    {stockCarton > 0 ? (
                        <div className="space-y-1 ms-5">
                            <div>
                                <span>Stock carton : {pieceCarton}</span>
                            </div>
                            <div>
                                <span>Mouvement : <span className="text-red-600 font-bold">-{stockCarton}</span></span>
                            </div>
                            <div>
                                <span>Stock carton final : {stockCartonFinal}</span>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                    <div className='w-full mt-6 flex justify-center items-center'>
                        <button
                         onClick={handleValidate}
                         className='w-1/4 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                            Valider
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}