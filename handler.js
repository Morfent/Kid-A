var request = require('request');

var actionUrl = 'http://play.pokemonshowdown.com/action.php';

module.exports = {
    setup: function() {
        Connection.send('|/avatar ' + Config.avatar);

        for (var i = 0; i < Config.rooms.length; i++) {
            Connection.send('|/j ' + Config.rooms[i]);
        }
    },

    parse: function(message) {
        if (!message) return;
        var split = message.split('|');

        switch (split[1]) {
            case 'challstr':
                console.log('Received challstr, logging in...');

                var challstr = split.slice(2).join('|');

                request.post(actionUrl, {headers : {'Content-Type': 'application/x-www-form-urlencoded'}, body: 'act=login&name=' + Config.username + '&pass=' + Config.password + '&challstr=' + challstr},
                    (error, response, body) => {
                        if (!error && response.statusCode == 200) {
                            if (body[0] === ']') {
                                try {
                                    body = JSON.parse(body.substr(1));
                                } catch (e) {}
                                if (body.assertion && body.assertion[0] !== ';') {
                                    Connection.send('|/trn ' + Config.username + ',0,' + body.assertion);
                                } else {
                                    console.log("Couldn't log in.");
                                    process.exit(-1);
                                }
                            } else {
                                console.log("Incorrect request.");
                                process.exit(-1);
                            }
                        }
                    }
                );
                break;
            case 'updateuser':
                if (split[2] !== Config.username) return false;

                console.log("Logged in as " + split[2] + ". Setting up bot.");
                this.setup();
                console.log("Setup done.");
                break;
            case 'pm':
                if (toId(split[2]) === toId(Config.username)) return false;
                console.log("PM from " + split[2] + ": " + split[4]);

                Connection.send("|/reply Hi, I am a bot that is currently spying on everything you say in order to get his owner some fancy statistics. I don't have any cool commands so don't even try.");
                break;
            case 'c':
            case 'c:':
                if (!split[0]) split[0] = '>lobby'; // Zarel can't code
                Analyzer.analyze(split[0].substr(1).trim(), split[4]);
                break;
        }
    }
};
