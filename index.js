const express = require('express');
const bodyParser = require('body-parser')
const expresssession = require('express-session');

const cfg = require("./cfg");
const db = require('./models');

var app = express();
app.set('views', './views')
app.set('view engine', 'pug');
app.use('/', express.static(__dirname + '/public'));
app.use(bodyParser.json());

var sessionStore = new (require("connect-session-sequelize")(expresssession.Store))({db: db.sequelize});
app.use(expresssession({secret: cfg.secret, store: sessionStore, resave: false, proxy: true}));
sessionStore.sync();

const passport = require('./passport');

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals = {
        req,
        cfg,
    };
    next();
});

app.use(require("./routes"));

const server = app.listen(cfg.port, () => {
    console.log('Web server started.');
});