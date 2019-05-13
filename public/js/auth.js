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
    const selector = `#${wrapperId} span.error`;
    const errorNode = document.querySelector(selector);
    errorNode.textContent = `* ${err.message}`;
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

const displaySignin = () => {
    const signinContent = document.getElementById('signin');
    const signinTab = document.getElementById('signin-tab');
    const signupContent = document.getElementById('signup');
    const signupTab = document.getElementById('signup-tab');
    signinContent.style.display = 'initial';
    signinTab.classList.add('active');
    signupContent.style.display = 'none';
    signupTab.classList.remove('active');
    document.title = 'Sign In';
};

const displaySignup = () => {
    const signinContent = document.getElementById('signin');
    const signinTab = document.getElementById('signin-tab');
    const signupContent = document.getElementById('signup');
    const signupTab = document.getElementById('signup-tab');
    signupContent.style.display = 'initial';
    signupTab.classList.add('active');
    signinContent.style.display = 'none';
    signinTab.classList.remove('active');
    document.title = 'Sign Up';
};

window.onload = () => {
    const signinContent = document.getElementById('signin');
    const signinTab = document.getElementById('signin-tab');
    signinContent.style.display = 'initial';
    signinTab.classList.add('active');
};
