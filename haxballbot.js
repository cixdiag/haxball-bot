//İbrahim Ercan

var room = HBInit({ roomName: "3v3,YS,istatistikli", maxPlayers: 8 , playerName: "Host", public: true});
room.setDefaultStadium("Big");
room.setScoreLimit(3);
room.setTimeLimit(3);
room.setTeamsLock(true);


var admin_nick = "ibotheperfect"
var players = [];
var blue_team_players = [];
var red_team_players = [];
var spec_team_players = [];
var stats = {};
var last_toucher;
var second_toucher;

function compare(a,b) {
  if (stats[a.id].rate < stats[b.id].rate)
    return 1;
  if (stats[a.id].rate > stats[b.id].rate)
    return -1;
  if (stats[a.id].rate == stats[b.id].rate){
    if (stats[a.id].win < stats[b.id].win)
        return 1;
    if (stats[a.id].win > stats[b.id].win)
        return -1;
  }
  return 0;
}

function compare_goal(a,b) {
  if (stats[a.id].score < stats[b.id].score)
    return 1;
  if (stats[a.id].score > stats[b.id].score)
    return -1;
  if (stats[a.id].score == stats[b.id].score){
    if (stats[a.id].assist < stats[b.id].assist)
        return 1;
    if (stats[a.id].assist > stats[b.id].assist)
        return -1;
  }
  return 0;
}

function printPlayerStat(player){
    room.sendChat(player.name + " Win: "+ stats[player['id']].win + ", Lose: " + stats[player['id']].lose + ", %: " + stats[player['id']].rate + ", Goal: " + stats[player['id']].score + ", Assist: " + stats[player['id']].assist);

}

function printHelp(){
    room.sendChat("Komutlar: !best, !all, !me, !goalking, !help");
}
room.onPlayerJoin = function(player) {
    //set admin
    players = room.getPlayerList().filter((player) => player.id != 0 );
    if (player.name == admin_nick && players.find((player) => player.admin) == null ){
        room.setPlayerAdmin(player.id, true);
    }
    
    //initialize score
    stats[player.id] = {}
    stats[player.id].win = 0;
    stats[player.id].lose = 0;
    stats[player.id].score = 0;
    stats[player.id].rate = 0;
    stats[player.id].assist = 0;
    
    room.sendChat("Hoşgeldin "+ player.name);
    printHelp();
}

room.onTeamVictory = function(scores) {
    players = room.getPlayerList().filter((player) => player.id != 0 );
    spec_team_players = room.getPlayerList().filter((player) => player.team == 0 );
    blue_team_players = room.getPlayerList().filter((player) => player.team == 2 );
    red_team_players = room.getPlayerList().filter((player) => player.team == 1 );
    var i;
    

    if (scores.red > scores.blue){ //red win
        var winner_team = red_team_players;
        var loser_team = blue_team_players;
    }
    else{ //blue win
        var winner_team = blue_team_players;
        var loser_team = red_team_players;
    }
    for (i = 0; i < loser_team.length; i++) { 
        stats[loser_team[i]['id']].lose += 1;
        stats[loser_team[i]['id']].rate = 100 * stats[loser_team[i]['id']].win / (stats[loser_team[i]['id']].win + stats[loser_team[i]['id']].lose)

    }
    for (i = 0; i < winner_team.length; i++) { 
        stats[winner_team[i]['id']].win += 1;
        stats[winner_team[i]['id']].rate = 100 * stats[winner_team[i]['id']].win / (stats[winner_team[i]['id']].win + stats[winner_team[i]['id']].lose)
        printPlayerStat(winner_team[i]);
    }

    
}

room.onPlayerChat = function(player, message) {
    players = room.getPlayerList().filter((player) => player.id != 0 );
    var i;
    
    
    if (message == "!all"){
        players.sort(compare);
        for (i = 0; i < players.length; i++) {
            printPlayerStat(players[i]);
        }
    }
    else if (message == "!best"){
        players.sort(compare);
        printPlayerStat(players[0]);
    }
    else if (message == "!me"){
        printPlayerStat(player);
    }
    else if (message == "!goalking"){
        players.sort(compare_goal);
        printPlayerStat(players[0]);
    }
    else if (message == "!help"){
        printHelp();
    }

}

room.onPlayerBallKick = function(player) {
    second_toucher = last_toucher;
    last_toucher = player;

}

room.onTeamGoal = function(team){
    var str = "";
    if (team == last_toucher.team){
        stats[last_toucher.id].score += 1;
        str = "GOOOOL!!! " + last_toucher.name + " attı. ";
        if (second_toucher && team == second_toucher.team && second_toucher.id != last_toucher.id ){
            stats[second_toucher.id].assist += 1; 
            str += "Asist " + second_toucher.name;
        }
        room.sendChat(str);
    }

}
