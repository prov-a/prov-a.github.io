

function displayAnalysis(){
    $("#filterTitle").select2({
        allowClear: true,
        data: projectData.data.map((item,index) => ({ id: index, text: `${item.title} [${item.author}]` })),
        placeholder: "Search Title",
        width: "100%",
        sorter: data => data.sort((a, b) => a.text.localeCompare(b.text))
    }).on('change', function (e) {
        d3.select("#timeline svg").remove();
        currentObjectID = parseInt($(this).val())
        objectData = projectData.data[currentObjectID]
        //first iteration GAPS
        sender = []
        events_to_add = []
        var activities_dataset = []
        for (let act_i = 0; act_i < objectData.provenanceData.length; act_i++) {
            act = objectData.provenanceData[act_i].data
            let act_label = ""
            let act_time = {"start":null, "end": null, "i_start": null, "i_end": null, "vague": false}
            if (act.activityTimeEDTF) {
                act_label = act_label + ", " + act.activityTimeEDTF
                parsedDate = parseEDTFDate(act.activityTimeEDTF)
                if (parsedDate.lowerLimit) {
                    act_time["start"] = parsedDate.lowerLimit
                }
                if (parsedDate.upperLimit) {
                    act_time["end"] = parsedDate.upperLimit
                }
            }
            else{
                act_label = "unkonwn date"
            }
            if (act.activityType) {
                act_label += ", " + act.activityType.split("__")[1]
            }
            else{
                act_label += ", unknown activity"
            }
            senders = []
            for (par of act.parties) {

            }
            activities_dataset.push({"label": act_label, "time": act_time})
        }

        function getNextEventDates(index, eventList) {
          dates = [];
          for (let i = index + 1; i < eventList.length; i++) {
            if (eventList[i].time.start) {
              dates.push(eventList[i].time.start);
            }
            if (eventList[i].time.end) {
              dates.push(eventList[i].time.end);
            }
          }
          if (eventList[index].time.start){
            dates = dates.filter(item => new Date(item) > new Date(eventList[index].time.start));
          }
          return dates.sort((a, b) => new Date(a) - new Date(b));
        }

        function getPreviousEventDates(index, eventList) {
          dates = [];
          for (let i = index - 1; i >= 0; i--) {
            if (eventList[i].time.start) {
              dates.push(eventList[i].time.start);
            }
            if (eventList[i].time.end) {
              dates.push(eventList[i].time.end);
            }
          }
          if (eventList[index].time.end){
            dates = dates.filter(item => new Date(item) < new Date(eventList[index].time.end));
          }
          return dates.sort((a, b) => new Date(b) - new Date(a));
        }

        for (let i = 0; i < activities_dataset.length; i++) {
          let nextDates = getNextEventDates(i, activities_dataset)
          let previousDates = getPreviousEventDates(i, activities_dataset)
          if (!activities_dataset[i].time.start){
            activities_dataset[i].time.i_start = previousDates[0]
          }
          if (!activities_dataset[i].time.end){
            activities_dataset[i].time.i_end = nextDates[0]
          }
        }
        for (act of activities_dataset){
            if (act.time.i_start){
                act.time.start = act.time.i_start
            }
            if (act.time.i_end){
                act.time.end = act.time.i_end
            }
        }

        data = []
        for (let act of activities_dataset) {
            data.push({start: new Date(act.time.start), end: new Date(act.time.end), label: act.label})
        }
    function drawChart(){
        // Remove existing SVG to redraw chart
        d3.select("#timeline svg").remove();

        // Define margins and container width
        const margin = { top: 20, right: 30, bottom: 30, left: 30 };
        const containerWidth = document.getElementById("timeline").offsetWidth;
        const width = containerWidth - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Group data by label
        const groupedData = d3.group(data, d => d.label);

        // Calculate the maximum width required by labels
        const maxLabelWidth = d3.max(data, d => {
            const labelWidth = d.label.length * 7; // Assuming average character width as 7 pixels
            return labelWidth
        });

        // Adjust the width of the chart to leave space for labels
        const widthWithLabels = width - maxLabelWidth - 20; // Adjust padding as needed

        // Define xScale with the updated range
        const xScale = d3.scaleTime()
            .domain([d3.min(data, d => d.start), d3.max(data, d => d.end)])
            .range([0, widthWithLabels]);

        // Define yScale
        const yScale = d3.scaleBand()
            .domain(Array.from(groupedData.keys()))
            .range([0, height])
            .padding(0.1);

        // Create SVG element
        const svg = d3.select("#timeline")
            .append("svg")
            .attr("width", containerWidth)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Draw error bars
        svg.selectAll("line.error-bar")
            .data(data)
            .enter()
            .append("line")
            .attr("x1", d => xScale(d.start))
            .attr("y1", d => yScale(d.label) + yScale.bandwidth() / 2)
            .attr("x2", d => xScale(d.end))
            .attr("y2", d => yScale(d.label) + yScale.bandwidth() / 2)
            .attr("class", "error-bar")
            .attr("stroke-width", 2)
            .attr("stroke", "black");

        // Draw error bar caps
        svg.selectAll("line.error-bar-caps-start")
            .data(data)
            .enter()
            .append("line")
            .attr("x1", d => xScale(d.start))
            .attr("y1", d => yScale(d.label) + yScale.bandwidth() / 2 - 5)
            .attr("x2", d => xScale(d.start))
            .attr("y2", d => yScale(d.label) + yScale.bandwidth() / 2 + 5)
            .attr("class", "error-bar-caps")
            .attr("stroke-width", 1)
            .attr("stroke", "black");

        svg.selectAll("line.error-bar-caps-end")
            .data(data)
            .enter()
            .append("line")
            .attr("x1", d => xScale(d.end))
            .attr("y1", d => yScale(d.label) + yScale.bandwidth() / 2 - 5)
            .attr("x2", d => xScale(d.end))
            .attr("y2", d => yScale(d.label) + yScale.bandwidth() / 2 + 5)
            .attr("class", "error-bar-caps")
            .attr("stroke-width", 1)
            .attr("stroke", "black");

        // Add x-axis
        const xAxis = d3.axisBottom(xScale);
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis);

        // Add labels
        svg.selectAll(".label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("x", d => xScale(d.end) + 5) // Position after the end of the line
            .attr("y", d => yScale(d.label) + yScale.bandwidth() / 2)
            .attr("dy", "0.35em")
            .text(d => d.label);

        // Define event handlers
        function handleMouseOver(d) {
            console.log("Mouseover event on", d.label);
        }

        function handleClick(d) {
            console.log("Click event on", d.label);
        }

        function handleScroll() {
            console.log("Scrolling...");
        }

        // Add event listeners
        svg.selectAll("rect, line.error-bar, line.error-bar-caps")
            .on("mouseover", handleMouseOver)
            .on("click", handleClick);
    }


        drawChart(); // Initially draw the chart

        // Redraw the chart when window is resized
        window.addEventListener('resize', drawChart);
    })
 }
