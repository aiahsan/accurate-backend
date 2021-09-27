const express = require('express');
const router = express.Router();
 
const { Contact } = require('../models/contact');

router.get(`/`, async (req, res) => {
  
  const contactList = await Contact.find();

  return res.status(200).json({
    success: false,
    message: '',
    data: {
      
      contactList: contactList ? contactList : [],
    },
  });
});

router.post('/', async (req, res) => {
try{
  let contact = new Contact({
    company: req.body.company,
    name: req.body.name,
    phone: req.body.phone?req.body.phone:"",
    email: req.body.email,
    message: req.body.message,
  });
  contact = await contact.save();

  if (!contact)
    return res.status(400).json({
      success: false,
      message: 'Error',
      data: undefined,
    });

  return res.status(200).json({ success: true, message: 'Request Submitted' });
}
catch(e)
{
  return res.status(500).json({
    success: false,
    message: 'Error',
    data: undefined,
  });
}
});

module.exports = router;