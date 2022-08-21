const request = require('supertest');
const app = require('../../app');

jest.setTimeout(1500);

const { connectToMongo, clearDatabase } = require('../../db/connection');

beforeAll(async () => {
  await connectToMongo();
});

afterAll(async () => {
  // clean db
  await clearDatabase();
});

describe('Chef Related Routes', () => {
  describe('Public Routes', () => {
    it('GET /api/chefs should return an array of chefs', async () => {
      const res = await request(app).get('/api/chefs');
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it('GET /api/chefs/nearby-chefs should return error message if no city is provided', async () => {
      const res = await request(app).get('/api/chefs/nearby-chefs');
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Wrong city name');
    });

    it('GET /api/chefs/nearby-chefs should return error message when city is provided but no chefs in there', async () => {
      const res = await request(app)
        .get('/api/chefs/nearby-chefs')
        .query({ city: 'gaziantep' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        'No chefs in Gaziantep province at this time'
      );
    });

    it('GET /api/chefs/:username should return the chef with the specific username successfully', async () => {
      const res = await request(app).get('/api/chefs/testchef');
      expect(res.status).toBe(200);
      expect(typeof res.body).toBe('object');
    });

    it('GET /api/chefs/:username should handle not existed username', async () => {
      const res = await request(app).get('/api/chefs/notexisteduser');
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('No chef with username: notexisteduser');
    });
  });
});
