_ = require('underscore');
compute_module = require('./compute.js');
compute = new compute_module.LocationBasedChatServerCompute;

var Server = function(options) {
    var self = this;

    self.io = options.io;

    self.users = [];

    self.init = function() {
        // Fired upon a connection
        self.io.on("connection", function(socket) {
            self.handleConnection(socket);
        });
    };


    self.handleConnection = function(socket) {
        // wait for a login
        socket.on('login', function(username) {
            var nameBad = !username || username.length < 3 || username.length > 10;

            if (nameBad) {
                socket.emit('loginNameBad', username);
                return;
            }

	          var nameExists = _.some(self.users, function(item) {
		            return item.user == username;
	          });

	          if (nameExists) {
		            socket.emit("loginNameExists", username);
	          } else {
		            var newUser = new User({ user: username, socket: socket });

                self.users.push(newUser);

		            self.setResponseListeners(newUser);


                socket.emit("welcome");
		            self.io.sockets.emit("userJoined", newUser.user);
	          }
	      });

    };

    self.setResponseListeners = function(user) {

        compute.addMessageCallback(user.user, function(message) {
		        self.io.sockets.emit("chat", { sender: user.user, message: message });
        });

	      user.socket.on('disconnect', function() {
	          self.users.splice(self.users.indexOf(user), 1);
            compute.userDisconnect(user.user);
	          self.io.sockets.emit("userLeft", user.user);
	      });


	      user.socket.on("onlineUsers", function() {

	          var users = _.map(self.users, function(item) {
		            return item.user;
	          });

            user.socket.emit("onlineUsers", users);
	      });

	      user.socket.on("chat", function(chat) {
	          if (chat) {
                compute.addSingleMessage(chat);
	          }
	      });

        user.socket.on("update", function(update) {
            compute.addUserUpdate(user.user, update.location, update.timestamp, update.distance);
        });
    };
};


// User Model
var User = function(args) {
    var self = this;

    self.socket = args.socket;
    self.user = args.user;
};

module.exports = Server;
