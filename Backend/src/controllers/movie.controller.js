const Movie = require('../models/Movie');

exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Fetching movies failed', error: error.message });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate('company', 'name companyName');
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Fetching movie failed', error: error.message });
  }
};

exports.addMovie = async (req, res) => {
  try {
    if (req.userData.role !== 'company') {
      return res.status(403).json({ message: 'Not authorized to add movies' });
    }

    const { title, description, genre, duration, posterUrl, backgroundUrl, releaseDate, trailerUrl, language, price } = req.body;

    const newMovie = new Movie({
      title,
      description,
      genre,
      duration,
      posterUrl,
      backgroundUrl,
      trailerUrl,
      language,
      price,
      company: req.userData.userId,
      releaseDate
    });

    await newMovie.save();
    res.status(201).json({ message: 'Movie added successfully', movie: newMovie });
  } catch (error) {
    res.status(500).json({ message: 'Adding movie failed', error: error.message });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    if (req.userData.role !== 'company') {
      return res.status(403).json({ message: 'Not authorized to update movies' });
    }

    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    if (movie.company.toString() !== req.userData.userId) {
      return res.status(403).json({ message: 'Not authorized to update this movie' });
    }

    const { title, description, genre, duration, posterUrl, backgroundUrl, releaseDate, trailerUrl, language, price } = req.body;

    movie.title = title;
    movie.description = description;
    movie.genre = genre;
    movie.duration = duration;
    movie.posterUrl = posterUrl;
    movie.backgroundUrl = backgroundUrl;
    movie.trailerUrl = trailerUrl;
    movie.releaseDate = releaseDate;
    movie.language = language;
    movie.price = price;

    await movie.save();
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Updating movie failed', error: error.message });
  }
};

exports.getCompanyMovies = async (req, res) => {
  try {
    if (req.userData.role !== 'company') {
        return res.status(403).json({ message: 'Not authorized' });
    }
    const movies = await Movie.find({ company: req.userData.userId });
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Fetching movies failed', error: error.message });
  }
}
