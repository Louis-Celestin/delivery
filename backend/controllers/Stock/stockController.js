const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../../config/clouddinaryConifg");

const baseUrl = process.env.FRONTEND_BASE_URL || "https://livraisons.greenpayci.com";
const localUrl = "http://localhost:5173"
const GENERAL_URL = baseUrl 

let test_env = false
let support_role = 7;
let livraison_role = 1;
let commercial_role = 2;
let superviseur_role = 3;
let maintenance_role = 6;
if (test_env){
    support_role = livraison_role = commercial_role = superviseur_role = maintenance_role = 4;
}

// Attribuer une quantité à un stock choisi en fonction de l'ID du stock.
const setStock = async (req, res) =>{
    const {
        piece_id,
        stock_initial,
        nouveau_stock,
        utilisateur_id,
    } = req.body;

    try{
        const piece = await prisma.stock_dt.findUnique({
            where: {
                id_piece: parseInt(piece_id)
            }
        })
        
        if(!piece){
            return res.status(404).json({ message: "Pièce non trouvée" });
        }
        let utilisateur = null;
        if(utilisateur_id != null){
            utilisateur = await prisma.users.findUnique({
            where: {
                id_user: parseInt(utilisateur_id)
            }})
            if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
            }
        }

        const dataToUpdate = {
            quantite : parseInt(nouveau_stock)
        }

        const updated_piece = await prisma.stock_dt.update({
            where: {id_piece: parseInt(piece_id)},
            data: dataToUpdate
        })

        // GESTION MAIL
        const url = GENERAL_URL
        let nom_utilisateur = 'SERVICE LIVRAISON'
        if(utilisateur){
            nom_utilisateur = utilisateur.username.toUpperCase().replace(".", " ")
        }
        let nom_piece = updated_piece.nom_piece
        let ancien_stock = parseInt(stock_initial)
        let nouvelle_quantite = parseInt(nouveau_stock)

        let linkStock = `${url}/gestion-stock`;
        // const linkStock = `https://livraisons.greenpayci.com/formulaire-recu/${nouvelleLivraison.id_demande}`
        const sendMail = require("../../utils/emailSender");


        const supervieurs = await prisma.users.findMany({
            where: { role_id: superviseur_role },
        });

        if (supervieurs && supervieurs.length > 0) {
            const subject = "MODIFICATION DE STOCK";
            const html = `
            <p>Bonjour,</p>
            <p>Le Stock de ${nom_piece} a été modifié.</p>
            <ul>
                <li><strong>Stock initial:</strong> ${ancien_stock}</li>
                <li><strong>Nouveau Stock:</strong> ${nouvelle_quantite}</li>
            </ul>
            <ul>
            <li><strong>Initiateur:</strong> ${nom_utilisateur}</li>
            </ul>
            <p>Retrouvez le dashboard du stock DT à ce lien : 
                <span>
                <a href="${linkStock}" target="_blank" style="background-color: #73dced; color: white; padding: 7px 12px; text-decoration: none; border-radius: 5px;">
                    Cliquez ici !
                </a>
                </span>
            </p>
            <br><br>
            <p>Green - Pay vous remercie.</p>
            `;

            for (const superviseur of supervieurs) {
            await sendMail({
                to: superviseur.email,
                subject,
                html,
            });
            }
        }
        const livreurs = await prisma.users.findMany({
            where: { role_id: livraison_role },
        });

        if (livreurs && livreurs.length > 0) {
            const subject = "MODIFICATION DE STOCK";
            const html = `
            <p>Bonjour,</p>
            <p>Le Stock de ${nom_piece} a été modifié.</p>
            <ul>
                <li><strong>Stock initial:</strong> ${ancien_stock}</li>
                <li><strong>Nouveau Stock:</strong> ${nouvelle_quantite}</li>
            </ul>
            <ul>
            <li><strong>Initiateur:</strong> ${nom_utilisateur}</li>
            </ul>
            <p>Retrouvez le dashboard du stock DT à ce lien : 
                <span>
                <a href="${linkStock}" target="_blank" style="background-color: #73dced; color: white; padding: 7px 12px; text-decoration: none; border-radius: 5px;">
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
        }
        return res.status(200).json(updated_piece);
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: "Erreur lors de la mise à jour", error });
    }
}



const getAllStock = async (req, res) =>{
    try {
        const stock = await prisma.stock_dt.findMany({
            orderBy: { nom_piece: 'asc' },
        });

        res.status(200).json(stock);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du stock", error });
    }
}


// Augmenter la quantité d'un stock
const plusQte = async (req, res) =>{

}


// Diminuer la quantité d'un stock
const minusQte = async (req, res) =>{

}

module.exports = {
    setStock,
    getAllStock,
}
