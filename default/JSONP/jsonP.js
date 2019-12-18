$.ajax({
    url: 'http://192.168.6.11:3000/list',
    method: 'get',
    dataType: 'jsonp',
    success: res => {
        console.log(res);
    }
});