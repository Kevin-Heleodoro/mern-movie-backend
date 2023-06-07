/**
 * Logic for handling requests from the Movies route.
 */
export default class MoviesController {
    /**
     * Get movies in groups of 20 by default. Can pass in optional pagination number for greater results.
     * @param {*} req the request body
     * @param {*} res the response body
     * @param {*} next middleware associated with this call
     */
    static async apiGetMovies(req, res, next) {
        const moviesPerPage = req.query.moviesPerPage
            ? parseInt(req.query.moviesPerPage)
            : 20;
        const page = req.query.page ? parseInt(req.query.page) : 0;

        let filters = {};
        if (req.query.rated) {
            filters.rated = req.query.rated;
        } else if (req.query.title) {
            filters.title = req.query.title;
        }

        const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({
            filters,
            page,
            moviesPerPage,
        });

        let response = {
            movies: moviesList,
            page,
            filters,
            entries_per_page: moviesPerPage,
            total_results: totalNumMovies,
        };

        res.json(response);
    }

    /**
     * Get a movie by a specific id located in the params.
     * @param {*} req the request body
     * @param {*} res the response body
     * @param {*} next middleware associated with this call
     * @returns breaks out of function if the id is invalid
     */
    static async apiGetMovieById(req, res, next) {
        try {
            let id = req.params.id || {};
            let movie = await MoviesDAO.getMovieById(id);

            if (!movie) {
                res.status(404).json({ error: "not found" });
                return;
            }

            res.json(movie);
        } catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    /**
     * Gets all distinct rating values currently in the database.
     * @param {*} req the request body (unused)
     * @param {*} res the response body
     * @param {*} next middleware associated with this call
     */
    static async apiGetRatings(req, res, next) {
        try {
            let ratings = await MoviesDAO.getRatings();
            res.json(ratings);
        } catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }
    }
}
