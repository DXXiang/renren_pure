var s = window.screen;
var ctx=bg.getContext('2d')
var width  =bg.width= s.width;
var height  =bg.height= s.height;
var letters = new Array(Math.ceil(width/5)).join(1).split('');
var draw = function () {
  ctx.fillStyle='rgba(22,23,40,.15)';
  ctx.fillRect(0,0,width,height);
  ctx.fillStyle='#599be1';
  ctx.font = " 14px microsoft yahei";
    letters.map(function(y_pos, index){
    text = String.fromCharCode(48+Math.random()*2);
    x_pos = index * 20;
    ctx.fillText(text, x_pos, y_pos);
    letters[index] = (y_pos > 758 + Math.random() * 1e4) ? 0 : parseInt(y_pos) + 15;
  });
};
setInterval(draw, 80);
