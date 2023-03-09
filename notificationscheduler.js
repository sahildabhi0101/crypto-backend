var cron = require('node-cron');
const Curr = require('./models/curr');
const User = require('./models/user');
const fetch = require('node-fetch');
const axios = require("axios")
const dotenv = require('dotenv');
const { forEach } = require('lodash');
dotenv.config()
API_key = "" // internship_6th_Sem/note -> aa file ma key che e aaya paste karvani che.
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(API_key)

const sendEmail = emailData => {
    console.log("inside send mail")
    console.log(emailData)
    return   sgMail
    .send(emailData)
    .then((response) => {
      console.log("success mail is sended.")
    })
    .catch((error) => {
      console.error(error)
    })

};

const fetchFav = () => {
    const API = `https://api.nomics.com/v1/currencies/ticker?key=${process.env.DATA_API_KEY}&interval=1d,30d&convert=USD&per-page=100&page=1`
    console.log("inside_fetchfav")
    return axios.get(API)
    .then((response) => response.data)
    .catch(err => {
        console.log(err)
    })
}

cron.schedule("* * * * *", () => {
    console.log("you are in cron of notification")

    let  arrnoti = [], userL = [];
    fetchFav()
    .then(data => {
        arrnoti = data.map(i => {
            return {
                currency: i.currency,
                price: i.price
            }
        })
        return arrnoti
        })
        .then(data => {
            return User.find({}, { notification: 1, email: 1, name: 1 })
                .then(users => {
                    userL = users
                    return userL
                })
        })
        .then(data => {
            userL.forEach(u => {
                u.notification.forEach(n => {
                    arrnoti.forEach(i => {
                        if (i.currency === n.currency) {
                            if (n.lower > i.price && n.lower != Infinity) {
                                console.log("lower value", n.lower, u.name)
                                
                                const emailData = {
                                    from: 'cryptotracker0101@gmail.com',
                                    to: u.email,
                                    subject: 'Notification Crypto',
                                    text: ` BUY CRYPTO  \nYour notified crypto price for ${n.currency} decreased than your notified value ${n.lower} , it's value is ${i.price}`
                                };

                                sendEmail(emailData)

                                n.lower = 0
                                u.save()
                                    .then(res => {
                                        console.log("Success lower value change")
                                    })
                                    .catch(err => console.log(err))

                            }
                            else if (n.upper < i.price && n.upper != 0) {
                                console.log("upper value", n.upper, u.name)
                                const emailData = {
                                    from: "cryptotracker0101@gmail.com",
                                    to: u.email,
                                    subject: 'Notification Crypto',
                                    text: ` SELL CRYPTO \n your notified crypto price for ${n.currency} increased than your notified value ${n.upper} and now its value is ${i.price}`
                                };

                                n.upper = 10000000000;

                                sendEmail(emailData)

                                n.upper = Infinity
                                u.save()
                                    .then(res => {
                                        console.log("Success upper value change")
                                    })
                                    .catch(err => console.log(err))
                            }
                            else if ((n.lower == 0 && n.upper == Infinity) || (n.lower == 0 && n.upper == 0) || (n.lower == Infinity && n.upper == Infinity)) {
                                // console.log(n.lower, n.upper)
                                let favCrypto = []
                                u.notification.forEach(i => {
                                    if ((n.lower == 0 && n.upper == Infinity) || (n.lower == 0 && n.upper == 0) || (n.lower == Infinity && n.upper == Infinity) ) {
                                        console.log(i)
                                        return;
                                    }
                                    favCrypto.push(i)
                                })
                                console.log(favCrypto);
                                u.notification = favCrypto;
                                u.save()
                                    .then(r => {
                                        -
                                        console.log("object Deleted")
                                    })
                                    .catch(err => console.log(err))
                            }
                        }
                    })
                })
            })
        })
        .catch(err => {
            console.log(err)
        })
});