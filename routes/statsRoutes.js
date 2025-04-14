const express = require("express")
const router = express.Router();

const {nbdeliverycharger,nbreturncharger,nbexitcharger,nblivraisonpartype, nbdeliverychargeurperperdiod}=require("../controllers/Stats/statsController")

router.get("/nbdeliverycharger", nbdeliverycharger)
router.get("/nbexitcharger", nbexitcharger)
router.get("/nbreturncharger", nbreturncharger)
router.get("/nblivraisonpartype", nblivraisonpartype)
router.get("/nbdeliverychargeurperperdiod", nbdeliverychargeurperperdiod)

module.exports = router