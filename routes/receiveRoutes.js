const express = require("express")
const router = express.Router();


const {createValidation,getAllValidations,getOneValidation,updateValidation,deleteValidation} = require("../controllers/Reveive/receiveController")

router.post("/receive", createValidation);
router.get("/getAllValidations", getAllValidations);
router.get("/getOneValidation/:id", getOneValidation);
router.put("/updateValidation/:id", updateValidation);
router.delete("/deleteValidation/:id", deleteValidation);


module.exports = router
