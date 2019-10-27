const express = require('express');
const router = express.Router();
const path = require('path');

const request = require('request');
const cheerio = require('cheerio');


const Comment = require('../models/Comments');
const Article = require('../models/Articles');

router.get('/', (req,res,next)=>{
    res.redirect('/article')
});

router.get('/', (req,res,next)=>{
    request("https://www.theverge.com/", (err, res, html)=>{
        let $=cheerio.load(html);
        let titles= [];

        $(".c-entry-box--compact__title").each((i,el)=>{
          const result={};
          
          result.title= $(this)
          .children("a")
          .text();
          
          result.link=$(this)
          .children("a")
          .attr("href")

          if(result.title !=="" &&  result.link !==""){

            if(titles.indexOf(result.title)=== -1){
                titles.push(result.title);
                Article.count({title: result.title}, (err,test){
                   if(test === 0){
                       let entry = new Article(result);

                       entry.save((err,doc){
                           if(err){
                               console.log(err)
                           }else{
                                console.log(doc)
                           }
                       })
                   } 
                })
            }else{
                console.log("We already have this article")
            }
          }else{

          }
        })
        res.redirect("/")
    })
});

