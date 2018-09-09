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
            const collection = db.collection('site92');
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

    client = await MongoClient.connect(url,{ useNewUrlParser: true });
    console.log("Connected correctly to server");
    const db = client.db(dbName);
    // Get the collection
    const col = db.collection('site96');
    const docs = await col.find().limit(50000000000).toArray();
    //const docs = await col.find( { value: { $gte: 50000 } } ).toArray();
    //console.log(docs.length);
    //console.log(docs);

    //Find max_token_transfer
    let max_token_transfer = await Promise.all([_.maxBy(docs, function(o) {
        return o.value;
    })]);
    console.log("max_token_transfered value");
    console.log(max_token_transfer);

    let max_token_flow_tx = await Promise.all([_.find(docs, function(o) {
        return "0x08a98920ec43025440e8cc4418967e0a681caf8ee064549397481f4849148124" == o._id;
    })]);

    let address=[];

    let obj2={
        "address" : max_token_flow_tx[0].from
    }
    let obj3={
        "address" : max_token_flow_tx[0].to
    }

    address.push(obj2)
    address.push(obj3)

    //console.log(max_token_flow_tx[0].timestamp_unix);
    let find_layer2_node = await Promise.all([_.filter(docs, function(o) {
        return max_token_flow_tx[0].to == o.from ;
    })]);

    //console.log(find_layer2_node[0]);

//remove node2 is early than Node1
    let layer2_node_filterd_early_time=[]
    await Promise.all([
        _.forEach(find_layer2_node[0], function(o) {
            //console.log("Node 1 Time : ")
            //console.log(max_token_flow_tx[0].timestamp_unix);
            //console.log("Node 2 Time : ")
            //console.log(o.timestamp_unix)

            if (o.timestamp_unix > max_token_flow_tx[0].timestamp_unix){
                //console.log("Node2 time > Node1 time");
                layer2_node_filterd_early_time.push(o);
            }
            else {
                //console.log("Failed, Node1 time > Node2 time");
            }


        })
    ]);





    let sort_layer2_node = await Promise.all([
        //_.sortBy(find_layer2_node[0], [function(o) {
        _.sortBy(layer2_node_filterd_early_time, [function(o) {
            //console.log(o.value);
            return o.value; }])
    ]);
    //console.log(sort_layer2_node);

    let sort_layer2_node_take_right = await Promise.all([
        _.takeRight(sort_layer2_node[0], 1000000000000000000)
    ]);

    let sort_layer2_node_take_right_max_value = await Promise.all([
        _.maxBy(sort_layer2_node_take_right[0], function(o) { return o.value; })
    ]);

    //console.log(sort_layer2_node_take_right_max_value);


    //console.log(sort_layer2_node_take_right[0])

    await Promise.all([
        _.forEach(sort_layer2_node_take_right[0], function(value) {
            //console.log(value);
            let obj1={
                "address" : value.to
            }
            address.push(obj1);
        })
    ]);


    //layer3
    let layer3_array=[];
    for (let i=0;i<sort_layer2_node_take_right[0].length;i++){
        //console.log("------------");
        //console.log("Node "+i)
        //console.log(sort_layer2_node_take_right[0][i]);


        //console.log("i: "+i);
        let find_layer3_node = await Promise.all([_.filter(docs, function(o) {
            return sort_layer2_node_take_right[0][i].to == o.from ;
        })]);

        //console.log("Sub Nodes"+find_layer3_node);
        //console.log(find_layer3_node);
        //layer3_array.push(find_layer3_node[0]);
        //console.log(find_layer2_node[0].length);

        for(let j=0;j<find_layer3_node[0].length;j++)
        {
            //console.log("j: "+j);
            //console.log("Layer2 TImestamp : "+sort_layer2_node_take_right[0][i].timestamp_unix);
            //console.log("Layer3 TImestamp : "+find_layer3_node[0][j].timestamp_unix)
            if (sort_layer2_node_take_right[0][i].timestamp_unix < find_layer3_node[0][j].timestamp_unix){
                //console.log("Node3 is behind Node2, OK");
                //console.log("Node3 add new field, parent timestamp");
                find_layer3_node[0][j].parent_timestamp=sort_layer2_node_take_right[0][i].timestamp_unix;
                //console.log("Push to layer3_arrray");
                layer3_array.push(find_layer3_node[0][j]);


                //console.log("Push layer3 address to address");
                //console.log(find_layer3_node[0][j].to)
                //address.push(find_layer3_node[0][j].to)
                let obj1={
                    "address" : find_layer3_node[0][j].to
                };
                address.push(obj1);
            }
            else{
                //console.log("Node3 is ahead of  Node2, Failed");
            }
        }



    }

    //console.log("node3_array");
    //console.log(layer3_array);

    //node4
    let node4_array=[];
    for (let i=0;i<layer3_array.length;i++){
        //console.log("------------");
        //console.log("Node4 No."+i)
        //console.log(layer3_array[i]);

        let find_Node4 = await Promise.all([_.filter(docs, function(o) {
            return layer3_array[i].to == o.from ;
        })]);
        //console.log("Finded Node4")
        //console.log(find_Node4[0])

        for(let j=0;j<find_Node4[0].length;j++)
        {
            //console.log("j: "+j);
            //console.log("Node3 TImestamp : "+layer3_array[i].timestamp_unix);
            //console.log("Node4 TImestamp : "+find_Node4[0][j].timestamp_unix)

            if (layer3_array[i].timestamp_unix < find_Node4[0][j].timestamp_unix){
                //console.log("Node4 is behind Node3, OK");
                //Add Node3 time to Node4 obj
                find_Node4[0][j].parent_timestamp=layer3_array[i].timestamp_unix;
                //Push Node4[j] to Node4_array
                node4_array.push(find_Node4[0][j]);

                //"Push Node4 address to address
                let obj1={
                    "address" : find_Node4[0][j].to
                };
                address.push(obj1);

            }
            else{
                //console.log("Node4 is ahead of Node3, Failed");
            }

        }

    }

    console.log("All Address");
    console.log(address.length);

    let data = {
        //"sender": trans,
        "max_token_flow_tx":max_token_flow_tx[0],
        //"sender2": trans2,
        "address": address,
        "sort_layer2_node_take_right":sort_layer2_node_take_right[0],
        "sort_layer2_node_take_right_max_value":sort_layer2_node_take_right_max_value,
        //"find_layer3_node":find_layer3_node[0],
        "layer3_array": layer3_array,
        "node4_array": node4_array,
        //"array_etc_token_hour": array_etc_token_hour,
        //"ETC_price_data": ETC_price_data,
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




