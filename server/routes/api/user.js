const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post(
    "/signup",
    [
        body('username').not().isEmpty(),
        // username must be an email
        body('email').isEmail(),
        // password must be at least 5 chars long
        body('password').isLength({ min: 5 })
    ],
    async (req, res) => {
        console.log(req.body, 'reqq');
        console.log('weeee');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const { username, email, password } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (user) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }

            user = new User({
                username,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

/**
 * @method - POST
 * @param - /login
 * @description - User Login
 */


router.post(
  "/login",
  [
      // username must be an email
      body('email').isEmail(),
      // password must be at least 5 chars long
      body('password').isLength({ min: 5 })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({
        email
      });
      if (!user)
        return res.status(400).json({
          message: "User Not Exist"
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !"
        });

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: new Date().setDate(new Date().getDate() + 1)
        },
        (err, token) => {
          if (err) throw err;
          res.cookie('access_token', token, { 
              sameSite: "strict",
              path: "/",
              httpOnly: true,
              expires: new Date(new Date().getTime + 100 * 1000)
          });
          res.status(200).json({ success: true });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);

router.post("/logout", auth, async (req, res) => {
  res.cookie('access_token', 'none', {
    expires: new Date(Date.now()),
    httpOnly: true,
  })
  res.status(200).json({ success: true, message: 'User logged out successfully' })
  }
);

module.exports = router;