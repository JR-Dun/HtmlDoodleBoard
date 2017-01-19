var canvasMousePressed = false;
var canvasLastX, canvasLastY;
var canvasMain, canvasTemp;
var contextMain, contextTemp;
var canvasEraserWidth = 40;
var canvasEraserType = '1';

var canvasDrawType = 0,canvasDrawColor = 'black',canvasDrawLineWidth = 4;

$.jrDraw = {
    setType:function(value) {
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
    setColor:function(value) {
        canvasDrawColor = value;
    },
    setLineWidth:function(value) {
        canvasDrawLineWidth = value;
    },
    getBrushWidth:function(w) {
        return w / 1000.0 * $('#canvasTemp').width();
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

        $.jrDraw.binding();
    },
    binding:function() {
        var mobile   = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent); 
        if(mobile)
        {
            $('#canvasTemp').bind('touchstart', function (e) {
                canvasMousePressed = true;
                var point = e.originalEvent.touches[0];
                $.jrDraw.draw(point.pageX - $(this).offset().left, point.pageY - $(this).offset().top, false);
            });
        
            $('#canvasTemp').bind('touchmove', function (e) {
                if (canvasMousePressed) {
                    var point = e.originalEvent.touches[0];
                    $.jrDraw.draw(point.pageX - $(this).offset().left, point.pageY - $(this).offset().top, true);
                }
            });
        
            $('#canvasTemp').bind('touchend', function (e) {
                $.jrDraw.end();
            });
        }
        else
        {
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
        }
    },
    draw:function(x, y, isDown) {
        var type = canvasDrawType;

        if(type == '0')
        {
            if (isDown) {
                this.doodle(canvasLastX,canvasLastY,x, y, canvasDrawColor, $.jrDraw.getBrushWidth(canvasDrawLineWidth));
            }
            else
            {
                this.doodlePoint(x, y, canvasDrawColor, $.jrDraw.getBrushWidth(canvasDrawLineWidth));
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
                this.line(canvasLastX,canvasLastY,x, y, canvasDrawColor, $.jrDraw.getBrushWidth(canvasDrawLineWidth));
                return;
            }
            canvasLastX = x; canvasLastY = y;
        }
        else if(type == '3')
        {
            if (isDown) {
                this.rect(canvasLastX,canvasLastY,x, y, canvasDrawColor, $.jrDraw.getBrushWidth(canvasDrawLineWidth));
                return;
            }
            canvasLastX = x; canvasLastY = y;
        }
        else if(type == '4')
        {
            if (isDown) {
                this.round(canvasLastX,canvasLastY,x, y, canvasDrawColor, $.jrDraw.getBrushWidth(canvasDrawLineWidth));
                return;
            }
            canvasLastX = x; canvasLastY = y;
        }
        else if(type == '5')
        {
            if (isDown) {
                this.arrow(canvasLastX,canvasLastY,x, y, canvasDrawColor, $.jrDraw.getBrushWidth(canvasDrawLineWidth));
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
    doodle:function(startX, startY, endX, endY, lineColor, lineWidth) {
        contextTemp.beginPath();
        contextTemp.strokeStyle = lineColor;
        contextTemp.lineWidth = lineWidth;
        contextTemp.lineJoin = "round";
        contextTemp.moveTo(startX, startY);
        contextTemp.lineTo(endX, endY);
        contextTemp.closePath();
        contextTemp.stroke();
    },
    doodlePoint:function(x, y, lineColor, lineWidth) {
        contextTemp.beginPath();
        contextTemp.strokeStyle = lineColor;
        contextTemp.lineWidth = lineWidth;
        contextTemp.lineJoin = "round";
        contextTemp.moveTo(x, y);
        contextTemp.lineTo(x - 0.1, y - 0.1);
        contextTemp.closePath();
        contextTemp.stroke();
    },
    //橡皮擦
    eraser:function(startX, startY, endX, endY) {
        if(startX == endX && startY == endY) return;

        contextTemp.beginPath();
        contextTemp.globalCompositeOperation = "destination-out";
        contextTemp.lineWidth = $.jrDraw.getBrushWidth(canvasEraserWidth);
        contextTemp.lineCap = "round";
        contextTemp.lineJoin = "round";
        contextTemp.save();
        contextTemp.moveTo(startX,startY);
        contextTemp.lineTo(endX,endY);
        contextTemp.closePath();
        contextTemp.stroke();
        contextTemp.globalCompositeOperation = "destination-over";
    },
    eraserPoint:function(x, y) {
        contextTemp.beginPath();
        contextTemp.globalCompositeOperation = "destination-out";
        contextTemp.lineWidth = $.jrDraw.getBrushWidth(canvasEraserWidth);
        contextTemp.lineCap = "round";
        contextTemp.lineJoin = "round";
        contextTemp.save();
        contextTemp.moveTo(x, y);
        contextTemp.lineTo(x - 0.1, y - 0.1);
        contextTemp.closePath();
        contextTemp.stroke();
        contextTemp.globalCompositeOperation = "destination-over";
    },
    //直线
    line:function(startX, startY, endX, endY, lineColor, lineWidth) {
        contextTemp.beginPath();
        $.jrDraw.clearTemp();

        contextTemp.strokeStyle = lineColor;
        contextTemp.lineWidth = lineWidth;
        contextTemp.lineJoin = "round";
        contextTemp.moveTo(startX, startY);
        contextTemp.lineTo(endX, endY);
        contextTemp.closePath();
        contextTemp.stroke();
    },
    //矩形
    rect:function(startX, startY, endX, endY, lineColor, lineWidth) {
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

        contextTemp.beginPath();
        $.jrDraw.clearTemp();

        contextTemp.strokeStyle = lineColor;
        contextTemp.lineWidth = lineWidth;
        contextTemp.lineJoin = "round";
        contextTemp.rect(originX, originY, rectW, rectH);
        contextTemp.closePath();
        contextTemp.stroke();
    },
    //圆
    round:function(startX, startY, endX, endY, lineColor, lineWidth) {
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

        contextTemp.beginPath();
        $.jrDraw.clearTemp();

        contextTemp.strokeStyle = lineColor;
        contextTemp.lineWidth = lineWidth;
        contextTemp.lineJoin = "round";
        contextTemp.moveTo(centerX, centerY-arcH);
        contextTemp.bezierCurveTo(centerX+control, centerY-arcH, centerX+control, centerY+arcH, centerX, centerY+arcH);
        contextTemp.bezierCurveTo(centerX-control, centerY+arcH, centerX-control, centerY-arcH, centerX, centerY-arcH);
        contextTemp.closePath();
        contextTemp.stroke();
    },
    //箭头
    arrow:function(startX, startY, endX, endY, lineColor, lineWidth) {
        var slopy, cosy, siny;
        //箭头尺寸
        var arrowLength = lineWidth * 5;
        var arrowWidth = lineWidth * 5;
        //
        var distance = this.getDistance(startX,startY,endX,endY);
        if(arrowWidth >= distance * 0.5)
        {
            arrowLength = arrowWidth = distance * 0.5;
        }

        slopy = Math.atan2((startY - endY), (startX - endX));
        cosy = Math.cos(slopy);
        siny = Math.sin(slopy);

        contextTemp.beginPath();
        $.jrDraw.clearTemp();

        contextTemp.strokeStyle = lineColor;
        contextTemp.lineWidth = lineWidth;
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
        // var p = new JRPoint(2,3);
        // var s = new JRSize(5,6);
        // console.log(p);

        var arrayPoint = [];

        arrayPoint.push(new JRPoint(135,120));
        arrayPoint.push(new JRPoint(150,104));
        arrayPoint.push(new JRPoint(172,96));
        arrayPoint.push(new JRPoint(186,103));
        arrayPoint.push(new JRPoint(194,118));
        arrayPoint.push(new JRPoint(195,135));
        arrayPoint.push(new JRPoint(199,153));
        arrayPoint.push(new JRPoint(201,173));
        arrayPoint.push(new JRPoint(204,195));
        arrayPoint.push(new JRPoint(207,215));
        arrayPoint.push(new JRPoint(214,231));
        arrayPoint.push(new JRPoint(223,234));
        arrayPoint.push(new JRPoint(238,231));
        arrayPoint.push(new JRPoint(246,225));
        arrayPoint.push(new JRPoint(250,213));
        arrayPoint.push(new JRPoint(255,197));
        arrayPoint.push(new JRPoint(260,192));
        arrayPoint.push(new JRPoint(288,195));
        arrayPoint.push(new JRPoint(297,213));
        arrayPoint.push(new JRPoint(301,240));
        arrayPoint.push(new JRPoint(299,262));
        arrayPoint.push(new JRPoint(311,299));
        arrayPoint.push(new JRPoint(320,314));
        arrayPoint.push(new JRPoint(332,317));
        arrayPoint.push(new JRPoint(345,316));
        arrayPoint.push(new JRPoint(357,308));
        arrayPoint.push(new JRPoint(367,294));
        arrayPoint.push(new JRPoint(371,277));
        arrayPoint.push(new JRPoint(405,274));
        arrayPoint.push(new JRPoint(418,284));
        arrayPoint.push(new JRPoint(418,285));
        arrayPoint.push(new JRPoint(421,296));
        arrayPoint.push(new JRPoint(420,312));
        arrayPoint.push(new JRPoint(420,321));
        arrayPoint.push(new JRPoint(421,333));
        arrayPoint.push(new JRPoint(421,348));
        arrayPoint.push(new JRPoint(426,364));
        arrayPoint.push(new JRPoint(453,362));
        arrayPoint.push(new JRPoint(480,350));
        arrayPoint.push(new JRPoint(504,338));
        arrayPoint.push(new JRPoint(516,332));
        arrayPoint.push(new JRPoint(547,321));
        arrayPoint.push(new JRPoint(564,314));
        arrayPoint.push(new JRPoint(565,314));
        arrayPoint.push(new JRPoint(586,306));

        //draw
        arrayPoint.forEach(function(point, index) {
            if (index > 0) {
                $.jrDraw.doodle(canvasLastX,canvasLastY,point.x, point.y, canvasDrawColor, $.jrDraw.getBrushWidth(canvasDrawLineWidth));
            }
            else
            {
                $.jrDraw.doodlePoint(point.x, point.y, canvasDrawColor, $.jrDraw.getBrushWidth(canvasDrawLineWidth));
            }
            canvasLastX = point.x; canvasLastY = point.y;
        });

        //eraser
        arrayPoint.forEach(function(point, index) {
            if(index > 10 && index < 20) {
                if (index > 0) {
                    $.jrDraw.eraser(canvasLastX,canvasLastY,point.x, point.y);
                }
                else
                {
                    $.jrDraw.eraserPoint(point.x, point.y);
                }
                canvasLastX = point.x; canvasLastY = point.y;
            }
        })  
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

