import { useEffect, useState, useMemo } from "react"
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
import Select from "../Select"
import Checkbox from "../input/Checkbox"

export default function SetStockQuantityInputs() {
    
    const stockData = new Stock()
    const userData = new Users()

    const { id } = useParams()
    const navigate = useNavigate();
    const userId = localStorage.getItem('id');

    const [loading, setLoading] = useState(false)

    const [quantitePiece, setQuantitePiece] = useState(null)
    const [newStockPiece, setNewStockPiece] = useState(0)
    const [finalStockPiece, setFinaleStockPiece] = useState(0)

    const [quantiteCarton, setQuantiteCarton] = useState(null)
    const [newStockCarton, setNewStockCarton] = useState(0)
    const [finalStockCarton, setFinalStockCarton] = useState(0)

    const [quantiteLot, setQuantiteLot] = useState(null)

    const [pieceCarton, setPieceCarton] = useState(0)
    const [nomPiece, setNomPiece] = useState('')

    const [entreeParPieceModalOpen, setEntreeParPieceModalOpen] = useState(false)
    const [sortieParPieceModalOpen, setSortieParPieceModalOpen] = useState(false)

    const [motif, setMotif]  = useState('')
    const [commentaire, setCommentaire] = useState('')

    const [quantite, setQuantite] = useState(0)
    const [stockCarton, setStockCarton] = useState(0)
    const [stockFinal, setStockFinal] = useState(0)
    const [stockCartonFinal, setStockCartonFinal] = useState(0)

    const [error, setError] = useState('')
    const [loadingValidation, setLoadingValidation] = useState(false)

    const [isEntree, setIsEntree] = useState(true)

    const [stockLot, setStockLot] = useState(0)
    const [stockCartonLot, setStockCartonLot] = useState(0)
    const [stockPieceCarton1, setStockPieceCarton1] = useState(0)

    const [listLot, setListLot] = useState([])
    const [optionsLot, setOptionsLot] = useState([])

    const [cartonDetectedLot, setCartonDetectedLot] = useState(0)
    const [stockPieceCarton2, setStockPieceCarton2] = useState(0)

    const [stockPieceCarton3, setStockPieceCarton3] = useState(0)

    const [optionsCartons, setOptionsCartons] = useState([])
    const [quantitePieceCarton, setQuantitePieceCarton] = useState(0)

    const [models, setModels] = useState([])
    const [optionsModels, setOptionsModels] = useState([])
    const [selectedModel, setSelectedModel] = useState()
    const [nomModel, setNomModel] = useState('')

    const [services, setServices] = useState([])
    const [optionsServices, setOptionsServices] = useState([])
    const [selectedService, setSelectedService] = useState()
    const [nomService, setNomService] = useState('')


    const [parLot, setParLot] = useState(false)
    const [parCartonLot, setParCartonLot] = useState(false)
    const [parPieceCarton, setParPieceCarton] = useState(false)
    const [parCarton, setParCarton] = useState(false)
    const [parPiece, setParPiece] = useState(false)
    const [selected, setSelected] = useState(false)

    useEffect( ()=> {
        const fetchPiece = async () => {
            setLoading(true)
            try{
                const piece_data = await stockData.getPiece(id)
                setNomPiece(piece_data.nom_piece)

                const itemModels_data = await stockData.getItemModels(id)
                const options_models = itemModels_data.model_piece.map((item) =>({
                    value: item.id_model,
                    label: item.nom_model.toUpperCase()
                }))
                setOptionsModels(options_models)
                setModels(itemModels_data.model_piece)

                const itemService_data = await stockData.getItemServices(id)
                const options_services = itemService_data.services.map((item) =>({
                    value: item.id,
                    label: item.nom_service.toUpperCase()
                }))
                setOptionsServices(options_services)
                setServices(itemService_data.services)

            } catch (error){
                console.log('Error fetching the data ',error)
            } finally{
                setLoading(false)
            }
        };
        fetchPiece()
    }, [])
    
    const handleSelectModel = (value) => {
        console.log('Selected model value: ',value)
        const model = models.find((item) =>{
            return item.id_model == value
        })
        const nomModel = model ? model.nom_model : ''
        setNomModel(nomModel)
        setSelectedModel(value)
    }

    const handleSelectService = (value) => {
        console.log('Selected service value: ',value)
        const service = services.find((item) =>{
            return item.id == value
        })
        const nomService = service ? service.nom_service : ''
        setNomService(nomService)
        setSelectedService(value)
    }

    useEffect(() => {
        const fetchQuantite = async () => {
            if (!selectedModel || !selectedService) return // wait until both are chosen
            try {
                const quantite_piece = await stockData.getStockPiece(id, selectedModel, selectedService)
                setQuantitePiece(quantite_piece)
                console.log(quantite_piece)

                const stock_carton = await stockData.getCartonPiece(id, selectedModel, selectedService)
                setQuantiteCarton(stock_carton.length)

                const stock_lot = await stockData.getLotPiece(id, selectedModel, selectedService)
                setQuantiteLot(stock_lot.length)
                setListLot(stock_lot)
                const options_lot = stock_lot.map((item) =>({
                    value: item.id,
                    label: `Lot ${item.numero_lot} - ${item.quantite_carton} cartons`
                }))
                setOptionsLot(options_lot)

            } catch (error) {
                console.log("Error fetching quantity", error)
                // setQuantitePiece(0)
                // setQuantiteCarton(0)
                // setQuantiteLot(0)
            }
        }

        fetchQuantite()
    }, [id, selectedModel, selectedService])

    const selectLotCarton = async (id) => {
        const cartons_data = await stockData.getCartonLot(id)
        const options_cartons = cartons_data.map((item) =>({
            value: item.id,
            label: `Carton ${item.numero_carton} - ${item.quantite_piece} pièces`
        }))
        setOptionsCartons(options_cartons)
    }

    const checkValidate = () => {
        if(!selectedModel){
            setError("Vous devez choisir le modèle !")
            return false
        }
        if(!selectedService){
            setError("Vous devez choisir le service !")
            return false
        }
        if(!motif){
            setError("Vous devez précisier le motif !")
            return false
        }
        setError('')
        return true
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
    const handleParLot = async () => {
        setEntreeParPieceModalOpen(false)
        setSortieModelOpen(false)

        const piece_id = id
        const payload = {
            totalLot: stockLot,
            cartonLot: stockCartonLot,
            pieceCarton: stockPieceCarton1,
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
    const handleParCartonLot = async () => {
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
    const handleParPieceCarton = async () => {
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
    
    // FONCTIONS POUR MOUVEMENT PAR CARTON
    const handleEntreeParCarton = () => {

    }
    const handleValidateParCarton = async () => {
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


    // FONCTIONS POUR MOUVEMENT STOCK PAR PIECE
    const handleEntreeParPiece = () => {
        
        if(!checkValidate()){
            return
        }
        if(newStockPiece == 0){
            setError("Quantité invalide !")
            return
        }
        setFinaleStockPiece(quantitePiece + newStockPiece)
        setEntreeParPieceModalOpen(true)
        setError('')
    }
    const handleSortieParPiece = () => {
        if(!checkValidate()){
            return
        }
        if(newStockPiece == 0){
            setError("Quantité invalide !")
            return
        }
        if(newStockPiece > quantitePiece){
            setError("Stock insuffisant !")
            return
        }
        setIsEntree(false)
        setFinaleStockPiece(quantitePiece - newStockPiece)
        setSortieParPieceModalOpen(true)
        setError('')
    }
    const handleValidateParPiece = async () => {
        setEntreeParPieceModalOpen(false)
        setSortieParPieceModalOpen(false)

        const item_id = id
        const model_id = selectedModel
        const service_id = selectedService
        const payload = {
            stockInitial: quantitePiece? quantitePiece : 0,
            quantiteMouvement: newStockPiece,
            stockFinal: finalStockPiece,
            motif,
            commentaire,
            isEntree,
            userId
        }
        try{
            setLoadingValidation(true)
            console.log('Sendind payload...')

            const response = await stockData.setStockPiece(item_id, model_id, service_id, payload)

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
                        <div>
                            <Label>Choisir le model <span className="text-red-700">*</span></Label>
                            <Select 
                                options={optionsModels}
                                placeholder="Choisir une option"
                                onChange={handleSelectModel}
                                className="dark:bg-dark-900"    
                            />
                        </div>
                        <div>
                            <Label>Choisir le service <span className="text-red-700">*</span></Label>
                            <Select 
                                options={optionsServices}
                                placeholder="Choisir une option"
                                onChange={handleSelectService}
                                className="dark:bg-dark-900"    
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col  border-b pb-2 border-black">
                                <span className="text-xs text-gray-700 font-normal">{nomPiece} {nomModel} - {nomService}</span>
                                <span className="font-medium">QUANTITE ACTUELLE</span>
                                <span className="text-title-md font-bold">{quantitePiece ? quantitePiece : '0'}</span>
                                <span className="text-sm">Stock carton - {quantiteCarton ? quantiteCarton : 'N/A'}</span>
                                <span className="text-sm">Stock lot - {quantiteLot ? quantiteLot : 'N/A'}</span>
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
                                <span>Faire un mouvement : </span>
                                <div>
                                    <div>
                                        <div className="flex items-center gap-3 my-2">
                                            <Checkbox 
                                                checked={parLot}
                                                onChange={()=>{
                                                    if(parLot){
                                                        setParLot(false)
                                                        setSelected(false)
                                                    } else{
                                                        setSelected(true)
                                                        setParLot(true)
                                                        setParCarton(false)
                                                        setParCartonLot(false)
                                                        setParPiece(false)
                                                        setParPieceCarton(false)
                                                    }
                                                }}
                                                readOnly 
                                                label="Par Lot" 
                                            />
                                        </div>
                                        <div className="flex items-center gap-3 my-2">
                                            <Checkbox 
                                                checked={parCartonLot}
                                                onChange={()=>{
                                                    if(parCartonLot){
                                                        setParCartonLot(false)
                                                        setSelected(false)
                                                    } else{
                                                        setSelected(true)
                                                        setParLot(false)
                                                        setParCarton(false)
                                                        setParCartonLot(true)
                                                        setParPiece(false)
                                                        setParPieceCarton(false)
                                                    }
                                                }}
                                                readOnly 
                                                label="Par Carton-Lot" 
                                            />
                                        </div>
                                        <div className="flex items-center gap-3 my-2">
                                            <Checkbox 
                                                checked={parPieceCarton}
                                                onChange={()=>{
                                                    if(parPieceCarton){
                                                        setParCartonLot(false)
                                                        setSelected(false)
                                                    } else{
                                                        setSelected(true)
                                                        setParLot(false)
                                                        setParCarton(false)
                                                        setParCartonLot(false)
                                                        setParPiece(false)
                                                        setParPieceCarton(true)
                                                    }
                                                }}
                                                readOnly 
                                                label="Par Pièce-Carton" 
                                            />
                                        </div>
                                        <div className="flex items-center gap-3 my-2">
                                            <Checkbox 
                                                checked={parCarton}
                                                onChange={()=>{
                                                    if(parCarton){
                                                        setParCarton(false)
                                                        setSelected(false)
                                                    } else{
                                                        setSelected(true)
                                                        setParLot(false)
                                                        setParCarton(true)
                                                        setParCartonLot(false)
                                                        setParPiece(false)
                                                        setParPieceCarton(false)
                                                    }
                                                }}
                                                readOnly 
                                                label="Par Carton" 
                                            />
                                        </div>
                                        <div className="flex items-center gap-3 my-2">
                                            <Checkbox 
                                                checked={parPiece}
                                                onChange={()=>{
                                                    if(parPiece){
                                                        setParPiece(false)
                                                        setSelected(false)
                                                    } else{
                                                        setSelected(true)
                                                        setParLot(false)
                                                        setParCarton(false)
                                                        setParCartonLot(false)
                                                        setParPiece(true)
                                                        setParPieceCarton(false)
                                                    }
                                                }}
                                                readOnly 
                                                label="Par Pièce" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* FAIRE UN MOUVEMENT PAR LOT */}
                            {parLot ? (
                                <>
                                    <div className="py-3 text-center">
                                        <span className="text-sm font-semibold">Mouvement par lots</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label>Quantité Lot</Label>
                                            <Input type="number" id="input" value={stockLot}
                                                onChange={(e) =>{
                                                    const value = Number(e.target.value)
                                                    if(value>=0){
                                                        setStockLot(value)
                                                    }
                                                }} 
                                            />
                                        </div>
                                        <div>
                                            <Label>Quantité Carton/Lot</Label>
                                            <Input type="number" id="input" value={stockCartonLot}
                                                onChange={(e) =>{
                                                    const value = Number(e.target.value)
                                                    if(value>=0){
                                                        setStockCartonLot(value)
                                                    }
                                                }} 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Quantité Pièce/Carton</Label>
                                        <Input type="number" id="input" value={stockPieceCarton1}
                                            onChange={(e) =>{
                                                const value = Number(e.target.value)
                                                if(value>=0){
                                                    setStockPieceCarton1(value)
                                                }
                                            }} 
                                        />
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
                                                <div className="grid grid-cols-3 gap-2">
                                                    <div>
                                                        <button className="w-full text-center flex items-center justify-between bg-green-400 p-2 rounded-2xl"
                                                            onClick={handleParLot}
                                                        >
                                                            <span>Entrée</span>
                                                            <i className="pi pi-arrow-circle-down"></i>
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <button className="w-full text-center flex items-center justify-between bg-red-400 p-2 rounded-2xl"
                                                            onClick={handleSortie}
                                                        >
                                                            <span>Sortie</span>
                                                            <i className="pi pi-arrow-circle-up"></i>
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <button className="w-full text-center flex items-center justify-between bg-cyan-500 p-2 rounded-2xl"
                                                            onClick={handleSortie}
                                                        >
                                                            <span>Transfert</span>
                                                            <i className="pi pi-arrow-circle-right"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>    
                                </>
                            ) : (
                                <></>
                            )}
                            {/* FAIRE UN MOUVEMENT PAR CARTON */}
                            {parCartonLot ? (
                                <>
                                    <div className="py-3 text-center">
                                        <span className="text-sm font-semibold">Mouvement par cartons-lot</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label>Choisir le lot</Label>
                                            <Select 
                                                options={optionsLot}
                                                placeholder="Choisir une option"
                                                className="dark:bg-dark-900"
                                            />
                                        </div>
                                        <div>
                                            <Label>Quantité Carton</Label>
                                            <Input type="number" id="input" value={cartonDetectedLot}
                                                onChange={(e) =>{
                                                    const value = Number(e.target.value)
                                                    if(value>=0){
                                                        setCartonDetectedLot(value)
                                                    }
                                                }} 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Quantité Pièce/Carton</Label>
                                        <Input type="number" id="input" value={stockPieceCarton2}
                                            onChange={(e) =>{
                                                const value = Number(e.target.value)
                                                if(value>=0){
                                                    setStockPieceCarton2(value)
                                                }
                                            }} 
                                        />
                                    </div>
                                </>
                            ) : (
                                <></>
                            )}
                            {/* FAIRE UN MOUVEMENT PAR PIECE VERS CARTON */}
                            {parPieceCarton ? (
                                <>
                                    <div className="py-3 text-center">
                                        <span className="text-sm font-semibold">Mouvement par pièce-carton</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label>Choisir le lot</Label>
                                            <Select 
                                                options={optionsLot}
                                                placeholder="Choisir une option"
                                                className="dark:bg-dark-900"
                                            />
                                        </div>
                                        <div>
                                            <Label>Choisir le carton</Label>
                                            <Select 
                                                options={optionsCartons}
                                                placeholder="Choisir une option"
                                                className="dark:bg-dark-900"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Quantité pièce</Label>
                                        <Input type="number" id="input" value={quantitePieceCarton}
                                            onChange={(e) =>{
                                                const value = Number(e.target.value)
                                                if(value>=0){
                                                    setQuantitePieceCarton(value)
                                                }
                                            }} 
                                        />
                                    </div>
                                </>
                            ) : (
                                <></>
                            )}
                            {/* FAIRE UN MOUVEMENT PAR CARTON SIMPLE */}
                            {parCarton ? (
                                <>
                                    <div className="py-3 text-center">
                                        <span className="text-sm font-semibold">Mouvement par cartons</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
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
                                            <Label>Quantité Pièce/Carton</Label>
                                            <Input type="number" id="input" value={stockPieceCarton3}
                                                onChange={(e) =>{
                                                    const value = Number(e.target.value)
                                                    if(value>=0){
                                                        setStockPieceCarton3(value)
                                                    }
                                                }} 
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <></>
                            )}
                            {/* FAIRE UN MOUVEMENT PAR PIECE SIMPLE */}
                            {parPiece ? (
                                <>
                                    <div className="space-y-5">
                                        <div>
                                            <div className="py-3 text-center">
                                                <span className="text-sm font-semibold">Mouvement par pièce</span>
                                            </div>
                                            <div>
                                                <Label>Quantité</Label>
                                                <Input type="number" id="input" value={newStockPiece} 
                                                    onChange={(e) =>{
                                                        const value = Number(e.target.value)
                                                        if(value>=0){
                                                            setNewStockPiece(value)
                                                        }
                                                    }} 
                                                />
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
                                                            <button className="w-full text-center flex items-center justify-between bg-green-400 p-2 rounded-2xl"
                                                                onClick={handleEntreeParPiece}
                                                            >
                                                                <span>Entrée</span>
                                                                <i className="pi pi-arrow-circle-down"></i>
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <button className="w-full text-center flex items-center justify-between bg-red-400 p-2 rounded-2xl"
                                                                onClick={handleSortieParPiece}
                                                            >
                                                                <span>Sortie</span>
                                                                <i className="pi pi-arrow-circle-up"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>  
                                    </div>
                                </>
                            ) : (
                                <></>
                            )}
                            <div>
                                <span className="text-error-600 font-medium flex items-center justify-center text-sm p-1 mt-4">
                                    {error}
                                </span>
                            </div>
                        </div>
                        {/* {selected? (
                            <>
                                <div className="text-center">
                                    {loadingValidation ? (
                                        <>
                                            <div>
                                                <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" animationDuration=".5s" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <button className="w-full text-center flex items-center justify-between bg-green-400 p-2 rounded-2xl"
                                                        onClick={handleEntree}
                                                    >
                                                        <span>Entrée</span>
                                                        <i className="pi pi-arrow-circle-down"></i>
                                                    </button>
                                                </div>
                                                <div>
                                                    <button className="w-full text-center flex items-center justify-between bg-red-400 p-2 rounded-2xl"
                                                        onClick={handleSortie}
                                                    >
                                                        <span>Sortie</span>
                                                        <i className="pi pi-arrow-circle-up"></i>
                                                    </button>
                                                </div>
                                                <div>
                                                    <button className="w-full text-center flex items-center justify-between bg-cyan-500 p-2 rounded-2xl"
                                                        onClick={handleSortie}
                                                    >
                                                        <span>Transfert</span>
                                                        <i className="pi pi-arrow-circle-right"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <></>  
                        )} */}
                    </div>
                </ComponentCard>
            </div>
            <Modal isOpen={entreeParPieceModalOpen} onClose={() => setEntreeParPieceModalOpen(false)} className="p-4 max-w-md">
                <div className="space-y-5">
                    <div className="w-full text-center">
                        <span className="p-3 rounded bg-blue-200 text-blue-500 font-medium">Entrée stock</span>
                    </div>
                    <div className="text-center">
                        <span>
                            <span className="text-sm text-gray-800 font-medium">{nomPiece} </span>
                             - 
                            <span className="font-semibold"> {nomModel}</span> | 
                            <span className="font-medium text-gray-700"> {nomService}</span>
                        </span>
                    </div>
                    <div className="ms-5 text-center">
                        <span className="text-sm text-gray-800 underline">Motif: {motif}</span>
                    </div>
                    <div className="space-y-1 ms-5">
                        <div>
                            <span>Quantité initiale : {quantitePiece ? quantitePiece : '0'}</span>
                        </div>
                        <div>
                            <span>Mouvement : <span className="text-green-600 font-bold">+{newStockPiece}</span></span>
                        </div>
                        <div>
                            <span>Stock final : {finalStockPiece}</span>
                        </div>
                    </div>
                    <div className='w-full mt-6 flex justify-center items-center'>
                        <button
                            onClick={handleValidateParPiece}
                            className='w-1/4 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                            Valider
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={sortieParPieceModalOpen} onClose={() => setSortieParPieceModalOpen(false)} className="p-4 max-w-md">
                <div className="space-y-5">
                    <div className="w-full text-center">
                        <span className="p-3 rounded bg-blue-200 text-blue-500 font-medium">Sortie stock</span>
                    </div>
                    <div className="text-center">
                        <span>
                            <span className="text-sm text-gray-800 font-medium">{nomPiece} </span>
                             - 
                            <span className="font-semibold"> {nomModel}</span> | 
                            <span className="font-medium text-gray-700"> {nomService}</span>
                        </span>
                    </div>
                    <div className="ms-5 text-center">
                        <span className="text-sm text-gray-800 underline">Motif: {motif}</span>
                    </div>
                    <div className="space-y-1 ms-5">
                        <div>
                            <span>Quantité initiale : {quantitePiece ? quantitePiece : '0'}</span>
                        </div>
                        <div>
                            <span>Mouvement : <span className="text-red-600 font-bold">-{newStockPiece}</span></span>
                        </div>
                        <div>
                            <span>Stock final : {finalStockPiece}</span>
                        </div>
                    </div>
                    <div className='w-full mt-6 flex justify-center items-center'>
                        <button
                            onClick={handleValidateParPiece}
                            className='w-1/4 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                            Valider
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}