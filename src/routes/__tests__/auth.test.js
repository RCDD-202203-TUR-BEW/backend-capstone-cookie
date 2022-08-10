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
  await User.deleteMany({});
});

// to test registration
const newUser = {
  firstname: 'new',
  lastname: 'user',
  username: 'newuser',
  email: 'new-user@gmail.com',
  role: 'customer',
  password: 'correctPass7',
  confirmPassword: 'correctPass7',
  phone: 5555555555,
  birthday: '04-07-1996',
  gender: 'female',
  acceptTos: true,
};

describe('Signup functionality', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app).post('/api/auth/signup').send(newUser);

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie']).toBeTruthy();
    expect(res.body.message).toBe('new customer signed up successfully');

    // check user in db
    const user = await User.findOne({ username: newUser.username });
    expect(user).toBeDefined();
    expect(user.username).toEqual(newUser.username);
  });

  it('should hash password with bcrypt', async () => {
    await request(app).post('/api/auth/signup').send(newUser);
    const user = await User.findOne({ username: newUser.username });
    expect(user).toBeDefined();
    const valid =
      user && (await bcrypt.compare(newUser.password, user.password_hash));
    expect(valid).toBe(true);
  });

  it('should handle used username', async () => {
    const res = await request(app).post('/api/auth/signup').send(newUser);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('username (newuser) already exists!');
  });

  it('should handle used email', async () => {
    const newUserLocal = Object.assign({}, newUser);
    newUserLocal.username = 'username';
    const res = await request(app).post('/api/auth/signup').send(newUserLocal);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('email (new-user@gmail.com) already exists!');
  });

  it('should handle used phone', async () => {
    const newUserLocal = Object.assign({}, newUser);
    newUserLocal.username = 'username';
    newUserLocal.email = 'email@gmail.com';
    const res = await request(app).post('/api/auth/signup').send(newUserLocal);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('phone (5555555555) already exists!');
  });

  it('should handle wrong password confirm', async () => {
    const newUserLocal = Object.assign({}, newUser);
    newUserLocal.username = 'username';
    newUserLocal.email = 'email@gmail.com';
    newUserLocal.phone = 5553215353;
    newUserLocal.confirmPassword = 'wrongPassword1';
    const res = await request(app).post('/api/auth/signup').send(newUserLocal);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Passwords don't match");
  });
});
