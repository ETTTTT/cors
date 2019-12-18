# 解决万恶的跨域

* default:前端文件
* admin:后台文件

## 一、JSONP
>不存在跨域的标签只能get请求
 - script
 - img
 - link
 - iframe
 - ... 
## 二、后端设置cors
> 一旦设置了允许跨域，则浏览器不能传输cookie
> 允许跨域的头只有设置一个或者所有
```
    ctx.set('Access-Control-Allow-Origin', '*'); 
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    // 客户端在请求之前 会先发一个试探性请求，如果请求服务器成功则告诉客户端可以发送请求了
     if (ctx.method == 'OPTIONS') {
      ctx.body = 200;
    } else {
      await next();
    }
```
## 三、webpack webpack-dev-server
> 这是webpack里面的一个可以做前端代理的方法，把所有后端的请求的代理到一个不跨域的地址上，如果项目是使用webpack构建的，可以完美搭配这个使用


## 四、Ngnix反向代理，不需要前端处理

## 五、postMessage

>利用了window.postMessage解决跨域传输

* 客户端代码
```
<iframe src="http://localhost:1002/MESSAGE/messageB.html" id='iframe' frameborder="0" style="display:none"></iframe>

<script>
    // 必须在ifranm加载完成之后
    iframe.onload = () => {
      // iframe.contentWindow类似于window,用其下面的window.postMessage方法
      // 方法介绍：https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage
      // 第一个参数为所传数据，第二个参数为跨域的源，可以设置为'*'
      iframe.contentWindow.postMessage('我是A页面', 'http://localhost:1002/'); 
      // 反监听服务端返回给客户端的数据
      window.onmessage = (ev) => {
          console.log(ev.data);
          // ev.source代表A页面
      }
    }

</script>
```

* 服务端代码

```
<script>
  // 监听A发送过来的信息
  window.onmessage = (ev) => {
    // 代表传过来的数据
    console.log(ev.data)
    // ev.source代表客户端
    ev.source.postMessage('我是B页面返回的数据', ev.origin)
  }
</script>
```

## 六、WebSocket协议跨域

> 客户端监听什么事件，服务器端就监听什么事件，否则无效
* 客户端代码

```
<button>点击向服务端发送数据</button>
<script src="https://cdn.bootcss.com/socket.io/2.3.0/socket.io.dev.js"></script>
<script>
    let socket = io('http://localhost:3000');
    socket.on('connect', () => {
        console.log('连接成功！');
    });
    socket.on('one', msg => { // 监听的这个方法主要和后端对应上即可，否则无效
        console.log('服务端one返回的数据msg数据：' + msg);
    });
    socket.on('two', msg => { // 监听的这个方法主要和后端对应上即可，否则无效
        console.log('服务端two返回的数据msg数据：' + msg);
    });
    socket.on('three', msg => { // 监听的这个方法主要和后端对应上即可，否则无效
        console.log('服务端three返回的数据msg数据：' + msg);
    });
    socket.on('disconnect', () => {
        console.log('server socket has closed!')
    });
    let num = 1;
    // 点击的时候向服务端发送数据
    document.querySelector('button').onclick = () => {
        num ++ ;
        socket.emit('three', num);
    };
</script>
```

* 服务端代码

```
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
```

## 七、document.domian + iframe
> 只能实现同一个主域，不同子域之间的操作
>
> 而且主域定义的参数的时候必须定义到window对象下，可以使用var定义，但是不可以使用let\const，这两个貌似有作用域的限制，声明完之后不能自动变量提升到window对象下，具体没有细查
>
> demon测试
>  1、前端先开2个不同的端口号的本地服务
>  2、在系统host文件中加上   127.0.0.1 www.example.com  127.0.0.1 sub.example.com



* domainA页面代码

```
    <h1>document.domainA</h1>
    <a href="http://www.example.com:1001/domain/domainA.html"></a>
    <iframe src="http://sub.example.com:1002/domain/domainB.html" id='iframe' frameborder="0" style="display:none"></iframe>
    <script>
        document.domain = 'example.com'; // 定义域
        var test = '我是www.example.com下面的数据'; // 必须使用var定义参数 window.test = '我是www.example.com下面的数据'
        // const a = '我是www.example.com下面的数据'; // window.a = undefined;
        // let b = '我是www.example.com下面的数据'; // window.b = undefined;
    </script>
```

* domainB页面代码

```
 <h1>document.domainB</h1>
    <a href="http://sub.example.com:1002/domain/domainB.html"></a>
    <script>
        document.domain = 'example.com'; // 定义域
        console.log(window.parent.test); // 获取父域传的参数
    </script>
```

## 八、window.name + iframe
> 需要三个页面，一个做中间页proxy，里面不用写任何东西

* nameA页面 客户端
```
    <h1>nameA</h1>
    <iframe src="http://127.0.0.1:1002/name/nameB.html" id='iframe' frameborder="0" style="display:none"></iframe>
    <script>
        let first = true;
        iframe.onload = () => { // 第一次加载iframe的时候，该函数执行一次，第二次改变src的时候有加载一次
            if (first) {
                iframe.src = 'http://127.0.0.1:1001/name/proxy.html' // 需要和当前页面同源即可
                first = false;
                return;
            }
            console.log(iframe.contentWindow.name)
        }
    </script>
```

* proxy 中间页
> 不需要写什么东西

* nameB 服务端

```
    <h1>nameB</h1>
    <script>
        // 服务器端
        window.name = '我是nameB页面的数据';     // 将需要传输的数据 放在window.name下即可
    </script>
```

## 九、loaction.hash + iframe   
> url的长度是有限制的，所以不能传太多东西
> 
> 基本不会用这个

* hashA 客户端代码

```
    <h1>HASH - A</h1>
    <iframe src="http://127.0.0.1:1002/hash/hashB.html" id='iframe' frameborder="0" style="display:none"></iframe>
    <script>
        let first = true;
        iframe.onload = () => {
            if (first) { // 跳转不同源的B页面，拿不到数据，再次改变hash值，让B响应到
                iframe.src = 'http://127.0.0.1:1002/hash/hashB.html#name=a';
                first = false;
                return;
            }
        }

        function func(val) {
            console.log(val)
        };
    </script>
```

* hashB 中间代码

```
    <h1>HASH - B</h1>
    <iframe src="http://127.0.0.1:1001/hash/hashC.html" id='iframe' frameborder="0" style="display:none"></iframe>
    <script>    
        window.onhashchange = () => { // 响应到A改变了hash值 然后给服务端传输location.hash
            iframe.src = 'http://127.0.0.1:1001/hash/hashC.html' + location.hash;
        }
    </script>
```

* hashC 服务器端代码

```
   window.onhashchange = () => { // 服务端响应到B页面hash改变，调用A页面的方法传值
        console.log(location.hash) // A页面传输的hash,确切的说是B页面传输的hash值
        window.parent.parent.func('我是C页面传的值')
    } 
```

## 十、node中间件代理
> 探索中，后期补上......