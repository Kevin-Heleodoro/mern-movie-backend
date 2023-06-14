import supertest from 'supertest';
import { expect } from 'chai';
import app from '../index.js';

const requestWithSuperTest = supertest(app);
const REVIEW_ROUTE = '/api/v1/movies/review';
const BASE_ROUTE = '/api/v1/movies';

describe('Testing GET /movies endpoint', function () {
    it('responds with a valid HTTP status code and number of movies', async function () {
        const DEFAULT_MOVIES_PER_PAGE = 20;
        const response = await requestWithSuperTest.get(BASE_ROUTE);

        expect(response.status).to.equal(200);
        expect(response.body.movies.length).to.equal(DEFAULT_MOVIES_PER_PAGE);
    });
});

describe('Testing GET /movies/id/:id endpoint', function () {
    it('responds with a valid HTTP status code and expected movie', async function () {
        const MOVIE_ID = '573a1390f29313caabcd4135';
        const MOVIE_NAME = 'Blacksmith Scene';

        await requestWithSuperTest
            .get(BASE_ROUTE + `/id/${MOVIE_ID}`)
            .expect(200)
            .then((res) => {
                expect(res.body.title).to.equal(MOVIE_NAME);
            });
    });
});

describe('Testing GET /movies/ratings endpoint', function () {
    it('responds with a valid HTTP status code and list of ratings', async function () {
        await requestWithSuperTest
            .get(BASE_ROUTE + '/ratings')
            .expect(200)
            .then((res) => {
                expect(res.body.length).to.be.greaterThan(1);
            });
    });
});

describe('Testing POST /review endpoint', function () {
    it('responds with a valid HTTP status and success message', async function () {
        const reviewBody = {
            movie_id: '573a1390f29313caabcd4135',
            review: 'I guess it was ok',
            user_id: '4321',
            name: 'Test User',
        };
        const response = await requestWithSuperTest
            .post(REVIEW_ROUTE)
            .set('Content-Type', 'application/json')
            .send(reviewBody);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
    });
});

describe('Testing PUT /review endpoint', function () {
    it('responds with a valid HTTP status and correct number of modified documents', async function () {
        const reviewBody = {
            movie_id: '573a1390f29313caabcd4135',
            review: 'Best movie ever!',
            user_id: '4321',
            name: 'Test User',
        };

        const updatedReview = {
            review_id: null,
            review: 'This is the worst movie!',
            user_id: '4321',
            name: 'Test User',
        };

        await requestWithSuperTest
            .post(REVIEW_ROUTE)
            .set('Content-Type', 'application/json')
            .send(reviewBody)
            .expect(200)
            .then((res) => {
                updatedReview.review_id = res.body.response.insertedId;
            });

        await requestWithSuperTest
            .put(REVIEW_ROUTE)
            .set('Content-Type', 'application/json')
            .send(updatedReview)
            .expect(200)
            .then((res) => {
                expect(res.body.status).to.equal('success');
                expect(res.body.response.modifiedCount).to.equal(1);
            });
    });
});

describe('Testing PUT /review endpoint with incorrect user id', function () {
    it('responds with a 500 HTTP status and throws error', async function () {
        const reviewBody = {
            movie_id: '573a1390f29313caabcd4135',
            review: 'Best movie ever!',
            user_id: '4321',
            name: 'Test User',
        };

        const updatedReview = {
            review_id: null,
            review: 'This is the worst movie!',
            user_id: '1234',
            name: 'Test User',
        };

        await requestWithSuperTest
            .post(REVIEW_ROUTE)
            .set('Content-Type', 'application/json')
            .send(reviewBody)
            .expect(200)
            .then((res) => {
                updatedReview.review_id = res.body.response.insertedId;
            });

        await requestWithSuperTest
            .put(REVIEW_ROUTE)
            .set('Content-Type', 'application/json')
            .send(updatedReview)
            .expect(500)
            .then((res) => {
                expect(res.body.error).to.equal('Unable to update review');
            });
    });
});

describe('Testing DELETE /review endpoint', function () {
    it('responds with a valid HTTP and correct number of delete documents', async function () {
        let reviewId;
        const reviewBody = {
            movie_id: '573a1390f29313caabcd4135',
            review: 'Best movie ever!',
            user_id: '4321',
            name: 'Test User',
        };

        await requestWithSuperTest
            .post(REVIEW_ROUTE)
            .send(reviewBody)
            .expect(200)
            .then((res) => {
                reviewId = res.body.response.insertedId;
            });

        await requestWithSuperTest
            .delete(REVIEW_ROUTE)
            .send({ review_id: reviewId })
            .expect(200)
            .then((res) => {
                expect(res.body.status).to.equal('success');
                expect(res.body.response.deletedCount).to.equal(1);
            });
    });
});
