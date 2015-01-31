(function() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	
	canvas.width = 1000;
	canvas.height = 600;
	document.getElementById("table").width = canvas.width;
	
	var paddle;
	var ball;
	var score;
	var playing = false;
	
	var leftKeys = {
		left: "Q".charCodeAt(0),
		right: "W".charCodeAt(0)
	};
	
	var rightKeys = {
		left: "O".charCodeAt(0),
		right: "P".charCodeAt(0)
	};
	
	var keysSwitched = false;
	
	function init() {
		paddle = {
			width: 200,
			height: 10,
			speed: 10
		}
		paddle.x = (canvas.width - paddle.width) / 2;
		paddle.y = canvas.height - paddle.height;
		
		ball = {
			radius: 40,
			dx: 0,
			dy: -10,
			accel: 0.2,
			bounce: 0.9,
			maxSpeed: 8
		};
		ball.x = canvas.width / 2;
		ball.y = canvas.height - paddle.height - ball.radius * 2;
		
		score = 0;
		
		playing = true;
	}
	
	var keys = {};
	window.onkeydown = function(event) {
		var key = (event || window.event).keyCode;
		keys[key] = true;
		if(!playing && key == 32) init();
	};
	window.onkeyup = function(event) {
		var key = (event || window.event).keyCode;
		keys[key] = false;
	};
	
	document.getElementById("switch").onclick = function() {
		if(!playing) {
			keysSwitched = !keysSwitched;
			document.getElementById("left").innerHTML = (keysSwitched ? "Ball" : "Paddle") + ": QW";
			document.getElementById("right").innerHTML = (keysSwitched ? "Paddle" : "Ball") + ": OP";
		}
	};
	
	function physics() {
		if(keys[(keysSwitched ? rightKeys : leftKeys).left]) paddle.x -= paddle.speed;
		if(keys[(keysSwitched ? rightKeys : leftKeys).right]) paddle.x += paddle.speed;
		if(paddle.x < 0) paddle.x = 0;
		if(paddle.x > canvas.width - paddle.width) paddle.x = canvas.width - paddle.width;
		
		if(keys[(keysSwitched ? leftKeys : rightKeys).left]) ball.dx -= ball.accel;
		if(keys[(keysSwitched ? leftKeys : rightKeys).right]) ball.dx += ball.accel;
		if(ball.dx > ball.maxSpeed) ball.dx = ball.maxSpeed;
		if(ball.dx < -ball.maxSpeed) ball.dx = -ball.maxSpeed;
		ball.x += ball.dx;
		if(ball.x < ball.radius) {
			ball.x = ball.radius;
			ball.dx *= -ball.bounce;
		}
		if(ball.x > canvas.width - ball.radius) {
			ball.x = canvas.width - ball.radius;
			ball.dx *= -ball.bounce;
		}
		
		ball.y += ball.dy;
		if(ball.y < ball.radius) {
			ball.y = ball.radius;
			ball.dy *= -1;
		}
		if(ball.y > canvas.height - ball.radius - paddle.height) {
			if(ball.x >= paddle.x && ball.x <= paddle.x + paddle.width) {
				ball.y = canvas.height - ball.radius - paddle.height;
				ball.dy *= -1;
				score++;
			}
			else {
				playing = false;
			}
		}
	}
	
	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "orange";
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = "black";
		ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
		ctx.font = "30px Arial";
		ctx.fillText(score.toString(), 10, 30);
	}
	
	init();
	
	playing = false;
	
	setInterval(function() {
		if(playing) physics();
		draw();
	}, 10);
})();