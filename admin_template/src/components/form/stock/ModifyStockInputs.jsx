import { useState, useEffect } from "react"
import { Stock } from "../../../backend/stock/Stock"
import ComponentCard from "../../common/ComponentCard";
import Input from "../input/InputField";
import Label from "../Label";
import Select from "../Select";
import { Modal } from "../../ui/modal";
import { useNavigate } from "react-router";

export default function ModifyStockInputs() {

    const stock = new Stock();
    const userId = localStorage.getItem('id');
    const role = localStorage.getItem("role_id")
    const navigate = useNavigate();

    const [stockDT, setStockDT] = useState([])
    const [loadingStock, setLoadingStock] = useState(false)
    const [optionsPieces, setOptionsPieces] = useState([])
    const [nomPiece, setNomPiece] = useState('')
    const [stockInitial, setStockInitial] = useState('')
    const [nouveauStock, setNouveauStock] = useState('')
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [errorAjout, setErrorAjout] = useState('')

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
        }
    };

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
                    <button
                        onClick={handleConfirm}
                        className='w-1/4 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                        Valider
                    </button>
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