const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = process.env.secret;

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: 'The user not found', data: undefined });
  }
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        name: user.name,
                },
      secret,
      { expiresIn: '500d' }
    );
    return res.status(200).json({
      success: true,
      message: 'Login Success',
      data: { user: user.email, token: token },
    });
  } else {
    return res
      .status(400)
      .json({ success: false, message: 'password is wrong!', data: undefined });
  }
});

router.post('/register', async (req, res) => {
  const checkEmail = await User.findOne({ email: req.body.email });
  const checkUserName = await User.findOne({ username: req.body.username });
  if (checkEmail) {
    return res.status(400).send({
      message: 'Email already in use please use different one',
      data: undefined,
      success: false,
    });
  } else if (checkUserName) {
    return res.status(400).send({
      message: 'Username already in use please use different one',
      data: undefined,
      success: false,
    });
  } else {
    let user = new User({

    
       
      name:req.body.name,
       email: req.body.email,
       passwordHash: bcrypt.hashSync(req.body.password, 10),
      isAdmin: true,
     });
    user = await user.save();

    if (!user)
      return res.status(400).send({
        message: 'The user cannot be created!',
        data: undefined,
        success: false,
      });
    else {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          isAdmin: user.isAdmin,
          name: user.name,
        },
        secret,
        { expiresIn: '500d' }
      );
      return res.status(200).json({
        success: true,
        message: 'Account created successfully',
        data: { user: user.email, token: token, sucess: true },
      });
    }
  }
});

router.get(`/`, async (req, res) => {
  const userList = await User.find().select('-passwordHash');

  if (!userList) {
    res.status(500).json({ success: false, message: 'No Users' });
  }
  return res
    .status(200)
    .json({ success: true, message: 'Users', data: userList });
});

 
 
module.exports = router;
