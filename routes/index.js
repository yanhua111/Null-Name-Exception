var express = require('express');
var router = express.Router();
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Expresssss' });
// });



router.get('/', (req,res, next)=>{
  res.send("Hello get");
})

router.post('/', (req,res)=>{

  res.send("Hello post");
  console.log(req.body);
})

router.get('/session-test', (req, res, next)=>{
  const session = req.session
  if(session.viewNum == null){
    session.viewNum = 0
  }
  session.viewNum++;
  
  res.json({
    viewNum: session.viewNum
  });
})



module.exports = router;
