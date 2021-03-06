import { CHAT_MESSAGE } from 'squad-server/events';

export default {
  name: 'team-randomizer',
  description:
    "The <code>team-randomizer</code> plugin can be used to randomize teams. It's great for destroying clan stacks " +
    'or for social events. It can be run by typing <code>!randomize</code> into in-game admin chat.',

  defaultEnabled: true,
  optionsSpec: {
    command: {
      required: false,
      description: 'The command used to randomize the teams.',
      default: '!randomize'
    }
  },

  init: async (server, options) => {
    const commandRegex = new RegExp(`^${options.command}`, 'i');

    server.on(CHAT_MESSAGE, (info) => {
      if (info.chat !== 'ChatAdmin') return;

      const match = info.message.match(commandRegex);
      if (!match) return;

      const players = server.players.slice(0);

      let currentIndex = players.length;
      let temporaryValue;
      let randomIndex;

      // While there remain elements to shuffle...
      while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = players[currentIndex];
        players[currentIndex] = players[randomIndex];
        players[randomIndex] = temporaryValue;
      }

      let team = '1';

      for (const player of players) {
        if (player.teamID !== team) {
          server.rcon.execute(`AdminForceTeamChange "${player.steamID}"`);
        }

        team = team === '1' ? '2' : '1';
      }
    });
  }
};
