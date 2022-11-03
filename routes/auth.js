const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware");
const Bodyfat = require("../models/bodyfat");

// clients used on ejs template to access this data.
// isLoggedIn. Middleware being exported from middleware.js file. Checks if user is logged in.
router.get("/", isLoggedIn, async (req, res) => {
  const clients = await Bodyfat.find({});
  res.render("home", { clients });
});

//Route handler for creating new client.
router.post("/", isLoggedIn, async (req, res) => {
  const client = new Bodyfat(req.body);
  client.author = req.user._id;
  await client.save();
  req.flash("success", "Successfully created a new client!");
  res.redirect("/");
});

// Route handler for deleting client
// Using clientCheck to determine that clients author and user id are the same so that only the user can alter the clients data. Extra layer of protection.
router.delete("/clients", isLoggedIn, async (req, res) => {
  const clientCheck = await Bodyfat.findOne({ name: req.body.name });
  if (!clientCheck.author.equals(req.user._id)) {
    console.log("YOU DO NOT HAVE PERMISSION TO DO THAT!");
  } else {
    await Bodyfat.deleteOne(req.body)
      .then(() => {
        res.json(`Deleted user`);
      })
      .catch(() => {
        res.redirect("/");
      });
  }
});

// Router for adding new test to client
// Using clientCheck to determine that clients author and user id are the same so that only the user can alter the clients data. Extra layer of protection.
router.put("/clients", isLoggedIn, async (req, res) => {
  try {
    const clientCheck = await Bodyfat.findOne({ name: req.body.name });

    if (!clientCheck.author.equals(req.user._id)) {
      console.log("YOU DO NOT HAVE PERMISSION TO DO THAT!");
    } else {
      await Bodyfat.findOneAndUpdate(
        { name: req.body.name },
        {
          $push: {
            test: {
              date: req.body.date,
              bodyfat: req.body.bodyfat,
              weight: req.body.weight,
              leanMass: req.body.leanMass,
              classification: req.body.classification,
            },
          },
        },
        {
          upsert: true,
        }
      )
        .then(() => {
          res.json("Success");
        })
        .catch(() => {
          res.redirect("/");
        });
    }
  } catch (err) {
    res.json("Error");
  }
});

// Handler to delete individual tests
router.delete("/testdelete", isLoggedIn, async (req, res) => {
  const testId = req.body.testId;
  const authorId = req.body.authorId;
  console.log(authorId);

  const clientCheck = await Bodyfat.findOne({ author: authorId });

  if (clientCheck) {
    try {
      const testCheck = await Bodyfat.findOneAndUpdate(
        { author: authorId },
        {
          $pull: {
            test: { _id: testId },
          },
        }
      )
        .then(() => {
          res.json(`Test deleted`);
        })
        .catch(() => {
          res.redirect("/");
        });
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("author id doesnt match!");
  }

  //Check if test exists
  // const testCheck = await Bodyfat
});

module.exports = router;
