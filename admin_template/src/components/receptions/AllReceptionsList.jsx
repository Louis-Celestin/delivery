import {useState, useEffect} from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";

import { ListIcon, CableDataIcon, PhoneSetting, BaseLinePhoneIcon } from "../../icons";
import 'primeicons/primeicons.css';

import ComponentCard from "../common/ComponentCard"
import { ProductDeliveries } from "../../backend/livraisons/productDeliveries"
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../ui/table";

export default function AllReceptionsList({ filterType }) {

    const productDeliveries = new ProductDeliveries();
    const [deliveryForms, setDeliveryForms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR'); // or use any locale you want
      };

    useEffect( ()=>{
        const fetchDeliveryForms = async () =>{
            setLoading(true);
            try{
                let response = await productDeliveries.getAllLivraisons();
                console.log(response)
                setDeliveryForms(response)

            } catch(error){
                console.log('Error fetching data ',error)
            } finally{
                setLoading(false);
            }
        }; fetchDeliveryForms();
    },[])

    const filteredForms = filterType
        ? deliveryForms.filter(form => form.type_livraison_id === filterType)
        : deliveryForms;

    const totalPages = Math.ceil(filteredForms.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredForms.slice(startIndex, endIndex);

    


    return(
        <>  
            {loading ? (<><span>Loading...</span></>) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <Table>
                            {/* Table Header */}
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Formulaire
                                </TableCell>
                                <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Nbre produit
                                </TableCell>
                                <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Date d'émission
                                </TableCell>
                                <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Date de cloture
                                </TableCell>
                                <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Statut
                                </TableCell>
                                <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Actions
                                </TableCell>
                            </TableRow>
                            </TableHeader>
                            {/* Table Body */}
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {currentItems.map((item, index) => {
                                    let title = '';
                                    if (item.type_livraison_id === 1) {
                                        title = 'Livraison TPE GIM';
                                    } else if (item.type_livraison_id === 2) {
                                        title = 'Livraison TPE REPARE'; // fallback or other types
                                    } else if (item.type_livraison_id === 3) {
                                        title = 'Livraison TPE MAJ GIM'; // fallback or other types
                                    } else if (item.type_livraison_id === 4) {
                                        title = 'Livraison TPE MOBILE'; // fallback or other types
                                    } else if (item.type_livraison_id === 5) {
                                        title = 'Livraison CHARGEUR'; // fallback or other types
                                    }
                                    let formDate = formatDate(item.date_livraison);
                                    let statut = item.statut_livraison;
                                    let statutClass = ''
                                    if (statut == 'en_cours'){
                                        statut = 'en cours';
                                        statutClass = 'text-xs border rounded-xl p-0.5 bg-orange-300'
                                    } else if (statut == 'livre'){
                                        statut = 'Livré';
                                        statutClass = 'text-xs border rounded-xl p-0.5 px-1 bg-green-300'
                                    }

                                    return (
                                            <TableRow key={index}>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <span className="flex flex-col">
                                                    <Link key={item.id_livraison}
                                                        to={`/formulaire-recu/${item.id_livraison}`} >
                                                            <span className="font-bold">{title}</span>
                                                    </Link>
                                                    <span className="text-xs font-extralight">#{item.id_livraison}</span>
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {item.qte_totale_livraison}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {formDate}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <span className={statutClass}>{statut}</span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <span className="flex items-center">
                                                    <Link key={item.id_livraison} to={`/formulaire/${item.id_livraison}`}>
                                                        <button className="mx-1">
                                                            <i className="pi pi-eye"></i>
                                                        </button>
                                                    </Link>
                                                    <button className="mx-1">
                                                        <i className="pi pi-print"></i>
                                                    </button>
                                                </span>
                                            </TableCell>
                                            </TableRow>
                                        )
                                    }
                                )}
                            </TableBody>
                        </Table>
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-2 my-4">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                                    >
                                    Précédent
                                </button>

                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPage(index + 1)}
                                        className={`px-3 py-1 rounded ${
                                        currentPage === index + 1
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100'
                                        }`}
                                        >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                                    >
                                    Suivant
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}