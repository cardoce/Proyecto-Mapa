/** 
* Verifies default value for parameters.
*/
function jcdevDefaults(parameters, defaults){
    $.each(defaults,
        function(key, value){
            if (eval('parameters.'+key) == undefined){
                eval('parameters.'+key +' = ' + value);
            }
        });
    return parameters;
}

/**
 * Defines a dialog to display even messages or web pages.
 * Parameters:
 *      speed: number of milliseconds that takes the fade in effect of the dialog.
 *      width: width of the dialog. Default value is 80%.
 *      height: height of the dialog. Default value is 50%.
 *      title: text to display in the header of the dialog.
 *      
 */
function Dialog(parameters){
    var jcdevDialog = parameters;
    
    parameters = jcdevDefaults(parameters, {
        speed: 500
    });
    
    $('body').prepend('<div id="jcdevDialog"></div>');
    
    jcdevDialog = parameters;
    
    jcdevDialog.ok = function(){
        this.hide();
        $('#jcdevDialog').html('');
    }
    
    jcdevDialog.show = function(parameters){
        parameters = jcdevDefaults(parameters, {
            width: document["body"].attributes[0].value * 1, 
            height: document["body"].attributes[1].value * 1.2
        });
		
    
    
        $('#jcdevDialog').html(
            '<div id="jcdevDialogBack"></div>'
            + '<center><div id="jcdevDialogContent" style="'
            + 'width: '+ parameters.width + 'px; '
            + 'height: '+ parameters.height + 'px; '
            + '">'+ parameters.content + '</center></div>'
    
            );

        var startHeight = ( document.height / 2) - (parameters.height / 2);
        var startWidth  = ( document.width / 2) - (parameters.width / 2);
    
        $('#jcdevDialogContent').css({
            top: startHeight, 
            left: startWidth
        });
    
        if (parameters.url == undefined && parameters.content == undefined){
            alert('Missing url and container for dialog!');
            return null;
        }
        
        
        $('#jcdevDialogContent').html(buildBody(parameters));
        $('#jcdevDialogBack').css('display', 'block');
        
        $('#jcdevDialogOk').click(
            function(obj){
                parameters.ok();
                $('#jcdevDialog').html('');
            });
        
		
		$("#jcdevDialog").focus();
        $('#jcdevDialogContent').fadeIn(this.speed); 
		
    };
    
    jcdevDialog.showError = function(errorMessage){
        var errorContent = '<table>'
        + '<tr><td><img style="width:30px; height:30px;" src="'+ jcdevImgPath('error.png')+ '" /> </td>'
        + '<td>' + errorMessage + '<td></tr>'
        + '</table>';
    
        this.show({
            width:500,
            height:200,
            content: errorContent, 
            title:'Error', 
            ok: function(){}
        });  
    };
    
    return jcdevDialog;
}


/**
 * Builds the content to display in the dialog.
 */
function buildBody(parameters){
    var body = '';
    if (parameters.url != undefined){
        body += '<iframe allowfullscreen="true" frameborder="0" src="'+ parameters.url + '" style=" border: none 0px transparent;width:100%; height:100%"></iframe>';
    }
    
    if (parameters.content != undefined){
        body += parameters.content;
    }
    var finalBody = 
    '<table cellpadding="0" cellspacing="0" id="jcdevDialogT" style = "border=1px solid">' +
    '<tr><td id="jcdevDialogTHeader"><center><div id="jcdevDialogTitle">'+ parameters.title+'</div></center></td>'+
    '<tr><td id="jcdevDialogTContent">' + body + '</td></tr>' +
    '<tr><td id="jcdevDialogTButtons"><center><div id="jcdevDialogOk">VOLVER</div></center></td></tr>'+
    '</table>';

    
    
    return finalBody;
}
    
