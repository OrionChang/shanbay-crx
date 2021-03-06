/**
 * @user Joseph
 **/

noteString = '<a href="javascript:void(0)"  class="note-button sblink pull-right">加入笔记</a>'

chr=chrome

function getCurrentTerm() {
    return $('#current-learning-word').text();
}

function addNoteButton(selector) {
    if ($(selector).siblings('a.note-button').length == 0) $(selector).before(noteString)
}

function addToNote(add,term) {
    var sib=$(add).siblings("div")
    var notes =sib.text().trim()
    if(sib.has('#affix_word_tree_container').length>0) notes=sib.find('#affix_word_tree_container').text().trim()
    var hint = '加入成功'
    var id = $('#learning-box').attr('data-id')
    var url = "http://www.shanbay.com/api/v1/bdc/note/";

    if (hint != $(add).text()&&$('#note-mine-box li').text().indexOf(notes)==-1&&(undefined==term||term==getCurrentTerm())) {
        $('textarea[name=note]').val(notes);
        $('input[type=submit]').click();
        $(add).html(hint);
    }
}

function wrapper(title){
    return $('<div><div class="span1"><h6 class="pull-right">'+title+' </h6></div> <div class="roots-wrapper span9"><div class="alert">"扇贝助手"努力查询中.....请确保能访问<a target="_blank" href="http://www.etymonline.com/">词源</a>和<a target="_blank" href="http://www.dictionaryapi.com/">派生、音节划分</a>及在扇贝插件<a target="_blank" href="javascript:void(0);" id="settings">设置</a>中打开Webster功能</div></div></div>').html()
}

function addButtons(){
    if($('#roots .well').length==0)
        $('#roots').html(wrapper('词根'))
    if($('#affix .word,#affix .well').length==0)
        $('#affix').html(wrapper('派生'))
}

function replaceButtons(){
    if($('#roots .exist').length==0)
        $('#roots').html(wrapper('词根'))
    if($('#affix .exist').length==0)
        $('#affix').html(wrapper('派生'))
    searchOnline()
}

function searchOnline() {
    if ($('#roots .exist').length==0&&(undefined == ls()['hider'] || ls()['hider'].search("roots") == -1)) {
        if (ls()['etym'] != 'webster')
            getEthology();
    }
    if (ls()['web_dict']=='yes' && $('#affix .exist').length==0&&(undefined == ls()['hider'] || ls()['hider'].search("affix") == -1)) {
        findDerivatives();
    }
}

function pronounceIfInSummaryPage(key) {
    var speakers = $("#summary-box .sound .speaker");
    if (speakers.length > 0) {
      var index;

      switch (key) {
        case 49:
          index = 0;
          break;
        case 50:
          index = 1;
          break;
        case 51:
          index = 2;
          break;
        case 52:
          index = 3;
          break;
        case 53:
          index = 4;
          break;
        case 54:
          index = 5;
          break;
        case 55:
          index = 6;
          break;
        case 56:
          index = 7;
          break;
      }

      if (index < speakers.length) {
        speakers[index].click();
      }
    }

}

$(document).on("DOMNodeInserted", '#learning-box',function () {
//    console.log('handling definitions')
    var $definitions = $('#review-definitions');
    var cn_anchor = '<a href="javascript:void(0);" id="show_cn_df" onclick="$(this).siblings(\'div.cndf\').toggle();" class="sblink pull-right">中文释义</a>'
    if ($definitions.find('div.cndf').siblings('#show_cn_df').length == 0)
        $definitions.find('div.cndf').after(cn_anchor)
    if ($definitions.find('div.endf').length > 0 && $('div.endf').text().trim() != "" && ls()['hide_cn'] == 'yes') {
        $definitions.find('div.endf').show()
    }
}).on("DOMNodeInserted", '#learning_word a#show_cn_df',function () {
    console.log('retrieving English definitions')
    searchOnline();
    if (undefined != ls()['hider']) {
        var ids = ls()['hider'].split(',')
        for (var i in ids) {
            $('#' + ids[i]).hide()
        }
    }
}).on("DOMNodeInserted", '#roots .roots-wrapper,#roots .roots-due-wrapper',function (e) {
        console.log('#roots triggered')
        addNoteButton('#roots .alert,#roots .well')
    }).on("DOMNodeInserted", '#roots a.note-button',function (e) {
        console.log('retrieving roots data')
        if ($("#roots .well").length>0 && ls()['root2note'] == 'yes') addToNote("#roots a.note-button");
    }).on("DOMNodeInserted", '#affix .roots-wrapper,#affix .roots-due-wrapper,#affix .word',function (e) {
        console.log('#affix triggered')
        addNoteButton('#affix .alert,#affix .well')
    }).on("DOMNodeInserted", '#affix a.note-button',function (e) {
        console.log('retrieving affix data')
        if($('#affix .well').length>0&&  ls()['afx2note'] == 'yes')    addToNote('#affix a.note-button');
    }).on("DOMNodeInserted", '#note-mine-box',function () {

    }).on("mouseover", "a.etymology",function (e) {
        popupEtymology($(this));
        return;
    }).on("click", "a.note-button",function (e) {
        console.log('clicking a note-button')
        addToNote($(this))
    }).on("click", "a#settings",function (e) {
        chrome.extension.sendRequest({method: "openSettings",anchor:"webster_set"});
    }).on('mouseup',function (e) {
        if($(this).parents('div.popover-crx').length==0)
            $('div.popover-crx').remove()
    }).on('mouseup', 'div.popover-crx', function (e) {
        return false;
    }).keyup(function (e) {
    console.log(String.fromCharCode(e.keyCode)+" pressed")
    switch (e.keyCode) {
        //退出浮框
        case 27:
            $('div.popover-crx').remove();
            return;
        //the chinese definitions C
        case 67:
        case 99:
            // $("#summary-box .summary-table .definition.span4").toggle();

            if ($("#summary-box .summary-table tr").length > 0) {
              $.each($("#summary-box .summary-table tr"), function(k,v){
                var pronunciation = $(v).children(".sound")[0].title;
                var definition = $(v).children(".definition.span4")[0].innerHTML;
                $(v).children(".sound")[0].title = definition;
                $(v).children(".definition.span4")[0].innerHTML = pronunciation;
              });
            }

            $('div.cndf').toggle();
            return;
        //the English definitions G
        case 71:
        case 103:
            $('div.endf').toggle();
            return;
        //全屏W
        case 87:
        case 119:
            $('div.navbar').toggle();
            return;
        //例句M
        case 77:
        case 109:
            $('div#learning-examples-box').toggle();
            return;
        //notes N
        case 78:
        case 110:
            $('div#notes-box').toggle();
            return;
        // Q
        case 81:
        case 113:
            if(e.ctrlKey)
                replaceButtons()
            return;
        //词根 E
        case 69:
        case 101:
            $('div#roots').toggle();
            return;
        //notes T
        case 84:
        case 116:
            $('a.note-button').each(function(e){
                addToNote($(this));
            });
            return;
        //webster definition V
        case 86:
        case 118:
            $('#review-definitions .endf').toggle();
            return;
                   //webster definition V
        //A
        case 65:
        case 97:
            $('.learning-speaker .us').click()
            return;
        //B
        case 66:
        case 98:
            $('.learning-speaker .uk').click()
            return;
        //衍生、同义X
        case 88:
        case 120:
            $('div#affix').toggle();
            return;

        //Enter to next word
        case 13:
            var $choices = $('#choices li.answer');

            if ($choices.length > 0) {
                // the 1st choice in the learning page
                $choices[0].click();
            } else if (0 == $choices.length &&
              $('#review a.known').length>0 &&
              $('#review #learning-box .continue.continue-button').length==0) {
                // the known button in the review page
                $('#review a.known')[0].click();
            } else if ($('#review #learning-box .continue.continue-button').length>0) {
                // continue button in the detail page
                $('#review #learning-box .continue.continue-button')[0].click();
            } else if ($('#review #summary-box .continue.continue-button').length>0) {
                // continue button in the summary page
                $('#review #summary-box .continue.continue-button')[0].click();
            }

            return;
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
            pronounceIfInSummaryPage(e.keyCode);
            return;

        //I to ignore
        case 73:
        case 74:
        case 75:
        case 76:
        case 79:
        case 85:
        case 105:
        case 106:
        case 107:
        case 108:
        case 117:
            var map={i:57,I:57,O:48,o:48,U:49,u:49,j:50,J:50,k:51,K:51,l:52,L:52}
            var key=String.fromCharCode(e.keyCode)

            var $choices = $('#choices li.answer');
            switch(key){
                case 'u':
                case 'U':
                    if(0== $choices.length) $('#review a.known')[0].click()
                    else $choices[0].click();
                    return;
                case 'j':
                case 'J':
                    if(1<$choices.length)$choices[1].click();
                    else {
                        if($('#review a.unknown').length>0) $('#review a.unknown')[0].click();
                        if($('a.btn-forget').length>0)$('a.btn-forget')[0].click();
                    }
                    return;
                case 'k':
                case 'K':if(4==$choices.length)$choices[2].click() ;return;
                case 'l':
                case 'L':if(4==$choices.length)$choices[3].click();return;
                case 'O':
                case 'o':$('#choices li.forget').click();return;
                case 'i':
                case 'I':$('#learning_word a.pass span').click();return;
            }
            return;
    }
    return;//using "return" other attached events will execute
}).on('keyup','input,textarea',function (event) {
    if(event.altKey && (event.which== 66 || event.which== 98)){
        console.log("reading British English")
        $('.learning-speaker .uk').click()
    }
    else if(event.altKey && (event.which== 65 || event.which== 97)){
        console.log("reading American English")
        $('.learning-speaker .us').click()
    }

    event.stopPropagation();
});
