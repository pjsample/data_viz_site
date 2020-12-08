---
layout: default
title: Benford's Reddit
description: Project page
---
<script src="https://d3js.org/d3.v5.js"></script>
<script src="script.js"></script>
<script src="subreddits.js"></script>
<script src="big_plot.js"></script>
<link rel="stylesheet" href="stylesheet.css">

<div class="main">
    <blockquote>
        On this page I talk about Benford's Law but I never actually explain what it is in detail. 
        I found this <a href="https://www.khanacademy.org/math/algebra-home/alg-exp-and-log/alg-logarithmic-scale/v/vi-and-sal-talk-about-the-mysteries-of-benford-s-law">video</a> 
        from the Khan Academy to be really informative, so maybe you will too.
        <br><br>
        The real purpose of this page is to, one, explore the possibility of finding Benford's Law in the numbers of Reddit comments
        and, two, find interesting ways to visualize the data. So it's a mix of data viz storytelling and data viz shop talk.
        You can find BigQuery code, Jupyter Notebooks, and D3 code on my Github.
        <br><br>
        The first section is intended to be a standalone figure -- briefly describe Benford's Law in as few words as possible,
        show two real-world examples to make the description tangible, and then provide the punchline from the analysis.
        When designing it, I had <a href="https://www.reddit.com/r/dataisbeautiful/">r/dataisbeautiful</a> in mind as a
        target audience and publication medium.
    </blockquote>
    <br><br>
    <div id="big_div" class="big_plot">
        <h3>Numbers in Reddit Comments Follow Benford's Law</h3>
            <div style="display: flex;">
                <div id="big_plot_text" style="width: 45%;">
                    <p>
                    <span style="color:#EF476F;font-weight:bold">Benford's Law </span> describes a natural phenomenon where the first digits (eg. the 3 from 300)
                    in a series of numbers follow a predictable, mathematically-defined pattern.
                    For example, you might expect that the first digits in <span style="color:#FFD166;font-weight:bold"> city populations </span> or the 
                    <span style="color:#06D6A0;font-weight:bold"> distances of stars from Earth </span> to be uniformly distributed between 1 to 9, but instead 1's
                    are represented ~30% of the time and each number progressively less up to 9 which is represented ~5% of the time.
                    <br>
                    After analyzing millions of randomly selected <span style="color:#118AB2;font-weight:bold">Reddit comments </span> in 2,500 subreddites, 
                    it's clear that the numbers within them often follow Benford's Law. The plots below show the 35 most 
                    Benford-like subreddits. Warning: some are NSFW!
                    </p>
                </div>
                <div id="ben_example_div" style="flex-grow: 1; margin-left: 40px; margin-top: 25px">
                </div>
            </div>
            <div id="subreddits_div" style="padding-top: 0px">
            <div style="display: flex; width: 90%; margin: auto;">
                <div style="width: 300px;"><h3 style="font-size: 16px;">The Top 35 Subreddits</h3></div>
                <div class="legend_div_class" align=right style="flex-grow: 1; margin-right: 10px;"></div>
            </div>
                <div id="good_subreddits_div" style="width: 90%; margin: auto;"></div>
            <!-- <h4>The Bottom 40</h4>
                <div id="bad_subreddits_div">
            </div> -->
            </div>
        </div>
    <div id="section_2_div" class="section_2" style="padding-top: 50px;">
       <h3>A little more information</h3>
        <p>
            I was curious as to whether the numbers in Reddit comments follow Benford's Law. To do this, I pulled out
            millions of random Reddit comments from December 2019 that contained at least one number, excluding
            comments that likely came from bots.
            I then counted the first digit from the numbers in the comments. For example,
            if the comment contained ...$950...2020...9000... I added two to the counts of 9s and one to the counts of 2s.
            The counts were then converted into frequencies.
            <br><br>
            There are a few different ways that you can measure the similarity between two different distributions.
            My goal was to simply rank the subreddits by their similarity to Benford's law. To do
            this, I calculated the
            multinomial log-likelihood of each subreddit's first digit frequency given the expected frequency
            of Benford's Law. Of the 2500 subreddits analysed here, it is surprising, to me at least, how commonly
            the trend occurs. Furthermore, after inspection of a few that do diverge, the comments are often
            dominated by bots. In the histogram below, I would argue that individual subreddits start lose their Benford-ness
            at a log-likelihood of -60 and below.
            <br><br>
            Click on the left-most bar to see subreddits with wildly different distributions.
            Warning though, many of these are NSFW subreddits where people ask others to rate physical
            traits! I imagine that in some of these subreddits the abundance of 1's are actually 10's. It's also
            interesting to compare the "Rateme" and "truerateme" subreddits. The "Rateme" subreddit trends upward
            from 4 to 9, and again I assume that many of the 1's are actually 10's. The "truerateme", on the other
            hand, is approximately normally distributed, peaking at 5. I guess people really are more honest when
            asked for their "true" opinion.
            <br><br>
            I like this plot for a few reasons. First, it shows just how many of the 2,500 subreddits follow
            Benford's Law. Sure, some of them are a little wonky / noisy, but the trend is still there. Second, it's fun
            to click on the histogram bars and explore the subreddits that fall into each bin. For example, it's mildly 
            interesting that r/mildlyinteresting is so Benford-like. And third, I just think 
            that the histogram followed by the line charts look nice. :]
        </p>
        <br>
        <div id="likelihood-div"> </div>
        <div class="legend_div_class" align="right" style="padding-top: 10px;"></div>
        <div id="subreddit-div" style="padding-top: 10px;"></div>
        <div>
        </div>
        <br>
        <br>
            <div id="subplot-div">
                <h3>Another way to show this data</h3>
                <p>
                    Here are the top 45 subreddits in terms of number of subscribers. In general, the distribution of
                    leading digits for individual subreddits approximate the trend of Benford's Law, but there are a few
                    notable exceptions. One of these is r/history; given the topic, consider the kinds of numbers that
                    you might expect to see in the comment section of this subreddit. Now see if you can find it by
                    hovering over the points below.
                    <br><br>
                    The goal here was to show the distribution of first digit frequencies using multiple subreddits
                    in the same plot. One downside is that you can't follow the trends of individual subreddits by simply
                    looking at the plot. Instead, I encourage the reader to hover over points to highlight them on-by-one.
                    In the end, I think that it's kind of fun and still informative. I also usually prefer swarmplots
                    over boxplots for their ability to show nuances of distributions more clearly. Side note: 2 is the most
                    divergent first digit which I expect is the result of comments containing the years 2000+, but I didn't look into it.
                </p>
                <div id="swarmplot-div"> </div>
                <br><br>
            </div>
            <div>
                <h3 align="left">Animation?</h3>
                <p>
                ¯\_(ツ)_/¯ <br>
                    This plot was my first idea about how to show Benford's Law in reddit comments in an interesting way.
                    I wanted to pull in some of the "Reddit experience" &trade;<sup>.com</sup> by showing actual comments
                    and how, by sampling hundreds of them at random, the expected first digit distribution of Benford's Law emerges.
                    Maybe it's cool? Ultimately, though, I think that it turned out to be underwhelming and lacking of 
                    any real substance.
                </p>
            </div>
            <div style="display: flex;">
                <div id="reddit-benford-div" style="width: 50%;">
                </div>
                <div id="comment_div" class="comment" style="flex-grow: 1; margin-left: 40px;">
                </div>
            </div>
            <div id="intro-bens-div"></div>
        </div>
</div>