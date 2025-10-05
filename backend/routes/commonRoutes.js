const express = require("express");
const router = express.Router();
const commonController = require("../controllers/commonController");

router.get("/departments", commonController.getDepartments);
router.get("/doctors", commonController.getDoctors);

module.exports = router;
