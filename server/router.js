const express = require("express");

//When const router = express.Router() is called, a slightly different mini app is returned. 
//The idea behind the mini app is that each route in your app can become quite complicated,
// and you'd benefit from moving all that code into a separate file. 
//Each file's router becomes a mini app, which has a very similar structure to the main app.
const router = express.Router();

// to handle get request 
//using router GET method and display the response if the user navigates to the '/' path
router.get("/", (req, res) => {
  res.send({ response: "Server is up and running." }).status(200);
});

module.exports = router;