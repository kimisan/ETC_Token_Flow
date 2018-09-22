// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 270},
    width = 1300 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;


var x = d3.scaleTime().range([0, width]);


var y = d3.scaleBand()
    //.rangeRound([0, height])
    .range([0, height])
    .padding(1);

//onsole.log(data_array.max_token_flow_tx);
y.domain(data_array.address.map(function(d) {
    //console.log(d);
    return d.address;
}));



var _s1 = d3.format("s");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//append clip
svg.append("clipPath")       // define a clip path
    .attr("id", "rect-clip") // give the clipPath an ID
    .append("rect")            // shape it as an ellipse
    .attr("x", 0)            // position the x-centre
    .attr("y", 0)            // position the y-centre
    .attr("height",height)
    .attr("width",width);


var jsonCircles = [


    { "Milestone": "2018-05-30",
        "text":"ECIP 1041 - Remove Difficulty Bomb",
        "status":"uncompleted",
        "color" : "green"
    },

    { "Milestone": "2018-06-12",
        "text":"Coinbase Announces Ethereum Classic Support",
        "status":"completed",
        "color" : "green"
    },
    { "Milestone": "2018-06-12",
        "text":"Binance add new ETC Trading Pairs ",
        "status":"completed",
        "color" : "green"
    },
    { "Milestone": "2018-06-22",
        "text":"Japan FSA orders improvements at crypto exchanges",
        "status":"completed",
        "color" : "green"
    },
    { "Milestone": "2018-06-26",
        "text":"Emerald-wallet v1.0.0",
        "status":"completed",
        "color" : "green"
    },

    { "Milestone": "2018-07-16",
        "text":"Bitmain Antminer E3(B3)",
        "status":"completed",
        "color" : "green"
    },
    { "Milestone": "2018-08-03",
        "text":"Coinbase Announces Final Testing Ahead of $ETC Listing",
        "status":"completed",
        "color" : "green"
    },

    { "Milestone": "2018-08-08",
        "text":"Bitcoin ETF delay",
        "status":"completed",
        "color" : "green"
    },
    { "Milestone": "2018-08-17",
        "text":"Coinbase support $ETC",
        "status":"uncompleted",
        "color" : "green"
    },
    { "Milestone": "2018-08-31",
        "text":"BTC.com $ETC Mining Pools",
        "status":"uncompleted",
        "color" : "green"
    },


];

//console.log(hashrate_array.cars);

// Scale the range of the data
//x.domain([0, 1]);
//x.domain(d3.extent(jsonCircles, function(d) { return new Date(d.Milestone); }));
x.domain([new Date("2018-08-31"), new Date("2018-9-23")]);
//x.domain([new Date("2018-07-15"), new Date("2018-9-10")]);
//y.domain(d3.extent(jsonCircles, function(d) { return new Date(d.Milestone); }));
//y.domain([0, 500000]);

svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
    )

// Add the Y Axis
svg.append("g")
    .attr("stroke", "green")
    .call(d3.axisLeft(y));
//.tickFormat(d3.format(".2s")));



//add ETC price data
/*
let circles6 = svg.selectAll("circle6")
    .data(data_array.ETC_price_data)
    .enter()
    .append("circle")
    .attr("clip-path","url(#rect-clip)")
    .attr("cx", function (d) {
        //console.log(d.timestamp);
        return x(new Date(d.date*1000)); })
    .attr("cy", function (d) {
        //console.log(d);
        return y2(d.close);
        //return y(d.totalDifficulty);
    })
    .attr("r", function (d) { return 2; })
    .attr('fill-opacity', function(d) {
        if (d.status == "completed"){
            return 1;
        }
        else {
            return 0.5;
        }
    })
    .style("fill", "purple");
    */

//console.log(data_array.sort_layer2_node_take_right)


let linearScale1 = d3.scaleLinear()
    //.domain([0,3500])
    .domain([0,5000])
    .range([0,1]);
//console.log(data_array.sort_layer2_node_take_right_max_value[0].value);
//console.log(linearScale1(50));


let line1 = svg.selectAll("line1")
    .data(data_array.node1_array)
    .enter()
    .append("line")
    .attr("clip-path","url(#rect-clip)")
    .attr("x1", function (d) {
        //console.log(d);
        return 50;
    })
    .attr("y1", function (d) {
        //console.log(d.from);
        return y(d.from);
        //return y(d.totalDifficulty);
    })
    .attr("x2", function (d) {
        //console.log(new Date(d.timestamp_unix*1000));
        return x(new Date(d.timestamp_unix*1000));
        //return y(d.totalDifficulty);
    })
    .attr("y2", function (d) {

        //console.log(d);
        return y(d.to);
        //return y(d.totalDifficulty);
    })
    .style("opacity", function (d) {
        return linearScale1(d.value);
    })
    .attr("stroke-width", 1)
    .attr("stroke","red");


let line2 = svg.selectAll("line2")
    .data(data_array.node2_array)
    .enter()
    .append("line")
    .attr("clip-path","url(#rect-clip)")
    .attr("x1", function (d) {
        //console.log(d);
        return x(new Date(d.parent_timestamp*1000));
    })
    .attr("y1", function (d) {
        //console.log(d.from);
        return y(d.from);
        //return y(d.totalDifficulty);
    })
    .attr("x2", function (d) {
        //console.log(new Date(d.timestamp_unix*1000));
        return x(new Date(d.timestamp_unix*1000));
        //return y(d.totalDifficulty);
    })
    .attr("y2", function (d) {

        //console.log(d);
        return y(d.to);
        //return y(d.totalDifficulty);
    })
    .style("opacity", function (d) {
        return linearScale1(d.value);
    })
    .attr("stroke-width", 1)
    .attr("stroke","black");




let line4 = svg.selectAll("line4")
    .data(data_array.node4_array)
    .enter()
    .append("line")
    .attr("clip-path","url(#rect-clip)")
    .attr("x1", function (d) {
        //console.log(d);
        return x(new Date(d.parent_timestamp*1000));
    })
    .attr("y1", function (d) {
        //console.log(d.from);
        return y(d.from);
        //return y(d.totalDifficulty);
    })
    .attr("x2", function (d) {
        //console.log(new Date(d.timestamp_unix*1000));
        return x(new Date(d.timestamp_unix*1000));
        //return y(d.totalDifficulty);
    })
    .attr("y2", function (d) {

        //console.log(d);
        return y(d.to);
        //return y(d.totalDifficulty);
    })
    .style("opacity", function (d) {
        return linearScale1(d.value);
    })
    .attr("stroke-width", 1)
    .attr("stroke","blue");