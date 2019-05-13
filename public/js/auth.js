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

const displayError = err => {
    const selector = 'main > .form-error span.error';
    const errorNode = document.querySelector(selector);
    errorNode.textContent = `* ${err.message}`;
};

const postSignup = inputs => {
    return fetch(postSignupUrl, {
        method: 'POST',
        body: JSON.stringify(inputs),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(responseHandlerFactory(201));
};

const postSignin = inputs => {
    return fetch(postSigninUrl, {
        method: 'POST',
        body: JSON.stringify(inputs),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(responseHandlerFactory(201));
};

const signup = () => {
    const inputs = getInputs('signup');
    postSignup(inputs)
        .then(user => {
            console.log(user);
        })
        .catch(err => {
            displayError(err);
        });
};

const signin = () => {
    const inputs = getInputs('signin');
    postSignin(inputs)
        .then(token => {
            window.location = `demo.html?token=${token.token}`;
        })
        .catch(err => {
            console.log(err);
            displayError(err);
        });
};

const displaySignin = () => {
    const signinContent = document.getElementById('signin');
    const signinTab = document.getElementById('signin-tab');
    const signupContent = document.getElementById('signup');
    const signupTab = document.getElementById('signup-tab');
    const errorNode = document.querySelector('main > .form-error span.error');
    document.title = 'Sign In';
    signinContent.style.display = 'initial';
    signinTab.classList.add('active');
    signupContent.style.display = 'none';
    signupTab.classList.remove('active');
    errorNode.textContent = '';
};

const displaySignup = () => {
    const signinContent = document.getElementById('signin');
    const signinTab = document.getElementById('signin-tab');
    const signupContent = document.getElementById('signup');
    const signupTab = document.getElementById('signup-tab');
    const errorNode = document.querySelector('main > .form-error span.error');
    document.title = 'Sign Up';
    signupContent.style.display = 'initial';
    signupTab.classList.add('active');
    signinContent.style.display = 'none';
    signinTab.classList.remove('active');
    errorNode.textContent = '';
};

window.onload = () => {
    const signinContent = document.getElementById('signin');
    const signinTab = document.getElementById('signin-tab');
    signinContent.style.display = 'initial';
    signinTab.classList.add('active');
};
