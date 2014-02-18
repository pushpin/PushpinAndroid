$("button").click(function(){
	$('.list-group').html(panelsStack.pop());
});

function subtypes(element){
	$.getJSON("resources/classifications.json", function(data){
	getAll(data,element);});
};
		
var i = 1;
var panelsStack = [];
function buildPanel(res, parentLabel){
	$('#form-title').empty(parentLabel);
	$('#form-title').append(parentLabel);			

	var panels = $('.list-group').html();
	$('.list-group').html(res.join(""));			
	panelsStack.push(panels);
	
}

var typePath = [];
			
function getAll( input, target ) {
    var result = [];
    
    function parseData( input, target ) {
        $.each( input, function ( index, obj ) {
        		        	
        	if(obj.label == target){
        		typePath.push(obj.label);
        		if(typeof obj.child_classifications == "undefined"){localStorage.setItem("testing",typePath); window.location.href ='form.html';}
        		else{
	        		$.each(obj.child_classifications, function(i2,obj2){	        			
	        			result.push("<a id='" + obj2.value + "' onclick='subtypes(\""+obj2.label+"\")' class='list-group-item'>" + obj2.label+"</a>");
	        		});
	        		
	        		if (result.length > 0){
	        			buildPanel(result, obj.label);
	        		}
        		}	
        	}
            else {
                switch ( $.type( obj ).toLowerCase() ) {
                    case "object":
                    case "array":
                        parseData( obj, target );
                        break;
                }
            }
        } );
    }
    parseData( input, target );
}
					
$.getJSON("resources/classifications.json", function(data){
	var items = [];
		$.each(data,function(i, value){		     
	     $.each(value, function(index, obj){
	     	if (obj.name == "OSM Types"){		     		
	  			arrowIcon = '<img style="float: right; width:10px;" src="resources/images/disclosure.png" class="img-circle"/>';
     			$.each(obj.items, function(index2, obj2){		     				
     				items.push( "<a id='" + index2 + "' onclick='subtypes(\""+obj2.label+"\")' class='list-group-item'>" + obj2.label + arrowIcon + "</a>" );
     			});
	     			
	     	};
	      });
		});
	$('.list-group').append(items.join(""));
});