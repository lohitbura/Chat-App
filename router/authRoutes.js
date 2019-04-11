var express = require('express')
var router = require('express').Router();

router.get('/',(req,res)=>
{
	res.render('index');
});

router.post('/enter',(req,res)=>
{
	//var t = req.body.name;
	//console.log(t);
	res.render('chat');
});

module.exports = router;
