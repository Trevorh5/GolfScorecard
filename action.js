let golfholes = [];
let numplayers = 0;
let allcourses;
let selTee;
let selcourse;
let holes = 18;



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




function buildCard(teeindex){
    $('.right').html('');
    selTee = teeindex;

    let totalpar = 0;
    let totalyards = 0;

    for(t = 0; t < selcourse.data.holes.length; t++){

        totalpar += selcourse.data.holes[t].teeBoxes[selTee].par;
        totalyards += selcourse.data.holes[t].teeBoxes[selTee].yards;
    }



    for(let i = 0; i < selcourse.data.holes.length; i++) {
        $('.right').append("<div class='column' id='c" + i + "'>" +
            "<div class='cheader'>" + (i + 1) + "</div>" +
            "<div class='hcp'>HDCP:" + selcourse.data.holes[i].teeBoxes[selTee].hcp + "</div>" +
            "<div class='yards'>" + selcourse.data.holes[i].teeBoxes[selTee].yards + " yds</div>" +
            "<div class='pars'>Par: " + selcourse.data.holes[i].teeBoxes[teeindex].par + "</div>" +
            "<div class='scoreboxes'></div>" +
            "</div>"
        );
    }

    let inScore = "";
    let outScore = "";
    let totalScore = "";


    $('.right').append("<div id='totalsCol'>" +
        "<div class='theader'>Total</div>" +
        "<div class='empty'></div>" +
        "<div class='totYards'>" + totalyards + "</div>" +
        "<div class='totPar'>" + totalpar + "</div>" +
        "</div>"
    );

}
//rows are horizontal
function addPlayer(){

    if(numplayers < 4) {
        numplayers++;
    }else{
        $('#maxPlayers').show();
    }

    fillCard();

}

function fillCard(){
    $(".names").text('');
    $(".scoreboxes").html('');
    for(let p = 1; p <= numplayers; p++){
        $('.names').append("<div contenteditable='true' class='playerlabel' id='playlabel" + p + "'> Player "+ p +
            "<span id='deletePlayer' class='far fa-trash-alt' onclick='removePlayer(" + p + ")'></span> </div>");

        $('.holeinput').val('');
        for(let h = 1; h <= selcourse.data.holes.length; h++){
            $("#c" + h).children('.scoreboxes').append("<input onkeyup='getPar(" + p + ")' class='holeinput' id='p"+ p + "h" + h + "' type='number'>");
        }
    }
}


function getPar(player){
    let score = 0;
    for (let s = 1; s <= holes; s++){
        score += $("#p" + player + "h" + s).val();
    }
}


function removePlayer(id){
    $("#playlabel" + id).remove();

}

// function calcScore(playerNum){ <---might Get Replaced by getPar()---->
//     let totalScore = 0;
//     for(let t = 1; t <= holes; t++){
//         totalScore += $("p" + playerNum + "h" + t).val();
//     }
// }