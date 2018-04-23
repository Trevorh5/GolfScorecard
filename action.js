let golfholes = [];
let numplayers = 2;
let allcourses;
let selTee;
let selcourse;
loadDoc();

function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            allcourses = JSON.parse(this.responseText);
            console.log(allcourses);
            for(let i = 0; i < allcourses.courses.length; i++){
                $('#courseselect').append("<option value='" + allcourses.courses[i].id+ "'>"+ allcourses.courses[i].name +"</option>");
            }

        }
    };
    xhttp.open("GET", "https://uxcobra.com/golfapi/courses.txt", true);
    xhttp.send();
}

function getPlayers(val) {
        numplayers = val;
        fillCard();
}


function getCourse(id){
    console.log(id);
    $('#teeselect').html('');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            selcourse = JSON.parse(this.responseText);
            console.log(selcourse);
            let holeone = selcourse.data.holes[0].teeBoxes;
            for(let i = 0; i < holeone.length; i++){
                $("#teeselect").append("<option value='"+ i +"'>"+ holeone[i].teeType +"</option")
            }

        }
    };
    xhttp.open("GET", "https://uxcobra.com/golfapi/course"+ id +".txt", true);
    xhttp.send();
}

function setTee(teeindex){
    $('.right').html('');
    selTee = teeindex;
    let mycourse = selcourse.data.holes;
    for(let i = 0; i < mycourse.length; i++){
        $('.right').append("<div class='column' id='c"+ i +"'>"+
            "<div class='cheader'>"+ (i+1) +"</div>" +
            "<div class='yards'>" + selcourse.data.holes[i].teeBoxes[selTee].yards + " yds</div>" +
            "<div class='hcp'>HCP:" + selcourse.data.holes[i].teeBoxes[selTee].hcp + "</div>" +
            "<div class='scoreboxes'></div>" +
            "</div>");
    }
    //fillCard();
}

function fillCard(){
    $(".names").text('');
    $(".scoreboxes").html('');
    for(let p = 1; p <= numplayers; p++){
        $('.names').append("<div contenteditable='true' class='playerlabel'> player "+ p +"</div>");
        $('.holeinput').val('');
        for(let h = 0; h < selcourse.data.holes.length; h++){
            $("#c" + h).children('.scoreboxes').append("<input class='holeinput' id='p"+ p + "h" + h + "' type='text'>");
        }
    }
}