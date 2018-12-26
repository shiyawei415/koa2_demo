new Vue({
    el: '#app',
    data: {
        isload:false,
        loadtxt:'',
        ishow:false,
        list: [],
        googs:{
            name:'',
            price:6,
            company:'斤',
            num:1
        },
        curgoogs:{
            name:'',
            price:0,
            company:'',
            num:0
        }
       
    },
    mounted() {
        this.getlist();     
    },
    methods: {
        toggleAlert(item){
            this.curgoogs = item;
            this.ishow = !this.ishow;
        },

        //增加
        add(){
            let {name,price,company,num} = this.googs;
            let that = this;
            if(name == '' || price == '' || company == '' || num == ''){
                alert('请填写物品信息')
                return;
            }
            this.toggleLoad(true,'添加中...');
            $.post({
                url:'/addItem',
                data:{ name,price,company,num }
            }).then( res =>{
                this.toggleLoad(false);
                if(res.success){
                    that.getlist();
                    that.googs.name = '';
                }
                this.$Message.info({
                    content: res.msg,
                    duration: 2
                });
            })
        },

        //删除
        delect(id,index){
            let name = this.list[index].name;
            let r=confirm("确定删除  "+name+"   吗？");
            let that = this;
            if(r){
                this.toggleLoad(true,'删除中...');
                $.post({
                    url:'/delItem',
                    data:{ id }
                }).then( res =>{
                    if(res.success){
                        that.list.splice(index,1);
                        that.toggleLoad(false);
                    }
                    this.$Message.info({
                        content: res.msg,
                        duration: 2
                    });
                })
            }
            
        },

        //修改
        updata(){
            let { name,price,company,num, _id } = this.curgoogs;
            let that = this;
            if(name == '' || price == '' || company == '' || num == ''){
                alert('请填写物品信息')
                return;
            }
            this.toggleLoad(true,'修改中...');
            $.post({
                url:'/updataItem',
                data:{ name,price,company,num ,id:_id}
            }).then( res =>{
                if(res.success){
                    that.getlist();
                    that.ishow = false;
                }
                this.$Message.info({
                    content: res.msg,
                    duration: 2
                });
            })
        },

        //获取list
        getlist() {
            this.toggleLoad(true);
            $.ajax({url:'/getlist'}).then( res =>{
                $.ajax({
                    url: '/getlist'
                }).then(res => {
                    this.toggleLoad(false);
                    if(res.success){
                        this.list = res.data;
                    }else{
                        alert(res.msg)
                    }
                });
            });
        },

        //切换显示load
        toggleLoad(flag,txt){
            txt = txt || '加载中...';
            this.loadtxt = txt;
            if(flag){
                this.isload = flag;
            }else{
                setTimeout(_=>{
                    this.isload = flag;
                },500)
            }
        }
    }
})