//İbrahim Ercan

var room = HBInit({ roomName: "3v3 YS istatistikli", maxPlayers: 8 , playerName: "Host", public: true});
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

function compare(a,b) {
  if (stats[a.id].score < stats[b.id].score)
    return 1;
  if (stats[a.id].score > stats[b.id].score)
    return -1;
  if (stats[a.id].score == stats[b.id].score){
    if (stats[a.id].win < stats[b.id].win)
        return 1;
    if (stats[a.id].win > stats[b.id].win)
        return -1;
  }
  return 0;
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
    
    room.sendChat("Hoşgeldin "+ player.name);
    room.sendChat("Komutlar: !best, !all, !me, !help");
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
        stats[loser_team[i]['id']].score = 100 * stats[loser_team[i]['id']].win / (stats[loser_team[i]['id']].win + stats[loser_team[i]['id']].lose)
        //room.sendChat(loser_team[i].name + " Win: "+ stats[loser_team[i]['id']].win + ", Lose: " + stats[loser_team[i]['id']].lose + ", %: " + stats[loser_team[i]['id']].score );
    }
    for (i = 0; i < winner_team.length; i++) { 
        stats[winner_team[i]['id']].win += 1;
        stats[winner_team[i]['id']].score = 100 * stats[winner_team[i]['id']].win / (stats[winner_team[i]['id']].win + stats[winner_team[i]['id']].lose)
        room.sendChat(winner_team[i].name + " Win: "+ stats[winner_team[i]['id']].win + ", Lose: " + stats[winner_team[i]['id']].lose + ", %: " + stats[winner_team[i]['id']].score );
    }

    
}

room.onPlayerChat = function(player, message) {
    players = room.getPlayerList().filter((player) => player.id != 0 );
    var i;
    players.sort(compare);
    
    if (message == "!all"){    
        for (i = 0; i < players.length; i++) { 
            room.sendChat(players[i].name + " Win: "+ stats[players[i]['id']].win + ", Lose: " + stats[players[i]['id']].lose + ", %: " + stats[players[i]['id']].score)
        }
    }
    else if (message == "!best"){
        room.sendChat(players[0].name + " Win: "+ stats[players[0]['id']].win + ", Lose: " + stats[players[0]['id']].lose + ", %: " + stats[players[0]['id']].score)
    }
    else if (message == "!me"){
        room.sendChat(player.name + " Win: "+ stats[player['id']].win + ", Lose: " + stats[player['id']].lose + ", %: " + stats[player['id']].score)
    }
    else if (message == "!help"){
        room.sendChat("Komutlar: !best, !all, !me, !help");
    }

}
