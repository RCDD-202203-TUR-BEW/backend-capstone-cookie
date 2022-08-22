const request = require('supertest');
const _ = require('lodash');
const app = require('../../app');
const { User } = require('../../models/user');
const Dish = require('../../models/dish');

jest.setTimeout(1500);

const connectToMongo = require('../../db/connection');

let token;
let dishId;
beforeAll(async () => {
  await connectToMongo();
  const validChef = {
    firstname: 'valid',
    lastname: 'chef',
    username: 'validchef',
    email: 'valid-chef@gmail.com',
    role: 'chef',
    password: 'correctPass7',
    confirmPassword: 'correctPass7',
    phone: 5555525555,
    kitchenName: 'validkitchen',
    kitchenDescription: 'asian food',
    birthday: '01-01-2000',
    gender: 'female',
    acceptTos: true,
  };
  const res = await request(app).post('/api/auth/chef/signup').send(validChef);
  const cookieProperties = res.headers['set-cookie'][0].split(';');
  [token] = cookieProperties;
});

afterAll(async () => {
  // clean db
  await User.deleteOne({ username: 'validchef' });
});

const dish = {
  title: 'besamelli makarna',
  ingredients: ['makarna', 'et', 'sut'],
  description: 'delicious food',
  cuisine: 'turkish',
  dishType: 'pasta',
  price: 60,
};

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
      const res = await request(app).get('/api/chefs/validchef');
      expect(res.status).toBe(200);
      expect(typeof res.body).toBe('object');
    });

    it('GET /api/chefs/:username should handle not existed username', async () => {
      const res = await request(app).get('/api/chefs/notexisteduser');
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('No chef with username: notexisteduser');
    });
  });

  describe('Private Routes', () => {
    describe('When not authenticated', () => {
      it('Responds with 401 for all endpoints', async () => {
        const resRead = await request(app).get('/api/chefs/profile/testchef');
        const resCreate = await request(app)
          .post('/api/chefs/dishes/testchef')
          .send(dish);
        const resUpdate = await request(app)
          .put('/api/chefs/dishes/testchef/somefakeid')
          .send({ title: 'Update_title' });
        const resDelete = await request(app).delete(
          '/api/chefs/dishes/testchef/somefakeid'
        );

        expect(resRead.status).toBe(401);
        expect(resRead.text).toBe(
          "You don't have authorization to view this page"
        );
        expect(resCreate.status).toBe(401);
        expect(resUpdate.status).toBe(401);
        expect(resDelete.status).toBe(401);
      });
    });

    describe('When authenticated', () => {
      it('GET /api/chefs/profile/:username should return the chef information correctly', async () => {
        const res = await request(app)
          .get('/api/chefs/profile/validchef')
          .set('Cookie', [token]);
        expect(res.status).toBe(200);
        expect(typeof res.body).toBe('object');
      });

      it('PUT /api/chefs/profile/:username should update information correctly', async () => {
        const res = await request(app)
          .put('/api/chefs/profile/validchef')
          .set('Cookie', [token])
          .send({ firstname: 'updated' });

        expect(res.status).toBe(200);
        expect(res.body.firstname).toBe('updated');
      });
      it('PUT /api/chefs/profile/:username should prevent updating profile for other users', async () => {
        const res = await request(app)
          .put('/api/chefs/profile/testchef')
          .set('Cookie', [token])
          .send({ lastname: 'updated' });
        expect(res.status).toBe(401);
      });
      it('PUT /api/chefs/profile/:username should ignore empty values when updating', async () => {
        const res = await request(app)
          .put('/api/chefs/profile/validchef')
          .set('Cookie', [token])
          .send({
            gender: '',
            lastname: '',
          });

        expect(res.status).toBe(200);
        expect(res.body.lastname).toBe('chef');
        expect(res.body.gender).toBe('female');
      });

      it('POST /api/chefs/dishes/:username should add a new dish to the chef menu', async () => {
        const res = await request(app)
          .post('/api/chefs/dishes/validchef')
          .set('Cookie', [token])
          .send(dish);
        const chef = await User.findOne({ username: 'validchef' });
        [dishId] = chef.dishes;
        const addedDish = await Dish.findOne({ _id: dishId });

        expect(res.status).toBe(200);
        expect(res.body.title).toEqual(addedDish.title);
        expect(res.body.price).toEqual(addedDish.price);
        expect(res.body.cuisine).toEqual(_.capitalize(addedDish.cuisine));
        expect(res.body.dish_type).toEqual(_.capitalize(addedDish.dish_type));
        expect(res.body.description).toEqual(addedDish.description);
      });

      it('PUT /api/chefs/dishes/:username/:dishId should update dish for this chef correctly', async () => {
        const res = await request(app)
          .put(`/api/chefs/dishes/validchef/${dishId}`)
          .set('Cookie', [token])
          .send({ price: 75 });
        const chef = await User.findOne({ username: 'validchef' });
        const updatedDish = await Dish.findOne({ _id: chef.dishes[0] });

        expect(res.status).toBe(200);
        expect(res.body.price).toBe(75);
        expect(res.body.price).toEqual(updatedDish.price);
      });

      it('PUT /api/chefs/dishes/:username/:dishId should handle wrong dish id', async () => {
        const res = await request(app)
          .put('/api/chefs/dishes/validchef/6302c364814e09f901265876')
          .set('Cookie', [token])
          .send({ price: 100 });

        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Dish not found');
      });

      it('DELETE /api/chefs/dishes/:username should delete dish for this chef correctly', async () => {
        const res = await request(app)
          .delete(`/api/chefs/dishes/validchef/${dishId}`)
          .set('Cookie', [token]);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Dish has been deleted successfully');
      });
    });
  });
});
