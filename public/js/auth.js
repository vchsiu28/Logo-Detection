var postSignupUrl = 'http://localhost:8888/auth/signup';
var postSigninUrl = 'http://localhost:8888/auth/signin';

const getInputs = wrapperId => {
    const selector = `#${wrapperId} input`;
    const inputNodes = document.querySelectorAll(selector);
    const inputs = {};
    for (let node of inputNodes) {
        const { name: name, value: value } = node;
        inputs[name] = value;
    }
    return inputs;
};

const displayError = (wrapperId, err) => {
    const selector = `#${wrapperId} p.error`;
    const errorNode = document.querySelector(selector);
    errorNode.textContent = err;
};

const postSignup = inputs => {
    let statusCode;
    return fetch(postSignupUrl, {
        method: 'POST',
        body: JSON.stringify(inputs),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            statusCode = response.status;
            return response.json();
        })
        .then(response => {
            if (statusCode !== 201) {
                throw new Error(response.message);
            }
            return Promise.resolve(response);
        });
};

const postSignin = inputs => {
    let statusCode;
    return fetch(postSigninUrl, {
        method: 'POST',
        body: JSON.stringify(inputs),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            statusCode = response.status;
            return response.json();
        })
        .then(response => {
            if (statusCode !== 200) {
                throw new Error(response.message);
            }
            return Promise.resolve(response);
        });
};

const signup = () => {
    const inputs = getInputs('signup');
    postSignup(inputs)
        .then(user => {
            console.log(user);
        })
        .catch(err => {
            displayError('signup', err);
        });
};

const signin = () => {
    const inputs = getInputs('signin');
    postSignin(inputs)
        .then(token => {
            window.location = `demo.html?token=${token.token}`;
        })
        .catch(err => {
            displayError('signin', err);
        });
};
