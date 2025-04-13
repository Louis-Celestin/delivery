import { useEffect, useState, CSSProperties } from "react";
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

import { EyeCloseIcon, EyeIcon, TimeIcon } from "../../../icons/index.ts";
import DatePicker from "../date-picker.tsx";

import { PlusIcon } from "../../../icons/index.ts";
import { ListIcon } from "../../../icons/index.ts";


import { ProgressSpinner } from 'primereact/progressspinner';
        


import { Merchants } from "../../../backend/livraisons/Merchants.js";
import { Deliver } from "../../../backend/livraisons/livraisonterminals.js";


export default function LivraisonInputs() {

  const [isOrangeChecked, setOrangeChecked] = useState(false);
  const [isMTNChecked, setMTNChecked] = useState(false);
  const [isMOOVChecked, setMOOVChecked] = useState(false);
  const merchants = new Merchants();
  const [terminals, setTerminals] = useState([]);
  const [terminalSN, setTerminalSN] = useState('');
  const [loadingMerchant, setLoadingMerchant] = useState(false);
  const [typeLivraison, setTypeLivraison] = useState('');
  const [livraisonID, setLivraisonID] = useState(null);
  const [message, setMessage] = useState("");
  const [mobileMoney, setMobileMoney] = useState([]);
  const [produitLivresTable, setProduitsLivresTable] = useState([]);
  const [produitLivres, setProduitsLivres] = useState([]);
  const userId = window.sessionStorage.getItem('user_id');


  
  const ChangeTypeLivraison = (value) => {
    console.log("Selected value:", value);
    setTypeLivraison(value);
    if(value == 'TPE GIM'){
      setLivraisonID(2);
    }else if(value == 'CHARGEUR'){
      setLivraisonID(4);
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

      }finally{
        setLoadingMerchant(false)
      }
    };fetchTerminalInfos();
  },[])

  const handleAjout = (e) => {
    e.preventDefault(); // prevent page reload
    
    const newProduitLivreTable = {
      pointMarchand: filteredPointMarchand.map((terminal) => terminal.POINT_MARCHAND).join(", "),
      caisse: filteredPointMarchand.map((terminal) => terminal.TPE).join(","),
      serialNumber: terminalSN,
      banque: filteredPointMarchand.map((terminal) => terminal.BANQUE).join(", "),
      isOrangeChecked,
      isMTNChecked,
      isMOOVChecked,
    };

    if(isOrangeChecked){
      setMobileMoney((prev) => [...prev, "OM"])
    }
    if(isMTNChecked){
      setMobileMoney((prev) => [...prev, "MTN"])
    }
    if(isMOOVChecked){
      setMobileMoney((prev) => [...prev, "MOOV"])
    }

    const newProduitLivre = {
      pointMarchand: filteredPointMarchand.map((terminal) => terminal.POINT_MARCHAND).join(", "),
      caisse: filteredPointMarchand.map((terminal) => terminal.TPE).join(","),
      serialNumber: terminalSN,
      banque: filteredPointMarchand.map((terminal) => terminal.BANQUE).join(", "),
      mobile_money: mobileMoney,
    };
  
    setProduitsLivresTable((prev) => [...prev, newProduitLivreTable]);
    setProduitsLivres((prev) => [...prev, newProduitLivre]);
  
    // Optional: Reset form fields
    setTerminalSN('');
    setOrangeChecked(false);
    setMTNChecked(false);
    setMOOVChecked(false);
    setMessage('');
  };

  const handleDeliver = async (e) => {
    e.preventDefault();
    const commentaire = message;
    const type_livraison_id = livraisonID
    const user_id = userId;
    const isAncienne = false;

    try{
    const response = await Deliver(commentaire, type_livraison_id, user_id, isAncienne, produitLivres)
    console.log(response);

    }catch (error) {
      console.log('error')
      setError('Une erreur lors de la génération du formulaire');

    }finally{

    }

   
  }
  

  const filteredPointMarchand = terminalSN ? 
  terminals.filter((terminal) => 
        terminal.SERIAL_NUMBER.includes(terminalSN)) : [];

  const options_livraison = [
    { value: "TPE GIM", label: "TPE GIM" },
    { value: "TPE MOBILE", label: "TPE MOBILE" },
    { value: "MISE A JOUR", label: "MISE A JOUR" },
    { value: "TPE REPARE", label: "TPE REPARE" },
    { value: "CHARGEUR", label: "CHARGEUR" },
  ];

  
  return (
    <>
      <div className="flex justify-center mb-6">
        {loadingMerchant ? (<>Loading...</>) :
          (
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
                  <Input type="text" id="input" value={terminalSN} onChange={(e) => setTerminalSN(e.target.value)}/>
                </div>
                <div>
                  <Label>Point Marchand</Label>
                  <Input type="text" id="input" 
                          className="cursor-default"
                          value={filteredPointMarchand.map((terminal) => terminal.POINT_MARCHAND).join(", ")}
                          readOnly
                          />
                </div>
                <div>
                  <Label>Banque</Label>
                  <Input type="text" id="input" 
                          className="cursor-default"
                          value={filteredPointMarchand.map((terminal) => terminal.BANQUE).join(", ")}
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
                  <button onChange="handleAjout" className="w-full bg-green-400 rounded-2xl h-10 flex items-center justify-center">
                    <span>Ajouter</span>
                    <span className="text-2xl"><PlusIcon /></span>
                  </button>
                </div>
              </div>
            </ComponentCard>
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
                    MOOV
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    MTN
                  </TableCell>
                </TableRow>
              </TableHeader>
              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {produitLivresTable.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {item.pointMarchand}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {item.serialNumber}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {item.banque}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {item.isOrangeChecked ? "Oui" : "Non"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {item.isMOOVChecked ? "Oui" : "Non"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {item.isMTNChecked ? "Oui" : "Non"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <button onChange="handleAjout" className="w-1/4 mt-6 bg-green-400 rounded-2xl h-10 flex justify-center items-center">
            <span>Créer formulaire</span>
            <span className="text-2xl"><ListIcon /></span>
          </button>
        </div>
      </div>
    </>
  );
}
