
Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var getblock = function(para) {
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

let mongodb1  = function(para) {
    return new Promise(function(resolve, reject) {

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("test1");

            dbo.collection("site90").insertOne(para, function(err, res) {
                if (err){
                    console.log(err);
                    resolve();
                }
                //console.log("文档插入成功");
                db.close();
                resolve();
            });
        });

    })
};


async function main() {


   // var result1 = await getblock(5700000);

    var count =0
    var sum =0;
    for (let i= 6475000;i< 7200000; i++)
    //for (let i=  6410011;i<  6410012; i++)
    {

        console.log("當前區塊: "+ i);
        var result1 = await getblock(i);
        //console.log(result1.timestamp);

        for (let j=0;j<result1.transactions.length;j++)
        {
            let tran1 = await gettran(result1.transactions[j]);
            //console.log(tran1);

            var xx ={
                _id: tran1.hash,
                blockHash:tran1.blockHash,
                blockNumber:tran1.blockNumber,
                from:tran1.from,
                gasPrice:tran1.gasPrice,
                to:tran1.to,
                transactionIndex:tran1.transactionIndex,
                value:parseFloat(web3.fromWei(tran1.value.toString(), 'ether')),
                timestamp1: new Date(result1.timestamp*1000),
                timestamp_unix:result1.timestamp
            };

            await mongodb1(xx);


        }
    }
}

main();
