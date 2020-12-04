const { prefix } = require('../config.json');

module.exports = {
	name: 'help',
	description: "Donne toutes les commandes ou affiche l'aide a propos d'une commande spécifique",
	aliases: ['commands'],
	usage: '[nom de la commande]',
	cooldown: 5,
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push('Voici une liste de toutes les commandes :');
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nVous pouvez utiliser \`${prefix}help [nom de la commande]\` pour afficher les informations d'une commande !`);

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('Je vous ai envoyé un message privé avec toutes mes commandes');
				})
				.catch(error => {
					console.error(`Je n'ai pas pu envoyer de message privé, ${message.author.tag}.\n`, error);
					message.reply('Il semblerait que je ne puisse pas vous envoyer de MP');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('Cette commande n\'est pas valide.');
		}

		data.push(`**Nom:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Utilisation:** ${prefix}${command.name} ${command.usage}`);

		data.push(`**Cooldown:** ${command.cooldown || 3} seconde(s)`);

		message.channel.send(data, { split: true });
	},
};
