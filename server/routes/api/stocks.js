const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const axios = require("axios");
const { getOldDates } = require("../../commonUtils");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Ticker = require("../../models/Ticker");
let { getStockChartsData } = require("../../controllers/stockController");

router.get("/", auth, async function (req, res) {
    getStockChartsData(req.query.stockType, res, false);
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

router.get("/general/search", auth, async function (req, res) {
    let query = {};
    query = {
        ticker: { "$regex": req.query.search, "$options": "i" }
    }
    Ticker.find(query)
    .limit(12)
    .then(async tickers => {
        await User.findOne({ _id: req.user.id }, {favouriteTickers: 1}).then(favTickers => {
            for (let i = 0; i < tickers.length; i++){
                for (let j = 0; j < favTickers.favouriteTickers.length; j++) {
                    if (favTickers.favouriteTickers[j].tickerId.toString() == tickers[i]._id.toString()){
                        tickers[i].favourite = true
                    }
                }
            }
        })
        res.status(200).json(tickers);
    })
    .catch(errors => {
        console.log(errors);
    })
})

router.put("/user/updateTicker", auth, async (req, res) => {
    console.log('in here');
    console.log(req.body.id, 'idddd');
    User.find({ _id: req.user.id, "favouriteTickers.tickerId" : req.body.id}).then(async userInfo => {
        if (userInfo.length > 0) {
            // Remove
            await User.updateOne({ _id: req.user.id }, {$pull: { "favouriteTickers": { tickerId: req.body.id}} }).then(
                res.status(200).json({id: req.body.id, remove: true, message: "Removed From Favourites"})
            )
            .catch(errors => {
                console.log(errors);
            })
        } else {
            // Add
            await User.updateOne(
                { _id: req.user.id }, 
                { $addToSet: {"favouriteTickers": {
                    ticker: req.body.title,
                    tickerId: req.body.id
                }}}).then(
                res.status(200).json({id: req.body.id, remove: false, message: "Saved as Favourites"})
                )
                .catch(errors => {
                    console.log(errors);
            })
        }
    })
});

router.get("/user/favStocks", auth, async (req, res) => {
    await User.findOne({ _id: req.user.id }, {favouriteTickers: 1}).then(async tickers => {
        console.log(tickers, 'tickerss')
        if (tickers) {
            let objectIdArray = tickers.favouriteTickers.map(s => mongoose.Types.ObjectId(s.tickerId));
            let stockTickerArray = [];
            await Ticker.find({ _id: { $in: objectIdArray}}).then(tickerList => {
                tickerList.forEach(ticker => {
                    stockTickerArray.push(ticker.ticker);
                })
            })
            .catch(errors => {
                console.log(errors);
            });
            getStockChartsData(stockTickerArray, res, req, objectIdArray);
        } else {
            res.status(422).json({message: "No favourite stock found"})
        }
    })
    .catch(errors => {
        console.log(errors);
    });
    }
);

module.exports = router;