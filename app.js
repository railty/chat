var Hapi = require('hapi');
var Good = require('good');
var Hoek = require('hoek');
var swig = require('swig');

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.register(require('vision'), function (err) {
  Hoek.assert(!err, err);
    server.views({
        engines: {
            html: require('swig')
        },
        isCached: false,
        relativeTo: __dirname,
        compileOptions:{
          autoescape: false,
        },
        path: 'public',
        layout: true,
        layoutPath: 'public/layouts'
    });
});

server.register(require('inert'), function (err) {
    if (err) {
        throw err;
    }
});

server.register({
    register: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            events: {
                response: '*',
                log: '*'
            }
        }]
    }
}, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply.view('index', {title: 'Messager'});
    }
});

server.route({
    method: 'GET',
    path: '/js/{param*}',
    handler: {
      directory: {
            path: 'bower_components'
      }
    }
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
            path: 'public'
      }
    }
});

server.start(function () {
    server.log('info', 'Server running at: ' + server.info.uri);
});
