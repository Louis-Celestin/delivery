const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require("../../config/clouddinaryConifg");

// ✅ Créer une validation (nouvelle ou ancienne)
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

    if (!livraison)
      return res.status(404).json({ message: "Livraison introuvable." });

    if (livraison.statut_livraison === "livre")
      return res.status(400).json({ message: "Impossible de valider une seconde fois." });

    if (!req.file) {
      return res.status(400).json({ message: "Signature du récepteur requise pour valider." });
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "greenpay/signatures",
    });
    const signature = uploadResult.secure_url;

    let final_nom_validateur = nom_validateur;
    let final_date_validation;

    if (is_old_validation) {
      if (!nom_validateur || !date_validation) {
        return res.status(400).json({ message: "Nom du validateur et date de validation obligatoires pour une ancienne validation." });
      }
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

      if (!user || !user.agents)
        return res.status(404).json({ message: "Utilisateur ou agent non trouvé." });

      final_nom_validateur = user.agents.nom;
      final_date_validation = new Date();
    }

    const newValidation = await prisma.validations.create({
      data: {
        livraison_id: parseInt(livraison_id),
        commentaire,
        user_id: parseInt(user_id),
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

const updateValidation = async (req, res) => {
  const { id } = req.params;
  const { commentaire, nom_recepteur, is_old_validation = false } = req.body;
  let { user_id, date_validation } = req.body;

  try {
    const validation = await prisma.validations.findUnique({
      where: { id_validation: parseInt(id) }
    });

    if (!validation) {
      return res.status(404).json({ message: "Validation non trouvée" });
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

    if (is_old_validation) {
      if (!nom_recepteur || !date_validation) {
        return res.status(400).json({ message: "Nom du récepteur et date de validation obligatoires pour une ancienne validation." });
      }
      date_validation = new Date(date_validation);
      if (isNaN(date_validation)) {
        return res.status(400).json({ message: "Date de validation invalide." });
      }
    } else {
      date_validation = new Date();
    }

    const dataToUpdate = {
      commentaire,
      user_id: user_id ? parseInt(user_id) : null,
      signature,
    };

    if (is_old_validation) {
      dataToUpdate.nom_recepteur = nom_recepteur;
      dataToUpdate.date_validation = date_validation;
    } else {
      dataToUpdate.date_validation = date_validation;
    }

    const updatedValidation = await prisma.validations.update({
      where: { id_validation: parseInt(id) },
      data: dataToUpdate,
    });

    return res.status(200).json(updatedValidation);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de la mise à jour." });
  }
};

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

const deleteValidation = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.validations.delete({
      where: { id_validation: parseInt(id) },
    });
    return res.status(200).json({ message: "Validation supprimée." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de la suppression." });
  }
};

module.exports = {
  createValidation,
  updateValidation,
  getAllValidations,
  getOneValidation,
  deleteValidation,
};
