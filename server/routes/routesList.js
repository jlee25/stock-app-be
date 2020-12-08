let indexRoutes = require('./index');
let stocks = require("./api/stocks");
let user = require("./api/user");

module.exports = function (app) {
    app.use("/", indexRoutes);
    app.use("/api/stocks", stocks);
    app.use("/api/user", user);
}