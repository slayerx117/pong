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
	
	function init() {
		paddle = {
			width: 200,
			height: 10,
			speed: 10
		}
		paddle.x = (canvas.width - paddle.width) / 2;
		paddle.y = canvas.height - paddle.height;
		
		ball = {
			radius: 30,
			dx: 0,
			dy: -10,
			accel: 0.2,
			xBounce: 0.9,
			yBounce: 1.001,
			maxSpeed: 8
		};
		ball.x = canvas.width / 2;
		ball.y = canvas.height - paddle.height - ball.radius * 2;
		
		score = 0;
		
		playing = true;
	}
	
	var keys = {
		left: {
			left: "Q".charCodeAt(0),
			right: "W".charCodeAt(0)
		},
		right: {
			left: "O".charCodeAt(0),
			right: "P".charCodeAt(0)
		},
		switched: false
	};
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
			keys.switched = !keys.switched;
			document.getElementById("left").innerHTML = (keys.switched ? "Ball" : "Paddle") + ": QW";
			document.getElementById("right").innerHTML = (keys.switched ? "Paddle" : "Ball") + ": OP";
		}
	};
	
	function physics() {
		if(keys[(keys.switched ? keys.right : keys.left).left]) paddle.x -= paddle.speed;
		if(keys[(keys.switched ? keys.right : keys.left).right]) paddle.x += paddle.speed;
		if(paddle.x < 0) paddle.x = 0;
		if(paddle.x > canvas.width - paddle.width) paddle.x = canvas.width - paddle.width;
		
		if(keys[(keys.switched ? keys.left : keys.right).left]) ball.dx -= ball.accel;
		if(keys[(keys.switched ? keys.left : keys.right).right]) ball.dx += ball.accel;
		if(ball.dx > ball.maxSpeed) ball.dx = ball.maxSpeed;
		if(ball.dx < -ball.maxSpeed) ball.dx = -ball.maxSpeed;
		ball.x += ball.dx;
		if(ball.x < ball.radius) {
			ball.x = ball.radius;
			ball.dx *= -ball.xBounce;
		}
		if(ball.x > canvas.width - ball.radius) {
			ball.x = canvas.width - ball.radius;
			ball.dx *= -ball.xBounce;
		}
		
		ball.y += ball.dy;
		if(ball.y < ball.radius) {
			ball.y = ball.radius;
			ball.dy *= -ball.yBounce;
		}
		if(ball.y > canvas.height - ball.radius - paddle.height) {
			if(ball.x >= paddle.x && ball.x <= paddle.x + paddle.width) {
				ball.y = canvas.height - ball.radius - paddle.height;
				ball.dy *= -ball.yBounce;
				score++;
			}
			else {
				playing = false;
			}
		}
	}
	
	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
		ctx.fillStyle = "orange";
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