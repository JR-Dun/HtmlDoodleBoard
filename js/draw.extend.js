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

        $(window).resize(function() {
            console.log('w:' + container.width());
            console.log('h:' + container.height());

            $('#canvasMain').attr({
                "width":container.width(),
                "height":container.height()
            });
            $('#canvasTemp').attr({
                "width":container.width(),
                "height":container.height()
            });
        });

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
                this.doodlePoint(x, y);
            }
            canvasLastX = x; canvasLastY = y;
        }
        else if(type == canvasEraserType)
        {
            if(isDown)
            {
                this.eraser(canvasLastX,canvasLastY,x, y);
            }
            else
            {
                this.eraserPoint(x,y);
            }
            canvasLastX = x; canvasLastY = y;
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
    //涂鸦
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
    doodlePoint:function(x, y) {
        contextTemp.beginPath();
        contextTemp.strokeStyle = canvasDrawColor;
        contextTemp.lineWidth = canvasDrawLineWidth;
        contextTemp.lineJoin = "round";
        contextTemp.moveTo(x, y);
        contextTemp.lineTo(x - 0.1, y - 0.1);
        contextTemp.closePath();
        contextTemp.stroke();
    },
    //橡皮擦
    eraser:function(startX, startY, endX, endY) {
        //获取两个点之间的剪辑区域四个端点
        var asin = canvasEraserWidth * Math.sin(Math.atan((endY-startY)/(endX-startX)));
        var acos = canvasEraserWidth * Math.cos(Math.atan((endY-startY)/(endX-startX)))
        var x1 = startX + asin;
        var y1 = startY - acos;
        var x2 = startX - asin;
        var y2 = startY + acos;
        var x3 = endX + asin;
        var y3 = endY - acos;
        var x4 = endX - asin;
        var y4 = endY + acos;

        //保证线条的连贯，所以在矩形一端画圆
        contextTemp.save();
        contextTemp.beginPath();
        contextTemp.arc(endX, endY, canvasEraserWidth, 0, 2 * Math.PI);
        contextTemp.clip();
        contextTemp.clearRect(0, 0, canvasTemp.width, canvasTemp.height);
        contextTemp.closePath();
        contextTemp.restore();

        //清除矩形剪辑区域里的像素
        contextTemp.save();
        contextTemp.beginPath();
        contextTemp.moveTo(x1,y1);
        contextTemp.lineTo(x3,y3);
        contextTemp.lineTo(x4,y4);
        contextTemp.lineTo(x2,y2);
        contextTemp.closePath();
        contextTemp.clip();
        contextTemp.clearRect(0, 0, canvasTemp.width, canvasTemp.height);
        contextTemp.restore();
    },
    eraserPoint:function(x, y) {
        contextTemp.beginPath();
        contextTemp.globalCompositeOperation = "destination-out";
        contextTemp.arc(x, y, canvasEraserWidth, 0, 2 * Math.PI);
        contextTemp.fill();
        contextTemp.closePath();
        contextTemp.globalCompositeOperation = "destination-over";
    },
    //直线
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
    //矩形
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
    //圆
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
    //箭头
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
    //获取两坐标间距离
    getDistance:function(p1X, p1Y, p2X, p2Y) {
        var num1 = Math.pow(p1X - p2X, 2);
        var num2 = Math.pow(p1Y - p2Y, 2);
        var distance = Math.sqrt(num1 + num2);
        return distance;
    },
    //实际坐标 转 逻辑坐标
    getLogicPoint:function(point, size) {
        var x = point.x / size.w - 0.5;
        var y = point.y / size.h - 0.5;
        var logicPoint = new JRPoint(x, y);
        return logicPoint;
    },
    //逻辑坐标 转 实际坐标
    getLocalPoint:function(point, size) {
        var x = (point.x + 0.5) * size.w;
        var y = (point.y + 0.5) * size.h;
        var localPoint = new JRPoint(x, y);
        return localPoint;
    },
    test:function() {
        var p = new JRPoint(2,3);
        var s = new JRSize(5,6);
        console.log(p);
        console.log(p.y);
        console.log(s);
        console.log(s.h);
    }
};


function JRPoint(x,y)
{
    this.x = x;
    this.y = y;
}

function JRSize(w,h)
{
    this.w = w;
    this.h = h;
}
