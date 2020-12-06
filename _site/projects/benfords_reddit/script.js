const timer = ms => new Promise(res => setTimeout(res, ms))
const base_delay = 2000;
let delay = base_delay / 3
const benford_prob = [0.301, 0.176, 0.125, 0.097, 0.079, 0.067, 0.058, 0.051, 0.046];
let comment_index = 0;
let progressBarScale;
let paused_delay = 0;
let commentInterval;
let data_sources = ['Star Distances', 'City Populations', 'Reddit Comments', "Benfords Law"]
let line = d3.line();
let lead_plot;
let svg;

let margin = {top: 20, right: 30, bottom: 60, left: 60}
let width = 400,
    height = 310;

let xScale;
let yScale;
let yScaleProb;


let color = d3.scaleOrdinal()
    .domain(data_sources)
    .range(['#06D6A0', '#FFD166', '#118AB2', '#EF476F']);

// Functions
function makeLegend() {
    let legend_elem, current_entries;
    let width, height;
    let entry_space = 20;

    let legend = function (g) {
        width = d3.max(current_entries.map(d => d.length)) * 10;
        height = current_entries.length * entry_space + 10;

        legend_elem = g.append('rect')
            .attr("id", "legend")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height)
            .style("fill", "white")

        g.selectAll(".legend_symbol")
            .data(current_entries)
            .enter()
            .append("circle")
            .attr("class", "legend_symbol")
            .attr("cx", 10)
            .attr("cy", (d, i) => 10 + i*entry_space)
            .attr("r", 5)
            .style("fill", d => color(d))

        g.selectAll(".legend_text")
            .data(current_entries)
            .enter()
            .append("text")
            .attr("class", "legend_text")
            .attr("x", 30)
            .attr("y", (d, i) => 10 + i*entry_space)
            .style("text-anchor", "start")
            .style("alignment-baseline", "central")
            .style("fill", "black")
            .style("font-size", "small")
            .text(d => d)

        return legend_elem;
    }

    legend.entries = function(entries_val) {
        if (!arguments.length)
            return current_entries;

        current_entries = entries_val;
        return legend;
    }
    return legend;
}
function updateYCountAxis() {
    yScale.domain([0, yScale.domain()[1] + 100]);
    ycount_axis.call(d3.axisRight(yScale)
        .ticks(0))
        .call(g => g.select(".domain").remove());
}
function mainLoop(comment_data, current_index) {
    comment_index = current_index;

    if (comment_index > 999) {
       clearInterval(commentInterval);
    } else {
        d3.select("#comment_div").style("height", "300px");
        d3.select("#comment_div").style("opacity", "1");

        if ((comment_index + 1) % 20 === 0 || comment_index === 0) {
            let comment = comment_data[comment_index.toString()]["comment"]
            if (comment.length > 400) {
                comment = comment.substring(0, 400) + "..."
            }
            d3.select(("#comment_number"))
                .text((comment_index + 1) + " of 1000");
            d3.select("#p_comment")
                .text(comment);
            d3.select("#username")
                .text(comment_data[comment_index.toString()]["user"] +
                    "      [  r/" + comment_data[comment_index.toString()]["subreddit"] + "  ]");
        }

        d3.select("#progress_bar")
            .attr("width", progressBarScale(comment_index));

        let arr = []
        for (let num = 1; num < 10; num++) {
            arr.push(+comment_data[comment_index][num]);
        }

        if (d3.max(arr) + 50 >= yScale.domain()[1]) {
            updateYCountAxis();
        }

        lead_plot.selectAll(".bar")
            .data(arr)
            .attr("class", "bar")
            .attr("y", d => yScale(d))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - margin.bottom - yScale(d))

        lead_plot.selectAll(".bar-text")
            .data(arr)
            .attr("y", d => yScale(d))
            .attr("dy", "-5px")
            .text(d => d)

        let sum = arr.reduce((a, b) => a + b, 0)
        let relative_arr = arr.map(x => x / sum)

        d3.select("#real_data_line")
            .datum(relative_arr)
            .attr("d", line)
            .style("stroke", d => color("Reddit Comments"))

        comment_index = comment_index + 1;
    }
}
function handleButtonResponse(button_key, button_text) {

    if (button_key === "Faster") {
        if (delay === 1000000000) {
        } else {
            delay = (delay > 50) ? delay / 2 : 50;

            clearInterval(commentInterval)
            commentInterval = setInterval(() => mainLoop(comment_data, comment_index), delay);
        }

    } else if (button_key === "Slower") {
        if (delay === 1000000000) {
        } else {
            delay = (delay < 10000) ? delay * 2 : 10000;
            clearInterval(commentInterval)
            commentInterval = setInterval(() => mainLoop(comment_data, comment_index), delay);
        }

    } else if (button_key === "Pause") {
        if (delay === 1000000000) {
            button_text.text("Pause");
            delay = paused_delay;
            clearInterval(commentInterval)
            commentInterval = setInterval(() => mainLoop(comment_data, comment_index), delay);
        } else {
            button_text.text("Resume");
            paused_delay = delay;
            clearInterval(commentInterval)
            delay = 1000000000;
        }
    }
}
function setupProgressBar() {
    let margin = {top: 12, right: 30, bottom: 20, left: 10}
    let width = 300 - margin.left - margin.right,
        height = 30 - margin.top - margin.bottom;
    let p_bar_margin = 1;
    let p_bar_height = 10;
    let num_comments = 1000;

    let g = d3.select("#comment_div")
        .append("div")
        .attr("align", "center")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.select("#comment_div")
        .append("p")
        .attr("id", "comment_number")
        .attr("class", "comment-number")
    // .attr("text-align", "right")

    d3.select("#comment_div")
        .append("p")
        .attr("id", "username")
        .attr("class", "user-name")

    d3.select("#comment_div")
        .append("p")
        .attr("id", "p_comment")
        .attr("class", "comment")

    progressBarScale = d3.scaleLinear().domain([0, num_comments]).range([0, width]);

    g.append("rect")
        .attr("x", progressBarScale(0))
        .attr("y", -10 - p_bar_margin)
        .attr("height", p_bar_height + 2 * p_bar_margin)
        .attr("width", progressBarScale(num_comments) + p_bar_margin)
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("fill", "white")

    g.append("rect")
        .attr("id", "progress_bar")
        .attr("x", progressBarScale(0))
        .attr("y", -10 )
        .attr("height", p_bar_height)
        .attr("width", progressBarScale(num_comments))
        .style("fill", "#d0d1d2");

    g.call(d3.axisTop(progressBarScale)
        .ticks(2)
        .tickSize(p_bar_height + p_bar_margin))
        .call(g => g.select(".domain").remove())
        .selectAll("text")
        .attr("y", 10)
        .attr("dy", 5)
        .style("text-anchor", "middle");
}



// Benford's intro and example plots
let star_pop_data;
d3.csv('./data/star_dist_pops_benfords.csv')
    .then(function(data) {
        star_pop_data = data;
        setupBenExampleBigPlot(data);
    })
    .catch(function(error){
        // handle error
    })

function makeCommentScrollingPlot() {
    let margin = {top: 20, right: 30, bottom: 60, left: 60}
    let width = 400,
        height = 310;

    svg = d3.select("#reddit-benford-div")
        .attr("align", "center")
        .append("svg")
        .attr("id", "reddit-benford-svg")
        .attr("width", width)
        .attr("height", height);

    xScale = d3.scaleBand().domain([1, 2, 3, 4, 5, 6, 7, 8, 9])
        .range([margin.left, width - margin.right]).padding(0.4);

    yScale = d3.scaleLinear().domain([0, 600]).range([height - margin.bottom, margin.top]);

    yScaleProb = d3.scaleLinear().domain([0, 0.4]).range([height - margin.bottom, margin.top]);

    lead_plot = svg.append("g")
        .attr("transform", "translate(0,0)");

    lead_plot.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + (height - margin.bottom )+ ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("y", 10)
        .style("text-anchor", "middle");

    let ycount_axis = lead_plot.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + (width - margin.right) + ",0)");


    lead_plot.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + margin.left + "," + "0)")
        .call(d3.axisLeft(yScaleProb)
            .tickSize(-(width - margin.right - margin.left))
            .ticks(5))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick:not(:first-of-type) line")
            .attr("stroke-opacity", 0.5)
            .attr("stroke-dasharray", "5,10"))
        .attr("color", "grey")
        .append("text")
        .classed("axis-title", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -35)
        .attr("x", -((height - margin.bottom + margin.top) / 2))
        .style("text-anchor", "middle")
        .attr("fill", "black")
        .text("Frequency");

    let button_data = {"Slower" : 3, "Pause": 5, "Faster": 7}

    let enterSelection = d3.select("#reddit-benford-svg").append("g")
        .attr("id", "controls_g")
        .attr("transform", "translate(0,"  + (height - 30) + ")")
        .selectAll('.button_g')
        .data(d3.entries(button_data))
        .enter()

    let button = {height: 20, width: 60}

    enterSelection.append("g")
        .attr("class", "button_g")
        .attr("transform", d => "translate(" + (xScale(d.value) - button.width / 2) + ',0)')
        .append("rect")
        .on('mouseenter', function(d) {
            d3.select(this)
                .style("fill", "ghostwhite").style("stroke-width", "1.75px");
        })
        .on('mouseleave', function(d) {
            d3.select(this)
                .style("fill", "ghostwhite").style("stroke-width", "1px");
        })
        .on('mousedown', function(d) {
            d3.select(this)
                .style("fill", "white").style("stroke-width", "2.25px");
            let button_text = d3.select(this.parentNode).select(".button_text");
            handleButtonResponse(d.key, button_text);
        })
        .on('mouseup', function(d) {
            d3.select(this)
                .style("fill", "ghostwhite").style("stroke-width", "1.75px");
        })
        .attr("x",  0)
        .attr("y",  0)
        .attr("width", button.width)
        .attr("height", button.height)
        .style("stroke", "black")
        .style("fill", "ghostwhite")

    d3.selectAll(".button_g")
        .append("text")
        .text(d => d.key)
        .attr("class", "button_text")
        .attr("x",  button.width / 2)
        .attr("y",  button.height / 2 + 5)
        .style("text-anchor", "middle")
        .style("fill", "black")
        .style("pointer-events", "none")
}

let comment_data;

d3.csv('./data/600_comments_2020_11_29.csv')
  .then(function(data) {
      makeCommentScrollingPlot();
      setupProgressBar();
      comment_data = data;

        let arr = []
        for (let num = 1; num < 10; num++) {
            arr.push(num);
        }

        line = d3.line()
          .x((d, i) => xScale(i + 1) + (xScale.bandwidth() / 2))
          .y(d => yScaleProb(d));

      lead_plot.selectAll(".bar")
            .data(arr)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x",  d => xScale(d))
            .attr("y",  d => yScale(d))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - margin.bottom - yScale(d))

      lead_plot.selectAll(".bar-text")
          .data(arr)
          .enter()
          .append("text")
          .attr("class", "bar-text")
          .style("text-anchor", "middle")
          .attr("x", d => xScale(d)  + (xScale.bandwidth() / 2))
          .attr("y",  d => yScale(d))
          .attr("dy", "-5px");

      lead_plot.append("path")
          .datum(benford_prob)
          .classed("benford_line", "true")
          .style("stroke", color("Benfords Law"))
          .attr("d", line);

      lead_plot.append("path")
          .classed("data_line", "true")
          .attr("id", "real_data_line")


      let legend_g = lead_plot.append("g")
          .attr("transform", "translate(" + (width - margin.right - 130) +  "," + (margin.top - 10) + ")")

      let new_legend = makeLegend()
          .entries(["Benfords Law", 'Reddit Comments'])

      legend_g.call(new_legend);


      // commentInterval = setInterval(() => myFunction(), delay);
      commentInterval = setInterval(() => mainLoop(comment_data, comment_index), delay);

      updateYCountAxis();

    })
  .catch(function(error){
     // handle error
  })

