/**
 * Created by lenovo on 2015/10/14.
 */

var fs = require('fs'),
    multer = require('multer'),
    path = require('path'),
//md5 = require('md5'),
    projects = path.resolve(process.cwd(), 'projects'),
    gm = require('gm').subClass({imageMagick: true});






module.exports = function(app){

    //app.use(multer({dest:'./projects'}));
    function getLocalTime(nS) {
        return new Date(parseInt(nS.match(/\d{10}/)) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
    }

    app.get('/',function(req, res){


        var names = fs.readdirSync('./projects');//获取projects下所有文件夹名称

        function noundefined(data){
            var names = [];
            var Data = [];
            if(data.length == 0 || data[0] == 'undefined'){
                return '';
            }
            for(var i = 0; i < data.length; i++){
                if(data[i] != 'undefined'){
                    names.push(data[i]);
                    if(names.length == data.length-1){
                        for(var k=0; k<names.length;k++){
                            var datas = fs.readFileSync('./projects/'+names[k]+'/'+'data.json','utf8');
                            datas = JSON.parse(datas);
                            console.log(typeof datas);
                            //return;
                            Data[k] = {};
                            Data[k].time = datas['time'];
                            Data[k].name = datas['name'];
                            Data[k].path = datas['path'];

                            if(k == names.length-1){
                                //console.log(Data[k]);
                                return Data;
                            }
                        }
                    }
                }
            }
            //return names;
        }

        var Datas = noundefined(names);
        res.render('index',{list:Datas});

    });



    var time,height;
    app.post('/upload',multer({
        dest:'./projects/undefined',
        rename : function(fieldname,filename){
            time = Date.now();
            //fs.mkdirSync('./projects/undefined');
            return time;
        },
        onFileUploadStart : function(){
            //time = Date.now();
        },
        onFileUploadComplete : function(req,res){
            fs.rename('./projects/undefined','./projects/'+time, function(err){
                if(err){ throw err;}
                fs.mkdirSync('./projects/' + time + '/' + 'min');
                //分割图片
                var height_1,width_1;
                //console.log(path.join(__dirname, '../projects/1445449697503/1445449697503.jpg'));
                gm(path.join(__dirname, '../projects',time+'',(time+'.jpg')))
                    .identify(function (err, data) {
                        // { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
                        height_1 = data.size.height;
                        width_1 = data.size.width;
                        //console.log(path.join(__dirname, '../projects/',time+'', (time + '.jpg')));
                        for(var l=0;l<height_1;l+=200){
                            len = l;
                            gm(path.join(__dirname, '../projects/',time+'', (time + '.jpg')))
                                .crop(width_1, 200, 0, l)
                                //.noProfile()
                                .write(path.join(__dirname, '../projects',time+'','min', (time + '_' + l/200 + '.jpg')),       function (err) {
                                    if (!err) console.log('done');
                                });
                        }
                        fs.readFile('./projects/'+time+'/data.json', 'utf8', function (err,data) {
                            var datas = JSON.parse(data);
                            datas.len = Math.floor(height_1/200);
                            datas.height = height_1;
                            datas = JSON.stringify(datas);
                            fs.writeFile('./projects/'+time+'/data.json', datas,'utf8');
                        });

                    });

                var data = {};
                data.time = getLocalTime(''+time+'');
                data.name = req.originalname;
                data.path = time;
                data = JSON.stringify(data);
                fs.writeFile('./projects/'+time+'/data.json', data, function (err) {
                    if (err) throw err;
                    fs.mkdir('./projects/'+'undefined');
                });
                //console.log('fs成功');

            });
        }
    }),function(req, res){
        //fs.mkdirSync('./projects/undefined');
        //name = req.body.name;
        height= '';
        res.send({'msg':"res成功"});
    });

    app.get('/main/:path',function(req, res){
        var name = req.params['path'];
        //datas = fs.readFileSync('./projects/'+path+'/'+'data.json','utf8');
        //console.log(fs.readFileSync('./projects/' +path+ '/' +path+ '.jpg'));
        //console.log(name);
        //console.log('./projects/' +name+ '/' +name+ '.jpg');
        //console.log('END');
        console.log('../projects/'+name+'/'+name+'.jpg');
        var data = JSON.parse(fs.readFileSync('./projects/'+req.params['path']+'/'+'data.json','utf8'));
        res.render('main',{url:'../projects/'+name+'/'+name+'.jpg',list:data.list});
    });

    app.post('/save',function(req, res){
        console.log(req.body.list);
        //return ;
        var data = JSON.parse(fs.readFileSync('./projects/'+req.body.path+'/'+'data.json','utf8'));
        console.log(req.body.list);
        console.log(typeof data);
        //return;
        data.list = JSON.parse(req.body.list);
        console.log(JSON.stringify(data));
        data = JSON.stringify(data);
        fs.writeFile('./projects/'+req.body.path+'/data.json', data);
    });


    app.post('/export',function(req, res){
        var url = req.body.path;

        //console.log(path.join(__dirname,'../projects',url+'','data.json'));
        //var data = JSON.parse(fs.readFileSync(path.join(__dirname,'../projects',url+'','data.json'),'utf8'));
        var lists = JSON.parse(fs.readFileSync(path.join(__dirname,'../projects',url+'','output.json'),'utf8'));
        fs.readFile(path.join(__dirname,'../projects',url+'','data.json'),'utf8',function(err,data){

            var data_ = JSON.parse(data);
            var style = '<style type="text/css">*{ margin: 0; padding: 0;}.box_'+url+'{ position: relative;}.box_'+url+' .main_div0 div{ background-repeat: no-repeat; background-position: center 0;}</style>';
            var htm_0 = '<div class="box_'+url+'" style="width:100%;height: '+data_.height+'px;">';
            var htm_1 = '<div class="main_div0" style="position: absolute; z-index: 1; width: 100%; top:0; height: '+data_.height+'px;">';


            var htm_2 = '<div class="main_div1" style="position: absolute; z-index: 2; width:1200px; left: 50%; top:' +
                ' 0; margin-left:' + ' -600px;' + ' height: '+data_.height+'px">';
            var datas = data_.list;
            for(var i=0; i<=data_.len;i++) {
                if (i == data_.len) {
                    htm_1 += '<div class="div_1" style="height: ' +data_.height%200+'px; background-image:' + ' url(http://img1.cdn.daling.com/st/topic/www/'+url+'/' + url + '_' + i + '.jpg)"></div>';
                } else {
                    htm_1 += '<div class="div_1" style="height: 200px; background-image: url(http://img1.cdn.daling.com/st/topic/www/'+url+'/' + url + '_' + i + '.jpg)"></div>';
                }
            }
            for(var t=0; t<datas.length;t++){
                htm_2 += '<a href="'+lists[t]['商品链接']+'" target="_blank" title="'+lists[t]['商品名称']+'" style="position:absolute;display:block;width:'+datas[t].width+';height:'+datas[t].height+';top:'+datas[t].top+';left:'+datas[t].left+';"></a>';
            }


            htm_1 += '</div>';
            htm_2 += '</div>';
            var htm_all = style + htm_0 + htm_1 + htm_2 +  '</div>';
            //console.log(htm_all);
            fs.writeFileSync(path.join(__dirname,'../projects',url+'',data_.name + '.txt'), htm_all);
            res.json({'status':'成功','url':'http://' + path.join(req.headers.host+'','projects',url+'',data_.name + '.txt')});
            //console.log(req.headers.host);
            //console.log(path.join(req.headers.host+'','projects',url+'','html.txt'));
            //res.redirect();
        });

        /*gm(path.join(__dirname, '../projects',time+'',(time+'.jpg')))
            .identify(function (err, data) {
                // { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
                height_1 = data.size.height;
                width_1 = data.size.width;
                console.log(path.join(__dirname, '../projects/',time+'', (time + '.jpg')));
                for(var l=0;l<height_1;l+=200){
                    len = l;
                    gm(path.join(__dirname, '../projects/',time+'', (time + '.jpg')))
                        .crop(width_1, 200, 0, l)
                        //.noProfile()
                        .write(path.join(__dirname, '../projects',time+'','min', (time + '_' + l/200 + '.jpg')),       function (err) {
                            if (!err) console.log('done');
                        });
                }

            });*/
        //console.log(data);
        //console.log(lists);
    });



};