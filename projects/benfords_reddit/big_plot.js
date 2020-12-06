function setupBenExampleBigPlot(star_pop_data) {
    let subplot_margin = {top: 20, right: 30, bottom: 60, left: 60}
    let plot_width = 400,
        plot_height = 300;

    let grouped = d3.nest()
        .key(function(d) { return d.dataset; })
        .entries(star_pop_data);

    let intro_plot = d3.select("#ben_example_div")
        .attr("align", "left")
        .append("svg")
        .attr("id", "intro-bens-svg")
        .attr("width", plot_width)
        .attr("height", plot_height);

    let xScaleSub = d3.scaleBand().domain([1, 2, 3, 4, 5, 6, 7, 8, 9])
        .range([subplot_margin.left, plot_width - subplot_margin.right]).padding(0.4);

    let yScaleProbSub = d3.scaleLinear().domain([0, 0.4])
        .range([(plot_height - subplot_margin.bottom), subplot_margin.top]);

    let g = intro_plot.append("g")
        .attr('transform', "translate(0,0)")

    g.append("g")
        .attr("id", "example-x-ax")
        .attr("transform", "translate(" + 0 + "," + (plot_height - subplot_margin.bottom) + ")")
        .call(d3.axisBottom(xScaleSub))
        .selectAll("text")
        .attr("y", 10)
        .style("text-anchor", "middle");

    d3.select("#example-x-ax").append("text")
        .classed("axis-title", true)
        // .attr("transform", "rotate(-90)")
        .attr("y", 40)
        .attr("x", ((plot_width - subplot_margin.right + subplot_margin.left) / 2))
        .style("text-anchor", "middle")
        .attr("fill", "black")
        .text("First Digit");

    let yax = g.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + subplot_margin.left + "," + "0)")
        .call(d3.axisLeft(yScaleProbSub)
            .tickSize(-(plot_width - subplot_margin.right - subplot_margin.left))
            .ticks(3))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick:not(:first-of-type) line")
            .attr("stroke-opacity", 0.5)
            .attr("stroke-dasharray", "5,10"))
        .attr("color", "grey")

    yax.append("text")
        .classed("axis-title", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -35)
        .attr("x", -((plot_height - subplot_margin.bottom + subplot_margin.top) / 2))
        .style("text-anchor", "middle")
        .attr("fill", "black")
        .text("Frequency");

    let line = d3.line()
        .x(d => xScaleSub(+d.num) + xScaleSub.bandwidth() / 2)
        .y(d =>  yScaleProbSub(+d.freq));

    g.append("g")
        .attr("transform", "translate(0,0)")
        .selectAll(".generic_line")
        .data(grouped).enter()
        .append("path")
        .classed("generic_line", "true")
        .attr("stroke", d => color(d.key) )
        // .attr("fill", "none" )
        .attr("d", d => line(d.values))


    let legend_g = intro_plot.append("g")
        .attr("transform", "translate(" + (plot_width - subplot_margin.right - 130) +  "," + (subplot_margin.top + 30) + ")")

    let new_legend = makeLegend()
        .entries(grouped.map(d => d.key))

    legend_g.call(new_legend)
}
function setupBigSubredditPlot(data) {
    let lls = [];
    data.forEach( (row, k) => lls.push(+row['log_likelihood']));
    subredditPlottingManager(data.slice(0, 35), d3.select("#good_subreddits_div"), 7);
    // subredditPlottingManager(data.slice(-40, -1), d3.select("#bad_subreddits_div"), 10);

}