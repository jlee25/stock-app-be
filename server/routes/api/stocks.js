const express = require("express");
const router = express.Router();
const axios = require("axios");
const { getOldDates } = require("../../commonUtils");
const auth = require("../../middleware/auth");

router.get("/", auth, async function (req, res) {
    const dateType = await getOldDates(req.query.dateType)
    const stocks = req.query.stockType;
    let stockApis = [];

    stocks.forEach(stock => {
        let stockObject = {}
        let url = axios.get(`https://api.tiingo.com/tiingo/daily/${stock}/prices?startDate=${dateType}&token=${process.env.API_KEY}`)
        let tickerInfo = axios.get(`https://api.tiingo.com/tiingo/daily/${stock}?token=${process.env.API_KEY}`)
        stockObject.url = url;
        stockObject.tickerInfo = tickerInfo;
        stockApis.push(stockObject);
    })
    
    Promise.all(stockApis).then(data => {
        return Promise.all(data.map(async response => {

            let objectInfo = {};
            let outputData = [];
            let data = await response.url;

            for(var i = 0; i < data.data.length; i++) {
                var input = data.data[i];
                outputData.push([new Date(input.date).getTime(), input.close]);
            }
            
            const url2 = outputData;
            const tickerInfo2 = await response.tickerInfo
            objectInfo.stockInfo = outputData;
            objectInfo.tickerInfo = tickerInfo2.data;
            return objectInfo
        }));
    }).then(newData => {
        res.json(newData);
    }).catch(errors => {
        console.log(errors);
    })
})

router.get("/:id", auth, async function (req, res) {
    const stock = req.params.id;
    const dateType = await getOldDates("yearly")

    let url = axios.get(`https://api.tiingo.com/tiingo/daily/${stock}/prices?startDate=${dateType}&token=${process.env.API_KEY}`)
    let tickerInfo = axios.get(`https://api.tiingo.com/tiingo/daily/${stock}?token=${process.env.API_KEY}`)
    
    Promise.all([url, tickerInfo]).then(async response => {
        let objectInfo = {};
        let outputData = [];

        let data = await response[0].data;
        for(var i = 0; i < data.length; i++) {
            var input = data[i];
            outputData.push([new Date(input.date).getTime(), input.close]);
        }

        objectInfo.stockInfo = outputData
        objectInfo.tickerInfo = response[1].data;
        return objectInfo
    }).then(newData => {
        res.json(newData);
    }).catch(errors => {
        console.log(errors);
    })
})

router.get("/general/news", auth, async function (req, res) {

    axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.STOCK_NEWS_API_KEY}`, {
        headers: {
            'Authorization' : `token ${process.env.STOCK_NEWS_API_KEY}`
        }
    }).then(response => {
        if (response.status === 200) {
            return res.json(response.data);
        }
    })
    .catch(errors => {
        console.log(errors);
    })
})

module.exports = router;