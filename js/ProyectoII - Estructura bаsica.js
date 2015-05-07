// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

if (! Array.prototype.clone ) {
  Array.prototype.clone = function() {
    var arr1 = new Array();
    for (var property in this) {
        arr1[property] = typeof(this[property]) == 'object' ? this[property].clone() : this[property]
    }
    return arr1;
  }
}

//////////////////////////////////////////////////////////////////////////////
//////////////////// Variables y estructura básica ///////////////////////////
//////////////////////////////////////////////////////////////////////////////
var width = 1500,
    height = 1400,
	color,
	dialog= Dialog({
        speed:200
    });
	
d3.select('body')
	.attr('width', width)
	.attr('height', height)

var seleccionCultivo = "MAIZ";
var seleccionAnyo=2011;

var svg = d3.select('#graficoContainer')
			.attr('width', width)
			.attr('height', height)
			.append('svg')
			.attr('width', width)
			.attr('height', height);
			
var group = svg.append('g')
				.attr("transform","translate(500,-2425)");
var projection = d3.geo.albersUsa()
						.scale(6000);
var path = d3.geo.path().projection(projection);
var dataCantones = [];
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////



/////////////////////////// Carga info del json ////////////////////////////////
d3.json('data/cr_cantones - Final.json', function(json) {
	var dataset1 = [];
	var	arr = json.features;
	for(var i=0;i<arr.length;i++){
        var obj = arr[i]["properties"];
		var data = [obj["CAFE_2011"],obj["MAIZ_2011"],obj["ARROZ_2011"],obj["FRIJOL_2011"],obj["BANANO_2011"],obj["CEBOLLA_2011"],obj["PAPA_2011"],obj["CAFE_2010"],obj["MAIZ_2010"],obj["ARROZ_2010"],obj["FRIJOL_2010"],obj["BANANO_2010"],obj["CEBOLLA_2010"],obj["PAPA_2010"]];
		dataset1[dataset1.length] = [obj["NCANTON"].replace(/\s+/g, ''),data];
	}
	dataCantones=[].concat(dataset1);

});

//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/////////////////////// Función click de cada canton /////////////////////////
//////////////////////////////////////////////////////////////////////////////
function pathClick(evt, nombreDiv)
{
	var w = 500;
	var h = 600;
	var barPadding = 3;
	var margin = 50;
	var dataset = getData(nombreDiv.replace(/\s+/g, ''));
	if (seleccionAnyo == 2011){
		for (var i=14; i>=7; i--){
			dataset.remove(i);
		}
	}
	else{
		for (var i=7; i>=0; i--){
				dataset.remove(i);
		}
	}
	
	dialog.show({
            title: nombreDiv,
            content: '',
            ok: function(){  }
    });
		
	var svg2 = d3.select('#jcdevDialogTContent')
			.append('svg')
			.attr('width', w)
			.attr('height', h);
	
	var max = Math.max.apply(null, dataset);
	var rango = [0,max+1000];
	var rangoProductos = ["","Cafe","Maiz","Arroz","Frijol","Banano","Cebolla","Papa",""];
	var wCol = (w-margin) / dataset.length - barPadding;
	
	var rangoProductosX = [0,wCol/2, wCol/2 +wCol, wCol/2 +wCol*2, wCol/2 +wCol*3, wCol/2 +wCol*4, wCol/2 +wCol*5, wCol/2 +wCol*6, w-margin ];
	
	var y_extent = d3.extent(dataset, function(d){return d});
	var y_scale = d3.scale.linear()
	   				.range([h-margin, 0])
					.domain(rango);
					
			
	var product_scale = d3.scale.ordinal()
						.domain(rangoProductos)
						.range(rangoProductosX);
	
	svg2.selectAll("g")
		.data(dataset)
		.enter()
		.append("g")
		.attr("class", "barContainer")
		.append("rect")
		.attr("class", "bar")
		.attr("x", function(d, i) {
			return margin+5 +i *((w-margin) / dataset.length);
		})
		.attr("y",function(d){
			return  y_scale(d)
		})
		.attr("width", (w-margin) / dataset.length - barPadding)
		.attr("height", function(d){
			return (h-margin) -y_scale(d)}
		);
	
	var y_axis = d3.svg.axis().scale(y_scale).orient("left");
	
	d3.select("svg")
		.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + margin + ", 0 )")
		.call(y_axis);
		
	d3.select(".y.axis")
		.append("text")
		.text("Produccion en Hectareas")
		.attr("font-size","12px")
		.attr("transform", "rotate (-90, -43, 0) translate(-360, 2)");
		
		
	var x_axis = d3.svg.axis().scale(product_scale);
			d3.select("svg")
				.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate("+margin+"," + (h-margin) + ")")
				.call(x_axis);
				
			d3.select(".x.axis")
				.append("text")
				.text("Producto")
				.attr("font-size","12px")
				.attr("x", ((w-margin) / 2)-50)
				.attr("y", margin / 1.5);
	
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////
///////////////////// obtiene los datos de cada canton ///////////////////////
//////////////////////////////////////////////////////////////////////////////
function getData(nombreCanton){
	for(var i=0;i<dataCantones.length;i++){
		if(dataCantones[i][0] == nombreCanton){
			return dataCantones[i][1]
		}
	}
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/////////////////////////// Etiquetado ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {
 
	var changeTooltipPosition = function(event) {
	  var tooltipX = event.pageX - 8;
	  var tooltipY = event.pageY + 8;
	  $('div.tooltip').css({top: tooltipY, left: tooltipX});
	};
 
	var showTooltip = function(event) {
	  $('div.tooltip').remove();
	  $('<div class="tooltip">'+ event.target.getAttribute("nombre") + '</div>')
            .appendTo('body');
	  changeTooltipPosition(event);
	};
 
	var hideTooltip = function() {
	   $('div.tooltip').remove();
	};
 
	$(".canton").bind({
	   mousemove : changeTooltipPosition,
	   mouseenter : showTooltip,
	   mouseleave: hideTooltip
	});
});
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


function getRango(nombreCultivo, Anyo,dataC){
	var pos =  posCultivo(nombreCultivo, Anyo);
	var data =[];
	for(var i=0;i<dataC.length;i++){
		data.push(dataC[i][1][pos]);
	}
	return [menor(data),mayor(data)];
}


function mayor(data){
	var mayor = data[0];
	for (var i=1; i<data.length;i++){
		if(data[i] > mayor){
			mayor = data[i];
		}
	}
	return mayor;
	
}


function menor(data){
	var menor = data[0];
	for (var i=1; i<data.length;i++){
		if(data[i] < menor){
			menor = data[i];
		}
	}
	return menor;
	
}

function posCultivo(nombreCultivo, Anyo){
	var cultivos = ["CAFE","MAIZ","ARROZ","FRIJOL","BANANO","CEBOLLA","PAPA"];
	var res;
	for(var i=0; i<7;i++){
		if (nombreCultivo == cultivos[i]){
			res = 1;
		}
	}
	if (Anyo== 2010){
		res= res+7;
	}
	return res
}



function seleccionarDatoColor(d, nombreCultivo, Anyo){
	var data = [d.properties.CAFE_2011,d.properties.MAIZ_2011,d.properties.ARROZ_2011,d.properties.FRIJOL_2011,d.properties.BANANO_2011,d.properties.CEBOLLA_2011,d.properties.PAPA_2011, d.properties.CAFE_2010,d.properties.MAIZ_2010,d.properties.ARROZ_2010,d.properties.FRIJOL_2010,d.properties.BANANO_2010,d.properties.CEBOLLA_2010,d.properties.PAPA_2010];
	var i = posCultivo(nombreCultivo, Anyo);
	return data[i];
}




//////////////////////////////////////////////////////////////////////////////
//////////////////////////// Dibuja el mapa //////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

//var color = d3.scale.linear().domain(getRango(seleccionCultivo,seleccionAnyo,dataCantones)).range(['blue', 'red']);
	
d3.json('data/cr_cantones - Final.json', function(json) {
	group.selectAll("path")
		.data(json.features)
		.enter()
		.append("path")
		.attr("d", path)
		.attr("class", "canton")
		.attr("id", function(d){return d.properties.NCANTON.replace(/\s+/g, '');})
		.attr("nombre", function(d){return d.properties.NCANTON;})
	//	.attr("onmouseup", function(d){return "pathClick(evt,'"+ d.properties.NCANTON +"')";})
	//	.attr('fill', function(d){
	//		return color( seleccionarDatoColor(d,seleccionCultivo,seleccionAnyo));
	//	})
		.attr("data", function(d){return  [d.properties.CAFE_2011,d.properties.MAIZ_2011,d.properties.ARROZ_2011,d.properties.FRIJOL_2011,d.properties.BANANO_2011,d.properties.CEBOLLA_2011,d.properties.PAPA_2011]});
});
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

