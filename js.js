var counter = JSON.parse(localStorage.getItem('counter')),
    flag_edit = false,
    editDiv,
    myArray = [],
    flag_exit = false;

if(counter === null )   counter = 0;

function addText(){
    var inputValue = $('#myInput').val(),
        myList = document.getElementById('list'),
        newDiv = document.createElement('div'),
        newDivItem;
    if(!flag_edit)
    {
        if(inputValue === "")
        {
            $('#alert').html('<div class="warning">Warning ! You left the to-do empty</div>');
            $('#alert').fadeIn().delay(500).fadeOut();
            return;
        }
        newDiv.setAttribute('id', 'my' + counter + 'Div');
        newDiv.setAttribute('Num', counter);
        newDiv.setAttribute('class','todo');
        newDiv.setAttribute('contain',inputValue);
        newDiv.innerHTML = '<li>' + inputValue + '</li>'
        + '<div> <input type=\"button\" value=\"DEL\" onclick=\'removeElement(' + newDiv.getAttribute('id') 
        + ')\' > <input type=\"button\" value=\"EDIT\" onclick=\'editElement('+ newDiv.getAttribute('id') 
        + ')\' > <input type=\"button\" value=\"UP\" onclick=\'goUp(' + newDiv.getAttribute('id') 
        + ')\' > <input type=\"button\" value=\"DW\" onclick=\'goDown(' + newDiv.getAttribute('id')
        + ')\' > </div>';
        $('#list').append(newDiv);
        if ($('#list').is(":hidden"))   $("#list").slideDown("slow");
        localStorage.setItem('hide','true');
        myArray.push(counter);
        newDivItem = $('#my' + counter + 'Div').clone().wrap('<div/>').parent().html(); // HELP
        localStorage.setItem('myDiv_' + counter, newDivItem);
        localStorage.setItem('myArray_length', myArray.length);
        counter++;
        localStorage.setItem('counter', JSON.stringify(counter));
        for(var n = 0; n < myArray.length; n++)
        {
            localStorage.setItem('myArray_' + n, JSON.stringify(myArray[n]));
        }
		$('#myInput').val('');
    }
    else
    {
        editDiv.setAttribute('contain', inputValue);
        editDiv.innerHTML = '<li>' + inputValue + '</li>'
        + '<div> <input type=\"button\" value=\"DEL\" onclick=\'removeElement(' + editDiv.getAttribute('id')
        + ')\' > <input type=\"button\" value=\"EDIT\" onclick=\'editElement(' + editDiv.getAttribute('id')
        + ')\' > <input type=\"button\" value=\"UP\" onclick=\'goUp(' + editDiv.getAttribute('id')
        + ')\' > <input type=\"button\" value=\"DW\" onclick=\'goDown(' + editDiv.getAttribute('id')
        + ')\' > </div>';
        newDivItem = $('#my' + editDiv.getAttribute('num') + 'Div').clone().wrap('<div/>').parent().html();
        localStorage.setItem('myDiv_' + editDiv.getAttribute('num'), newDivItem);
		$('#myInput').val('');
        flag_edit = false;
    }
}

function editElement(divNum) {
    flag_edit=true;
    editDiv = divNum;
    document.getElementById('myInput').value = editDiv.getAttribute('contain');
    document.getElementById('myInput').focus();
}

function removeElement(divNum) {
    $(divNum).fadeOut(500, function(){
        $(divNum).remove();
    }); 
    var idx = myArray.indexOf(parseInt(divNum.getAttribute('num')));
    for(var n = 0; n < myArray.length; n++)
    {
        localStorage.removeItem('myArray_' + n);
    }
    myArray.splice(idx, 1);
    localStorage.setItem('myArray_length', myArray.length);
    for(var n = 0; n < myArray.length; n++)
    {
        localStorage.setItem('myArray_' + n, JSON.stringify(myArray[n]));
    }
}

function goUp(divNum) {
    var myList = document.getElementById('list'),
        idx = myArray.indexOf(parseInt(divNum.getAttribute('num'))),
        nowDiv = document.getElementById('my' + myArray[idx] + 'Div');
    if(idx ===0 )   return;
    var preDiv = document.getElementById('my' + myArray[idx - 1] + 'Div'),
        temp = myArray[idx-1];
    myArray[idx-1] = myArray[idx];
    myArray[idx] = temp;
    temp = preDiv.innerHTML;
    preDiv.innerHTML = nowDiv.innerHTML;
    nowDiv.innerHTML = temp;
    temp = preDiv.id;
    preDiv.id = nowDiv.id;
    nowDiv.id = temp;
    temp = preDiv.getAttribute('num');
    preDiv.setAttribute('num', nowDiv.getAttribute('num'));
    nowDiv.setAttribute('num', temp);
    temp = preDiv.getAttribute("contain");
    preDiv.setAttribute('contain' ,nowDiv.getAttribute('contain'));
    nowDiv.setAttribute('contain' ,temp);
    for(var n = 0; n < myArray.length; n++)
    {
        localStorage.setItem('myArray_' + n, JSON.stringify(myArray[n]));
    }
}

function goDown(divNum) {
    var myList = document.getElementById('list'),
        idx = myArray.indexOf(parseInt(divNum.getAttribute('num'))),
        nowDiv = document.getElementById('my' + myArray[idx] + 'Div');
    if(idx === myArray.length-1 )
        return;
    var nextDiv = document.getElementById('my' + myArray[idx + 1] + 'Div'),
    temp = myArray[idx+1];
    myArray[idx+1] = myArray[idx];
    myArray[idx] = temp;
    temp = nextDiv.innerHTML;
    nextDiv.innerHTML = nowDiv.innerHTML;
    nowDiv.innerHTML = temp;
    temp = nextDiv.id;
    nextDiv.id = nowDiv.id;
    nowDiv.id = temp;
    temp = nextDiv.getAttribute('num');
    nextDiv.setAttribute('num', nowDiv.getAttribute('num'));
    nowDiv.setAttribute('num', temp);
    temp = nextDiv.getAttribute('contain');
    nextDiv.setAttribute('contain', nowDiv.getAttribute("contain"));
    nowDiv.setAttribute('contain', temp);
    for(var n = 0; n < myArray.length; n++)
    {
        localStorage.setItem('myArray_' + n, JSON.stringify(myArray[n]));
    }
}

$(document).ready(function(){
    for(var n = 0; n < localStorage.getItem('myArray_length'); n++)
    {
        var myList = document.getElementById('list');
        var number = JSON.parse(localStorage.getItem('myArray_' + n));
        myArray.push(number);
        myList.innerHTML += localStorage.getItem('myDiv_' + number);
    }
    if(localStorage.getItem('hide') === 'true')
    {
        $("#list").slideDown('slow');
    }    
    $("#myInput").keydown(function(event){
        if(event.keyCode === 13 )   addText();
    });
    $('#clear').click( function() {
        window.localStorage.clear();
        location.reload();
        flag_exit = true;
    });
});
