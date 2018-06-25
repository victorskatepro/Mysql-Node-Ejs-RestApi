const express = require("express");
const app = express()
const mysql = require("mysql")
const bodyParser= require('body-parser')
const multer = require('multer');

const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

var nombreImagen = '';
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        crypto.pseudoRandomBytes(32,function(err,raw){
            nombreImagen = raw.toString('hex') + path.extname(file.originalname);
            cb(null, nombreImagen);
        })

    }
});
var upload = multer({storage: storage});


app.use("/bootstrap",express.static(__dirname+"/bootstrap"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs')
app.use(express.static('public/images'));

con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'node_mysql',
    port: 8889
});


app.listen(6080,function(){
    console.log("Listening on 6080 ...");
});

app.get("/",function(req,res){
    con.query("select * from libros",function(error,result){
        res.render("index.ejs",{lista:result,message:0});
    });
});

app.get("/nuevo",function(req,res){
    res.render("nuevo.ejs",{});
});

app.post("/guardar",upload.single('libro[imagen]'),function(req,res,next){
    //titulo resumen imagen fecha
    //Se sube la imagen
    var tit = req.body.libro.titulo;
    var resu = req.body.libro.resumen;
    var img = nombreImagen;
    var fec = req.body.libro.fecha;

    con.query("insert into libros (titulo,resumen,imagen,fecha) value (\""+tit+"\",\""+resu+"\",\""+img+"\",\""+fec+"\")",function(error,result){
    });
    res.redirect('/');
});

app.get("/editar/:libroid",function(req,res){
    con.query("select * from libros where id="+req.params.libroid,function(error,result){
        res.render("editar.ejs",{libro:result[0]});
    });
});

app.post("/actualizar",function(req,res){
    //titulo resumen imagen fecha
    var id = req.body.libro.id;
    var tit = req.body.libro.titulo;
    var resu = req.body.libro.resumen;
    var img = req.body.libro.imagen;
    var fec = req.body.libro.fecha;
    con.query(" update libros set titulo=\""+tit+"\",resumen=\""+resu+"\",imagen=\""+img+"\",fecha=\""+fec+"\" where id="+id,function(error,result){
    });
    res.redirect('/');


});

app.get("/eliminar/:libroid",function(req,res){
    con.query("delete from libros where id="+req.params.libroid,function(error,result){
    });
    fs.unlink(__dirname+"/public/images"+nombreImagen, function(err) {
        if (err) {
            return console.error(err);
        }
        console.log('File deleted successfully!');
    });

    res.redirect("/");
});


