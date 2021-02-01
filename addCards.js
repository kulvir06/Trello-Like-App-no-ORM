const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const randomGen = require('./user methods/randomGen');
const emailExtractor = require("./user methods/emailExtractor.js");
const mysql = require('mysql');

router.use(bodyParser.urlencoded({extended: true}));
router.use(express.json());

const dbconnect = require("./user methods/connection.js");
const listCardsUpdate = require("./user methods/listCardsUpdate");
const con =dbconnect.connection();

let listName,boardName ;

router.get("/:id1/:id2",function(req,res){
    listName = req.params.id2;
    boardName = req.params.id1;
    res.sendFile(__dirname+"/html/addCards.html");
})

router.post("/",function(req,res){
    let name = req.body.name;
    let description = req.body.description;
    let users = req.body.users;
    let id = randomGen.randomGen().toString();

    let email = (emailExtractor.email(users));

    email.forEach(email => {
        let sql = "insert into cards values("+mysql.escape(id)+","+mysql.escape(name)+","+mysql.escape(description)+","+mysql.escape(email)+");";
        con.query(sql,function(err,result,fields){
            if(err) throw err;
            console.log('card created');
        })
                
    });

    let sql = "select cards,lists.id from lists,boards where boards.name="+mysql.escape(boardName)+" and lists.name="+mysql.escape(listName)+" limit 1;"
    con.query(sql,function(err,result,fields){
        if (err) throw err; 
        let x = (result[0].cards); 
        let list_id = result[0].id; 
        if(x==null) x="";
        x=x+id+',';
        listCardsUpdate.update(x,listName,list_id);
                           
    })
})

module.exports=router;
