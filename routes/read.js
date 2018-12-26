const router = require('koa-router')()
const goodsList = require('../model/goodslist');
const url = require('url');
const superagent = require('superagent');
const cheerio = require('cheerio');
const eventproxy = require('eventproxy');
let targetUrl = 'http://wu.shiyawei.com/getlist';

const fs = require("fs");

router.prefix('/read');

router.get('/list/:id',async ctx => {
    ctx.body = {
        url:    ctx.url,
        method: ctx.method,
        query:  ctx.request.query,
        querystring:  ctx.request.querystring,
        params: ctx.params
    };
});


module.exports = router
