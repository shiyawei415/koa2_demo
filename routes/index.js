const router = require('koa-router')()
const goodsList = require('../model/goodslist');
const newsList = require('../model/newslist');

var getip = function(req) {
  var ip = req.headers['x-real-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress || '';
      console.log('ip1:'+req.headers['x-real-ip'])
      console.log('ip2:'+ req.headers['x-forwarded-for'])
      console.log('ip3:'+ req.socket.remoteAddress)
      console.log('ip4:'+ ip)
  if(ip.split(',').length>0){
      ip = ip.split(',')[0];
  }
  if(ip.indexOf('::ffff:') > -1){
      ip = ip.split('::ffff:')[1]
  }
  return ip;
};



router.get('/', async (ctx, next) => {
  await ctx.render('index')
})

router.get('/excel', async (ctx, next) => {
  await ctx.render('excel');
})

router.get('/ip', async (ctx, next) => {
  await ctx.render('ip',{ ip : getip(ctx.req) } )
})

//获取newlist -test
router.get('/newslist', async ctx => {
  var query = ctx.request.query;
  var pagesize = query.pageSize;
  var pageNum = query.pageNum;
  var total = await newsList.count({});

  await newsList.find().skip(pagesize*pageNum).limit(pagesize).then( res => {
    ctx.response.body = {
      data:{
        list:res,
        totalCount:total
      },
      code:0,
      msg:'成功'
    };
  }).catch( err => {
    ctx.response.body = {
      data:err,
      msg:'失败',
      success:false
    };
  });

});

//获取所以物品list
router.get('/getList', async ctx => {
  await goodsList.find().then( res => {
    ctx.response.body = {
      data:res,
      msg:'成功',
      success:true
    };
  }).catch( err => {
    ctx.response.body = {
      data:err,
      msg:'失败',
      success:false
    };
  });
});

//添加物品
router.post('/addItem', async ctx => {
  let body = ctx.request.body;
  let queryitem = await goodsList.find({
    name: body.name
  });
  if (queryitem.length) {
    ctx.response.body = {
      success:false,
      msg: '不可重复添加'
    }
  } else {
    let goodsItem = new goodsList(body);
    let data = await goodsItem.save();
    if (data._id) {
      ctx.response.body = {
        success:true,
        msg: '成功'
      }
    } else {
      ctx.response.body = {
        success:false,
        err,
        msg: '失败'
      }
    }
  }
});

//删除物品
router.post('/delItem', async ctx => {
  let id = ctx.request.body.id;
  let data = await goodsList.remove({
    _id: id
  });
  let response = {};
  if (data.ok) {
    ctx.response.body = {
      success:true,
      msg: '成功'
    }
  } else {
    ctx.response.body = {
      success:false,
      msg: '失败'
    }
  }
});

//修改商品
router.post('/updataItem', async ctx => {
  let body = ctx.request.body;
  let wherestr = {_id: body.id };
  let updatestr = body;

  await goodsList.update(wherestr, updatestr, function (err, res) {
    if (err) {
      ctx.response.body = {
        success:false,
        msg: '失败'
      }
    } else {
      ctx.response.body = {
        success:true,
        msg: '成功'
      }
    }
  });
});

//模糊查询
router.get('/getItem', async ctx => {
  const keys = Object.keys(ctx.request.query);
  const keyword = ctx.request.query.name;
  
  if(!keys.includes('name')){
    return ctx.body = ctx.response.body = {
      success:false,
      msg:'缺少参数'
    }
  }

  await goodsList.find(
      {
        $or : [ 
          {'name': {'$regex': keyword, $options: '$i'}},
        ]
      }
  ).then(res => {
    ctx.response.body = {
      success:true,
      msg:'成功',
      data:res
    }
  }).catch( err => {
    ctx.response.body = {
      success:false,
      msg:'失败'+err
    }
  })
  
});



module.exports = router