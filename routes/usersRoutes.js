const express = require("express")
const router = express.Router();
// const multer = require("multer")
// const upload = multer({ storage: multer.memoryStorage() });
const {register,login,forgotPassword,resetPassword,updateUser,deleteUser} = require("../controllers/Users/usersController")

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

module.exports = router
