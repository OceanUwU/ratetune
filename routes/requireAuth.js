module.exports = function requireAuth(req, res, next) {
    if (req.user == undefined) //if user is not logged in
        res.render('auth-needed'); //prompt them to log in
    else //if they are logged in
        next(); //let them access the page
};