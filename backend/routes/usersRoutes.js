const express = require("express")
const router = express.Router();
// const multer = require("multer")
// const upload = multer({ storage: multer.memoryStorage() });
const { isAuthenticated } = require("../middlewares/userMiddleware")
const {register,login,forgotPassword,resetPassword,updateUser,deleteUser,changePassword,getAllUsers,getUserRoles,getAllUserRoles,getAllRoles,getAllServices,getAllUserServices,getOneUser,getUserServices} = require("../controllers/Users/usersController")

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.put("/updateUser/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.post("/change-password", isAuthenticated, changePassword);
router.get("/getAllUsers",getAllUsers);
router.get("/getUserRoles/:id", getUserRoles);
router.get("/getAllUserRoles", getAllUserRoles);
router.get("/getAllRoles", getAllRoles);
router.get("/getAllServices", getAllServices);
router.get("/getAllUserServices", getAllUserServices);
router.get("/getOneUser/:id", getOneUser);
router.get("/getUserServices/:id", getUserServices);


module.exports = router
