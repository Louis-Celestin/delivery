import { useEffect, useState, useRef } from "react";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import Input from "../input/InputField.tsx";
import Checkbox from "../input/Checkbox";
import Select from "../Select.tsx";
import TextArea from "../input/TextArea";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { PlusIcon } from "../../../icons/index.ts";
import { ListIcon } from "../../../icons/index.ts";
import 'primeicons/primeicons.css'; 
import { ProgressSpinner } from 'primereact/progressspinner';
import { useNavigate } from "react-router";
import { Merchants } from "../../../backend/livraisons/Merchants.js";
import { ProductDeliveries } from "../../../backend/livraisons/productDeliveries.js";
import Swal from 'sweetalert2'


export default function LivraisonInputs() {

  const merchants = new Merchants();
  const productDeliveries = new ProductDeliveries();
  const userId = window.sessionStorage.getItem('id');
  const navigate = useNavigate();
  const [isOrangeChecked, setOrangeChecked] = useState(false);
  const [isMTNChecked, setMTNChecked] = useState(false);
  const [isMOOVChecked, setMOOVChecked] = useState(false);
  const [terminals, setTerminals] = useState([]);
  const [terminalSN, setTerminalSN] = useState('');
  const [loadingMerchant, setLoadingMerchant] = useState(false);
  const [loadingDelivery, setLoadingDelivery] = useState(false);
  const [typeLivraison, setTypeLivraison] = useState('');
  const [livraisonID, setLivraisonID] = useState(null);
  const [message, setMessage] = useState("");
  const [mobileMoney, setMobileMoney] = useState([]);
  const [produitsLivreTable, setProduitsLivresTable] = useState([]);
  const [produitsLivre, setProduitsLivres] = useState([]);
  const [error, setError] = useState(null);
  const [errorFrom, setErrorForm] = useState(null);
  const [errorAjout, setErrorAjout] = useState(null);
  const [errorDeliver, setErrorDeliver] = useState(null);


  const ChangeTypeLivraison = (value) => {
    console.log("Selected value:", value);
    setTypeLivraison(value);
    if(value == 'TPE GIM'){
      setLivraisonID(1);
    }else if(value == 'TPE REPARE'){
      setLivraisonID(2);
    }else if(value == 'TPE MAJ'){
      setLivraisonID(3)
    }else if(value == 'TPE MOBILE'){
      setLivraisonID(4)
    }else if(value == 'CHARGEUR'){
      setLivraisonID(5)
    }
  };
  

  useEffect( ()=>{
    const fetchTerminalInfos = async () => {
      setLoadingMerchant(true)
      try{
        let data;
        data = await merchants.findMerchant();
        console.log(data)
        setTerminals(data)
      }catch(error){
        console.log('Error fetching data ',error)
        setErrorForm('Erreur lors de la génération du formulaire')

      }finally{
        setLoadingMerchant(false)
      }
    };fetchTerminalInfos();
  },[])

  const handleAjout = (e) => {
    e.preventDefault(); // prevent page reload

    console.log('Trying to ADD.....')
    const localMobileMoney = [];
    if (isOrangeChecked) localMobileMoney.push("OM");
    if (isMTNChecked) localMobileMoney.push("MTN");
    if (isMOOVChecked) localMobileMoney.push("MOOV");
    if (!filteredPointMarchand.map((terminal) => terminal.POINT_MARCHAND).join(", ")){
      setErrorAjout("S/N invalide")
    }else{
        const newProduitLivreTable = {
          pointMarchand: filteredPointMarchand.map((terminal) => terminal.POINT_MARCHAND).join(", "),
          caisse: filteredPointMarchand.map((terminal) => terminal.TPE).join(","),
          serialNumber: terminalSN,
          banque: filteredPointMarchand.map((terminal) => terminal.BANQUE).join(", "),
          isOrangeChecked,
          isMTNChecked,
          isMOOVChecked,
        };

        const newProduitLivre = {
          pointMarchand: filteredPointMarchand.map((terminal) => terminal.POINT_MARCHAND).join(","),
          caisse: filteredPointMarchand.map((terminal) => terminal.TPE).join(","),
          serialNumber: terminalSN,
          banque: filteredPointMarchand.map((terminal) => terminal.BANQUE).join(","),
          mobile_money: localMobileMoney,
        };
      
        setProduitsLivresTable((prev) => [...prev, newProduitLivreTable]);
        setProduitsLivres((prev) => [...prev, newProduitLivre]);
      
        // Optional: Reset form fields
        setTerminalSN('');
        setOrangeChecked(false);
        setMTNChecked(false);
        setMOOVChecked(false);
        setMobileMoney([]);
      };
    }
    

  const handleDeliver = async (e) => {
    e.preventDefault();
    if(produitsLivre.length == 0){
      setErrorDeliver("Veuillez ajouter des produits")
    }else{
      setLoadingDelivery(true);
      const commentaire = message;
      const type_livraison_id = livraisonID
      const user_id = userId;
      const isAncienne = false;
  
      console.log('Trying to create form...')
      console.log('Commentaire : ',commentaire)
      console.log('ID Livraison : ',type_livraison_id)
      console.log('ID User', user_id)
      console.log('Ancienne ? ', isAncienne)
      console.log('Produits livrés : ',produitsLivre)
  
      try{
      const response = await productDeliveries.deliver(commentaire, type_livraison_id, user_id, isAncienne, produitsLivre)
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
   
  }
  

  const filteredPointMarchand = terminalSN ? 
  terminals.filter((terminal) => 
        terminal.SERIAL_NUMBER.includes(terminalSN)) : [];

  const options_livraison = [
    { value: "TPE GIM", label: "TPE GIM" },
    { value: "TPE MOBILE", label: "TPE MOBILE" },
    { value: "TPE MAJ", label: "MISE A JOUR" },
    { value: "TPE REPARE", label: "TPE REPARE" },
    { value: "CHARGEUR", label: "CHARGEUR" },
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
                    <ComponentCard className="w-1/2" title={`Livraison ${typeLivraison}`}>
                      <div className="space-y-6">
                        <div>
                          <Label>Type de Livraison</Label>
                          <Select
                            options={options_livraison}
                            placeholder="Select an option"
                            onChange={ChangeTypeLivraison}
                            className="dark:bg-dark-900"
                          />
                        </div>

                        <div>
                          <Label htmlFor="input">Numéro de série</Label>
                          <Input type="text" id="input" value={terminalSN} onChange={(e) => setTerminalSN(e.target.value)}
                          error={errorAjout}/>
                        </div>
                        <div>
                          <Label>Point Marchand</Label>
                          <Input type="text" id="input"
                                  className="cursor-default"
                                  value={filteredPointMarchand.map((terminal) => terminal.POINT_MARCHAND).join(",")}
                                  readOnly
                                  />
                        </div>
                        <div>
                          <Label>Banque</Label>
                          <Input type="text" id="input" 
                                  className="cursor-default"
                                  value={filteredPointMarchand.map((terminal) => terminal.BANQUE).join(",")}
                                  readOnly
                                  />
                        </div>
                        <div>
                          <Input type="text" id="input" 
                                  value={filteredPointMarchand.map((terminal) => terminal.TPE).join(",")}
                                  className="hidden"/>
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
                          <Label>Description</Label>
                          <TextArea
                            value={message}
                            onChange={(value) => setMessage(value)}
                            rows={4}
                            placeholder="Ajoutez un commentaire"
                          />
                        </div>
                        <div>
                          <button onClick={handleAjout} className="w-full bg-green-400 rounded-2xl h-10 flex items-center justify-center">
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
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {item.serialNumber}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {item.banque}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {item.isOrangeChecked ? <i className="pi pi-check" style={{ color: 'green' }}></i> : ""}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {item.isMTNChecked ? <i className="pi pi-check" style={{ color: 'green' }}></i> : ""}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {item.isMOOVChecked ? <i className="pi pi-check" style={{ color: 'green' }}></i> : ""}
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
    </>
  );
}
