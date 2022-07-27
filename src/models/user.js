const mongoose = require("mongoose");
const location=require("./location");
const UserSchema = mongoose.Schema({
      id :{type: Schema.Types.ObjectId,},
      role:{
            type:string,
            enum:["chef","customer","admin"]
      },

      locations: {
            ref: 'Location',
            type: [mongoose.Schema.Types.ObjectId],        
            default: [],
          },
     
   
      first_name:{
        type: String,
        unique: false,
        requied: true,
              },
   
      last_name:{
        type: String,
        unique: false,
        requied: true,
             },
   
             user_name: {
                  type: String,
                  match: [
                    // eslint-disable-next-line node/no-unsupported-features/es-syntax
                    /^(?=.{2,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
                    `invalid username`,
                  ],
                  required: true,
                  unique: true,
                  lowercase: true,
                },
   
                email: {
                  type: String,
                  match: [
                    /^[a-zA-Z0-9\-_.]+@[a-z]+\.([a-z]{2,3})+(\.[a-z]{2,3})?$/,
                    `invalid email`,
                  ],
                  required: true,
                  unique: true,
                  lowercase: true,
                },
   
   email_verified:{ 
        type:Boolean,
        requied:true,
                  },
   
   
   password: {
        type: String,
        requied: true,
             },
   
   
   phone:{
         type:Number,
         requied:true,
         unique:true,
         },
   
   
   avatar:{
      type:string,
   },
   
   
   birthday:{
    type:Date,
    requied:true,
   },
   
   
   created_at:{
    type: Date,
    default: Date.now,
   },
},
   {timestamps: true},
   { toJSON: { virtuals: true } },
    { toObject: { virtuals: true } }

);
userSchema.virtual('full_name').get(function () {
      return `${this.first_name} ${this.last_name}`;
  });
exports.module = User = mongoose.model("User", UserSchema);