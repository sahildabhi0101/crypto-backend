const axios = require('axios');

exports.getcoinUSD = (req, res) => {
    axios
        .get(`https://api.nomics.com/v1/currencies/ticker?key=${process.env.DATA_API_KEY}&interval=1d,30d&convert=USD&per-page=100&page=1`)
        .then(resp => {

            return res.status(200).json(resp.data);
        })
        .catch(err => {
            console.log("Error fetching data from nomics", err);
            return res.status(404)
        });
}
exports.getcoinINR = (req, res) => {
    axios
        .get(`https://api.nomics.com/v1/currencies/ticker?key=${process.env.DATA_API_KEY}&interval=1d,30d&convert=INR&per-page=100&page=1`)
        .then(resp => {

            return res.status(200).json(resp.data);
        })
        .catch(err => {
            console.log("Error fetching data from nomics", err);
            return res.status(404)
        });
}
exports.getcoinEUR = (req, res) => {
    axios
        .get(`https://api.nomics.com/v1/currencies/ticker?key=${process.env.DATA_API_KEY}&interval=1d,30d&convert=EUR&per-page=100&page=1`)
        .then(resp => {

            return res.status(200).json(resp.data);
        })
        .catch(err => {
            console.log("Error fetching data from nomics", err);
            return res.status(404)
        });
}
exports.getfavcoinUSD = (req, res) => {
    const s = req.headers.data;
    axios
        .get(`https://api.nomics.com/v1/currencies/ticker?key=${process.env.DATA_API_KEY}&ids=${s}&interval=1d,30d&convert=USD&per-page=100&page=1`)
        .then(resp => {

            return res.status(200).json(resp.data);
        })
        .catch(err => {
            console.log("Error fetching data from nomics", err);
            return res.status(404)
        });
}
exports.getfavcoinINR = (req, res) => {
    const s = req.headers.data;
    axios
        .get(`https://api.nomics.com/v1/currencies/ticker?key=${process.env.DATA_API_KEY}&ids=${s}&interval=1d,30d&convert=INR&per-page=100&page=1`)
        .then(resp => {

            return res.status(200).json(resp.data);
        })
        .catch(err => {
            console.log("Error fetching data from nomics", err);
            return res.status(404)
        });
}
exports.getfavcoinEUR = (req, res) => {
    const s = req.headers.data;
    axios
        .get(`https://api.nomics.com/v1/currencies/ticker?key=${process.env.DATA_API_KEY}&ids=${s}&interval=1d,30d&convert=EUR&per-page=100&page=1`)
        .then(resp => {

            return res.status(200).json(resp.data);
        })
        .catch(err => {
            console.log("Error fetching data from nomics", err);
            return res.status(404)
        });
}