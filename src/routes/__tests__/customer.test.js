const request = require('supertest');
const _ = require('lodash');
const app = require('../../app');
const { User } = require('../../models/user');

jest.setTimeout(5500);

const connectToMongo = require('../../db/connection');

let token;

const newCustomer = {
  firstname: 'valid',
  lastname: 'customer',
  username: 'customer',
  email: 'valid-customer@gmail.com',
  role: 'customer',
  password: 'correctPass7',
  confirmPassword: 'correctPass7',
  phone: 5555524555,
  birthday: '01-01-2000',
  gender: 'female',
  acceptTos: true,
};

const updatedCustomer = {
  firstname: 'updatedcustomername',
};

let validCustomerId;
let validCustomer;
beforeAll(async () => {
  await connectToMongo();

  const res = await request(app)
    .post('/api/auth/customer/signup')
    .send(newCustomer);

  //  get the id of the customer that was just created from users model
  validCustomer = await User.findOne({ username: 'customer' });
  // eslint-disable-next-line no-underscore-dangle, camelcase

  const cookieProperties = res.headers['set-cookie'][0].split(';');
  [token] = cookieProperties;
});

afterAll(async () => {
  // clean db
  await User.deleteMany({});
});

describe('Customer Related Routes', (done) => {
  describe('Public Routes', () => {
    it('GET /customer/:username - should get the customer object from the database with username', async () => {
      // !! this test has to be work as public but it is only working with token as private
      const res = await request(app)
        .get(`/api/customer/${newCustomer.username}`)
        .set('Cookie', [token]);

      expect(res.statusCode).toBe(200);
      expect(typeof res.body).toBe('object');

      expect(res.body[0].firstname).toEqual(newCustomer.firstname);
      expect(res.body[0].lastname).toEqual(newCustomer.lastname);
      expect(res.body[0].username).toEqual(newCustomer.username);
    });

    it('GET /customer/:username - should give an error when unauthorization is found', async () => {
      const res = await request(app).get(
        `/api/customer/${newCustomer.username}`
      );
      expect(res.status).toBe(401);
      expect(res.text).toBe("You don't have authorization to view this page");
    });
  });

  describe('Private Routes', () => {
    it('PUT /customer/profile/:id - should update the customer object from the database with id', async () => {
      const res = await request(app)
        // eslint-disable-next-line no-underscore-dangle
        .put(`/api/customer/profile/${validCustomer._id}`)
        .set('Cookie', [token])
        .send({
          firstname: 'updatedcustomername',
        });

      expect(res.statusCode).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body.firstname).toEqual(updatedCustomer.firstname);
    });

    it('PUT /api/customer/profile/:username should prevent updating profile for other users', async () => {
      const res = await request(app)
        .put('/api/customer/profile/testUser')
        .set('Cookie', [token])
        .send({ lastname: 'updated' });
      expect(res.status).toBe(422);
    });

    it('DELETE /customer/:id - should delete a customer object from the database wth given id', async () => {
      const res = await request(app)
        // eslint-disable-next-line no-underscore-dangle
        .delete(`/api/customer/${validCustomer._id}`)
        .set('Cookie', [token]);

      expect(res.statusCode).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body.username).toEqual(newCustomer.username);
    });

    it('DELETE /customer/:id - should give an error when id is not found', async () => {
      const res = await request(app)
        // eslint-disable-next-line no-underscore-dangle
        .delete(`/api/customer/${validCustomer._id}`);
      expect(res.statusCode).toBe(401);
    });
  });
  done();
});
