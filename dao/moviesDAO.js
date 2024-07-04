import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectId;

let movies;

export default class MoviesDAO {
    static async injectDB(connection) {
        if (movies) {
            return;
        }

        try {
            movies = await connection
                .db(process.env.MOVIEREVIEWS_COLLECTION)
                .collection('movies');
        } catch (e) {
            console.error(`Unable to connect to MoviesDAO: ${e}`);
        }
    }

    static async getMovies({
        filters = null,
        page = 0,
        moviesPerPage = 20,
    } = {}) {
        let query;
        if (filters) {
            if ('title' in filters) {
                query = { $text: { $search: filters['title'] } };
            } else if ('rated' in filters) {
                query = { rated: { $eq: filters['rated'] } };
            }
        }

        let cursor;
        try {
            cursor = await movies
                .find(query)
                .limit(moviesPerPage)
                .skip(moviesPerPage * page);
            const moviesList = await cursor.toArray();
            const totalNumMovies = await movies.countDocuments(query);
            return { moviesList, totalNumMovies };
        } catch (e) {
            console.error(`Unable to issue command, ${e}`);
            return { moviesList: [], totalNumMovies: 0 };
        }
    }

    static async getMovieById(id) {
        try {
            return await movies
                .aggregate([
                    {
                        $match: {
                            _id: new ObjectId(id),
                        },
                    },
                    {
                        $lookup: {
                            from: 'reviews',
                            localField: '_id',
                            foreignField: 'movie_id',
                            as: 'reviews',
                        },
                    },
                ])
                .next();
        } catch (e) {
            console.error(`Unable to get movie by ID, ${e}`);
            throw e;
        }
    }

    static async getMoviesByIds(ids) {
        try {
            let idArray = ids.map((i) => new ObjectId(i));
            let query = { _id: { $in: idArray } };
            let options = { projection: { _id: 1, title: 1, poster: 1 } };
            let cursor = await movies.find(query, options);

            return await cursor.toArray();
        } catch (e) {
            console.error(`Unable to get movies by IDs, ${e}`);
            throw e;
        }
    }

    static async getRatings() {
        let ratings = [];
        try {
            ratings = await movies.distinct('rated');
            return ratings;
        } catch (e) {
            console.error(`Unable to get ratings, ${e}`);
            return ratings;
        }
    }
}
