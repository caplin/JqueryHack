
document.addEventListener('DOMContentLoaded', init);

function init(){	
	var leftElement = document.getElementById('left');
	var forwardElement = document.getElementById('forward');
	var rightElement = document.getElementById('right');
	
	leftElement.addEventListener('click', sendControl.bind(null, 'left'));
	forwardElement.addEventListener('click', sendControl.bind(null, 'forward'));
	rightElement.addEventListener('click', sendControl.bind(null, 'right'));
};

function sendControl(direction){
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/control/' + direction);
	xhr.send();
}
