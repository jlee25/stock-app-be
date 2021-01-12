const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../models/User");
const { getOldDates } = require("../commonUtils");

async function getStockChartsData(stockArray, res, req, favIds) {
    const dateType = await getOldDates("yearly")
    let stockApis = [];

    stockArray.forEach(stock => {
        console.log(stock, 'stockk');
        let stockObject = {}
        let url = axios.get(`https://api.tiingo.com/tiingo/daily/${stock}/prices?startDate=${dateType}&token=${process.env.API_KEY}`)
        let tickerInfo = axios.get(`https://api.tiingo.com/tiingo/daily/${stock}?token=${process.env.API_KEY}`)
        stockObject.url = url;
        stockObject.tickerInfo = tickerInfo;
        stockApis.push(stockObject);
    })
    
    Promise.all(stockApis).then(data => {
        return Promise.all(data.map(async response => {

            console.log(favIds);
            let objectInfo = {};
            let outputData = [];
            let details = [];
            let data = await response.url;
            
            for(var i = 0; i < data.data.length; i++) {
                var input = data.data[i];
                outputData.push([new Date(input.date).getTime(), input.close]);
                details.push([new Date(input.date).getTime(), input.close, input.high, input.low, input.open])
            }

            // if (favIds) {
            //     await User.findOne({ _id: req.user.id }, {favouriteTickers: 1}).then(async tickers => {

            //     })
            // }
            
            const url2 = outputData;
            const tickerInfo2 = await response.tickerInfo
            objectInfo.stockInfo = outputData;
            objectInfo.tickerInfo = tickerInfo2.data;
            objectInfo.details = details;      
            return objectInfo
        }));
    }).then(newData => {
        return res.json(newData);
    }).catch(errors => {
        console.log(errors);
    })
}

module.exports = { getStockChartsData }
