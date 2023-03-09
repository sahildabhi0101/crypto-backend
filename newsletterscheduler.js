var cron = require('node-cron');
const User = require('./models/user');
const axios = require("axios")
const dotenv = require('dotenv');
dotenv.config()
const { forEach } = require('lodash');
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

const fetchFav = (fav) => {

    const API = `https://api.nomics.com/v1/currencies/ticker?key=${process.env.DATA_API_KEY}&ids=${fav}&interval=1d,7d,30d`

    return axios.get(API)
    .then((response) => response.data)
    .catch(err => {
        console.log(err)
    })
}


cron.schedule("* * */7 * *", () => {
    console.log("inside news letter feature.")
    let cString = "", new1 = "", favArr=[], userList;
    var all_value = [];
    User.find()
    .then(users => {
        userList = users
        users.forEach(user => {
            // console.log(user);
            if(user.sub == true && user.fav.length > 0) {
                user.fav.forEach(currency => {
                    all_value.push(currency)
                })
            }
        })
        // console.log(cString)
        return all_value
    })
    .then(all_value => {
        if(all_value == "") {
            return 
        }
        all_value = all_value.filter((item, index) => all_value.indexOf(item) === index);
        // console.log("all data_is")
        // console.log(all_value)
        for (let x in all_value) {
            cString += all_value[x];
            cString += ','
          }
        // console.log("cstring is : ",cString)
        return fetchFav(cString)
        .then(data => {
            // console.log(data)
            favArr = data
            return favArr
        })
    })
    .then(currArr => {
        if(cString == "") {
            console.log("No Data")
            return 
        }
        userList.forEach(user => {
            let htmlC = ""
            if(user.sub == true && user.fav.length > 0) {
                user.fav.forEach(cur => {
                    currArr.forEach(favcur => {
                        if(favcur.currency == cur) {
                            htmlC += `<h3>Details of ${favcur.name}<h3><br><p>Price as of now is $ ${favcur.price} and its price change compare to last 7 day is $ ${favcur['7d'].price_change} its about ${favcur['7d'].price_change_pct} % </p><br>`
                        }
                    })
                })
                const emailData = {
                    from: 'cryptotracker0101@gmail.com',
                    to: user.subemail,
                    subject: 'Newsletter of your Favorite Crypto Currencies by Crypto-Tracker',
                    html: htmlC,
                };
                sendEmail(emailData)
            }
        })
    })
    .catch(err => console.log(err))
})

