const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require("../../config/clouddinaryConifg");

// ✅ Créer une validation (ancienne ou nouvelle)
const createValidation = async (req, res) => {
  const {
    livraison_id,
    commentaire,
    nom_validateur,
    date_validation,
    is_old_validation = false,
    user_id,
  } = req.body;

  try {
    const livraison = await prisma.livraison.findUnique({
      where: { id_livraison: parseInt(livraison_id) },
    });

    if (!livraison) return res.status(404).json({ message: "Livraison introuvable." });

    if (livraison.statut_livraison === "livre") {
      return res.status(400).json({ message: "Livraison déjà validée." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Signature du récepteur requise." });
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "greenpay/signatures",
    });
    const signature = uploadResult.secure_url;

    let final_nom_validateur;
    let final_date_validation;

    if (is_old_validation === 'true' || is_old_validation === true) {
      if (!nom_validateur || !date_validation) {
        return res.status(400).json({ message: "Nom du validateur et date de validation obligatoires pour une ancienne validation." });
      }
      final_nom_validateur = nom_validateur;
      final_date_validation = new Date(date_validation);
      if (isNaN(final_date_validation)) {
        return res.status(400).json({ message: "Date de validation invalide." });
      }
    } else {
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
    }

    const newValidation = await prisma.validations.create({
      data: {
        livraison_id: parseInt(livraison_id),
        commentaire,
        user_id: user_id ? parseInt(user_id) : null,
        nom_recepteur: final_nom_validateur,
        date_validation: final_date_validation,
        signature,
      },
    });

    await prisma.livraison.update({
      where: { id_livraison: parseInt(livraison_id) },
      data: { statut_livraison: "livre" },
    });

    return res.status(201).json(newValidation);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ✅ Mettre à jour une validation existante, en incluant la signature
const updateValidation = async (req, res) => {
  const { id } = req.params;
  const { commentaire, nom_recepteur, is_old_validation = false, user_id, date_validation } = req.body;

  try {
    const validation = await prisma.validations.findUnique({
      where: { id_validation: parseInt(id) },
    });

    if (!validation) {
      return res.status(404).json({ message: "Validation non trouvée." });
    }

    let signature = validation.signature;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "greenpay/signatures",
      });
      signature = uploadResult.secure_url;
    }

    if (!signature) {
      return res.status(400).json({ message: "La signature du récepteur est obligatoire." });
    }

    let final_date_validation = validation.date_validation;

    if (is_old_validation === 'true' || is_old_validation === true) {
      if (!nom_recepteur || !date_validation) {
        return res.status(400).json({ message: "Nom du récepteur et date de validation obligatoires pour une ancienne validation." });
      }
      final_date_validation = new Date(date_validation);
      if (isNaN(final_date_validation)) {
        return res.status(400).json({ message: "Date de validation invalide." });
      }
    } else {
      final_date_validation = new Date(); // Met à jour automatiquement
    }

    const updatedValidation = await prisma.validations.update({
      where: { id_validation: parseInt(id) },
      data: {
        commentaire,
        signature,
        nom_recepteur: nom_recepteur || validation.nom_recepteur,
        date_validation: final_date_validation,
        user_id: user_id ? parseInt(user_id) : validation.user_id,
      },
    });

    return res.status(200).json(updatedValidation);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de la mise à jour." });
  }
};

// ✅ Récupérer toutes les validations
const getAllValidations = async (req, res) => {
  try {
    const validations = await prisma.validations.findMany({
      orderBy: { date_validation: 'desc' },
    });
    return res.status(200).json(validations);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ✅ Récupérer une validation par ID
const getOneValidation = async (req, res) => {
  const { id } = req.params;
  try {
    const validation = await prisma.validations.findUnique({
      where: { id_validation: parseInt(id) },
    });

    if (!validation) {
      return res.status(404).json({ message: "Validation non trouvée." });
    }

    return res.status(200).json(validation);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ✅ Supprimer une validation
const deleteValidation = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.validations.delete({
      where: { id_validation: parseInt(id) },
    });
    return res.status(200).json({ message: "Validation supprimée avec succès." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// Retourner une livraison
const returnDelivery = async (req, res) => {
  const {
    livraison_id,
    commentaire_return,
    user_id,
  } = req.body;
  try {
    const livraison = await prisma.livraison.findUnique({
      where: { id_livraison: parseInt(livraison_id) },
    });

    if (!livraison) return res.status(404).json({ message: "Livraison introuvable." });

    if (livraison.statut_livraison === "livre") {
      return res.status(400).json({ message: "Livraison déjà validée." });
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

      const newValidation = await prisma.validations.create({
      data: {
        livraison_id: parseInt(livraison_id),
        etat_validation: 'refuse',
        commentaire: commentaire_return,
        user_id: user_id ? parseInt(user_id) : null,
        nom_recepteur: final_nom_validateur,
        date_validation: final_date_validation,
      },
    });

    await prisma.livraison.update({
      where: { id_livraison: parseInt(livraison_id) },
      data: { statut_livraison: 'en_attente' },
    });

    return res.status(201).json(newValidation);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};


module.exports = {
  createValidation,
  updateValidation,
  getAllValidations,
  getOneValidation,
  deleteValidation,
  returnDelivery,
};
