import * as d3 from 'd3';
import React, { useState, useEffect } from 'react';

export const Viewers_List = () => {
	
	// seeder data
	const [w, setW] = useState(600);
	const [h, setH] = useState(450);
	const [data, setData] = useState([
		{ name: 'jan', value: 120 },
		{ name: 'feb', value: 50 },
		{ name: 'mar', value: 30 },
		{ name: 'apr', value: 25 },
		{ name: 'dec', value: 20 }
	]);
	const [sum, setSum] = useState(0);
	useEffect(() => {
		if (data) {
			let total = 0
      
			data.forEach((record) => {
				total += record.value
			})
			setSum(total)
		}
	}, [data]);
	const BarGraph = () => {
		const margin = { top: 20, right: 0, bottom: 60, left: 60 };

		const xscale = d3.scaleBand()
			.domain(data.map(d => d.name))
			.range([margin.left, w - margin.right])
			.padding(0.1);

		let arr = data.map((d) => { return d.value });
		let maximum = d3.max(arr);

		const yscale = d3.scaleLinear()
			.domain([0, maximum ? maximum : 7]).nice()
			.range([h - margin.bottom, margin.top]);

		const svg = d3.select("#bar-chart")
			.append("svg")
			.attr("width", w)
			.attr("height", h)
			.style("margin-left", 100);

		const bar = svg.append("g")
			.attr("fill", "steelblue")
			.selectAll("rect")
			.data(data)
			.join("rect")
			.style("mix-blend-mode", "multiply")
			// (i * (w - margin.right - margin.left) / data.length) + margin.left
			.attr("x", (d, i) => d.name ? xscale(d.name) : (i * (w - margin.right - margin.left) / data.length) + margin.left)
			.attr("y", d => yscale(d.value))
			.attr("width", xscale.bandwidth())
			.attr("height", d => yscale(0) - yscale(d.value));

		const qtyLabel = svg.selectAll('.qtyLabel').data(data);
		qtyLabel.enter()
			.append("text")
			.attr("class", "qtyLabel")
			.style('font-size', 13)
			.style("font-weight", 300)
			.attr("text-anchor", "end")
			.attr('x', (d, i) => xscale(d.name) + (xscale.bandwidth() / 2))
			.attr('y', (d, i) => yscale(d.value) - 7)
			.text(d => d.value);

		svg.append("text")
			.attr("class", "x label")
			.attr("text-anchor", "end")
			.style('font-size', 13)
			.attr("x", w - (w/2) + 10)
			.attr("y", h - 6)
			.text("Months");

		svg.append("text")
			.attr("class", "y label")
			.attr("text-anchor", "end")
			.attr('x', (-h/2) + 20)
			.attr("dy", ".75em")
			.attr("transform", "rotate(-90)")
			.text("sales");


		const x_axis = g => g
			.attr("transform", `translate(0, ${h - margin.bottom})`)
			.style('font-size', 13)
			.call(d3.axisBottom(xscale));

		const gx = svg.append("g")
			.call(x_axis);

		const y_axis = g => g
			.attr("transform", `translate(${margin.left}, 0)`)
			.style("font-size", 13)
			.call(d3.axisLeft(yscale)
				.ticks(4));


		const gy = svg.append("g")
			.call(y_axis);

	}
	
	useEffect(() => {
		d3.selectAll('svg').remove();
		BarGraph()
		PieChart()
		LineGraph()
	}, [data, sum]);



	
	const PieChart = () => {
		const radius = Math.min(w, h) / 2 - 40

		const svg = d3.select("#pie-chart")
			.append("svg")
			.attr("width", w)
			.attr("height", h)
			.append("g")
			.attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

		const color = d3.scaleOrdinal()
			.domain(data.map(d => d.name))
			.range(["#d590ee", "#90EE90", "#afeeee", "#ffd700", "#00bfff"])

		const pie = d3.pie()
			.value(d => {return d.value;});
		const data_ready = pie(data)

		const arc = d3.arc()
			.innerRadius(0)
			.outerRadius(radius * 0.8)

		svg
			.selectAll('sports')
			.data(data_ready)
			.enter()
			.append('path')
			.attr('d', arc)
			.attr('fill', function (d) { return (color(d.data.name)) })
			.attr("stroke", "black")
			.style("stroke-width", "2px")
			.style("opacity", 0.7);

		const outerArc = d3.arc()
			.innerRadius(radius * 0.9)
			.outerRadius(radius * 0.9)
		
		// Add the polylines between chart and labels:
		svg
			.selectAll('allPolylines')
			.data(data_ready)
			.enter()
			.append('polyline')
			.attr("stroke", "black")
			.style("fill", "none")
			.attr("stroke-width", 1)
			.attr('points', function (d) {
				let posA = arc.centroid(d) // line insertion in the slice
				let posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
				posA = [(posA[0] + posB[0]) / 2, (posA[1] + posB[1]) / 2]
				let posC = outerArc.centroid(d); // Label position = almost the same as posB
				let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
				posC[0] = radius  * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
				return [posA, posB, posC]
			})

		// Add the labels:
		svg
			.selectAll('allLabels')
			.data(data_ready)
			.enter()
			.append('text')
			.text(function (d) { return d.data.name + ' : ' + ((d.data.value / sum) * 100).toFixed(2) + '%' })
			.attr('transform', function (d) {
				let pos = outerArc.centroid(d);
				let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
				pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
				return 'translate(' + pos + ')';
			})
			.style('text-anchor', function (d) {
				let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
				return (midangle < Math.PI ? 'start' : 'end')
			})
			.style('font-size', 13)

			svg
				.selectAll('percentages')
				.data(data_ready)
				.enter()
				.append('text')
				.text(function (d) { return ((d.data.value / sum) * 100).toFixed(2) + '%' })
				.attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
				.style("text-anchor", "middle")
				.style("font-size", 13)

		
	}

	const LineGraph = () => {
		// seeder data
		const data2 = [
			{key: 'joe', stats: [
				{ month: 0, value: 120 },
				{ month: 1, value: 50 },
				{ month: 2, value: 30 },
				{ month: 3, value: 25 },
				{ month: 4, value: 27 }]},
			{key: 'kevin', stats: [
				{ month: 0, value: 100 },
				{ month: 1, value: 55 },
				{ month: 2, value: 47 },
				{ month: 3, value: 15 },
				{ month: 4, value: 20 }]},
			{key: 'jenny', stats: [
				{ month: 0, value: 40 },
				{ month: 1, value: 50 },
				{ month: 2, value: 60 },
				{ month: 3, value: 70 },
				{ month: 4, value: 80 }]}
			]

		// set the dimensions and margins of the graph
		const margin = { top: 10, right: 80, bottom: 30, left: 60 },
			width = 560 - margin.left - margin.right,
			height = 400 - margin.top - margin.bottom;

		// append the svg object to the body of the page
		var svg = d3.select("#line-chart")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform",
				"translate(" + margin.left + "," + margin.top + ")");

		//Read the data

		// Add X axis --> it is a date format
		var x = d3.scaleLinear()
			.domain([d3.min(data2, function (d) { return d3.min(d.stats, function (t) { return t.month }); }), d3.max(data2, function (d) { return d3.max(d.stats, function (t) { return t.month }); })])
			.range([0, width]);
		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x).ticks(5));

		// Add Y axis
		var y = d3.scaleLinear()
			.domain([0, d3.max(data2, function (d) { return d3.max(d.stats, function (t) { return t.value }); })])
			.range([height, 0]);
		svg.append("g")
			.call(d3.axisLeft(y));

		// color palette
		var res = data2.map(function (d) { return d.key }) // list of group names
		var color = d3.scaleOrdinal()
			.domain(res)
			.range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])

		// Draw the line
		const path = svg.selectAll(".line")
			.data(data2)
			.enter()
			.append("path")
			.attr("fill", "none")
			.attr("stroke", function (d) { return color(d.key) })
			.attr("stroke-width", 1.5)
			.attr("d", function (d) {
				return d3.line()
					.x(function (t) { return x(t.month); })
					.y(function (t) { return y(t.value); })
					(d.stats)
			});

		svg
			.selectAll('labels')
			.data(data2)
			.enter()
			.append('text')
			.attr("text-anchor", "end")
			.text(function (d) { return d.key })
			.style('fill', function (d) { return color(d.key) })
			.attr("transform", function (d, i) {
				return 'translate(' + (width + margin.right) + ',' + ((height * 0.15) + (20 * i)) + ')' // position is hardcoded
			});



	}
	

	return (
		<div className='min-h-screen h-full w-full p-6 bg-gray-100'>
			<div id='bar-chart'></div>
			<div id='pie-chart'></div>
			<div id='line-chart'></div>
		</div>
	);
};