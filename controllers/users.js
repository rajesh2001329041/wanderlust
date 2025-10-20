const User = require("../models/user");

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect to listings after successful signup
 */
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        req.login(registerUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

/**
 * @swagger
 * /signup:
 *   get:
 *     summary: Render the signup form
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Render signup page
 */
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Render the login form
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Render login page
 */
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login the user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect to listings after successful login
 */
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout the user
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect after logout
 */
module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) next(err);
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
};
