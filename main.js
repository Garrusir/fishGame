const HEIGHT = 400;
const WIDTH = 800;
let game = {
	screenWidth: WIDTH,
	screenHeight: HEIGHT,
	fps: 60,
	currentUsername: 'user',
	userScore: 0,
	time: 10
};

// let gameBlock = document.createElement("div");
// 	gameBlock.className = "game-block ";
// 	gameBlock.style.width = WIDTH + "px";
// 	gameBlock.style.height = HIGHT + "px";
// 	game.appendChild(gameBlock);

 game.main = function(){
 	game.createUserbar();
	let fishArr = init(5);
	let fish;
	document.getElementById('gameBlock').classList.add('game');
	function circle(arr){
		for (let i = 0; i < arr.length; i++) {
			fish = arr[i];
			fish.render();
			fish.ai();
			fish.move();
		}
		 // let req = requestAnimationFrame(circle(fishArr));
	}

	let time = setInterval(function(){
		document.getElementById('timer').innerHTML = game.time--;
		if (game.time < 0) {
			clearInterval(time);
			document.getElementById('gameBlock').classList.remove('game');
			game.stop();
		}
	}, 1000);
	
	setInterval(function(){
		circle(fishArr)
	}, 1000/game.fps);
	// circle(fishArr);

	// console.log(a.el.offsetWidth); 
}
game.createBox = function(){
	let gameBlock = document.createElement("div");
	gameBlock.className = "game-block ";
	gameBlock.id = 'gameBlock';
	// console.log(this.screenWidth, this.screenHeight);
	gameBlock.style.width = this.screenWidth + "px";
	gameBlock.style.height = this.screenHeight + "px";
	// gameBlock.onkeydown = function(e){
	// 	console.log(e);
	// }
	document.getElementById('game').appendChild(gameBlock);
	this.box = gameBlock;
}

game.createUserbar = function(){
	let userBar = document.createElement('div');
	userBar.className = 'userBar';
	userBar.style.width = WIDTH+ 'px';
	let userName = document.createElement('span');
	userName.id = 'userName';
	userName.innerHTML = game.currentUsername;

	let userScore = document.createElement('span');
	userScore.id = 'userScore';

	let userScoreTitle = document.createElement('span');
	userScoreTitle.innerHTML = 'Счет:';

	let userScoreValue = document.createElement('span');
	userScoreValue.id = 'score';
	userScoreValue.innerHTML = '0';

	let userTimer = document.createElement('span');
	userTimer.id = 'userTimer';

	let userTimerTitle = document.createElement('span');
	userTimerTitle.innerHTML = 'Времени осталось: ';

	let userTimerValue = document.createElement('span');
	userTimerValue.id = 'timer';
	userTimerValue.innerHTML = game.time;


	userTimer.appendChild(userTimerTitle);
	userTimer.appendChild(userTimerValue);
	userScore.appendChild(userScoreTitle);
	userScore.appendChild(userScoreValue);
	userBar.appendChild(userName);
	userBar.appendChild(userScore);
	userBar.appendChild(userTimer);

	document.getElementById('game').appendChild(userBar);

}

game.login = function login(){

	let loginBlock = document.createElement("div");
	loginBlock.className = "login-block";

	let loginTitle = document.createElement("h2");
	loginTitle.className = "login-title";
	loginTitle.innerHTML = "Введие имя";

	let loginInput = document.createElement("input");
	loginInput.className = "login-input";
	loginInput.setAttribute("type", "text");
	loginInput.required = true;

	let loginMessage = document.createElement("span");
	loginMessage.className = "login-message";

	let loginBtn = document.createElement("input");
	loginBtn.setAttribute("type", "submit");
	loginBtn.className = "play-btn";
	loginBtn.setAttribute("value", "Играть");
	loginBtn.onclick = function(){
		if (loginInput.value === '') loginMessage.innerHTML = "Необходимо ввести имя";
		else {
			game.currentUsername = loginInput.value;
			game.box.removeChild(game.loginBlockEl);
			game.main();
		}
		
	}
	
	loginBlock.appendChild(loginTitle);
	loginBlock.appendChild(loginInput);
	loginBlock.appendChild(loginBtn);
	loginBlock.appendChild(loginMessage);
	this.loginBlockEl = loginBlock;
	// gameBlock.appendChild(loginBlock);
	this.box.appendChild(this.loginBlockEl);
}

function rand(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
  }

function init(count_fish){
	let fishArr = [];
	let x = 0;
	let y = 0;
	let speed = 1;
	let way = 1;
	let type = 0;
	for (let i = 0; i < count_fish; i++){
		x = rand(-200, WIDTH);
		y = rand(0, HEIGHT-200);
		speed = rand(1, 5);
		way = rand(0,1);
		type = rand(0,2);
		let fish = new Fish(x,y, speed, way, type);
		fish.createEl();
		fishArr.push(fish); 
	}
	return fishArr;
}

game.stop = function(){
	let resultTable;
	if (localStorage.getItem('result') ){
		console.log(1);
	 resultTable = JSON.parse(localStorage.getItem('result'));
	} else {
		console.log(2);
	 resultTable = {};
	}
	let name = game.currentUsername;
	let score = game.userScore;
	resultTable[name] = score;
	localStorage.setItem('result', JSON.stringify(resultTable));
	
	let array = [];
	for (el in resultTable) {
		array.push({
			'username': el,
			'score': resultTable[el] 
			});
	}

	array.sort(function(a,b){
		return a[score] < b[score] ? 1 : -1;
	});

	console.log(resultTable);
	let gameBox = document.getElementById('gameBlock');
	gameBox.innerHTML = '';
	gameBox.classList.add('result-screen');
	document.getElementById('game').removeChild(document.querySelector('.userBar'));
	gameBox.insertAdjacentHTML("afterBegin", "<div id='result'><h2> Таблица рекордов </h2><div id='resultTable'></div></div>");
	console.log(array);
	let counter = 0;
	for (let el of array){
		console.log("el"+ el);
		let winner = document.createElement('div');
		winner.className = 'winner-item';
		winner.innerHTML = ++counter + ". " + el.username + " - " + el.score;
		document.getElementById('resultTable').appendChild(winner);
	}
	let playAgain = document.createElement('div');
	playAgain.className = "play-btn";
	playAgain.innerHTML = "Заново";
	playAgain.onclick = function(){
		gameBox.classList.remove('result-screen');
		gameBox.innerHTML = '';
		game.login();
	}
	gameBox.appendChild(playAgain);
}


function Fish(x,y, speed = 10, way = 0, type = 0){
 this.x = x;
 this.y = y;
 this.speed = speed; //px per sec
 this.way = way; // 0 - left, 1 - right
 this.type = type; // 0 - small 1 - medium 2 - big
 switch (type){
		case 0: this.cost = 50;
				break;
		case 1: this.cost = 20;
				break;
		case 2: this.cost = 5;
				break;
	}
}

Fish.prototype.createEl = function(){
	let fishEl = document.createElement('div');
	fishEl.style.left = this.x;
	fishEl.style.top = this.y;
	this.el = fishEl;
	let img = 0;
	switch (this.type){
		case 0: img = 'fish-0.png';
				classFish = 'fish-0'
				break;
		case 1: img = 'fish-1.png';
				classFish = 'fish-1'
				break;
		case 2: img = 'fish-2.png';
				classFish = 'fish-2';
				break;
	}
	fishEl.className = classFish;
	fishEl.setAttribute('cost', this.cost);
	let fishImg = document.createElement('img');
	this.img ="img/"+img;
	this.imgTurned = "img/"+ img.substring(0,6)+'-turned.png';
	fishImg.setAttribute("src", this.img);
	fishEl.appendChild(fishImg);
	fishEl.onclick = function(){
		game.userScore += +this.getAttribute('cost');
		document.getElementsByClassName('game-block')[0].removeChild(this);
		document.getElementById('score').innerHTML = game.userScore;
	}
	document.getElementsByClassName('game-block')[0].appendChild(fishEl);
}

Fish.prototype.swimRight = function(){
	this.x = this.x + this.speed;
	this.el.classList.remove('turned');
	this.el.firstChild.setAttribute('src', this.img);


}

Fish.prototype.swimLeft = function(){
		// console.log(this.el.firstChild);		
		this.el.firstChild.setAttribute('src', this.imgTurned);
	this.el.classList.add('turned');
	this.x = this.x - this.speed;
}


Fish.prototype.render = function(){
	this.el.style.left = this.x + "px";
	this.el.style.top = this.y + 'px';
}

Fish.prototype.ai = function(){
	let dw = WIDTH - this.el.offsetWidth;
	if (this.x >= dw) {
		this.way = 0;
	}
	if ( this.x <= 0) {
		this.way = 1;
	}
}
Fish.prototype.move = function() {
	if (this.way == 1) {
		this.swimRight();
	} else {
		this.swimLeft();
	}
}
game.createBox();
game.login();
// game.main();