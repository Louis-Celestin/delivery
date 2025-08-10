const express = require("express")
const router = express.Router();
const upload = require("../middlewares/uploads");
// const multer = require("multer")
// const upload = multer({ storage: multer.memoryStorage() });
const {faireDemande, getAllDemandes, getOneDemande, validateDemande, returnDemande, cancelDemande, updateDemande, generateDemandePDF} = require("../controllers/Demande/demandeController")

router.post('/faireDemande', upload.array('files_selected'), faireDemande);
router.get('/getAllDemandes', getAllDemandes);
router.get('/getOneDemande/:id', getOneDemande);
router.post('/validateDemande', upload.single("signature"), validateDemande);
router.post('/returnDemande', returnDemande);
router.post('/cancelDemande', cancelDemande);
router.put('/updateDemande/:id', updateDemande);
router.get('/getPdf/:id', generateDemandePDF);

module.exports = router
