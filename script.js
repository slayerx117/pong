
(function() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	
	canvas.width = 1000;
	canvas.height = 600;
	document.getElementById("table").width = canvas.width;
	document.getElementById("highscore").innerHTML = localStorage.highScore;
	var paddle;
	var ball;
	var score;
	var times = 0;
	var scorePaddleX = 50;
	var scoreBallX = canvas.width-50;
	var playing = false;
	
	var leftKeys = {
		left: "Q".charCodeAt(0),
		right: "W".charCodeAt(0)
	};
	
	var rightKeys = {
		left: "O".charCodeAt(0),
		right:	"P".charCodeAt(0)
	};
	
	var keysSwitched = false;
	
	function init() {
		paddle = {
			width: 200,
			height: 10,
			speed: 10
		}
		paddle.x = (canvas.width - paddle.width) / 2;
		paddle.y = canvas.height - paddle.height - 1;
		
		ball = {
			radius: 40,
			dx: 0,
			dy: -10,
			accel: 0.2,
			xBounce: 0.9,
			yBounce: 1.001,
			maxSpeed: 8
		};
		ball.x = canvas.width / 2 - ball.radius / 2;
		ball.y = canvas.height - paddle.height - ball.radius * 2;
		
		score = 0;
		
		playing = true;
	}
	
	var keys = {};
	window.onkeydown = function(event) {
		var key = (event || window.event).keyCode;
		keys[key] = true;
		if(!playing && key == 32){ 
			init();
			document.getElementById("main").classList.remove("hidden");
			document.getElementById("index").classList.add("hidden");
			document.getElementById("restart").classList.add("hidden2");
			}
	};
	window.onkeyup = function(event) {
		var key = (event || window.event).keyCode;
		keys[key] = false;
	};
	
	document.getElementById("switch").onclick = function() {
		if(!playing) {
			scoreBallX ^= scorePaddleX;
			scorePaddleX ^= scoreBallX;
			scoreBallX ^= scorePaddleX;//switches values of scoreBallX and scorePaddleX. why? because fuck you, thats why.
			keysSwitched = !keysSwitched;
			document.getElementById("left").innerHTML = (keysSwitched ? "Ball" : "Paddle") + ": QW";
			document.getElementById("right").innerHTML = (keysSwitched ? "Paddle" : "Ball") + ": OP";
		}
	};
	document.getElementById("highscoreReset").onclick = function() {
		if(!playing && localStorage.highScore > 0 && confirm("Are you sure?")) {
		localStorage.highScore = 0;
		document.getElementById("highscore").innerHTML = localStorage.highScore;
		}
	};
	function physics() {
		if(score > localStorage.highScore){ 
			localStorage.highScore=score;
			document.getElementById("highscore").innerHTML = localStorage.highScore;
		};
		if(keys[39]){return;}//pauses game
		if(keys[(keysSwitched ? rightKeys : leftKeys).left]) paddle.x -= paddle.speed;
		if(keys[(keysSwitched ? rightKeys : leftKeys).right]) paddle.x += paddle.speed;
		if(paddle.x < 0) paddle.x = 0;
		if(paddle.x > canvas.width - paddle.width) paddle.x = canvas.width - paddle.width;
		if(keys[(keysSwitched ? leftKeys : rightKeys).left]) ball.dx -= ball.accel;
		if(keys[(keysSwitched ? leftKeys : rightKeys).right]) ball.dx += ball.accel;
		if(ball.dx > ball.maxSpeed) ball.dx = ball.maxSpeed;
		if(ball.dx < -ball.maxSpeed) ball.dx = -ball.maxSpeed;
		ball.x += ball.dx;
		if(ball.x < 0) {
			ball.x = 0;
			ball.dx *= -ball.xBounce;
		}
		if(ball.x > canvas.width - ball.radius) {
			ball.x = canvas.width - ball.radius;
			ball.dx *= -ball.xBounce;
		}
		ball.y += ball.dy;
		if(ball.y < 1) {
			ball.y = ball.radius;
			ball.dy *= -ball.yBounce;
		}
		if(ball.y > canvas.height - ball.radius - paddle.height) {
			if(ball.x + ball.radius >= paddle.x && ball.x <= paddle.x + paddle.width) {
				ball.y = canvas.height - ball.radius - paddle.height;
				ball.dy *= -1;
				score++;
			}
			else {
				document.getElementById("restart").classList.remove("hidden2");
				playing = false;
				times++; 
			}
		}
	}
	
	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,canvas.width, canvas.height);
		ctx.fillStyle = "#FF9900";
		ctx.beginPath();
		ctx.fillRect(ball.x, ball.y, ball.radius, ball.radius);
		ctx.fill();
		ctx.fillStyle = "white";
		ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
		ctx.fillStyle = "white";
		ctx.font = "30px Arial";
		ctx.fillText(score.toString(), scorePaddleX, 30);
		ctx.fillText(times.toString(), scoreBallX, 30);
	}
	
	init();
	
	playing = false;
	
	setInterval(function() {
		if(playing) physics();
		draw();
	}, 15);
})();
