const TEST_ENV = require("../../utils/consts")
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../../config/clouddinaryConifg");
const { type } = require("os");
const { sign } = require("crypto");
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
if(test_env){
  GENERAL_URL = localUrl
}

const deliver = async (req, res) => {
  try {
    const {
      produitsLivre,
      commentaire,
      user_id,
      type_livraison_id,
      isAncienne,
      service_recepteur,
      role_recepteur,
    } = req.body;

    // Correction ici : gestion de produitsLivre (string JSON venant de form-data)
    const produits = typeof produitsLivre === "string"
      ? JSON.parse(produitsLivre)
      : produitsLivre;

    // Correction ici : isAncienne arrive en string depuis form-data => on convertit en bool
    const isAncienneBool = (isAncienne === 'true' || isAncienne === true);

    const typeLivraison = await prisma.type_livraison_commerciale.findUnique({
      where: {
        id_type_livraison: parseInt(type_livraison_id)
      }
    });

    if (!typeLivraison) {
      return res.status(404).json({ message: "Type de livraison non trouvé" });
    }

    let utilisateur = null;
    if (!isAncienneBool) {
      utilisateur = await prisma.users.findUnique({
        where: {
          id_user: parseInt(user_id)
        }
      });

      if (!utilisateur) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
    }

    // Gestion de l'upload Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "greenpay/signatures",
    });

    const signature_expediteur = uploadResult.secure_url;

    if (!signature_expediteur) {
      return res.status(400).json({ message: "Vous devez fournir une signature d'expéditeur." });
    }

    const nouvelleLivraison = await prisma.livraison.create({
      data: {
        statut_livraison: "en_cours",
        qte_totale_livraison: produits.length,
        produitsLivre: JSON.stringify(produits),
        commentaire,
        nom_livreur: utilisateur.fullname || null,
        date_livraison: new Date(),
        deleted: false,
        type_livraison_id: parseInt(type_livraison_id),
        user_id: utilisateur ? utilisateur.id_user : null,
        signature_expediteur: signature_expediteur || null,
        service_id: parseInt(service_recepteur),
        role_id: role_recepteur ? parseInt(role_recepteur) : null,
      }
    });

    /******************************** GESTION DES MAILS  ***********************************/



    let livraisonTypeName = typeLivraison.nom_type_livraison.toUpperCase();

    const service = await prisma.services.findUnique({
      where:{
        id: parseInt(service_recepteur)
      }
    })

    const userService = await prisma.user_services.findMany({
      where:{
        service_id: parseInt(service_recepteur)
      },
      include:{
        users: true
      }
    })
    
    let recepteurs
    if(role_recepteur){
      const userRole = await prisma.user_roles.findMany({
        where:{
          role_id: parseInt(role_recepteur)
        },
        include:{
          users: true
        }
      })
      recepteurs = userRole.map(us => us.users)
    }else{
      const userRole = await prisma.user_roles.findMany({
        where:{
          role_id: 2
        },
        include:{
          users: true
        }
      })
      recepteurs = userRole.map(us => us.users)
    }

    const supervisionRole = await prisma.user_roles.findMany({
      where:{
        role_id: 13
      },
      include:{
        users: true
      }
    })
            
    const service_users = userService.map(us => us.users)
    const superviseurs = supervisionRole.map(us => us.users)

    let serviceDemandeur = service.nom_service.toUpperCase();

    const url = GENERAL_URL
    let deliveryLink = `${url}/formulaire-recu/${nouvelleLivraison.id_livraison}`;

    
    const commentaire_mail = commentaire ? commentaire : '(sans commentaire)' 
    if ((service_users && service_users.length > 0) || (recepteurs && recepteurs.length > 0) ) {
      const subject = `NOUVELLE LIVRAISON (${livraisonTypeName})`;
      const html = `
        <p>Bonjour,</p>
        <p>Une nouvelle livraison a été enregistrée.</p>
        <ul>
          <li><strong>Type de livraison:</strong> ${livraisonTypeName}</li>
          <li><strong>Nombre de produits:</strong> ${produits.length}</li>
        </ul>
        <br>
          <p>Commentaire : ${commentaire_mail}<p>
        <br>
        <p>Retrouvez la livraison à ce lien : 
          <span>
            <a href="${deliveryLink}" target="_blank" style="background-color: #73dced; color: white; padding: 7px 12px; text-decoration: none; border-radius: 5px;">
              Cliquez ici !
            </a>
          </span>
        </p>
        <br><br>
        <p>Green - Pay vous remercie.</p>
      `;

      for (const service_user of service_users) {
        await sendMail({
          to: service_user.email,
          subject,
          html,
        });
      }
      for (const recepteur of recepteurs) {
        await sendMail({
          to: recepteur.email,
          subject,
          html,
        });
      }
      if (superviseurs){
        for (const superviseur of superviseurs) {
        await sendMail({
          to: superviseur.email,
          subject,
          html,
        });
      }
      }
    }

    res.status(201).json({
      message: "Livraison enregistrée avec succès",
      livraison: nouvelleLivraison
    });

  } catch (error) {
    console.error("Erreur lors de la livraison :", error);
    res.status(500).json({ message: "Erreur interne", error });
  }
};

const getAllLivraisons = async (req, res) => {
  try {
    const livraisons = await prisma.livraison.findMany({
      where: { deleted: false },
      orderBy: { date_livraison: 'desc' },
      include : {
        validations : true
      }
    });

    res.status(200).json(livraisons);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des livraisons", error });
  }
};
    
const getOneLivraison = async (req, res) => {
    const { id } = req.params;
  
    try {
      const livraison = await prisma.livraison.findUnique({
        where: { id_livraison: parseInt(id) },
        include: {
          validations: true,
        }
      });
  
      if (!livraison || livraison.deleted) {
        return res.status(404).json({ message: "Livraison introuvable" });
      }
  
      res.status(200).json(livraison);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
};



/* 
  Modification de la fonction updateLivraison. Les données à update: produitsLivre, commentaire, type_livraison_id, 
  date_livraison, qte_totale_livraison
*/
const updateLivraison = async (req, res) => {
  const { id } = req.params;
  const {
    produitsLivre,
    commentaire,
    type_livraison_id,
    user_id,
    service_recepteur,
    role_recepteur,
  } = req.body;

  try {
    const produits = typeof produitsLivre === "string"
    ? JSON.parse(produitsLivre)
    : produitsLivre;
    
    let utilisateur = null;
    
    utilisateur = await prisma.users.findUnique({
      where: {
        id_user: parseInt(user_id)
      }
    })
    
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const typeLivraison = await prisma.type_livraison_commerciale.findUnique({
      where: {
        id_type_livraison: parseInt(type_livraison_id)
      }
    });

    if (!typeLivraison) {
      return res.status(404).json({ message: "Type de livraison non trouvé" });
    }
    
    // Données à mettre à jour
    const dataToUpdate = {
      produitsLivre: typeof produitsLivre === "string" ? produitsLivre : JSON.stringify(produitsLivre),
      commentaire,
      statut_livraison: 'en_cours',
      type_livraison_id: parseInt(type_livraison_id),
      date_livraison: new Date(),
      qte_totale_livraison: produits.length,
      user_id: utilisateur ? utilisateur.id_user : null,
      nom_livreur: utilisateur.fullname,
      service_id: parseInt(service_recepteur),
      role_id: parseInt(role_recepteur),
    };

    // Mise à jour de la livraison
    const updated = await prisma.livraison.update({
      where: { id_livraison: parseInt(id) },
      data: dataToUpdate
    });


    /********************************       GESTION DES MAILS       ***********************************/


    let livraisonTypeName = typeLivraison.nom_type_livraison.toUpperCase();

    const service = await prisma.services.findUnique({
      where:{
        id: parseInt(service_recepteur)
      }
    })

    const userService = await prisma.user_services.findMany({
      where:{
        service_id: parseInt(service_recepteur)
      },
      include:{
        users: true
      }
    })
    
    let recepteurs
    if(role_recepteur){
      const userRole = await prisma.user_roles.findMany({
        where:{
          role_id: parseInt(role_recepteur)
        },
        include:{
          users: true
        }
      })
      recepteurs = userRole.map(us => us.users)
    }else{
      const userRole = await prisma.user_roles.findMany({
        where:{
          role_id: 2
        },
        include:{
          users: true
        }
      })
      recepteurs = userRole.map(us => us.users)
    }

    const supervisionRole = await prisma.user_roles.findMany({
      where:{
        role_id: 13
      },
      include:{
        users: true
      }
    })
            
    const service_users = userService.map(us => us.users)
    const superviseurs = supervisionRole.map(us => us.users)

    let serviceDemandeur = service.nom_service.toUpperCase();

    const url = GENERAL_URL
    let deliveryLink = `${url}/formulaire/${updated.id_livraison}`;

    const commentaire_mail = commentaire ? commentaire : '(sans commentaire)' 
    if ((service_users && service_users.length > 0) || (recepteurs && recepteurs.length > 0) ) {
      const subject = `MODIFICATION LIVRAISON (${livraisonTypeName})`;
      const html = `
        <p>Bonjour,</p>
        <p>La livraison ${updated.id_livraison} a été modifiée.</p>
        <ul>
          <li><strong>Type de livraison:</strong> ${livraisonTypeName}</li>
          <li><strong>Nombre de produits:</strong> ${produits.length}</li>
        </ul>
        <br>
          <p>Commentaire : ${commentaire_mail}<p>
        <br>
        <p>Retrouvez la livraison à ce lien : 
          <span>
            <a href="${deliveryLink}" target="_blank" style="background-color: #73dced; color: white; padding: 7px 12px; text-decoration: none; border-radius: 5px;">
              Cliquez ici !
            </a>
          </span>
        </p>
        <br><br>
        <p>Green - Pay vous remercie.</p>
      `;

      for (const service_user of service_users) {
        await sendMail({
          to: service_user.email,
          subject,
          html,
        });
      }
      for (const recepteur of recepteurs) {
        await sendMail({
          to: recepteur.email,
          subject,
          html,
        });
      }
      if (superviseurs){
        for (const superviseur of superviseurs) {
        await sendMail({
          to: superviseur.email,
          subject,
          html,
        });
      }
      }
    }

    return res.status(200).json(updated);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur lors de la mise à jour", error });
  }
};
  
const deleteLivraison = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deleted = await prisma.livraison.update({
        where: { id_livraison: parseInt(id) },
        data: {
          deleted: true,
          date_deleted: new Date()
        }
      });
  
      res.status(200).json({ message: "Livraison supprimée (soft delete)", deleted });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression", error });
    }
};

/* Ajout d'une fonction deliverOld specialement pour les livraisons anciennes */
const deliverOld = async (req, res) => {
  const {
    produitsLivre,
    commentaire,
    user_id,
      nom_livreur,
      nom_validateur,
      type_livraison_id,
      isAncienne,
      date_livraison
    } = req.body;
  
    try {

      // Verification de l'agent livreur
      const produits = typeof produitsLivre === "string"
        ? JSON.parse(produitsLivre)
        : produitsLivre;
  
      const typeLivraison = await prisma.typeLivraison.findUnique({
        where: {
          id_type_livraison: parseInt(type_livraison_id)
        }
      });
  
      if (!typeLivraison) {
        return res.status(404).json({ message: "Type de livraison non trouvé" });
      }  
      let utilisateur = null;
      if (!isAncienne) {
        utilisateur = await prisma.users.findUnique({
          where: {
            id_user: parseInt(user_id)
          }
        });
  
        if (!utilisateur) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
      }

      const signature_expediteur = null
  
      const nouvelleLivraison = await prisma.livraison.create({
        data: {
          signature_expediteur: 'Validé',
          statut_livraison: "livre",
          qte_totale_livraison: produits.length,
          produitsLivre: JSON.stringify(produits),
          commentaire,
          nom_livreur: nom_livreur || null,
          date_livraison: isAncienne && date_livraison
            ? new Date(date_livraison)
            : new Date(),
          deleted: false,
          type_livraison_id: parseInt(type_livraison_id),
          user_id: utilisateur ? utilisateur.id_user : null,
        }
      });
  
      // Si c’est une livraison de chargeurs, on traite les transactions
      if (parseInt(type_livraison_id) === 5) {
        for (const item of produits) {
          const chargeur = await prisma.chargeurs.findUnique({
            where: {
              id_chargeur: parseInt(1)
            }
          });
  
          if (!chargeur) {
            continue; // on ignore les chargeurs non trouvés
          }
  
          const quantite = parseInt(item.quantite || 1);
  
          // Créer la transaction (type sortie)
          await prisma.transactions.create({
            data: {
              type_transaction: "sortie",
              quantite,
              date_transaction: new Date(),
              chargeurs : {connect : {
                id_chargeur : parseInt(1)
              }},
              users: utilisateur ? {connect : {
                id_user : parseInt(utilisateur.id_user)
              }} : null
            }
          }).then((resultats)=>{
            console.log(resultats)
          }).catch(err=>{console.log(err)})
  
          // Mettre à jour le stock
          await prisma.chargeurs.update({
            where: { id_chargeur: parseInt(1) },
            data: {
              stock: {
                decrement: quantite
              }
            }
          });
        }
      }

      let final_nom_validateur = nom_validateur;
      let final_date_validation = new Date(date_livraison);

      const newValidation = await prisma.validations.create({
      data: {
        livraison_id: parseInt(nouvelleLivraison.id_livraison),
        commentaire,
        user_id: null,
        nom_recepteur: final_nom_validateur,
        date_validation: final_date_validation,
        signature: null,
      },
    });

      res.status(201).json({
        message: "Livraison enregistrée avec succès",
        livraison: nouvelleLivraison,
        newValidation
      });
  
    } catch (error) {
      console.error("Erreur lors de la livraison :", error);
      res.status(500).json({ message: "Erreur interne", error });
    }
};

const deliverStock = async (req, res) => {
  try {
    const {
      commentaire,
      user_id,
      type_livraison_id,
      demande_id,
      quantite,
      service_reception,
      role_reception,
      otherFields,
    } = req.body;

    const typeLivraison = await prisma.stock_dt.findUnique({
      where: {
        id_piece: parseInt(type_livraison_id)
      }
    });

    if (!typeLivraison) {
      return res.status(404).json({ message: "Type de pièce non trouvée" });
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
    let nomLivreur = utilisateur.fullname

    // Gestion de l'upload Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "greenpay/signatures",
    });

    const signature_expediteur = uploadResult.secure_url;

    if (!signature_expediteur) {
      return res.status(400).json({ message: "Vous devez fournir une signature d'expéditeur." });
    }

    const autres = typeof otherFields === "string"
    ? JSON.parse(otherFields)
    : otherFields

    const nouvelleLivraison = await prisma.Livraisons.create({
      data: {
        user_id: utilisateur ? utilisateur.id_user : null,
        quantite_livraison: parseInt(quantite),
        nom_livreur: nomLivreur ? nomLivreur : null,
        commentaire_livraison : commentaire,
        signature_expediteur: signature_expediteur ? signature_expediteur : null,
        type: "livraison_piece",
        statut_livraison: "en_cours",
        role_id: role_reception ? parseInt(role_reception) : null,
        service_id: service_reception ? parseInt(service_reception) : null,
        date_livraison: new Date(),
        autres_champs_livraison: JSON.stringify(autres),

        livraison_piece: {
          create: {
            piece_id: parseInt(type_livraison_id),
            demande_id: parseInt(demande_id),
          }
        }
      },
      include:{
        livraison_piece: true
      }
    });

    await prisma.demandes.update({
      where: { id_demande: parseInt(demande_id)},
      data: { demande_livree : true},
    })


    // *********** GESTION DES MAILS ************

    const piece = await prisma.stock_dt.findUnique({
      where:{
        id_piece: parseInt(type_livraison_id)
      }
    });

    const service = await prisma.services.findUnique({
      where:{
        id: parseInt(service_reception)
      }
    })

    const userService = await prisma.user_services.findMany({
      where:{
        service_id: parseInt(service_reception)
      },
      include:{
        users: true
      }
    })

    const userRole = await prisma.user_roles.findMany({
      where:{
        role_id: 12
      },
      include:{
        users: true
      }
    })
    let recepteurs = userRole.map(us => us.users)
    const service_users = userService.map(us => us.users)

    let livraisonTypeName = piece.nom_piece.toUpperCase();
    let serviceReception = service.nom_service.toUpperCase();
    let quantiteProduits = quantite
    let commentaire_mail = commentaire ? commentaire : "(Sans commentaire)"
    
    const url = GENERAL_URL
    const deliveryLink = `${url}/demande-details/${demande_id}`;

    if ((recepteurs && recepteurs.length > 0) || (service_users && service_users.length > 0)) {
      const subject = `NOUVELLE LIVRAISON ${livraisonTypeName}`;
      const html = `
        <p>Bonjour,</p>
        <p>Une nouvelle livraison a été enregistrée.</p>
        <ul>
          <li><strong>Type de livraison:</strong> ${livraisonTypeName}</li>
          <li><strong>Nombre de produits:</strong> ${quantiteProduits}</li>
          <li><strong>Service:</strong> ${serviceReception}</li>
        </ul>
        <br>
          <p>Commentaire : ${commentaire_mail}<p>
        <br>
        <p>Retrouvez la livraison à ce lien : 
          <span>
            <a href="${deliveryLink}" target="_blank" style="background-color: #73dced; color: white; padding: 7px 12px; text-decoration: none; border-radius: 5px;">
              Cliquez ici !
            </a>
          </span>
        </p>
        <br><br>
        <p>Green - Pay vous remercie.</p>
      `;

      for (const recepteur of recepteurs) {
        await sendMail({
          to: recepteur.email,
          subject,
          html,
        });
      }
      for (const service_user of service_users) {
        await sendMail({
          to: service_user.email,
          subject,
          html,
        });
      }
    }

    res.status(201).json({
      message: "Livraison enregistrée avec succès",
      livraison: nouvelleLivraison
    });

  } catch (error) {
    console.error("Erreur lors de la livraison :", error);
    res.status(500).json({ message: "Erreur interne", error });
  }
};

const getAllTypeLivraisonCommerciale = async (req, res) => {
  try {
    const typeLivraison = await prisma.type_livraison_commerciale.findMany({
        orderBy: { nom_type_livraison: 'asc' },
    });

    res.status(200).json(typeLivraison);
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des types de livraison", error });
  }
}

const getAllStockDeliveries = async (req, res) => {
  try {
    const stockDeliveries = await prisma.livraison_piece.findMany({
      include: {
        Livraisons: {
          include: {
            reception_livraison: true
          }
        }
      }
    })

    res.status(200).json(stockDeliveries);
  } catch (error){
    res.status(500).json({ message: "Erreur lors de la récupération de toutes les livraisons de pièces", error});
  }
}

const getOneLivraisonDemande = async (req, res) => {
  const { id } = req.params;
  try {
    const livraison = await prisma.livraison_piece.findFirst({
      where: { demande_id: parseInt(id) },
      include: {
        Livraisons: {
          include: {
            reception_livraison: true
          }
        }
      }
    });

    if (!livraison) {
      return res.status(404).json({ message: "Livraison introuvable" });
    }

    res.status(200).json(livraison);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
}

const receiveStock = async (req, res) => {
  const {
    livraison_id,
    commentaire,
    user_id,
  } = req.body;
  try{

    const livraison = await prisma.livraison_piece.findUnique({
      where: { id: parseInt(livraison_id) },
      include: { 
        Livraisons: true
      }
    })

    if (!livraison){
      return res.status(404).json({ message: "Livraison introuvable." });
    }
    if (livraison.Livraisons.statut_livraison === "livre") {
      return res.status(400).json({ message: "Livraison déjà livrée." });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Signature du récepteur requise." });
    }
  
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "greenpay/signatures",
    });
    const signature = uploadResult.secure_url;

    if (!user_id) return res.status(403).json({ message: "Utilisateur non authentifié." });

    const utilisateur = await prisma.users.findUnique({
      where: { id_user: parseInt(user_id) },
    });

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    let nom_recepteur = utilisateur.fullname

    const newReception = await prisma.reception_livraison.create({
      data: {
        livraison_id : parseInt(livraison_id),
        date_reception: new Date(),
        user_id : parseInt(user_id),
        nom_recepteur,
        commentaire_reception: commentaire,
        signature_recepteur: signature? signature : '',
        statut_reception: 'recu',
      }
    })

    await prisma.Livraisons.update({
      where: { id: livraison.id },
      data: { statut_livraison: "livre" },
      include: {
        livraison_piece : true
      }
    })
    
    const piece = await prisma.stock_dt.findUnique({
      where:{
        id_piece: livraison.piece_id
      }
    });

    await prisma.stock_dt.update({
      where:{
        id_piece: livraison.piece_id
      },
      data: {
        quantite: piece.quantite - livraison.Livraisons.quantite_livraison
      }
    }) 


    // *********** GESTION DES MAILS ************


    const service = await prisma.services.findUnique({
      where:{
        id: parseInt(livraison.Livraisons.service_id)
      }
    })

    const userRole = await prisma.user_roles.findMany({
      where:{
        role_id: 1
      },
      include:{
        users: true
      }
    })
    let livreurs = userRole.map(us => us.users)

    let livraisonTypeName = piece.nom_piece.toUpperCase();
    let quantiteProduits = livraison.Livraisons.quantite_livraison
    let commentaire_mail = commentaire ? commentaire : "(Sans commentaire)"
    let serviceReception = service.nom_service.toUpperCase();
    
    const url = GENERAL_URL
    const deliveryLink = `${url}/demande-details/${livraison.demande_id}`;

    if ((livreurs && livreurs.length > 0)) {
      const subject = `NOUVELLE LIVRAISON ${livraisonTypeName}`;
      const html = `
        <p>Bonjour,</p>
        <p>La livraison de stock ${livraison.id} a été réceptionnée.</p>
        <ul>
          <li><strong>Type de livraison:</strong> ${livraisonTypeName}</li>
          <li><strong>Nombre de produits:</strong> ${quantiteProduits}</li>
          <li><strong>Service:</strong> ${serviceReception}</li>
        </ul>
        <br>
          <p>Commentaire : ${commentaire_mail}<p>
        <br>
        <p>Retrouvez la livraison à ce lien : 
          <span>
            <a href="${deliveryLink}" target="_blank" style="background-color: #73dced; color: white; padding: 7px 12px; text-decoration: none; border-radius: 5px;">
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

    return res.status(201).json(newReception);

  } catch (error){
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}

const addDeliveryType = async (req, res) => {
  try{
    const {
      typeLivraison,
      user_id,
    } = req.body

    let existingType = await prisma.type_livraison_commerciale.findFirst({
      where: {
        nom_type_livraison: typeLivraison
      }
    })
    if(existingType){
      console.log("Type de livraison déjà existant")
      return res.status(400).json({ message: "Type de livraison déjà existant" });
    }
    let utilisateur = null;
    utilisateur = await prisma.users.findUnique({
      where: {
        id_user: parseInt(user_id)
      }
    });
    if (!utilisateur) {
      console.log("Utilisateur non trouvé")
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    let nomUser = utilisateur.fullname

    const nouveauTypeLivraison = await prisma.type_livraison_commerciale.create({
      data:{
        nom_type_livraison: typeLivraison,
        created_by: nomUser,
      }
    })

    res.status(201).json({
      message: "Type de livraison enregistrée avec succès",
      type_livraison_commerciale: nouveauTypeLivraison
    });
  } catch (error) {
    console.log("Erreur lors de la création :", error);
    res.status(500).json({ message: "Erreur interne", error });
  }
}

const getOneTypeLivraison = async (req, res) => {
  const { id } = req.params;
  try{
    const typeLivraison = await prisma.type_livraison_commerciale.findUnique({
      where: {
        id_type_livraison: parseInt(id)
      }
    })
    if (!typeLivraison) {
      console.log("Type Livraison introuvable")
      return res.status(404).json({ message: "Type Livraison introuvable" });
    }

    res.status(200).json(typeLivraison);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
}

const updateTypeLivraison = async (req, res) => {
  const { id } = req.params;
  const {
    typeLivraison,
    user_id,
  } = req.body

  try{
    let existingType = await prisma.type_livraison_commerciale.findFirst({
      where: {
        nom_type_livraison: typeLivraison
      }
    })
    if(existingType){
      console.log("Type de livraison déjà existant")
      return res.status(400).json({ message: "Type de livraison déjà existant" });
    }
    let utilisateur = null;
    utilisateur = await prisma.users.findUnique({
      where: {
        id_user: parseInt(user_id)
      }
    });
    if (!utilisateur) {
      console.log("Utilisateur non trouvé")
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    let nomUser = utilisateur.fullname

    const dataToUpdate = {
      nom_type_livraison: typeLivraison,
      created_by: nomUser,
      user_id: parseInt(user_id),
    }

    const updatedType = await prisma.type_livraison_commerciale.update({
      where: {
        id_type_livraison: parseInt(id)
      },
      data: dataToUpdate
    })

    return res.status(200).json(updatedType);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur lors de la mise à jour", error });
  }
}

const deleteTypeLivraison = async (req, res) => {
  try{
    const { id } = req.params;
    const {
      user_id
    } = req.body

    let utilisateur = null;
    utilisateur = await prisma.users.findUnique({
      where: {
        id_user: parseInt(user_id)
      }
    });
    if (!utilisateur) {
      console.log("Utilisateur non trouvé")
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    let nomUser = utilisateur.fullname

    dataToUpdate = {
      created_by: nomUser,
      user_id: parseInt(user_id),
      is_deleted: true,
    }

    const updatedType = await prisma.type_livraison_commerciale.update({
      where: {
        id_type_livraison: parseInt(id)
      },
      data: dataToUpdate
    })

    return res.status(200).json(updatedType);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de la mise à jour", error });
  }
}

const generateLivraisonPDF = async (req, res) => {
    const { id } = req.params;
  
    try {
      const data = await prisma.livraison.findUnique({
        where: { id_livraison: parseInt(id) },
        include: {
          validations: true,
        }
      });

      console.log(data)
  
      if (!data) return res.status(404).json({ message: "Livraison introuvable" });
      if (data.validations.length < 1) return res.status(400).json({ message: "Aucune validation trouvée" });
  
      const livraison = {
        ...data,
        produitsLivre: typeof data.produitsLivre === "string"
          ? JSON.parse(data.produitsLivre)
          : data.produitsLivre
      };
  
      // 🔎 Récupération de l'agent qui a fait la livraison (si user_id défini)
      let expediteurNom = "N/A";
      // console.log(livraison)
      if (livraison.nom_livreur) {
        expediteurNom = livraison.nom_livreur;
      } else if (livraison.user_id) {
        const user = await prisma.users.findUnique({
          where: { id_user: livraison.user_id }
        });
        if (user) {
          expediteurNom = user.fullname;
        }
      }
  
      // 🗺️ Sélection du template
      const templatesMap = {
        0: "livraison_base.html",
        1: "livraison_tpe_gim.html",
        2: "livraison_tpe_repare.html",
        3: "livraison_mj_gim.html",
        4: "livraison_tpe_mobile.html",
        5: "livraison_chargeur_tpe.html",
        6: "livraison_tpe_ecobank.html",
        7: "livraison_chargeur_tpe.html",
        8: "livraison_chargeur_decom.html",
      };
  
      const templateFile = templatesMap[0];
      // if (!templateFile) return res.status(400).json({ message: "Type de livraison inconnu" });
  
      const filePath = path.join(__dirname, "../../statics/templates/", templateFile);
      let html = fs.readFileSync(filePath, "utf8");
  
      // 🧱 Construction du tableau
      const produitsRows = livraison.produitsLivre.map((p, index) => {
        let row = "";
        const has = (m) => p.mobile_money?.includes(m) ? "✔" : "";
        row = `<tr><td>${p.pointMarchand || p.marchand}</td><td>${p.serialNumber || p.sn}</td><td>${p.caisse}</td><td>${p.banque}</td><td>${has("OM")}</td><td>${has("MTN")}</td><td>${has("MOOV")}</td></tr>`;
        // switch (livraison.type_livraison_id) {
        //   case 1:
        //     row = `<tr><td>${p.pointMarchand || p.marchand}</td><td>${p.serialNumber || p.sn}</td><td>${p.caisse}</td><td>${p.banque}</td><td>${has("OM")}</td><td>${has("MTN")}</td><td>${has("MOOV")}</td></tr>`;
        //     break;
        //   case 2:
        //     row = `<tr><td>${p.pointMarchand || p.marchand}</td><td>${p.serialNumber || p.sn}</td><td>${p.caisse}</td></tr>`;
        //     break;
        //   case 3:
        //     row = `<tr><td>${p.pointMarchand || p.marchand}</td><td>${p.serialNumber || p.sn}</td><td>${p.caisse}</td><td>${p.banque}</td><td>${has("OM")}</td><td>${has("MTN")}</td><td>${has("MOOV")}</td></tr>`;
        //     break;
        //   case 4:
        //     row = `<tr><td>${p.pointMarchand || p.marchand}</td><td>${p.serialNumber || p.sn}</td><td>${p.caisse}</td><td>${has("OM")}</td><td>${has("MTN")}</td><td>${has("MOOV")}</td></tr>`;
        //     break;
        //   case 5:
        //     row = `<tr><td>${p.pointMarchand || p.marchand}</td><td>${p.serialNumber || p.sn}</td><td>${p.caisse}</td></tr>`;
        //     break;
        //   case 6:
        //     row = `<tr><td>${p.pointMarchand || p.marchand}</td><td>${p.serialNumber || p.sn}</td><td>${p.caisse}</td><td>${p.banque}</td><td>${has("OM")}</td><td>${has("MTN")}</td><td>${has("MOOV")}</td></tr>`;
        //     break;
        //   case 7:
        //     row = `<tr><td>${p.pointMarchand || p.marchand}</td><td>${p.serialNumber || p.sn}</td><td>${p.caisse}</td></tr>`;
        //     break;
        //   case 8:
        //     row = `<tr><td>${p.pointMarchand || p.marchand}</td><td>${p.serialNumber || p.sn}</td><td>${p.caisse}</td></tr>`;
        //     break;
        //   default:
        //     row = "";
        // }
      
        // ➕ Ajout du saut de page toutes les 20 lignes
        if ((index + 1) % 20 === 0) {
          row += `<tr class="page-break"></tr>`;
        }
      
        return row;
      }).join("\n");

      const typeLivraison = await prisma.type_livraison_commerciale.findUnique({
        where: {
          id_type_livraison: livraison.type_livraison_id
        }
      })
      
      // console.log(livraison.validations[0].signature)
      // 🧩 Remplacement des balises HTML
      let index = livraison.validations.length-1
      html = html
        .replaceAll("{{type_livraison}}", typeLivraison.nom_type_livraison.toUpperCase())
        .replace("{{commentaire}}", livraison.commentaire || "")
        .replace("{{commentaire_reception}}", livraison.validations[index].commentaire)
        .replace("{{date_livraison}}", formatDate(livraison.date_livraison))
        .replace("{{qte_totale_livraison}}", livraison.qte_totale_livraison || livraison.produitsLivre.length)
        .replace("{{nom_expediteur}}", expediteurNom)
        .replace("{{nom_recepteur}}", livraison.validations[index].nom_recepteur || "Receveur")
        .replace("{{produitsRows}}", produitsRows)
        .replace("{{signature}}", livraison.validations[index].signature || "Validé")
        .replace("{{date_validation}}", livraison.validations[index].date_validation ? formatDate(livraison.validations[index].date_validation) : "N/A")
        .replace("{{signature_expediteur}}", livraison.signature_expediteur || "Signé")
        .replace(/(\.title_type\s*\{)([\s\S]*?)(\})/gi, (match, open, content, close) => {
          let newContent = " background-color: white; color: black;";
          switch(livraison.type_livraison_id){
            case 1:
              newContent = " background-color: #cda5f5; color: #ffff;"
            break;
            case 2:
              newContent = " background-color: #ee6060; color: #ffff;"
            break;
            case 3:
              newContent = " background-color: #a476d2; color: #ffff;"
            break;
            case 4:
              newContent = " background-color: #77ef83; color: #ffff;"
            break;
            case 5:
              newContent = " background-color: #eaee7f; color: #ffff;"
            break;
            case 6:
              newContent = " background-color: #80d8e6; color: #ffff;"
            break;
            default:
              newContent = " background-color: white; color: black;"
          }
          return open + newContent + close;
        })

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
        "Content-Disposition": `attachment; filename=livraison_${livraison.id_livraison}.pdf`
      });
  
      return res.send(pdfBuffer);
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur lors de la génération du PDF" });
    }
};

const updateDeliveryStock = async (req, res) => {
  const { id } = req.params;
  const {
    commentaire,
    type_livraison_id,
    user_id,
    role_reception,
    quantite,
    service_reception,
    otherFields,
  } = req.body;

  try {
    
    let utilisateur = null;
    
    utilisateur = await prisma.users.findUnique({
      where: {
        id_user: parseInt(user_id)
      }
    })
    
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    let nomLivreur = utilisateur.fullname

    const autres = typeof otherFields === "string"
    ? JSON.parse(otherFields)
    : otherFields
    
    // Données à mettre à jour
    const dataToUpdate = {
      user_id: utilisateur ? utilisateur.id_user : null,
      quantite_livraison: parseInt(quantite),
      nom_livreur: nomLivreur ? nomLivreur : null,
      commentaire_livraison : commentaire,
      type: "livraison_piece",
      statut_livraison: "en_cours",
      role_id: role_reception ? parseInt(role_reception) : null,
      service_id: service_reception ? parseInt(service_reception) : null,
      date_livraison: new Date(),
      autres_champs_livraison: JSON.stringify(autres),
    };

    // Mise à jour de la livraison
    const updated = await prisma.livraison_piece.update({
      where: { demande_id: parseInt(id) },
      data: {
        Livraisons: {
          update: {
            data: dataToUpdate,
          }
        }
      },
      include: {
        Livraisons: true
      }
    });


    // *********** GESTION DES MAILS ************

    const piece = await prisma.stock_dt.findUnique({
      where:{
        id_piece: parseInt(type_livraison_id)
      }
    });

    const service = await prisma.services.findUnique({
      where:{
        id: parseInt(service_reception)
      }
    })

    const userService = await prisma.user_services.findMany({
      where:{
        service_id: parseInt(service_reception)
      },
      include:{
        users: true
      }
    })

    const userRole = await prisma.user_roles.findMany({
      where:{
        role_id: 12
      },
      include:{
        users: true
      }
    })
    let recepteurs = userRole.map(us => us.users)
    const service_users = userService.map(us => us.users)

    let livraisonTypeName = piece.nom_piece.toUpperCase();
    let serviceReception = service.nom_service.toUpperCase();
    let quantiteProduits = quantite
    let commentaire_mail = commentaire ? commentaire : "(Sans commentaire)"
    
    const url = GENERAL_URL
    const deliveryLink = `${url}/demande-details/${updated.demande_id}`;

    if ((recepteurs && recepteurs.length > 0) || (service_users && service_users.length > 0)) {
      const subject = `NOUVELLE LIVRAISON ${livraisonTypeName}`;
      const html = `
        <p>Bonjour,</p>
        <p>La livraison ${updated.id} a été modifiée.</p>
        <ul>
          <li><strong>Type de livraison:</strong> ${livraisonTypeName}</li>
          <li><strong>Nombre de produits:</strong> ${quantiteProduits}</li>
          <li><strong>Service:</strong> ${serviceReception}</li>
        </ul>
        <br>
          <p>Commentaire : ${commentaire_mail}<p>
        <br>
        <p>Retrouvez la livraison à ce lien : 
          <span>
            <a href="${deliveryLink}" target="_blank" style="background-color: #73dced; color: white; padding: 7px 12px; text-decoration: none; border-radius: 5px;">
              Cliquez ici !
            </a>
          </span>
        </p>
        <br><br>
        <p>Green - Pay vous remercie.</p>
      `;

      for (const recepteur of recepteurs) {
        await sendMail({
          to: recepteur.email,
          subject,
          html,
        });
      }
      for (const service_user of service_users) {
        await sendMail({
          to: service_user.email,
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
}


module.exports = {
  deliver,
  getAllLivraisons,
  getOneLivraison,
  updateLivraison,
  deleteLivraison,
  generateLivraisonPDF,
  deliverOld,
  deliverStock,
  getAllTypeLivraisonCommerciale,
  getAllStockDeliveries,
  getOneLivraisonDemande,
  receiveStock,
  addDeliveryType,
  getOneTypeLivraison,
  updateTypeLivraison,
  deleteTypeLivraison,
  updateDeliveryStock,
}