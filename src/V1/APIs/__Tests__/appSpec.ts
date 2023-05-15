import supertest from 'supertest';
import server from '../../../app';

describe('Test server connection', () => {
    const request = supertest(server);
    it('it expects server to be running', async (): Promise<void> => {
        const response = await request.get('/');
        expect(response.status).toEqual(200);
    });
});
