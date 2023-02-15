const express = require('express');
const router = express.Router();

router.get('/tickers/:code', (req, res) => {
  console.log(`Code: ${req.params.code}`)
  res.send(req.params.code);
});

module.exports = router;
