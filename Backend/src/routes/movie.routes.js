const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');
const checkAuth = require('../middleware/auth.middleware');

router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);

// Protected Routes
router.use(checkAuth);
router.post('/', movieController.addMovie);
router.put('/:id', movieController.updateMovie);
router.get('/company/mine', movieController.getCompanyMovies);


module.exports = router;
