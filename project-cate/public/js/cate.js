/**
 * Created by bjwsl-001 on 2017/6/13.
 */
if(window.$===undefined){
    throw new Error("ÒÀÀµjquery¿â");
}
jQuery.fn.carousel=function(){
    var interval = 1000;
    var $imgList = this.children("img");
    var $liList = this.find("li");
    var index = 0;
    function lunHuan(){
        index++;
        (index>4)&&(index=0);
        $imgList.eq(index).addClass("active").siblings().removeClass("active");
        $liList.eq(index).addClass("active").siblings().removeClass("active");
    }
    var timer = setInterval(lunHuan,interval);
    $liList.hover(function(){
        clearInterval(timer);
        timer=null;
        index = parseInt($(this).html())-1;
        $imgList.eq(index).addClass("active").siblings().removeClass("active");
        $liList.eq(index).addClass("active").siblings().removeClass("active");
    },function(){
        timer=setInterval(lunHuan,interval);
    });
}
