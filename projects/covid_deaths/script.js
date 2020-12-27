const event_deaths = {"911": 2977,
                      "Afghanistan & Iraq Wars": 2216 + 4497,
                      "Korean War": 36516,
                      "Vietnam War": 58209,
                      "World War I": 116516,
                      "COVID-19": 0,
                      "World War II": 405399,
                      "The American Civil War": 655000};
// "1918 Spanish Flu": 675000

const event_colors = {"COVID-19": "#ec625f"};

const bar_spacing = 45;
const bar_height = 30;
const points_per_col = 3;
const max_cols = Math.ceil(event_deaths["The American Civil War"] / event_deaths["911"] / points_per_col)
let last_update_date;

let margin = {top: 50, right: 10, bottom: 10, left: 10};
let width = 700 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

let bar_plot_svg = d3.select("#covid_div").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)



function draw_911_people() {
    let margin = {top: 20, right: 20, bottom: 50, left: 20};
    let width = 780 - margin.left - margin.right,
        height = 2000 - margin.top - margin.bottom;

    const n_cols = 30
    const n_rows = 100

    let points = []
    let row_pos = 0;

    for (let i = 0; i < event_deaths["911"]; i++){
        points.push({'x': row_pos, 'y': Math.floor(i / n_cols), 'event_type': "COVID-19"});
        row_pos++;
        if (row_pos === n_cols) { row_pos = 0; }
    }

    let xScale = d3.scaleBand().domain(d3.range(n_cols))
        .range([0, width + margin.right / 2])
        // .paddingInner(1)
        // .paddingOuter(paddingOuter)
        // .align(0);

    let yScale = d3.scaleBand().domain(d3.range(n_rows))
        .range([0, height - margin.bottom]);

    let g = d3.select("#people_911_div")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g.append("line")
        .attr("x1", 80)
        .attr("x2", width - 80)
        .attr("y1", -margin.top + 1)
        .attr("y2", -margin.top + 1)
        .style("stroke", "white")

    let x_ax = g.append("g")
        .attr("id", "x_ax")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)
            .ticks(10))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick").remove());


    let y_ax = g.append("g")
        .attr("transform", "translate(0," + 0 + ")")
        .call(d3.axisLeft(yScale)
            .ticks(10))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick").remove());


    g.append("g").selectAll(".person_icon")
        .data(points)
        .enter()
        .append("image")
        .attr("class", "person_icon")
        .attr('xlink:href', "./images/person.svg")
        .attr("width", 15)
        .attr("height", 15)
        .attr("x", d => xScale(d.x))
        .attr("y", d => yScale(d.y))

    // bottom part
    let left_x = xScale(3);
    let right_x = xScale(n_cols - 4);
    let center_point = Math.round(left_x + (right_x - left_x) / 2);
    let y = height - 35

    g.append("line")
        .attr("x1", left_x)
        .attr("x2", right_x)
        .attr("y1", y)
        .attr("y2", y)
        .style("stroke", "white")

    g.append("line")
        .attr("x1", center_point)
        .attr("x2", center_point)
        .attr("y1", y)
        .attr("y2", y + 35)
        .style("stroke", "white")

    g.append("circle")
        .attr("cx", center_point)
        .attr("cy", y + 50)
        .attr("r", 4)
        .style("fill", event_colors["COVID-19"])

    g.append("text")
        .classed("transition_text_large", true)
        .attr("x", center_point + 25)
        .attr("y", y + 45)
        .text("9/11")

    g.append("text")
        .classed("transition_text_large", true)
        .attr("x", center_point + 25)
        .attr("y", y + 70)
        .text("2,977 deaths")
        .style("font-size", "medium")
        .style("font-weight", "normal")



    // d3.xml("./images/people_to_point.svg")
    //     .then(data => {
    //         d3.select("#test_div").node().append(data.documentElement).style("width", 1000)
    //     });

    // g.append("image")
    //     .attr('xlink:href', "./images/people_to_point.svg")
    //     .attr("width", 200) // xScale(n_cols)
    //     .attr("height", 60)
    //     .attr("x", d => xScale(0))
    //     .attr("y", d => yScale(n_rows - 1) + 20)

}
function draw_bar_plots() {
    let bar_pos = 0
    Object.entries(event_deaths).forEach(([k,v]) => {
        if (k !== "911") {
            draw_single_bar(k, bar_pos);
            bar_pos += bar_height + bar_spacing;
        }
    })

}

let formatNumberWithComma = d3.format(",");
let points = []

function draw_single_bar(source, bar_pos) {
    const top_margin = 15;
    let num_points = Math.round(event_deaths[source] / event_deaths['911'])

    // let points = []
    let slice_count = 0;
    for (let i = 0; i < num_points; i++){
        points.push({'x': Math.floor(i / points_per_col), 'y': slice_count, 'event_type': "COVID-19"});
        slice_count++;
        if (slice_count === 3) { slice_count = 0; }
    }

    let xScale = d3.scaleBand().domain(d3.range(max_cols))
        .range([0, width]);
    let yScale = d3.scaleBand().domain(d3.range(points_per_col))
        .range([0, bar_height]);

    let g = bar_plot_svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + (bar_pos + margin.top) + ")")

    g.append("text")
        .classed("event_label", true)
        .attr("y", -25)
        .attr("x", 0)
        .text(source);

    g.append("text")
        .classed("lives_lost_text", true)
        .attr("y", -10)
        .attr("x", 0)
        .text(formatNumberWithComma(event_deaths[source]));

    g.append("g")
        .attr("id", "x_ax")
        .attr("transform", "translate(0," + bar_pos + ")")
        .call(d3.axisBottom(xScale)
            .ticks(0))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick").remove())

    g.append("g")
        .attr("transform", "translate(0," + top_margin + ")")
        .call(d3.axisLeft(yScale)
            .ticks(0))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick").remove())
    // .call(g => g.selectAll(".tick:not(:first-of-type) line")
    //     .attr("stroke-opacity", 0.5)
    //     .attr("stroke-dasharray", "5,10"))
    // .attr("color", "grey")

    g.selectAll(".point_" + source.slice(0,4))
        .data(points)
        .enter()
        .append("circle")
        .attr("class", ".point_" + source.slice(0,4))
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 3)
        .attr("fill", d => event_colors[d.event_type]);

    if (source === "COVID-19" || source === "Afghanistan & Iraq Wars") {
        let x = points[points.length - 1]["x"]
        let y = points[points.length - 1]["y"]

        if (y === 2) {
            y = 0;
            x = x + 1
        } else {
            y += 1;
        }
        addBlinkingDatum(g, xScale(x), xScale(y), 3, event_colors["COVID-19"]);
    }

    if (source === "COVID-19") {
        let x = xScale(points[points.length - 1]["x"]);
        console.log(x)
        let y = bar_pos;
        makeBarChartAnnotation(x - margin.left, y);
    }
}

function makeBarChartTitleSection() {
    let margin = {top: 10, right: 10, bottom: 10, left: 10};
    let width = 190 - margin.left - margin.right,
        height = 170 - margin.top - margin.bottom;

    d3.select("#covid_div")
        .append("div")
        .classed("bar_chart_title", true)
        .attr("id", "bar_chart_title")
        .style("width", (width + margin.left + margin.right) + "px")
        .style("height", (height + margin.top + margin.bottom) + "px")

    let  g = d3.select("#bar_chart_title")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    g.append("text")
        .classed("title", true)
        .attr("y", 15)
        .attr("x", 5)
        .text("U.S. Mortality")
        .style("")

    g.append("text")
        .classed("sub_title", true)
        .attr("y", 40)
        .attr("x", 5)
        .text("Wars and COVID-19")
        .style("")

    g.append("text")
        .classed("last_update_text", true)
        .attr("y", 60)
        .attr("x", 5)
        .text("Last updated: " + last_update_date)
        .style("font-size", "small")
        // .style("font", "small")
        // .style("fill", "#c8c7c7")

    addBlinkingDatum(g, 7, 85, 3, event_colors["COVID-19"]);

    g.append("text")
        .classed("ongoing_text", true)
        .attr("y", 90)
        .attr("x", 15)
        .text("Ongoing")


}
function addBlinkingDatum(g, x, y, r, color) {
    let live_point = g.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", r - 0.3)
        .style("stroke", color)
        .style("stroke-width","1.5px")
        .attr("fill-opacity","0");
    repeat();

    function repeat() {
        live_point
            .style("opacity",1)
            .transition()
            .duration(1200)
            .style("opacity", 0.1)
            .transition()
            .duration(1200)
            .style("opacity", 1)
            .on("end", repeat);
    }
}

function makeBarChartAnnotation(x_pos, y_pos) {
    let margin = {top: 10, right: 10, bottom: 10, left: 10};
    let width = 170 - margin.left - margin.right,
        height = 60 - margin.top - margin.bottom;

    let equiv = (event_deaths['COVID-19'] / event_deaths['911']).toFixed(0);

    d3.select("#covid_div")
        .append("div")
        .attr("id", "covid_911_equiv_div")
        .style("position", "absolute")
        .style("top", y_pos + "px")
        .style("left", x_pos + "px")
        // .style("background-color", "white")
        .style("width", (width + margin.left + margin.right) + "px")
        .style("height", (height + margin.top + margin.bottom) + "px")

    let  g = d3.select("#covid_911_equiv_div")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    g.append("text")
        .classed("sub_title", true)
        .attr("y", 10)
        .attr("x", 0)
        .text("Equivalent of ")
        .style("font-size", "small")
        .append("tspan")
        .text(equiv)
        .style("font-size", "large")
        .style("fill", "#ff4646")
        .style("font-weight", "bold")
        .append("tspan")
        .text(" 9/11s")
        .style("font-size", "small")
        .style("fill", "white")
        .style("font-weight", "normal")

    const curve = d3.line().curve(d3.curveLinear);
    const coords = [[width / 2, 20], [width / 2, 40], [35, 50]]

    g.append('path')
        .attr('d', curve(coords))
        .attr('stroke', "#aeaeae")
        .attr('stroke-width', "2")
        .attr('fill', 'none');

}

draw_911_people();


d3.csv('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us.csv')
    .then(function(data) {
        console.log(data);
        event_deaths["COVID-19"] = data[data.length - 1]["deaths"]
        last_update_date = data[data.length - 1]["date"];

        draw_bar_plots();
        makeBarChartTitleSection();
    })

    // Load local copy if failed to download from NYTimes
    .catch(function(error){

        console.log(error);
        d3.csv('./data/us.csv')
            .then(function(data) {
                event_deaths["COVID-19"] = data[data.length - 1]["deaths"];
                last_update_date = data[data.length - 1]["date"];

                console.log(data);
                draw_bar_plots();
                makeBarChartTitleSection();
            })
            .catch(function(error){
                console.log(error);
            })
    })


// $(document).ready(function() {
//     let pad = 100
//     let main_div = $("#people_911_div");
//     let float_div = $("#scrolling_div");
//     console.log(float_div.scrollTop());
//     float_div.width(main_div.width() - pad*2);
//     float_div.css({left: pad});
//
//     main_div.click(function(){
//         console.log($("body").scrollTop() + " px");
//     });
//
//
//
//     $( window ).scroll(function() {
//         // console.log("floating: " + float_div.position().top + "scrolltop: " + $(window).scrollTop());
//
//         if ($(window).scrollTop() > 1000) {
//             if (float_div.position().top < 500) {
//                 float_div.animate({
//                     top: (main_div.height() - 200) + 'px'
//                 }, 1000, "linear")
//             }
//         };
//         if ($(window).scrollTop() < 800) {
//             if (float_div.position().top > 500) {
//                 float_div.animate({
//                     top: '300px'
//                 })
//             }
//         };
//
//     });
//
// });
