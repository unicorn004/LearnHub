const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.post('/upload', questionController.uploadBulkQuestions);
router.get('/random/:count', questionController.getRandomQuestions);

module.exports = router;
