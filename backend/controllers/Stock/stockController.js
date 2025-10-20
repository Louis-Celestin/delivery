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

// Attribuer une quantité à un stock choisi en fonction de l'ID du stock.
const setStock = async (req, res) =>{

  const {
    piece_id
  } = req.params

  const {
    stockFinal,
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

    const dataToUpdate = {
      quantite : parseInt(stockFinal)
    }

    const updated_piece = await prisma.stock_dt.update({
      where: {id_piece: parseInt(piece_id)},
      data: dataToUpdate
    })

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

const getAllStock = async (req, res) =>{
  try {
    const stock = await prisma.stock_dt.findMany({
      orderBy: { nom_piece: 'asc' },
    });

    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du stock", error });
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

const addPiece = async (req, res) =>{
  try{
    const {
      nomPiece,
      modelId,
      serviceId,
      type,
      user_id,
      code_piece,
    } = req.body

    let existingPiece = await prisma.stock_dt.findFirst({
      where: {
        nom_piece: nomPiece,
        model_id: parseInt(modelId),
      }
    })
    if(existingPiece){
      console.log("Pièce déjà existante")
      return res.status(400).json({ message: "Pièce déjà existante" });
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

    const nouvellePiece = await prisma.stock_dt.create({
      data:{
        nom_piece: nomPiece,
        quantite: 0,
        model_id: parseInt(modelId),
        type: type,
        code_piece,
        service: parseInt(serviceId),
        created_by: nomUser,
        user_id: parseInt(user_id),
      }
    })

    res.status(201).json({
      message: "Nouvelle pièce enregistrée avec succès",
      stock_dt: nouvellePiece
    });
  } catch (error) {
    console.log("Erreur lors de la création :", error);
    res.status(500).json({ message: "Erreur interne", error });
  }
}

const modifyPiece = async (req, res) =>{
  try{
    const {
      id
    } = req.params
    const {
      nomPiece,
      modelId,
      type,
      serviceId,
      user_id,
      codePiece: code_piece,
    } = req.body

    const piece = await prisma.stock_dt.findUnique({
      where:{
        id_piece: parseInt(id)
      }
    })

    if(!piece){
      return res.status(404).json({message : "Pièce introuvable !"})
    }

    const dataToUpdate = {
      nom_piece: nomPiece,
      model_id: parseInt(modelId),
      type: type,
      code_piece,
      service: parseInt(serviceId),
      user_id: parseInt(user_id),
    }

    const pieceUpdated = await prisma.stock_dt.update({
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

const getAllMouvementStock = async (req, res) =>{
  try {
    const mouvement = await prisma.mouvement_stock.findMany({
      orderBy: { id: 'asc' },
    });

    res.status(200).json(mouvement);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des entrées sorties", error });
  }
}

const getPiece = async (req, res) =>{
  const { id } = req.params;
  try {
    const piece = await prisma.stock_dt.findUnique({
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

// Augmenter la quantité d'un stock
const plusQte = async (req, res) =>{
}


// Diminuer la quantité d'un stock
const minusQte = async (req, res) =>{
}

module.exports = {
  setStock,
  getAllStock,
  getAllModels,
  addPiece,
  getAllMouvementStock,
  getPiece,
  modifyPiece,
}
