/**
 * Created by lenovo on 2015/10/15.
 */

$(function(){

    var $fileTopic = $('[data-file-topic]');
    var $main = $('[data-main]');
    var $add = $('[data-add]');
    var $save = $('[data-save]');
    var $export = $('[data-export]');


    $('[data-new-topic]').on('click',function(){
        $fileTopic.click();
    });

    $fileTopic.change(function(){
        var files = this.files[0];
        //console.log(files.lastModified);//window.URL.createObjectURL(files)
        //console.log(this.files[0]);
        $('[data-name]').val(files.name);
        var img = new Image();
        img.src = window.URL.createObjectURL(files);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                if(xhr.responseText.msg == '成功'){}{

                }
                //alert(xhr.responseText);
            }
        };

        xhr.upload.onprogress = function(evt){
            var load = evt.loaded;//已上传
            var total = evt.total;//总大小
            var per = Math.floor((load/total)*100)+"%";
            $('.progressBar span').width(per);
            $('.progressBarNum').text(per);
            if(per == '100%'){
                setTimeout(function () {
                    location.reload();
                },500)
            }
        };

        var fm = document.getElementById('fileForm');
        var fn = new FormData(fm);
        xhr.open('post','/upload?a=' + new Date().getTime(),true);
        //xhr.setRequestHeader("content-type","application/x-www-form-urlencoded");
        xhr.send(fn);
        /*img.onload = function(){
         /!*$main.css('background-image','url('+img.src+')');
         var w = img.width;
         var h = img.height;
         $main.height(h);*!/
         var xhr = new XMLHttpRequest();
         xhr.onreadystatechange = function(){
         if(xhr.readyState == 4){
         alert(xhr.responseText);
         }
         };

         xhr.upload.onprogress = function(evt){
         var load = evt.loaded;//已上传
         var total = evt.total;//总大小
         var per = Math.floor((load/total)*100)+"%";
         document.title = per;
         };

         var fm = document.getElementById('fileForm');
         var fn = new FormData(fm);

         xhr.open('post','/upload');
         //xhr.setRequestHeader("content-type","application/x-www-form-urlencoded");
         xhr.send(fn);


         };*/
    });


    $add.on('click',function(){
        var t = $(window).scrollTop() + 100;
        var htm = '<div class="module" style="top:'+t+'px"><span></span><em></em></div>';
        $('.main_div1').append(htm);
    });

    //移动+改变宽高效果
    var isTrue = false, isTrue1 = false, _this = null, x1 = null, y1 = null, x2 = null, y2 = null, w_ = null, h_ = null;
    $main.delegate('.module em','mousedown',function(e){
        isTrue = true;
        _this = $(this);
        x1 = e.pageX;
        y1 = e.pageY;
        w_ = $(this).parent().width();
        h_ = $(this).parent().height();
        return false;
    });

    $main.delegate('.module span','mousedown',function(e){
        isTrue1 = true;
        _this = $(this);
        x1 = e.pageX;
        y1 = e.pageY;
        w_ = $(this).parent().offset().left;
        h_ = $(this).parent().offset().top;
        return false;
    });

    $main.delegate('.module em','mouseup',function(){
        isTrue = false;isTrue1 = false;_this = null;x1 = null;y1= null;x2= null;y2= null;w_ = null;h_ = null;
    });

    $main.delegate('.module span','mouseup',function(){
        isTrue = false;isTrue1 = false;_this = null;x1 = null;y1= null;x2= null;y2= null;w_ = null;h_ = null;
    });

    $('body').mousemove(function(e){
        if(isTrue == true){
            x2 = e.pageX;
            y2 = e.pageY;
            var w = x2 - x1 + w_ + 'px',
                h = y2 - y1 + h_ + 'px';
            _this.parent().css({'width':w,"height":h});
            return false;
        }else if(isTrue1 == true){
            x2 = e.pageX;
            y2 = e.pageY;
            var l1 = $('.main_div1').offset().left;
            var l = x2 - x1 + w_ - l1 + 'px',
                t = y2 - y1 + h_ + 'px';
            _this.parent().css({'left':l,"top":t});
            return false;
        }

    });

    var img = new Image();
    img.src = $main.attr('srcIMG');

    img.onload = function(){
        $main.css({'backgroundImage':'url('+this.src+')',"height":this.height+'px'});
    };

    var imageMenuData = [
        [{
            text: "复制",
            func: function() {
                $(this).parent().append($(this).clone());
            }
        }, {
            text: "删除",
            func: function() {
                $(this).remove();
            }
        }]
    ];


    $main.delegate('.module','mouseup',function(){
        $(this).smartMenu(imageMenuData, {
            name: "image"
        });
    });


    $save.on('click',function(){
        var list = [];
        var datas ='';
        var path = location.href.match(/\d+$/);
        if($main.find(".module").length>=1){
            $main.find(".module").each(function(k){
                list[k] = {};
                list[k].left = $(this).css('left');
                list[k].top = $(this).css('top');
                list[k].width = $(this).css('width');
                list[k].height = $(this).css('height');
                if(k == $main.find(".module").length - 1){
                    console.log({'list':list,'path':path[0]});
                    datas = "list=" + JSON.stringify(list) + "&path=" + path[0];
                    $.post('/save', datas, function(res){
                        alert(res);
                    });
                }
            });
        }else{
            datas = "list=" + JSON.stringify(list) + "&path=" + path[0];
            $.post('/save', datas,function(res){
                alert(res);
            });
        }

    });

    $export.on('click',function(){
        var path = location.href.match(/\d+$/);
        var datas = "path=" + path[0];
        $.post('/export', datas, function(res){
            alert(res.status);
            var clickTxt = $("#clickTxt")
            clickTxt.attr('href',res.url);
            clickTxt[0].click();
        });
    });
















});

