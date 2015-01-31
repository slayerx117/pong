(function() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	
	canvas.width = 1000;
	canvas.height = 600;
	
	var paddle = {
		width: 200,
		height: 10,
		left: "Q".charCodeAt(0),
		right: "W".charCodeAt(0),
		speed: 10
	}
	paddle.x = (canvas.width - paddle.width) / 2;
	paddle.y = canvas.height - paddle.height;
	
	var ball = {
		radius: 40,
		left: "O".charCodeAt(0),
		right: "P".charCodeAt(0),
		dx: 0,
		dy: 10,
		accel: 0.1,
		bounce: 0.9,
		maxSpeed: 10
	};
	ball.x = canvas.width / 2;
	ball.y = ball.radius * 2;
	
	var score = 0;
	
	var keys = {};
	window.onkeydown = function(event) {
		var key = (event || window.event).keyCode;
		keys[key] = true;
	};
	window.onkeyup = function(event) {
		var key = (event || window.event).keyCode;
		keys[key] = false;
	};
	
	function physics() {
		if(keys[paddle.left]) paddle.x -= paddle.speed;
		if(keys[paddle.right]) paddle.x += paddle.speed;
		if(paddle.x < 0) paddle.x = 0;
		if(paddle.x > canvas.width - paddle.width) paddle.x = canvas.width - paddle.width;
		
		if(keys[ball.left]) ball.dx -= ball.accel;
		if(keys[ball.right]) ball.dx += ball.accel;
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
				clearInterval(interval);
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
	
	var interval = setInterval(function() {
		physics();
		draw();
	}, 10);
})();