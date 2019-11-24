const ObjectId = require("mongodb").ObjectId;

module.exports = function(app, passport, db, mongoose) {
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get("/", function(req, res) {
    res.render("index.ejs");
  });

  // PROFILE SECTION =========================
  app.get("/flashcards", checkIfLoggedIn, function(req, res) {
    db.collection("Flash Cards")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        let generator = [];
        if (result.length >= 2) {
          console.log("Ids from Original Array");
          for (let i = 0; i < result.length - 1; i++) {
            console.log(result[i]._id);
          }
          for (let i = 0; i < result.length - 1; i++) {
            let location = result.length;
            let random = Math.floor(Math.random() * result.length);
            if (random > result.length / 2) {
              location - 1;
            } else {
              location - 2;
            }
            result.splice(location, 0, result[Math.floor(random)]);
            generator.push(result[location]);
            break;
          }
          console.log("Ids from Second Array");
          for (let i = 0; i < generator.length; i++) {
            console.log(generator[i]._id);
          }
        }
        res.render("userProfile.ejs", {
          user: req.user,
          messages: generator
        });
      });
  });

  // LOGOUT ==============================
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // message board routes ===============================================================

  app.post("/flashcards", (req, res) => {
    db.collection("Flash Cards").save(
      {
        questions: req.body.questions,
        answers: req.body.answers
      },
      (err, result) => {
        if (err) return console.log(err);
        console.log("Saved");
        res.redirect("/flashcards");
      }
    );
  });

  app.put("/flashcards", (req, res) => {
    console.log(`${req.body._id}`);
    console.log(ObjectId(req.body._id));
    console.table(req.body);
    db.collection("Flash Cards").findOneAndUpdate(
      { _id: ObjectId(req.body._id) },
      {
        $set: {
          questions: req.body.questions,
          answers: req.body.answers
        }
      },
      { new: true },
      (err, result) => {
        if (err) {
          console.log("err", err);
          return res.send(err);
        }
        console.log("res", result);
        res.send(result);
      }
    );
  });

  app.delete("/flashcards", (req, res) => {
    db.collection("Flash Cards").findOneAndDelete(
      {
        questions: req.body.questions,
        answers: req.body.answers
      },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send("Message deleted!");
      }
    );
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/login", function(req, res) {
    res.render("login.ejs", {
      message: req.flash("loginMessage")
    });
  });

  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/flashcards", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function(req, res) {
    res.render("signup.ejs", {
      message: req.flash("signupMessage")
    });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/flashcards", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", checkIfLoggedIn, function(req, res) {
    let user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect("/flashcards");
    });
  });
};

// route middleware to ensure user is logged in
function checkIfLoggedIn(req, res, next) {
  // console.log("Check", req);
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}
