//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// const dotenv = require('dotenv')
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
const datasbasURL= process.env.DBURL || 'mongodb://localhost:27017/keepDB';

mongoose.connect(datasbasURL, {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

///////////////////////////////////Requests Targetting all Articles////////////////////////

app.route("/articles")

.get(function(req, res){
  Article.find(function(err, foundArticles){
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  console.log(req.body.title, req.body.content)

  newArticle.save(function(err){
    if (!err){
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }
  });
})

// .delete(function(req, res){

//   Article.deleteMany(function(err){
//     if (!err){
//       res.send("Successfully deleted all articles.");
//     } else {
//       res.send(err);
//     }
//   });
// });

////////////////////////////////Requests Targetting A Specific Article////////////////////////

app.route("/articles/:ID")

.get(function(req, res){

  Article.findOne({title: req.params.ID}, function(err, foundArticle){
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found.");
    }
  });
})


// .patch(function(req, res){

//   Article.updateOne(
//     {title: req.params.ID},
//     {$set: req.body},
//     function(err){
//       if(!err){
//         res.send("Successfully updated article.");
//       } else {
//         res.send(err);
//       }
//     }
//   );
// })

.patch(function(req, res){
  console.log(req.body);
  Article.updateOne(
    {_id: req.params.ID},
    {$set: req.body},
    
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){

  Article.deleteOne(
    {_id: req.params.ID},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    }
  );
});

app.listen(4000, function() {
  console.log("Server started on port 4000");
});
