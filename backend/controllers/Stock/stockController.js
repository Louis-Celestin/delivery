const TEST_ENV = require("../../utils/consts")
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../../config/clouddinaryConifg");
const upload = require("../../middlewares/uploads");

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

const addPiece = async (req, res) =>{
  try{
    const {
      nomPiece,
      type,
      itemModels,
      itemServices,
      code_piece,
      user_id,
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

    const nouvellePiece = await prisma.items.create({
      data:{
        nom_piece: nomPiece,
        quantite: 0,
        type: type,
        code_piece,
        created_by: nomUser,
        user_id: parseInt(user_id),
      }
    })

    const pieceId = nouvellePiece.id_piece

    if (itemModels && Array.isArray(itemModels)) {
      await prisma.items_models.createMany({
        data: itemModels.map(modelId => ({
          item_id: pieceId,
          model_id: modelId,
        })),
      });
    }

    if (itemServices && Array.isArray(itemServices)) {
      await prisma.items_services.createMany({
        data: itemServices.map(serviceId => ({
          item_id: pieceId,
          service_id: serviceId,
        })),
      });
    }

    res.status(201).json({
      message: "Nouvelle pièce enregistrée avec succès",
      stock_dt: nouvellePiece
    });
  } catch (error) {
    console.log("Erreur lors de la création :", error);
    res.status(500).json({ message: "Erreur interne", error });
  }
}

const getAllStock = async (req, res) =>{
  try {
    const items = await prisma.items.findMany({
      orderBy: { nom_piece: 'asc' },
    });

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du stock", error });
  }
}

const getPiece = async (req, res) =>{
  const { id } = req.params;
  try {
    const piece = await prisma.items.findUnique({
      where:{
        id_piece: parseInt(id)
      }
    })

    if(!piece){
      return res.status(404).json({message : "Pièce introuvable !"})
    }

    return res.status(200).json(piece)
  } catch(error) {
    res.status(500).json({message: "Erreur serveur", error})
    console.log(error)
  }
}

const modifyPiece = async (req, res) =>{
  try{
    const {
      id
    } = req.params
    const {
      nomPiece,
      type,
      itemModels,
      itemServices,
      code_piece,
      user_id,
    } = req.body

    const piece = await prisma.items.findUnique({
      where:{
        id_piece: parseInt(id)
      }
    })

    if(!piece){
      return res.status(404).json({message : "Pièce introuvable !"})
    }

    const dataToUpdate = {
      nom_piece: nomPiece,
      type: type,
      code_piece,
      user_id: parseInt(user_id),
    }

    await prisma.items_models.deleteMany({
      where:{
        item_id: parseInt(id)
      }
    })

    await prisma.items_services.deleteMany({
      where:{
        item_id: parseInt(id)
      }
    })

    if (itemModels && Array.isArray(itemModels)) {
      await prisma.items_models.createMany({
        data: itemModels.map(modelId => ({
          item_id: piece.id_piece,
          model_id: modelId,
        })),
      });
    }

    if (itemServices && Array.isArray(itemServices)) {
      await prisma.items_services.createMany({
        data: itemServices.map(serviceId => ({
          item_id: piece.id_piece,
          service_id: serviceId,
        })),
      });
    }

    const pieceUpdated = await prisma.items.update({
      where:{
        id_piece: parseInt(id),
      },
      data: dataToUpdate,
    })

    return res.status(200).json(pieceUpdated)

  }catch(error){
    console.log(error);
    return res.status(500).json({ message: "Erreur lors de la mise à jour", error });
  }
}

const getAllModels = async (req, res) =>{
  try {
    const models = await prisma.model_piece.findMany({
      orderBy: { id_model: 'asc' },
    });

    res.status(200).json(models);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des models", error });
  }
}

const getItemModels = async (req, res) =>{
  try{
    const { id } = req.params;

    const items_models = await prisma.items_models.findMany({
      where: {item_id : parseInt(id)},
      include: {model_piece : true}
    })

    res.status(200).json({
      model_piece: items_models.map(m => m.model_piece)
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
}

const getItemServices = async (req, res) =>{
  try{
    const { id } = req.params;

    const items_services = await prisma.items_services.findMany({
      where: {item_id : parseInt(id)},
      include: {services : true}
    })

    res.status(200).json({
      services: items_services.map(s => s.services)
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
}

// Attribuer une quantité à un stock choisi en fonction de l'ID du stock.
const setStockPiece = async (req, res) =>{

  const {
    item_id,
    model_id,
    service_id,
  } = req.params

  const {
    stockInitial,
    quantiteMouvement,
    stockFinal,
    motif,
    commentaire,
    isEntree,
    userId,
  } = req.body;

  try{

    let utilisateur = null;
    if(userId != null){
      utilisateur = await prisma.users.findUnique({
      where: {
        id_user: parseInt(userId)
      }})
      if (!utilisateur) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
    }

    const piece = await prisma.items.findUnique({
      where: {
        id_piece: parseInt(item_id)
      }
    })
    if(!piece){
      return res.status(404).json({ message: "Pièce non trouvée" });
    }

    const type = isEntree? 'entree' : 'sortie'

    const inital = Number(stockInitial)
    const stock = Number(quantiteMouvement)
    const final = Number(stockFinal)

    const mouvement = await prisma.mouvement_stock.create({
      data:{
        type,
        mouvement: 5,
        date: new Date(),
        piece_id: parseInt(item_id),
        service_origine: isEntree ? null : parseInt(service_id),
        service_destination: isEntree ? parseInt(service_id) : null,
        model_id: parseInt(model_id),
        stock_initial: inital,
        quantite: stock,
        stock_final: final,
        quantite_totale_piece: final,
        motif,
        commentaire,
      }
    })

    const quantite = await prisma.stock_piece.findFirst({
      where:{
        piece_id: parseInt(item_id),
        model_id: parseInt(model_id),
        service_id: parseInt(service_id),
      }
    })

    if(!quantite){
      const newQuantite = await prisma.stock_piece.create({
        data:{
          piece_id: parseInt(item_id),
          model_id: parseInt(model_id),
          service_id: parseInt(service_id),
          quantite: parseInt(stockFinal),
        }
      })
      return res.status(201).json(newQuantite, mouvement)
    }

    const dataToUpdate = {
      quantite : parseInt(stockFinal)
    }

    const updated_quantite = await prisma.stock_piece.update({
      where: {
        id: quantite.id,
        piece_id: parseInt(item_id),
        model_id: parseInt(model_id),
        service_id: parseInt(service_id),
      },
      data: dataToUpdate
    })

    return res.status(200).json(updated_quantite, mouvement);
  }catch(error){
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de la mise à jour", error });
  }
}

// Attribuer une quantité à un stock de cartons choisi en fonction de l'ID du stock.
const setStockCarton = async (req, res) =>{

  const {
    item_id,
    model_id,
    service_id,
  } = req.params

  const {
    stockInitalCarton,
    quantiteMouvementCarton,
    stockFinalCarton,
    details,
    motif,
    commentaire,
    isEntree,
    userId
  } = req.body;

  try{
    
    const detailsCartons = typeof details === "string" ? JSON.parse(details) : details;

    let utilisateur = null;
    if(userId != null){
      utilisateur = await prisma.users.findUnique({
      where: {
        id_user: parseInt(userId)
      }})
      if (!utilisateur) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
    }

    const piece = await prisma.items.findUnique({
      where: {
        id_piece: parseInt(item_id)
      }
    })
    if(!piece){
      return res.status(404).json({ message: "Pièce non trouvée" });
    }

    const type = isEntree? 'entree' : 'sortie'

    const initalCarton = Number(stockInitalCarton)
    const stockCarton = Number(quantiteMouvementCarton)
    const finalCarton = Number(stockFinalCarton)
    const finalPiece = Number(detailsCartons.stockFinalPiece)

    const mouvement = await prisma.mouvement_stock.create({
      data:{
        type,
        mouvement: 4,
        date: new Date(),
        piece_id: parseInt(item_id),
        service_origine: isEntree ? null : parseInt(service_id),
        service_destination: isEntree ? parseInt(service_id) : null,
        model_id: parseInt(model_id),
        stock_initial: initalCarton,
        quantite: stockCarton,
        stock_final: finalCarton,
        quantite_totale_piece: finalPiece,
        motif,
        commentaire,
        details_mouvement: JSON.stringify(detailsCartons),
      }
    })

    const quantite = await prisma.stock_piece.findFirst({
      where:{
        piece_id: parseInt(item_id),
        model_id: parseInt(model_id),
        service_id: parseInt(service_id),
      }
    })
    
    const dataToUpdate = {
      quantite : parseInt(detailsCartons.stockFinalPiece)
    }
    
    let updatedQuantite = await prisma.stock_piece.update({
      where: {
        id: quantite.id,
        piece_id: parseInt(item_id),
        model_id: parseInt(model_id),
        service_id: parseInt(service_id),
      },
      data: dataToUpdate
    })
    
    if(!quantite){
      updatedQuantite = await prisma.stock_piece.create({
        data:{
          piece_id: parseInt(item_id),
          model_id: parseInt(model_id),
          service_id: parseInt(service_id),
          quantite: parseInt(detailsCartons.stockFinalPiece),
        }
      })
    }

    if (isEntree) {
      const listCarton = await prisma.stock_carton.findMany({
        where: { piece_id: parseInt(item_id) },
        orderBy: { numero_carton: "asc" },
      });
  
      const lastCarton = listCarton[listCarton.length - 1];
      const lastId = lastCarton ? lastCarton.numero_carton : 0;
      const piecesPerCarton = Number(detailsCartons.quantitePieceCarton);

      for (let i = 0; i < stockCarton; i++) {
        await prisma.stock_carton.create({
          data: {
            numero_carton: lastId + i + 1,
            piece_id: parseInt(item_id),
            model_id: parseInt(model_id),
            service_id: parseInt(service_id),
            quantite_piece_carton: piecesPerCarton,
            quantite_totale_piece: piecesPerCarton,
          },
        });
      }
    }else {
      const listCarton = detailsCartons.listeCartons
      for (let id of listCarton){
        await prisma.stock_carton.delete({
          where: {
            id: parseInt(id)
          },
        })
      }
    }

    return res.status(200).json(updatedQuantite, mouvement);
  }catch(error){
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de la mise à jour", error });
  }
}

const setStockPieceCarton = async (req, res) =>{
  
}

const setLotStock = async (req, res) =>{
  const {
    piece_id
  } = req.params

  const {
    totalLot,
    cartonLot,
    pieceCarton,
    motif,
    commentaire,
    isEntree,
    userId,
  } = req.body;

  try{
    const piece = await prisma.stock_dt.findUnique({
      where: {
        id_piece: parseInt(piece_id)
      }
    })
    
    if(!piece){
      return res.status(404).json({ message: "Pièce non trouvée" });
    }

    let utilisateur = null;
    if(userId != null){
      utilisateur = await prisma.users.findUnique({
      where: {
        id_user: parseInt(userId)
      }})
      if (!utilisateur) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
    }

    const listLot = await prisma.stock_lot.findMany({
      where:{
        piece_id: parseInt(piece_id)
      },
      orderBy: {numero_lot : 'asc'},
    })

    const total = Number(totalLot);
    const carton = Number(cartonLot);
    const piecesPerCarton = Number(pieceCarton);

    const lastLot = listLot[listLot.length - 1];
    const lastId = lastLot ? lastLot.numero_lot : 0;

    if(isEntree){
      for(let i=0; i < total; i++){
        await prisma.stock_lot.create({
          data:{
            numero_lot: lastId + i + 1,
            quantie_carton: carton,
            quantite_piece: carton * piecesPerCarton,
            piece_id: parseInt(piece_id)
          }
        })
      }
    }

    const type = isEntree? 'entree' : 'sortie'

    const mouvement = await prisma.mouvement_stock.create({
      data:{
        type,
        date: new Date(),
        piece_id: parseInt(piece_id),
        service_origine: updated_piece.service,
        service_destination: updated_piece.service,
        quantite: parseInt(stockFinal),
      }
    })

    return res.status(200).json(updated_piece);
  }catch(error){
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de la mise à jour", error });
  }
}

const getAllMouvementStock = async (req, res) =>{
  try {
    const mouvement = await prisma.mouvement_stock.findMany({
      orderBy: { id: 'desc' },
    });

    res.status(200).json(mouvement);
  } catch (error) {
    console.log("Error : ",error)
    res.status(500).json({ message: "Erreur lors de la récupération des entrées sorties", error });
  }
}

const getLotPiece = async (req, res) =>{
  const { item_id, model_id, service_id } = req.params
  try{
    const lot = await prisma.stock_lot.findMany({
      where:{
        where:{
          piece_id: parseInt(item_id),
          model_id: parseInt(model_id),
          service_id: parseInt(service_id)
        }
      },
      orderBy:{
        numero_lot: 'asc'
      },
    })
    if(!lot){
      console.log("Zero lot trouvé")
      return res.status(404).json({message: "Aucun lot trouvé pour cette pièce !"})
    }

    return res.status(200).json(lot)
  }catch(error){
    res.status(500).json({message: "Erreur serveur", error})
    console.log(error)
  }
}

const getCartonLot = async (req, res) =>{
  const { id } = req.params
  try{
    const carton = await prisma.stock_carton.findMany({
      where:{
        lot_id: parseInt(id)
      }
    })
    if(!carton){
      console.log("Zero carton trouvé")
      return res.status(404).json({message: "Aucun carton trouvé dans ce lot !"})
    }

    return res.status(200).json(carton)
  }catch(error){
    res.status(500).json({message: "Erreur serveur", error})
    console.log(error)
  }
}

const getCartonPiece = async (req, res) =>{
  const { item_id, model_id, service_id } = req.params
  try{
    const cartons = await prisma.stock_carton.findMany({
      where:{
        piece_id: parseInt(item_id),
        model_id: parseInt(model_id),
        service_id: parseInt(service_id)
      },
      orderBy:{
        numero_carton: 'asc'
      },

    })
    if(!cartons){
      console.log("Zero carton trouvé")
      return res.status(404).json({message: "Aucun carton trouvé pour cette pièce !"})
    }

    return res.status(200).json(cartons)
  }catch(error){
    res.status(500).json({message: "Erreur serveur", error})
    console.log(error)
  }
}

const getStockPiece = async (req, res) =>{
  const { item_id, model_id, service_id } = req.params
  try{
    const quantite = await prisma.stock_piece.findFirst({
      where:{
        piece_id: parseInt(item_id),
        model_id: parseInt(model_id),
        service_id: parseInt(service_id),
      },
    })
    if(!quantite){
      console.log("Stock pas encore initialisé")
      return res.status(404).json({message: "Stock pas encore initialisé"})
    }

    return res.status(200).json(quantite.quantite)
  }catch(error){
    res.status(500).json({message: "Erreur serveur", error})
    console.log(error)
  }
}

const getAllTypeMouvementStock = async (req, res) =>{
  try {
    const types = await prisma.type_mouvement_stock.findMany({
      orderBy: { id: 'asc' },
    });

    res.status(200).json(types);
  } catch (error) {
    console.log("Error : ",error)
    res.status(500).json({ message: "Erreur lors de la récupération des types de mouvement stock", error });
  }
}

module.exports = {
  setStockPiece,
  getAllStock,
  getAllModels,
  addPiece,
  getAllMouvementStock,
  getPiece,
  modifyPiece,
  getLotPiece,
  getCartonLot,
  getCartonPiece,
  getItemModels,
  getItemServices,
  getStockPiece,
  getAllTypeMouvementStock,
  setStockCarton,
}
