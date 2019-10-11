RightNow.namespace('Custom.Widgets.AdminWeb.elementos');

Custom.Widgets.AdminWeb.elementos = RightNow.Widgets.extend({
    constructor: function () {
        var widget = this;
        var AdminWeb = widget.data.js.AdminWeb;
        var identificador = widget.data.attrs.identificador;
        var elemento = '.'+AdminWeb.tipo+'_'+identificador;
        var w_id = this.data.info.w_id;
        var url_ajax_obtener_elemento = this.data.attrs.obtener_elemento;
        var url_ajax_generar_base64 = this.data.attrs.generar_base64;

        //declaro ventana como arreglo para guardar ventana de de globos y header 
        ventana = [];


        //Permitir que otro widget consuma los datos de este widget
        RightNow.Event.subscribe('subscribeIniciarBanner', this.subscribeIniciarBanner, this);
        $(elemento+' .AdminWeb_overlay').click(function(){
            if(!$('.AdminWeb_panel .panel_header').hasClass('panel_cargando')) {
                $('.AdminWeb_panel .panel_header').html('<label class="tipo_elemento">'+AdminWeb.tipo+'</label> - <label class="nombre_elemento">'+identificador+'</label>');
                var data_obtener_elemento = new RightNow.Event.EventObject(widget, {
                    data: {
                        w_id: w_id
                        , identificador: identificador,
                    }
                });
                $('.AdminWeb_panel .panel_header').addClass('panel_cargando');
                $('.AdminWeb_panel > .panel_body > .panel_content > div').html('');
                    RightNow.Ajax.makeRequest(url_ajax_obtener_elemento, data_obtener_elemento.data, {
                        successHandler: function (data) {
                            $('.AdminWeb_panel .panel_header').removeClass('panel_cargando');
                            $('.AdminWeb_panel .panel_izquierdo .dd-empty').remove();
                            var html = '';
                            if(data.tipo=='menu') {
                                html = $.parseHTML( data.codigo );
                                $('.AdminWeb_panel > .panel_body > .panel_content > .panel_izquierdo').html(data.codigo);
                                if($('.AdminWeb_panel > .panel_body > .panel_content > .panel_izquierdo ul li').length == 0){
                                    var li_default = '<li class=""><a target="_parent"><div class="AdminWeb-texto">Nuevo elemento</div></a><ul class="AdminWeb_menu ui-sortable" style=""></ul></li>';
                                    $('.AdminWeb_panel > .panel_body > .panel_content > .panel_izquierdo ul').append(li_default);
                                }
                                $.each($(".panel_content > .panel_izquierdo .AdminWeb_menu li a"),function(index,a){
                                    if(typeof $(a).attr('href') != 'undefined') {
                                        $(a).attr('alt',$(a).attr('href'));
                                        $(a).removeAttr('href');
                                    } else {
                                        $(a).attr('alt','');
                                    }
                                });
                                iniciar_sortable('menu',true,widget);
                                //recalcular();
                            } else if(data.tipo=='banner') {
                                html = $.parseHTML( data.codigo );
                                $('.AdminWeb_panel > .panel_body > .panel_content > .panel_izquierdo').html(data.codigo);
                                if($('.AdminWeb_panel > .panel_body > .panel_content > .panel_izquierdo > div.rn_banner > div').length == 0){
                                    var div_default = '<div class=""><a target="_parent" href=""><img src="/euf/assets/url_de_imagen.png"><div class="AdminWeb-html caption center-align"></div></a></div>';
                                    $('.AdminWeb_panel > .panel_body > .panel_content > .panel_izquierdo > div.rn_banner').append(div_default);
                                }
                                $.each($(".panel_content > .panel_izquierdo .AdminWeb_banner div a"),function(index,a){
                                    if(typeof $(a).attr('href') != 'undefined') {
                                        $(a).attr('alt',$(a).attr('href'));
                                        $(a).removeAttr('href');
                                    } else {
                                        $(a).attr('alt','');
                                    }
                                });
                                iniciar_sortable('banner');
                            } else if(data.tipo=='etiqueta') {
                                html = '';
                                var etiqueta = $(data.codigo);
                                var href = etiqueta.find('> a').attr('href');
                                var target = etiqueta.find('> a').attr('target');
                                var titulo = etiqueta.find('> a > ul > li.elemento_texto').html();
                                var imagen = etiqueta.find('> a > ul > li.elemento_img > img');
                                var imagenbase64 = imagen.attr('src');

                                html += '<form enctype="multipart/form-data" id="editar_etiquetas" class="editar_etiquetas">';
                                    html += '<div class="campo_etiquetas">';
                                        html += '<div><label>Título</label></div>';
                                        html += '<div>';
                                            html += '<input name="titulo" autocomplete="off" placeholder="Ingrese título" type="text" value="">';
                                        html += '</div>';
                                    html += '</div>';
                                    html += '<div class="campo_etiquetas">';
                                        html += '<div><label>URL</label></div>';
                                        html += '<div>';
                                            html += '<input name="href" autocomplete="off" placeholder="Ingrese href" type="text" value="'+href+'">';
                                        html += '</div>';
                                    html += '</div>';
                                    html += '<div class="campo_etiquetas">';
                                        html += '<div><label>Target</label></div>';
                                        html += '<div>';
                                            html += '<select name="target"><option value="_parent">Parent</option><option value="_blank">Blank</option></select>';
                                        html += '</div>';
                                    html += '</div>';
                                    html += '<div class="campo_etiquetas">';
                                        html += '<div><label>Imágen</label></div>';
                                        html += '<div class="cuadro_imagen">';
                                            html += '<img src="'+imagenbase64+'"/>';

                                        html += '</div>';
                                        html += '<input name="file_imagen" class="file_imagen" type="file">';
                                    html += '</div>';
                                html += '</form>';

                                $('.AdminWeb_panel > .panel_body > .panel_content > .panel_izquierdo').html(html);
                                $('select[name="target"]').val(target);
                                $('input[name="titulo"]').val(titulo);
                                $('.cuadro_imagen').click(function(){
                                    if(!$('.cuadro_imagen').hasClass('imagen_cargando')) {
                                        $('.campo_etiquetas > input.file_imagen').click();
                                    }
                                });
                                $('.campo_etiquetas > input.file_imagen').change(function(){
                                    $('.cuadro_imagen').addClass('imagen_cargando');
                                    var data_guardar_base64 = new RightNow.Event.EventObject(widget, {
                                        data: {
                                            w_id: w_id,
                                        }
                                    });
                                    $.each($('#editar_etiquetas').serializeArray(),function(index,campo){
                                      if(typeof campo.name === "string") {
                                        data_guardar_base64.data[campo.name] = campo.value;
                                      } 
                                    });
                                    
                                    RightNow.Ajax.makeRequest('/cc/AdminWeb/handle_generar_base64', data_guardar_base64.data, {
                                        successHandler: function (data) {
                                            $('.cuadro_imagen').removeClass('imagen_cargando');
                                            if(data.resultado){
                                                $('.campo_etiquetas .cuadro_imagen > img').attr('src',data.data);
                                            }
                                        },
                                        failureHandler: function (data) {
                                            $('.cuadro_imagen').removeClass('imagen_cargando');
                                        },
                                        scope: widget,
                                        upload: 'editar_etiquetas',
                                        json: true,
                                        data: data_guardar_base64,
                                        type: 'POST'
                                    });
                                });
                            } else if(data.tipo=='html') {
                                html = '';
                                html += '<form id="editar_html" class="editar_html">';
                                    html += '<div class="campo_codigo">';
                                        html += '<div><label>HTML</label></div>';
                                        html += '<div>';
                                            html += '<textarea wrap="off"name="codigo_html" autocomplete="off" placeholder="Ingrese HTML" type="text" value=""></textarea>';
                                        html += '</div>';
                                    html += '</div>';
                                html += '</form>';

                                $('.AdminWeb_panel > .panel_body > .panel_content > .panel_izquierdo').html(html);
                                $('textarea[name="codigo_html"]').val(data.codigo);
                            } else if(data.tipo=='custom_video') {
                                //PERSONALIZACIÓN ADMIN WEB
                                html = '';
                                html += '<form id="editar_id" class="editar_html">';
                                    html += '<div class="campo_codigo">';
                                        html += '<div><label>ID de video</label></div>';
                                        html += '<div>';
                                            html += '<textarea wrap="off" name="codigo_html" autocomplete="off" placeholder="Ingrese ID de video"  value=""></textarea>';
                                        html += '</div>';
                                    html += '</div>';
                                html += '</form>';

                                $('.AdminWeb_panel > .panel_body > .panel_content > .panel_izquierdo').html(html);
                                $('textarea[name="codigo_html"]').val(data.codigo);
                                $('#confirmacion_adminweb input').prop( "checked", true );
                                $('#confirmacion_adminweb input').change();
                            }
                        },
                        failureHandler: function (data) {
                            $('.AdminWeb_editar_' + identificador).css('display', 'none');
                            $('.AdminWeb_panel .panel_header').removeClass('panel_cargando');
                            RightNow.UI.Dialog.messageDialog('No se pudo completar su solicitud, refresque la página e intente de nuevo.', {
                              icon: "WARN",
                              width: "600px",
                              title:'Aviso'});
                        },
                        scope: widget,
                        data: data_obtener_elemento,
                        json: true
                    }); //FIN -> Ajax.makeRequest
            } //FIN -> Panel no está cargando
        });
        if(widget.data.js.AdminWeb.tipo == 'banner') {
            /* CODIGO PARA ACTIVAR EL SLIDER DEBE SER EL MISMO QUE EL QUE ESTA EN ELEMENTOS .JS*/
            iniciarBanner(elemento);
        }
        /*Inicio personalizaciones de elementos del admin web*/
        
        if(widget.data.js.AdminWeb.tipo == 'menu' && identificador == 'menu_principal_home') {
           $('.menu_menu_principal_home > ul > li > a:not([href]), .menu_menu_principal_home > ul > li > a[href=""]').click(function(event ){
                event.stopPropagation();
                $('.rn_AlertasUsuario .collapsed').toggleClass('collapsed');
                if(!$(this).parent().hasClass('lista_expandida')) {
                    //Mostrar menú seleccionado
                    $('.menu_menu_principal_home > ul > li.lista_expandida').removeClass('lista_expandida');
                    $(this).parent().addClass('lista_expandida');
                    $('#boton-volver .cerrar-titulo').html($(this).find('>.AdminWeb-texto').html());
                    $('#boton-volver').addClass('mostrar_nivel');
                    $('#pantalla-oscura1').addClass('collapsed');
                    $('.contenedor_menu_principal_home').addClass('mostrar_menu');
                } else {
                    //Ocultar menú seleccionado (Si estaba abierto)
                    $(this).parent().removeClass('lista_expandida');
                    $('#boton-volver').removeClass('mostrar_nivel');
                    $('#pantalla-oscura1').removeClass('collapsed');
                    $('.contenedor_menu_principal_home').removeClass('mostrar_menu');
                }
            });
            
        }
        
        if(widget.data.js.AdminWeb.tipo == 'menu' && identificador == 'menu_template_footer') {
           $('.menu_menu_template_footer > ul > li > a:not([href]), .menu_menu_template_footer > ul > li > a[href=""]').click(function(event ){
                event.stopPropagation();
                $('.rn_AlertasUsuario .collapsed').toggleClass('collapsed');
                if(!$(this).parent().hasClass('lista_expandida')) {
                    //Mostrar menú seleccionado
                    $('.menu_menu_template_footer > ul > li.lista_expandida').removeClass('lista_expandida');
                    $(this).parent().addClass('lista_expandida');
                    $('.contenedor_menu_template_footer').addClass('mostrar_menu');
                } else {
                    //Ocultar menú seleccionado (Si estaba abierto)
                    $(this).parent().removeClass('lista_expandida');
                    $('.contenedor_menu_template_footer').removeClass('mostrar_menu');
                }
            });
            
        }
        
        /*Fin personalizaciones de elementos del admin web*/
        
        
        
    }, // FIN -> Constructor
    subscribeIniciarBanner: function(ruta_elemento,ruta_elemento){
        ruta_elemento = ruta_elemento[0];
        iniciarBanner(ruta_elemento);

        console.log(ruta_elemento);
        } // FIN -> subscribeIniciarBanner
}); // FIN -> Clase


function dialog_elementos(tipo,elemento,widget) {
    var html = '';
    if(tipo == 'menu') {
        var titulo = elemento.find(' > .AdminWeb-texto').html();
        var url_imagen = elemento.find('> div.AdminWeb-img_menu').attr('alt');

        //aqui hacer condicion para desaparecer botonoes.




    } else if(tipo == 'banner') {
        var titulo = 'Banner';
        var html_banner = elemento.find(' > .AdminWeb-html').html();
        var url_imagen = elemento.find(' > img').attr('src');
        var html_descripciones = $.trim($('.panel_izquierdo .descripcion_'+elemento.parent().attr('alt')).html());
            
    }

    var href = elemento.attr('alt');
    var target = elemento.attr('target');
    var visibilidad = '';
    if(elemento.parent().hasClass('oculto')) {
        visibilidad = 'oculto';
    }
    html += '<div class="formdialog" >';
    html += '</div>';
    if(typeof ventana[widget.data.attrs.identificador] != 'object') {
        var elementos_ventana = $(html);//html;
        var opciones_ventana =
            {
            "buttons":
                [{
                    text: 'Hecho',
                    isDefault: true,
                }],
            "close": true,
            "width": '400px',
              "cssClass":'dialog_adminweb class_dialog_'+widget.data.attrs.identificador
            };
           
        ventana[widget.data.attrs.identificador] = RightNow.UI.Dialog.actionDialog('Elemento', elementos_ventana, opciones_ventana);
    
    }
    html = '';
    html += '<div class="campo_etiquetas" >';

    if(tipo == 'menu') {
        html += '<div>';
            html += '<label>Título</label>';
        html += '</div>';
        html += '<div>';
            html += '<input value="" name="titulo" placeholder="Ingrese título" type="text">';
        html += '</div>';
        html += '<div>';
            html += '<label>URL de imagen</label>';
        html += '</div>';
        html += '<div>';
            html += '<input value="" name="url_imagen" placeholder="Ingrese URL de imagen" type="text">';
        html += '</div>';
  
    } else if(tipo == 'banner') {
        html += '<div>';
            html += '<label>HTML</label>';
        html += '</div>';
        html += '<div>';
            html += '<input value="" name="html" placeholder="Ingrese HTML" value="" type="text">';
        html += '</div>';
        html += '<div>';
            html += '<label>Botones</label>';
        html += '</div>';
        html += '<div>';
            html += '<input name="botones" placeholder="Ingrese HTML de botones" value="" type="text">';
        html += '</div>';
    }

    html += '</div>';
    html += '<div class="campo_etiquetas" >';
        html += '<div>';
            html += '<label>URL</label>';
        html += '</div>';
        html += '<div>';
            html += '<input name="href" placeholder="Ingrese href" value="'+href+'"  type="text">';
        html += '</div>';
    html += '</div>';

    html += '<div class="campo_etiquetas" >';
        html += '<div>';
            html += '<label>Target</label>';
        html += '</div>';
        html += '<div>';
            html += '<select name="target" >';
                html += '<option value="_parent">Parent</option>';
                html += '<option value="_blank">Blank</option>';
            html += '</select>';
        html += '</div>';
    html += '</div>';
    if(tipo == 'menu') {
        html += '<div class="campo_etiquetas" >';
            html += '<div>';
                html += '<label>Visibilidad</label>';
            html += '</div>';
            html += '<div>';
                html += '<select name="visibilidad" >';
                    html += '<option value="">Visible</option>';
                    html += '<option value="oculto">Oculto</option>';
                html += '</select>';
            html += '</div>';
        html += '</div>';
    }
    if(tipo == 'banner') {
        html += '<div class="campo_etiquetas">';
            html += '<div>';
                html += '<label>URL Imagen</label>';
            html += '</div>';
            html += '<div>';
                html += '<input name="url_imagen" placeholder="Ingrese URL de imagen" value="'+url_imagen+'"  type="text">';
            html += '</div>';
        html += '</div>';
    }


    html += '<div class="campo_etiquetas">';
        html += '<div><label>Otros</label></div>';
        html += '<div class="otros_dialog">';
            html += '<button class="otros_eliminar">Eliminar</button>';
            html += '<button class="otros_hermano">Agregar Hermano</button>';
            if(tipo == 'menu') {
                html += '<button class="otros_hijo">Agregar Hijo</button>';
            }
        html += '</div>';
    html += '</div>';

    $('.dialog_adminweb.class_dialog_'+widget.data.attrs.identificador+' .yui3-widget-ft .yui3-button-primary').unbind('click');
    $('.dialog_adminweb.class_dialog_'+widget.data.attrs.identificador+' .formdialog').html(html);

    $('.dialog_adminweb.class_dialog_'+widget.data.attrs.identificador+' .formdialog select[name="target"]').val(target);
    if(tipo == 'banner') {
        $('.dialog_adminweb.class_dialog_'+widget.data.attrs.identificador+' .formdialog input[name="html"]').val(html_banner);
        $('.dialog_adminweb.class_dialog_'+widget.data.attrs.identificador+' .formdialog input[name="botones"]').val(html_descripciones);
    }
    if(tipo == 'menu') {
        $('.dialog_adminweb.class_dialog_'+widget.data.attrs.identificador+' .formdialog input[name="titulo"]').val(titulo);
        $('.dialog_adminweb.class_dialog_'+widget.data.attrs.identificador+' .formdialog input[name="url_imagen"]').val(url_imagen);
    }
    $('.dialog_adminweb.class_dialog_'+widget.data.attrs.identificador+' .formdialog select[name="visibilidad"]').val(visibilidad);
    $('.dialog_adminweb.class_dialog_'+widget.data.attrs.identificador+' .yui3-widget-hd span[id*="_Title"]').html('Editar '+titulo);

    $('.otros_dialog button').click(function(){

        if(!$(this).hasClass('otros_seleccionado')){
            $('.otros_dialog button').removeClass('otros_seleccionado');
            $(this).addClass('otros_seleccionado');
  
        } else {
            $(this).removeClass('otros_seleccionado');
           
        }
    });

    
    $('.dialog_adminweb.class_dialog_'+widget.data.attrs.identificador+' .yui3-widget-ft .yui3-button-primary').click(function(){
        
        if($('.otros_eliminar').hasClass('otros_seleccionado')){
            if(tipo == 'banner') {
                $('.panel_izquierdo .descripciones > div.descripcion_'+elemento.parent().attr('alt')).remove();
            }
            elemento.parent().remove();
              
            if(tipo == 'banner') {
                if($('.panel_izquierdo .rn_banner.AdminWeb_banner > div').length == 0){
                    $('.panel_izquierdo .rn_banner.AdminWeb_banner').append('<div alt="1"><a target="_parent" alt=""><img src=""><div class="AdminWeb-html caption center-align"></div></div>');
                    $('.panel_izquierdo > .descripciones').append('<div alt="1" class="descripcion_1"></div>');  
                    iniciar_sortable('banner');
                } 
                reiniciarIndicesBanner();
            }
            if(tipo == 'menu') {
                //recalcular(false);
            }
        } else {
            if($('.otros_hermano').hasClass('otros_seleccionado')){
                if(tipo == 'menu') {
                    elemento.parent().parent().append('<li class="dd-item list-menu"><a target="_parent" alt=""> <div class="AdminWeb-img_menu" alt="" style="background-image: url(); text-decoration:none;"></div><div class="AdminWeb-texto">Nuevo elemento</div></a></li>');
                } else  if(tipo == 'banner') {
                    elemento.parent().parent().append('<div alt="'+($('.panel_izquierdo .descripciones > div').length + 1)+'"><a target="_parent" alt=""><img src=""><div class="AdminWeb-html caption center-align"></div></div>');
                    elemento.parent().parent().parent().find('> .descripciones').append('<div alt="'+($('.panel_izquierdo .descripciones > div').length + 1)+'" class="descripcion_'+($('.panel_izquierdo .descripciones > div').length + 1)+'"></div>');
                }
            }
            if($('.otros_hijo').hasClass('otros_seleccionado')){
                if(tipo == 'menu') {
                    elemento.parent().append('<ul class="dd-list"><li class="dd-item"><a target="_parent" alt=""><div class="AdminWeb-texto">Nuevo elemento</div></a></li></ul>');
                }
            }
            if(tipo == 'menu') {
                iniciar_sortable('menu',false,widget);
                elemento.find('.AdminWeb-texto').html($('.dialog_adminweb.class_dialog_'+widget.data.attrs.identificador+' .formdialog input[name="titulo"]').val());
                elemento.find('.AdminWeb-img_menu').attr('alt',$('.dialog_adminweb.class_dialog_'+widget.data.attrs.identificador+' .formdialog input[name="url_imagen"]').val());
                elemento.find('.AdminWeb-img_menu').attr("style","background-image: "+"url('"+$('.dialog_adminweb.class_dialog_'+widget.data.attrs.identificador+' .formdialog input[name="url_imagen"]').val()+"');");

            } else  if(tipo == 'banner') {
                iniciar_sortable('banner');
                elemento.find('.AdminWeb-html').html($('.dialog_adminweb.class_dialog_'+widget.data.attrs.identificador+' .formdialog input[name="html"]').val());
                elemento.find('img').attr('src',$('.dialog_adminweb.class_dialog_'+widget.data.attrs.identificador+' .formdialog input[name="url_imagen"]').val());
                $('.panel_izquierdo .descripciones .descripcion_'+$(elemento).parent().attr('alt')).html($('.dialog_adminweb.class_dialog_'+widget.data.attrs.identificador+' .formdialog input[name="botones"]').val())
            }

            elemento.attr('target',$('.dialog_adminweb.class_dialog_'+widget.data.attrs.identificador+' .formdialog select[name="target"]').val());
            elemento.attr('alt',$('.dialog_adminweb.class_dialog_'+widget.data.attrs.identificador+' .formdialog input[name="href"]').val());

            if($('.dialog_adminweb.class_dialog_'+widget.data.attrs.identificador+' .formdialog select[name="visibilidad"]').val() != 'oculto') {
            elemento.parent().removeClass('oculto');
            } else {
                if(!elemento.parent().hasClass('oculto')) {
                    elemento.parent().addClass('oculto');
                }
            }
        }
        if (ventana) {
            ventana[widget.data.attrs.identificador].hide();
            
        }
    });


    ventana[widget.data.attrs.identificador].show();
 
}

// $('.yui3-button-close').click(function(){

// });

function iniciar_sortable(tipo,expandir,widget){
    //$('.panel_izquierdo').unbind(); 
    //$('.panel_izquierdo').nestable('reset');
    if(tipo == 'menu') {
        
         if($('.panel_izquierdo').hasClass('dd')){
             $('.panel_izquierdo').nestable('destroy');
         } 
            $('.panel_izquierdo .dd-item').prepend('<div class="dd-handle"></div>');
            if(!$('.panel_izquierdo').hasClass('dd')){
             $('.panel_izquierdo').addClass('dd');
         }
            
            
            $('.panel_izquierdo').nestable({
                    listNodeName : 'ul',
                    handleNodeName : 'a',
                    contentNodeName:'div',
                    contentClass :"AdminWeb-texto"
                    });
            if(expandir){
                $('.panel_izquierdo').nestable('collapseAll');
            }
         
        
        
        $(".panel_content > .panel_izquierdo .AdminWeb_"+tipo+" li a").bind('dblclick',function(){

            //atrapar el html

            var titulo = $(this).parent().parent().parent().parent().parent().text();
            //console.log(titulo);
            dialog_elementos(tipo,$(this),widget);

        });
        
        
    } else {
        $('.panel_izquierdo').removeClass('dd');
    }
    if(tipo == 'banner') {
        $(".panel_content > .panel_izquierdo .AdminWeb_"+tipo+" div a").bind('dblclick',function(){
            dialog_elementos(tipo,$(this),widget);
        });
        
         $.each($(".panel_content .AdminWeb_"+tipo),function(index,ul){
                if(typeof $(ul).data().uiSortable !='undefined') {
                    $(ul).sortable('destroy');
                }
            });

           $(".panel_content > .panel_izquierdo .AdminWeb_"+tipo).sortable({
            connectWith: ".panel_content > .panel_izquierdo .AdminWeb_"+tipo,
            placeholder: "ui-state-highlight",
            stop: function( event, ui ) {
                if(tipo == 'menu') {
                recalcular();
                }
                if(tipo == 'banner') {
                    reiniciarIndicesBanner();
                }
            },
            tolerance: "pointer",
            start: function( event, ui ) {
            },
            cursorAt: { left: 5 },
            forcePlaceholderSize: true,
            scroll: false,
         });
    }
    
}
function iniciarBanner(ruta_elemento) {
    $(ruta_elemento+' .rn_banner').slick({
        arrows: false,
        easing: true,
        autoplay: true,
        infinte: true,
        speed: 300,
        fade:true,
        pauseOnFocus:false,
        pauseOnHover:true,
        autoplaySpeed: 2500,
    });
    $(ruta_elemento+' .btn_prev').click(function(){
        $(ruta_elemento+' .rn_banner').slick('slickPrev');
    });
    $(ruta_elemento+' .btn_next').click(function(){
        $(ruta_elemento+' .rn_banner').slick('slickNext');
    });
    $(ruta_elemento+' .descripciones > div').first().addClass('collapsed');
    for(var i = 1; i <=  $(ruta_elemento+' .rn_banner > div > div > div').length ; i++) {
        $(ruta_elemento+' .descripciones > .descripcion_'+i).click(function(e){
            var descripcion = $(this);
            $(ruta_elemento+' .descripciones > div.collapsed').removeClass('collapsed');
            $(ruta_elemento+' .descripciones > .descripcion_'+descripcion.attr('alt')).addClass('collapsed');
            $(ruta_elemento+' .rn_banner').slick('slickGoTo', parseInt(descripcion.attr('alt'))-1);
        });
    }        
    $(ruta_elemento+' .rn_banner').on('beforeChange', function(event, slick, currentSlide, nextSlide){
        $(ruta_elemento+' .descripciones > div.collapsed').removeClass('collapsed');
        $(ruta_elemento+' .descripciones > .descripcion_'+(nextSlide+1)).addClass('collapsed');
    });
}
function reiniciarIndicesBanner(){
    var html = '';
    $.each($('.panel_izquierdo > .rn_banner > div'),function(index,div){
        html += '<div alt="'+(index+1)+'" class="descripcion_'+(index+1)+'">';
        html += $('.panel_izquierdo .descripcion_'+$(div).attr('alt')).html();
        html += '</div>';
        $(div).attr('alt',(index+1));
    })
    $('.panel_izquierdo .descripciones').html(html);
}