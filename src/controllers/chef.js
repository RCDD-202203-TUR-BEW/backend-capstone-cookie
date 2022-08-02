const user=require('./models/user');
const order=require('./models/order');
const dish=require('./models/dish');
const post=require('./models/post');

// ****create new chef account ******
const signup=(req,res)=>{
    user.findone({user_name:req.body.user_name},(err,data)=>{
        //if username not in the DB add it
        if (!data){
        //create new user object using the user modeland req body
        const newuser= new user({
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            user_name:req.body.user_name,
            email:req.body.email,
            password_hash:req.body.password_hash,
            phone:req.body.phone,
            avatar:req.body.avatar,
            birthday:req.body.birthday,
            gender:req.body.gender,
            provider:req.body.provider,
            enum:'chef',
            kitchen_name:req.body.kitchen_name,
            bio:req.body.bio,
        })
        //save this object to DB
        newuser.save((err,data)=>{
            if (err) return res.json({Error:err});
            return res.json(data);
        })
        //if there is an error or this user already exist in the DB return message
    }else{
            if(err) return res.json(`Something went wrong, please try again. ${err}`);
            return res.json({message:"User already exists"});
        }
    } )

  };

  // *** End of create new chef ******
  // post new dish ((((((((((((((((((((not completed))))))))))))))))))))
  const newdish = (req, res) => {
    //check if the dish name already exists in db
    dish.findOne({ name: req.body.name }, (err, data) => {

        //if dish not in db, add it
        if (!data) {
            //create a new dish object using the dish model and req.body
            const newdish = new dish({
                cuisine:req.body.cuisine,
                dish_type:req.body.dish_type,
                name:req.body.name,
                image: req.body.image, 
                description: req.body.description,
                price:req.body.price,
                edited_at:Date.now,
            })

            // save this object to database
            newTea.save((err, data)=>{
                if(err) return res.json({Error: err});
                return res.json(data);
            })
        //if there's an error or the dish is in db, return a message         
        }else{
            if(err) return res.json(`Something went wrong, please try again. ${err}`);
            return res.json({message:"Dish already exists"});
        }
    })    
};

//get all dishes
const getAlldish = (req, res) => {
    //here all dishes for all chfs , not just for his dish
    dish.find({}, (err, data)=>{
        if (err){
            return res.json({Error: err});
        }
        return res.json(data);
    })
};

//get all orders
const getAllorders = (req, res) => {
    //I need a condition , all order for this chef ???
    order.find({}, (err, data)=>{
        if (err){
            return res.json({Error: err});
        }
        return res.json(data);
    })
};

//get dish from it's name
const getOnedish = (req, res) => {
    let name = req.params.name; //get the dish name

    //find the specific dish with that name
    dish.findOne({name:name}, (err, data) => {
    if(err || !data) {
        return res.json({message: "dish doesn't exist."});
    }
    else return res.json(data); //return the dish object if found
    });
}; 
//update his information
const updateDetails=(req,res)=>{
   
};


module.exports={signup,newdish,getAlldish,getAllorders,getOnedish,updateDetails};