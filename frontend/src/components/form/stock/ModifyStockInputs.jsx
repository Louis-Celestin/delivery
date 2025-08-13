import { useState, useEffect } from "react"
import { Stock } from "../../../backend/stock/Stock"
import ComponentCard from "../../common/ComponentCard";
import Input from "../input/InputField";
import Label from "../Label";
import Select from "../Select";
import { Modal } from "../../ui/modal";
import { useNavigate } from "react-router";
import Swal from 'sweetalert2'
import { ProgressSpinner } from 'primereact/progressspinner';

export default function ModifyStockInputs() {

    const stock = new Stock();
    const userId = localStorage.getItem('id');
    const navigate = useNavigate();

    const [stockDT, setStockDT] = useState([])
    const [loadingStock, setLoadingStock] = useState(false)
    const [optionsPieces, setOptionsPieces] = useState([])
    const [nomPiece, setNomPiece] = useState('')
    const [stockInitial, setStockInitial] = useState('')
    const [nouveauStock, setNouveauStock] = useState('')
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [errorAjout, setErrorAjout] = useState('')
    const [loadingModif, setLoadingModif] = useState(false);
    const [pieceId, setPieceId] = useState(null)
    
    useEffect( ()=>{
        const fetchStock = async () => {
            setLoadingStock(true)
            try{
                let data;
                data = await stock.getAllStock()
                const piecesA920 = data.filter(item =>{
                    return item.model_id == 1;
                });
                const options = piecesA920.map((item) => ({
                    value: item.id_piece,
                    label: item.nom_piece.toUpperCase(),
                }));
                setStockDT(piecesA920)
                setOptionsPieces(options);
            }catch (error){
                console.log('Error fetching data ',error)
            }finally{
                setLoadingStock(false)
            }
        };
        fetchStock();
    },[])

    const ChangePieceType = (value) => {
        console.log("Selected value:", value);
        const selectedStockItem = stockDT.find(
        (item) => {
            return item.id_piece == parseInt(value)
        } 
        );
        if (selectedStockItem) {
            const nomPiece = selectedStockItem.nom_piece
            const stockPiece = selectedStockItem.quantite
            setNomPiece(nomPiece);
            setStockInitial(stockPiece)
            setNouveauStock(stockPiece)
            setPieceId(selectedStockItem.id_piece)
        }
    };


    const handleConfirm = () => {
    
        console.log("Nouveau Stock ", nomPiece, " : ", nouveauStock)
        
        console.log("Stock initial :", stockInitial)
    
        if(!nomPiece){
            setErrorAjout("Vous devez sélectionner une pièce !")
        }
        if(stockInitial == nouveauStock){
          setErrorAjout("Stock identique !");
          return;
        }
    
        setErrorAjout('')
        setIsConfirmModalOpen(true)
    }

    const handleNouveauStock = async (e) => {
        e.preventDefault();
        setIsConfirmModalOpen(false)

        const payload = {
            piece_id: pieceId,
            stock_initial: stockInitial,
            nouveau_stock: nouveauStock,
            utilisateur_id: userId,
        }

        try{
            setLoadingModif(true)
            console.log("Sending payload : ",payload)
            const response = await stock.setStock(payload)
            console.log(response)
            console.log('Stock modifié')

            Swal.fire({
                title: "Succès",
                text: "Stock modifié avec succès",
                icon: "success"
            });
            navigate('/gestion-stock')
        }catch(error){
            console.log('error : ',error)
            Swal.fire({
                title: "Attention",
                text: "Une erreur est survenue lors de la modification du stock",
                icon: "success"
            });
            navigate('/gestion-stock')
        }finally{
            setLoadingModif(false)
        }

    }
    return(
        <>
            <div className="flex-col justify-center items-center">
                <div className="w-11/12">
                    <ComponentCard title="Modifier stock DT">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label>Pièce <span className="text-red-700">*</span></Label>
                                <Select
                                    options={optionsPieces}
                                    placeholder="Choisir une option"
                                    onChange={ChangePieceType}
                                    className="dark:bg-dark-900"                          
                                />
                            </div>
                            <div className="me-1">
                                <Label htmlFor="input">Stock {nomPiece}</Label>
                                <Input type="number" id="input" value={nouveauStock} onChange={(e) =>{
                                const value = e.target.value
                                if(value>=0){
                                  setNouveauStock(value)
                                }
                                }} />
                            </div>                       
                        </div>
                        <div>
                            <span className="text-error-600 font-medium flex items-center justify-center text-sm p-1 mt-4">
                                {errorAjout}
                            </span>
                        </div>
                    </ComponentCard>
                </div>
                <div className='w-full mt-6 flex justify-center items-center'>
                {loadingModif ? 
                (
                    <span className="">
                        <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" animationDuration=".5s" />
                    </span>
                ) : (
                    <>
                        <button
                            onClick={handleConfirm}
                            className='w-1/4 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                            Valider
                        </button>
                    </>
                )}
                </div>               
            </div>
            <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} className="p-4 max-w-xl">
                <div className="p-6 mt-5">
                <div>
                    <span>Vous allez effectuer un changement de stock de :  <span className="font-bold text-red-700">{nomPiece.toUpperCase()}</span></span>
                </div>
                <div>
                    <div>
                        <span>Stock initial : <span className="font-bold text-red-700">{stockInitial}</span></span>
                    </div>
                    <div>
                        <span>Nouveau stock : <span className="font-bold text-red-700">{nouveauStock}</span></span>
                    </div>
                </div>
                </div>
                <div className='w-full mt-6 flex justify-center items-center'>
                <button
                    onClick={handleNouveauStock}
                    className='w-1/4 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                    Valider
                </button>
                </div>
            </Modal>
        </>
    )
}