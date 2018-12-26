new Vue({
    el: '#excel',
    data: {
        curval: {},
        lastVal: [{
                index: '此页小计',
                name: "",
                price: "",
                num: "",
                company: "",
                count: 0
            },
            {
                index: "签字：",
                name: "",
                price: "",
                num: "",
                company: "",
                count: ''
            }

        ],
        goodsArr: [],
        selarr: []
    },
    mounted() {
        this.getList();
    },
    methods: {
        getList() {
            $.ajax({
                url: '/getlist'
            }).then(res => {
                if(res.success){
                    this.goodsArr = res.data;
                    this.curval = res.data[0];
                }else{
                    alert(res.msg)
                }
            })
        },
        //模糊搜索
        search(){
            let name = this.curval.name;
            $.ajax({
                url: '/getItem',
                data:{ name  },
            }).then(res => {
                if(res.success){
                    this.goodsArr = res.data;
                }
            });
        },
        //添加
        add() {
            let {
                selarr,
                curval
            } = this;
            let newarr = selarr.filter(item => {
                return item._id == curval._id;
            });

            if (newarr.length) {
                alert("已经添加，不可重复添加");
            } else {
                selarr.push(curval);
                selarr.map((item, index) => {
                    item.count = (item.price * item.num).toFixed(1) + '元';
                    item.num = (item.num * 1).toFixed(1);
                    item.price = (item.price * 1).toFixed(1);
                    item.index = index + 1;
                });
                this.countPrice();
            }
        },
        //删除
        delitem(index) {
            let r = confirm('确定删除吗?');
            if (r) {
                this.selarr.splice(index, 1);
                this.countPrice();
            }
        },
        //计算总价
        countPrice() {
            let {
                selarr,
                lastVal
            } = this;
            let countPrice = 0;
            selarr.forEach(item => {
                countPrice += parseFloat(item.count);
            });
            lastVal[0].count = countPrice.toFixed(1) + '元';
        },
        //导出excel
        exportExcel() {
            let {
                selarr,
                lastVal
            } = this;
            let option = {};
            let date = new Date();
            let ymd = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

            option.fileName = "物品列表" + ymd;
            option.datas = [{
                sheetData: selarr.concat(lastVal),
                sheetName: "sheet",
                sheetFilter: ["index", "name", "company", "num", "price", "count"],
                sheetHeader: ["序号", "商品名称", "单位", "数量", "单价", "总价"]
            }];
            var toExcel = new ExportJsonExcel(option);
            toExcel.saveExcel();
        }
    }
})