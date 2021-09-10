var test

$( document ).ready(function() {
    var input = $('.search_input');
    var sort = $('.sort_input');
    var list = $('.infi_content');

    var t_line = $('.t_infi_line').prop('content');
    var t_mini = $('.t_mini').prop('content');

    var line = $(t_line).find('.infi_line')
    var mini = $(t_mini).find('.mini')

    var title = $('.infi_title');
    var content = $('.infi_list')

    var msg = $('.msg')

    test = msg

    var timer;

    input.keyup(() => {
        clearTimeout(timer)
        timer= setTimeout(get_data, 200, input.val(), sort.val(), list, line, mini, msg, content);
        title.text("Wojaks found with : " + input.val())
    })

    sort.change(() => {
        clearTimeout(timer)
        timer= setTimeout(get_data, 200, input.val(), sort.val(), list, line, mini, msg, content);
        title.text("Wojaks found with : " + input.val())
    })
});

function get_data(input, sort, list, line, mini, msg, content){
    var data = new FormData();
    data.append('search', input);
    data.append('sort', sort);

    var http = new XMLHttpRequest();
    var url = "/search/req";

    http.open('POST', url, true);
    http.onload = function() {
        var wojak_list = JSON.parse(this.responseText)
        console.log(wojak_list); 
        clear_list(list);
        create_list(wojak_list, list, line, mini);

        if(wojak_list.length == 0){
            msg.removeClass('hidden')
            content.addClass('hidden')
        } else {
            content.removeClass('hidden')
            msg.addClass('hidden')
        }        
    }
    http.send(data);
}

function clear_list(list){
    list.empty();
}

function create_list(wojak_list, list, line, mini){
    create_line(list, line);
    var i = 0;
    wojak_list.forEach(wojak => {
        console.log(wojak.id)
        
        if(i % 9 == 0){
            create_line(list, line);
        }
        i++

        create_mini(mini, wojak, list);
    })
}

function create_line(list, line){
    console.log('ligne crée')
    list.append(line.clone());
}

function create_mini(mini, wojak, list){
    console.log('mini crée')
    mini.find('.mini_img > a').attr('href', '/wojak/'+wojak.id);
    mini.find('.mini_img > a > img').attr('src', '/wojak/'+wojak.id+'/img');
    mini.find('.mini_data > .mini_name > a').attr('href', '/wojak/'+wojak.id);
    mini.find('.mini_data > .mini_name > a').text(wojak.name);
    //mini.find('.mini_data > .mini_user > a').attr(); // a finir
    mini.find('.mini_data > .mini_user > a').text(wojak.user);

    list.children().last().append(mini.clone())
}