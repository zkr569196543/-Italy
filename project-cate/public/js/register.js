//功能点1：监听“注册”按钮的单击事件
//====================================================================================================
///                                 注册
//==================================================================================================
$(function() {
  $("#header").load("../header.html");
  $("#footer").load("../footer.html");
  $('#btn-zhu').click(function () {

    $("#register-model").css("display", "block");
    $('#btn-register').click(function () {
      console.log(1);
      var n = $('#register-uname').val();  //用户名
      var p = $('#register-upwd').val();   //密码
      //将客户端数据异步提交给服务器
      $.ajax({
        type: 'POST',
        url: 'register',
        data: {uname: n, upwd: p},
        success: function (result) {
          console.log('成功获取到异步返回的数据');
          console.log(result);
          //{"code":1,"msg":"注册成功","uid":31}
          if (result.code === 200) {
            alert('注册成功')
            $(".modal").css("display", "none");

          } else {
            alert('注册失败！请稍候重试！')
          }
        }
      });
    });
  });

//====================================================================================================
///                                 登录
//==================================================================================================
//功能点1：监听“注册”按钮的单击事件
  $('#btn-deng').click(function () {
    $("#login-model").css("display", "block");
    $('#btn-login').click(function () {
      var n = $('#login-uname').val();  //用户名
      var p = $('#login-upwd').val();   //密码
      //将客户端数据异步提交给服务器
      $.ajax({
        type: 'POST',
        url: 'login',
        data: {uname: n, upwd: p},
        success: function (result) {
          console.log('成功获取到异步返回的数据');
          console.log(result);
          //{"code":1,"msg":"注册成功","uid":31}
          if (result.code === 200) {
            alert('登录成功！')
            $(".modal").css("display", "none");
            sessionStorage['loginName'] = result.uname;
            sessionStorage['loginId'] = result.uid
            loginid = result.uid;
          } else {
            alert('登录失败！请稍候重试！')
          }
        }
      });
    });
  });
//==========================================================================================
  //页面展示
//=========================================================================================
  var loginid = 0;

  function pageNo(pageNo) {
    $.ajax({
      type: 'get',
      url: 'menu',
      data: {pageNo: pageNo},
      success: function (result) {
        //console.log(result);
        var html = "";
        for (var i = 0; i < result.length; i++) {
          var p = result[i];
          //console.log(p);

          html +=
              `<li id="${p.did}">
					<a href=""><img src="images/${p.img_sm}" alt=""/></a>
					<p>${p.price}</p>
					<h1><a href="">${p.name}</a></h1>
					<div>
						<a href="" class="contrast"><i></i>对比</a>
						<a href="" class="p-operate"><i></i>关注</a>
						<a href="" class="addcart"><i></i>详情</a>
					</div>
				</li>`;
        }

        $('#plist ul').html(html);
      }


    });


//==========================================================================================
//分页
//=========================================================================================

    $.ajax({
      type: 'get',
      url: 'pagetotal',
      success: function (data) {
        console.log(data);
        var pageTotal = Math.ceil(data / 4);
        var html = "";
        for (var i = 1; i <= pageTotal; i++) {
          //if(i==pageNo){
          html += `  <li><a href="#">${i}</a></li>  `;

          $("ol.pager").html(html);
        }
      }
    });
  }

  pageNo(1);
  $("ol.pager").on("click", "li a", function (e) {
    e.preventDefault();
    var p = $(this).html();
    pageNo(p);
  })
//===================================================================================
  //详情显示
//===================================================================================

  $("#test").on('click', 'li', function (e) {
    e.preventDefault();
    var detailId = this.getAttribute("id");

    $.ajax({
      type: 'get',
      url: 'detail',
      data: {did: detailId},
      success: function (data) {
        location.href = "archive.html";
        //console.log(data[0].name)
        var html = '';
        html += `
           <article>
           <div class="art-header">
						<a href="#"><h3>${data[0].name}</h3></a>
						<div class="info">Posted on June 22, 2010 in: <a href="#">Event</a></div>
					</div>
					<div class="art-content">
						<img src="images/${data[0].img_sm}" />
						<p>${data[0].detail}</p>
					</div>
					<a class="button button02" href="#" class="btn-car">添加到购物车</a>

					</article>
           `;
        console.log(html);
        sessionStorage['DetailId'] = detailId;
        sessionStorage['Detailimg'] = data[0].img_sm;
        sessionStorage['DetailNmae'] = data[0].name;
        sessionStorage['Detaildetail'] = data[0].detail;
        $(".wrap-content").html(html);
        console.log($(".wrap-content").html(html))
      }
    })

  })
//===================================================================================
//留言板
//===================================================================================
  $('#msg-btn').click(function () {
    var s = $('#subject').val();   //主题
    console.log(s);
    var m = $('#message').val();   //内容
    //将客户端数据异步提交给服务器
    $.ajax({
      type: 'get',
      url: 'message',
      data: {mname: sessionStorage['loginName'], subject: s, message: m, uid: sessionStorage['loginId']},
      success: function (result) {
        console.log('成功获取到异步返回的数据');
        console.log(result);
        //{"code":1,"msg":"注册成功","uid":31}
        if (result.code === 401) {
          alert('失败');
        } else {
          alert('留言成功')
        }
      }
    });
  })

//===================================================================================
//查看留言
//===================================================================================

  $.ajax({
    type: 'get',
    url: 'message-detail',
    success: function (data) {
      console.log(data);
      var html = "";
      for (var i = 0; i < data.length; i++) {
        var msg = data[i];
        html += `
            	<div class="message-list">
							<ul>
								<li>${msg.subject}</li>
								<li>${msg.message}</li>
							</ul>
							</div>

        `
      }
      $(".col-2-3 .message").html(html);
    }
  })

//===================================================================================
//添加购物车
//===================================================================================

  $.ajax({
    type: 'get',
    url: 'order',
    data: {uid: sessionStorage['loginId']},
    success: function (data) {
      //console.log(data);
      var html = "";
      data.reverse()
      $.each(data, function (i, p) {
        html += `
               <tr>
                    <td>
                        <input type="checkbox"/>
                        <input type="hidden" value="2" />
                        <div><img src="images/${p.img_sm}" alt=""/></div>
                    </td>
                    <td><a href="">${p.name}</a></td>
                    <td>${p.price}</td>
                    <td>
                        <button class="minus">-</button><input type="text" value="${p.count}"/><button class="add">+</button>
                    </td>
                    <td><span>${p.price * p.count}</span></td>
                    <td><a href="${p.cid}" class="delete-btn">删除</a></td>
                </tr>
        `;
      })
      $("#cart tbody").html(html);
    }
  })
//===================================================================================
//--------
//===================================================================================

  $(document.body).on("click", ".minus", function (e) {
    e.preventDefault();
    var cid = $(this).parent().next().next().children().attr("href");
    var count = $(this).next().val();
    if (count > 1) {
      count--;
      $(this).next().val(count);

      $.ajax({
        type: "get",
        url: "car-minus",
        data: {cid: cid, count: count},
        success: function (data) {
          if (data.code == 1) {
            alert(data.msg);
            eval($(this).parent().next().children("span").html($(this).parent().prev().html() * $(this).prev().val()));
          }
        }
      })
    }
  })
//===================================================================================
//++++++
//===================================================================================
  $(document.body).on("click", ".add", function (e) {
    e.preventDefault();
    var cid = $(this).parent().next().next().children().attr("href");
    var count = $(this).prev().val();

    count++;
    $(this).prev().val(count);
    $.ajax({
      type: "get",
      url: "car-add",
      data: {cid: cid},
      success: function (data) {
        if (data.code == 1) {
          alert(data.msg);
          eval($(this).parent().next().children("span").html($(this).parent().prev().html() * $(this).prev().val()));
        }
      }
    })
  })
//=====================================================
//    删除
//=====================================================
  $(document.body).on("click", ".delete-btn", function (e) {
    e.preventDefault();
    var cid = $(this).attr("href");
    $(this).parent().parent().remove();
    $.ajax({
      type: "get",
      url: "car-delet",
      data: {cid: cid},
    })
  })

//=====================================================
//    添加购物车
//=====================================================

  $(".wrap-content").on('click', '.btn-car', function (e) {
    e.preventDefault();
    $.ajax({
      type: 'get',
      url: 'shopping',
      data: {uid: sessionStorage['loginId'], did: sessionStorage['DetailId']},
      success: function (data) {
        if (data.code < 0) {
          alert("添加失败");
        } else {
          alert("添加成功");
        }
      }
    })
  })
})