
// 一、jSONP解决跨域
// const Koa  = require('koa');
// const router = require('koa-router')(); //注意：引入的方式
// const app = new Koa();

// router.get('/list', (ctx, next) => {
//     const {cb} = ctx.query; // 获取前端传过来的参数回调,如果是jq则将所有的换成callback
//     const data = {msg: '成功', err: 0};
//     ctx.body = `${cb}(${JSON.stringify(data)})`;
// });
// app.use(router.routes(), router.allowedMethods());

// app.listen(3000, () => {
//     console.log('开启服务成功');
// });

// 二、后端设置跨域
// const Koa  = require('koa');
// const router = require('koa-router')(); //注意：引入的方式
// const app = new Koa();
// app.use(async (ctx, next) => {
//     ctx.set('Access-Control-Allow-Origin', '*'); // 一但设置了允许跨域 浏览器则就不能传输cookie
//     // 下面的这些可用可不用
//     ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
//     ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//     if (ctx.method == 'OPTIONS') {
//       ctx.body = 200; 
//     } else {
//       await next();
//     }
// });

// app.use(router.routes(), router.allowedMethods());

// router.get('/cors', (ctx, next) => {
//     const data = {msg: '成功', err: 0};
//     ctx.body = data;
// });

// app.listen(3000, () => {
//     console.log('开启服务成功');
// });

// 三、webpack-proxy解决跨域
// const Koa  = require('koa');
// const router = require('koa-router')(); //注意：引入的方式
// const app = new Koa();
// router.get('/webpack', (ctx, next) => {
//     const data = {msg: '成功', err: 0};
//     ctx.body = data;
// });

// app.use(router.routes(), router.allowedMethods());

// app.listen(3000, () => {
//     console.log('开启服务成功');
// });

// 四、Ngnix反向代理

// 五、postMessage

// 六、socket
const Koa  = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback()); // 搭配socket使用
const io = require('socket.io')(server);

io.on('connection', socket => {
    console.log('初始化成功！下面可以用socket绑定事件和触发事件了');
    socket.on('one', data => {
        console.log('客户端one发送的内容：', data);
        socket.emit('one', '我是one返回的消息... ...');
    });
    socket.on('two', data => {
        console.log('客户端two发送的内容：', data);
        socket.emit('two', '我是two返回的消息... ...');
    });
    socket.on('three', data => {
        console.log('客户端three发送的内容：', data);
        socket.emit('three', '我是three返回的消息... ...');
    });
    setTimeout(() => {
        socket.emit('one', '我是初始化3s后的返回消息... ...'); 
    }, 3000);
});
server.listen(3000);