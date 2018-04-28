let golfholes = [];
let numplayers = 0;
let allcourses;
let selTee;
let selcourse;
let holes = 18;

//calling the golf api
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
//calling the api specific to the chosen course
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
//builds a column for all the holes, in score, and out score
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

    //loops through first nine for par/yard in
    for(i = 0; i < 9; i++){
        inpar += selcourse.data.holes[i].teeBoxes[teeindex].par;
        inyards += selcourse.data.holes[i].teeBoxes[teeindex].yards;
    }
    //loops through last nine for par/yard out
    for(j = 9; j < 18; j++){
        outpar += selcourse.data.holes[i].teeBoxes[teeindex].par;
        outyards += selcourse.data.holes[i].teeBoxes[teeindex].yards;

    }
    //loops through all for par/yard total
    for(t = 0; t < selcourse.data.holes.length; t++){
        totalpar += selcourse.data.holes[t].teeBoxes[selTee].par;
        totalyards += selcourse.data.holes[t].teeBoxes[selTee].yards;
    }
    //actually creating the columns for holes
    for(let i = 0; i < selcourse.data.holes.length; i++){
        $('.right').append("<div class='column' id='c" + i + "'>" +
            "<div class='holecol cheader'>" + (i + 1) + "</div>" +
            "<div class='holecol hcp'>" + selcourse.data.holes[i].teeBoxes[selTee].hcp + "</div>" +
            "<div class='holecol yards'>" + selcourse.data.holes[i].teeBoxes[selTee].yards + "</div>" +
            "<div class='holecol pars'>" + selcourse.data.holes[i].teeBoxes[selTee].par + "</div>" +
            "<div class='scoreboxes'></div>" +
            "</div>"
        );
    }
    //setting up the actual columns for scores then placing them
        inScoreCol = "<div class='totalsCol' id='inScore'>" +
            "<div class='theader'>in</div>" +
            "<div class='empty'></div>" +
            "<div class='totYards'>" + inyards + "</div>" +
            "<div class='totPar'>" + inpar + "</div>" +
            "<div class='scoreinfo' id='inScoreInfo'></div>" +
            "</div>";

        outScoreCol = "<div class='totalsCol' id='outScore'>" +
            "<div class='theader'>Out</div>" +
            "<div class='empty'></div>" +
            "<div class='totYards'>" + outyards + "</div>" +
            "<div class='totPar'>" + outpar + "</div>" +
            "<div class='scoreinfo' id='outScoreInfo'></div>" +
            "</div>";


        totalScoreCol = "<div class='totalsCol' id='totes'>" +
            "<div class='theader'>Total</div>" +
            "<div class='empty'></div>" +
            "<div class='totYards'>" + totalyards + "</div>" +
            "<div class='totPar'>" + totalpar + "</div>" +
            "<div class='scoreinfo' id='scoreInfo'></div>" +
            "</div>";

    $('.right').append(inScoreCol + outScoreCol + totalScoreCol);

}

function addPlayer(){

    if(numplayers < 4) {
        numplayers++;
    }else{
        $('#maxPlayers').show();
    }

    fillCard();

}
//fills out the player section of the card plus the score
function fillCard(){
    $(".names").text('');
    $('.scoreinfo').html('');
    $(".scoreboxes").html('');
    for(let p = 1; p <= numplayers; p++){
        $('.names').append("<div contenteditable='true' class='playerlabel' id='playlabel" + p + "'> Player "+ p +
            "<span id='deletePlayer' class='far fa-trash-alt' onclick='removePlayer(" + p + ")'></span> </div>" +
            "<div class='scoreRow' id='p" + p + "scoreRow'>Score: </div>");

        $("#inScoreInfo").append("<div class='swingspot score" + p + "' id='p" + p + "inscore'></div>" +
            "<div class='scoreRow' id='totP" + p + "inscore'></div>");

        $("#outScoreInfo").append("<div class='swingspot score" + p + "' id='p" + p + "outscore'></div>" +
            "<div class='scoreRow' id='totP" + p + "outscore'></div>");

        $("#scoreInfo").append("<div class='swingspot score" + p + "' id='p" + p + "score'></div>" +
            "<div class='scoreRow' id='totP" + p + "score'></div>");

        $('.holeinput').val('');
        for(let h = 0; h < selcourse.data.holes.length; h++){
            $("#c" + h).children('.scoreboxes').append("<input onkeyup='getPar(" + p + ","+ h + ")' class='holeinput' id='p"+ p + "h" + h + "' type='number'>" +
                "<div class='scoreRow play" + p + "hole" + h + "score'></div>");

        }
    }
}
//getting the actual in, out, and total scores and putting those values where needed
function getPar(player, hole){

    let inscore = 0;
    let inCalcscore = 0;
    let outscore = 0;
    let outCalcscore = 0;
    let score = 0;
    let calcScore = 0;

    for(let i = 0; i < 9; i++){
        inscore += Number($("#p" + player + "h" + i).val());
        inCalcscore += (Number($("#p" + player + "h" + i).val()) - selcourse.data.holes[i].teeBoxes[selTee].par);
    }

    for(let i = 9; i < 18; i++){
        outscore += Number($("#p" + player + "h" + i).val());
        outCalcscore += (Number($("#p" + player + "h" + i).val()) - selcourse.data.holes[i].teeBoxes[selTee].par);
    }

    for (let i = 0; i < holes; i++){
        score += Number($("#p" + player + "h" + i).val());
        calcScore += (Number($("#p" + player + "h" + i).val()) - selcourse.data.holes[i].teeBoxes[selTee].par);

    }


    $('#p' + player + "inscore").text(inscore);
    $("#totP" + player + "inscore").text(inCalcscore);

    $('#p' + player + "outscore").text(outscore);
    $("#totP" + player + "outscore").text(outCalcscore);

    $('#p' + player + "score").text(score);
    $("#totP" + player + "score").text(calcScore);

    $(".play" + player + "hole" + hole + "score").text(Number($("#p" + player + "h" + hole).val()) - selcourse.data.holes[hole].teeBoxes[selTee].par);

}

function removePlayer(id){
    $("#playlabel" + id).remove();
    $("#p" + id + "scoreRow").remove();
    for(let i = 0; i < selcourse.data.holes.length; i++){
        $("#p" + id + "h" + i).remove();
        $('.score' + i).remove();
        $('.scorerow').remove();
        $(".play" + id + "hole" + i + "score").remove();
    }
    numplayers--;
}
