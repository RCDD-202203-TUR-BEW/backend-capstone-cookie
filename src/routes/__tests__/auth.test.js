/* eslint-disable prefer-object-spread */
const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../../app');
const { User } = require('../../models/user');

jest.setTimeout(1500);

const connectToMongo = require('../../db/connection');

beforeAll(async () => {
  await connectToMongo();
});

afterAll(async () => {
  // clean db
  await User.deleteMany({
    username: { $in: ['chef1', 'newchef', 'customer1'] },
  });
});

// to test registration
const newChef = {
  firstname: 'new',
  lastname: 'chef',
  username: 'chef1',
  email: 'new-chef@gmail.com',
  role: 'chef',
  password: 'correctPass7',
  confirmPassword: 'correctPass7',
  phone: 5555555555,
  kitchenName: 'kitchen',
  kitchenDescription: 'asian food',
  birthday: '01-01-2000',
  gender: 'female',
  acceptTos: true,
};

const newCustomer = {
  firstname: 'new',
  lastname: 'customer',
  username: 'customer1',
  email: 'new-customer@gmail.com',
  role: 'customer',
  password: 'correctPass7',
  confirmPassword: 'correctPass7',
  phone: 5555555557,
  birthday: '01-01-2000',
  gender: 'female',
  acceptTos: true,
};

let token;

describe('Signup functionality', () => {
  it('should register a new chef successfully', async () => {
    const res = await request(app).post('/api/auth/chef/signup').send(newChef);

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie']).toBeTruthy();
    expect(res.body.message).toBe('new chef signed up successfully');

    // saving the token to test the signout functionality
    const cookieProperties = res.headers['set-cookie'][0].split(';');
    [token] = cookieProperties; // array destructuring to take first value which is the token

    // check user in db
    const user = await User.findOne({ username: newChef.username });
    expect(user).toBeDefined();
    expect(user.username).toEqual(newChef.username);
  });

  it('should register a new customer successfully', async () => {
    const res = await request(app)
      .post('/api/auth/customer/signup')
      .send(newCustomer);

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie']).toBeTruthy();
    expect(res.body.message).toBe('new customer signed up successfully');

    // check user in db
    const user = await User.findOne({ username: newChef.username });
    expect(user).toBeDefined();
    expect(user.username).toEqual(newChef.username);
  });

  it('should hash password with bcrypt', async () => {
    await request(app).post('/api/auth/chef/signup').send(newChef);
    const user = await User.findOne({ username: newChef.username });
    expect(user).toBeDefined();
    const valid =
      user && (await bcrypt.compare(newChef.password, user.password_hash));
    expect(valid).toBe(true);
  });

  it('should handle used username', async () => {
    const res = await request(app)
      .post('/api/auth/customer/signup')
      .send(newCustomer);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('username (customer1) already exists!');
  });

  it('should handle used email', async () => {
    const newChefLocal = Object.assign({}, newChef);
    newChefLocal.username = 'newchef';
    const res = await request(app)
      .post('/api/auth/chef/signup')
      .send(newChefLocal);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('email (new-chef@gmail.com) already exists!');
  });

  it('should handle used phone', async () => {
    const newChefLocal = Object.assign({}, newChef);
    newChefLocal.username = 'newchef';
    newChefLocal.email = 'email@gmail.com';
    const res = await request(app)
      .post('/api/auth/chef/signup')
      .send(newChefLocal);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('phone (5555555555) already exists!');
  });

  it('should handle wrong password confirm', async () => {
    const newChefLocal = Object.assign({}, newChef);
    newChefLocal.username = 'newchef';
    newChefLocal.email = 'email@gmail.com';
    newChefLocal.phone = 5553215353;
    newChefLocal.confirmPassword = 'wrongPassword1';
    const res = await request(app)
      .post('/api/auth/chef/signup')
      .send(newChefLocal);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Passwords don't match");
  });
});

describe('Signin functionality', () => {
  it('should log the user in successfully', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ id: newChef.username, password: newChef.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('chef: chef1 signed in successfully');
  });

  it('should handle wrong id', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ id: 'wrong', password: newChef.password });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('invalid id or password');
  });

  it('should handle wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ id: newChef.username, password: 'wrongPass7' });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('invalid id or password');
  });
});

describe('Signout functionality', () => {
  it("should return error message when the user isn't signed in ", async () => {
    const res = await request(app).get('/api/auth/signout');

    expect(res.statusCode).toBe(401);
    expect(res.text).toBe("You don't have authorization to view this page");
  });

  it('should sign the user out', async () => {
    const res = await request(app)
      .get('/api/auth/signout')
      .set('Cookie', [token]);

    expect(res.statusCode).toBe(200);
    expect(res.headers['set-cookie']).toBeTruthy();
    expect(res.body.message).toBe('chef1 has signed out successfully');
  });
});