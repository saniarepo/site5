<!DOCTYPE html>
<html>
<head>
</head>
<body>
<canvas width="150" height="150" id="canvas"></canvas>
<script type="text/javascript">
// ожидаем загрузку
window.onload = function(){
	  // рисуем часы
	  clock();
	  // через каждую секунду
	  // часы перерисовываются
	  setInterval(clock, 1000);
	  }
	//
	function clock() {
 // получаем текущие дату и время
	  var now = new Date();
	  var sec = now.getSeconds();
	  var min = now.getMinutes();
	  var hr = now.getHours();
	 
	  // получаем контекст canvas
	  var ctx = document
	  .getElementById("canvas")
	 .getContext("2d");
	 
	  // сохраняем состояние
	  ctx.save();
	  // инициализируем холст
	  ctx.clearRect(0,0,150,150);
	  // рисуя в точке 0,0 фактически
	  // рисуем в точке 75,75
  ctx.translate(75,75);
	  // при рисовании линии в 100px
	  // фактически рисуем линию в 40px
	  ctx.scale(0.4,0.4);
	  // начинаем вращать с 12:00
	  ctx.rotate(-Math.PI/2);
	 
	  // инициализируем свойства рисунка
	  // контуры рисуем черным
	  ctx.strokeStyle = "black";
	  // заливка тоже черная
	  ctx.fillStyle = "black";
	  // ширина линии 8px
	  ctx.lineWidth = 8;
	  // будем рисовать по кругу
	  ctx.lineCap = "round";
	 
	  // начинаем рисовать часовые метки
	  // сохраняем предыдущее состояние
	  ctx.save();
	  ctx.beginPath();
	  // для каждого часа
	  for(var i = 0; i < 12; i++) {
	    // поворачиваем на 1/12
	    ctx.rotate(Math.PI/6);
	    // перемещаем курсор
	    ctx.moveTo(100,0);
	    // рисуем черточку 20px
	    ctx.lineTo(120,0);
	  }
	  ctx.stroke();
	  ctx.restore();
	 
	  // сохраняем состояние
	  ctx.save();
	  // ставим ширину линии 5px
	  ctx.lineWidth = 5;
	  ctx.beginPath();
	  // рисуем минутные метки
	  // для каждой минуты
	  for(var i = 0; i < 60; i++) {
	    // кроме тех, что совпадут
	    // с часами
	    if(i%5 != 0) {
	      // перемещаем курсор
	      ctx.moveTo(117,0);
	      // рисуем черточку 3px
	      ctx.lineTo(120,0);
	    }
	    // вращаем холст на 1/60
	    ctx.rotate(Math.PI/30);
	  }
	  ctx.stroke();
	  ctx.restore();
	 
	  // сохраняем состояние
	  ctx.save();
	  // начинаем рисовать часовую стрелку
	  // вращаем холст на текущую позицию
	  ctx.rotate((Math.PI/6)*hr +
	             (Math.PI/360)*min +
	             (Math.PI/21600)*sec);
	  // устанавливаем ширину линии 14px
	  ctx.lineWidth = 14;
	 
	  ctx.beginPath();
	  // сдвигаем курсор несколько назад
	  // стобы было похоже на стрелку
	  ctx.moveTo(-20,0);
	  // рисуем линию почти до часовых меток
	  ctx.lineTo(80,0);
	  ctx.stroke();
	  ctx.restore();
	 
	  // сохраняем состояние
	  ctx.save();
	  // начинаем рисовать минутную стрелку
	  // вращаем холст на текущую позицию
	  ctx.rotate((Math.PI/30)*min +
	             (Math.PI/1800)*sec);
	  // ширина линии 10px
	  ctx.lineWidth = 10;
	  ctx.beginPath();
	  // двигаем курсор
	  ctx.moveTo(-28,0);
	  // рисуем линию
	  ctx.lineTo(112,0);
	  ctx.stroke();
	  ctx.restore();
	 
	  // сохраняем состояние
	  ctx.save();
	  // начинаем рисовать секундную стрелку
	  // вращаем холст на текущую позицию
	  ctx.rotate(sec * Math.PI/30);
	  // контур и заливка красного цвета
  ctx.strokeStyle = "#D40000";
	  ctx.fillStyle = "#D40000";
	  // ширина линии 6px
	  ctx.lineWidth = 6;
	  ctx.beginPath();
	  // двигаем курсор
	  ctx.moveTo(-30,0);
	  // рисуем линию
	  ctx.lineTo(83,0);
	  ctx.stroke();
	  ctx.restore();
	 
	  // сохраняем состояние
	  ctx.save();
	  // рисуем внешнюю окружность
	  // шириной 14px
	  ctx.lineWidth = 14;
	  // синим цветом
	  ctx.strokeStyle = "#325FA2";
	  ctx.beginPath();
	  // рисуем окружность, отступающую
	  // от центра на 142px
	  ctx.arc(0,0,142,0,Math.PI*2,true);
	  ctx.stroke();
	  ctx.restore();
	 
	  ctx.restore();
	}
</script>
</body>
</html>