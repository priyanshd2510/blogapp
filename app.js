var express = require("express");
var app =express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override"); 
var expressSantizer = require("express-sanitizer");
//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app",{useNewUrlParser:true,useUnifiedTopology:true});
app.use(bodyParser.urlencoded({extended:true}));
 app.set("view engine","ejs");
 app.use(express.static("public"));
 app.use(methodOverride("_method"));
app.use(expressSantizer());
//SCHMEA
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});
//MODEL
var Blog = mongoose.model("Blog",blogSchema)

//RESTFUL ROUTES
app.get("/",function(req,res){
    res.redirect("/blogs");
});
//INDEX ROUTE
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:blogs});
        }
    });
  
});

//NEW AND CREATE
app.get("/blogs/new",function(req,res){
    res.render("new");
});

app.post("/blogs",function(req,res){
    //create blog
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        }else{
            //redirect to index
            res.redirect("/blogs");
        }
    });
    
});

  //show route
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:foundBlog});
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs")
        }else{
            res.render("edit",{blog:foundBlog});
        }
    });
    
});

//UPDATE
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//DELETE
app.delete("/blogs/:id",function(req,res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id,function(err){
         if(err){
             res.redirect("/blogs");
         }else{
             res.redirect("/blogs");
         }
   });
});


 app.listen(3000,function(){
     console.log("SERVER RUNNING ON PORT 3000!!!!");
 });