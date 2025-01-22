const express = require("express");
const { SignIn } = require("../api/Signin/controller");
const { Auth } = require("../middlewares/controller");
const { addUser, getSingleUser, getAllUsers, updateUser, deleteUser  } = require("../api/Users/controller");
const { addValidation } = require("../validations/validations");
const router = express.Router();

// Student api's
router.post("/addUser",addValidation,addUser)
router.get("/getSingleUser",Auth(),getSingleUser)
router.get("/getAllUsers",Auth(),getAllUsers)
router.put("/updateUser",Auth(),updateUser)
router.patch("/deleteUser",Auth(),deleteUser)
// Signin api's
router.post("/signin",SignIn)
module.exports = router;
