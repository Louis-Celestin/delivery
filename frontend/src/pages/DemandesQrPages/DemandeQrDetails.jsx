import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
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
import JSZip from "jszip";
import { useDropzone } from "react-dropzone"
import Swal from "sweetalert2";
import SignatureCanvas from "react-signature-canvas";

export default function DemandeQrDetails() {
    const demandeData = new DemandeQr()
    const userData = new Users()
    const { id: idDemande } = useParams();
    const userId = localStorage.getItem('id');
    const navigate = useNavigate()

    const [loadingData, setLoadingData] = useState(false)
    const [loadingGenerate, setLoadingGenerate] = useState(false)
    const [loadingDownload, setLoadingDownload] = useState(false)
    const [loadingImpression, setLoadingImpression] = useState(false)
    const [loadingLivraison, setLoadingLivraison] = useState(false)

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

    const [idGeneration, setIdGeneration] = useState(null)
    const [commentaireGeneration, setCommentaireGeneration] = useState('')

    const [isModalImpressionOpen, setIsModalImpressionOpen] = useState(false)
    const [isModalReturnFilesOpen, setIsModalReturnFilesOpen] = useState(false)

    const [isUploaded, setIsUploaded] = useState(false)

    const [commentaireImpression, setCommentaireImpression] = useState('')
    const [commentaireReturnFiles, setCommentaireReturnFiles] = useState('')

    const [isModalLivraisonOpen, setIsModalLivraisonOpen] = useState(false)
    const [errorSignLivraison, setErrorSignLivraison] = useState('')
    const [signatureLivraison, setSignatureLivraison] = useState()
    const [commentaireLivraison, setCommentaireLivraison] = useState('')


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

                const indexGeneration = demande.generation_qr.length - 1
                const generation = demande.generation_qr[indexGeneration]

                const indexImpression = demande.impression_qr.length - 1
                const impression = demande.impression_qr[indexImpression]

                if (statut == 'soumise') {
                    setStatutDemande('soumise')
                    setStatutClass(classStatut)
                    setIsSoumise(true)
                    if (rolesId.includes(16)) {
                        setIsGenerateur(true)
                    }
                } else if (statut == 'generee' && generation) {
                    setStatutDemande('générée')
                    setStatutClass('text-center text-xs font-semibold rounded-xl p-0.5 bg-blue-100 text-blue-500')
                    setIsGeneree(true)
                    setIdGeneration(generation.id)
                    if (rolesId.includes(17)) {
                        setIsImprimeur(true)
                    }
                } else if (statut == 'imprimee' && impression) {
                    setStatutDemande('imprimée')
                    setStatutClass('text-center text-xs font-semibold rounded-xl p-0.5 bg-blue-200 text-blue-500')
                    setIsImprimee(true)
                    if (rolesId.includes(18)) {
                        setIsLivreur(true)
                    }
                }
                if (generation && (statut == 'generee' || statut == 'imprimee' || statut == 'livree' || statut == 'recue')) {
                    setIsUploaded(true)
                }

            } catch (error) {
                console.log("Error fetchind data ", error)
            } finally {
                setLoadingData(false)
            }
        };
        fetchData()
    }, [])

    const onDrop = useCallback(async (acceptedFiles) => {
        const updatedFiles = [...selectedFiles];

        for (const file of acceptedFiles) {

            // Handle ZIP files
            if (file.type === "application/zip" || file.name.endsWith(".zip")) {
                try {
                    const zip = await JSZip.loadAsync(file);

                    const extractedFiles = await Promise.all(
                        Object.keys(zip.files).map(async (filename) => {
                            const zipEntry = zip.files[filename];

                            if (!zipEntry.dir) {
                                const blob = await zipEntry.async("blob");

                                return new File([blob], filename, {
                                    type: blob.type,
                                });
                            }
                            return null;
                        })
                    );

                    extractedFiles.forEach((extractedFile) => {
                        if (
                            extractedFile &&
                            !updatedFiles.find(
                                (f) =>
                                    f.name === extractedFile.name &&
                                    f.size === extractedFile.size
                            )
                        ) {
                            updatedFiles.push(extractedFile);
                        }
                    });

                } catch (error) {
                    console.error("ZIP extraction error:", error);
                    Swal.fire({
                        title: "Attention",
                        text: "Erreur d'exctraction de fichiers !",
                        icon: "warining"
                    })
                }
            } else {
                // Normal file
                if (
                    !updatedFiles.find(
                        (f) => f.name === file.name && f.size === file.size
                    )
                ) {
                    updatedFiles.push(file);
                }
            }
        }

        setSelectedFiles(updatedFiles);
    }, [selectedFiles]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: true,
    });

    const handleDeleteFile = (indexToRemove) => {
        setSelectedFiles((prev) =>
            prev.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleUploadQr = async () => {
        if (selectedFiles.length == 0) {
            setErrorGenerate("Vous devez upload au moins un fichier !")
            return
        }
        setIsModalGenerationOpen(false)
        try {
            setErrorGenerate('')
            setLoadingGenerate(true)
            const id = Number(idDemande)
            const fd = new FormData()
            selectedFiles.forEach((file) => {
                fd.append("qrCodes", file);
            });
            fd.append('userId', Number(userId))
            fd.append('commentaire', commentaireGenerator)
            await demandeData.uploadDemandeQr(id, fd)

            Swal.fire({
                title: "Succès",
                text: "Demande effectuée avec succès !",
                icon: "success"
            })
            navigate('/toutes-les-demandes-qr')
        } catch (error) {
            console.log("Erreur de génération : ", error)
            Swal.fire({
                title: "Attention",
                text: "Une erreur est survenue lors de la génération !",
                icon: "warning"
            })
            navigate('/toutes-les-demandes-qr')
        } finally {
            setLoadingGenerate(false)
        }
    }

    const handleDownloadFiles = async () => {
        try {
            setLoadingDownload(true)
            const response = await demandeData.downloadQrCodes(idDemande, idGeneration);

            const url = window.URL.createObjectURL(response.data);

            const a = document.createElement("a");
            a.href = url;

            // Extract filename from headers if backend sends it
            const contentDisposition = response.headers["content-disposition"];
            let fileName = "qr_codes";

            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?(.+)"?/);
                if (match?.[1]) fileName = match[1];
            }

            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Download error:", error);
            Swal.fire({
                title: "Attention",
                text: "Une erreur s'est produite lors du téléchargement !",
                icon: "warning"
            });
        } finally {
            setLoadingDownload(false)
        }
    }

    const handleImpressionQr = async () => {
        setIsModalImpressionOpen(false)
        try {
            setLoadingImpression(true)
            const payload = {
                userId,
                commmentaire: commentaireImpression,
            }

            await demandeData.impressionDemandeQr(idDemande, idGeneration, payload)
            Swal.fire({
                title: "Succès",
                text: "Impression confirmée avec succès !",
                icon: "success"
            })
            navigate('/toutes-les-demandes-qr')
        } catch (error) {
            console.log("Erreur de confirmation d'impression : ", error)
            Swal.fire({
                title: "Attention",
                text: "Une erreur est survenue lors de la confirmation !",
                icon: "warning"
            })
            navigate('/toutes-les-demandes-qr')
        } finally {
            setLoadingImpression(false)
        }
    }

    const handleClearLivraison = () => {
        signatureLivraison.clear()
    }

    const handleLivraisonQr = async () => {
        if (signatureLivraison.isEmpty()) {
            setErrorSignLivraison('Vous devez signer pour valider !')
            return;
        }
        setIsModalLivraisonOpen(false)
        try {
            setLoadingLivraison(true)
            const sign = signatureLivraison.toDataURL('image/png')
            const fd = new FormData();
            if (sign) {
                const blob = await fetch(sign).then(res => res.blob());
                fd.append('signature', blob, 'signature.png');
            }
            fd.append('userId', userId)
            fd.append('commentaire', commentaireLivraison)

            await demandeData.livraisonDemandeQr(idDemande, fd)

            Swal.fire({
                title: "Succès",
                text: "Livraison éffectuée avec succès !",
                icon: "success"
            })
            navigate('/toutes-les-demandes-qr')
        } catch (error) {
            console.log("Erreur de confirmation d'impression : ", error)
            Swal.fire({
                title: "Attention",
                text: "Une erreur est survenue lors de la livraison !",
                icon: "warning"
            })
            navigate('/toutes-les-demandes-qr')
        } finally {
            setLoadingImpression(false)
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
                                                                    <span className='mr-4'><i className="pi pi-upload"></i></span>
                                                                    <span className='text-sm text-gray-700 font-medium'>Upload QR Codes</span>
                                                                </button>
                                                            </>
                                                        )}
                                                    </>
                                                ) : (
                                                    <></>
                                                )}
                                                {isUploaded ? (
                                                    <>
                                                        {loadingDownload ? (
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
                                                                    onClick={handleDownloadFiles}>
                                                                    <span className='mr-4'><i className="pi pi-download"></i></span>
                                                                    <span className='text-sm text-gray-700 font-medium'>Télécharger QR Codes</span>
                                                                </button>
                                                            </>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                    </>
                                                )}
                                                {isImprimeur ? (
                                                    <>
                                                        <div>
                                                            {loadingImpression ? (
                                                                <>
                                                                    <div className='text-center'>
                                                                        <span className=''>
                                                                            <ProgressSpinner style={{ width: '20px', height: '20px' }} strokeWidth="8" animationDuration=".5s" />
                                                                        </span>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="space-y-0.5">
                                                                        <button className='bg-gray-100 rounded py-3 px-5 h-8 w-full flex items-center hover:bg-gray-200'
                                                                            onClick={() => {
                                                                                setIsModalImpressionOpen(true)
                                                                            }}>
                                                                            <span className='mr-4'><i className="pi pi-print"></i></span>
                                                                            <span className='text-sm text-gray-700 font-medium'>Confirmer Impression</span>
                                                                        </button>
                                                                        <button className='bg-gray-100 rounded py-3 px-5 h-8 w-full flex items-center hover:bg-gray-200'
                                                                            onClick={() => {
                                                                                setIsModalReturnFilesOpen(true)
                                                                            }}>
                                                                            <span className='mr-4'><i className="pi pi-exclamation-triangle"></i></span>
                                                                            <span className='text-sm text-gray-700 font-medium'>Retourner QR Codes</span>
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <></>
                                                )}
                                                {isLivreur ? (
                                                    <>
                                                        {loadingLivraison ? (
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
                                                                        setIsModalLivraisonOpen(true)
                                                                    }}>
                                                                    <span className='mr-4'><i className="pi pi-send"></i></span>
                                                                    <span className='text-sm text-gray-700 font-medium'>Livraison QR Codes</span>
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
                <div className="space-y-3">
                    <div className="w-full text-center">
                        <span className="p-3 rounded bg-blue-200 text-blue-500 font-medium">Upload</span>
                    </div>
                    <div>
                        <Label>Commentaire</Label>
                        <TextArea
                            value={commentaireGenerator}
                            onChange={(value) => setCommentaireGenerator(value)}
                            rows={3}
                            placeholder="Ajoutez un commentaire"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs">
                            Total QR Codes demandés: <span className="font-semibold">{totalQr}</span>
                        </span>
                        <span className="text-xs">
                            QR Codes uploaded: <span className="font-semibold">{selectedFiles.length}</span>
                        </span>
                    </div>
                    <div>
                        <div>
                            <Label>Importer des fichiers <span className="text-red-700">*</span></Label>
                            <div
                                {...getRootProps()}
                                className="border-2 border-dashed p-2 rounded-lg text-center cursor-pointer"
                            >
                                <input {...getInputProps()} />
                                <p className="text-xs">Faites glisser les fichiers ici, ou cliquer pour les sélectionner.</p>
                            </div>
                            <div className="max-h-38 overflow-y-auto">
                                {selectedFiles.length > 0 ? (
                                    <div className="mt-3">
                                        {selectedFiles.map((selectedFile, index) => (
                                            <div key={index} className="bg-gray-100 px-1 flex justify-between items-center rounded-sm my-1">
                                                <span>
                                                    <i className="pi pi-file-check"></i>
                                                </span>
                                                <span className=" text-center" style={{ fontSize: '9px' }}>
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
            <Modal isOpen={isModalImpressionOpen} onClose={() => setIsModalImpressionOpen(false)} className="p-4 max-w-md">
                <div className="space-y-5">
                    <div className="w-full text-center">
                        <span className="p-3 rounded bg-blue-200 text-blue-500 font-medium">Impression</span>
                    </div>
                    <div className="text-center text-sm font-medium">
                        <span>Confirmer l'impression des QR Codes</span>
                    </div>
                    <div>
                        <Label>Commentaire</Label>
                        <TextArea
                            value={commentaireImpression}
                            onChange={(value) => setCommentaireImpression(value)}
                            rows={3}
                            placeholder="Ajoutez un commentaire"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs">
                            Total QR Codes demandés: <span className="font-semibold">{totalQr}</span>
                        </span>
                    </div>
                    <div>
                        <div className="w-full flex justify-center items-center">
                            <button className="w-1/2 flex items-center justify-center bg-green-400 p-2 rounded-2xl"
                                onClick={handleImpressionQr}
                            >
                                Valider
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={isModalReturnFilesOpen} onClose={() => setIsModalReturnFilesOpen(false)} className="p-4 max-w-md">
                <div className="space-y-5">
                    <div className="w-full text-center">
                        <span className="p-3 rounded bg-red-200 text-red-500 font-medium">Retourner</span>
                    </div>
                    <div className="text-center text-sm font-medium">
                        <span>Donnez la raison du retour des QR Codes</span>
                    </div>
                    <div>
                        <Label>Commentaire <span className="text-red-700">*</span></Label>
                        <TextArea
                            value={commentaireReturnFiles}
                            onChange={(value) => setCommentaireReturnFiles(value)}
                            rows={3}
                            placeholder="Ajoutez un commentaire"
                        />
                    </div>
                    <div>
                        <div className="w-full flex justify-center items-center">
                            <button className="w-1/2 flex items-center justify-center bg-green-400 p-2 rounded-2xl"
                                onClick={handleUploadQr}
                            >
                                Retourner
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={isModalLivraisonOpen} onClose={() => setIsModalLivraisonOpen(false)} className="p-4 max-w-md">
                <div className='p-1'>
                    <div className="w-full text-center mb-3">
                        <span className="p-3 rounded bg-blue-200 text-blue-500 font-medium text-sm">Validation</span>
                    </div>
                    <div className='text-center mb-3 text-xs'>
                        <span>Signez manuellement pour valider la livraison</span>
                    </div>
                    <div className='flex flex-col justify-center items-center'>
                        <SignatureCanvas
                            ref={data => setSignatureLivraison(data)}
                            canvasProps={{ width: 300, height: 150, className: 'sigCanvas border border-gray-300 rounded' }}
                        />
                        <div className='w-full mt-3'>
                            <Label>Commentaire</Label>
                            <TextArea
                                value={commentaireLivraison}
                                onChange={(value) => setCommentaireLivraison(value)}
                                rows={4}
                                placeholder="Ajoutez un commentaire"
                            />
                        </div>
                        <div className='w-full mt-6 flex justify-center items-center'>
                            <button
                                onClick={handleClearLivraison}
                                className='w-1/4 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                                Clear
                            </button>
                            <button
                                onClick={handleLivraisonQr}
                                className='w-1/4 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                                Valider
                            </button>
                        </div>
                    </div>
                    <div className="text-center">
                        <span className="text-error-500 text-xs">
                            {errorSignLivraison}
                        </span>
                    </div>
                </div>
            </Modal>
        </>
    )
}