const User = require('../models/user').User;

//function to create a new user
const createUser = async (req, res) => {
  
  //getting the data from the request body with the data missing from google auth
  //   const { role, username, password, phone, avatar, birthday, gender } =
  //     req.body;
    const newData = {
      role: req.body.role,
      username: req.body.username,
      password: req.body.password,
      phone: req.body.phone,
      avatar: req.body.avatar,
      birthday: req.body.birthday,
      gender: req.body.gender,
    };
    const { id } = req.params;
    if(!role || !username || !password || !phone || !avatar || !birthday || !gender){
        res.status(400).json({message: "Please fill all the required fields"})
    }
    try {
      //finding the user with the id from the request params and updating the data
      const user = await User.findByIdAndUpdate(id, newData, {
        new: true,
      });
      console.log('the user is updated');
      console.log(user);
    } catch (error) {
      res.status(500).json({ error });
    }
    };

module.exports = { createUser };
