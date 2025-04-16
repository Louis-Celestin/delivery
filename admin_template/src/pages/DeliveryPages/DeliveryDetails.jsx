import { useState, useEffect} from 'react';
import { useParams } from 'react-router';

import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../../components/ui/table"
  


import { ProductDeliveries } from '../../backend/livraisons/productDeliveries';



export default function DeliveryDetail() {
    
    const productDeliveries = new ProductDeliveries()
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [deliveryDetails, setDeliveryDetails] = useState('')
    const [typeLivraison, setTypeLivraison] = useState('')
    const [dateLivraison, setDateLivraison] = useState('')

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR'); // or use any locale you want
      };


    useEffect( ()=>{
        if(id){
            const fetchDeliveryDetails = async () =>{
                try{
                    setLoading(true);
                    let data;
                    data = await productDeliveries.getOneLivraison(id);
                    console.log(data)
                    setDeliveryDetails({
                        ...data,
                        produitsLivre: JSON.parse(data.produitsLivre)
                      });
                      if(data.type_livraison_id == 2){
                        setTypeLivraison("TPE GIM")
                      } else if(data.type_livraison_id == 4){
                        setTypeLivraison("CHARGEUR")
                      }
                      setDateLivraison(formatDate(data.date_livraison))
                } catch(error){
                    console.log("Error fetchind data ", error)
                } finally{
                    setLoading(false)
                }
            };
            fetchDeliveryDetails();
        }
    },[id]);

    return (
        <>
            <PageBreadcrumb pageTitle={`Livraison | ${typeLivraison}`}/>
            <div>
                <div className='my-6'>
                    <span>{`Livraison du ${dateLivraison}`}</span>
                </div>
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
                            </TableRow>
                        </TableHeader>
                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {deliveryDetails.produitsLivre?.map((item, index) => (
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
                                {item.mobile_money.includes("OM") ?
                                    ( <i className="pi pi-check" style={{ color: 'green' }}></i> ) : ""}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                {item.mobile_money.includes("MTN") ?
                                    ( <i className="pi pi-check" style={{ color: 'green' }}></i> ) : ""}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                {item.mobile_money.includes("MOOV") ?
                                    ( <i className="pi pi-check" style={{ color: 'green' }}></i> ) : ""}
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>

                        </Table>
                    </div>
                </div>
            </div>
        </>
    )
}