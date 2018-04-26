let golfholes = [];
let numplayers = 0;
let allcourses;
let selTee;
let selcourse;
let holes = 18;
let maxplayers = 4;



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

function getPlayers(){

    if(numplayers < 4) {
        numplayers++;
    }else{
        $('#maxPlayers').text('Max 4 Players');
    }

    fillCard();

}


function getCourse(id){
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
            "<div class='hcp'>HDCP:" + selcourse.data.holes[i].teeBoxes[selTee].hcp + "</div>" +
            "<div class='yards'>" + selcourse.data.holes[i].teeBoxes[selTee].yards + " yds</div>" +
            "<div class='scoreboxes'></div>" +
            "</div>");
    }
    

}
//rows are horizontal


function fillCard(){
    $(".names").text('');
    $(".scoreboxes").html('');
    for(let p = 1; p <= numplayers; p++){
        $('.names').append("<div contenteditable='true' class='playerlabel'> player "+ p +"</div>");

        $('.holeinput').val('');
        for(let h = 0; h < selcourse.data.holes.length; h++){
            $("#c" + h).children('.scoreboxes').append("<input onkeyup='calcScore(" + p + ")' class='holeinput' id='p"+ p + "h" + h + "' type='number'>");
        }
    }
    //getTotalColumns();
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
}

function getTotalColumns(){

}

function calcScore(playerNum){
    let totalScore;
    for(let t = 1; t <= holes; t++){
        totalScore = $("p" + playerNum + "h" + t).val();
    }


}