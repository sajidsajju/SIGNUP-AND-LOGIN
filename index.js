const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

//Import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
// app.use(express.static('./css/signup.css'));
app.use('/css',express.static('css'));
// const pug = require('pug');
app.use(bodyParser.urlencoded({extended:false}))

dotenv.config();
// app.set('view engine' , 'pug')
//connect to DB
mongoose.connect(
  process.env.DB_CONNECT,   {useUnifiedTopology: true, useNewUrlParser: true},()=> console.log('connected to DB!')
);

app.get('/', (req,res) =>{
  res.sendFile('home.html', {root: __dirname});
})

app.get('/login',(req,res)=>{
  res.sendFile('signin.html',{root: __dirname});
})

// app.post('/register', (req,res) =>{
//   var name= 'hello '+req.body.name; 
//   res.send(req.body);
// })

//Middleware
// app.use(express.json());


//Route middleware
 app.use('',authRoute);
 app.use('',postRoute);


app.listen(3000, ()=> console.log('server is up and running in '));