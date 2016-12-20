var canvasMousePressed = false;
var canvasLastX, canvasLastY;
var canvasMain, canvasTemp;
var contextMain, contextTemp;
var canvasEraserWidth = 10;
var canvasEraserType = '1';

var canvasDrawType = 0,canvasDrawColor = 'black',canvasDrawLineWidth = 3;

$.jrDraw = {
	setType:function(value)
	{
		canvasDrawType = value;

		if(canvasDrawType == canvasEraserType)
		{
			$.jrDraw.drawToTemp();
		}
		else
		{
			$.jrDraw.drawToMain();
		}
	},
	setColor:function(value)
	{
		canvasDrawColor = value;
	},
	setLineWidth:function(value)
	{
		canvasDrawLineWidth = value;
	},
    init:function(containerName) {
    	var container = $(containerName);
    	var containerWidth = container.width();
    	var containerHeight = container.height();

    	var canvasHtml = "<canvas id='canvasMain' width='" + containerWidth + "' height='" + containerHeight + "' style='position: absolute;'></canvas><canvas id='canvasTemp' width='" + containerWidth + "' height='" + containerHeight + "' style='position: relative;'></canvas>";
    	container.html(canvasHtml);

    	canvasMain = document.getElementById('canvasMain');
	    contextMain = canvasMain.getContext("2d");

	    canvasTemp = document.getElementById('canvasTemp');
	    contextTemp = canvasTemp.getContext("2d");

	    $('#canvasTemp').mousedown(function (e) {
	        canvasMousePressed = true;
	        $.jrDraw.draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
	    });
	 
	    $('#canvasTemp').mousemove(function (e) {
	        if (canvasMousePressed) {
	            $.jrDraw.draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
	        }
	    });
	 
	    $('#canvasTemp').mouseup(function (e) {
	        $.jrDraw.end();
	    });
	    $('#canvasTemp').mouseleave(function (e) {
	        $.jrDraw.end();
	    });
    },
    draw:function(x, y, isDown) {
	    var type = canvasDrawType;

	    if(type == '0')
	    {
		    if (isDown) {
	        	this.doodle(canvasLastX,canvasLastY,x, y);
		    }
		    else
		    {
		    	this.point(x, y);
		    }
		    canvasLastX = x; canvasLastY = y;
	    }
	    else if(type == canvasEraserType)
	    {
	        this.eraser(x,y);
	    }
	    else if(type == '2')
	    {
		    if (isDown) {
	        	this.line(canvasLastX,canvasLastY,x, y);
	        	return;
		    }
		    canvasLastX = x; canvasLastY = y;
	    }
	    else if(type == '3')
	    {
		    if (isDown) {
	        	this.rect(canvasLastX,canvasLastY,x, y);
	        	return;
		    }
		    canvasLastX = x; canvasLastY = y;
	    }
	    else if(type == '4')
	    {
		    if (isDown) {
	        	this.round(canvasLastX,canvasLastY,x, y);
	        	return;
		    }
		    canvasLastX = x; canvasLastY = y;
	    }
	    else if(type == '5')
	    {
		    if (isDown) {
	        	this.arrow(canvasLastX,canvasLastY,x, y);
	        	return;
		    }
		    canvasLastX = x; canvasLastY = y;
	    }
    },
    end:function() {
	    canvasMousePressed = false;
	    if(canvasDrawType != canvasEraserType)
		{
	    	$.jrDraw.drawToMain();
		}
    },
    drawToMain:function() {
	    var image = new Image();
	    image.src = canvasTemp.toDataURL();
	    image.onload = function(){
	        contextMain.drawImage(image , 0 ,0 , image.width , image.height , 0 ,0 , canvasMain.width , canvasMain.height);
	        $.jrDraw.clearTemp();
	    }
    },
    drawToTemp:function() {
	    var image = new Image();
	    image.src = canvasMain.toDataURL();
	    image.onload = function(){
	        contextTemp.drawImage(image , 0 ,0 , image.width , image.height , 0 ,0 , canvasTemp.width , canvasTemp.height);
	        $.jrDraw.clearMain();
	    }
    },
    clearMain:function() {
	    contextMain.setTransform(1, 0, 0, 1, 0, 0);
	    contextMain.clearRect(0, 0, canvasMain.width, canvasMain.height);
    },
    clearTemp:function() {
	    contextTemp.setTransform(1, 0, 0, 1, 0, 0);
	    contextTemp.clearRect(0, 0, canvasTemp.width, canvasTemp.height);
    },
    doodle:function(startX, startY, endX, endY) {
        contextTemp.beginPath();
        contextTemp.strokeStyle = canvasDrawColor;
        contextTemp.lineWidth = canvasDrawLineWidth;
        contextTemp.lineJoin = "round";
        contextTemp.moveTo(startX, startY);
        contextTemp.lineTo(endX, endY);
        contextTemp.closePath();
        contextTemp.stroke();
    },
    point:function(x, y) {
        contextTemp.beginPath();
        contextTemp.strokeStyle = canvasDrawColor;
	    contextTemp.arc(x, y, canvasDrawLineWidth/6, 0, 2 * Math.PI);
	    contextTemp.fill();
        contextTemp.closePath();
        contextTemp.stroke();
    },
    eraser:function(x, y) {
	    contextTemp.beginPath();
	    contextTemp.globalCompositeOperation = "destination-out";
	    contextTemp.arc(x, y, canvasEraserWidth, 0, 2 * Math.PI);
	    contextTemp.fill();
        contextTemp.closePath();
	    contextTemp.globalCompositeOperation = "destination-over";
    },
    line:function(startX, startY, endX, endY) {
        contextTemp.beginPath();
        $.jrDraw.clearTemp();

        contextTemp.strokeStyle = canvasDrawColor;
        contextTemp.lineWidth = canvasDrawLineWidth;
        contextTemp.lineJoin = "round";
        contextTemp.moveTo(startX, startY);
        contextTemp.lineTo(endX, endY);
        contextTemp.closePath();
        contextTemp.stroke();
    },
    rect:function(startX, startY, endX, endY) {
        var originX,originY,rectW,rectH;
        if(startX < endX)
        {
            originX = startX;
            rectW = endX - startX;
        }
        else
        {
            originX = endX;
            rectW = startX - endX;
        }

        if(startY < endY)
        {
            originY = startY;
            rectH = endY - startY;
        }
        else
        {
            originY = endY;
            rectH = startY - endY;
        }

        contextTemp.restore();
        contextTemp.beginPath();
        $.jrDraw.clearTemp();

        contextTemp.strokeStyle = canvasDrawColor;
        contextTemp.lineWidth = canvasDrawLineWidth;
        contextTemp.lineJoin = "round";
        contextTemp.rect(originX, originY, rectW, rectH);
        contextTemp.closePath();
        contextTemp.stroke();
    },
    round:function(startX, startY, endX, endY) {
        var centerX,centerY,arcW,arcH,control;
        if(startX < endX)
        {
            arcW = endX - startX;
            centerX = startX + arcW/2;
        }
        else
        {
            arcW = startX - endX;
            centerX = endX + arcW/2;
        }

        if(startY < endY)
        {
            arcH = endY - startY;
            centerY = startY + arcH/2;
        }
        else
        {
            arcH = startY - endY;
            centerY = endY + arcH/2;
        }

        control = (arcW / 0.75) / 2;
        arcW = arcW / 2;
        arcH = arcH / 2;

        contextTemp.restore();
        contextTemp.beginPath();
        $.jrDraw.clearTemp();

        contextTemp.strokeStyle = canvasDrawColor;
        contextTemp.lineWidth = canvasDrawLineWidth;
        contextTemp.lineJoin = "round";
        contextTemp.moveTo(centerX, centerY-arcH);
        contextTemp.bezierCurveTo(centerX+control, centerY-arcH, centerX+control, centerY+arcH, centerX, centerY+arcH);
        contextTemp.bezierCurveTo(centerX-control, centerY+arcH, centerX-control, centerY-arcH, centerX, centerY-arcH);
        contextTemp.closePath();
        contextTemp.stroke();
    },
    arrow:function(startX, startY, endX, endY) {
        var slopy, cosy, siny;
        //箭头尺寸
        var arrowLength = canvasDrawLineWidth * 5;
        var arrowWidth = canvasDrawLineWidth * 5;
        //
        var distance = this.getDistance(startX,startY,endX,endY);
        if(arrowWidth >= distance * 0.5)
        {
            arrowLength = arrowWidth = distance * 0.5;
        }

        slopy = Math.atan2((startY - endY), (startX - endX));
        cosy = Math.cos(slopy);
        siny = Math.sin(slopy);


        contextTemp.restore();
        contextTemp.beginPath();
        $.jrDraw.clearTemp();

        contextTemp.strokeStyle = canvasDrawColor;
        contextTemp.lineWidth = canvasDrawLineWidth;
        contextTemp.lineCap = "round";
        contextTemp.lineJoin = "round";
        contextTemp.moveTo(startX, startY);
        contextTemp.lineTo(endX, endY);
        //箭头
        contextTemp.moveTo(endX, endY);
        contextTemp.lineTo(endX + (arrowLength * cosy - (arrowWidth / 2.0 * siny)), endY + (arrowLength * siny + (arrowWidth / 2.0 * cosy)));
        contextTemp.moveTo(endX, endY);
        contextTemp.lineTo(endX + (arrowLength * cosy + (arrowWidth / 2.0 * siny)), endY - (arrowWidth / 2.0 * cosy - arrowLength * siny));

        contextTemp.closePath();
        contextTemp.stroke();
    },
    getDistance:function(p1X,p1Y,p2X,p2Y) {
	    var num1 = Math.pow(p1X - p2X, 2);
	    var num2 = Math.pow(p1Y - p2Y, 2);
	    var distance = Math.sqrt(num1 + num2);
	    return distance;
    }
};
