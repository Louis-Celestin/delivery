const TEST_ENV = require("../../utils/consts")

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../../config/clouddinaryConifg");
const { get } = require("http");
const { urlToHttpOptions } = require("url");
const { type } = require("os");


// Fonction de format de date pour les fiches PDF. La date va apparaître avec l'heure.
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
if (test_env) {
  GENERAL_URL = localUrl
}

// Faire une demande
// DEMANDE CHARGEURS POUR TPE SANS RI SUPPORT -> DT -> ORNELLA
// DEMANDE CHARGEUR ORNELLA -> DT
// DEMANDE PIECE DETACHEES ORNELLA -> DT
// DEMANDE TPE ORNELLA -> DT


const faireDemande = async (req, res) => {
  try {
    const {
      nomDemandeur,
      commentaire,
      selectedStock,
      quantite_demande,
      nomenclature,
      detailsDemande,
      userId,
      itemId,
      idDemandeur,
      motif,
      serviceDemandeur,
      champsAutre,
    } = req.body;

    const details = typeof detailsDemande === "string"
      ? JSON.parse(detailsDemande)
      : detailsDemande;

    const autres = typeof champsAutre === "string"
      ? JSON.parse(champsAutre)
      : champsAutre

    const piece = await prisma.items.findUnique({
      where: {
        id_piece: parseInt(itemId)
      }
    })

    if (!piece) {
      return res.status(404).json({ message: "Pièce introuvable !" })
    }

    const stock = await prisma.stocks.findUnique({
      where: {
        id: parseInt(selectedStock)
      }
    })
    
    if (!stock) {
      return res.status(404).json({ message: "Stock introuvable !" })
    }

    let utilisateur = null;
    utilisateur = await prisma.users.findUnique({
      where: {
        id_user: parseInt(userId)
      }
    });

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const nouvelleDemande = await prisma.demandes.create({
      data: {
        nom_demandeur: nomDemandeur,
        date_demande: new Date(),
        commentaire,
        qte_total_demande: quantite_demande,
        nomenclature,
        details_demande: JSON.stringify(detailsDemande),
        statut_demande: 'en_cours',
        user_id: parseInt(userId),
        stock_id: parseInt(selectedStock),
        item_id: parseInt(itemId),
        type_demande: parseInt(details.typeMouvement),
        id_demandeur: parseInt(idDemandeur),
        motif_demande: motif,
        service_demandeur: parseInt(serviceDemandeur),
        champs_autre: JSON.stringify(autres)
      }
    });


    /************************** GESTION DES MAILS ********************************/
    const service = await prisma.services.findUnique({
      where: {
        id: parseInt(serviceDemandeur)
      }
    })

    const nomService = service.nom_service.toUpperCase()

    const userService = await prisma.user_services.findMany({
      where: {
        service_id: parseInt(serviceDemandeur)
      },
      include: {
        users: true
      }
    })

    const userRole = await prisma.user_roles.findMany({
      where: {
        role_id: 4,
      },
      include: {
        users: true
      }
    })

    const service_users = userService.map(us => us.users)
    const validateurs = userRole.map(us => us.users)

    let nomPiece = piece.nom_piece.toUpperCase()

    let quantiteDemande = quantite_demande;

    let commentaire_mail = commentaire ? commentaire : '(sans commentaire)';

    const url = GENERAL_URL
    let demandeLink = `${url}/demande-details/${nouvelleDemande.id}`;

    const sendMail = require("../../utils/emailSender");

    if ((service_users && service_users.length > 0) || (validateurs && validateurs.length > 0)) {
      const subject = `NOUVELLE DEMANDE POUR ${motif}`;
      let html = `
        <p>Bonjour,</p>
        <p>Une nouvelle demande a été enregistrée.</p>
        <ul>
          <li><strong>Demande de :</strong> ${nomPiece}</li>
          <li><strong>Nombre de produits:</strong> ${quantiteDemande}</li>
        </ul>
        <ul>
          <li><strong>Service demandeur:</strong> ${nomService}</li>
          <li><strong>Nom demandeur:</strong> ${nomDemandeur}</li>
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
      // for (const service_user of service_users) {
      //   await sendMail({
      //     to: service_user.email,
      //     subject,
      //     html,
      //   });
      // }
      // for (const validateur of validateurs) {
      //   await sendMail({
      //     to: validateur.email,
      //     subject,
      //     html,
      //   });
      // }
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

const getAllDemandes = async (req, res) => {
  try {
    const demandes = await prisma.demandes.findMany({
      orderBy: { date_demande: 'desc' },
      include: {
        validation_demande: true
      }
    });

    res.status(200).json(demandes);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des demandes", error });
  }
};

const getOneDemande = async (req, res) => {
  const { id } = req.params;

  try {
    const demandes = await prisma.demandes.findUnique({
      where: { id: parseInt(id) },
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
      where: { id: parseInt(demande_id) },
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

    if (!user_id) return res.status(403).json({ message: "Utilisateur non authentifié." });

    const user = await prisma.users.findUnique({
      where: { id_user: parseInt(user_id) },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const newValidation = await prisma.validation_demande.create({
      data: {
        id_demande: parseInt(demande_id),
        commentaire,
        id_user: user_id ? parseInt(user_id) : null,
        nom_validateur: user.fullname,
        date_validation_demande: new Date(),
        signature,
        statut_validation_demande: "valide",
      },
    });

    await prisma.demandes.update({
      where: { id: parseInt(demande_id) },
      data: { statut_demande: "valide" },
    });

    /************************************     GESTION MOUVEMENT DE STOCK     *****************************/

    const detailsMouvement = typeof demande.details_demande === "string" ? JSON.parse(demande.details_demande) : demande.details_demande;

    const typeMouvement = detailsMouvement.typeMouvement
    let dataMouvement = null
    let initial = 0
    let stock = 0
    let final = 0
    let finalPiece = Number(detailsMouvement.stockFinalPiece)
    let finalPieceLot = 0
    let mouvement_stock = null
    const modelPiece = parseInt(detailsMouvement.model)
    const servicePiece = parseInt(detailsMouvement.service)
    const pieceId = demande.item_id

    let dataEntree = null
    let initialDemandeur = 0
    let finalDemandeur = 0
    const finalPieceDemandeur = Number(detailsMouvement.stockFinalPieceDemandeur)
    let mouvement_stock_demandeur = null
    const serviceDemandeur = parseInt(demande.service_demandeur)

    let updatedQuantiteDemandeur = null

    const quantiteDemandeur = await prisma.stock_piece.findFirst({
      where: {
        piece_id: pieceId,
        model_id: modelPiece,
        service_id: serviceDemandeur,
      }
    })

    if (quantiteDemandeur) {
      const dataToUpdate = {
        quantite: finalPieceDemandeur
      }
      updatedQuantiteDemandeur = await prisma.stock_piece.update({
        where: {
          id: quantiteDemandeur.id,
          piece_id: pieceId,
          model_id: modelPiece,
          service_id: serviceDemandeur,
        },
        data: dataToUpdate
      })
    } else {
      updatedQuantiteDemandeur = await prisma.stock_piece.create({
        data: {
          piece_id: pieceId,
          model_id: modelPiece,
          service_id: serviceDemandeur,
          quantite: finalPieceDemandeur,
        }
      })

      const itemServiceDemandeur = await prisma.items_services.findFirst({
        where: {
          item_id: pieceId,
          service_id: serviceDemandeur
        }
      })
      if (!itemServiceDemandeur) {
        await prisma.items_services.create({
          data: {
            item_id: pieceId,
            service_id: serviceDemandeur
          }
        })
      }
    }

    if (typeMouvement == 5) {
      initial = Number(detailsMouvement.stockInitial)
      stock = Number(detailsMouvement.quantiteMouvement)
      final = Number(detailsMouvement.stockFinal)
      dataMouvement = {
        type: 'sortie',
        mouvement: 5,
        demande_id: demande.id,
        date: new Date(),
        piece_id: pieceId,
        service_origine: servicePiece,
        service_destination: parseInt(demande.service_demandeur),
        model_id: modelPiece,
        stock_initial: initial,
        quantite: stock,
        stock_final: final,
        quantite_totale_piece: final,
        motif: demande.motif_demande,
        commentaire,
        details_mouvement: JSON.stringify(detailsMouvement),
      }
      mouvement_stock = await prisma.mouvement_stock.create({
        data: dataMouvement,
      })

      const quantite = await prisma.stock_piece.findFirst({
        where: {
          piece_id: pieceId,
          model_id: modelPiece,
          service_id: servicePiece,
        }
      })
      await prisma.stock_piece.update({
        where: {
          id: quantite.id,
          piece_id: pieceId,
          model_id: modelPiece,
          service_id: servicePiece,
        },
        data: {
          quantite: final
        }
      })

      initialDemandeur = Number(detailsMouvement.stockInitialPieceDemandeur)
      finalDemandeur = Number(detailsMouvement.stockFinalPieceDemandeur)
      dataEntree = {
        type: 'entree',
        mouvement: 5,
        demande_id: demande.id,
        date: new Date(),
        piece_id: pieceId,
        service_origine: servicePiece,
        service_destination: parseInt(demande.service_demandeur),
        model_id: modelPiece,
        stock_initial: initialDemandeur,
        quantite: stock,
        stock_final: finalDemandeur,
        quantite_totale_piece: finalPieceDemandeur,
        motif: demande.motif_demande,
        commentaire,
        details_mouvement: JSON.stringify(detailsMouvement),
      }

      mouvement_stock_demandeur = await prisma.mouvement_stock.create({
        data: dataEntree,
      })
    } else if (typeMouvement == 4) {
      initial = Number(detailsMouvement.stockInitialCarton)
      stock = Number(detailsMouvement.quantiteMouvementCarton)
      final = Number(detailsMouvement.stockFinalCarton)
      dataMouvement = {
        type: 'sortie',
        mouvement: 4,
        demande_id: demande.id,
        date: new Date(),
        piece_id: pieceId,
        service_origine: servicePiece,
        service_destination: parseInt(demande.service_demandeur),
        model_id: modelPiece,
        stock_initial: initial,
        quantite: stock,
        stock_final: final,
        quantite_totale_piece: finalPiece,
        motif: demande.motif_demande,
        commentaire,
        details_mouvement: JSON.stringify(detailsMouvement),
      }
      mouvement_stock = await prisma.mouvement_stock.create({
        data: dataMouvement,
      })

      const quantite = await prisma.stock_piece.findFirst({
        where: {
          piece_id: pieceId,
          model_id: modelPiece,
          service_id: servicePiece,
        }
      })
      await prisma.stock_piece.update({
        where: {
          id: quantite.id,
          piece_id: pieceId,
          model_id: modelPiece,
          service_id: servicePiece,
        },
        data: {
          quantite: finalPiece
        }
      })

      const listCarton = detailsMouvement.cartons
      for (let id of listCarton) {
        await prisma.stock_carton.update({
          where: {
            id: parseInt(id)
          },
          data: {
            service_id: serviceDemandeur,
          }
        })
      }

      initialDemandeur = Number(detailsMouvement.stockInitialCartonDemandeur)
      finalDemandeur = Number(detailsMouvement.stockFinalCartonDemandeur)
      dataEntree = {
        type: 'entree',
        mouvement: 4,
        demande_id: demande.id,
        date: new Date(),
        piece_id: pieceId,
        service_origine: servicePiece,
        service_destination: parseInt(demande.service_demandeur),
        model_id: modelPiece,
        stock_initial: initialDemandeur,
        quantite: stock,
        stock_final: finalDemandeur,
        quantite_totale_piece: finalPieceDemandeur,
        motif: demande.motif_demande,
        commentaire,
        details_mouvement: JSON.stringify(detailsMouvement),
      }

      mouvement_stock_demandeur = await prisma.mouvement_stock.create({
        data: dataEntree,
      })
    } else if (typeMouvement == 3) {
      initial = Number(detailsMouvement.stockInitialPieceCarton)
      stock = Number(detailsMouvement.quantiteMouvementPieceCarton)
      final = Number(detailsMouvement.stockFinalPieceCarton)
      dataMouvement = {
        type: 'sortie',
        mouvement: 3,
        demande_id: demande.id,
        date: new Date(),
        piece_id: pieceId,
        service_origine: servicePiece,
        service_destination: parseInt(demande.service_demandeur),
        model_id: modelPiece,
        stock_initial: initial,
        quantite: stock,
        stock_final: final,
        quantite_totale_piece: finalPiece,
        motif: demande.motif_demande,
        commentaire,
        details_mouvement: JSON.stringify(detailsMouvement),
      }
      mouvement_stock = await prisma.mouvement_stock.create({
        data: dataMouvement,
      })

      const quantite = await prisma.stock_piece.findFirst({
        where: {
          piece_id: pieceId,
          model_id: modelPiece,
          service_id: servicePiece,
        }
      })
      await prisma.stock_piece.update({
        where: {
          id: quantite.id,
          piece_id: pieceId,
          model_id: modelPiece,
          service_id: servicePiece,
        },
        data: {
          quantite: finalPiece
        }
      })

      await prisma.stock_carton.update({
        where: { id: parseInt(detailsMouvement.selectedCarton) },
        data: {
          quantite_totale_piece: final
        },
      })

      if (final == 0) {
        await prisma.stock_carton.update({
          where: { id: parseInt(detailsMouvement.selectedCarton) },
          data: {
            quantite_totale_piece: final,
            is_deleted: true,
          },
        })
      }

      if (detailsMouvement.selectedLot) {
        const finalPieceLot = Number(detailsMouvement.stockFinalPieceLot)
        let updatedLot = await prisma.stock_lot.update({
          where: {
            id: parseInt(detailsMouvement.selectedLot)
          },
          data: {
            quantite_piece: finalPieceLot,
          }
        })
        if (final == 0) {
          updatedLot = await prisma.stock_lot.update({
            where: {
              id: parseInt(detailsMouvement.selectedLot)
            },
            data: {
              quantite_piece: finalPieceLot,
              quantite_carton: updatedLot.quantite_carton - 1,
            },
          })
        }
        if (updatedLot.quantite_carton == 0) {
          updatedLot = await prisma.stock_lot.update({
            where: {
              id: parseInt(detailsMouvement.selectedLot)
            },
            data: {
              quantite_piece: finalPieceLot,
              quantite_carton: 0,
              is_deleted: true
            }
          })
        }
      }

      initialDemandeur = Number(detailsMouvement.stockInitialPieceDemandeur)
      finalDemandeur = Number(detailsMouvement.stockFinalPieceDemandeur)
      dataEntree = {
        type: 'entree',
        mouvement: 5,
        demande_id: demande.id,
        date: new Date(),
        piece_id: pieceId,
        service_origine: servicePiece,
        service_destination: parseInt(demande.service_demandeur),
        model_id: modelPiece,
        stock_initial: initialDemandeur,
        quantite: stock,
        stock_final: finalDemandeur,
        quantite_totale_piece: finalPieceDemandeur,
        motif: demande.motif_demande,
        commentaire,
        details_mouvement: JSON.stringify(detailsMouvement),
      }

      mouvement_stock_demandeur = await prisma.mouvement_stock.create({
        data: dataEntree,
      })
    } else if (typeMouvement == 2) {
      initial = Number(detailsMouvement.stockInitialCartonLot)
      stock = Number(detailsMouvement.quantiteMouvementCartonLot)
      final = Number(detailsMouvement.stockFinalCartonLot)
      finalPieceLot = Number(detailsMouvement.stockFinalPieceLot)
      dataMouvement = {
        type: 'sortie',
        mouvement: 2,
        demande_id: demande.id,
        date: new Date(),
        piece_id: pieceId,
        service_origine: servicePiece,
        service_destination: parseInt(demande.service_demandeur),
        model_id: modelPiece,
        stock_initial: initial,
        quantite: stock,
        stock_final: final,
        quantite_totale_piece: finalPiece,
        motif: demande.motif_demande,
        commentaire,
        details_mouvement: JSON.stringify(detailsMouvement),
      }
      mouvement_stock = await prisma.mouvement_stock.create({
        data: dataMouvement,
      })

      const quantite = await prisma.stock_piece.findFirst({
        where: {
          piece_id: pieceId,
          model_id: modelPiece,
          service_id: servicePiece,
        }
      })
      await prisma.stock_piece.update({
        where: {
          id: quantite.id,
          piece_id: pieceId,
          model_id: modelPiece,
          service_id: servicePiece,
        },
        data: {
          quantite: finalPiece
        }
      })

      let updatedLot = await prisma.stock_lot.update({
        where: {
          id: parseInt(detailsMouvement.selectedLot),
        },
        data: {
          quantite_carton: final,
          quantite_piece: finalPieceLot,
        },
      })

      if (final == 0) {
        updatedLot = await prisma.stock_lot.update({
          where: {
            id: parseInt(detailsMouvement.selectedLot),
          },
          data: {
            quantite_carton: final,
            quantite_piece: finalPieceLot,
            is_deleted: true,
          },
        })
      }

      const listCartonLot = detailsMouvement.cartons
      for (let id of listCartonLot) {
        await prisma.stock_carton.update({
          where: {
            id: parseInt(id),
            lot_id: updatedLot.id,
          },
          data: {
            service_id: serviceDemandeur,
            lot_id: null
          }
        })
      }

      initialDemandeur = Number(detailsMouvement.stockInitialCartonDemandeur)
      finalDemandeur = Number(detailsMouvement.stockFinalCartonDemandeur)
      dataEntree = {
        type: 'entree',
        mouvement: 4,
        demande_id: demande.id,
        date: new Date(),
        piece_id: pieceId,
        service_origine: servicePiece,
        service_destination: parseInt(demande.service_demandeur),
        model_id: modelPiece,
        stock_initial: initialDemandeur,
        quantite: stock,
        stock_final: finalDemandeur,
        quantite_totale_piece: finalPieceDemandeur,
        motif: demande.motif_demande,
        commentaire,
        details_mouvement: JSON.stringify(detailsMouvement),
      }

      mouvement_stock_demandeur = await prisma.mouvement_stock.create({
        data: dataEntree,
      })

    } else if (typeMouvement == 1) {
      initial = Number(detailsMouvement.stockInitialLot)
      stock = Number(detailsMouvement.quantiteMouvementLot)
      final = Number(detailsMouvement.stockFinalLot)
      dataMouvement = {
        type: 'sortie',
        mouvement: 1,
        demande_id: demande.id,
        date: new Date(),
        piece_id: pieceId,
        service_origine: servicePiece,
        service_destination: parseInt(demande.service_demandeur),
        model_id: modelPiece,
        stock_initial: initial,
        quantite: stock,
        stock_final: final,
        quantite_totale_piece: finalPiece,
        motif: demande.motif_demande,
        commentaire,
        details_mouvement: JSON.stringify(detailsMouvement),
      }
      mouvement_stock = await prisma.mouvement_stock.create({
        data: dataMouvement,
      })

      const quantite = await prisma.stock_piece.findFirst({
        where: {
          piece_id: pieceId,
          model_id: modelPiece,
          service_id: servicePiece,
        }
      })
      await prisma.stock_piece.update({
        where: {
          id: quantite.id,
          piece_id: pieceId,
          model_id: modelPiece,
          service_id: servicePiece,
        },
        data: {
          quantite: finalPiece
        }
      })

      const listLot = detailsMouvement.listeLots
      for (let id of listLot) {
        await prisma.stock_lot.update({
          where: {
            id: parseInt(id)
          },
          data: {
            service_id: serviceDemandeur,
          }
        })
        await prisma.stock_carton.updateMany({
          where: {
            lot_id: parseInt(id)
          },
          data: {
            service_id: serviceDemandeur,
          }
        })
      }

      initialDemandeur = Number(detailsMouvement.stockInitialLotDemandeur)
      finalDemandeur = Number(detailsMouvement.stockFinalLotDemandeur)
      dataEntree = {
        type: 'entree',
        mouvement: 1,
        demande_id: demande.id,
        date: new Date(),
        piece_id: pieceId,
        service_origine: servicePiece,
        service_destination: parseInt(demande.service_demandeur),
        model_id: modelPiece,
        stock_initial: initialDemandeur,
        quantite: stock,
        stock_final: finalDemandeur,
        quantite_totale_piece: finalPieceDemandeur,
        motif: demande.motif_demande,
        commentaire,
        details_mouvement: JSON.stringify(detailsMouvement),
      }

      mouvement_stock_demandeur = await prisma.mouvement_stock.create({
        data: dataEntree,
      })
    }

    /************************************     GESTION MAILS     **************************************/

    const piece = await prisma.items.findUnique({
      where: {
        id_piece: parseInt(demande.item_id)
      }
    });

    const service = await prisma.services.findUnique({
      where: {
        id: parseInt(demande.service_demandeur)
      }
    })

    const userService = await prisma.user_services.findMany({
      where: {
        service_id: parseInt(demande.service_demandeur)
      },
      include: {
        users: true
      }
    })

    const service_users = userService.map(us => us.users)
    const demandeur = await prisma.users.findUnique({
      where: {
        id_user: demande.user_id
      }
    })

    let motif = demande.motif_demande
    let nomPiece = piece.nom_piece.toUpperCase()

    let nomServiceDemandeur = service.nom_service.toUpperCase();

    let quantite = demande.qte_total_demande;
    let commentaire_mail = commentaire ? commentaire : '(sans commentaire)';
    const url = GENERAL_URL
    let demandeLink = `${url}/demande-details/${demande.id}`;
    const sendMail = require("../../utils/emailSender");
    if ((service_users && service_users.length > 0) || demandeur) {
      const subject = `NOUVELLE DEMANDE POUR ${motif}`;
      const html = `
        <p>Bonjour,</p>
        <p>La demande ${demande.id} a été validée.</p>
        <ul>
          <li><strong>Demande de :</strong> ${nomPiece}</li>
          <li><strong>Nombre de produits:</strong> ${quantite}</li>
        </ul>
        <ul>
          <li><strong>Service demandeur:</strong> ${nomServiceDemandeur}</li>
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
      await sendMail({
        to: demandeur.email,
        subject,
        html,
      });
      for (const service_user of service_users) {
        await sendMail({
          to: service_user.email,
          subject,
          html,
        });
      }
    }
    return res.status(201).json(newValidation, mouvement_stock, mouvement_stock_demandeur, updatedQuantiteDemandeur);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// Retourner une demande
const returnDemande = async (req, res) => {
  const {
    demande_id,
    commentaire_return,
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

    if (!commentaire_return) {
      return res.status(400).json({ message: "Commentaire de retour requis." });
    }

    if (!user_id) return res.status(403).json({ message: "Utilisateur non authentifié." });

    const user = await prisma.users.findUnique({
      where: { id_user: parseInt(user_id) },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const newValidation = await prisma.validation_demande.create({
      data: {
        id_demande: parseInt(demande_id),
        commentaire: commentaire_return,
        id_user: user_id ? parseInt(user_id) : null,
        nom_validateur: user.fullname,
        date_validation_demande: new Date(),
        signature: 'retournée',
        statut_validation_demande: "retourne",
      },
    });

    await prisma.demandes.update({
      where: { id: parseInt(demande_id) },
      data: { statut_demande: 'retourne' },
    });

    /************************************     GESTION MAILS     **************************************/

    const piece = await prisma.items.findUnique({
      where: {
        id_piece: parseInt(demande.itemId)
      }
    });

    const service = await prisma.services.findUnique({
      where: {
        id: parseInt(demande.service_demandeur)
      }
    })

    const userService = await prisma.user_services.findMany({
      where: {
        service_id: parseInt(demande.service_demandeur)
      },
      include: {
        users: true
      }
    })

    const service_users = userService.map(us => us.users)
    const demandeur = await prisma.users.findUnique({
      where: {
        id_user: demande.user_id
      }
    })

    let motif = demande.motif_demande
    let demandeTypeName = piece.nom_piece.toUpperCase()

    let serviceDemandeur = service.nom_service.toUpperCase();

    let quantite = demande.qte_total_demande;
    let commentaire_mail = commentaire_return ? commentaire_return : '(sans commentaire)';
    const url = GENERAL_URL
    let demandeLink = `${url}/demande-details/${demande.id}`;
    const sendMail = require("../../utils/emailSender");
    if ((service_users && service_users.length > 0) || demandeur) {
      const subject = `DEMANDE RETOURNÉE`;
      const html = `
      <p>Bonjour,</p>
      <p>La demande ${demande.id} pour ${motif} a été retournée.</p>
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
      await sendMail({
        to: demandeur.email,
        subject,
        html,
      });
      for (const service_user of service_users) {
        await sendMail({
          to: service_user.email,
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
  } = req.body;
  try {
    const demande = await prisma.demandes.findUnique({
      where: { id: parseInt(demande_id) },
    });

    if (!demande) return res.status(404).json({ message: "Demande introuvable." });

    if (demande.statut_demande === "valide") {
      return res.status(400).json({ message: "Demande déjà validée." });
    }

    if (!commentaire_refus) {
      return res.status(400).json({ message: "Commentaire d'annulation requis." });
    }

    if (!user_id) return res.status(403).json({ message: "Utilisateur non authentifié." });

    const user = await prisma.users.findUnique({
      where: { id_user: parseInt(user_id) },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const newValidation = await prisma.validation_demande.create({
      data: {
        id_demande: parseInt(demande_id),
        commentaire: commentaire_refus,
        id_user: user_id ? parseInt(user_id) : null,
        nom_validateur: user.fullname,
        date_validation_demande: new Date(),
        signature: 'refusée',
        statut_validation_demande: "refuse",
      },
    });

    await prisma.demandes.update({
      where: { id_demande: parseInt(demande_id) },
      data: { statut_demande: 'refuse' },
    });


    /************************************     GESTION MAILS     **************************************/

    const piece = await prisma.stock_dt.findUnique({
      where: {
        id_piece: parseInt(demande.type_demande_id)
      }
    });

    const service = await prisma.services.findUnique({
      where: {
        id: parseInt(demande.service_demandeur)
      }
    })

    const userService = await prisma.user_services.findMany({
      where: {
        service_id: parseInt(demande.service_demandeur)
      },
      include: {
        users: true
      }
    })

    const service_users = userService.map(us => us.users)
    const demandeur = await prisma.users.findUnique({
      where: {
        id_user: demande.user_id
      }
    })

    let motif = demande.motif_demande
    let demandeTypeName = piece.nom_piece.toUpperCase()

    let serviceDemandeur = service.nom_service.toUpperCase();

    let quantite = demande.qte_total_demande;
    let commentaire_mail = commentaire_refus ? commentaire_refus : '(sans commentaire)';
    const url = GENERAL_URL
    let demandeLink = `${url}/demande-details/${demande.id_demande}`;
    // const demandeLink = `https://livraisons.greenpayci.com/formulaire-recu/${nouvelleLivraison.id_demande}`
    const sendMail = require("../../utils/emailSender");
    if ((service_users && service_users.length > 0) || demandeur) {
      const subject = `DEMANDE REFUSÉE`;
      const html = `
      <p>Bonjour,</p>
      <p>La demande ${demande.id_demande} pour ${motif} a été refusée.</p>
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
      await sendMail({
        to: demandeur.email,
        subject,
        html,
      });
      for (const service_user of service_users) {
        await sendMail({
          to: service_user.email,
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
    nom_demandeur,
    user_id,
    type_demande_id,
    service_id,
    role_validateur,
    id_demandeur,
    qte_total_demande,
    motif_demande,
    otherFields,
  } = req.body;

  try {

    const produits = typeof produitsDemandes === "string"
      ? JSON.parse(produitsDemandes)
      : produitsDemandes;

    const autres = typeof otherFields === "string"
      ? JSON.parse(otherFields)
      : otherFields

    let utilisateur = null;

    utilisateur = await prisma.users.findUnique({
      where: {
        id_user: parseInt(user_id)
      }
    })

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const dataToUpdate = {
      nom_demandeur: nom_demandeur ? nom_demandeur : '',
      date_demande: new Date(),
      commentaire,
      signature_demandeur: '',
      qte_total_demande: parseInt(qte_total_demande),
      produit_demande: typeof produitsDemandes === "string" ? produitsDemandes : JSON.stringify(produitsDemandes),
      statut_demande: "en_cours",
      user_id: utilisateur ? utilisateur.id_user : null,
      type_demande_id: parseInt(type_demande_id),
      role_id_recepteur: parseInt(role_validateur),
      id_demandeur: parseInt(id_demandeur) || null,
      motif_demande: motif_demande || null,
      service_demandeur: parseInt(service_id),
      champs_autre: JSON.stringify(autres),
    };

    const updated = await prisma.demandes.update({
      where: { id_demande: parseInt(id) },
      data: dataToUpdate
    });


    /************************** GESTION DES MAILS ********************************/


    const piece = await prisma.stock_dt.findUnique({
      where: {
        id_piece: parseInt(type_demande_id)
      }
    });

    const service = await prisma.services.findUnique({
      where: {
        id: parseInt(service_id)
      }
    })

    const userService = await prisma.user_services.findMany({
      where: {
        service_id: parseInt(service_id)
      },
      include: {
        users: true
      }
    })

    const userRole = await prisma.user_roles.findMany({
      where: {
        role_id: parseInt(role_validateur)
      },
      include: {
        users: true
      }
    })

    const service_users = userService.map(us => us.users)
    const validateurs = userRole.map(us => us.users)

    let motif = motif_demande
    let demandeTypeName = piece.nom_piece.toUpperCase()

    let serviceDemandeur = service.nom_service.toUpperCase();

    let quantite = updated.qte_total_demande;
    let commentaire_mail = updated.commentaire ? updated.commentaire : '(sans commentaire)';
    const url = GENERAL_URL
    let demandeLink = `${url}/demande-details/${updated.id_demande}`;
    // const demandeLink = `https://livraisons.greenpayci.com/formulaire-recu/${nouvelleLivraison.id_demande}`

    let attachments = []
    // attachments = uploadedFiles.map((url, index) => ({
    //   filename: `fichier-${index + 1}${path.extname(url) || '.pdf'}`, // fallback to .pdf
    //   path: url
    // }));

    console.log(attachments.length, attachments)
    const sendMail = require("../../utils/emailSender");

    if ((service_users && service_users.length > 0) || (validateurs && validateurs.length > 0)) {
      const subject = `MODIFICATION DEMANDE ${motif}`;
      let html = `
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
      for (const service_user of service_users) {
        await sendMail({
          to: service_user.email,
          subject,
          html,
          attachments
        });
      }
      for (const validateur of validateurs) {
        await sendMail({
          to: validateur.email,
          subject,
          html,
          attachments
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
    const demande_data = await prisma.demandes.findUnique({
      where: { id_demande: parseInt(id) },
      include: {
        validation_demande: true,
      }
    });

    console.log("demande data: ", demande_data)

    const livraison_data = await prisma.livraison_piece.findFirst({
      where: { demande_id: parseInt(id) },
      include: {
        Livraisons: {
          include: {
            reception_livraison: true
          }
        }
      }
    })

    console.log("livraison data: ", livraison_data)

    if (!demande_data) return res.status(404).json({ message: "Demande introuvable" });
    if (demande_data.validation_demande.length < 1) return res.status(400).json({ message: "Aucune validation trouvée" });

    const demande = {
      ...demande_data,
      produitsDemandes: typeof demande_data.produit_demande === "string"
        ? JSON.parse(demande_data.produit_demande)
        : demande_data.produit_demande,
    };

    const piece = await prisma.stock_dt.findUnique({
      where: {
        id_piece: parseInt(demande.type_demande_id)
      }
    })

    const champsAutres = JSON.parse(demande_data.champs_autre)
    let champsAutresLivraison = null

    // 🔎 Récupération de l'agent qui a fait la demande (si user_id défini)
    let nomDemandeur = "N/A";
    if (demande.nom_demandeur) {
      nomDemandeur = demande.nom_demandeur;
    } else if (demande.user_id) {
      const user = await prisma.users.findUnique({
        where: { id_user: demande.user_id }
      });
      nomDemandeur = user.fullname
    }


    let service_demandeur = "N/A"
    const service = await prisma.services.findUnique({
      where: {
        id: parseInt(demande.service_demandeur)
      }
    })
    if (service) {
      service_demandeur = service.nom_service.toUpperCase()
    }


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

    const autresChamps = champsAutres.map((data, index) => {
      let row = ""
      row = `<tr><th>${data.titre}</th><th>${data.information}</th></tr>`

      if ((index + 1) % 20 === 0) {
        row += `<tr class="page-break"></tr>`;
      }

      return row
    }).join("\n");

    let autresChampsLivraison = []

    // 🗺️ Sélection du template
    const templatesMap = {
      1: "demande_DT.html",
      2: "demande_livraison.html"
    };

    let templateFile = templatesMap[1];

    let index = demande.validation_demande.length - 1

    let produits = JSON.parse(demande_data.produit_demande)
    let quantite = produits.quantite
    let stock_initial = produits.stockDepart
    let stock_final = stock_initial - quantite
    let nomValidateur = demande.validation_demande[index].nom_validateur
    let signature_validation = demande.validation_demande[index].signature
    let date_validation = demande.validation_demande[index].date_validation_demande
    let commentaire_validation = demande.validation_demande[index].commentaire

    let signature_livraison = 'N/A'
    let date_livraison = 'N/A'
    let signature_reception = 'N/A'
    let date_reception = 'N/A'
    let nom_livreur = 'N/A'
    let nom_recepteur = 'N/A'
    let commentaire_livraison = 'N/A'
    let commentaire_reception = 'N/A'
    let quantite_livraison = 'N/A'



    if (livraison_data && livraison_data.Livraisons.reception_livraison.length > 0) {

      champsAutresLivraison = JSON.parse(livraison_data.Livraisons.autres_champs_livraison)
      autresChampsLivraison = champsAutresLivraison.map((data, index) => {
        let row = ""
        row = `<tr><th>${data.titre}</th><th>${data.information}</th></tr>`

        if ((index + 1) % 20 === 0) {
          row += `<tr class="page-break"></tr>`;
        }

        return row
      }).join("\n");


      templateFile = templatesMap[2]
      let index_reception = livraison_data.Livraisons.reception_livraison.length - 1

      signature_livraison = livraison_data.Livraisons.signature_expediteur
      date_livraison = livraison_data.Livraisons.date_livraison
      signature_reception = livraison_data.Livraisons.reception_livraison[index_reception].signature_recepteur
      date_reception = livraison_data.Livraisons.reception_livraison[index_reception].date_reception
      nom_livreur = livraison_data.Livraisons.nom_livreur
      nom_recepteur = livraison_data.Livraisons.reception_livraison[index_reception].nom_recepteur
      commentaire_livraison = livraison_data.Livraisons.commentaire_livraison
      commentaire_reception = livraison_data.Livraisons.reception_livraison[index_reception].commentaire_reception
      quantite_livraison = livraison_data.Livraisons.quantite_livraison
    }

    const filePath = path.join(__dirname, "../../statics/templates/", templateFile);
    let html = fs.readFileSync(filePath, "utf8");

    html = html
      .replaceAll("{{commentaire}}", demande.commentaire)
      .replaceAll("{{commentaire_validation}}", commentaire_validation)
      .replaceAll("{{commentaire_livraison}}", commentaire_livraison)
      .replaceAll("{{commentaire_reception}}", commentaire_reception)
      .replaceAll("{{date_demande}}", formatDate(demande.date_demande))
      .replaceAll("{{pieces_demandees}}", piece.nom_piece.toUpperCase())
      .replaceAll("{{motif_demande}}", demande.motif_demande)
      // .replaceAll("{{qte_total_demande}}", demande.qte_total_demande || demande.produit_demande.length)
      .replaceAll("{{nom_validateur}}", nomValidateur)
      .replaceAll("{{nom_demandeur}}", nomDemandeur)
      .replaceAll("{{service_demandeur}}", service_demandeur)
      .replaceAll("{{quantite}}", quantite)
      .replaceAll("{{quantite_livraison}}", quantite_livraison)
      .replaceAll("{{stock_initial}}", stock_initial)
      .replaceAll("{{stock_final}}", stock_final)
      .replaceAll("{{signature}}", signature_validation ? signature_validation : '#')
      .replaceAll("{{date_validation_demande}}", formatDate(date_validation))
      .replaceAll("{{nom_livreur}}", nom_livreur)
      .replaceAll("{{signature_livraison}}", signature_livraison ? signature_livraison : '#')
      .replaceAll("{{date_livraison}}", formatDate(date_livraison))
      .replaceAll("{{nom_recepteur}}", nom_recepteur)
      .replaceAll("{{signature_reception}}", signature_reception ? signature_reception : '#')
      .replaceAll("{{date_reception}}", formatDate(date_reception))
      .replace("{{autre_champs}}", autresChamps ? autresChamps : '')
      .replace("{{autre_champs_livraison}}", autresChampsLivraison ? autresChampsLivraison : '')

    // 🖨️ Génération PDF
    const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
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