const fs = require('fs/promises');
const path = require('path');

const filePath = path.join(__dirname, '..', 'players_comments.txt');

function formatComment(player, comment) {
  return (
    `Player - ID:${player.id}, Name: ${player.name ?? 'Not mention'}, ` +
    `Birthday: ${player.birthday ?? 'Not mention'}, Gender: ${
      player.gender ?? 'Not mention'
    }\n` +
    `Comment: ${comment}\n\n`
  );
}
//save the comment in local file
async function saveComment(player, comment) {
  const content = formatComment(player, comment);
  try {
    await fs.appendFile(filePath, content, 'utf8');
  } catch (err) {
    throw { status: 500, message: 'Failed to save comment to file' };
  }
}

module.exports = { saveComment };
