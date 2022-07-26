const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");

router.get("/admin/fetch-user", adminController);
router.delete("/admin/delet", adminController);

module.exports = router;
