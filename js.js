$(document).ready(function(){
    $("#p").click(function(){
        var variable = $("#p").hasClass("intro"); //pregunta si el elemento seleccionado tiene la clase intro

       // alert(variable);
    });
});

// $("#hide").click(function(){
//     $("p").hide(function(){
//         alert("se muestra");
//     });
//   });
  $("#show").click(function(){
    $("p").show( function(){
        alert("nicolas reyes");
    });
});


$(".AdminWeb-contenedor .dd-item-1 .AdminWeb-texto").bind('dblclick',function(){
    alert("Evento doble click");

});

$(".AdminWeb-contenedor .dd-item-1 .seleccioname").click( function (){

    var href = $(this).attr('href'); //selecciona de la etiqueta a su atributo.
    alert(href);
});

$(".AdminWeb-contenedor .dd-item-1 .AdminWeb-img_menu").click( function (){

    var html = $(this).html(); //selecciona todo el html y su contenido que esta dentro.
    alert(html);
});

$("#serialice").click(function(){
    var x = $("form").serializeArray();

    $.each(x, function(i, field){
        alert(field.name+'/'+field.value);
    });
    
});

$("#agregarprop").click(function(){
    var $x = $(".propdiv");
    $x.attr("style","background:red;"); //selecciona, agrega y modifica un atributo de una etiqueta
    $x.prop("color", "FF0000");
  
  });

  $('.otros_dialog button').click(function(){
    
    //lo que selecciono no tiene la clase otros_seleccionado
    if(!$(this).hasClass('otros_seleccionado')){
        $('.otros_dialog button').removeClass('otros_seleccionado');
        $(this).addClass('otros_seleccionado');

    } else {
        $(this).removeClass('otros_seleccionado');
       
    }
});

$('.AdminWeb-contenedor .AdminWeb_grid .list-menu-grid').click(function(){
    $(this).parent().parent().parent().parent().parent().parent().find('h1').text('pagina de prueba');
    

    $('a').addClass("colores");
    $('button').addClass("colores");

    

});



//activacion de nestable
$(document).ready(function()
{

    var updateOutput = function(e)
    {
        var list   = e.length ? e : $(e.target),
            output = list.data('output');
        if (window.JSON) {
            output.val(window.JSON.stringify(list.nestable('serialize')));//, null, 2));
        } else {
            output.val('JSON browser support required for this demo.');
        }
    };

    // activate Nestable for list 1
    $('#nestable').nestable({
        group: 1
    })
    .on('change', updateOutput);

    // output initial serialised data
    updateOutput($('#nestable').data('output', $('#nestable-output')));



});


