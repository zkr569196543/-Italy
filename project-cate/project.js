/**
 * Created by bjwsl-001 on 2017/6/7.
 */
/**
 * Created by bjwsl-001 on 2017/6/1.
 */
const http=require("http");
const express=require("express");
const mysql=require("mysql");
const qs=require("querystring");
var pool=mysql.createPool({
    host:"127.0.0.1",
    user:"root",
    database:"cate",
    port: 3366,
    password:"",
    connectionLimit:20
})
var app=express();
var server=http.createServer(app);
server.listen(8080);
app.use(express.static("public"));
//app.get("/",function(req,res){
//    res.redirect("/resister.html") 自动加载主页面
//})
///====================================================================================================
///                                 注册
//==================================================================================================
app.post("/register",function(req,res){
    req.on('data', function (buf) {
        var obj= qs.parse(buf.toString());
        pool.getConnection(function (err, conn) {
            conn.query("insert into cate_user values(null,?,?)", [obj.uname, obj.upwd], function (err, result) {
                console.log(result);
                if(result.affectedRows===1){//判断insert行数
                    var data={"code":200,"msg":"registersucc"};
                }else{
                    var data={"code":500,"msg":"error"};
                }
                res.json(data);
                conn.release();
            })

        })
    })
})
//处理请求主体数据的中间
//app.use(function(req,res,next) {
//    if (req.method === 'POST') {
//        req.on('data', function (buf) {
//            req.body = qs.parse(buf.toString());
//          next();
//        })
//    }else{
//    next();
//}
//})
//====================================================================================================
///                                 登录
//==================================================================================================
app.post("/login",function(req,res){
    req.on('data', function (buf) {
        var obj= qs.parse(buf.toString());
        pool.getConnection(function (err, conn) {
            conn.query("SELECT * FROM cate_user WHERE uname =? AND upwd =?", [obj.uname, obj.upwd], function (err, result) {
                //console.log(result);
                var data={code:200,msg:'login succ',uid:result[0].uid};
                var data1= {"code":401, "msg":"uname or upwd err"}
                //console.log(result)
                if(result!=''){
                    res.json(data);
                }else{
                    res.json(data1);
                }

                conn.release();
            })

        })
    })
})


//==========================================================================================
//                               页面展示
//=========================================================================================
app.get("/menu",function(req,res) {
    var pageNo=parseInt(req.query.pageNo);
    var offset = (pageNo-1)*4;
    pool.getConnection(function (err, conn) {
        conn.query("SELECT did,name,price,img_sm FROM cate_dish limit ?,4",[offset] ,function(err, page){

            var data1= {"code":401, "msg":"uname or upwd err"};
            if(page!=undefined){
                res.json(page);
            }
            conn.release();

        })

    })
})

//===============总页=====================
app.get("/pagetotal",function(req,res) {
    var pagetotal=req.query.pagetotal;
    pool.getConnection(function (err, conn) {
        conn.query("select count(did) from cate_dish" ,function(err,result){
            var page=qs.stringify(result[0]).split("=")[1]
            pagetotal=page/4;
            var data1= {"code":401, "msg":"uname or upwd err"};
            if(page!=undefined){
                res.json(page);
            }
            conn.release();

        })

    })
})
//===================================================================================
//详情显示
//===================================================================================
app.get('/detail',function(req,res){
    var did=req.query.did;
    //console.log(did);
    pool.getConnection(function(err,conn){
        conn.query("select name,price,img_sm,detail from cate_dish where did=?",[did],function(err,result){
            //console.log(result);
            var data1= {"code":401, "msg":"uname or upwd err"};
            if(result!=undefined){
                res.json(result);
            }else{
                res.json(data1);
            }
            conn.release();
        })
    })
})

//===================================================================================
//留言
//===================================================================================

app.get('/message',function(req,res){
    var message=req.query.message;
    var mname=req.query.mname;
    var subject=req.query.subject;
    var uid=req.query.uid;
    pool.getConnection(function(err,conn){
        conn.query("insert into cate_message values(null,?,?,?,?)",[mname,message,subject,uid],function(err,result){
            //console.log(result);
            var data1= {"code":401, "msg":"uname or upwd err"};
            if(result!=undefined){
                res.json(result);
            }else{
                res.json(data1);
            }
            conn.release();
        })
    })
})
//===================================================================================
//查看留言
//===================================================================================

app.get('/message-detail',function(req,res){
    pool.getConnection(function(err,conn){
        conn.query("select * from cate_message",function(err,result){
            //console.log(result);
            var data1= {"code":401, "msg":"uname or upwd err"};
            if(result!=undefined){
                res.json(result);
            }else{
                res.json(data1);
            }
            conn.release();
        })
    })
})

//===================================================================================
//查看购物车
//===================================================================================

app.get('/order',function(req,res){
    var uid=req.query.uid;
    pool.getConnection(function(err,conn){
        conn.query("SELECT c.cid,d.img_sm,d.name,d.price,c.count FROM  cate_dish d, cate_car c WHERE d.did =c.did and c.uid=?",[uid],function(err,result){
            //console.log(result)
            var data1= {"code":401, "msg":"uname or upwd err"};
            if(result!=undefined){
                res.json(result);
            }else{
                res.json(data1);
            }
            conn.release();
        })
    })
})
//===================================================================================
//--------
//===================================================================================

app.get('/car-minus',function(req,res){
    var cid=req.query.cid;
    var count=req.query.count;
    pool.getConnection(function(err,conn){
        conn.query("UPDATE cate_car SET count =count-1 where cid=?",[cid],function(err,result){
            //console.log(result);
            var data1= {"code":1, "msg":"成功"};
            if(result!=undefined){
                res.json(data1);
            }


            conn.release();
        })
    })
})
//===================================================================================
//++++++
//===================================================================================
app.get('/car-add',function(req,res){
    var cid=req.query.cid;
    var count=req.query.count;
    pool.getConnection(function(err,conn){
        conn.query("UPDATE cate_car SET count =count+1 where cid=?",[cid],function(err,result){
            //console.log(result);
            var data1= {"code":1, "msg":"成功"};
            if(result!=undefined){
                res.json(data1);
            }


            conn.release();
        })
    })
})
//=====================================================
//    删除
//=====================================================


app.get('/car-delet',function(req,res){
    var cid=req.query.cid;
    pool.getConnection(function(err,conn){
        conn.query("DELETE FROM cate_car  where cid = ?",[cid],function(err,result){
            //console.log(result);
            var data1= {"code":1, "msg":"成功"};
            if(result!=undefined){
                res.json(data1);
            }


            conn.release();
        })
    })
})
//=====================================================
//    添加购物车
//=====================================================
app.get('/shopping',function(req,res){
    var uid=req.query.uid;
    var did=req.query.did;
    pool.getConnection(function(err,conn){
        conn.query("SELECT * FROM cate_car  WHERE uid = ? AND  did = ?",[uid,did],function(err,result){
            console.log(result)
            if(result.count===undefined){
                //result.count=1
                conn.query("INSERT INTO cate_car VALUES(null,?,?,1)",[uid,did],function(err,result){
                     //console.log(result)
                })
            }else{
                conn.query("UPDATE cate_car SET count=count+1 WHERE uid=? AND did=?",[uid,did],function(err,result){
                    //result.count = result['count']+1;
                })
            }
            var data1= {"code":1};
            if(result!=undefined){
                res.json(data1);
            }
            conn.release();
        })
    })
})