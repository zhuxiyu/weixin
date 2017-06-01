var wechat = require("wechat");
var express = require('express');
var fs = require('fs');
var log4js = require('log4js');
var https = require('https');
var accesstoken = null;
var ticket = null;
var port = 3000;

log4js.configure({
  appenders: [
    { type: 'console' }, //控制台输出
    {
      type: 'dateFile', //文件输出
      filename: './log/',
      maxLogSize: 20480,
      backups:3,
      category: 'log_date',
      alwaysIncludePattern: true,
      pattern: "yyyy_MM_dd.log"
    }
  ],
  replaceConsole: true
});
var logger = log4js.getLogger('log_date');
logger.setLevel(log4js.levels.INFO);

var app = express();
/*引入模板引擎*/
var handlebars = require('express3-handlebars')
	.create({
		defaultLayout: 'main'
	});

app.use(express.query());
app.use(require('body-parser')());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var routes = require('./routes/index');
var autoViews = {};
app.use(function(req, res, next){
	var path = req.path.toLowerCase();
	//检查缓存，如果有就渲染这个视图
	if(autoViews[path]) return res.render(autoViews[path]);
	//如果没有缓存，就检查有无.handlebars文件能匹配
	if(fs.existsSync(__dirname + '/views' + path + '.handlebars')){
		autoViews[path] = path.replace(/^\//, '');
		return res.render(autoViews[path]);
	}
	next();
})


// var config = {
//   token: 'xiyu_weixin',
//   appid: 'wxed944cd8a7ec2868',
//   encodingAESKey: 'FtcqTy9rWlpc2OrbqROzIfyfxSv0Akm9Ae9XCvBIioS'
// };
// app.use(express.query());
// app.use('/', wechat(config, function (req, res, next) {
//   // 微信输入信息都在req.weixin上
// }));

var config = {
  token: 'xiyu_weixin',
  appid: 'wxa50dfb4286c1475a',
  encodingAESKey: 'CEbnF9JhPUZ4UyBjhhppvVkkwVRZ0ysCqjHK5IVxElR'
};
app.use(express.query());
// app.use('/', wechat(config, function (req, res, next) {
//   // 微信输入信息都在req.weixin上
// }));
app.use('/wechat', wechat(config, function (req, res, next) {
    var message = req.weixin;
    if(message.MsgType == 'text'){
          res.reply({ type: "text", content: "您输入的文本 " + message.Content});  
    }
}));

routes(app);

app.listen(port);
