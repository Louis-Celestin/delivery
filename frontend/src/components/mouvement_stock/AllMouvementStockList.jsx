import { useEffect, useState } from "react"
import { Stock } from "../../backend/stock/Stock"

import { Link } from "react-router"

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


export default function AllMouvementStockList() {

    const stockData = new Stock()

    const [loading, setLoading] = useState(false)
    const [allMouvement, setAllMouvement] = useState([])
    const savedPagination = JSON.parse(sessionStorage.getItem("paginationState"));

    const [first, setFirst] = useState(savedPagination?.first || 0);
    const [rows, setRows] = useState(savedPagination?.rows || 10); 

    useEffect( ()=>{
        const fetchData = async () => {
            setLoading(true)
            try{
                const mouvement_data = await stockData.getAllMouvementStock()
                setAllMouvement(mouvement_data)
            } catch(error){
                console.log('Error fetching data ',error)
            } finally{
                setLoading(false)
            }
        };
        fetchData
    },[])

    const handlePageChange = (e) => {
        setFirst(e.first);
        setRows(e.rows);
        sessionStorage.setItem("paginationState", JSON.stringify({ first: e.first, rows: e.rows }));
    };

    return (
        <>
            <div className="border rounded-2xl bg-white p-2">
                <div className="card rounded-2xl">
                    <DataTable
                        value={allMouvement}
                        loading={loading}
                        removableSort
                        paginator
                        rows={rows} 
                        first={first}
                        onPage={handlePageChange}
                        rowsPerPageOptions={[5, 10, 25, 50, 100, 200, 300, 500, 1000]}
                        tableStyle={{ minWidth: '50rem' }}
                        emptyMessage="Aucun mouvement trouvé"
                        className="p-datatable-sm">
                            
                        <Column header="ID"></Column>
                        <Column header="Type"></Column>
                        <Column header="Quantité"></Column>

                    </DataTable>
                </div>
            </div>
        </>
    )
}