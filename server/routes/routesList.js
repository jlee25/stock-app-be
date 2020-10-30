let indexRoutes = require('./index');
let stocks = require("./api/stocks");

module.exports = function (app) {
    app.use("/", indexRoutes);
    app.use("/api/stocks", stocks);
}