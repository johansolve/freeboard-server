/*
 * Copyright 2012,2013 Robert Huitema robert@42.co.nz
 * 
 * This file is part of FreeBoard. (http://www.42.co.nz/freeboard)
 *
 *  FreeBoard is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.

 *  FreeBoard is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.

 *  You should have received a copy of the GNU General Public License
 *  along with FreeBoard.  If not, see <http://www.gnu.org/licenses/>.
 */


function resizeLog(amount){
	if(amount==null){
		amount = zk.Widget.$('$logScale').getValue();
	}else{
		amount=1+(1*amount);
	}
	if(amount==0.0)return;
	var wsize = $("#canvasLog").width();
	var hsize = $("#canvasLog").height();
	$("#canvasLog").width(wsize*amount);
	$("#canvasLog").height(hsize*amount);
	var wsmallSize =  $("#canvasWaypoint").width();
	var hsmallSize =  $("#canvasWaypoint").height();
	$("#canvasHeading").width(wsmallSize*amount);
	$("#canvasHeading").height(hsmallSize*amount);
	$("#canvasWaypoint").width(wsmallSize*amount);
	$("#canvasWaypoint").height(hsmallSize*amount);
	var wLat =  $("#canvasLat").width();
	var hLat =  $("#canvasLat").height();
	$("#canvasLat").width(wLat*amount);
	$("#canvasLat").height(hLat*amount);
	$("#canvasLon").width(wLat*amount);
	$("#canvasLon").height(hLat*amount);
	this.initLogg();
}
function Logg () {
	this.onmessage = function (mArray) {
	
		jQuery.each(mArray, function(i, data) {
			//avoid commands
			if(data && data.indexOf('#')>=0)return true;
			
			if (data && data.indexOf('LAT:') >= 0) {
				var c = parseFloat(data.substring(4));
				if($.isNumeric(c)){
					if(c>0){
						lcdLat.setValue(c.toFixed(5)+' N');
					}else{
						lcdLat.setValue(Math.abs(c.toFixed(5))+' S');
					}
				}
				c=null;
			}
			if (data && data.indexOf('LON:') >= 0) {
				var c = parseFloat(data.substring(4));
				if($.isNumeric(c)){
					if(c>0){
						lcdLon.setValue(c.toFixed(5)+' E');
					}else{
						lcdLon.setValue(c.toFixed(5)+' W');
					}
				}
				c=null;
			}
			if (data && data.indexOf('SOG:') >= 0) {
				var c = parseFloat(data.substring(4));
				if($.isNumeric(c)){
					lcdLog.setValue(c);
				}
				c=null;
			}
			if (data && data.indexOf('MGH:') >= 0) {
				var c = parseFloat(data.substring(4));
				if($.isNumeric(c)){
					lcdHeading.setValue(c);
				}
				c=null;
			}
			if (data && data.indexOf('YAW:') >= 0) {
				var c = parseFloat(data.substring(4));
				if($.isNumeric(c)){
					// -180 <> 180
					if (c >= 179) {
						lcdWaypoint.setValue(-(360 - c));
					} else {
						lcdWaypoint.setValue(c);
					}
				}
				c=null;
			}
			data=null;
		});
	}
	
}



function initLogg() {
	//if we cant do canvas, skip out here!
	if(!window.CanvasRenderingContext2D)return;
	// Initialzing lcds
	// log
	lcdLat = new steelseries.DisplaySingle('canvasLat', {
		// gaugeType : steelseries.GaugeType.TYPE4,
		//width : document.getElementById('canvasLat').width,
		//height : document.getElementById('canvasLat').height,
		lcdDecimals : 5,
		lcdColor: steelseries.LcdColor.BEIGE,
		//unitString:"",
		unitStringVisible: false,
		valuesNumeric: false	

	});
	lcdLon = new steelseries.DisplaySingle('canvasLon', {
		// gaugeType : steelseries.GaugeType.TYPE4,
		//width : document.getElementById('canvasLon').width,
		//height : document.getElementById('canvasLon').height,
		lcdDecimals : 5,
		lcdColor: steelseries.LcdColor.BEIGE,
		//unitString:"",
		unitStringVisible: false,
		valuesNumeric: false

	});
	
	// log
	lcdLog = new steelseries.DisplayMulti('canvasLog', {
		// gaugeType : steelseries.GaugeType.TYPE4,
		//width : document.getElementById('canvasLog').width,
		//height : document.getElementById('canvasLog').height,
		lcdDecimals : 1,
		lcdColor: steelseries.LcdColor.BEIGE,
		headerString : "Knots",
		headerStringVisible : true,
		detailString : "Avg: ",
		detailStringVisible : true,
	// unitString:"Knts",
	// unitStringVisible: true

	});
	
	// heading
	lcdHeading = new steelseries.DisplayMulti('canvasHeading', {
		//width : document.getElementById('canvasHeading').width,
		//height : document.getElementById('canvasHeading').height,
		lcdDecimals : 0,
		lcdColor: steelseries.LcdColor.BEIGE,
		headerString : "Heading(M)",
		headerStringVisible : true,
		detailString : "Avg(M): ",
		detailStringVisible : true,
	});

	// waypoint
	lcdWaypoint = new steelseries.DisplayMulti('canvasWaypoint', {
		//width : document.getElementById('canvasWaypoint').width,
		//height : document.getElementById('canvasWaypoint').height,
		lcdDecimals : 0,
		lcdColor: steelseries.LcdColor.BEIGE,
		headerString : "To Waypoint",
		headerStringVisible : true,
		detailString : "ETA: ",
		detailStringVisible : true,
	});
	lcdWaypoint.setValue(0);


	addSocketListener(new Logg());
}
