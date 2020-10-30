const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", function (req, res) {
    const stocks = ["aapl", "msft"];
    let stockApis = [];
    
    stocks.forEach(stock => {
        let url = axios.get(`https://api.tiingo.com/tiingo/daily/${stock}/prices?startDate=2020-10-28&token=${process.env.API_KEY}`)
        stockApis.push(url);
    })
    
    Promise.all(stockApis).then(data => {
        return Promise.all(data.map(function (response) {
            return response.data
        }));
    }).then(newData => {
        console.log(newData);
        res.json(newData);
    }).catch(errors => {
        console.log(errors);
    })
    
    // axios({
    //     method: "get",
    //     url: `https://api.tiingo.com/tiingo/daily/aapl/prices?startDate=2020-09-27&token=${process.env.API_KEY}`,
    //     contentType: "application/json; charset=utf-8"
    // }).then((data) => {
    //     if (data.status === 200) {
    //         res.json(data.data);
    //     } else {
    //         res.json("Error");
    //     }
    // }).catch((error) => {
    //     console.log(error);
    // })
})

module.exports = router;