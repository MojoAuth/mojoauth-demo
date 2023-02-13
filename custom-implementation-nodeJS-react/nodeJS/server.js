var express = require('express');
var router = express.Router();
var jwt_decode = require('jwt-decode')
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
var debug = require('debug')('server:server');
var cors = require('cors');
var config = require('./config')
var mojoConfig = {
    apiKey: config.api_key,
  };
  
  var ma = require('mojoauth-sdk')(mojoConfig);
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
  app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // Pass to next layer of middleware
    next();
});

app.use(function (req, res, next) {

  if(req.headers['x-api-key']===config.api_key){

    next();
  } else{
    res.status(400)
    res.send("APIKey is Invalid")
  }
  
})
  //send email OTP
  app.post('/emailotp', function(req,res,next){


    if(req.body.email.split('@')[1]===config.whitelisted_domain){

      let email = req.body.email;
      let query = req.query
      ma.mojoAPI.signinWithEmailOTP(email, query).then((response)=>{

        res.status(200)
        res.json(response)
      }).catch(function (error) {
        res.status(404).json(error);
      });
    
    }else{
      res.status(200)
      res.json({ "error": `This email domain is not allowed for login.` })
    }
    
  })

  //verify Email OTP
  app.post('/emailotp/verify', function(req,res,next){

    let otp = req.body.otp;
    let state_id = req.body.state_id;
    ma.mojoAPI.verifyEmailOTP(otp,state_id).then((response)=>{
    if(response.authenticated){
      
      var jwtToken = response.oauth.access_token;
      ma.mojoAPI.verifyToken(jwtToken).then(function (response) {
    
            res.status(200)
            res.json(response)
          }).catch(function (error) {
            res.status(404).json(error);
          });
      
    }
    else {
      res.status(200)
      res.json(response)
    }
    
  }).catch((error)=> {
    res.status(404).json(error);
  });
})

  //Resend Email OTP
  app.post('/emailotp/resend', function(req,res,next){


    let state_id = req.body.state_id;
    let query = req.query;
    ma.mojoAPI.resendEmailOTP(state_id,query).then((response)=>{
      
        res.status(200)
        res.json(response)
      
    }).catch(function (error) {
      res.status(404).json(error);
    });
  })

  //Send Phone OTP
  app.post('/phoneotp', function(req,res,next){

      let phone = req.body.phone;
      // let iso_code = req.body.iso_code;
      let query = req.query;
      ma.mojoAPI.signinWithPhoneOTP(phone, query).then((response)=>{

        res.status(200)
        res.json(response)
      }).catch(function (error) {
        res.status(404).json(error);
      });
    
  })


  //Verify Phone OTP
  app.post('/phoneotp/verify', function(req,res,next){

    let otp = req.body.otp;
    let state_id = req.body.state_id;
    ma.mojoAPI.verifyPhoneOTP(otp,state_id).then((response)=>{
    if(response.authenticated){
      
      var jwtToken = response.oauth.access_token;
      ma.mojoAPI.verifyToken(jwtToken).then(function (response) {
    
            res.status(200)
            res.json(response)
          }).catch(function (error) {
            res.status(404).json(error);
          });
      
    }
    else {
      res.status(200)
      res.json(response)
    }
    
  }).catch((error)=> {
    res.status(404).json(error);
  });
})

  //Resend Phone OTP
  app.post('/phoneotp/resend', function(req,res,next){


    let state_id = req.body.state_id;
    let query = req.query;
    ma.mojoAPI.resendPhoneOTP(state_id,query).then((response)=>{
      
        res.status(200)
        res.json(response)
      
    }).catch(function (error) {
      res.status(404).json(error);
    });
  })


  //Verify Token
  // app.post('/token/verify', function(req,res,next){
  //   var jwtToken = req.body.token;
  // ma.mojoAPI.verifyToken(jwtToken).then(function (response) {
    
  //     res.status(200)
  //     res.json(response)
  //   }).catch(function (error) {
  //     res.status(404).json(error);
  //   });
    
  // })


  //Start Server 
  var server = http.createServer(app);
  server.listen(3002,()=>{
    console.log("server running")})
  server.on('error', onError);
  server.on('listening', onListening);

  function onListening() {
    console.log("listening")
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }