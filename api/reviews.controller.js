import ReviewsDAO from '../dao/reviewsDAO.js';

/**
 * Logic for handling requests from the /review route
 */
export default class ReviewsController {
    /**
     * Post a new review to the reviews collection for an existing movie.
     * @param {*} req the request body
     * @param {*} res the response
     * @param {*} next middleware associated with this call
     */
    static async apiPostReview(req, res, next) {
        try {
            const movieId = req.body.movie_id;
            const review = req.body.review;
            const date = new Date();
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id,
            };

            const reviewResponse = await ReviewsDAO.addReview(
                movieId,
                userInfo,
                review,
                date
            );

            var { error } = reviewResponse;

            if (error) {
                res.status(500).json({ error: `Unable to post review` });
            } else {
                res.json({
                    status: 'success',
                    response: reviewResponse,
                });
            }
        } catch (e) {
            res.status(500).json({ error: e });
        }
    }

    /**
     * Updates an existing review within the database.
     * @param {*} req the request body
     * @param {*} res the response body
     * @param {*} next middleware associated with the call
     */
    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.body.review_id;
            const review = req.body.review;
            const date = new Date();
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id,
            };

            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                userInfo,
                review,
                date
            );

            var { error } = reviewResponse;

            if (error) {
                res.status(500).json({ error: `Unable to update review` });
            } else {
                res.json({
                    status: 'success',
                    response: reviewResponse,
                });
            }
        } catch (e) {
            res.status(500).json({ error: e });
        }
    }

    /**
     * Deletes an existing review within the database.
     * @param {*} req the request body
     * @param {*} res the response body
     * @param {*} next middleware associated with the call
     */
    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.body.review_id;
            const userId = req.body.user_id;

            const deleteResponse = await ReviewsDAO.deleteReview(
                reviewId,
                userId
            );

            var { error } = deleteResponse;

            if (error) {
                res.status(500).json({ error: `Unable to delete review` });
            } else {
                res.json({
                    status: 'success',
                    response: deleteResponse,
                });
            }
        } catch (e) {
            res.status(500).json({ error: e });
        }
    }
}
