var helpTopics = {
	commands: 'commands.html'
};

module.exports = {
	commands: {
		help: function(userstr, room, message) {
			if (!canUse(userstr, 1)) return {pmreply: "Permission denied."};

			if (!message) return {reply: "Available help topics: " + Object.keys(helpTopics).join(', ')};

			message = toId(message);
			if (!(message in helpTopics)) return {pmreply: "Invalid option for topic."};

			return {reply: Server.url + helpTopics[message]};
		}
	}
};
