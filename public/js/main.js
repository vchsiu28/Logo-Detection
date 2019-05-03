var imageResponse = '';
var postImageUri = 'http://localhost:8888/predict/image';

const loadResponse = () => {
    document.getElementById('result-json').textContent = imageResponse;
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
    return fetch(postImageUri, {
        method: 'POST',
        body: JSON.stringify({ image: imageByte }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json());
};

/* Add event listener to the upload button so that the json response will be 
displayed below the button once resolved.
*/
const loadButton = () => {
    const reader = new FileReader();
    document.getElementById('upload-button').addEventListener('click', () => {
        const image = document.getElementById('image').files[0];
        reader.onload = event => {
            const imageByte = event.target.result.split(',')[1];
            getImageResponse(imageByte)
                .then(response => {
                    imageResponse = JSON.stringify(response);
                    loadResponse();
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
