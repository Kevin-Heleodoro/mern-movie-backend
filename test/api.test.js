import supertest from 'supertest';
import { expect } from 'chai';
import app from '../index.js';

const requestWithSuperTest = supertest(app);

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
