let com_dists;

d3.tsv('./data/comment_dist_wide_2019_12_2020_12_05.tsv')
    .then(function(data) {
        setupBigSubredditPlot(data);
        setupSwarmPlot(data);
        setupLikelihoodAndSubredditPlots(data);
        makeSubredditsLegend();

    })
    .catch(function(error){
        console.log(error);
    })

function makeSubredditsLegend() {
    let margin = {top: 10, right: 20, bottom: 0, left: 20}
    let width = 300 - margin.left - margin.right,
        height = 50 - margin.top - margin.bottom;

    let g = d3.selectAll(".legend_div_class")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,20)")

    let keys = {"Benfords Law": 0, "Reddit Comments": 120}

    let key_enter = g.selectAll(".g_keys")
        .data(d3.entries(keys))
        .enter()

    key_enter
        .append("g")
        .attr("class", "g_keys")
        .attr("transform", d => "translate(" + d.value + ",0)")
        .append("line").attr("x1",  0)
        .attr("y1", margin.top)
        .attr("x2",  d => 20)
        .attr("y2", margin.top)
        .attr("stroke-width", 7)
        .attr("stroke", d => color(d.key));

    key_enter
        .append("text")
        .attr("x",  d => d.value + 25)
        .attr("y", margin.top)
        .text(d => d.key)
        .style("dominant-baseline", "central")
        .style("text-anchor", "start");
}
function makeSwarmLegend(legend, pos_legend, color_scale) {
    let coords = {start: 0, end: 150, inst_x: 80, inst_y: 180}


    let legendScale = d3.scaleBand().domain(d3.range(-80, -20))
        .range([coords.start, coords.end]).padding(1);

    legend.selectAll("legend-bar")
        .data(d3.range(color_scale.domain()[0], color_scale.domain()[1] + 10, 5))
        .enter()
        .append("rect")
        .attr("class", "legend-bar")
        .attr("x", 1)
        .attr("transform", d => "translate(" + legendScale(d) + "," + 10 + ")")
        .attr("width", 10)
        .attr("height", 20)
        .style("fill", d => color_scale(d));

    legend.append("text")
        .text("Lower")
        .attr("x", coords.start)
        .attr("y", 42)
        .style("text-anchor", 'start');

    legend.append("text")
        .text("Higher")
        .attr("x", coords.end)
        .attr("y", 42)
        .style("text-anchor", 'end');

    legend.append("text")
        .attr("y", 45)
        .attr("x", coords.start)
        .selectAll("tspan")
        .data(['similarity to', "Benford's Law"])
        .enter()
        .append('tspan')
        .attr("x", ((coords.start+ coords.end) / 2))
        .attr("dy", 15)
        .text(d => d)
        .style("font-size", "14px")
        .style("text-anchor", 'middle');

    let instruct_text = legend.append("g")
        .attr("id", "instruct_g")
        .attr("transform", d => "translate(" + coords.inst_x + "," + coords.inst_y + ")")

    instruct_text.append('rect')
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 150)
        .attr("height", 50)
        .style("fill", "white");

    instruct_text.append("text")
        .selectAll(".instruct-text")
        .data(['Hover over points to', 'highlight subreddits'])
        .enter()
        .append("tspan")
        .attr("class", "instruct-text")
        .attr("x", 10)
        .attr("dy", 15)
        .text(d => d)
        .style("text-anchor", 'start');

}
let processed_data;
function setupSwarmPlot(data) {
    let top_reddits = ['funny', 'AskReddit', 'gaming', 'aww', 'Music', 'pics', 'science', 'worldnews',
        'videos', 'todayilearned', 'movies', 'news', 'ShowerThoughts', 'EarthPorn',
        'gifs', 'IAmA', 'food', 'askscience', 'jokes', 'explainlikeimfive', 'LifeProTips',
        'Art', 'books', 'mildlyinteresting', 'DIY', 'nottheonion', 'sports', 'space', 'gadgets',
        'Documentaries', 'GetMotivated', 'photoshopbattles', 'television', 'listentothis',
        'InternetIsBeautiful', 'philosophy', 'history', 'dataisbeautiful', 'Futurology', 'WritingPrompts',
        'OldSchoolCool']
    let slice = data.filter(arr => top_reddits.some(sub => arr['subreddit'] === sub));

    processed_data = slice.map(function(d){
        let list = []
        for (let i = 1; i < 10; i++) {
            let entry = {"x": +i, "y": +d[i], "likelihood": +d["log_likelihood"], "subreddit": d["subreddit"]}

            if (entry["likelihood"] <= -80) { entry["likelihood"] = -80; }

            list.push(entry);
        }
        return list;
    });

    processed_data = processed_data.flat();

    let margin = {top: 20, right: 50, bottom: 60, left: 55}
    let width = 650 - margin.left - margin.right,
        height = 430 - margin.top - margin.bottom;
    let pos_legend = {x1: (width - 200), x2: (width - 50)}

    let xScale = d3.scaleBand().domain([1, 2, 3, 4, 5, 6, 7, 8, 9])
        .range([0, width]).padding(0.4);
    let yScale = d3.scaleLinear().domain([0, 0.5])
        .range([height, 0]);

    let color = d3.scaleLinear().domain([-80, -30])
        .range(["#ffb600", "#ec0038"])


    let line = d3.line()
        .x((d, i) => xScale(i + 1) + (xScale.bandwidth() / 2))
        .y(d => yScale(d));

    let g = d3.select("#swarmplot-div")
        .attr("align", "center")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g.append("g")
        .attr("id", "swarm-x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("class", "yaxis.big")
        .attr("y", 10)
        .style("text-anchor", "middle")
        .style("font-size", "16px")

    d3.select("#swarm-x").append("text")
        .classed("axis-title", true)
        .attr("y", 47)
        .attr("x", ((width) / 2))
        .style("text-anchor", "middle")
        .style("font-size", "18px")
        .attr("fill", "black")
        .text("First Digit");

    let yax = g.append("g")
        .attr("transform", "translate(0,0)")
        .call(d3.axisLeft(yScale)
            .ticks(4)
            .tickSize(-(width)))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick:not(:first-of-type) line")
            .attr("stroke-opacity", 0.5)
            .attr("stroke-dasharray", "5,10"))
        .attr("color", "grey")

    yax.selectAll("text").style("font-size", "16px")


    yax.append("text")
        .classed("axis-title", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -((height) / 2))
        .style("text-anchor", "middle")
        .style("font-size", "18px")
        .attr("fill", "black")
        .text("Frequency");

    let legend = g.append("g")
        .attr("transform", "translate(" + pos_legend.x1 + ",10)")


    makeSwarmLegend(legend, pos_legend, color);

    let simulation = d3.forceSimulation(processed_data)
        .force("x", d3.forceX(d => xScale(d.x) + (xScale.bandwidth() / 2)
                            ).strength(d => -(30 / d.likelihood) * 0.4))
        .force("y", d3.forceY(d => yScale(d.y)))
        .force("collide", d3.forceCollide(3.5))
        .stop();

    for (let i = 0; i < 1000; ++i) simulation.tick();

    g.append("path")
        .datum(benford_prob)
        .classed("mini_benford_line", "true")
        .style("stroke", color("Benfords Law"))
        .attr("d", line);

    g.selectAll('circle')
        .data(processed_data)
        .enter()
        .append("circle")
        .on('mouseover',  function(d) {
            mouseOver(d3.select(this), d.subreddit)
        } )
        .on('mouseout', function(d) {
            mouseOut(d3.select(this), d.subreddit)
        } )
        .attr("class", d => d.subreddit)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 3)
        .attr("fill", d => color(d.likelihood));

    let tool_div = d3.select("#swarmplot-div").append("div")
        .attr("id", "tooltip")
        .attr("class", "tooltip")
        .style("font-size", "14px")
        .style("opacity", 0);

    function mouseOver(point, subreddit) {
        d3.selectAll("." + subreddit)
            .attr("r", 7)
            .attr("stroke", "black")
            .attr("stroke-width", 1.5);

        tool_div.html(subreddit)
            .style("opacity", 1)
            .style("left", (d3.event.pageX + 17) + "px")
            .style("top", (d3.event.pageY - 25) + "px");
    }

    function mouseOut(point, subreddit) {
        d3.selectAll("." + subreddit)
            .attr("r", 3)
            .attr("stroke-width", 0);

        tool_div.html(subreddit)
            .style("opacity", 0);
    }
}
function setupLikelihoodAndSubredditPlots(data) {
    let lls = [];
    data.forEach( (row, k) => lls.push(+row['log_likelihood']));
    let margin = {top: 20, right: 180, bottom: 60, left: 180}
    let width = 740 - margin.left - margin.right,
        height = 280 - margin.top - margin.bottom;

    let xScale = d3.scaleLinear().domain([d3.min(lls), d3.max(lls)])
        .range([0, width]);

    let yScale = d3.scaleLinear().domain([0, 300]).range([height, 0]);

    let hist_svg = d3.select("#likelihood-div")
        .attr("align", "center")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    drawHistogramPlotOverlays(hist_svg);

    hist_svg.append("g")
        .attr("id", "hist_x_axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "middle");

    hist_svg.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + width + ",0)")
        .call(d3.axisRight(yScale)
            .ticks(3))
        .call(g => g.select(".domain").remove())
        .selectAll("text")
        .style("text-anchor", "start");

    d3.select("#hist_x_axis").append("text")
        .classed("axis-title", true)
        .attr("y", 40)
        .attr("x", ((width) / 2))
        .style("text-anchor", "middle")
        .attr("fill", "black")
        .text("Log-Likelihood");

    let histogram = d3.histogram()
        .domain(xScale.domain())
        .thresholds(40);

    let bins = histogram(lls);
    let current_bin_selection;

    hist_svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("id", (d, i) => "bar" + i.toString())
        .on('mouseenter', function(d) {
            d3.select(this).style("stroke-width", "1px");
        })
        .on('mouseleave', function(d) {
            d3.select(this).style("stroke-width", "0px");
        })
        .on('mousedown', function(d) {
            current_bin_selection.style("fill", '#dfdfe3')
            current_bin_selection = d3.select(this);
            current_bin_selection.style("fill", color("Benfords Law"));
            let select_subs = data.filter(arr => d.some(val => +arr['log_likelihood'] === val));
            subredditPlottingManager(select_subs, d3.select("#subreddit-div"),n_cols=7);
        })
        .attr("class", "bar")
        .attr("x", 1)
        .attr("transform", d => "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")")
        .attr("width", d => xScale(d.x1) - xScale(d.x0) - 1.5)
        .attr("height", d => height - yScale(d.length));

    let starting_bin = bins.length - 2;
    current_bin_selection = hist_svg.select("#bar" + starting_bin.toString());
    current_bin_selection.style("fill", color("Benfords Law"))

    subredditPlottingManager(data.filter(arr => bins[starting_bin].some(val => +arr['log_likelihood'] === val)),
        d3.select("#subreddit-div"), 7);
}
function drawHistogramPlotOverlays(g_elem) {
    let text = ["Click the bars to", "show subreddits ", "within each bin"]
    g_elem.append("g")
        .attr("transform", "translate(" + (width + 30) + ",30)")
        .append("text")
        .selectAll("tspan")
        .data(text)
        .enter()
        .append("tspan")
        .text(d => d)
        .attr("x", 0)
        .attr("dy", 15)
        .style("text-anchor", "start");

    svg.append("svg:defs").append("svg:marker")
        .attr("id", "triangle")
        .attr("refX", 6)
        .attr("refY", 6)
        .attr("markerWidth", 30)
        .attr("markerHeight", 30)
        .attr("markerUnits","userSpaceOnUse")
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 0 0 12 6 0 12 3 6")
        .style("fill", "black");

    let line_coords = {"Lower" : 50, "Higher": 150}

    g_elem.append("line")
        .attr("x1",  line_coords["Lower"])
        .attr("y1", 25)
        .attr("x2", line_coords["Higher"])
        .attr("y2", 25)
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .attr("marker-end", "url(#triangle)");

    g_elem.append("g")
        .attr("transform", "translate(" + line_coords["Lower"] + ",-10)")
        .append("text")
        .selectAll(".arrow-text")
        .data(["More similar to", "Benford's Law"])
        .enter()
        .append("tspan")
        .attr("class", "arrow-text")
        .attr("x", 0)
        .attr("dy", 15)
        .text(d => d)
        .style("font-size", "14px")
        .style("text-anchor", "start");
}
function subredditPlottingManager(data, target_div, n_cols) {
    let n_rows = Math.ceil(data.length / n_cols)

    // let main_div = d3.select("#subreddit-div");
    target_div.selectAll("*").remove();

    let index = 0
    for (let r = 0; r < n_rows; r++) {
        let row_div = target_div.append("div")
            .classed("flex-container", true);
        for (let c = 0; c < n_cols; c++) {
            let cell_div = row_div.append("div");
            plotSingleSubreddit(data[index], cell_div);
            index = index + 1;
            if (index >= data.length) { break; }
        }
    }
}
function plotSingleSubreddit(data, cell_div) {
    let title = data['subreddit'];
    let freqs = []

    for (let num = 1; num < 10; num++) {
        freqs.push(+data[num]);
    }

    let margin = {top: 5, right: 5, bottom: 5, left: 5}
    let width = 105 - margin.left - margin.right,
        height = 105 - margin.top - margin.bottom;

    let xScale = d3.scaleBand().domain([1, 2, 3, 4, 5, 6, 7, 8, 9])
        .range([0, width]).padding(0.4);

    let yScale = d3.scaleLinear().domain([0, 0.4]).range([height, 0]);

    let line = d3.line()
        .x((d, i) => xScale(i + 1) + (xScale.bandwidth() / 2))
        .y(d => yScale(d));

    let g = cell_div.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)
            .tickSize(0))
        .call(g => g.select(".domain").remove())
        .selectAll("text").remove()
    // .style("text-anchor", "middle");

    g.append("g")
        .attr("transform", "translate(0,0)")
        .call(d3.axisLeft(yScale)
            .ticks(0))
        .call(g => g.select(".domain").remove())
        .selectAll("text")
        .style("text-anchor", "start");

    g.append("path")
        .datum(benford_prob)
        .classed("mini_benford_line", "true")
        .style("stroke", color("Benfords Law"))
        .attr("d", line);

    g.append("path")
        .datum(freqs)
        .classed("mini_data_line", "true")
        .attr("d", line)
        .style("stroke", d => color("Reddit Comments"))

    g.append("text")
        .attr("transform", "translate(" + (width / 2) + "," + (margin.top + 10) + ")")
        .text(title)
        .style("text-anchor", "middle")
        .style("font-size", "x-small");
}