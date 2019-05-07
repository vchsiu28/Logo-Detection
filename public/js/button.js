document.getElementById('object-button').addEventListener('click', () => {
	const webNode = document.getElementById('web-result');
	webNode.style.display = 'none';
    const label = imageResponse.label;
    const resultNode = document.getElementById('result');
    if (label.length > 5 ){
        resultNode.textContent = imageResponse.label.slice(0,5);
    } 
    else if(label.length<0){
        resultNode.textContent = 'Sorry, we cannot identify the object.';
    }
    else {
        resultNode.textContent = imageResponse.label;
    }
	resultNode.style.display = 'block';
});

document.getElementById('logo-button').addEventListener('click', () => {
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
});

document.getElementById('web-button').addEventListener('click', () => {
    const web = imageResponse.web;
    const linkNode = document.getElementById('web-link');
    if (web.length < 6) {
        linkNode.href = imageResponse.web;
    } else if(web.length>6){
        linkNode.href = imageResponse.web.slice(0,5);
    } 
    else{
        linkNode.textContent = 'Sorry, we cannot find relevant websites.';
	}
	const webNode = document.getElementById('web-result');
	if (linkNode.href !== window.location.href) {
		webNode.style.display = 'block';
	}
	const resultNode = document.getElementById('result');
	resultNode.style.display = 'none';
});
