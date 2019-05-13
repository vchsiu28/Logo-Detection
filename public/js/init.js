var token = new URL(window.location.href).searchParams.get('token');
var headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
};
var imageResponse = { label: [''], logo: [''], web: [''] };
var postImageUrl = 'http://localhost:8888/predict/image';
var getHistUrl = 'http://localhost:8888/history/user/';
var postHistUrl = 'http://localhost:8888/history/user';
var verifyTokenUrl = 'http://localhost:8888/auth/index';

var margin = { top: 20, right: 50, bottom: 30, left: 150 };
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
var userLabel = [];
var userDay = [];
const labelCounts = Object.create(null);
const dayCounts = Object.create(null);
var labelD;
var dayD;

class HttpError extends Error {
    constructor(statusCode, ...args) {
        super(...args);
        this.statusCode = statusCode;
    }
}

const responseHandlerFactory = successCode => {
    return response => {
        const statusCode = response.status;
        if (statusCode === successCode) {
            return response.json();
        }
        throw new HttpError(statusCode, response.message);
    };
};

const verifyToken = () => {
    return fetch(verifyTokenUrl, { headers: headers }).then(
        responseHandlerFactory(200)
    );
};

const displayBody = () => {
    document.body.style.display = 'initial';
};

verifyToken()
    .then(() => {
        displayBody();
    })
    .catch(err => {
        console.log(err);
        if (err instanceof HttpError && err.statusCode === 403) {
            window.location = 'auth.html';
        } else {
            alert('Sorry, an unexpected error has occurred.');
        }
    });
