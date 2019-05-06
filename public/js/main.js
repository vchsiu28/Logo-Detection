var imageResponse = { label: [''], logo: [''], web: [''] };
var postImageUrl = 'http://localhost:8888/predict/image';
var getHistUrl = 'http://localhost:8888/history/user/';
var postHistUrl = 'http://localhost:8888/history/user';

const loadResponse = () => {
    document.getElementById('result').innerHTML = 'Fetching results...';
    document.getElementById('result').textContent = imageResponse.label[0];
};

const addUserHist = history => {
    const itemNode = document.createElement('li');
    const textNode = document.createTextNode(
        JSON.stringify({
            searchResult: history.searchResult,
            time: history.time
        })
    );
    itemNode.appendChild(textNode);
    const historyList = document.getElementById('user-history');
    const firstNode = historyList.firstChild;
    historyList.insertBefore(itemNode, firstNode);
};

const loadUserHist = userId => {
    getUserHist(userId)
        .then(histories => {
            histories.forEach(history => {
                addUserHist(history);
            });
        })
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
        document.getElementById('result').innerHTML = 'Wait a minute...';
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
