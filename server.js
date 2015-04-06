var express = require('express');
var serveStatic = require('serve-static');
var port = 3000;

var app = express();

app.use(serveStatic('app', {
    'index': 'index.html'
}));

app.listen(port, function () {
    console.log('server started on port ' + port);
});
