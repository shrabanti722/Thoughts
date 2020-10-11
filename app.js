var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express();

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_thought_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//MONGOOSE/MODEL CONFIG
var thoughtSchema = new mongoose.Schema({
     title: String,
     image: {type:String, default: ""},
     body: String,
     create: {type: Date, default: Date.now}
})

var Thought = mongoose.model("Thought", thoughtSchema);
/*
Thought.create({
title: "Test Thought",
image: "https://images.unsplash.com/photo-1536500152107-01ab1422f932?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
body: "HELLo, I'M JUST TESTING"
});
*/


//RESTFUL ROUTES

app.get("/", function(req,res){
      res.redirect("/thoughts");
})

app.get("/thoughts", function(req,res){
      Thought.find({}, function(err, thoughts){
           if(err){
             console.log("ERROR!!");
            }
            else {
                res.render("index", {thoughts: thoughts});
            } 
    });
})

//NEW ROUTE
app.get("/thoughts/new", function(req, res){
      res.render("new");
})

//CREATE
app.post("/thoughts", function(req, res){
      req.body.thought.body = req.sanitize(req.body.thought.body);
      Thought.create(req.body.thought, function(err, newThought){
              if(err) res.render("new");
              else res.redirect("/thoughts");
      });
}); 

//SHOW ROUTE
app.get("/thoughts/:id", function(req,res){
      Thought.findById(req.params.id, function(err, foundThought){
            if(err) res.redirect("/thoughts");
            else res.render("show",{thought:foundThought});
      })
});

//EDIT ROUTE
app.get("/thoughts/:id/edit", function(req, res){
       Thought.findById(req.params.id, function(err, foundThought){
             if(err) res.redirect("/thoughts");
             else res.render("edit", {thought:foundThought});
       })
})

//UPDATE ROUTE
app.put("/thoughts/:id", function(req,res){
      req.body.thought.body = req.sanitize(req.body.thought.body);
      Thought.findByIdAndUpdate(req.params.id, req.body.thought, function(err, updatedThought){
            if(err) res.redirect("/thoughts");
            else res.redirect("/thoughts/"+req.params.id);
      })
})

//DELETE ROUTE
app.delete("/thoughts/:id", function(req,res){
      Thought.findByIdAndRemove(req.params.id, function(err){
             if(err) res.redirect("/thoughts");
             else res.redirect("/thoughts");
      })
})

/*
app.listen(process.env.PORT, process.env.IP, function(){
      console.log("SERVER IS RUNNING!");
})
*/

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);

