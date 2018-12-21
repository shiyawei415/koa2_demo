const router = require('koa-router')()
const goodsList = require('../model/goodslist');

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})


//获取所以物品list
router.get('/getList', async ctx => {
  const data1 = await goodsList.find()
  ctx.response.body = data1
})

//添加物品
router.post('/addItem', async ctx => {
  let body = ctx.request.body;
  let queryitem = await goodsList.find({
    name: body.name
  });
  if (queryitem.length) {
    ctx.response.body = {
      code: 1,
      msg: '不可重复添加'
    }
  } else {
    let goodsItem = new goodsList(body);
    let data = await goodsItem.save();
    if (data._id) {
      ctx.response.body = {
        code: 0,
        msg: '成功'
      }
    } else {
      ctx.response.body = {
        code: 1,
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
      code: 0,
      msg: '成功'
    }
  } else {
    ctx.response.body = {
      code: 1,
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
        code: 1,
        msg: '失败'
      }
    } else {
      ctx.response.body = {
        code: 0,
        msg: '成功'
      }
    }
  });
});



module.exports = router