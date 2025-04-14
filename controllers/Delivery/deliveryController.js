const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { envoyerEmail } = require("../../config/emailConfig")
const cloudinary = require("../../config/clouddinaryConifg");
require("crypto")

const deliver = async (req, res) => {
    const {
      produitsLivre,
      commentaire,
      user_id,
      nom_livreur,
      type_livraison_id,
      isAncienne,
      date_livraison
    } = req.body;
  
    try {
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
  
      const nouvelleLivraison = await prisma.livraison.create({
        data: {
          statut_livraison: "en_cours",
          qte_totale_livraison: produits.length,
          produitsLivre: JSON.stringify(produits),
          commentaire,
          nom_livreur: nom_livreur || null,
          date_livraison: isAncienne && date_livraison
            ? new Date(date_livraison)
            : new Date(),
          deleted: false,
          type_livraison_id: parseInt(type_livraison_id),
          user_id: utilisateur ? utilisateur.id_user : null
        }
      });
  
      // Si c’est une livraison de chargeurs, on traite les transactions
      if (parseInt(type_livraison_id) === 5) {
        for (const item of produits) {
          const chargeur = await prisma.chargeurs.findUnique({
            where: {
              id_chargeur: item.id_chargeur
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
                id_chargeur : parseInt(chargeur.id_chargeur)
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
            where: { id_chargeur: chargeur.id_chargeur },
            data: {
              stock: {
                decrement: quantite
              }
            }
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
  
const getAllLivraisons = async (req, res) => {
    try {
      const livraisons = await prisma.livraison.findMany({
        where: { deleted: false },
        orderBy: { date_livraison: 'desc' }
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
        where: { id_livraison: parseInt(id) }
      });
  
      if (!livraison || livraison.deleted) {
        return res.status(404).json({ message: "Livraison introuvable" });
      }
  
      res.status(200).json(livraison);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  };
  
  const updateLivraison = async (req, res) => {
    const { id } = req.params;
    const {
        produitsLivre,
        commentaire,
        statut_livraison,
        type_livraison_id,
        nom_livreur,
        is_old_livraison = false,  // Nouveau paramètre pour distinguer les 2 cas
        date_livraison  // Date de livraison pour le cas "ancienne"
    } = req.body;

    try {
        // Données à mettre à jour
        const dataToUpdate = {
            produitsLivre: typeof produitsLivre === "string" ? produitsLivre : JSON.stringify(produitsLivre),
            commentaire,
            statut_livraison,
            type_livraison_id,
            nom_livreur
        };

        // Si c'est une ancienne livraison, on ajoute la date de livraison et on vérifie la validité de la date
        if (is_old_livraison && date_livraison) {
            dataToUpdate.date_livraison = new Date(date_livraison);
        }

        // Mise à jour de la livraison
        const updated = await prisma.livraison.update({
            where: { id_livraison: parseInt(id) },
            data: dataToUpdate
        });

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
  

module.exports = {
    deliver,
    getAllLivraisons,
    getOneLivraison,
    updateLivraison,
    deleteLivraison
}