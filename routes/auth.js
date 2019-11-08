const router = require('express').Router();
// const express = require('express');
// const app = express();
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
// const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');


//app.use(bodyParser.urlencoded({extended:false}))


router.post('/register',async (req,res)=>{

    //LEts validate the data before we make a user
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    // console.log(req.body);
        //  const validation =await schema.validate(req.body);
        //  res.send(validation);
        
        //checking if the user is already in the database
        const emailExist = await User.findOne({email: req.body.email});
        if(emailExist) return res.status(400).send('Email already exists');


        //HASH passwords
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(req.body.password, salt);

//create a new user
   const user = new User({
       name : req.body.name,
       email : req.body.email,
       password : hashedPassword
   })


try{
    const savedUser = await user.save();

    //console.log(savedUser);
    // res.send({user: user._id});
    res.send(req.body.name +' you are successfully registered');
}
catch(err){
    res.status(400).send(err);
}

});


// router.post('/register', (req,res) =>{
//     var name= 'hello '+req.body.name; 
//     res.send(req.body);
//   })
  
  
//Login
router.post('/login',async (req,res) =>{
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //checking if the email exists
    const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).send('Email is not found');
        //Password is correct?
            const validPass = await bcrypt.compare(req.body.password,user.password);
            if(!validPass) return res.status(400).send('Invalid Password');

            //Create and assign a token
            const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
            // res.header('auth-token', token).send(token);
            res.send('Welcome '+user.name+' !');
    
});

module.exports = router;