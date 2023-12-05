var express = require('express');
var router = express.Router();
const User = require('../models/user'); // adjust the path to where your User model is located

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
// routes/index.js or wherever you manage your routes
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});
// Inside routes/index.js or a similar file

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Here you should look for the user in the database and compare the password
    // In a real application, you should hash the password and compare the hashes
    const user = await User.findOne({ username: username });
    if (user && password === user.password) {
      // User authenticated
      // Proceed with creating user session or JWT
      res.redirect('/dashboard'); // redirect to user dashboard or another protected route
    } else {
      // Authentication failed
      res.redirect('/login');
    }
  } catch (error) {
    console.error(error);
    res.redirect('/login');
  }
});
router.post('/register', async (req, res) => {
  // Extract form data from req.body
  const { username, email, password, confirmPassword } = req.body;

  // Form validation logic goes here (e.g., check if passwords match)
  // Registration logic (e.g., hash password, save user to database)

  try {

    if (password === confirmPassword) {
      // Hash the password - never store plain-text passwords
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user instance and save to database
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      // Redirect to the login page after successful registration
      res.redirect('/login');
    } else {
      // If passwords do not match, re-render the register page with an error message
      res.render('register', {
        title: 'Register',
        error: 'Passwords do not match.'
      });
    }
  } catch (error) {
    // Handle errors, such as username already taken, etc.
    res.render('register', {
      title: 'Register',
      error: 'An error occurred during registration.'
    });
  }
});

module.exports = router;
