document.getElementById('object-button').addEventListener('click', () =>{
	document.getElementById('result-json').innerHTML = object;
})

document.getElementById('logo-button').addEventListener('click', () =>{
	document.getElementById('result-json').innerHTML = logo;

})

document.getElementById('web-button').addEventListener('click', () =>{
	document.getElementById('result-json').innerHTML = web;
	document.getElementById('web-link').href = "https://n.nordstrommedia.com/id/sr2/201649ff-65e1-45b2-9ba3-b292a64b58cc.jpeg?crop=pad&pad_color=FFF&format=jpeg&trim=color&trimcolor=FFF&w=1660&h=1783";
})