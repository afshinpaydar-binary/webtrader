define(["jquery","jquery-ui","color-picker","ddslick"],function(a){function b(){a(this).dialog("close"),a(this).find("*").removeClass("ui-state-error")}function c(c,d){require(["css!charts/indicators/mama/mama.css"]),require(["text!charts/indicators/mama/mama.html"],function(e){var f="#cd0a0a";e=a(e),e.appendTo("body"),e.find("input[type='button']").button(),e.find("#mama_stroke").colorpicker({part:{map:{size:128},bar:{size:128}},select:function(b,c){a("#mama_stroke").css({background:"#"+c.formatted}).val(""),f="#"+c.formatted},ok:function(b,c){a("#mama_stroke").css({background:"#"+c.formatted}).val(""),f="#"+c.formatted}});var g="Solid";a("#mama_dashStyle").ddslick({imagePosition:"left",width:148,background:"white",onSelected:function(b){a("#mama_dashStyle .dd-selected-image").css("max-width","115px"),g=b.selectedData.value}}),a("#mama_dashStyle .dd-option-image").css("max-width","115px"),e.dialog({autoOpen:!1,resizable:!1,width:335,modal:!0,my:"center",at:"center",of:window,dialogClass:"mama-ui-dialog",buttons:[{text:"OK",click:function(){var c={fastLimit:parseFloat(e.find("#mama_fast_limit").val()),slowLimt:parseFloat(e.find("#mama_slow_limit").val()),stroke:f,strokeWidth:parseInt(e.find("#mama_strokeWidth").val()),dashStyle:g,appliedTo:parseInt(e.find("#mama_appliedTo").val())};a(a(".mama").data("refererChartID")).highcharts().series[0].addIndicator("mama",c),b.call(e)}},{text:"Cancel",click:function(){b.call(this)}}]}),e.find("select").selectmenu(),a.isFunction(d)&&d(c)})}return{open:function(b){return 0==a(".mama").length?void c(b,this.open):void a(".mama").data("refererChartID",b).dialog("open")}}});