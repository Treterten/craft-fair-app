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
  //fetch both the name of customer a and b
  const aName = a.lastName.toUpperCase();
  const bName = b.lastName.toUpperCase();

  //if a is before b alphabetically then return 1, if it's after b return -1, if they're equal return 0
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
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      paid: req.body.paid,
      boothNumber: req.body.boothNumber
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
  //construct a proper mongodb object
  const customer = {
    _id: req.params.id,
    firstName: req.body.customer.firstName,
    lastName: req.body.customer.lastName,
    address: req.body.customer.address,
    paid: req.body.customer.paid,
    boothNumber: req.body.customer.boothNumber
  };
  //find and update the customer
  Customer.findByIdAndUpdate(req.params.id, customer)
    .then(result => {
      //send a success message
      res.status(200).json({ message: 'Post updated' });
    })
    //if there's an error, do the catch, otherwise js will ignore the rest
    .catch(error => {
      console.error(error);
      //send a failure message
      res.status(500).json({ message: 'There was a problem processing the request' });
    });
});

/* This middleware is going to get all the booths from the database */
app.get("/api/booths", async (req, res, next) => {
  Booth.find()
    //if there are no errors finding the booth, then move on below
    .then(booths => {
      console.log(booths);
      res.status(200).json({
        message: 'Booths fetched successfully',
        booths: booths
      });
    })
    //if there are errors for some reason, print them and report back
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Encountered a problem fetching the booths' });
    });
});

app.post("/api/booths", async (req, res, next) => {
  //construct a new booth object to be inserted
  const booth = new Booth({
    number: req.body.booth.number,
    isOpen: req.body.booth.isOpen,
    vendor: req.body.booth.vendor,
    size: req.body.booth.size,
    outlets: req.body.booth.outlets,
    tables: req.body.booth.tables
  });

  booth.save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Inserted successfully',
        boothId: result._id
      });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({
        messag: 'Failed to save the booth'
      });
    });
});

/* This middleware is going to delete a booth by its id number */
app.delete("/api/booths/:id", async (req, res, next) => {
  Booth.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({
      message: 'Deleted the booth successfully'
    });
  })
  .catch(error => {
    console.error(error);
    res.status(500).json({
      message: 'Failed to delete booth'
    });
  });
});

/* This middleware constructs a new booth from the given parameters, then updates the
booth with the same ID in the database */
app.patch("/api/booths/:id", async (req, res, next) => {
  //construct the new booth
  const booth = {
    _id: req.params.id,
    number: req.body.booth.number,
    isOpen: req.body.booth.isOpen,
    vendor: req.body.booth.vendor,
    size: req.body.booth.size,
    outlets: req.body.booth.outlets,
    tables: req.body.booth.tables
  };

  //Find and update the booth in the database
  Booth.findByIdAndUpdate(req.params.id, booth)
    .then(result => {
      //send a success message
      res.status(200).json({ message: 'Booth updated' });
    })
    .catch(error => {
      console.error(error);
      //send a failure message
      res.status(500).json({ message: 'Failed to update the booth' });
    });
});

module.exports = app;
