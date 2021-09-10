var enabled = false;

$( document ).ready(function() {
    var fav_button = $('.fav');

    refresh_button(id, fav_button);

    fav_button.click(function(){
        var result;

        if(enabled){
            result = remove_fav(id);
            refresh_button(id, fav_button);
        } else {
            result = save_fav(id);
            refresh_button(id, fav_button);
        }
    });
});

function get_fav(id){
    var xmlHttp = new XMLHttpRequest();
        var url = '/fav/get/'+id;
        xmlHttp.open( "GET", url, false );
        xmlHttp.send( null );
        return JSON.parse(xmlHttp.responseText).result;
}

function save_fav(id){
    var xmlHttp = new XMLHttpRequest();
        var url = '/fav/save/'+id;
        xmlHttp.open( "GET", url, false );
        xmlHttp.send( null );
        return JSON.parse(xmlHttp.responseText).result;
}

function remove_fav(id){
    var xmlHttp = new XMLHttpRequest();
        var url = '/fav/remove/'+id;
        xmlHttp.open( "GET", url, false );
        xmlHttp.send( null );
        return JSON.parse(xmlHttp.responseText).result;
}

function button_on(button){
    button.addClass('enable')
    button.text('★')
    enabled = true;
    
}

function button_off(button){
    button.removeClass('enable')
    button.text('☆')
    enabled = false;
}

function refresh_button(id, button){
    if(get_fav(id)){
        button_on(button);        
    } else{
        button_off(button);        
    }
}