$(document).ready(function(){
  ui.init();
  $.jrDraw.init("#canvasContainer");
});

var ui = {
    init: function () {
        $("#btnClear").bind("click",function(){
          $.jrDraw.clearMain();
          $.jrDraw.clearTemp();
        });

        $("#selWidth").change(function(){
		  $.jrDraw.setLineWidth($("#selWidth").val());
		});

        $("#selColor").change(function(){
		  $.jrDraw.setColor($("#selColor").val());
		});

        $("#selShape").change(function(){
		  $.jrDraw.setType($("#selShape").val());
		});
    }
}