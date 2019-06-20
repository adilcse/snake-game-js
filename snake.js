const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// create the unit
const box = 32;
let speed = 200;
// load images
let gameover=false;
const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

const reload = new Image();
reload.src = "img/reload.png";

 const pauses = new Image();
 pauses.src= "img/pause.png";
 const headimg=new Image();
 headimg.src = "img/head.png";

  const tailImg=new Image();
 tailImg.src = "img/tail.png";
  const bodyImg=new Image();
 bodyImg.src = "img/body.png";

let clk=0;
let gameon=true;
function pause()
   {
       if(clk==0)
           {  clearInterval(game);
            clk=1;
           ctx.drawImage(pauses,6*box,8*box);
           gameon=false;
           }
         else {
            game = setInterval(draw,speed);
            clk=0;
            gameon=true;
         }
    
    }
// load audio files

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";

// create the snake

let snake = [];

snake[0] = {
    x : 9 * box,
    y : 10 * box
};

// create the food

let food = {
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}

// create the score var

let score = 0;

//control the snake

let d;

document.addEventListener("keydown",direction);


function direction(event){
    let key = event.keyCode;
    if( key == 37 && d != "RIGHT" && !gameover && gameon){
        left.play();
        d = "LEFT";
    }else if(key == 38 && d != "DOWN" && !gameover && gameon){
        d = "UP";
        up.play();
    }else if(key == 39 && d != "LEFT" && !gameover && gameon){
        d = "RIGHT";
        right.play();
    }else if(key == 40 && d != "UP" && !gameover && gameon){
        d = "DOWN";
        down.play();
    }else if(key == 32 && !gameover){
        pause();
        
    } else if(gameover && key==32){
        document.location.reload(true);
        // score=0;
        // d=null;
        // snake=null;
        // newHead.x=null;
        // newHead.y=null;
        // snakeX=null;
        // snakeY=null;

    }
}

//draw crash
 let drawCrash ;
 let flag = true ;
function crash(head){
 
    if(gameover){
    

        if(flag){
        ctx.fillStyle = "red" ;
        ctx.fillRect(snake[0].x ,snake[0].y ,box,box);
         flag=false;
    }else{
        ctx.fillStyle = "green" ;
        ctx.fillRect(snake[0].x,snake[0].y,box,box);
        flag = true ;
    }

    }else{
        clearInterval(drawCrash);

    }



}
// cheack collision function
function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

function rotateimg(img,x,y,dir){
    var deg;
    if(dir=="LEFT"){
        deg=0;
       

    }else  if(dir=="RIGHT"){
         deg=180;
        y+=box;
        x+=box;

    }else  if(dir=="UP"){
          deg=90;
          x+=box;
        
    }else  if(dir=="DOWN"){
          deg=270;
          y+=box;
       
    }else{
        ctx.drawImage(img,x,y);
    }
    ctx.save();
    ctx.translate(x, y); // change origin
    ctx.rotate(deg * Math.PI/180 );
    ctx.translate(-x, -y);
    ctx.drawImage(img,x,y);
    ctx.restore()


}
// draw everything to the canvas

function draw(){
    
    ctx.drawImage(ground,0,0);
    
           
       //     let t = snake.length-1;
         //   if(t!=0)
        //    {
              //   rotateimg(tailImg,snake[t].x , snake[t].y,d);


              //  ctx.drawImage(tailImg,snake[t].x , snake[t].y);
         //   }

       // ctx.drawImage(headimg,snake[0].x , snake[0].y);
        rotateimg(headimg,snake[0].x , snake[0].y,d);

    for( let i = 1; i < snake.length-1 ; i++){
        // ctx.fillStyle = ( i == 0 )? "green" : "white";
        // ctx.fillRect(snake[i].x,snake[i].y,box,box);
        
       
             ctx.fillStyle = "white";
          ctx.fillRect(snake[i].x,snake[i].y,box,box);

      //  ctx.drawImage(bodyImg,snake[i].x , snake[i].y);
         ctx.strokeStyle = "red";
         ctx.strokeRect(snake[i].x,snake[i].y,box,box);
    }
    
    ctx.drawImage(foodImg, food.x, food.y);
    
    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    
    // which direction
    if( d == "LEFT") snakeX -= box;
    if( d == "UP") snakeY -= box;
    if( d == "RIGHT") snakeX += box;
    if( d == "DOWN") snakeY += box;
    
    // if the snake eats the food
    if(snakeX == food.x && snakeY == food.y){
        score++;
        eat.play();
        food = {
            x : Math.floor(Math.random()*17+1) * box,
            y : Math.floor(Math.random()*15+3) * box
        }
        // we don't remove the tail
    }else{
        // remove the tail
        snake.pop();
    }
    
    // add new Head
    
    let newHead = {
        x : snakeX,
        y : snakeY
    }
      
    
    
    // game over
   
    if(snakeX < box || snakeX > 17 * box || snakeY < 3*box || snakeY > 17*box || collision(newHead,snake)){
        clearInterval(game);
        gameover=true;
        dead.play();
        drawCrash = setInterval(crash,speed,snake);
        
    }
    
  snake.unshift(newHead);

    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score,2*box,1.6*box);
    ctx.drawImage(reload,15*box,box);

    if(score+1 % 3 == 0){
        speed+=20;
         setInterval(draw,speed);
    }
}

// call draw function every 100 ms

let game = setInterval(draw,speed);
















