var ChatClient = function(options) {

    getLocationHelper = function() {
        var location = {};
        return location;
    };

    timestampHelper = function() {
        return Math.round((new Date()).getTime() / 1000);
    };

    var self = this;

    self.seconds = 1;

    self.saveAndSendLocation = function(location){
        self.location = location;
        self.sendUpdate();
    };

    self.sendUpdate = function(){
        data = {timestamp: timestampHelper(), user_location: self.location, range: self.distance_range};
        self.socket.emit("update", data);
    };


    self.refreshLocation = function() {
        if ("geolocation" in navigator) {
		        var position = navigator.geolocation.getCurrentPosition(_.bind(function(position) {
                var location = {};
                location.lat = position.coords.latitude;
                location.lon = position.coords.longitude;
                self.saveAndSendLocation(location);
            }));
        }else{
	          alert("This App Requires geolocation");
        }
    };

    self.setRadius = function(radius) {
        self.distance_range = radius;
        self.sendUpdate();
    };

    setInterval(self.refreshLocation, this, 1000 * self.seconds);

    self.vent = options.vent;

    self.hostname = 'http://' + window.location.host;

    self.connect = function() {
        self.socket = io.connect(self.hostname);


        self.setResponseListeners(self.socket);
    };

    self.login = function(name) {
	      self.socket.emit("login", name);
    };

    self.sequence_number = 0;

    self.location = {};

    self.distance_range = 2321423;

    self.chat = function(chat) {
        message = {message_location: self.location, timestamp: timestampHelper(), sequence_number: self.sequence_number, message: chat};
        self.sequence_number++;
	      self.socket.emit("chat", message);
    };

    self.setResponseListeners = function(socket) {
        socket.on('welcome', function(data) {
	          // request server info
	          socket.emit("onlineUsers");

            self.vent.trigger("loginDone", data);
        });

	      socket.on('loginNameExists', function(data) {
	          self.vent.trigger("loginNameExists", data);
	      });

	      socket.on('loginNameBad', function(data) {
	          self.vent.trigger("loginNameBad", data);
	      });

	      socket.on('onlineUsers', function(data) {
	          self.vent.trigger("usersInfo", data);
	      });

	      socket.on('userJoined', function(data) {
	          self.vent.trigger("userJoined", data);
	      });


	      socket.on('userLeft', function(data) {
	          self.vent.trigger("userLeft", data);
	      });

	      socket.on('chat', function(data) {
	          self.vent.trigger("chatReceived", data);
	      });
    };

}
