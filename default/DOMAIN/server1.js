const Koa = require('koa');
const statics = require('koa-static');

const app = new Koa();

app.use(statics('./'));

app.listen(1001, () => {
    console.log('开启服务成功1');
});