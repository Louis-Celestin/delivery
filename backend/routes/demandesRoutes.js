const express = require("express")
const router = express.Router();
const upload = require("../middlewares/uploads");
// const multer = require("multer")
// const upload = multer({ storage: multer.memoryStorage() });
const {faireDemande, getAllDemandes, getOneDemande, validateDemande, returnDemande,
    cancelDemande, updateDemande, generateDemandePDF, receivePiece, preValidateDemande,
} = require("../controllers/Demande/demandeController")

router.post('/faireDemande', upload.array('files_selected'), faireDemande);
router.get('/getAllDemandes', getAllDemandes);
router.get('/getOneDemande/:id', getOneDemande);
router.post('/validateDemande', validateDemande);
router.post('/returnDemande', returnDemande);
router.post('/cancelDemande', cancelDemande);
router.put('/updateDemande/:id', updateDemande);
router.get('/getPdf/:id', generateDemandePDF);
router.post('/receivePiece', upload.single("signature"), receivePiece);
router.post('/preValidateDemande', upload.single("signature"), preValidateDemande);

module.exports = router
