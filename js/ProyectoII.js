//////////////////////////////////////////////////////////////////////////////
///////////////// Instituto Tecnológico de Costa Rica ////////////////////////
//////////////////////// Escuela de Computación //////////////////////////////
////////////////////// Ingeniería en Computación /////////////////////////////
/////////////////// Visualización de la Información //////////////////////////
////////////////////////// Prof. Armando Arce ////////////////////////////////
////////////////////// Estudiantes : Javier Álvarez //////////////////////////
//////////////////////               Fernando Cardoce ////////////////////////
//////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////
//////////////////// Variables y estructura básica ///////////////////////////
//////////////////////////////////////////////////////////////////////////////
var width = 1300,
    height = 600,
	dialog= Dialog({
        speed:200
    });
	
var color = d3.scale.linear().domain([0, 66233.8]).range(['blue', 'red']);
	
d3.select('body')
	.attr('width', width)
	.attr('height', height)

var seleccionCultivo = "CAFE";
var seleccionAnyo=2010;
	

var projection = d3.geo.albersUsa()
						.scale(6000);
var path = d3.geo.path().projection(projection);


var dataCantones = [];

var svg = d3.select('#graficoContainer')
			.attr('width', width)
			.attr('height', height)
			.append('svg')
			.attr('width', width)
			.attr('height', height);

	

//////////////////////////////////////////////////////////////////////////////
////////////////////////////// Pestañas ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

svg.append("rect")
	.attr("x",100)
	.attr("y",40)
	.attr("height", 547)
	.attr("width", 1130)
	.attr("class", "fondo")
	.attr("fill","black");

var anyos = [2010,2011];
for (var i=0;i<anyos.length;i++){
	svg.append("rect")
		.attr("x", 100+60*i)
		.attr("y", 10)
		.attr("id","t"+anyos[i])
		.attr("height", 30)
		.attr("width", 60)
		.attr("class", "tab")
		.attr("onmouseup", function(d){return "tabClick(evt,"+anyos[i]+",'t"+anyos[i]+"')";})
	
svg.append("text")	
	.attr("x", 100+60*i+18)
	.attr("y",27)
	.text(anyos[i]+"")
	.attr("onmouseup", function(d){return "tabClick(evt,"+anyos[i]+",'t"+anyos[i]+"')";})
}

svg.select("#t2010")
	.attr("class", "tabs");
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////
////////////////////////////// Botones ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

var cultivos = ["CAFE","MAIZ","ARROZ","FRIJOL","BANANO","CEBOLLA","PAPA"];
for (var i=0;i<cultivos.length;i++){
	svg.append("rect")
		.attr("x", 1100)
		.attr("y", 80+ i*60)
		.attr("id","b"+cultivos[i])
		.attr("height", 30)
		.attr("width", 90)
		.attr("class", "boton")
		.attr("onmouseup", function(d){return "botonClick(evt,'"+cultivos[i]+"','b"+cultivos[i]+"')";});
	
svg.append("text")	
	.attr("x",1115)
	.attr("y",80+ i*60 + 20)
	.text(cultivos[i])
	.attr("onmouseup", function(d){return "botonClick(evt,'"+cultivos[i]+"','b"+cultivos[i]+"')";});
}

svg.select("#bCAFE")
	.attr("class", "botons");
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////	
	
	
			


var group = svg.append('g')
				.attr("transform","translate(500,-2395)")
				.attr("id","group");

	
/////////////////////////// Carga info del json ////////////////////////////////
d3.json('data/cr_cantones - Final.json', function(json) {
	var dataset1 = [];
	var	arr = json.features;
	for(var i=0;i<arr.length;i++){
        var obj = arr[i]["properties"];
		var data = [obj["CAFE_2011"],obj["MAIZ_2011"],obj["ARROZ_2011"],obj["FRIJOL_2011"],obj["BANANO_2011"],obj["CEBOLLA_2011"],obj["PAPA_2011"],obj["CAFE_2010"],obj["MAIZ_2010"],obj["ARROZ_2010"],obj["FRIJOL_2010"],obj["BANANO_2010"],obj["CEBOLLA_2010"],obj["PAPA_2010"]];
		dataset1[dataset1.length] = [obj["NCANTON"].replace(/\s+/g, ''),data];
	}
	dataCantones = dataset1;
});
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



// Obtiene el rango(mayor y menor) para colorear el mapa
function getRango(nombreCultivo, Anyo){
	var pos =  posCultivo(nombreCultivo, Anyo);
	var data =[];
	for(var i=0;i<dataCantones.length;i++){
		data.push(dataCantones[i][1][pos]);
	}
	return [menor(data),mayor(data)];
}

// Obtiene el mayor
function mayor(data){
	var mayor = data[0];
	for (var i=1; i<data.length;i++){
		if(data[i] > mayor){
			mayor = data[i];
		}
	}
	return mayor;
	
}

// Obtiene el menor
function menor(data){
	var menor = data[0];
	for (var i=1; i<data.length;i++){
		if(data[i] < menor){
			menor = data[i];
		}
	}
	return menor;
	
}

// Obtiene la posicion que ocupara cultiv+año en un array
function posCultivo(nombreCultivo, Anyo){
	var cultivos = ["CAFE","MAIZ","ARROZ","FRIJOL","BANANO","CEBOLLA","PAPA"];
	var res = 0;
	for(var i=0; i<7;i++){
		if (nombreCultivo == cultivos[i]){
			res = i;
		}
	}
	if (Anyo== 2010){
		res= res+7;
	}
	return res
}

// Selecciona el dato para colorear
function seleccionarDatoColor(d, nombreCultivo, Anyo){
	var data = [d.properties.CAFE_2011,d.properties.MAIZ_2011,d.properties.ARROZ_2011,d.properties.FRIJOL_2011,d.properties.BANANO_2011,d.properties.CEBOLLA_2011,d.properties.PAPA_2011, d.properties.CAFE_2010,d.properties.MAIZ_2010,d.properties.ARROZ_2010,d.properties.FRIJOL_2010,d.properties.BANANO_2010,d.properties.CEBOLLA_2010,d.properties.PAPA_2010];
	var i = posCultivo(nombreCultivo, Anyo);
	return data[i];
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////// Dibuja el mapa //////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
	d3.json('data/cr_cantones - Final.json', function(json) {
		group.selectAll("path")
			.data(json.features)
			.enter()
			.append("path")
			.attr("d", path)
			.attr("class", "canton")
			.attr("id", function(d){return d.properties.NCANTON.replace(/\s+/g, '');})
			.attr("nombre", function(d){return d.properties.NCANTON;})
			.attr('fill', function(d){
				return color( d.properties.CAFE_2011);
	     	})
			.attr("onmouseup", function(d){return "pathClick(evt,'"+ d.properties.NCANTON +"')";})
			.attr("data", function(d){return  [d.properties.CAFE_2011,d.properties.MAIZ_2011,d.properties.ARROZ_2011,d.properties.FRIJOL_2011,d.properties.BANANO_2011,d.properties.CEBOLLA_2011,d.properties.PAPA_2011]});
	});

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


//////////////////////////////////////////////////////////////////////////////
////////////Accion de los botones o tab, actualiza el mapa////////////////////
//////////////////////////////////////////////////////////////////////////////
function cambiarCultivoAnyo(cultivo,anyo){
	rango1 = getRango(cultivo,anyo);
	color = d3.scale.linear().domain(
		rango1
	).range(['blue', 'red']);
	seleccionAnyo = anyo;
	seleccionCultivo = cultivo;
	
	
	
	d3.json('data/cr_cantones - Final.json', function(json) {
		group.selectAll("path")
			.data(json.features)
			.attr('fill', function(d){
				var dato =  seleccionarDatoColor(d, cultivo, anyo);
				return color( 
					dato
				);
	     	});
		
	});
	
}



//////////////////////////////////////////////////////////////////////////////
/////////////////////// Función click de cada año /////////////////////////
//////////////////////////////////////////////////////////////////////////////
function tabClick(evt, anyo,id)
{
	seleccionAnyo = anyo;
	cambiarCultivoAnyo(seleccionCultivo,seleccionAnyo);
	d3.selectAll(".tabs")
		.attr("class","tab");
	d3.select("#"+id)
		.attr("class","tabs");
}

//////////////////////////////////////////////////////////////////////////////
/////////////////////// Función click de cada cultivo /////////////////////////
//////////////////////////////////////////////////////////////////////////////
function botonClick(evt, cultivo,id)
{
	seleccionCultivo = cultivo;
	cambiarCultivoAnyo(seleccionCultivo,seleccionAnyo);
	d3.selectAll(".botons")
		.attr("class","boton");
	d3.select("#"+id)
		.attr("class","botons");
}

