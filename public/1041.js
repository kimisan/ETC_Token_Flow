// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 1300 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

//var x = d3.scaleLinear().range([0, 50]);
var x = d3.scaleTime().range([0, width]);
//var y = d3.scaleTime().range([0, height]);
var y = d3.scaleLinear().range([height, 0]);
var y2 = d3.scaleLinear().range([height, 0]);

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
x.domain([new Date("2018-08-31"), new Date("2018-9-6")]);
//x.domain([new Date("2018-07-15"), new Date("2018-9-10")]);
//y.domain(d3.extent(jsonCircles, function(d) { return new Date(d.Milestone); }));
y.domain([0, 500000]);
y2.domain([6, 20]);

svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
    )

// Add the Y Axis
svg.append("g")
    .attr("stroke", "green")
    .call(d3.axisLeft(y)
        .tickFormat(d3.format(".2s")));

//add 2nd Y Axis
svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + width + " ,0)")
    //.style("fill", "red")
    .attr("stroke", "purple")
    .call(d3.axisLeft(y2));


console.log(data_array.array_etc_token_hour);

var circles5 = svg.selectAll("circle5")
    .data(data_array.array_etc_token_hour)
    .enter()
    .append("circle")
    .attr("clip-path","url(#rect-clip)")
    .attr("cx", function (d) {
        //console.log(d.timestamp);
        return x(new Date(d.date)); })
    .attr("cy", function (d) {
        //console.log(d);
        return y(d.value);
        //return y(d.totalDifficulty);
    })
    .attr("r", function (d) { return 5; })
    .attr('fill-opacity', function(d) {
        if (d.status == "completed"){
            return 1;
        }
        else {
            return 0.5;
        }
    })
    .style("fill", "green");

//add ETC price data
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

svg.append("text")
    .attr("x", x(new Date())-800)
    .attr("y", -10)
    .style("font-size", "14px")
    .attr("transform", "translate(0,0) rotate(90)")
    .attr('text-anchor', 'middle')
    .attr("stroke", "green")
    .text("$ETC Token Movement per hour");

svg.append("text")
    .attr("x", x(new Date())-800)
    .attr("y", -1180)
    .style("font-size", "14px")
    .attr("transform", "translate(0,0) rotate(90)")
    .attr('text-anchor', 'middle')
    .attr("stroke", "purple")
    .text("$ETC/USD");