const express = require('express');
const bodyParser = require('body-parser')
const expresssession = require('express-session');

const cfg = require("./cfg");
const db = require('./models');

var app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {});
app.set('views', './views')
app.set('view engine', 'pug');
app.use('/', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded());

var sessionStore = new (require("connect-session-sequelize")(expresssession.Store))({db: db.sequelize});
app.use(expresssession({secret: cfg.secret, store: sessionStore, resave: false, proxy: true}));
sessionStore.sync();

const passport = require('./passport');

const passportSocketIo = require('passport.socketio');
io.use(passportSocketIo.authorize({
    secret: cfg.secret,
    store: sessionStore,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals = {
        req,
        cfg,
    };
    next();
});

module.exports = io;

app.use(require('./routes'));

const server = httpServer.listen({port: cfg.port}, () => {
    console.log(`Web server started on port ${cfg.port}. This should be accessible from ${cfg.host}.`);
});