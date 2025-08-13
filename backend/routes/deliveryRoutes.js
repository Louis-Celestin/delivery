const express = require("express")
const router = express.Router();
const upload = require("../middlewares/uploads");
// const multer = require("multer")
// const upload = multer({ storage: multer.memoryStorage() });
const {deliver,getAllLivraisons, getOneLivraison,deleteLivraison,updateLivraison, generateLivraisonPDF, deliverOld, deliverStock, getAllTypeLivraisonCommerciale, getAllStockDeliveries, getOneLivraisonDemande, receiveStock, addDeliveryType, getOneTypeLivraison, updateTypeLivraison, deleteTypeLivraison} = require("../controllers/Delivery/deliveryController")

router.post('/deliver', upload.single('signature_expediteur'), deliver);
router.get("/getAllLivraisons", getAllLivraisons);
router.get("/getOneLivraison/:id", getOneLivraison);
router.put("/updateLivraison/:id", updateLivraison);
router.get("/deleteLivraison/:id", deleteLivraison);
router.get("/pdf/:id", generateLivraisonPDF);
router.post("/deliverOld", deliverOld);
router.post("/deliverStock", upload.single('signature_expediteur'), deliverStock);
router.get("/getAllTypeLivraisonCommerciale", getAllTypeLivraisonCommerciale);
router.get("/getAllStockDeliveries", getAllStockDeliveries);
router.get("/getOneLivraisonDemande/:id", getOneLivraisonDemande);
router.post("/receiveStock", upload.single('signature'), receiveStock);
router.post("/addDeliveryType", addDeliveryType);
router.get("/getOneTypeLivraison/:id", getOneTypeLivraison);
router.put("/updateTypeLivraison/:id", updateTypeLivraison);
router.put("/deleteTypeLivraison/:id", deleteTypeLivraison);


module.exports = router
