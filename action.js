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
    let inpar = 0;
    let inyards = 0;

    let outpar = 0;
    let outyards = 0;

    let totalpar = 0;
    let totalyards = 0;

    let inScoreCol;
    let outScoreCol;
    let totalScoreCol;

    let scoreRow;

    for(i = 0; i < 9; i++){
        inpar += selcourse.data.holes[i].teeBoxes[teeindex].par;
        inyards += selcourse.data.holes[i].teeBoxes[teeindex].yards;
    }

    for(j = 9; j < 18; j++){
        outpar += selcourse.data.holes[i].teeBoxes[teeindex].par;
        outyards += selcourse.data.holes[i].teeBoxes[teeindex].yards;

    }

    for(t = 0; t < selcourse.data.holes.length; t++){

        totalpar += selcourse.data.holes[t].teeBoxes[selTee].par;
        totalyards += selcourse.data.holes[t].teeBoxes[selTee].yards;
    }

    for(let i = 0; i < selcourse.data.holes.length; i++) {
        $('.right').append("<div class='column' id='c" + i + "'>" +
            "<div class='cheader'>" + (i + 1) + "</div>" +
            "<div class='hcp'>" + selcourse.data.holes[i].teeBoxes[selTee].hcp + "</div>" +
            "<div class='yards'>" + selcourse.data.holes[i].teeBoxes[selTee].yards + "</div>" +
            "<div class='pars'>" + selcourse.data.holes[i].teeBoxes[selTee].par + "</div>" +
            "<div class='scoreboxes'></div>" +
            "</div>"
        );
    }



        inScoreCol = "<div class='totalsCol' id='inScore'>" +
            "<div class='theader'>in</div>" +
            "<div class='empty'></div>" +
            "<div class='totYards'>" + inyards + "</div>" +
            "<div class='totPar'>" + inpar + "</div>" +
            "</div>";

        outScoreCol = "<div class='totalsCol' id='outScore'>" +
            "<div class='theader'>Out</div>" +
            "<div class='empty'></div>" +
            "<div class='totYards'>" + outyards + "</div>" +
            "<div class='totPar'>" + outpar + "</div>" +
            "</div>";


        totalScoreCol = "<div class='totalsCol' id='totes'>" +
            "<div class='theader'>Total</div>" +
            "<div class='empty'></div>" +
            "<div class='totYards'>" + totalyards + "</div>" +
            "<div class='totPar'>" + totalpar + "</div>" +
            "</div>";

    $('.right').append(inScoreCol + outScoreCol + totalScoreCol);


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
            "<span id='deletePlayer' class='far fa-trash-alt' onclick='removePlayer(" + p + ")'></span> </div>" +
            "<div class='scoreRow' id='p" + p + "scoreRow'>Score: </div>");

        $("#inScore").append("<div class='swingspot score" + p + "' id='p" + p + "inscore'></div>" +
            "<div class='scoreRow SRTotal' id='totP" + p + "inscore'></div>");

        $("#outScore").append("<div class='swingspot score" + p + "' id='p" + p + "outscore'></div>" +
            "<div class='scoreRow SRTotal' id='totP" + p + "outscore'></div>");

        $("#totes").append("<div class='swingspot score" + p + "' id='p" + p + "score'></div>" +
            "<div class='scoreRow SRTotal' id='totP" + p + "score'></div>");

        $('.holeinput').val('');
        
        for(let h = 0; h < selcourse.data.holes.length; h++){
            $("#c" + h).children('.scoreboxes').append("<input onkeyup='getPar(" + p + ")' class='holeinput' id='p"+ p + "h" + h + "' type='number'>" +
                "<div class='scoreRow play" + p + "hole" + h + "score'></div>");

        }
    }
}


function getPar(player){
    let inscore = 0;
    let outscore = 0;
    let score = 0;

    for(let i = 0; i < 9; i++){
        inscore += Number($("#p" + player + "h" + i).val());
    }

    for(let j = 9; j < 18; j++){
        outscore += Number($("#p" + player + "h" + j).val());

    }

    for (let s = 0; s < holes; s++){
        score += Number($("#p" + player + "h" + s).val());
    }


    $('#p' + player + "inscore").text(inscore);
    $('#p' + player + "outscore").text(outscore);
    $('#p' + player + "score").text(score);
    perHolePar(player);
}

function perHolePar(player){
    let currentPar;



}

function removePlayer(id){
    $("#playlabel" + id).remove();
    for(i = 0; i < selcourse.data.holes.length; i++){
        $("#p" + id + "h" + i).remove();
        $('.score' + i).remove();

        console.log('removing');
    }
    numplayers--;
}

// function calcScore(playerNum){ <---might Get Replaced by getPar()---->
//     let totalScore = 0;
//     for(let t = 1; t <= holes; t++){
//         totalScore += $("p" + playerNum + "h" + t).val();
//     }
// }