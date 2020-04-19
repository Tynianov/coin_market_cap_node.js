const rp = require('request-promise');

let requestOptions = {
    method: 'GET',
    headers: {
        'X-CMC_PRO_API_KEY': process.env.API_KEY
    },
    json: true,
    gzip: true
};

module.exports.getCurrenciesList = function (req, res) {
    requestOptions.qs = {
                            limit: 50
                        };
    requestOptions.uri = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
    rp(requestOptions).then(response => {
        let result = [];
        response.data.forEach(coin => {
            let coinData = {};
            coinData.id = coin.id;
            coinData.name = coin.name;
            coinData.symbol = coin.symbol;
            coinData.price = coin.quote.USD.price.toFixed(2);
            coinData.volume_24h = coin.quote.USD.volume_24h.toFixed(2);
            coinData.percent_change_24h = coin.quote.USD.percent_change_24h.toFixed(2);
            coinData.market_cap = coin.quote.USD.market_cap.toFixed(2);
            coinData.circulating_supply = coin.circulating_supply
            result.push(coinData)
        })
        res.json({result: result})
    }).catch((err) => {
        res.json({error: err.message})
    });
}

module.exports.getCurrencyMetadata = function (req, res) {
    requestOptions.url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/info';
    requestOptions.qs = {
        'id': parseInt(req.params.id)
    }
    rp(requestOptions).then(response => {
        let metadata = response.data[req.params.id]
        res.json({result: metadata})
    }).catch((err) => {
        res.json({error: err.message})
    });
}

module.exports.getCurrencyQuotes = function (req, res) {
    requestOptions.url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
    requestOptions.qs = {
        'id': parseInt(req.params.id)
    }
    rp(requestOptions).then(response => {
        let data = response.data[req.params.id]
        for (property in data.quote.USD){
            if (property === 'last_updated')
                continue;
            data.quote.USD[property] = data.quote.USD[property].toFixed(2);
        }
        res.json({result: data})
    }).catch((err) => {
        res.json({error: err.message})
    });
}
module.exports.convertCurrency = function (req, res) {
    requestOptions.url = 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion';
    let amount = req.query.amount;
    let convert = req.query.convert;
    let id = req.query.id;
    requestOptions.qs = {
        'id': id,
        'amount': amount,
        'convert': convert
    }
    rp(requestOptions).then(response => {
        let price = response.data.quote[convert].price.toFixed(2);
        res.json({price: price})
    }).catch(err => {
        res.json({error: err})
    })
}