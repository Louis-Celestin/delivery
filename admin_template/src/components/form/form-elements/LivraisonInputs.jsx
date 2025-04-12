import { useEffect, useState, CSSProperties } from "react";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import Input from "../input/InputField.tsx";
import Checkbox from "../input/Checkbox";
import Select from "../Select.tsx";
import TextArea from "../input/TextArea";

import { EyeCloseIcon, EyeIcon, TimeIcon } from "../../../icons/index.ts";
import DatePicker from "../date-picker.tsx";

import { PlusIcon } from "../../../icons/index.ts";


import { ProgressSpinner } from 'primereact/progressspinner';
        


import { Merchants } from "../../../backend/livraisons/Merchants.js";


export default function LivraisonInputs() {

  

  const [showPassword, setShowPassword] = useState(false);
  const [isOrangeChecked, setOrangeChecked] = useState(false);
  const [isMTNChecked, setMTNChecked] = useState(false);
  const [isMOOVChecked, setMOOVChecked] = useState(false);
  const merchants = new Merchants();
  const [terminals, setTerminals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingMerchant, setLoadingMerchant] = useState(false);
  const [typeLivraison, setTypeLivraison] = useState('');
  const [message, setMessage] = useState("");

  
  const ChangeTypeLivraison = (value) => {
    console.log("Selected value:", value);
    setTypeLivraison(value);
  };
  
  // const override: CSSProperties = {
  //   display: "block",
  //   margin: "0 auto",
  //   borderColor: "red",
  // };


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

  const filteredPointMarchand = searchQuery ? 
  terminals.filter((terminal) => 
        terminal.SERIAL_NUMBER.includes(searchQuery)) : [];

  const options_livraison = [
    { value: "TPE GIM", label: "TPE GIM" },
    { value: "TPE MOBILE", label: "TPE MOBILE" },
    { value: "MISE A JOUR", label: "MISE A JOUR" },
    { value: "TPE REPARE", label: "TPE REPARE" },
    { value: "CHARGEUR", label: "CHARGEUR" },
  ];

  
  return (
    <>
       {loadingMerchant ? (<>Loading...</>) :
                (
    <ComponentCard title={`Livraison ${typeLivraison}`}>
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
          <Input type="text" id="input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
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
          <button type="submit" className="w-full bg-green-400 rounded-2xl h-10 flex items-center justify-center">
            <span>Ajouter</span>
            <span className="text-2xl"><PlusIcon /></span>
          </button>
        </div>
      </div>
    </ComponentCard>
      )
    }
    </>
  );
}
