import { useEffect } from "react";
import { useAuth } from "../context/AuthContext"




	// select canvas element
const Canvas = () => {
	return (
		<>
		</>
	)
}


const Game = () => {
	const { user, socket } = useAuth()
	useEffect(() => {
		const canvas = document.getElementById("pong");
		const data ={
			id:user.id
		}
		// gameUser.y = evt.clientY - rect.top - gameUser.height/2;
		socket.emit('onStart', JSON.stringify(data));
		// getContext of canvas = methods and properties to draw and do a lot of thing to the canvas
		const ctx = canvas.getContext('2d');
	
		// Ball object
		let ball = {
			x : canvas.width/2,
			y : canvas.height/2,
			radius : 10,
			velocityX : 5,
			velocityY : 5,
			speed : 7,
			color : "WHITE"
		}
	
		// gameUser Paddle
		let gameUser = {
			x : 0, // left side of canvas
			y : (canvas.height - 100)/2, // -100 the height of paddle
			width : 10,
			height : 100,
			score : 0,
			color : "WHITE"
		}
	
		// COM Paddle
		let com = {
			x : canvas.width - 10, // - width of paddle
			y : (canvas.height - 100)/2, // -100 the height of paddle
			width : 10,
			height : 100,
			score : 0,
			color : "WHITE"
		}
	
		// NET
		let net = {
			x : (canvas.width - 2)/2,
			y : 0,
			height : 10,
			width : 2,
			color : "WHITE"
		}
	
		// draw a rectangle, will be used to draw paddles
		function drawRect(x, y, w, h, color){
			ctx.fillStyle = color;
			ctx.fillRect(x, y, w, h);
		}
	
		// draw circle, will be used to draw the ball
		function drawArc(x, y, r, color){
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.arc(x,y,r,0,Math.PI*2,true);
			ctx.closePath();
			ctx.fill();
		}
	
		// listening to the mouse
		canvas.addEventListener("mousemove", getMousePos);
	
		function getMousePos(evt){
			let rect = canvas.getBoundingClientRect();
			const data ={
				pos:evt.clientY - rect.top - gameUser.height/2,
				id:user.id
			}
			// gameUser.y = evt.clientY - rect.top - gameUser.height/2;
			socket.emit('msgToServer', JSON.stringify(data));
		}
	
		// draw the net
		function drawNet(){
			for(let i = 0; i <= canvas.height; i+=15){
				drawRect(net.x, net.y + i, net.width, net.height, net.color);
			}
		}
	
		// draw text
		function drawText(text,x,y){
			ctx.fillStyle = "#FFF";
			ctx.font = "75px fantasy";
			ctx.fillText(text, x, y);
		}
		// render function, the function that does al the drawing
		function render(){
			
			// clear the canvas
			drawRect(0, 0, canvas.width, canvas.height, "#000");
			
			// draw the gameUser score to the left
			drawText(gameUser.score,canvas.width/4,canvas.height/5);
			
			// draw the COM score to the right
			drawText(com.score,3*canvas.width/4,canvas.height/5);
			
			// draw the net
			drawNet();
			
			// draw the gameUser's paddle
			drawRect(gameUser.x, gameUser.y, gameUser.width, gameUser.height, gameUser.color);
			
			// draw the COM's paddle
			drawRect(com.x, com.y, com.width, com.height, com.color);
			
			// draw the ball
			drawArc(ball.x, ball.y, ball.radius, ball.color);
		}
	
		socket.addEventListener(user.id, (data) => {
			const parsedData = JSON.parse(data)
			ball = parsedData.ball;
			gameUser = parsedData.user;
			com = parsedData.com;
			net = parsedData.net;
			render();
		});
	}, [])

	return (
		<canvas style={{
			border: `2px solid #FFF`,
            position: `absolute`,
            margin :`auto`,
            top:`0`,
            right:`0`,
            left:`0`,
            bottom:`0`
		}} id="pong" width="1000" height="800">
			<Canvas />
		</canvas>
	)
}

export default Game