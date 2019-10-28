const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');

const request = require('request');
const cheerio = require('cheerio');

const Comment = require('../models/Comments');
const Article = require('../models/Articles');

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI =
  process.env.URI_CONNECTION || 'mongodb://localhost/mongoHeadlines';
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

router.get('/', (req, res, next) => {
  res.redirect('/articles');
});

router.get('/api/scrape', function(req, res) {
  request('http://www.theverge.com', function(error, response, html) {
    var $ = cheerio.load(html);
    var titlesArray = [];

    $('.c-entry-box--compact__title').each(function(i, element) {
      let result = {};

      result.title = $(this)
        .children('a')
        .text();
      result.link = $(this)
        .children('a')
        .attr('href');


        
      if (result.title !== '' && result.link !== '') {
        if (titlesArray.indexOf(result.title) == -1) {
          titlesArray.push(result.title);

          Article.count({ title: result.title }, function(err, test) {
            if (test === 0) {
              var entry = new Article(result);

              entry.save(function(err, doc) {
                if (err) {
                  console.log(err);
                } else {
                  console.log(doc);
                }
              });
            }
          });
        } else {
          console.log('Article already exists.');
        }
      } else {
        console.log('Not saved to DB, missing data');
      }
      console.log(result)
    });
    res.redirect('/');
  });
});
router.get('/articles', function(req, res) {
  Article.find()
    .sort({ _id: -1 })
    .exec(function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        var artcl = { article: doc };
        res.render('index', artcl);
      }
    });
});

router.get('/api/article/all', (req, res) => {
  Article.find({}, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      res.json(doc);
    }
  });
});

router.get('/clearAll', (req, res) => {
  Article.remove({}, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      console.log('removed all articles');
    }
  });
  res.redirect('/articles-json');
});

router.get('/readArticle/:id', function(req, res) {
  var articleId = req.params.id;
  var hbsObj = {
    article: [],
    body: []
  };

  Article.findOne({ _id: articleId })
    .populate('comments')
    .exec(function(err, doc) {
      if (err) {
        console.log('Error: ' + err);
      } else {
        hbsObj.article = doc;
        let link = doc.link;
        request(link, function(error, response, html) {
          let $ = cheerio.load(html);

          $('.l-col__main').each(function(i, element) {
            hbsObj.body = $(this)
              .children('.c-entry-content')
              .children('p')
              .text();

            res.render('article', hbsObj);
            return false;
          });
        });
      }
    });
});

router.post("/comment/:id", function(req, res) {
    var user = req.body.name;
    var content = req.body.comment;
    var articleId = req.params.id;
  
    var commentObj = {
      name: user,
      body: content
    };

    var newComment = new Comment(commentObj);

  newComment.save(function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log(doc._id);
      console.log(articleId);

      Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comment: doc._id } },
        { new: true }
      ).exec(function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/readArticle/" + articleId);
        }
      });
    }
  });
});

module.exports = router;
