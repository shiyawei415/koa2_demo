const router = require('koa-router')()
const superagent = require('superagent');

const wxconfig = require('../config/wxconfig.js');


const getip = function (req) {
    var ip = req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0];
    }
    if (ip.indexOf('::ffff:') > -1) {
        ip = ip.split('::ffff:')[1]
    }
    return ip;
};

const APPID = wxconfig.wechat.appID;
const appsecret = wxconfig.wechat.appSecret;
const REDIRECT_URI = 'http://wu.shiyawei.com/wx/wxcallback';


router.prefix('/wx');


router.get('/gettoken', async (ctx, next) => {
    
    await superagent.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' +APPID+ '&secret=' + appsecret).then(res => {
        ctx.response.body = res;
    })
})

router.get('/wxcallback', async (ctx, next) => {
    let code = ctx.query.code
    let access_token = ''
    let openid = ''

    await superagent.get('https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + APPID +
            '&secret=' + appsecret +
            '&code=' + code +
            '&grant_type=authorization_code')
        .then(res => {
            // 此处本来应该用res.body获取返回的json数据，但总是获取不到，只能用text代替
            let result = JSON.parse(res.text)
            access_token = result.access_token
            openid = result.openid
        })
        .catch(res => {
            console.log(res)
        })

    // 3、刷新access_token（如果需要）
    // 4、拉去用户信息
    let res = await superagent.get(
        'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token +
        '&openid=' + openid +
        '&lang=zh_CN');
    
    let infostr = res.text;  
    let info = JSON.parse(infostr);


    await ctx.render('wechat',{
        info:infostr
    })
})


router.get('/wxlogin', async (ctx, next) => {
    let host = ctx.request.header.host;
    let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + APPID +
        '&redirect_uri=' + REDIRECT_URI +
        '&response_type=code' +
        '&scope=snsapi_userinfo' +
        '&state=STATE#wechat_redirect';

    ctx.response.redirect(url) // 重定向到这个地址
})

router.get('/ip', async (ctx, next) => {
    await ctx.render('ip', {
        ip: getip(ctx.req),
        ctx:JSON.stringify(ctx)
    })
})







module.exports = router