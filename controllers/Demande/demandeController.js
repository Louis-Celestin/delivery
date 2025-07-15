const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../../config/clouddinaryConifg");
const { get } = require("http");

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("fr-FR");
};

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

// Faire une demande
// DEMANDE CHARGEURS POUR TPE SANS RI SUPPORT -> DT -> ORNELLA
// DEMANDE CHARGEUR ORNELLA -> DT
// DEMANDE PIECE DETACHEES ORNELLA -> DT
// DEMANDE TPE ORNELLA -> DT


const faireDemande = async (req, res) =>{
    try {
        const {
        produitsDemandes,
        commentaire,
        user_id,
        nom_demandeur,
        type_demande_id,
        role_demandeur,
        role_validateur,
        id_demandeur,
        qte_total_demande,
        motif_demande,

        } = req.body;

        // Correction ici : gestion de produitsDemandes (string JSON venant de form-data)
        const produits = typeof produitsDemandes === "string"
        ? JSON.parse(produitsDemandes)
        : produitsDemandes;
        
        const typeDemande = await prisma.stock_dt.findUnique({
            where: {
                id_piece: parseInt(type_demande_id)
            }
        })
        // const typeDemande = await prisma.type_demande.findUnique({
        // where: {
        //     type_demande_id: parseInt(type_demande_id)
        // }
        // });

        if (!typeDemande) {
        return res.status(404).json({ message: "Type de demande non trouvé" });
        }

        let utilisateur = null;
        utilisateur = await prisma.users.findUnique({
            where: {
            id_user: parseInt(user_id)
            }
        });

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Gestion de l'upload Cloudinary
        // const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        // folder: "greenpay/signatures",
        // });

        // const signature_demandeur = uploadResult.secure_url;

        // if (!signature_demandeur) {
        // return res.status(400).json({ message: "Vous devez fournir une signature du demandeur" });
        // }

        let final_type_demande_id = type_demande_id

        const nouvelleDemande = await prisma.demandes.create({
        data: {
            statut_demande: "en_cours",
            qte_total_demande: parseInt(qte_total_demande),
            produit_demande: JSON.stringify(produits),
            commentaire,
            nom_demandeur: nom_demandeur || null,
            date_demande: new Date(),
            signature_demandeur: 'signé',
            type_demande_id: parseInt(final_type_demande_id),
            user_id: utilisateur ? utilisateur.id_user : null,
            role_id_recepteur: parseInt(role_validateur),
            role_id_demandeur: parseInt(role_demandeur),
            id_demandeur: parseInt(id_demandeur) || null,
            motif_demande: motif_demande || null,
        }
        });

        const piece = await prisma.stock_dt.findUnique({
          where:{
            id_piece: parseInt(type_demande_id)
          }
        });


        // Gestion des mails
        let motif = motif_demande
        let demandeTypeName = piece.nom_piece.toUpperCase()

        let serviceDemandeur = '';
        let roleService;
        switch(parseInt(role_demandeur)) {
          case 7:
            serviceDemandeur = 'SUPPORT'
            roleService = support_role
            break;
          case 6:
            serviceDemandeur = 'MAINTENANCE'
            roleService = maintenance_role
            break;
          case 1:
            serviceDemandeur = 'LIVRAISON'
            roleService = livraison_role
            break;
        }

        let quantite = nouvelleDemande.qte_total_demande;
        let commentaire_mail = nouvelleDemande.commentaire ? nouvelleDemande.commentaire : '(sans commentaire)';
        const url = GENERAL_URL
        let demandeLink = `${url}/demande-supervision-details/${nouvelleDemande.id_demande}`;
        // const demandeLink = `https://livraisons.greenpayci.com/formulaire-recu/${nouvelleLivraison.id_demande}`
        const sendMail = require("../../utils/emailSender");
        const receivers = await prisma.users.findMany({
            where: { role_id: superviseur_role },
        });
        if (receivers && receivers.length > 0) {
            const subject = `NOUVELLE DEMANDE ${motif}`;
            const html = `
            <p>Bonjour,</p>
            <p>Une nouvelle demande a été enregistrée.</p>
            <ul>
              <li><strong>Type de demande:</strong> ${demandeTypeName}</li>
              <li><strong>Nombre de produits:</strong> ${quantite}</li>
            </ul>
            <ul>
              <li><strong>Service demandeur:</strong> ${serviceDemandeur}</li>
              <li><strong>Nom demandeur:</strong> ${nouvelleDemande.nom_demandeur}</li>
            </ul>
            <br>
            <p>Commentaire : ${commentaire_mail}<p>
            <br>
            <p>Retrouvez la demande à ce lien : 
                <span>
                <a href="${demandeLink}" target="_blank" style="background-color: #73dced; color: white; padding: 7px 12px; text-decoration: none; border-radius: 5px;">
                    Cliquez ici !
                </a>
                </span>
            </p>
            <br><br>
            <p>Green - Pay vous remercie.</p>
            `;
    
            for (const receiver of receivers) {
            await sendMail({
                to: receiver.email,
                subject,
                html,
            });
            }
        }

        // MAIL DE NOUVELLE DEMANDE AU SERVICE CONCERNE
        
        let demandeServiceLink = `${url}/demande-vue-details/${nouvelleDemande.id_demande}`;
        const service = await prisma.users.findMany({
            where: { role_id: roleService },
        });
      
        if (service && service.length > 0) {
            const subject = `NOUVELLE DEMANDE ${motif}`;
            const html = `
            <p>Bonjour,</p>
            <p>Une nouvelle demande a été enregistrée.</p>
            <ul>
                <li><strong>Type de demande:</strong> ${demandeTypeName}</li>
                <li><strong>Nombre de produits:</strong> ${quantite}</li>
            </ul>
            <ul>
                <li><strong>Service demandeur:</strong> ${serviceDemandeur}</li>
                <li><strong>Nom demandeur:</strong> ${nouvelleDemande.nom_demandeur}</li>
            </ul>
            <br>
            <p>Commentaire : ${commentaire_mail}<p>
            <br>
            <p>Retrouvez la demande à ce lien : 
                <span>
                <a href="${demandeServiceLink}" target="_blank" style="background-color: #73dced; color: white; padding: 7px 12px; text-decoration: none; border-radius: 5px;">
                    Cliquez ici !
                </a>
                </span>
            </p>
            <br><br>
            <p>Green - Pay vous remercie.</p>
            `;
    
            for (const agent of service) {
            await sendMail({
                to: agent.email,
                subject,
                html,
            });
            }
        }
  

        res.status(201).json({
        message: "Demande enregistrée avec succès",
        demandes: nouvelleDemande
        });

    } catch (error) {
        console.error("Erreur lors de la demande :", error);
        res.status(500).json({ message: "Erreur interne", error });
    } 
};

const getAllDemandes = async (req, res) =>{
    try {
      const demandes = await prisma.demandes.findMany({
        orderBy: { date_demande: 'desc' },
        include : {
          validation_demande : true
        }
      });
  
      res.status(200).json(demandes);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des demandes", error });
    }
};

const getOneDemande = async (req, res) =>{
    const { id } = req.params;
  
    try {
      const demandes = await prisma.demandes.findUnique({
        where: { id_demande: parseInt(id) },
        include: {
          validation_demande: true,
        }
      });
  
      if (!demandes) {
        return res.status(404).json({ message: "demande introuvable" });
      }
  
      res.status(200).json(demandes);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
}

const validateDemande = async (req, res) => {
    const {
        demande_id,
        commentaire,
        user_id,
    } = req.body;

    try {
    const demande = await prisma.demandes.findUnique({
        where: { id_demande: parseInt(demande_id) },
    });

    if (!demande) return res.status(404).json({ message: "Demande introuvable." });

    if (demande.statut_demande === "valide") {
        return res.status(400).json({ message: "Demande déjà validée." });
    }

    if (!req.file) {
        return res.status(400).json({ message: "Signature du validateur requise." });
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "greenpay/signatures",
    });
    const signature = uploadResult.secure_url;

    let final_nom_validateur;
    let final_date_validation;

    if (!user_id) return res.status(403).json({ message: "Utilisateur non authentifié." });

    const user = await prisma.users.findUnique({
        where: { id_user: parseInt(user_id) },
        include: { agents: true },
    });

    if (!user || !user.agents) {
        return res.status(404).json({ message: "Utilisateur ou agent non trouvé." });
    }

    final_nom_validateur = user.agents.nom;
    final_date_validation = new Date();
    
    const newValidation = await prisma.validation_demande.create({
        data: {
        id_demande: parseInt(demande_id),
        commentaire,
        id_user: user_id ? parseInt(user_id) : null,
        nom_validateur: final_nom_validateur,
        date_validation_demande: final_date_validation,
        signature,
        statut_validation_demande: "valide",
        },
    });

    await prisma.demandes.update({
        where: { id_demande: parseInt(demande_id) },
        data: { statut_demande: "valide" },
    });


    const piece = await prisma.stock_dt.findUnique({
      where:{
        id_piece: parseInt(demande.type_demande_id)
      }
    });

    // Gestion des mails
    let motif = demande.motif_demande
    let demandeTypeName = piece.nom_piece.toUpperCase()

    let serviceDemandeur = '';
    let roleService;
    switch(parseInt(demande.role_id_demandeur)) {
      case 7:
        serviceDemandeur = 'SUPPORT'
        roleService = support_role
        break;
      case 6:
        serviceDemandeur = 'MAINTENANCE'
        roleService = maintenance_role
        break;
      case 1:
        serviceDemandeur = 'LIVRAISON'
        roleService = livraison_role
        break;
    }

    let quantite = demande.qte_total_demande;
    let commentaire_mail = commentaire ? commentaire : '(sans commentaire)';
    const url = GENERAL_URL
    let demandeLink = `${url}/demande-details/${demande.id_demande}`;
    // const demandeLink = `https://livraisons.greenpayci.com/formulaire-recu/${nouvelleLivraison.id_demande}`
    const sendMail = require("../../utils/emailSender");
    const receivers = await prisma.users.findMany({
        where: { role_id: livraison_role },
    });
    if (receivers && receivers.length > 0) {
        const subject = `NOUVELLE DEMANDE ${motif}`;
        const html = `
        <p>Bonjour,</p>
        <p>La demande ${demande.id_demande} a été validée.</p>
        <ul>
          <li><strong>Type de demande:</strong> ${demandeTypeName}</li>
          <li><strong>Nombre de produits:</strong> ${quantite}</li>
        </ul>
        <ul>
          <li><strong>Service demandeur:</strong> ${serviceDemandeur}</li>
          <li><strong>Nom demandeur:</strong> ${demande.nom_demandeur}</li>
        </ul>
        <br>
        <p>Commentaire : ${commentaire_mail}<p>
        <br>
        <p>Retrouvez la demande à ce lien : 
            <span>
            <a href="${demandeLink}" target="_blank" style="background-color: #73dced; color: white; padding: 7px 12px; text-decoration: none; border-radius: 5px;">
                Cliquez ici !
            </a>
            </span>
        </p>
        <br><br>
        <p>Green - Pay vous remercie.</p>
        `;

        for (const receiver of receivers) {
        await sendMail({
            to: receiver.email,
            subject,
            html,
        });
        }
    }

    // MAIL DE DEMANDE VALIDEE AU SERVICE CONCERNE
    
    let demandeServiceLink = `${url}/demande-vue-details/${demande.id_demande}`;
    const service = await prisma.users.findMany({
        where: { role_id: roleService },
    });
  
    if (service && service.length > 0) {
        const subject = `NOUVELLE DEMANDE ${motif}`;
        const html = `
        <p>Bonjour,</p>
        <p>La demande ${demande.id_demande} a été validée.</p>
        <ul>
            <li><strong>Type de demande:</strong> ${demandeTypeName}</li>
            <li><strong>Nombre de produits:</strong> ${quantite}</li>
        </ul>
        <ul>
            <li><strong>Service demandeur:</strong> ${serviceDemandeur}</li>
            <li><strong>Nom demandeur:</strong> ${demande.nom_demandeur}</li>
        </ul>
        <br>
        <p>Commentaire : ${commentaire_mail}<p>
        <br>
        <p>Retrouvez la demande à ce lien : 
            <span>
            <a href="${demandeServiceLink}" target="_blank" style="background-color: #73dced; color: white; padding: 7px 12px; text-decoration: none; border-radius: 5px;">
                Cliquez ici !
            </a>
            </span>
        </p>
        <br><br>
        <p>Green - Pay vous remercie.</p>
        `;

        for (const agent of service) {
        await sendMail({
            to: agent.email,
            subject,
            html,
        });
        }
    }

    return res.status(201).json(newValidation);
    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
    }   
};

// Retourner une livraison
const returnDemande = async (req, res) => {
  const {
    demande_id,
    commentaire_return,
    user_id,
    type_demande_id,
  } = req.body;
  try {
    const demande = await prisma.demandes.findUnique({
      where: { id_demande: parseInt(demande_id) },
    });

    if (!demande) return res.status(404).json({ message: "Demande introuvable." });

    if (demande.statut_demande === "valide") {
      return res.status(400).json({ message: "Demande déjà validée." });
    }

    if (!commentaire_return) {
      return res.status(400).json({ message: "Commentaire de retour requis." });
    }

    let final_nom_validateur;
    let final_date_validation;

    if (!user_id) return res.status(403).json({ message: "Utilisateur non authentifié." });

      const user = await prisma.users.findUnique({
        where: { id_user: parseInt(user_id) },
        include: { agents: true },
      });

      if (!user || !user.agents) {
        return res.status(404).json({ message: "Utilisateur ou agent non trouvé." });
      }

      final_nom_validateur = user.agents.nom;
      final_date_validation = new Date();

    const newValidation = await prisma.validation_demande.create({
        data: {
        id_demande: parseInt(demande_id),
        commentaire: commentaire_return,
        id_user: user_id ? parseInt(user_id) : null,
        nom_validateur: final_nom_validateur,
        date_validation_demande: final_date_validation,
        signature: 'retournée',
        statut_validation_demande: "retourne",
        },
    });

    await prisma.demandes.update({
      where: { id_demande: parseInt(demande_id) },
      data: { statut_demande: 'retourne' },
    });

    const piece = await prisma.stock_dt.findUnique({
      where:{
        id_piece: parseInt(demande.type_demande_id)
      }
    });

    // Gestion des mails
    let motif = demande.motif_demande
    let demandeTypeName = piece.nom_piece.toUpperCase()

    let serviceDemandeur = '';
    let roleService;
    switch(parseInt(demande.role_id_demandeur)) {
      case 7:
        serviceDemandeur = 'SUPPORT'
        roleService = support_role
        break;
      case 6:
        serviceDemandeur = 'MAINTENANCE'
        roleService = maintenance_role
        break;
      case 1:
        serviceDemandeur = 'LIVRAISON'
        roleService = livraison_role
        break;
    }

    let quantite = demande.qte_total_demande;
    let commentaire_mail = commentaire_return ? commentaire_return : '(sans commentaire)';
    const url = GENERAL_URL
    let demandeLink = `${url}/demande-details/${demande.id_demande}`;
    // const demandeLink = `https://livraisons.greenpayci.com/formulaire-recu/${nouvelleLivraison.id_demande}`
    const sendMail = require("../../utils/emailSender");
    const receivers = await prisma.users.findMany({
        where: { role_id: livraison_role },
    });
    if (receivers && receivers.length > 0) {
        const subject = `RETOUR DEMANDE ${motif}`;
        const html = `
        <p>Bonjour,</p>
        <p>La demande ${demande.id_demande} a été retournée.</p>
        <ul>
          <li><strong>Type de demande:</strong> ${demandeTypeName}</li>
          <li><strong>Nombre de produits:</strong> ${quantite}</li>
        </ul>
        <ul>
          <li><strong>Service demandeur:</strong> ${serviceDemandeur}</li>
          <li><strong>Nom demandeur:</strong> ${demande.nom_demandeur}</li>
        </ul>
        <br>
        <p>Commentaire : ${commentaire_mail}<p>
        <br>
        <p>Retrouvez la demande à ce lien : 
            <span>
            <a href="${demandeLink}" target="_blank" style="background-color: #73dced; color: white; padding: 7px 12px; text-decoration: none; border-radius: 5px;">
                Cliquez ici !
            </a>
            </span>
        </p>
        <br><br>
        <p>Green - Pay vous remercie.</p>
        `;

        for (const receiver of receivers) {
        await sendMail({
            to: receiver.email,
            subject,
            html,
        });
        }
    }

    // MAIL DE DEMANDE RETOURNEE AU SERVICE CONCERNE
    
    let demandeServiceLink = `${url}/demande-vue-details/${demande.id_demande}`;
    const service = await prisma.users.findMany({
        where: { role_id: roleService },
    });
  
    if (service && service.length > 0) {
        const subject = `RETOUR DEMANDE ${motif}`;
        const html = `
        <p>Bonjour,</p>
        <p>La demande ${demande.id_demande} a été retournée.</p>
        <ul>
            <li><strong>Type de demande:</strong> ${demandeTypeName}</li>
            <li><strong>Nombre de produits:</strong> ${quantite}</li>
        </ul>
        <ul>
            <li><strong>Service demandeur:</strong> ${serviceDemandeur}</li>
            <li><strong>Nom demandeur:</strong> ${demande.nom_demandeur}</li>
        </ul>
        <br>
        <p>Commentaire : ${commentaire_mail}<p>
        <br>
        <p>Retrouvez la demande à ce lien : 
            <span>
            <a href="${demandeServiceLink}" target="_blank" style="background-color: #73dced; color: white; padding: 7px 12px; text-decoration: none; border-radius: 5px;">
                Cliquez ici !
            </a>
            </span>
        </p>
        <br><br>
        <p>Green - Pay vous remercie.</p>
        `;

        for (const agent of service) {
        await sendMail({
            to: agent.email,
            subject,
            html,
        });
        }
    }
    return res.status(201).json({ 
        message: "demande retournée avec succès.",
        newValidation, 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const cancelDemande = async (req, res) => {
  const {
    demande_id,
    commentaire_refus,
    user_id,
    type_demande_id,
  } = req.body;
  try {
    const demande = await prisma.demandes.findUnique({
      where: { id_demande: parseInt(demande_id) },
    });

    if (!demande) return res.status(404).json({ message: "Demande introuvable." });

    if (demande.statut_demande === "valide") {
      return res.status(400).json({ message: "Demande déjà validée." });
    }

    if (!commentaire_refus) {
      return res.status(400).json({ message: "Commentaire d'annulation requis." });
    }

    let final_nom_validateur;
    let final_date_validation;

    if (!user_id) return res.status(403).json({ message: "Utilisateur non authentifié." });

      const user = await prisma.users.findUnique({
        where: { id_user: parseInt(user_id) },
        include: { agents: true },
      });

      if (!user || !user.agents) {
        return res.status(404).json({ message: "Utilisateur ou agent non trouvé." });
      }

      final_nom_validateur = user.agents.nom;
      final_date_validation = new Date();

    const newValidation = await prisma.validation_demande.create({
        data: {
        id_demande: parseInt(demande_id),
        commentaire: commentaire_refus,
        id_user: user_id ? parseInt(user_id) : null,
        nom_validateur: final_nom_validateur,
        date_validation_demande: final_date_validation,
        signature: 'refusée',
        statut_validation_demande: "refuse",
        },
    });

    await prisma.demandes.update({
      where: { id_demande: parseInt(demande_id) },
      data: { statut_demande: 'refuse' },
    });

    const piece = await prisma.stock_dt.findUnique({
      where:{
        id_piece: parseInt(demande.type_demande_id)
      }
    });

    // Gestion des mails
    let motif = demande.motif_demande
    let demandeTypeName = piece.nom_piece.toUpperCase()

    let serviceDemandeur = '';
    let roleService;
    switch(parseInt(demande.role_id_demandeur)) {
      case 7:
        serviceDemandeur = 'SUPPORT'
        roleService = support_role
        break;
      case 6:
        serviceDemandeur = 'MAINTENANCE'
        roleService = maintenance_role
        break;
      case 1:
        serviceDemandeur = 'LIVRAISON'
        roleService = livraison_role
        break;
    }

    let quantite = demande.qte_total_demande;
    let commentaire_mail = commentaire_refus ? commentaire_refus : '(sans commentaire)';
    const url = GENERAL_URL
    let demandeLink = `${url}/demande-details/${demande.id_demande}`;
    // const demandeLink = `https://livraisons.greenpayci.com/formulaire-recu/${nouvelleLivraison.id_demande}`
    const sendMail = require("../../utils/emailSender");
    const receivers = await prisma.users.findMany({
        where: { role_id: livraison_role },
    });
    if (receivers && receivers.length > 0) {
        const subject = `REFUS DEMANDE ${motif}`;
        const html = `
        <p>Bonjour,</p>
        <p>La demande ${demande.id_demande} a été refusée.</p>
        <ul>
          <li><strong>Type de demande:</strong> ${demandeTypeName}</li>
          <li><strong>Nombre de produits:</strong> ${quantite}</li>
        </ul>
        <ul>
          <li><strong>Service demandeur:</strong> ${serviceDemandeur}</li>
          <li><strong>Nom demandeur:</strong> ${demande.nom_demandeur}</li>
        </ul>
        <br>
        <p>Commentaire : ${commentaire_mail}<p>
        <br>
        <p>Retrouvez la demande à ce lien : 
            <span>
            <a href="${demandeLink}" target="_blank" style="background-color: #73dced; color: white; padding: 7px 12px; text-decoration: none; border-radius: 5px;">
                Cliquez ici !
            </a>
            </span>
        </p>
        <br><br>
        <p>Green - Pay vous remercie.</p>
        `;

        for (const receiver of receivers) {
        await sendMail({
            to: receiver.email,
            subject,
            html,
        });
        }
    }

    // MAIL DE DEMANDE REFUSEE AU SERVICE CONCERNE
    
    let demandeServiceLink = `${url}/demande-vue-details/${demande.id_demande}`;
    const service = await prisma.users.findMany({
        where: { role_id: roleService },
    });
  
    if (service && service.length > 0) {
        const subject = `REFUS DEMANDE ${motif}`;
        const html = `
        <p>Bonjour,</p>
        <p>La demande ${demande.id_demande} a été refusée.</p>
        <ul>
            <li><strong>Type de demande:</strong> ${demandeTypeName}</li>
            <li><strong>Nombre de produits:</strong> ${quantite}</li>
        </ul>
        <ul>
            <li><strong>Service demandeur:</strong> ${serviceDemandeur}</li>
            <li><strong>Nom demandeur:</strong> ${demande.nom_demandeur}</li>
        </ul>
        <br>
        <p>Commentaire : ${commentaire_mail}<p>
        <br>
        <p>Retrouvez la demande à ce lien : 
            <span>
            <a href="${demandeServiceLink}" target="_blank" style="background-color: #73dced; color: white; padding: 7px 12px; text-decoration: none; border-radius: 5px;">
                Cliquez ici !
            </a>
            </span>
        </p>
        <br><br>
        <p>Green - Pay vous remercie.</p>
        `;

        for (const agent of service) {
        await sendMail({
            to: agent.email,
            subject,
            html,
        });
        }
    }
    return res.status(201).json({
        message: "demande refusée avec succès.",
        newValidation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const updateDemande = async (req, res) => {
  const { id } = req.params;
  const {
      produitsDemandes,
      commentaire,
      type_demande_id,
      user_id,
      nom_demandeur,
      role_demandeur,
      role_validateur,
      id_demandeur,
      qte_total_demande,
      motif_demande,
  } = req.body;

  try {
    // Données à mettre à jour
    const produits = typeof produitsDemandes === "string"
    ? JSON.parse(produitsDemandes)
    : produitsDemandes;

    let utilisateur = null;
  
    utilisateur = await prisma.users.findUnique({
      where: {
        id_user: parseInt(user_id)
      }})
  

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  
    const dataToUpdate = {
      statut_demande: "en_cours",
      produit_demande: typeof produitsDemandes === "string" ? produitsDemandes : JSON.stringify(produitsDemandes),
      commentaire,
      nom_demandeur: nom_demandeur || null,
      type_demande_id,
      date_demande: new Date(),
      qte_total_demande: parseInt(qte_total_demande),
      user_id: utilisateur ? utilisateur.id_user : null,
      role_id_recepteur: parseInt(role_validateur),
      role_id_demandeur: parseInt(role_demandeur),
      id_demandeur: parseInt(id_demandeur) || null,
      motif_demande: motif_demande || null,
    };

    const updated = await prisma.demandes.update({
        where: { id_demande: parseInt(id) },
        data: dataToUpdate
    });

    const piece = await prisma.stock_dt.findUnique({
      where:{
        id_piece: parseInt(type_demande_id)
      }
    });

    // Gestion des mails
    let motif = motif_demande
    let demandeTypeName = piece.nom_piece.toUpperCase()

    let serviceDemandeur = '';
    let roleService;
    switch(parseInt(role_demandeur)) {
      case 7:
        serviceDemandeur = 'SUPPORT'
        roleService = support_role
        break;
      case 6:
        serviceDemandeur = 'MAINTENANCE'
        roleService = maintenance_role
        break;
      case 1:
        serviceDemandeur = 'LIVRAISON'
        roleService = livraison_role
        break;
    }

    let quantite = updated.qte_total_demande;
    let commentaire_mail = updated.commentaire ? updated.commentaire : '(sans commentaire)';
    const url = GENERAL_URL
    let demandeLink = `${url}/demande-supervision-details/${updated.id_demande}`;
    // const demandeLink = `https://livraisons.greenpayci.com/formulaire-recu/${nouvelleLivraison.id_demande}`
    const sendMail = require("../../utils/emailSender");
    const receivers = await prisma.users.findMany({
        where: { role_id: superviseur_role },
    });
    if (receivers && receivers.length > 0) {
        const subject = `MODIFICATION DEMANDE ${motif}`;
        const html = `
        <p>Bonjour,</p>
        <p>La demande ${updated.id_demande} a été modifiée.</p>
        <ul>
          <li><strong>Type de demande:</strong> ${demandeTypeName}</li>
          <li><strong>Nombre de produits:</strong> ${quantite}</li>
        </ul>
        <ul>
          <li><strong>Service demandeur:</strong> ${serviceDemandeur}</li>
          <li><strong>Nom demandeur:</strong> ${updated.nom_demandeur}</li>
        </ul>
        <br>
        <p>Commentaire : ${commentaire_mail}<p>
        <br>
        <p>Retrouvez la demande à ce lien : 
            <span>
            <a href="${demandeLink}" target="_blank" style="background-color: #73dced; color: white; padding: 7px 12px; text-decoration: none; border-radius: 5px;">
                Cliquez ici !
            </a>
            </span>
        </p>
        <br><br>
        <p>Green - Pay vous remercie.</p>
        `;

        for (const receiver of receivers) {
        await sendMail({
            to: receiver.email,
            subject,
            html,
        });
        }
    }

    // MAIL DE NOUVELLE DEMANDE AU SERVICE CONCERNE
    
    let demandeServiceLink = `${url}/demande-vue-details/${updated.id_demande}`;
    const service = await prisma.users.findMany({
        where: { role_id: roleService },
    });
  
    if (service && service.length > 0) {
        const subject = `MDOFICATION DEMANDE ${motif}`;
        const html = `
        <p>Bonjour,</p>
        <p>La demande ${updated.id_demande} a été modifiée.</p>
        <ul>
            <li><strong>Type de demande:</strong> ${demandeTypeName}</li>
            <li><strong>Nombre de produits:</strong> ${quantite}</li>
        </ul>
        <ul>
            <li><strong>Service demandeur:</strong> ${serviceDemandeur}</li>
            <li><strong>Nom demandeur:</strong> ${updated.nom_demandeur}</li>
        </ul>
        <br>
        <p>Commentaire : ${commentaire_mail}<p>
        <br>
        <p>Retrouvez la demande à ce lien : 
            <span>
            <a href="${demandeServiceLink}" target="_blank" style="background-color: #73dced; color: white; padding: 7px 12px; text-decoration: none; border-radius: 5px;">
                Cliquez ici !
            </a>
            </span>
        </p>
        <br><br>
        <p>Green - Pay vous remercie.</p>
        `;

        for (const agent of service) {
        await sendMail({
            to: agent.email,
            subject,
            html,
        });
        }
    }

      return res.status(200).json(updated);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur lors de la mise à jour", error });
  }
};

const generateDemandePDF = async (req, res) => {
    const { id } = req.params;
  
    try {
      const data = await prisma.demandes.findUnique({
        where: { id_demande: parseInt(id) },
        include: {
          validation_demande: true,
        }
      });

      console.log(data)
  
      if (!data) return res.status(404).json({ message: "Demande introuvable" });
      if (data.validation_demande.length < 1) return res.status(400).json({ message: "Aucune validation trouvée" });
  
      const demande = {
        ...data,
        produitsDemandes: typeof data.produit_demande === "string"
          ? JSON.parse(data.produit_demande)
          : data.produit_demande
      };
      
      const piece = await prisma.stock_dt.findUnique({
        where: {
          id_piece: parseInt(demande.type_demande_id)
        }
      })
      // 🔎 Récupération de l'agent qui a fait la demande (si user_id défini)
      let nomDemandeur = "N/A";
      // console.log(demande)
      if (demande.nom_demandeur) {
        // ✅ Ancienne demande ou nom fourni manuellement
        nomDemandeur = demande.nom_demandeur;
      } else if (demande.user_id) {
        const user = await prisma.users.findUnique({
          where: { id_user: demande.user_id }
        });
  
        if (user?.agent_id) {
          const agent = await prisma.agents.findUnique({
            where: { id: user.agent_id }
          });
          if (agent?.nom) {
            nomDemandeur = agent.nom;
          }
        }
      }
      let service_demandeur = "N/A"
      if(demande.role_id_demandeur == 7){
        service_demandeur = 'SUPPORT'
      } else if(demande.role_id_demandeur == 6){
        service_demandeur = 'MAINTENANCE'
      }
  
      // 🗺️ Sélection du template
      const templatesMap = {
        1: "demande_DT.html",
      };
  
      const templateFile = templatesMap[1];
      if (!templateFile) return res.status(400).json({ message: "Type de demande inconnu" });
  
      const filePath = path.join(__dirname, "../../statics/templates/", templateFile);
      let html = fs.readFileSync(filePath, "utf8");
      
      let produits = JSON.parse(data.produit_demande)
      let quantite = produits.quantite
      let stock_initial = produits.stockDepart
      let stock_final = stock_initial - quantite
      // 🧱 Construction du tableau
      // const produitsRows = demande.produitsDemandes.map((p, index) => {
      //   let row = "";
      //   switch (demande.type_demande_id) {
      //     case 1:
      //       row = `<tr><td>${p.pointMarchand || p.marchand} - ${p.caisse}</td><td>${p.serialNumber || p.sn}</td></tr>`;
      //       break;
      //     default:
      //       row = "";
      //   }
      
      //   // ➕ Ajout du saut de page toutes les 20 lignes
      //   if ((index + 1) % 20 === 0) {
      //     row += `<tr class="page-break"></tr>`;
      //   }
      
      //   return row;
      // }).join("\n");
      
      // console.log(demande.validations[0].signature)
      // 🧩 Remplacement des balises HTML

      let index = demande.validation_demande.length-1
      html = html
        .replace("{{commentaire}}", demande.commentaire || "")
        .replace("{{date_demande}}", formatDate(demande.date_demande))
        .replace("{{pieces_demandees}}", piece.nom_piece.toUpperCase())
        .replace("{{motif_demande}}", demande.motif_demande)
        // .replace("{{qte_total_demande}}", demande.qte_total_demande || demande.produit_demande.length)
        .replace("{{nom_validateur}}", demande.validation_demande[index].nom_validateur || "Validateur")
        .replace("{{nom_demandeur}}", nomDemandeur || "Demandeur")
        .replace("{{service_demandeur}}", service_demandeur || "Validateur")
        .replace("{{quantite}}", quantite)
        .replace("{{stock_initial}}", stock_initial)
        .replace("{{stock_final}}", stock_final)
        .replace("{{signature}}", demande.validation_demande[index].signature || "Validé")
        .replace("{{date_validation_demande}}", demande.validation_demande[index].date_validation_demande ? formatDate(demande.validation_demande[index].date_validation_demande) : "N/A")

      // 🖨️ Génération PDF
      const browser = await puppeteer.launch({ headless: "new", args : ["--no-sandbox", "--disable-setuid-sandbox"] });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });
  
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });
  
      await browser.close();
  
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=demande_${demande.id_demande}.pdf`
      });
  
      return res.send(pdfBuffer);
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur lors de la génération du PDF" });
    }
};

  



module.exports = {
    faireDemande,
    getAllDemandes,
    getOneDemande,
    validateDemande,
    returnDemande,
    cancelDemande,
    updateDemande,
    generateDemandePDF,
}