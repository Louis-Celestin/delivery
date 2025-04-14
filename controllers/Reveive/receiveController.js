const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
            where: { id_livraison: livraison_id },
        });

        if (!livraison) {
            return res.status(404).json({ message: "Livraison introuvable." });
        }
        if(livraison.statut_livraison == "livre"){
            return res.status(400).json({message : "Impossible de valider une seconde fois."})
        }

        // Pour les nouvelles validations, on utilise l'utilisateur connecté
        let final_nom_validateur = nom_validateur;
        let final_date_validation = date_validation;

        if (!is_old_validation) {

            if (!user_id) {
                return res.status(403).json({ message: "Utilisateur non authentifié." });
            }

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
                livraison_id,
                commentaire,
                user_id,
                nom_recepteur: final_nom_validateur,
                date_validation: new Date(final_date_validation)
            }
        });

        // Mise à jour du statut de la livraison
        await prisma.livraison.update({
            where: { id_livraison: livraison_id },
            data: {
                statut_livraison: 'livre'
            }
        });

        return res.status(201).json(newValidation);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur." });
    }
};

// 🔍 Récupérer toutes les validations
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

// 🔍 Récupérer une validation
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

// ✏️ Mettre à jour une validation
const updateValidation = async (req, res) => {
    const { id } = req.params;
    const { commentaire, nom_recepteur, is_old_validation = false } = req.body;
    let { user_id,date_validation } = req.body;

    try {
        // Vérification de la validation à mettre à jour
        const validation = await prisma.validations.findUnique({
            where: { id_validation: parseInt(id) }
        });

        if (!validation) {
            return res.status(404).json({ message: "Validation non trouvée" });
        }

        // Si ce n'est pas une ancienne validation, on utilise l'utilisateur connecté
        if (!is_old_validation) {
            user_id = user_id;  // Assumer que l'id de l'utilisateur est récupéré depuis la session
            // Utilisation de la date actuelle pour la validation
            date_validation = new Date();
        }

        // Vérification de l'existence de l'utilisateur si c'est une ancienne validation
        if (is_old_validation && user_id) {
            const user = await prisma.users.findUnique({
                where: { id_user: parseInt(user_id) }
            });
            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }
        }

        // Préparation des données à mettre à jour
        const dataToUpdate = { commentaire, user_id };

        // Mise à jour de la date et du nom du récepteur si c'est une ancienne validation
        if (is_old_validation) {
            if (nom_recepteur) dataToUpdate.nom_recepteur = nom_recepteur;
            if (date_validation) dataToUpdate.date_validation = new Date(date_validation);
        }

        // Mise à jour de la validation dans la base de données
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


// ❌ Supprimer une validation
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
    getAllValidations,
    getOneValidation,
    updateValidation,
    deleteValidation
};
