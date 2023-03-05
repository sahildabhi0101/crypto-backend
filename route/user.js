const express = require("express");
const { userbyid, getuser, updateuser } = require("../controller/user");
const { requiresignin } = require("../controller/auth");

const router = express.Router();

router.get("/users/:userId", getuser); //requiresignin
router.put("/users/:userId", updateuser); //requiresignin

router.param("userId", userbyid);

module.exports = router;
