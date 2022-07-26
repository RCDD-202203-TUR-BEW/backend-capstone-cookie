const express = require("express");
const router = express.Router();

const chefController = require("../controllers/chef");

router.get("/", chefController);// all dishes - all chefs or (/dishes/all)
router.get("/profile", chefController);//profile

 
// router.post("/", chefController);
 router.get("/sginup", chefController);
 router.get("/login", chefController);
 router.get("/order", chefController); //specific order
 router.get("/orders", chefController); // all orders
 router.get("/rate", chefController); // rated dishes
 router.put("/profile", chefController);// update profile - or it cuts off the rest of the routes

    router.put("/orders", chefController);// update orders
    router.put("/password", chefController);// update password
    router.put("/address", chefController);// update address
    router.put("/phone", chefController);// update phone
    router.put("/email", chefController);// update email
    router.put("/name", chefController);// update name
    
router.delete("/deleteorder", chefController);// delete order
router.delete("/deleteaddress", chefController);// delete address
router.delete("/deletephone", chefController);// delete phone
router.delete("/deleteemail", chefController);// delete email
router.put("/deleteall", chefController);// delete all - acount, orders, address, phone, email, name

router.get("/chefs", chefController);// all chefs"
router.get("/chefs/:username", chefController);// all chefs"
router.get("/dishes/dishId", chefController);// dish by id
router.get("/dishes/filter", chefController);// filter dishes

router.post("/dishes", chefController);// add dish
router.put("/dishes/dishId", chefController);// update dish
router.delete("/dishes/dishId", chefController);// delete dish

module.exports = router;