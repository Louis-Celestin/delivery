const express = require("express")
const router = express.Router();
// const multer = require("multer")
// const upload = multer({ storage: multer.memoryStorage() });
const {deliver,getAllLivraisons, getOneLivraison,deleteLivraison,updateLivraison, generateLivraisonPDF} = require("../controllers/Delivery/deliveryController")

router.post("/deliver", deliver);
router.get("/getAllLivraisons", getAllLivraisons);
router.get("/getOneLivraison/:id", getOneLivraison);
router.get("/updateLivraison/:id", updateLivraison);
router.get("/deleteLivraison/:id", deleteLivraison);
router.get("/pdf/:id", generateLivraisonPDF);


module.exports = router
