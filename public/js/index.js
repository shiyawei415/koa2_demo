
//获取list
function getList(){
    $.ajax({url:'/getlist'}).then( res =>{
        let dhtml = '';
        res.forEach((item,index) => {
            dhtml+=`
            <tr>
                <td>${(index+1)}</td>
                <td>${item.name}</td>
                <td>${item.company}</td>
                <td>${item.num}</td>
                <td>${item.price}</td>
                <td>
                    <button>编辑</button> 
                    <button>修改</button>
                </td>
            </tr>
            `
        });

        $('.table1 .tbody1').html(dhtml);
    })
}

$(function (){
   // getList();
})

new Vue({
    el: '#app',
    data: {
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

        add(){
            let {name,price,company,num} = this.googs;
            let that = this;
            if(name == '' || price == '' || company == '' || num == ''){
                alert('请填写物品信息')
                return;
            }
            $.post({
                url:'/addItem',
                data:{ name,price,company,num }
            }).then( res =>{
                if(res.code == 0){
                    that.getlist();
                    that.googs.name = '';
                }
                alert(res.msg)
            })
        },

        delect(id,index){
            let r=confirm("确定删除吗？");
            let that = this;
            if(r){
                $.post({
                    url:'/delItem',
                    data:{ id }
                }).then( res =>{
                    if(res.code == 0){
                        
                        that.list.splice(index,1);
                    }
                    alert(res.msg)
                })
            }
            
        },

        updata(){
            let { name,price,company,num, _id } = this.curgoogs;
            let that = this;
            if(name == '' || price == '' || company == '' || num == ''){
                alert('请填写物品信息')
                return;
            }
            console.log(name,price,company,num)
            $.post({
                url:'/updataItem',
                data:{ name,price,company,num ,id:_id}
            }).then( res =>{
                if(res.code == 0){
                    that.getlist();
                    that.ishow = false;
                }
                alert(res.msg)
            })
        },

        getlist() {
            $.ajax({url:'/getlist'}).then( res =>{
                this.list = res;
            })
        },
    }
})