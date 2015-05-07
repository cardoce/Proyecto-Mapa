//////////////////////////////////////////////////////////////////////////////
/////////////////////// Función click de cada canton /////////////////////////
//////////////////////////////////////////////////////////////////////////////
function pathClick(evt, nombreDiv)
{
	var w = 500;
	var h = 600;
	var barPadding = 3;
	var margin = 50;
	var dataset1 = getData(nombreDiv.replace(/\s+/g, ''));
	var dataset = [];
	if (seleccionAnyo == 2011){
		for (var i=0; i<7; i++){
			dataset.push(dataset1[i]);
		}
	}
	else{
		for (var i=7; i<14; i++){
			dataset.push(dataset1[i]);
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