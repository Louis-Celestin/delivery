const TEST_ENV = require("../../utils/consts")

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../../config/clouddinaryConifg");
const { get } = require("http");
const { urlToHttpOptions } = require("url");
const { type } = require("os");
const sendMail = require("../../utils/emailSender");

const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString("fr-FR", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

// baseUrl est l'addresse du site de livraison
const baseUrl = process.env.FRONTEND_BASE_URL || "https://livraisons.greenpayci.com";
// localUrl est l'addresse en local pour les tests
const localUrl = "http://localhost:5173"
// GENERAL_URL va être utilisée dans les mails envoyés pour pouvoir rediriger correctement l'utilisateur vers la page avec le bon lien
// En test GENERAL_URL doit avoir la valeur de localUrl et celle de baseUrl lors du deploiement.
let GENERAL_URL = baseUrl
let test_env = TEST_ENV
if (test_env) {
    GENERAL_URL = localUrl
}

const regularisationDemande = async (req, res) => {
    try {
        const {
            date_demande,
            date_livraison,
            commentaire,
            liste_demande,
            quantite_marchand,
            quantite_qr,
            userId,
        } = req.body

        const signature = req.files?.signature || null;
        if (!signature) {
            console.error('Signature manquante !')
            return res.status(404).json({ message: "Signature introuvable !" });
        }

        const utilisateur = await prisma.users.findUnique({
            where: {
                id_user: parseInt(userId)
            }
        })
        if (!utilisateur) {
            console.error('Utilisteur introuvable !')
            return res.status(404).json({ message: "Utilisateur introuvable !" });
        }

        const details = typeof liste_demande === "string"
            ? JSON.parse(liste_demande)
            : liste_demande;

        const demande = await prisma.demande_qr.create({
            data: {
                statut: 'livree',
                created_at: new Date(date_demande),
                created_by: parseInt(userId),
                nom_user: utilisateur.fullname,
                quantite_qr,
                quantite_marchand,
                liste_demande: JSON.stringify(details),
                commentaire,
                is_reg: true,
            }
        })
    } catch (error) {

    }
}

const faireDemandeQr = async (req, res) => {
    try {
        const {
            commentaire,
            liste_demande,
            quantite_marchand,
            quantite_qr,
            userId,
        } = req.body

        // const signature = req.files?.signature?.[0] || null;
        // if (!signature) {
        //     console.error('Signature manquante !')
        //     return res.status(404).json({ message: "Signature introuvable !" });
        // }

        const utilisateur = await prisma.users.findUnique({
            where: {
                id_user: parseInt(userId)
            }
        })
        if (!utilisateur) {
            console.error('Utilisteur introuvable !')
            return res.status(404).json({ message: "Utilisateur introuvable !" });
        }

        const details = typeof liste_demande === "string"
            ? JSON.parse(liste_demande)
            : liste_demande;


        const demande = await prisma.forms.create({
            data: {
                type: 'demande_qr',
                created_by: utilisateur.id_user,
                created_at: new Date(),
                last_modified_at: new Date(),
                nom_user: utilisateur.fullname,
                commentaire,
                demande_qr: {
                    create: {
                        statut: 'soumise',
                        quantite_qr,
                        quantite_marchand,
                        liste_demande: JSON.stringify(details),
                    }
                },
                // form_signatures: {
                //     create: {
                //         role : 'demandeur',
                //         signature_url: signature.path,
                //         signed_by: utilisateur.id_user
                //     }
                // },
            },
            include: {
                demande_qr: true,
                // form_signatures: true,
            }
        })

        /*****************          GESTION MAIL             *****************/

        const roleGenerateur = await prisma.user_roles.findMany({
            where: {
                role_id: 16,
            },
            include: {
                users: true
            }
        })

        const roleImpression = await prisma.user_roles.findMany({
            where: {
                role_id: 17,
            },
            include: {
                users: true
            }
        })

        const generateurs = roleGenerateur.map(us => us.users)
        const imprimeurs = roleImpression.map(us => us.users)

        let commentaire_mail = commentaire ? commentaire : '(sans commentaire)';

        const url = GENERAL_URL
        let link = `${url}/demande-qr-details/${demande.id}`;

        if ((generateurs && generateurs.length > 0) || (imprimeurs && imprimeurs.length > 0)) {
            const subject = `NOUVELLE DEMANDE DE QR CODE(S)`;
            let html = `
                <p>Bonjour,</p>
                <p>Une nouvelle demande de QR code(s) a été enregistrée.</p>
                <ul>
                <li><strong>Nombre de marchands :</strong> ${quantite_marchand}</li>
                <li><strong>Nombre de QR Code :</strong> ${quantite_qr}</li>
                </ul>
                <br>
                <p>Commentaire : ${commentaire_mail}<p>
                <br>
                <p>Retrouvez la demande à ce lien : 
                <span>
                <a href="${link}" target="_blank" style="background-color: #73dced; color: white; padding: 7px 12px; text-decoration: none; border-radius: 5px;">
                    Cliquez ici !
                </a>
                </span>
                </p>
                <br><br>
                <p>Green - Pay vous remercie.</p>
            `;
            for (const generateur of generateurs) {
                await sendMail({
                    to: generateur.email,
                    subject,
                    html,
                });
            }
            for (const imprimeur of imprimeurs) {
                await sendMail({
                    to: imprimeur.email,
                    subject,
                    html,
                });
            }
        }

        console.log("Demande enregistrée avec succès ! ")
        res.status(201).json({
            message: "Demande enregistrée avec succès",
            demandeQr: demande,
        });
    } catch (error) {
        console.error("Erreur lors de la demande :", error);
        res.status(500).json({ message: "Erreur interne", error });
    }

}

const getAllTypePaiement = async (req, res) => {
    try {
        const typePaiement = await prisma.type_paiement.findMany({
            orderBy: { id: 'asc' },
        });

        console.log('Succès !')
        res.status(200).json(typePaiement);
    } catch (error) {
        console.error("Erreur lors de la récupération des types de paiements :", error)
        res.status(500).json({ message: "Erreur lors de la récupération des types de paiements", error });
    }
}

const getAllDemandesQr = async (req, res) => {
    try {
        const demandes = await prisma.demande_qr.findMany({
            include: {
                forms: true,
                generation_qr: {
                    include: {
                        forms: true
                    },
                },
                impression_qr: true,
                livraison_qr: true,
                reception_qr: true,
            },
            orderBy: {
                forms: {
                    last_modified_at: 'desc',
                }
            },
        });

        console.log('Succès !')
        res.status(200).json(demandes);
    } catch (error) {
        console.error("Erreur lors de la récupération des demandes de QR Codes :", error)
        res.status(500).json({ message: "Erreur lors de la récupération des demandes de QR Codes", error });
    }
}

const getOneDemandeQr = async (req, res) => {
    try {
        const {
            id
        } = req.params

        const demande = await prisma.demande_qr.findUnique({
            where: {
                id: parseInt(id)
            }, include: {
                forms: true,
                generation_qr: {
                    include: {
                        forms: true
                    },
                },
                impression_qr: true,
                livraison_qr: true,
                reception_qr: true,
            },
        })
        console.log('Succès !')
        res.status(200).json(demande);
    } catch (error) {
        console.error("Erreur lors de la récupération de la demande de QR Codes :", error)
        res.status(500).json({ message: "Erreur lors de la récupération de la demande de QR Codes", error });
    }

}

const uploadDemandeQr = async (req, res) => {
    try {
        const {
            id
        } = req.params

        const {
            userId,
            commentaire,
        } = req.body

        const qrCodes = req.files?.qrCodes || [];

        if(qrCodes.length == 0) {
            console.error("Erreur : Aucun QR CODE upload")
            return res.status(400).json({ message: "Aucun QR CODE upload !" });
        }

        const qrCodes_content = qrCodes.length
            ? qrCodes.map(file => ({
                name: file.originalname,
                path: file.path,
                type: file.mimetype,
                size: file.size
            }))
            : [];

        const demande = await prisma.demande_qr.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if (!demande) {
            console.error("Erreur : demande introuvable")
            return res.status(404).json({ message: "Demande introuvable !" });
        }

        const utilisateur = await prisma.users.findUnique({
            where: {
                id_user: parseInt(userId)
            }
        })
        if (!utilisateur) {
            console.error('Utilisteur introuvable !')
            return res.status(404).json({ message: "Utilisateur introuvable !" });
        }

        const newGenerationQr = await prisma.$transaction(async (tx) => {
            const generationForm = await tx.forms.create({
                data: {
                    type: 'generation_qr',
                    created_by: utilisateur.id_user,
                    created_at: new Date(),
                    last_modified_at: new Date(),
                    nom_user: utilisateur.fullname,
                    commentaire,
                }
            });
            const generation = await tx.generation_qr.create({
                data: {
                    form_id: generationForm.id,
                    quantite_qr: qrCodes.length,
                    demande_id: demande.id,
                }
            })
            await tx.qr_codes.createMany({
                data: qrCodes_content.map(file => ({
                    path: file.path,
                    filename: file.name,
                    orignalName: file.name,
                    mimeType: file.type,
                    size: file.size,
                    created_at: new Date(),
                    uploaded_by: utilisateur.id,
                    demande_id: demande.id,
                    generation_id: generation.id,
                }))
            })

            await tx.demande_qr.update({
                where: {
                    id: demande.id
                },
                data: {
                    statut: 'generee'
                }
            })

            return (generationForm, generation)
        })

        /*****************          GESTION MAIL             *****************/

        const roleImpression = await prisma.user_roles.findMany({
            where: {
                role_id: 17,
            },
            include: {
                users: true
            }
        })
        const roleLivraison = await prisma.user_roles.findMany({
            where: {
                role_id: 18,
            },
            include: {
                users: true,
            }
        })
        const imprimeurs = roleImpression.map(us => us.users)
        const livreurs = roleLivraison.map(us => us.users)

        let commentaire_mail = commentaire ? commentaire : '(sans commentaire)';

        const url = GENERAL_URL
        let link = `${url}/demande-qr-details/${demande.id}`;

        if ((livreurs && livreurs.length > 0) || (imprimeurs && imprimeurs.length > 0)) {
            const subject = `QR CODE(S) GÉNÉNÉRÉ(S)`;
            let html = `
                <p>Bonjour,</p>
                <p>Les QR Codes de la demande ${demande.id} ont été générés.</p>
                <ul>
                <li><strong>Nombre de marchands :</strong> ${quantite_marchand}</li>
                <li><strong>Nombre de QR Code :</strong> ${quantite_qr}</li>
                </ul>
                <br>
                <p>Commentaire : ${commentaire_mail}<p>
                <br>
                <p>Retrouvez la demande à ce lien : 
                <span>
                <a href="${link}" target="_blank" style="background-color: #73dced; color: white; padding: 7px 12px; text-decoration: none; border-radius: 5px;">
                    Cliquez ici !
                </a>
                </span>
                </p>
                <br><br>
                <p>Green - Pay vous remercie.</p>
            `;
            for (const livreur of livreurs) {
                await sendMail({
                    to: livreur.email,
                    subject,
                    html,
                });
            }
            for (const imprimeur of imprimeurs) {
                await sendMail({
                    to: imprimeur.email,
                    subject,
                    html,
                });
            }
        }

        console.log("Génération QR Code éffectué avec succès ! ")
        res.status(201).json({
            message: "Génération QR Code éffectué avec succès !",
            GenerationQr: newGenerationQr,
        });
    } catch (error) {
        console.error("Erreur lors de la génération :", error);
        res.status(500).json({ message: "Erreur interne", error });
    }


}

module.exports = {
    getAllTypePaiement,
    faireDemandeQr,
    getAllDemandesQr,
    getOneDemandeQr,
    uploadDemandeQr,
}