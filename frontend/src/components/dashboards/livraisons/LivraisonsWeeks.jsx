import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


export default function LivraisonsWeeks() {
    return (
        <>
            <div>
                <div>
                    <div>
                        <div className="w-1/7 text-center font-semibold text-xs bg-green-400 text-white">
                            Cumul hebdomadaire
                        </div>
                        <div className="border text-theme-xs">
                            {/* <Table>
                                <TableHeader className="text-start">
                                    <TableRow className="border-b">
                                        <TableCell isHeader className="text-start border">

                                        </TableCell>
                                        <TableCell isHeader className="text-start border">
                                            Livraison TPE GIM
                                        </TableCell>
                                        <TableCell isHeader className="text-start border">
                                            Livraison TPE MAJ GIM
                                        </TableCell>
                                        <TableCell isHeader className="text-start border">
                                            Livraison TPE MOBILE
                                        </TableCell>
                                        <TableCell isHeader className="text-start border">
                                            Livraison TPE ECOBANK
                                        </TableCell>
                                        <TableCell isHeader className="text-start border">
                                            Livraison TPE REPARE
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className="bg-gray-300">
                                        <TableCell className="border">
                                            <Table>
                                                <TableHeader className="bg-amber-200">
                                                    <TableRow>
                                                        <TableCell is header>
                                                            Semaine
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell className="flex items-center justify-between">
                                                            <span>
                                                                Semaine 23
                                                            </span>
                                                            <span className="text-xs border rounded-full flex items-center justify-center">
                                                                <i className="pi pi-plus"></i>
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableCell>
                                        <TableCell className="border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableCell is header>
                                                            Total
                                                        </TableCell>
                                                        <TableCell is header>
                                                            Nbre
                                                        </TableCell>
                                                        <TableCell is header>
                                                            Retour
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>
                                                            0
                                                        </TableCell>
                                                        <TableCell>
                                                            0
                                                        </TableCell>
                                                        <TableCell>
                                                            0
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableCell>
                                        <TableCell className="border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableCell is header>
                                                            Total
                                                        </TableCell>
                                                        <TableCell is header>
                                                            Nbre
                                                        </TableCell>
                                                        <TableCell is header>
                                                            Retour
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>
                                                            0
                                                        </TableCell>
                                                        <TableCell>
                                                            0
                                                        </TableCell>
                                                        <TableCell>
                                                            0
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableCell>
                                        <TableCell className="border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableCell is header>
                                                            Total
                                                        </TableCell>
                                                        <TableCell is header>
                                                            Nbre
                                                        </TableCell>
                                                        <TableCell is header>
                                                            Retour
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>
                                                            0
                                                        </TableCell>
                                                        <TableCell>
                                                            0
                                                        </TableCell>
                                                        <TableCell>
                                                            0
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableCell>
                                        <TableCell className="border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableCell is header>
                                                            Total
                                                        </TableCell>
                                                        <TableCell is header>
                                                            Nbre
                                                        </TableCell>
                                                        <TableCell is header>
                                                            Retour
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>
                                                            0
                                                        </TableCell>
                                                        <TableCell>
                                                            0
                                                        </TableCell>
                                                        <TableCell>
                                                            0
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableCell>
                                        <TableCell className="border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableCell is header>
                                                            Total
                                                        </TableCell>
                                                        <TableCell is header>
                                                            Nbre
                                                        </TableCell>
                                                        <TableCell is header>
                                                            Retour
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>
                                                            0
                                                        </TableCell>
                                                        <TableCell>
                                                            0
                                                        </TableCell>
                                                        <TableCell>
                                                            0
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table> */}
                            <div>
                                <div className="grid grid-cols-7 mb-3">
                                    {/* HEADERS */}
                                    <div>
                                    </div>
                                    <div>
                                        <span>TPE GIM</span>
                                    </div>
                                    <div>
                                        <span>TPE MAJ GIM</span>
                                    </div>
                                    <div>
                                        <span>TPE MOBILE</span>
                                    </div>
                                    <div>
                                        <span>TPE ECOBANK</span>
                                    </div>
                                    <div>
                                        <span>TPE REPARE</span>
                                    </div>
                                    <div>
                                        <span>CHARGEUR</span>
                                    </div>
                                </div>
                                {/* ROW 0 */}
                                <div className="grid grid-cols-7 mb-2">
                                    <div>
                                        <span>Semaines</span>
                                    </div>
                                    <div className="grid grid-cols-3">
                                        <div>
                                            <span>Total</span>
                                        </div>
                                        <div>
                                            <span>Nbre</span>
                                        </div>
                                        <div>
                                            <span>Retour</span>
                                        </div>
                                    </div>
                                     <div className="grid grid-cols-3">
                                        <div>
                                            <span>Total</span>
                                        </div>
                                        <div>
                                            <span>Nbre</span>
                                        </div>
                                        <div>
                                            <span>Retour</span>
                                        </div>
                                    </div>
                                     <div className="grid grid-cols-3">
                                        <div>
                                            <span>Total</span>
                                        </div>
                                        <div>
                                            <span>Nbre</span>
                                        </div>
                                        <div>
                                            <span>Retour</span>
                                        </div>
                                    </div>
                                     <div className="grid grid-cols-3">
                                        <div>
                                            <span>Total</span>
                                        </div>
                                        <div>
                                            <span>Nbre</span>
                                        </div>
                                        <div>
                                            <span>Retour</span>
                                        </div>
                                    </div>
                                     <div className="grid grid-cols-3">
                                        <div>
                                            <span>Total</span>
                                        </div>
                                        <div>
                                            <span>Nbre</span>
                                        </div>
                                        <div>
                                            <span>Retour</span>
                                        </div>
                                    </div>
                                     <div className="grid grid-cols-3">
                                        <div>
                                            <span>Total</span>
                                        </div>
                                        <div>
                                            <span>Nbre</span>
                                        </div>
                                        <div>
                                            <span>Retour</span>
                                        </div>
                                    </div>
                                </div>
                                {/* ROWS */}
                                <div className="border">
                                    <div className="grid grid-cols-7 mb-3">
                                        <div className="flex justify-between">
                                            <span>Semaines 23</span>
                                            <span><i className="pi pi-plus"></i></span>
                                        </div>
                                        <div className="grid grid-cols-3">
                                            <div>
                                                <span>0</span>
                                            </div>
                                            <div>
                                                <span>0</span>
                                            </div>
                                            <div>
                                                <span>0</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3">
                                            <div>
                                                <span>0</span>
                                            </div>
                                            <div>
                                                <span>0</span>
                                            </div>
                                            <div>
                                                <span>0</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3">
                                            <div>
                                                <span>0</span>
                                            </div>
                                            <div>
                                                <span>0</span>
                                            </div>
                                            <div>
                                                <span>0</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3">
                                            <div>
                                                <span>0</span>
                                            </div>
                                            <div>
                                                <span>0</span>
                                            </div>
                                            <div>
                                                <span>0</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3">
                                            <div>
                                                <span>0</span>
                                            </div>
                                            <div>
                                                <span>0</span>
                                            </div>
                                            <div>
                                                <span>0</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3">
                                            <div>
                                                <span>0</span>
                                            </div>
                                            <div>
                                                <span>0</span>
                                            </div>
                                            <div>
                                                <span>0</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 bg-blue-300">
                                        <div className="grid grid-cols-7">
                                            {/* HEADERS */}
                                            <div>
                                            </div>
                                            <div>
                                                <span>TPE GIM</span>
                                            </div>
                                            <div>
                                                <span>TPE MAJ GIM</span>
                                            </div>
                                            <div>
                                                <span>TPE MOBILE</span>
                                            </div>
                                            <div>
                                                <span>TPE ECOBANK</span>
                                            </div>
                                            <div>
                                                <span>TPE REPARE</span>
                                            </div>
                                            <div>
                                                <span>CHARGEUR</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-7">
                                            <div>
                                                <span>Dates</span>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>Total</span>
                                                </div>
                                                <div>
                                                    <span>Nbre</span>
                                                </div>
                                                <div>
                                                    <span>Retour</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>Total</span>
                                                </div>
                                                <div>
                                                    <span>Nbre</span>
                                                </div>
                                                <div>
                                                    <span>Retour</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>Total</span>
                                                </div>
                                                <div>
                                                    <span>Nbre</span>
                                                </div>
                                                <div>
                                                    <span>Retour</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>Total</span>
                                                </div>
                                                <div>
                                                    <span>Nbre</span>
                                                </div>
                                                <div>
                                                    <span>Retour</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>Total</span>
                                                </div>
                                                <div>
                                                    <span>Nbre</span>
                                                </div>
                                                <div>
                                                    <span>Retour</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>Total</span>
                                                </div>
                                                <div>
                                                    <span>Nbre</span>
                                                </div>
                                                <div>
                                                    <span>Retour</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-7">
                                            <div className="flex justify-between">
                                                <span>09/06/2025</span>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-7">
                                            <div className="flex justify-between">
                                                <span>09/06/2025</span>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-7">
                                            <div className="flex justify-between">
                                                <span>09/06/2025</span>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-7">
                                            <div className="flex justify-between">
                                                <span>09/06/2025</span>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-7">
                                            <div className="flex justify-between">
                                                <span>09/06/2025</span>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                                <div>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}