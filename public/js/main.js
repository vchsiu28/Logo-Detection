var days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

const loadResponse = () => {
    document.getElementById('result').innerHTML = 'Fetching results...';
    if (imageResponse.logo.length == 0) {
        document.getElementById('result').textContent =
            'Sorry, we cannot identify the logo.';
    } else {
        document.getElementById('result').textContent = imageResponse.logo;
    }

    // return top 5 objects
    // if (imageResponse.label.length<6){
    //     document.getElementById('result').textContent = imageResponse.label;
    // }else{
    //     document.getElementById('result').textContent = imageResponse.label.slice(0,5);
    // }
};

const loadError = () => {
    const message = 'Sorry, an unexpected error has occurred.';
    document.getElementById('result').textContent = message;
};

const addUserHist = history => {
    userLabel.push(...history.searchResult.label);
    var date = new Date(history.time);
    userDay.push(date.getDay());
};

// const addUserHist = history => {
//     const itemNode = document.createElement('li');
//     const textNode = document.createTextNode(
//         JSON.stringify({
//             searchResult: history.searchResult,
//             time: history.time
//         })
//     );
//     itemNode.appendChild(textNode);
//     const historyList = document.getElementById('user-history');
//     const firstNode = historyList.firstChild;
//     historyList.insertBefore(itemNode, firstNode);
// };

const addPlot = data => {
    if (data.length > 0) {
        console.log(d3.max(d3.values(data)).value);
        console.log(data);
    }
    if (data.length === 0) {
        d3.select('#plotM').text('You have not searched anything.');
    } else {
        d3.select('#plotM').text('It seems you like to search for ...');
        data.sort(function(a, b) {
            return d3.descending(a.value, b.value);
        });

        var y = d3
            .scaleBand()
            .range([height, 0])
            .padding(0.1);

        var x = d3.scaleLinear().range([0, width]);

        var svg = d3
            .select('#userPage')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr(
                'transform',
                'translate(' + margin.left + ',' + margin.top + ')'
            );

        x.domain([0, d3.max(d3.values(data)).value]);
        y.domain(
            data.map(function(d) {
                return d.key;
            })
        );

        svg.selectAll('.chartbar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'chartbar')
            .attr('width', d => x(d.value))
            // function(d) { return x(d.value); }
            .attr('y', function(d) {
                return y(d.key);
            })
            .attr('height', y.bandwidth());

        svg.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x));

        svg.append('g').call(d3.axisLeft(y));
    }
};

const addPlotDay = data => {
    var svg = d3
        .select('#userPage')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var y = d3.scaleLinear().range([height, 0]);
    y.domain([0, 10]);

    var x = d3.scalePoint().range([0, width]).padding(0.5);
    x.domain(
        data.map(function(d) {
            return d.key;
        })
    );

    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

    svg.append('g').call(d3.axisLeft(y));
    // Add the line
    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#69b3a2')
        .attr('stroke-width', 1.5)
        .attr(
            'd',
            d3
                .line()
                .x(function(d) {
                    return x(d.key);
                })
                .y(function(d) {
                    return y(d.value);
                })
        );
    // Add the points
    svg.append('g')
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', function(d) {
            return x(d.key);
        })
        .attr('cy', function(d) {
            return y(d.value);
        })
        .attr('r', 5)
        .attr('fill', '#69b3a2');
};

const loadUserHist = () => {
    userLabel = [];
    userDay = [];
    labelCounts = Object.create(null);
    dayCounts = {
        Sunday: 0,
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0
    };
    getUserHist()
        .then(histories => {
            histories.forEach(history => {
                addUserHist(history);
            });
        })
        .then(history => {
            userLabel.forEach(btn => {
                labelCounts[btn] = labelCounts[btn] ? labelCounts[btn] + 1 : 1;
            });
            userDay.forEach(btn => {
                dayCounts[days[btn]] = dayCounts[days[btn]]
                    ? dayCounts[days[btn]] + 1
                    : 1;
            });

            labelD = d3.entries(labelCounts);
            dayD = d3.entries(dayCounts);
            addPlot(labelD);
            console.log(dayD);
            addPlotDay(dayD);
            // console.log(dayD);
        })
        .catch(err => {
            console.log(err);
            if (err instanceof HttpError && err.statusCode === 403) {
                window.location = 'auth.html';
            } else {
                loadError();
            }
        });
};

/* return is a Promise object which will be resolved to json response of the 
following format:
[
    {
        "searchResult": An object of format specified in getImageResponse
        "time": Date object
    }
]
*/
const getUserHist = () => {
    return fetch(getHistUrl, { headers: headers }).then(
        responseHandlerFactory(200)
    );
};

/* The following function communicate with the database in the fetch call and
hence might take a long time, so it would be better to update the front-end
history before calling fetch to save the record to the database, like the
place of addUserHist below.
*/
const postUserHist = searchResult => {
    const history = {
        searchResult: searchResult,
        time: Date()
    };
    addUserHist(history);
    return fetch(postHistUrl, {
        method: 'POST',
        body: JSON.stringify(history),
        headers: headers
    }).then(responseHandlerFactory(201));
};

/* Given the base64 encoded image, return a promise object which will resolve to 
json response in the following format:
{
    "label": [String],
    "logo": [String],
    "web": [String]
}
*/
const getImageResponse = imageByte => {
    return fetch(postImageUrl, {
        method: 'POST',
        body: JSON.stringify({ image: imageByte }),
        headers: headers
    }).then(responseHandlerFactory(200));
};

window.onload = () => {
    loadResponse();
    loadUserHist();
};
