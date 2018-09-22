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
    const col = db.collection('site98');
    const docs = await col.find().limit(50000000000).toArray();
    //const docs = await col.find( { value: { $gte: 50000 } } ).toArray();
    //console.log(docs.length);
    //console.log(docs);


    let node0_array = await Promise.all([_.find(docs, function(o) {
        return "0x08a98920ec43025440e8cc4418967e0a681caf8ee064549397481f4849148124" == o._id;
    })]);

    //Add D3,js address
    let address=[];

    //Add Node0 address
    let node0_address={
        "address" : node0_array[0].to
    };
    address.push(node0_address);

    /*

     let obj3={
        "address" : max_token_flow_tx[0].to
    }
    address.push(obj3)

    //console.log(max_token_flow_tx[0].timestamp_unix);
    let find_layer1_node = await Promise.all([_.filter(docs, function(o) {
        return max_token_flow_tx[0].to == o.from ;
    })]);

    //console.log(find_layer2_node[0]);
    let layer1_array=find_layer1_node[0];

    */

    //Layer1
    let node1_array=[];
    for (let i=0;i<node0_array.length;i++){
        //console.log("------------");
        //console.log("Node0 No."+i);
        //console.log(node0_array[i]);

        let find_Node1 = await Promise.all([_.filter(docs, function(o) {
            return node0_array[i].to == o.from ;
        })]);
        //console.log("Finded Node1")
        //console.log(find_Node1[0])

        //Sort
        let find_Node1_sort = await Promise.all([
            _.sortBy(find_Node1[0], [function(o) {
                //console.log(o.value);
                return o.value;
            }])]);
        //console.log(find_Node1_sort[0]);

        //Take Right
        let find_Node1_sort_take_right = await Promise.all([
            _.takeRight(find_Node1_sort[0],100)
        ]);
        console.log(find_Node1_sort_take_right[0]);

        //Remap value
        let find_Node1_1=find_Node1_sort_take_right;


        for(let j=0;j<find_Node1_1[0].length;j++)
        {
            //console.log("i "+i +" j: "+j);
            //console.log("Node0 TImestamp : "+node0_array[i].timestamp_unix);
            //console.log("Node1 TImestamp : "+find_Node1[0][j].timestamp_unix);

            if (node0_array[i].timestamp_unix < find_Node1[0][j].timestamp_unix){
                //console.log("Node0 is behind Node1, OK");

                //Add Node0 time to Node1 obj
                find_Node1[0][j].parent_timestamp=node0_array[i].timestamp_unix;
                //Push Node1[j] to Node1_array
                node1_array.push(find_Node1[0][j]);

                //"Push Node1 address to address
                let obj1={
                    "address" : find_Node1[0][j].to
                };
                address.push(obj1);



            }
            else{
                //console.log("Node0 is ahead of Node1, Failed");
            }

        }


    }



    //Node2
    let node2_array=[];
    for (let i=0;i<node1_array.length;i++){
        //console.log("------------");
        //console.log("Node "+i)
        //console.log(sort_layer2_node_take_right[0][i]);


        //console.log("i: "+i);
        let find_node2_node = await Promise.all([_.filter(docs, function(o) {
            return node1_array[i].to == o.from ;
        })]);

        //console.log("Sub Nodes"+find_layer3_node);
        //console.log(find_layer3_node);
        //layer3_array.push(find_layer3_node[0]);
        //console.log(find_layer2_node[0].length);

        for(let j=0;j<find_node2_node[0].length;j++)
        {
            //console.log("j: "+j);
            //console.log("Layer2 TImestamp : "+sort_layer2_node_take_right[0][i].timestamp_unix);
            //console.log("Layer3 TImestamp : "+find_layer3_node[0][j].timestamp_unix)
            if (node1_array[i].timestamp_unix < find_node2_node[0][j].timestamp_unix){
                //console.log("Node1 is behind Node2, OK");
                //console.log("Node2 add new field, parent timestamp");
                find_node2_node[0][j].parent_timestamp=node1_array[i].timestamp_unix;
                //console.log("Push to Node2_arrray");
                node2_array.push(find_node2_node[0][j]);


                //console.log("Push layer3 address to address");
                //console.log(find_layer3_node[0][j].to)
                //address.push(find_layer3_node[0][j].to)
                let obj1={
                    "address" : find_node2_node[0][j].to
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
    //let layer3_array = node2_array;

    //node4
    /*
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
    */


    console.log("All Address");
    console.log(address.length);

    let data = {
        //"sender": trans,
        //"max_token_flow_tx":max_token_flow_tx[0],
        //"sender2": trans2,
        "address": address,
        //"sort_layer2_node_take_right":sort_layer2_node_take_right[0],
        //"sort_layer2_node_take_right_max_value":sort_layer2_node_take_right_max_value,
        //"find_layer3_node":find_layer3_node[0],
        "node1_array": node1_array,
        "node2_array": node2_array,
        //"layer3_array": layer3_array,
        //"node4_array": node4_array,

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




