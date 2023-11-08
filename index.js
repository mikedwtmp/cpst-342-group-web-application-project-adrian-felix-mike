const express = require("express");
const app = express();

app.get("/home",  function(req,res) {
    res.send("<h1> This is the home page.</>");
});

app.listen(3000);