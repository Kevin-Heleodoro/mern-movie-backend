import supertest from 'supertest';
import { expect } from 'chai';
import app from '../index.js';

const requestWithSuperTest = supertest(app);

afterEach(() => {});

describe('Testing GET /movies endpoint', function () {
    it('responds with a valid HTTP status code and number of movies', async function () {
        const DEFAULT_MOVIES_PER_PAGE = 20;
        const response = await requestWithSuperTest.get('/api/v1/movies');

        expect(response.status).to.equal(200);
        expect(response.body.movies.length).to.equal(DEFAULT_MOVIES_PER_PAGE);
    });
});

describe('Testing POST /review endpoint', function () {
    it('responds with a valid HTTP status and success message', async function () {
        const reviewBody = {
            movie_id: '573a1390f29313caabcd4135',
            review: 'I guess it was ok',
            user_id: '1234',
            name: 'Jane Doe',
        };
        const response = await requestWithSuperTest
            .post('/api/v1/movies/review')
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
            name: 'Steve Smith',
        };

        const updatedReview = {
            review_id: null,
            review: 'This is the worst movie!',
            user_id: '4321',
            name: 'Steve Smith',
        };

        await requestWithSuperTest
            .post('/api/v1/movies/review')
            .set('Content-Type', 'application/json')
            .send(reviewBody)
            .expect(200)
            .then((res) => {
                updatedReview.review_id = res.body.response.insertedId;
            });

        await requestWithSuperTest
            .put('/api/v1/movies/review')
            .set('Content-Type', 'application/json')
            .send(updatedReview)
            .expect(200)
            .then((res) => {
                expect(res.body.status).to.equal('success');
                expect(res.body.response.modifiedCount).to.equal(1);
            });
    });
});
