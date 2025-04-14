const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { envoyerEmail } = require("../../config/emailConfig")
const cloudinary = require("../../config/clouddinaryConifg");
require("crypto")

const prisma = new PrismaClient();


const register = async(req,res)=>{

    const {email,password,username, agent_id, role_id}=req.body
try {

    // find users
    const exists = await prisma.users.findFirst({
        where : {
            email : email
        }
    })
    if(exists) return res.status(400).json({message :"l'email existe deja"})
    
    const hashedPassword= await bcrypt.hash(password, 10)

    const genUser= prisma.users.create({
        data: {
            agent_id: parseInt(agent_id),
            email,
            password: hashedPassword,
            username,
            role_id:parseInt(role_id)
        }
    }).then((user)=>{
        if(user){
            console.log(user)
            return res.status(201).json(user)
        }else{
            return res.status(400).json({message : "Erreur de creation"})
        }
    }).catch((err)=>{
        console.log(err)
    })
} catch (error) {
    console.log(error)
}
}

/** ✅ LOGIN (Connexion) */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.users.findFirst({ where: { email } ,include:{agents:true, roles :true}});

        if (!user) return res.status(401).json({ message: "Identifiants invalides." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Identifiants invalides." });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

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
        const { email, agent_id } = req.body;

        const user = await prisma.users.update({
            where: { id: Number(id) },
            data: { email, agent_id }
        });

        res.status(200).json({ message: "Utilisateur mis à jour.", user });
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


module.exports ={
    register,
    login,
    forgotPassword,
    resetPassword,
    updateUser,
    deleteUser
}