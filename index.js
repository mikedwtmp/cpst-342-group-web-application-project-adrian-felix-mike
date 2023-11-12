const express = require("express");
const app = express();

app.get("/home",  function(req,res) {
    res.send("<h1> This is the home page.</h>");
});

app.get("/user/:user", function (req, res) {
    user = req.params.user;
    res.send("<h>This would be the page for user: " + user + "</h>" )
});

app.listen(3000);