const fs = require('fs');
const path = require('path');

//Responsible to save the comment in the local file
const saveComment = (player, comment) => {
  const filePath = path.join(__dirname, '..', 'players_comments.txt');

  const commentData = `Player - ID:${player.id}, Name: ${
    player.name ?? 'Not mention'
  }, Birthday: ${player.birthday ?? 'Not mention'}, Gender: ${
    player.gender ?? 'Not mention'
  }\nComment: ${comment}\n\n`;

  fs.appendFileSync(filePath, commentData, 'utf8');
};

module.exports = { saveComment };
