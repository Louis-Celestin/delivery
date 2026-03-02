import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { DemandeQr } from "../../backend/demandeQr/DemandeQr";
import { Users } from "../../backend/users/Users";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table"
import { Modal } from "../../components/ui/modal";
import { ProgressSpinner } from "primereact/progressspinner";
import Label from "../../components/form/Label";
import FileInput from "../../components/form/input/FileInput";
import TextArea from "../../components/form/input/TextArea";

export default function DemandeQrDetails() {
    const demandeData = new DemandeQr()
    const userData = new Users()
    const { id: idDemande } = useParams();
    const userId = localStorage.getItem('id');

    const [loadingData, setLoadingData] = useState(false)
    const [loadingGenerate, setLoadingGenerate] = useState(false)

    const [dateDemande, setDateDemande] = useState('')
    const [statutDemande, setStatutDemande] = useState('')
    const [statutClass, setStatutClass] = useState('')

    const [isSoumise, setIsSoumise] = useState(false)
    const [isGeneree, setIsGeneree] = useState(false)
    const [isImprimee, setIsImprimee] = useState(false)
    const [isLivree, setIsLivree] = useState(false)
    const [isRecue, setIsRecue] = useState(false)
    const [isReg, setIsReg] = useState(false)

    const [isDemandeur, setIsDemandeur] = useState(false)
    const [isGenerateur, setIsGenerateur] = useState(false)
    const [isImprimeur, setIsImprimeur] = useState(false)
    const [isLivreur, setIsLivreur] = useState(false)
    const [isReceveur, setIsReceveur] = useState(false)

    const [listeDemande, setListeDemande] = useState([])
    const [totalQr, setTotalQr] = useState(0)
    const [totalMarchand, setTotalMarchand] = useState(0)
    const [totalListe, setTotalListe] = useState(0)

    const [isModalGenerationOpen, setIsModalGenerationOpen] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState([])
    const [commentaireGenerator, setCommentaireGenerator] = useState('')
    const [errorGenerate, setErrorGenerate] = useState('')

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR'); // or use any locale you want
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingData(true)
                const id = Number(idDemande)
                const demande = await demandeData.getOneDemandeQr(id)
                // console.log(demande)

                const formDemande = demande.forms
                // console.log(formDemande)

                const listeDemande = JSON.parse(demande.liste_demande)
                setListeDemande(listeDemande)
                setTotalListe(listeDemande.length)
                // console.log(listeDemande)

                const statut = demande.statut
                const classStatut = 'text-center text-sm font-semibold rounded-xl p-0.5 bg-blue-50 text-blue-300'
                const commentaireDemande = formDemande.commentaire

                const dateDemande = formatDate(formDemande.last_modified_at)
                setDateDemande(dateDemande)

                const quantiteQr = demande.quantite_qr
                setTotalQr(quantiteQr)

                const quantiteMarchand = demande.quantite_marchand
                setTotalMarchand(quantiteMarchand)

                let userRoles_data = await userData.getUserRoles(parseInt(userId))
                const rolesId = userRoles_data.roles.map((role) => {
                    return role.id_role
                })

                const regularisation = demande.isReg
                if (regularisation) {
                    setIsReg(true)
                }

                if (statut == 'soumise') {
                    setStatutDemande('soumise')
                    setStatutClass(classStatut)
                    setIsSoumise(true)
                    if (rolesId.includes(16)) {
                        setIsGenerateur(true)
                    }
                }

            } catch (error) {
                console.log("Error fetchind data ", error)
            } finally {
                setLoadingData(false)
            }
        };
        fetchData()
    }, [])

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files);

            // Avoid adding duplicate files (optional)
            const updatedFiles = [...selectedFiles];

            newFiles.forEach(file => {
                if (!updatedFiles.find(f => f.name === file.name && f.size === file.size)) {
                    updatedFiles.push(file);
                }
            });

            setSelectedFiles(updatedFiles);
        }
    };

    const handleDeleteFile = (indexToRemove) => {
        setSelectedFiles((prev) =>
            prev.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleUploadQr = async () => {
        if(selectedFiles.length == 0){
            setErrorGenerate("Vous devez upload au moins un fichier !")
            return
        }
        setIsModalGenerationOpen(false)
        try{
            setLoadingGenerate(true)
        } catch(error) {

        } finally {
            setLoadingGenerate(false)
        }
    }
    return (
        <>
            <PageBreadcrumb pageTitle={`Détails demande QRC ${idDemande}`} />
            <div>
                {loadingData ? (
                    <>
                        <div className="flex justify-center items-center h-full">
                            <span>Loading..</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 justify-between items-center">
                                    <div className="space-y-2">
                                        {isReg ? (
                                            <>
                                                <div>
                                                    <div className="">
                                                        <span className="border p-1.5 border-red-800 text-red-800 text-xs font-light">Régularisation</span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                        <div>
                                            <span className="text-sm">{`Demande du ${dateDemande}`}</span>
                                        </div>
                                        <div className=''>
                                            <span className={statutClass}>
                                                {statutDemande}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="grid grid-cols-2">
                                            <div className='col-start-2 space-y-0.5'>
                                                {isGenerateur ? (
                                                    <>
                                                        {loadingGenerate ? (
                                                            <>
                                                                <div className='text-center'>
                                                                    <span className=''>
                                                                        <ProgressSpinner style={{ width: '20px', height: '20px' }} strokeWidth="8" animationDuration=".5s" />
                                                                    </span>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button className='bg-gray-100 rounded py-3 px-5 h-8 w-full flex items-center hover:bg-gray-200'
                                                                    onClick={() => {
                                                                        setIsModalGenerationOpen(true)
                                                                    }}>
                                                                    <span className='mr-4'><i className="pi pi-inbox"></i></span>
                                                                    <span className='text-sm text-gray-700 font-medium'>Upload QR Codes</span>
                                                                </button>
                                                            </>
                                                        )}
                                                    </>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                                            <div className='p-4 pb-0 text-xs text-gray-600 flex space-x-4 font-semibold'>
                                                <span>Nombre élément : {totalListe}</span>
                                                <span>Total Marchand : {totalMarchand}</span>
                                                <span>Total QR Code : {totalQr}</span>
                                            </div>
                                            <div className="max-w-full overflow-x-auto">
                                                <Table>
                                                    {/* Table Header */}
                                                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                                        <TableRow>
                                                            <TableCell
                                                                isHeader
                                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                                                Type QR
                                                            </TableCell>
                                                            <TableCell
                                                                isHeader
                                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                                                Chaîne
                                                            </TableCell>
                                                            <TableCell
                                                                isHeader
                                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                                                Point Marchand
                                                            </TableCell>
                                                            <TableCell
                                                                isHeader
                                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                                                Quantité TPE
                                                            </TableCell>
                                                            <TableCell
                                                                isHeader
                                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                                                Quantité QR Code
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHeader>
                                                    {/* Table Body */}
                                                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                                        {listeDemande.map((item, index) => (
                                                            <TableRow>
                                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                                    {item.typeQr}
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                                    {item.chaine}
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                                    {item.pointMarchand}
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                                    {item.quantiteTerminal}
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                                    {item.quantiteQr}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <Modal isOpen={isModalGenerationOpen} onClose={() => setIsModalGenerationOpen(false)} className="p-4 max-w-md">
                <div className="space-y-5">
                    <div className="w-full text-center">
                        <span className="p-3 rounded bg-blue-200 text-blue-500 font-medium">Upload</span>
                    </div>
                    <div>
                        <Label>Commentaire</Label>
                        <TextArea
                            value={commentaireGenerator}
                            onChange={(value) => setCommentaireGenerator(value)}
                            rows={4}
                            placeholder="Ajoutez un commentaire"
                        />
                    </div>
                    <div>
                        <div>
                            <Label>Importer des fichiers</Label>
                            <FileInput className="curstom-class"
                                onChange={handleFileChange}
                                multiple
                            />
                            {selectedFiles.length > 0 ? (
                                <div className="mt-3">
                                    {selectedFiles.map((selectedFile, index) => (
                                        <div key={index} className="bg-gray-100 px-1 flex justify-between items-center rounded-sm my-1">
                                            <span>
                                                <i className="pi pi-file-check"></i>
                                            </span>
                                            <span className=" text-gray-500" style={{ fontSize: '9px' }}>
                                                {selectedFile.name}
                                            </span>
                                            <button onClick={() => handleDeleteFile(index)}>
                                                <span className="text-error-600"><i className="pi pi-times"></i></span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                    <div className="text-center">
                        <span className="text-error-500 text-xs">
                            {errorGenerate}
                        </span>
                    </div>
                    <div>
                        <div className="w-full flex justify-center items-center">
                            <button className="w-1/2 flex items-center justify-center bg-green-400 p-2 rounded-2xl"
                                onClick={handleUploadQr}
                            >
                                Valider
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}