// server.js

// set up ======================================================================
// get all the tools we need
let express = require("express");
let app = express();
let portNumber = process.env.PORT || 8000;
const MongoClient = require("mongodb").MongoClient;
let mongoose = require("mongoose");
let passWord = require("passport");
let flash = require("connect-flash");
let morgan = require("morgan");
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");
let session = require("express-session");
let mongoDataBase = require("./config/database.js");
let db;

// configuration ===============================================================
mongoose.connect(mongoDataBase.url, (err, database) => {
  if (err) return console.log(err);
  db = database;
  require("./app/routes.js")(app, passWord, db, mongoose);
}); // connect to our database

//app.listen(port, () => {
// MongoClient.connect(configDB.url, { useNewUrlParser: true }, (error, client) => {
//     if(error) {
//         throw error;
//     }
//     db = client.db(configDB.dbName);
//     console.log("Connected to `" + configDB.dbName + "`!");
//     require('./app/routes.js')(app, passport, db);
// });
//});

require("./config/passport")(passWord); // pass passport for configuration

// set up our express application
app.use(morgan("dev")); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs"); // set up ejs for templating

// required for passport
app.use(
  session({
    secret: "resilient", // session secret
    resave: true,
    saveUninitialized: true
  })
);
app.use(passWord.initialize());
app.use(passWord.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
//require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(portNumber);
console.log("You connected to the Flash Card APP!");
