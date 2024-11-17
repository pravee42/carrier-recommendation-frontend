const express = require('express');
const router = express.Router();
const supervisorController = require('../controllers/SuperVisorController');
const { bulkUpdateSupervisors } = require('../controllers/level3Controller');

router.post('/supervisors', supervisorController.createSupervisor);
router.get('/supervisors', supervisorController.getAllSupervisors);
router.get('/supervisors/:id', supervisorController.getSupervisorById);
router.put('/supervisors/:id', supervisorController.updateSupervisor);
router.delete('/supervisors/:id', supervisorController.deleteSupervisor);
router.post('/updatesupervisor', bulkUpdateSupervisors)

module.exports = router;
