const request = require('supertest');
const app = require('../../app');
const orderModel = require('../../models/order');
const { User } = require('../../models/user');
const dishModel = require('../../models/dish');

// STARTING THE DB AND DROPING IT AFTER FINISHING
jest.setTimeout(10000);

const connectToMongo = require('../../db/connection');

beforeAll(async () => {
  connectToMongo();
  await orderModel.deleteMany({});
});

afterAll(async () => {
  await orderModel.deleteMany({});
  await User.findOneAndDelete({ username: 'customer1' });
  await User.findOneAndDelete({ username: 'chef1' });
  await dishModel.deleteMany({ price: 5 });
  await dishModel.deleteMany({ price: 15 });
});

// DUMMY DATA
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

const newDish = {
  title: 'new dish 2',
  ingredients: 'new ingredients 2',
  description: 'new dish description 2',
  images: 'https://picsum.photos/200',
  price: '5',
  cuisine: 'Turkish',
  dishType: 'Soup',
};

const newDish3 = {
  title: 'new dish 3',
  ingredients: 'new ingredients 3',
  description: 'new dish description 3',
  images: 'https://picsum.photos/200',
  price: '15',
  cuisine: 'Turkish',
  dishType: 'Soup',
};

describe('order testing', () => {
  // CREATEING NEW ORDER
  it('Should Create new order', async () => {
    // CREATE NEW USER
    const dummyUser = await request(app)
      .post('/api/auth/customer/signup')
      .send(newCustomer);

    // CREATE NEW CHEF
    const dummyChef = await request(app)
      .post('/api/auth/chef/signup')
      .send(newChef);

    const userId = await User.findOne({ username: 'customer1' });
    const chefUsername = await User.findOne({ username: 'chef1' });

    // CREATE NEW DISH

    const dummyDish = await dishModel.create(newDish);

    // CREATE NEW ORDER
    let orderData = await request(app)
      .post(`/api/orders/${userId.id}/order`)
      .send({ dishid: `${dummyDish.id}`, quantity: '2' });

    orderData = JSON.parse(orderData.text);

    //  CHECK THE USER ID IN THE ORDER & THE DISH ID & THE TOTAL PRICE

    expect(orderData.customer).toEqual(userId.id);
    expect(orderData.dishes[0].dish).toEqual(dummyDish.id);
    expect(orderData.total_price).toEqual(10);
  });

  // GET THE LAST ORDER CREATED
  it('Should get the last order created', async () => {
    // FETCH THE USER
    const dummyUser = await User.findOne({ username: 'customer1' });

    // REQUEST THE ROUTE BY HIS ID
    let res = await request(app).get(`/api/orders/${dummyUser.id}/order`);
    res = JSON.parse(res.text);

    // CHECK THE CUSTOMER ID SIMILAR TO THE USER & THE TOTAL PRICE OF THE ORDER
    expect(res.customer).toEqual(dummyUser.id);
    expect(res.total_price).toEqual(10);
  });

  // UPDATE THE ORDER WE CREATED

  it('Should update the quantity and the total price', async () => {
    // FETCH THE USER
    const dummyUser = await User.findOne({ username: 'customer1' });

    const theOrder = await orderModel
      .findOne({ customer: dummyUser.id })
      .populate('dishes');

    let res = await request(app)
      .put(`/api/orders/${dummyUser.id}/order`)
      .send({ dishid: theOrder.dishes[0].dish, quantity: '12' });
    res = JSON.parse(res.text);

    expect(res.customer).toEqual(dummyUser.id);
    expect(res.dishes[0].quantity).toEqual(12);
    expect(res.total_price).toEqual(60);
  });

  // DELETE ONE DISH FROM THE ORDER
  it('Should delete the dish from the order', async () => {
    // CREATE NEW DISH

    const dummyDish = await dishModel.create(newDish3);
    const dummyUser = await User.findOne({ username: 'customer1' });

    const newDishToOrder = await request(app)
      .post(`/api/orders/${dummyUser.id}/order`)
      .send({ dishid: dummyDish.id.toString(), quantity: 1 });

    let res = await request(app)
      .delete(`/api/orders/${dummyUser.id}/order/dish`)
      .send({ dishid: `${dummyDish.id.toString()}` });
    res = JSON.parse(res.text);

    expect(res.dishes.length).toEqual(1);
    expect(res.dishes).not.toContain({ dish: dummyDish.toString(), price: 15 });
  });

  // DELETE THE ENTIRE ORDER WE CREATED
  it('Should delete the order with status add dishes', async () => {
    const dummyUser = await User.findOne({ username: 'customer1' });

    let res = await request(app).delete(`/api/orders/${dummyUser.id}/order`);
    res = JSON.parse(res.text);

    const userAfterDelete = await User.findOne({ username: 'customer1' });
    const deleteOrder = await orderModel.findOne({ customer: dummyUser });

    expect(userAfterDelete.orders.length).toEqual(0);
    expect(deleteOrder).toBe(null);
  });
});
