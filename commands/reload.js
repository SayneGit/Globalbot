module.exports = {
	name: 'reload',
	description: 'Recharge une commande',
	args: true,
	execute(message, args) {
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return message.channel.send(`Il n'y a aucune commande avec ce nom ou cet alias \`${commandName}\`, ${message.author}!`);
		}

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send(`La commande \`${command.name}\` a été rechargée !`);
		} catch (error) {
			console.error(error);
			message.channel.send(`Il y a eu une erreur en rechargeant cette commande : \`${command.name}\`:\n\`${error.message}\``);
		}
	},
};