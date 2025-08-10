const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { envoyerEmail } = require("../../config/emailConfig")
const cloudinary = require("../../config/clouddinaryConifg");
require("crypto")

const prisma = new PrismaClient();


const register = async (req, res) => {
  const { fullname, username, email, password, userServices, userRoles, mailChecked} = req.body;

  try {

    console.log("FULLNAME : ",fullname)
    // Check if user already exists
    const exists = await prisma.users.findFirst({
      where: { email }
    });

    if (exists) {
      return res.status(400).json({ message: "L'email existe déjà" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.users.create({
      data: {
        fullname: fullname,
        username: username,
        email: email,
        password: hashedPassword,
        created_at: new Date(),
      }
    });

    // Create user-services

    const userId = newUser.id_user

    if (userRoles && Array.isArray(userRoles)) {
      await prisma.user_roles.createMany({
        data: userRoles.map(roleId => ({
          user_id: userId,
          role_id: roleId,
        })),
      });
    }

    if (userServices && Array.isArray(userServices)) {
      await prisma.user_services.createMany({
        data: userServices.map(serviceId => ({
          user_id: userId,
          service_id: serviceId,
        })),
      });
    }

    return res.status(201).json(newUser);

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Erreur serveur lors de l'inscription" });
  }
};

/** ✅ LOGIN (Connexion) */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.users.findFirst({ where: { email }});

        if (!user) return res.status(404).json({ message: "Utilisateur non enregistré." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Identifiants invalides." });

        const token = jwt.sign({ id_user: user.id_user }, process.env.JWT_SECRET, { expiresIn: "2h" });

        res.status(200).json({ message: "Connexion réussie.", token, user });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Erreur serveur.", error });
    }
};

/** ✅ UPDATE USER */
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname, username, email, userServices, userRoles, mailChecked } = req.body;

        const user = await prisma.users.findUnique({
            where: { id_user: parseInt(id) },
        });

        const dataToUpdate = {
            fullname,
            username,
            email,
        }

        const updatedUser = await prisma.users.update({
            where : { id_user: parseInt(id) },
            data: dataToUpdate
        })

        await prisma.user_roles.deleteMany({
            where: { user_id: parseInt(id) }
        })

        await prisma.user_services.deleteMany({
            where: { user_id: parseInt(id)}
        })

        if (userRoles && Array.isArray(userRoles)) {
            await prisma.user_roles.createMany({
                data: userRoles.map(roleId => ({
                    user_id: parseInt(id),
                    role_id: roleId,
                })),
            });
        }

        if (userServices && Array.isArray(userServices)) {
            await prisma.user_services.createMany({
                data: userServices.map(serviceId => ({
                    user_id: parseInt(id),
                    service_id: serviceId,
                })),
            });
        }

        res.status(200).json({ message: "Utilisateur mis à jour.", updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur.", error });
    }
};

/** ✅ DELETE USER */
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.users.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "Utilisateur supprimé avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur.", error });
    }
};

/** ✅ FORGOT PASSWORD (Demander réinitialisation) */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const users = await prisma.users.findFirst({ where: { email } })
        console.log(users)

        if (!users) return res.status(404).json({ message: "Utilisateur non trouvé." });

        // 🔹 Génération d’un token sécurisé
        const resetToken = crypto.randomUUID().toString("hex");

        // 🔹 Stockage du token dans la base (expire dans 1h)
        await prisma.users.update({
            where: { id_user: users.id_user },
            data: { reset_token: resetToken, reset_expires: new Date(Date.now() + 3600000) }
        });

        // 🔹 URL de réinitialisation (frontend)
        const resetURL = `${process.env.FRONTEND_URL}/password/reset-password/${resetToken}`;

        // 🔹 Envoi de l'email
        const html = `
            <h3>Demande de réinitialisation de mot de passe</h3>
            <p>Bonjour ${users.email},</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
            <p>👉 <a href="${resetURL}">Cliquez ici pour réinitialiser votre mot de passe</a></p>
            <p>Ce lien expire dans 1 heure.</p>
            <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
        `;

        await envoyerEmail(users.email, "Réinitialisation de votre mot de passe", html);

        res.status(200).json({ message: "Email de réinitialisation envoyé." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur.", error });
    }
};

/** ✅ RESET PASSWORD (Réinitialiser avec le token) */
const resetPassword = async (req, res) => {
    // console.table(req.params)
    try {
        const { token } = req.params;
        const { password } = req.body;
        // console.log("ICI")
        // 🔹 Vérifier si le token existe et n'a pas expiré
        const user = await prisma.users.findFirst({
            where: { reset_token: token, reset_expires: { gt: new Date() } }
        });

        console.log(user)

        // console.table(user)

        if (!user) return res.status(400).json({ message: "Token invalide ou expiré." });

        // 🔹 Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🔹 Mettre à jour l'utilisateur et supprimer le token
        await prisma.users.updateMany({
            where: { id_user : parseInt(user.id_user)},
            data: { password: hashedPassword, reset_token: null, reset_expires: null }
        }).then((ok)=>{
            if(ok){
                console.log(ok)
            }else{
                console.log("NON OK")
            }
        }).catch(error=>{console.table(error)})

        res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur.", error });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id_user; // Assuming you're using auth middleware that sets req.user

        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié." });
        }

        // 🔹 Find the user
        const user = await prisma.users.findUnique({
            where: { id_user: parseInt(userId) },
        });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        // 🔹 Compare current password with stored hash
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mot de passe actuel incorrect." });
        }

        // 🔹 Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // 🔹 Update password in DB
        await prisma.users.update({
            where: { id_user: parseInt(userId) },
            data: { password: hashedNewPassword },
        });

        res.status(200).json({ message: "Mot de passe changé avec succès." });

    } catch (error) {
        console.error("Erreur lors du changement de mot de passe:", error);
        res.status(500).json({ message: "Erreur serveur.", error });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await prisma.users.findMany({
            orderBy: { id_user: 'asc' },
        });

        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error });
    }
}

const getUserRoles = async (req, res) => {
    try{
        const { id } = req.params;

        const user_roles = await prisma.user_roles.findMany({
            where: {user_id : parseInt(id)},
            include: {roles : true}
        })

        res.status(200).json({
            roles: user_roles.map(r => r.roles)
        });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
}

const getAllRoles = async (req, res) => {
    try{
        const AllRoles = await prisma.roles.findMany({
            orderBy: { nom_role : 'asc' }
        })

        res.status(200).json(AllRoles)
    } catch(error){
        res.status(500).json({ message: "Erreur lors de la récupération des rôles ", error})
    }
}

const getAllUserRoles = async (req, res) => {
    try{
        const roles = await prisma.user_roles.findMany({
            orderBy: { user_id : 'asc' }
        })

        res.status(200).json(roles);
    } catch(error){
        res.status(500).json({ message: "Erreur lors de la récupération des rôles utilisateurs ", error });
    }
}

const getAllServices = async (req, res) => {
    try{
        const services = await prisma.services.findMany({
           orderBy: { nom_service : 'asc' } 
        })

        res.status(200).json(services);
    } catch(error){
        res.status(500).json({ message: "Erreur lors de la récupération des services ", error})
    }
}

const getAllUserServices = async (req, res) => {
    try{
        const services = await prisma.user_services.findMany({
            orderBy: { user_id : 'asc' }
        })

        res.status(200).json(services);
    } catch(error){
        res.status(500).json({ message: "Erreur lors de la récupération des services utilisateurs ", error });
    }
}

const getUserServices = async (req, res) => {
    try{
        const { id } = req.params;

        const user_services = await prisma.user_services.findMany({
            where: {user_id : parseInt(id)},
            include: {services : true}
        })

        res.status(200).json({
            services: user_services.map(s => s.services)
        });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
}

const getOneUser = async (req, res) =>{
    const { id } = req.params;

    try{
        const user = await prisma.users.findUnique({
            where: { id_user: parseInt(id) }
        });

        if(!user){
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        return res.status(200).json(user)
    } catch(error){
        res.status(500).json({ message: "Erreur serveur", error });
    }
}




module.exports ={
    register,
    login,
    forgotPassword,
    resetPassword,
    updateUser,
    deleteUser,
    changePassword,
    getAllUsers,
    getUserRoles,
    getAllUserRoles,
    getAllRoles,
    getAllServices,
    getAllUserServices,
    getOneUser,
    getUserServices,
}