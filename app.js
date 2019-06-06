const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const ejs = require('ejs');
const cors = require('koa2-cors');
const path = require('path');
const staticCache = require('koa-static-cache');

const index = require('./routes/index')
const users = require('./routes/users')
const read  = require('./routes/read')
const wechat  = require('./routes/wechat')

const crypto = require('crypto');
const wxconfig = require('./config/wxconfig.js');

app.use(cors({
  origin:'*',
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(staticCache(path.join(__dirname, '/public'), {
  maxAge: 365 * 24 * 60 * 60
}))

app.use(views(__dirname + '/views', {
  map : {html:'ejs'}
}));


//微信token验证
app.use(async ctx => {
    const { signature, timestamp, nonce, echostr } = ctx.query  
    const token = wxconfig.wechat.token
    let hash = crypto.createHash('sha1')
    const arr = [token, timestamp, nonce].sort()
    hash.update(arr.join(''))
    const shasum = hash.digest('hex')
    if(shasum === signature){
      return ctx.body = echostr
    }
    ctx.status = 401      
    ctx.body = 'Invalid signature'
})

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(read.routes(), read.allowedMethods())
app.use(wechat.routes(), wechat.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
