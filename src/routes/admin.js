const express = require('express');

const router = express.Router();

const adminContoller = require('../controllers/admin');

/**
 * @swagger
 * /api/admin/fetchCustomers:
 *  get:
 *    description: this endpoint should return all the customer in database
 *    responses:
 *      '200':
 *        description: successful response
 */
router.get('/fetchCustomers', adminContoller.fetchCustomers);

/**
 * @swagger
 * /api/admin/fetchChefs:
 *  get:
 *    description: this endpoint should return all the chefs in database
 *    responses:
 *      '200':
 *        description: successful response
 */
router.get('/fetchChefs', adminContoller.fetchChefs);

/**
 * @swagger
 * /api/admin/fetchAdmins:
 *  get:
 *    description: this endpoint should return all the admins in the database
 *    responses:
 *      '200':
 *        description: successful response
 */
router.get('/fetchAdmins', adminContoller.fetchAdmins);

/**
 * @swagger
 * /api/admin/fetchAll:
 *  get:
 *    description: this endpoint should return all the type of users in database
 *    responses:
 *      '200':
 *        description: successful response
 */

router.get('/fetchAll', adminContoller.fetchAll);

/**
 * @swagger
 * /api/admin/delete/:id:
 *  get:
 *    description: this endpoint should delete any user but not the main admin
 *    responses:
 *      '204':
 *        description: successful response
 */
router.delete('/delete/:id', adminContoller.deleteUser);

module.exports = router;
