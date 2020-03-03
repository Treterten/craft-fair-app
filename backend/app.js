const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 minutes
  max: 100 //limits each IP to 100 requrests per windowMs
});


const Customer = require('./models/customer');
const Password = require('./models/password');
const Booth = require('./models/booth');


const app = express();

/* This block of code will fix all depreciation issues with the current versions of mongoose and mongodb */
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

/* Connect to the database, then log to the console if you failed to connect or if you successfully connected */
mongoose.connect('mongodb+srv://Mike:ka2qAJ3MS99XIbwe@cluster0-zyfo6.mongodb.net/backend?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed');
  });

/* This block will set the headers and other prerequisites to use our app with a restful API */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(limiter); //implement the limiter above

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

//depreciated function, pay no mind to this
/* function rehashPassword(username, password) {
  let hashedUsername = bcrypt.hashSync(username, 10);
  let hashedPassword = bcrypt.hashSync(password, 10);
  const savedPassword = new Password({
    username: hashedUsername,
    password: hashedPassword
  });
  savedPassword.save().then(() => {
    console.log("saved successfully");
  });
} */

/* This middleware compares the password entered by the user to the one in the database.
if the passwords match, it returns true (essentially anyway) and if they don't match it returns false */
app.post("/api/login", async (req, res, next) => {
  const password = req.body.password;
  const username = req.body.username;

  //find the correct username and password from the database
  const user = await Password.find().exec();

  //true if both the username and password are correct
  const match = await bcrypt.compare(username, user[0].username) && await bcrypt.compare(password, user[0].password);

  //if they're both correct, send a success response, else send a failure response
  if(match) {
    res.status(200).json({
      message: 'Login Successsful'
    });
  } else {
    res.status(422).json({
      message: 'Invalid Password'
    });
  }
  //poopys
  console.log(password);
});

/* This middleware is fetching all customers from the database */
app.get("/api/customer-list", async (req, res, next) => {
  Customer.find()
    .then(customers => {
      console.log(customers);
      const customersSorted = customers.sort(compareNames); //sorting the customers by name alphabetically
      res.status(200).json({
        message: 'Customers fetched successfully',
        customers: customersSorted
        });
    });
});

//Helper function that sorts customers by alphabetical order
function compareNames(a, b) {
  const aName = a.name.toUpperCase();
  const bName = b.name.toUpperCase();

  let comparison = 0;
  if(aName > bName) {
    comparison = 1;
  } else if(aName < bName) {
    comparison = -1;
  }
  return comparison;
}


//this is gonna post new customers to the database
app.post("/api/customer-list", async (req, res, next) => {
    const customer = new Customer({
      name: req.body.name,
      address: req.body.address
    });

    //save the new customer to the database
    customer.save().then(createdCustomer => {
      console.log(createdCustomer);
      //send a success message with the id attatched
      res.status(201).json({
        id: createdCustomer.id,
        message: 'Customer added successfully'
      });
    })
    .catch(err => {
      console.error(err);
      //send a failure message
      res.status(500).json({
        message: 'failed to add customer'
      });
    });
});

/* This middleware finds and deletes a customer by their id */
app.delete("/api/customer-list/:id", async (req, res, next) => {
  Customer.deleteOne({_id: req.params.id }).then(result => {
    console.log(result);
    //send a success message
    res.status(200).json({
      message: 'Customer deleted'
    });
  });
});


/* this middleware will find a customer by their ID and update the content
  of them in the database */
app.patch("/api/customer-list/:id", async (req, res, next) => {
  console.log(req.body.customer);
  //construct a proper mongodb object
  const customer = {
    _id: req.params.id,
    name: req.body.customer.name,
    address: req.body.customer.address
  };
  //find and update the customer
  Customer.findByIdAndUpdate(req.params.id, customer)
    .then(result => {
      //send a success message
      res.status(200).json({ message: 'Post updated' });
    })
    .catch(error => {
      console.error(error);
      //send a failure message
      res.status(500).json({ message: 'There was a problem processing the request' });
    });
});

/* This middleware is going to get all the booths from the database */
app.get("/api/booths", async (req, res, next) => {
  Booth.find()
    .then(booths => {
      console.log(booths);
      res.status(200).json({
        message: 'Booths fetched successfully',
        booths: booths
      });
    });
});

module.exports = app;
