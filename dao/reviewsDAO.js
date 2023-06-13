import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {
    /**
     * Connects to the reviews collection.
     * @param {*} conn the connection object
     * @returns
     */
    static async injectDB(conn) {
        if (reviews) {
            return;
        }

        try {
            reviews = await conn
                .db(process.env.MOVIEREVIEWS_COLLECTION)
                .collection('reviews');
        } catch (e) {
            console.error(`Unable to connect to reviewsDAO, ${e}`);
        }
    }

    /**
     * Adds a new review to the reviews collection.
     * @param {string} movieId
     * @param {string} user
     * @param {string} review
     * @param {string} date
     * @returns
     */
    static async addReview(movieId, user, review, date) {
        try {
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date,
                review,
                movie_id: new ObjectId(movieId),
            };
            return await reviews.insertOne(reviewDoc);
        } catch (e) {
            console.error(`Unable to post review: ${e}`);
            return { error: e };
        }
    }

    /**
     * Updates an existing review in the reviews collection
     * @param {string} reviewId
     * @param {string} user
     * @param {string} review
     * @param {string} date
     */
    static async updateReview(reviewId, user, review, date) {
        try {
            const query = { _id: new ObjectId(reviewId) };
            const update = { $set: { review: review, date: new Date() } };
            const response = await reviews.updateOne(query, update);

            if (response.modifiedCount == 0) {
                throw Error(`Update unsuccessful`);
            }

            return response;
        } catch (e) {
            console.error(`Unable to update review: ${e}`);
        }
    }

    static async deleteReview(reviewId) {}
}
