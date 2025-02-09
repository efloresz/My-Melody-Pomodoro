var canvas = document.getElementById('tutorial');

var i = 0;
var imax;
var raf;
var clickCount=0;
var nIntervId;

var currentTime;
var start=0;
var stop=0;
var remainderTime=parseInt($("#sessionTime").attr("value"))*60;
var passedTime=0;
var pauseActive=false;
var sessionActive=false;
var activityDuration=parseInt($("#sessionTime").attr("value"))*60;
var pauseClick=0;

var colBreakPoint1=0;
var colBreakPoint2=1;

function draw(timestamp) {
 
 if (canvas.getContext) {
   var ctx = canvas.getContext("2d");
 }
 
 ctx.save();
 
 if(1-remainderTime/activityDuration<0.7){
   colBreakPoint1=1-remainderTime/activityDuration;
   colBreakPoint2=0;
 }
 else if(1-remainderTime/activityDuration<0.9){
   colBreakPoint1=1-remainderTime/activityDuration;
   colBreakPoint2=1-remainderTime/activityDuration;
 }
 else if(1-remainderTime/activityDuration<1){
   colBreakPoint1=1;
   colBreakPoint2=1-remainderTime/activityDuration;
 }
 else{
   colBreakPoint1=1;
   colBreakPoint2=1-remainderTime/activityDuration;
 }
 
 clear(ctx);
 
 ctx.save();
 ctx.beginPath();
 ctx.moveTo(canvas.width/2,canvas.height/2);
 ctx.fillStyle = 'rgba(' + Math.floor(0 + colBreakPoint1*255) + ',' +  Math.floor(255 - colBreakPoint2*255) + ',0,0.5)';
 ctx.arc(canvas.width/2,canvas.height/2, canvas.width/2, Math.PI *(2*(1-remainderTime/activityDuration)), Math.PI * 2, false);
 ctx.fill();
 ctx.closePath();
 ctx.restore();

 ctx.save();
 ctx.moveTo(canvas.width/2,canvas.height/2);
 ctx.beginPath();
 ctx.fillStyle = 'rgb(' + Math.floor(0 + colBreakPoint1*255) + ',' + Math.ceil(204-colBreakPoint2*204) + ',0)';
 ctx.arc(canvas.width/2,canvas.height/2, canvas.width/2-50, 0, Math.PI * 2, false);
 ctx.fill();
 ctx.rotate(i/imax+10);
 ctx.closePath();
 ctx.restore();
 
 ctx.save();
 ctx.beginPath();
 ctx.moveTo(canvas.width/2,canvas.height/2);
 ctx.fillStyle = 'rgba(' + Math.floor(0 + colBreakPoint1*255) + ',' + Math.floor(204 - colBreakPoint2*204) + ',0,0.9)';
 ctx.arc(canvas.width/2,canvas.height/2, canvas.width/2, 0, Math.PI *(2*(1-remainderTime/activityDuration)), false);
 ctx.fill();
 ctx.closePath();
 ctx.restore();
 
 ctx.save();
 ctx.beginPath();
 ctx.font = "32px serif";
 ctx.textAlign="center";
 if (pauseActive===true){
   var text="Pause";
 }
 else{
   var text="Session";
 }
 ctx.fillText(text,canvas.width/2,canvas.height/2-20+15);
 ctx.restore();
 ctx.save();
 
 ctx.beginPath();
 ctx.font = "32px serif";
 ctx.textAlign="center";
 
 if (Math.floor(remainderTime%60) < 10) {
    var seconds = '0' + Math.floor(remainderTime%60);
 }
 else{      
   var seconds=Math.floor(remainderTime%60);
 }
 
 if (Math.floor(remainderTime/60) ===0) {
   ctx.fillText(''+seconds,canvas.width/2,canvas.height/2+40);
 }
 else{
   var minutes=Math.floor(remainderTime/60);
   ctx.fillText(''+minutes+':'+seconds,canvas.width/2,canvas.height/2+40);
 }
 ctx.restore();
 ctx.restore();
 
 currentTime=new Date();  
 if(start!==0) 
 {
   passedTime=activityDuration-(stop-currentTime.getTime()/1000);
   remainderTime=Math.max(0,stop-currentTime.getTime()/1000)
 };

 if (remainderTime > 0 && clickCount%2===1) {
     raf=window.requestAnimationFrame(draw);
     i++;
 }
 else if (remainderTime <=0){
    i=0;
    clickCount=0;  
    if(sessionActive===true){
       sessionActive=false;
       pauseActive=true;
    }
    else if(pauseActive===true){
       pauseActive=false;
    }  
    i++;
    animationRun();
  }
}

document.addEventListener('DOMContentLoaded', function() {
   raf = window.requestAnimationFrame(draw);
   document.getElementById("firstPlus").addEventListener("click",addition);
   document.getElementById("firstMinus").addEventListener("click",subtraction);
   document.getElementById("secondPlus").addEventListener("click",addition);
   document.getElementById("secondMinus").addEventListener("click",subtraction);
});

function clear(ctx) {
 ctx.clearRect(0,0,canvas.width,canvas.height);
}

canvas.addEventListener("click", animationRun);


function animationRun(){
 clickCount++;
 if(sessionActive===false && clickCount<=1){
       if (pauseActive===false) {
         sessionActive=true;
         remainderTime = parseInt($("#sessionTime").attr("value")) * 60;
         activityDuration = parseInt($("#sessionTime").attr("value")) * 60;
       } 
       else if(pauseActive===true){
         sessionActive=false;
         remainderTime = parseInt($("#pauseTime").attr("value")) * 60;
         activityDuration = parseInt($("#pauseTime").attr("value")) * 60;
       }
       passedTime = 0;
   currentTime=new Date();
   start = currentTime.getTime()/1000;
   stop = start+remainderTime;
   raf = window.requestAnimationFrame(draw);
 }
 else if(clickCount>1 && i>1){
   pauseClick++;
   if (pauseClick%2===1)
   {
     window.cancelAnimationFrame(raf);
   }
   else{
     currentTime=new Date();
     start= currentTime.getTime()/1000;
     stop = start+remainderTime;
     raf  = window.requestAnimationFrame(draw);
   }
 }
};


function addition(){
 var result;
 if(this.id==="firstPlus"){
   result=$("#pauseTime").attr("value");
   result=parseInt(result)+1;
   $("#pauseTime").attr("value",result);
 }
 else{
   result=$("#sessionTime").attr("value");
   result=parseInt(result)+1;
   $("#sessionTime").attr("value",result);
   reset();
 }
}

function subtraction(){
 var result;
 if(this.id==="firstMinus"){
   result=$("#pauseTime").attr("value");
   result=Math.max(1,parseInt(result)-1);
   $("#pauseTime").attr("value",result);
 }
 else{
   result=$("#sessionTime").attr("value");
   result=Math.max(1,parseInt(result)-1);
   $("#sessionTime").attr("value",result);
   reset();
 }
}

function reset(){
 window.cancelAnimationFrame(raf);
 currentTime;
 start=0;
 stop=0;
 remainderTime=parseInt($("#sessionTime").attr("value"))*60;
 passedTime=0;
 pauseActive=false;
 sessionActive=false;
 activityDuration=parseInt($("#sessionTime").attr("value"))*60;
 pauseClick=0;
 clickCount=0;
 i=0;
 draw();
}