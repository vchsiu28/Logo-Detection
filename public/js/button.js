/* Add event listener to the upload button so that the json response will be 
displayed below the button once resolved.
*/
const upload = () => {
    const reader = new FileReader();
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
                return postUserHist(searchResult);
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
    reader.readAsDataURL(image);
};

const displayObject = () => {
    const webNode = document.getElementById('web-result');
    webNode.style.display = 'none';
    const label = imageResponse.label;
    const resultNode = document.getElementById('result');
    if (label.length > 5) {
        resultNode.textContent = imageResponse.label.slice(0, 5);
    } else if (label.length < 0) {
        resultNode.textContent = 'Sorry, we cannot identify the object.';
    } else {
        resultNode.textContent = imageResponse.label;
    }
    resultNode.style.display = 'block';
};

const displayLogo = () => {
    const webNode = document.getElementById('web-result');
    webNode.style.display = 'none';
    const logo = imageResponse.logo;
    const resultNode = document.getElementById('result');
    if (logo.length > 0) {
        resultNode.textContent = imageResponse.logo[0];
    } else {
        resultNode.textContent = 'Sorry, we cannot identify the logo.';
    }
    resultNode.style.display = 'block';
};

const displayWeb = () => {
    const web = imageResponse.web;
    const linkNode = document.getElementById('web-link');
    if (web.length < 6) {
        linkNode.href = imageResponse.web;
    } else if (web.length > 6) {
        linkNode.href = imageResponse.web.slice(0, 5);
    } else {
        linkNode.textContent = 'Sorry, we cannot find relevant websites.';
    }
    const webNode = document.getElementById('web-result');
    if (linkNode.href !== window.location.href) {
        webNode.style.display = 'block';
    }
    const resultNode = document.getElementById('result');
    resultNode.style.display = 'none';
};

const signout = () => {
    token = undefined;
    headers = undefined;
    window.location = 'auth.html';
};
