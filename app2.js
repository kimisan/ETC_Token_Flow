const express = require('express')
const app = express()

//var rp = require('request-promise');

Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));


app.set('view engine', 'pug')
app.use(express.static('public'))

var rp = require('request-promise');

var moment = require('moment');


const MongoClient = require('mongodb').MongoClient;
//const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'test1';


var _ = require('lodash');



let getblock = function(para) {
    return new Promise(function(resolve, reject) {

        web3.eth.getBlock(para, function(error, result){
            if(!error){
                //console.log(JSON.stringify(result));
                resolve(result);
            }

            else
                console.error(error);
        })

    })
};

let gettran = function(para) {
    return new Promise(function(resolve, reject) {

        web3.eth.getTransaction(para, function(error, result){
            if(!error){
                //console.log(JSON.stringify(result));
                resolve(result);
            }

            else
                console.error(error);
        })

    })
};

let mongo_query = function(db, para) {
    return new Promise(function(resolve, reject) {

        simplePipeline(db, function() {
            client.close();
            //resolve(1);
        });

        function simplePipeline(db, callback) {
            const collection = db.collection('site90');
            collection.aggregate(
                [
                    {
                        $group:
                            {
                                //_id: { day: { $dayOfYear: "$timestamp1"}, year: { $year: "$timestamp1" } },
                                _id: { year: { $year: "$timestamp1" }, month: { $month: "$timestamp1" }, day: { $dayOfMonth: "$timestamp1"}, hour: { $hour : "$timestamp1" } },
                                totalAmount: { $sum: "$value" },
                                count: { $sum: 1 }
                            }
                    }
                ],
                function(err, cursor) {
                    //assert.equal(err, null);

                    cursor.toArray(function(err, documents) {
                        //console.log(documents)
                        //callback(documents);
                        resolve(documents);
                    });
                }
            );
        }

    })
};



app.get('/', async (req, res, next) => {

    let ETC_price_data;

    await rp('https://poloniex.com/public?command=returnChartData&currencyPair=USDT_ETC&start=1509508800&end=9999999999&period=900')
        .then(function (htmlString) {
            // Process html...
            ETC_price_data = JSON.parse(htmlString);
            //console.log(ETC_price_data);
        })
        .catch(function (err) {
            // Crawling failed...
        });


    client = await MongoClient.connect(url);
    console.log("Connected correctly to server");
    const db = client.db(dbName);
    // Get the collection
    //const col = db.collection('site89');
    //const docs = await col.find().limit(5).toArray();


    let etc_token_hour = await mongo_query(db, 11);

    //console.log("111"+etc_token_hour);

    let array_etc_token_hour=[];
    for (let i=0;i<etc_token_hour.length;i++)
    {
        //console.log(1);
        console.log(etc_token_hour[i].totalAmount);
        console.log(etc_token_hour[i]._id);
        console.log(moment().year(etc_token_hour[i]._id.year).month(etc_token_hour[i]._id.month-1).date(etc_token_hour[i]._id.day).hour(etc_token_hour[i]._id.hour));
        let obj1={
            "date":moment().year(etc_token_hour[i]._id.year).month(etc_token_hour[i]._id.month-1).date(etc_token_hour[i]._id.day).hour(etc_token_hour[i]._id.hour).add(7, 'h'),
            "value":etc_token_hour[i].totalAmount
        };
        array_etc_token_hour.push(obj1);
    }





    let data = {
        //"sender": trans,
        //"sender2": trans2,
        //"address": address,
        "array_etc_token_hour": array_etc_token_hour,
        "ETC_price_data": ETC_price_data,
        //"hash_min": hash_min,
        //"hash_latest": hash_latest,
        //"ETC_price_data": ETC_price_data,
        "number": 123,
        "string": "Hello World"
    };

    //console.log(data);

    let string_data = JSON.stringify(data);
    //console.log(string_data);

    res.render('index', {
        data:string_data
    })


    // Close connection
    //client.close();

});

app.listen(3000, () => console.log('Example app listening on port 3000!'))




