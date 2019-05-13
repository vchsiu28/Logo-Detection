var imageResponse = { label: [''], logo: [''], web: [''] };
var postImageUrl = 'http://localhost:8888/predict/image';
var getHistUrl = 'http://localhost:8888/history/user/';
var postHistUrl = 'http://localhost:8888/history/user';

var margin = {top: 20, right: 50, bottom: 30, left: 150},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


const loadResponse = () => {
    document.getElementById('result').innerHTML = 'Fetching results...';
    if (imageResponse.logo.length==0){
        document.getElementById('result').textContent='Sorry, we cannot identify the logo.'
    }
    else{
        document.getElementById('result').textContent = imageResponse.logo;
    }

    // return top 5 objects
    // if (imageResponse.label.length<6){
    //     document.getElementById('result').textContent = imageResponse.label;
    // }else{
    //     document.getElementById('result').textContent = imageResponse.label.slice(0,5);
    // }
   
};

var userLabel = [];
var userDay = [];
const labelCounts = Object.create(null);
const dayCounts = Object.create(null);
var labelD;
var dayD;

const addUserHist = history => {
    userLabel.push(...history.searchResult.label)
    var date = new Date(history.time)
    userDay.push(date.getDay())
}

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

const addPlot = data =>{
    console.log(d3.max(d3.values(data)).value);
    if (data.length === 0) {
        d3.select("#userPage").append("h5").text("You have not searched anything.");
    } else {
        d3.select("#userPage").append("h5").text("It seems you like to search for ...");
        data.sort(function(a, b) {
          return d3.descending(a.value, b.value)
        })

        var y = d3.scaleBand()
              .range([height, 0])
              .padding(0.1);

        var x = d3.scaleLinear()
                  .range([0, width]);

        var svg = d3.select("#userPage").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

        x.domain([0,d3.max(d3.values(data)).value]);
        y.domain(data.map(function(d) { return d.key;}));

        svg.selectAll(".chartbar")
          .data(data)
          .enter().append("rect")
          .attr("class", "chartbar")
          .attr("width", d => x(d.value) )
          // function(d) { return x(d.value); }
          .attr("y", function(d) { return y(d.key); })
          .attr("height", y.bandwidth());

        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

        svg.append("g")
          .call(d3.axisLeft(y));
    }

    
}

const loadUserHist = userId => {
    userLabel = [];
    userDay = [];
    getUserHist(userId)
        .then(histories => {
            histories.forEach(history => {
                addUserHist(history);
            });
        })
        .then(history => {
            userLabel.forEach(btn => {
                labelCounts[btn] = labelCounts[btn] ? labelCounts[btn] + 1 : 1;
            })
            userDay.forEach(btn => {
                dayCounts[btn] = dayCounts[btn] ? dayCounts[btn] + 1 : 1;
            })

            labelD = d3.entries(labelCounts);
            dayD = d3.entries(dayCounts);
            addPlot(labelD);
            // console.log(labelD);
            // console.log(dayD);
            }
        )
        .catch(err => {
            // IMPORTANT!!! For debug only
            imageResponse = err.message;
            loadResponse();
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
const getUserHist = userId => {
    return fetch(getHistUrl + userId).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            response.json().then(errReponse => {
                throw new Error(errReponse.message);
            });
        }
    });
};

/* The following function communicate with the database in the fetch call and
hence might take a long time, so it would be better to update the front-end
history before calling fetch to save the record to the database, like the
place of addUserHist below.
*/
const postUserHist = (userId, searchResult) => {
    const history = {
        userId: userId,
        searchResult: searchResult,
        time: Date()
    };
    addUserHist(history);
    return fetch(postHistUrl, {
        method: 'POST',
        body: JSON.stringify(history),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status === 201) {
            return response.json();
        } else {
            response.json().then(errResponse => {
                throw new Error(errResponse.message);
            });
        }
    });
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
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            response.json().then(errResponse => {
                throw new Error(errReponse.message);
            });
        }
    });
};

/* Add event listener to the upload button so that the json response will be 
displayed below the button once resolved.
*/
const loadButton = () => {
    const reader = new FileReader();
    document.getElementById('upload-button').addEventListener('click', () => {
        document.getElementById('result').textContent = 'Wait a moment...';
        const image = document.getElementById('image').files[0];
        reader.onload = event => {
            const imageByte = event.target.result.split(',')[1];
            getImageResponse(imageByte)
                .then(searchResult => {
                    imageResponse = searchResult;
                    loadResponse();
                    return Promise.resolve(searchResult);
                })
                .then(searchResult => {
                    return postUserHist('Dummy', searchResult);
                })
                .catch(err => {
                    // IMPORTANT!!! For debug only
                    imageResponse = err.message;
                    loadResponse();
                });
        };
        reader.readAsDataURL(image);
    });
};

loadResponse();
loadButton();
loadUserHist('Dummy');
