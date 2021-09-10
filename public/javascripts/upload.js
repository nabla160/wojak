Dropzone.autoDiscover = false;
 
var my_dropzone;

$(document).ready(function(){

    
    
    var tag_list = get_tags()
    tag_list.then(value => {

        var config = {
            placeHolder: "Type here",
            selector: '#autocomplete',
            data : {
                src: value,
                cache: true
            }
        }

        console.log(config);
        const autoCompleteJS = new autoComplete(config);

        var auto_comp = $('#autocomplete');
        auto_comp.on('selection', (event) => {
            add_tag_to_list(event.detail.selection.value); 
            auto_comp.val('')
        })

        auto_comp.keyup(function(e) {
            console.log(e)
            if(e.which == 13 && auto_comp.is(':focus')) {
                add_tag_to_list(auto_comp.val()); 
                auto_comp.val('')
            }
        });

    })

    var button = $('.upload_button')

    var deco = $('.dz_deco')
    
    
    my_dropzone = new Dropzone(".dropzone_form",{autoProcessQueue: false, url: '/wojak/add', addRemoveLinks: true, maxFiles: 1
    , previewsContainer: ".dropzone_preview", acceptedFiles: 'image/*', clickable: ".dropzone_preview"
    ,init: function() {
        var myDropzone = this;
    
        // First change the button to actually tell Dropzone to process the queue.
        $('.upload_button').click(function(e) {
          // Make sure that the form isn't actually being sent.
          e.preventDefault();
          e.stopPropagation();
          myDropzone.processQueue();
        });
    
        // Listen to the sendingmultiple event. In this case, it's the sendingmultiple event instead
        // of the sending event because uploadMultiple is set to true.
        this.on("success", function() {
            my_dropzone.removeAllFiles()
        });
        this.on("successmultiple", function(files, response) {
          // Gets triggered when the files have successfully been sent.
          // Redirect user or notify of success.
        });
        this.on("errormultiple", function(files, response) {
          // Gets triggered when there was an error sending the files.
          // Maybe show form again, and notify user of error
        });

        this.on('addedfile', () => {
            console.log(this.files.length)
            if(this.files.length == 0){
                deco.removeClass('hidden')
            } else {
                deco.addClass('hidden')                
            }
        });
        this.on('removedfile', () => {
            console.log("hello :D")
            if(this.files.length == 0){
                deco.removeClass('hidden')
            } else {
                deco.addClass('hidden')                
            }
        });

      }
     });

     var tag_list = [{tag: $('#tag_1'), empty: true},
     {tag: $('#tag_2'), empty: true, last: ''},
     {tag: $('#tag_3'), empty: true, last: ''},
     {tag: $('#tag_4'), empty: true, last: ''},
     {tag: $('#tag_5'), empty: true, last: ''},
     {tag: $('#tag_6'), empty: true, last: ''},]


     function add_tag_to_list(tag){
         tag_list.every((element, index) => {

            if(element.last == tag){
                return false;
            }

             if(element.empty == true ){
                 console.log('placement')
                tag_list[index].tag.val(tag);
                console.log(tag_list[index])
                tag_list[index].empty = false;
                tag_list[index].last = tag;
    
                return false;
             } else {
                 console.log('suivant')
                 return true
             }
         });
     }

     function relocalise_list(){
        tag_list.every((element, index) => {
            if(element.empty == true){
                for (let i = index; i < 5; i++) {                    
                    tag_list[i].empty = tag_list[i+1].empty
                    tag_list[i].tag.val(tag_list[i+1].tag.val())
                    tag_list[i].last = tag_list[i+1].last

                    delete_tag_to_list(i+1)

                }
                return false;
            }
        });
     }

     function delete_tag_to_list(index){
         console.log(tag_list)
         tag_list[index].empty = true
         tag_list[index].tag.val('')
         tag_list[index].last = ''
     }

     var target_tag = $('#autocomplete')

     var add_tag = $('#add_tag')
     add_tag.click(() => {
        add_tag_to_list(target_tag.val())
     });

     var delete_tag = $('.delete_tag')
     delete_tag.on('click',function(evt){
         var self = $(this)
         var test = self.parent().find('.tag')

         tag_list.forEach((element, index) => {
             if(test.attr('id') == element.tag.attr('id')){
                 console.log('trouvé')
                 delete_tag_to_list(index);
                 relocalise_list()
             }
         })
     })

     $(document).change(() => {

        if(my_dropzone.files.length < 0 
            && $('input[id="category"]').val() != ''
            && $('input[id="name"]').val() != ''
            && tag_list[0].empty == false)
        {
            $('.upload_button').removeClass('hidden')
        }

        console.log(my_dropzone.files.length)
        console.log($('input[id="category"]').val())
        console.log($('input[id="name"]').val())
        console.log(tag_list[0].empty)
    })

     
});

function get_tags(){
    return new Promise((resolve, reject) => {
        var http = new XMLHttpRequest();
        var url = "/ressource/tags";

        http.open('GET', url, true);
        http.onload = function() {
            var tag_list = JSON.parse(this.responseText)
            console.log(tag_list);
            resolve(tag_list);
        }
        http.send();
    })
}



/*
 var form = $('#wojak_form');
    var file = $('#wojak_file');
    form.submit(function (event){
        var content_file = file.get(0).files[0];
        console.log(content_file.size)
        if(content_file.size > 16000000 || content_file.fileSize > 16000000){
            alert("Fichier plus lourd que ta maman")
            event.preventDefault();
        }
        else if(content_file.type.match("/image/g")){
            alert("Le fichier n'est ni un png ni un jpg")
            event.preventDefault();
        }

       
    })

    */