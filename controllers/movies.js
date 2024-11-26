const { default: mongoose } = require('mongoose');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const Movie = require('../models/movies');

const HTTP_STATUS = {
  CREATED: 201,
};

const DEFAULT_OWNER_ID = '60d21b4667d0d8992e610c85';

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: DEFAULT_OWNER_ID })
    .then((movies) => {
      const reversedCards = movies.reverse();
      res.send(reversedCards);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: DEFAULT_OWNER_ID,
  })
    .then((movie) => {
      res.status(HTTP_STATUS.CREATED).send(movie);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((movie) => {
      if (!movie.owner.equals(DEFAULT_OWNER_ID)) {
        throw new ForbiddenError('Нельзя удалить фильм другого пользователя');
      }
      Movie.deleteOne(movie).then(() => {
        res.send({ data: movie });
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(err.message));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError(err.message));
      } else {
        next(err);
      }
    });
};
