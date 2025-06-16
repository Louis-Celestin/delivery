const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../../config/clouddinaryConifg");

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("fr-FR");
};

const deliver = async (req, res) => {
  try {
    const {
      produitsLivre,
      commentaire,
      user_id,
      nom_livreur,
      type_livraison_id,
      isAncienne,
      date_livraison
    } = req.body;

    // Correction ici : gestion de produitsLivre (string JSON venant de form-data)
    const produits = typeof produitsLivre === "string"
      ? JSON.parse(produitsLivre)
      : produitsLivre;

    // Correction ici : isAncienne arrive en string depuis form-data => on convertit en bool
    const isAncienneBool = (isAncienne === 'true' || isAncienne === true);

    const typeLivraison = await prisma.typeLivraison.findUnique({
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
        nom_livreur: nom_livreur || null,
        date_livraison: isAncienneBool && date_livraison
          ? new Date(date_livraison)
          : new Date(),
        deleted: false,
        type_livraison_id: parseInt(type_livraison_id),
        user_id: utilisateur ? utilisateur.id_user : null,
        signature_expediteur: signature_expediteur || null
      }
    });

    // Traitement spécifique pour les chargeurs (type 5)
    if (parseInt(type_livraison_id) === 5) {
      for (const item of produits) {
        const chargeur = await prisma.chargeurs.findUnique({
          where: {
            id_chargeur: 1
          }
        });

        if (!chargeur) {
          continue;
        }

        const quantite = parseInt(item.quantite || 1);

        await prisma.transactions.create({
          data: {
            type_transaction: "sortie",
            quantite,
            date_transaction: new Date(),
            chargeurs: { connect: { id_chargeur: 1 } },
            users: utilisateur ? { connect: { id_user: utilisateur.id_user } } : null
          }
        }).catch(err => console.log(err));

        await prisma.chargeurs.update({
          where: { id_chargeur: 1 },
          data: { stock: { decrement: quantite } }
        });
      }
    }

    // Gestion des mails
    let livraisonTypeName = '';
    switch (parseInt(type_livraison_id)) {
      case 1:
        livraisonTypeName = 'TPE GIM';
        break;
      case 2:
        livraisonTypeName = 'TPE REPARE';
        break;
      case 3:
        livraisonTypeName = 'TPE MAJ GIM';
        break;
      case 4:
        livraisonTypeName = 'TPE MOBILE';
        break;
      case 5:
        livraisonTypeName = 'CHARGEUR';
        break;
      case 6:
        livraisonTypeName = 'TPE ECOBANK';
        break;
    }

    const sendMail = require("../../utils/emailSender");
    const receivers = await prisma.users.findMany({
      where: { role_id: 2 },
    });

    if (receivers && receivers.length > 0) {
      const subject = `NOUVELLE LIVRAISON ${livraisonTypeName}`;
      const html = `
        <p>Bonjour,</p>
        <p>Une nouvelle livraison a été enregistrée.</p>
        <ul>
          <li><strong>Type de livraison:</strong> ${livraisonTypeName}</li>
          <li><strong>Nombre de produits:</strong> ${produits.length}</li>
        </ul>
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
    Modification de la fonction updateLivraison.
    Les données à update: produitsLivre, commentaire, type_livraison_id, 
    date_livraison, qte_totale_livraison
  */
const updateLivraison = async (req, res) => {
    const { id } = req.params;
    const {
        produitsLivre,
        commentaire,
        statut_livraison,
        type_livraison_id,
        date_livraison,
        qte_totale_livraison,
        user_id,
    } = req.body;

    try {
      // Données à mettre à jour
        const produits = typeof produitsLivre === "string"
        ? JSON.parse(produitsLivre)
        : produitsLivre;

        let utilisateur = null;
      
        utilisateur = await prisma.users.findUnique({
          where: {
            id_user: parseInt(user_id)
          }})
      
  
        if (!utilisateur) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
      
        
        const dataToUpdate = {
          produitsLivre: typeof produitsLivre === "string" ? produitsLivre : JSON.stringify(produitsLivre),
          commentaire,
          statut_livraison,
          type_livraison_id,
          date_livraison: new Date(),
          qte_totale_livraison : produits.length,
          user_id: utilisateur ? utilisateur.id_user : null
          // nom_livreur
        };

        // if (date_livraison) {
        //     dataToUpdate.date_livraison = new Date();
        // }

        // Si c'est une ancienne livraison, on ajoute la date de livraison et on vérifie la validité de la date

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
        // ✅ Ancienne livraison ou nom fourni manuellement
        expediteurNom = livraison.nom_livreur;
      } else if (livraison.user_id) {
        const user = await prisma.users.findUnique({
          where: { id_user: livraison.user_id }
        });
  
        if (user?.agent_id) {
          const agent = await prisma.agents.findUnique({
            where: { id: user.agent_id }
          });
          if (agent?.nom) {
            expediteurNom = agent.nom;
          }
        }
      }
  
      // 🗺️ Sélection du template
      const templatesMap = {
        1: "livraison_tpe_gim.html",
        2: "livraison_tpe_repare.html",
        3: "livraison_mj_gim.html",
        4: "livraison_tpe_mobile.html",
        5: "livraison_chargeur_tpe.html",
        6: "livraison_tpe_ecobank.html", // Type Ecobank ajouté aux templates
      };
  
      const templateFile = templatesMap[livraison.type_livraison_id];
      if (!templateFile) return res.status(400).json({ message: "Type de livraison inconnu" });
  
      const filePath = path.join(__dirname, "../../statics/templates/", templateFile);
      let html = fs.readFileSync(filePath, "utf8");
  
      // 🧱 Construction du tableau
      const produitsRows = livraison.produitsLivre.map((p, index) => {
        let row = "";
        const has = (m) => p.mobile_money?.includes(m) ? "✔" : "";
        switch (livraison.type_livraison_id) {
          case 1:
            row = `<tr><td>${p.pointMarchand || p.marchand}</td><td>${p.serialNumber || p.sn}</td><td>${p.caisse}</td><td>${p.banque}</td><td>${has("OM")}</td><td>${has("MTN")}</td><td>${has("MOOV")}</td></tr>`;
            break;
          case 2:
            row = `<tr><td>${p.pointMarchand || p.marchand}</td><td>${p.serialNumber || p.sn}</td><td>${p.caisse}</td></tr>`;
            break;
          case 3:
            row = `<tr><td>${p.pointMarchand || p.marchand}</td><td>${p.serialNumber || p.sn}</td><td>${p.caisse}</td><td>${p.banque}</td><td>${has("OM")}</td><td>${has("MTN")}</td><td>${has("MOOV")}</td></tr>`;
            break;
          case 4:
            row = `<tr><td>${p.pointMarchand || p.marchand}</td><td>${p.serialNumber || p.sn}</td><td>${p.caisse}</td><td>${has("OM")}</td><td>${has("MTN")}</td><td>${has("MOOV")}</td></tr>`;
            break;
          case 5:
            row = `<tr><td>${p.pointMarchand || p.marchand}</td><td>${p.serialNumber || p.sn}</td><td>${p.caisse}</td></tr>`;
            break;
          case 6:
            row = `<tr><td>${p.pointMarchand || p.marchand}</td><td>${p.serialNumber || p.sn}</td><td>${p.caisse}</td><td>${p.banque}</td><td>${has("OM")}</td><td>${has("MTN")}</td><td>${has("MOOV")}</td></tr>`;
            break;
          default:
            row = "";
        }
      
        // ➕ Ajout du saut de page toutes les 20 lignes
        if ((index + 1) % 20 === 0) {
          row += `<tr class="page-break"></tr>`;
        }
      
        return row;
      }).join("\n");
      
      // console.log(livraison.validations[0].signature)
      // 🧩 Remplacement des balises HTML
      html = html
        .replace("{{commentaire}}", livraison.commentaire || "")
        .replace("{{date_livraison}}", formatDate(livraison.date_livraison))
        .replace("{{qte_totale_livraison}}", livraison.qte_totale_livraison || livraison.produitsLivre.length)
        .replace("{{nom_expediteur}}", expediteurNom)
        .replace("{{nom_recepteur}}", livraison.validations[0].nom_recepteur || "Receveur")
        .replace("{{produitsRows}}", produitsRows)
        .replace("{{signature}}", livraison.validations[0].signature || "Validé")
        .replace("{{date_validation}}", livraison.validations[0].date_validation ? formatDate(livraison.validations[0].date_validation) : "N/A")
        .replace("{{signature_expediteur}}", livraison.signature_expediteur || "Signé")

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

module.exports = {
    deliver,
    getAllLivraisons,
    getOneLivraison,
    updateLivraison,
    deleteLivraison,
    generateLivraisonPDF,
    deliverOld,
}