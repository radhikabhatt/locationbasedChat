module.exports.LocationBasedChatServerCompute = function() {
    /**
     * Datastructures involved in the API
     *
     * GeoPoint:
     * @field {Float} lat latitude
     * @field {Float} lat longitude
     * Example:
     * {
     *   lat: 41.12,
     *   lon: -71.34
     * }
     *
     * {Message}:
     * @field {String} user_id The user id
     * @field {GeoPoint} message_location The location of the message
     * @field {Long} timestamp Unix timestamp of the message
     * @field {Long} sequence_number Message sequence number
     * @field {String} message The message itself
     * Example:
     * {
     *   user_id: "yoel",
     *   message_location: {lat: 41.12, lon: -71.34}
     *   timestamp: 1492898138
     *   sequence_number: 1
     *   message: "Hello World!"
     * }
     */

    /**
     * Sends a location update from an specific user
     * to the compute service
     * @param {String} user_id The user id
     * @param {GeoPoint} user_location The location of the user
     * @param {Long} timestamp Unix timestamp of the update
     * @param {Float} range Desired range for receiving messages in Kms
     */
    self = this;

    this.addUserUpdate = function(user_id, user_location, timestamp, range)
    {
        if (this.locations[user_id] == null) {
            this.locations[user_id] = {};
        }
        this.locations[user_id].location = user_location;
        this.locations[user_id].range = range;
    };

    /**
     * Sends a message to the compute service
     * @param {Message} message
     */
    this.addSingleMessage = function(message)
    {
        this.inputMessageQueue.push(message);
        this.doCompute();
    };


    /**
     * Gets user location at the moment
     * @param {String} user_id The user id
     * @return {GeoPoint} User's location
     */
    this.retrieveUserLocation = function(user_id)
    {
        return this.locations[user_id].location;
    };

    /**
     * Gets the first message in queue for a given user
     * @param {String} user_id The user id
     * @return {Message} The first message in queue for the user, null if there is no message for this user
     */
    this.retrieveSingleMessage = function(user_id)
    {
        if (this.outputMessageQueues[user_id] == null) {
            return null;
        }
        return this.outputMessageQueues[user_id].shift();
    };

    //Helper functions bellow, not part of the API

    this.locations = {};
    this.outputMessageQueues = {};
    this.inputMessageQueue = [];

    this.doCompute = function() {
        message = this.inputMessageQueue.shift();
        if (message == null) {
            return;
        }
        self = this;
        Object.keys(this.locations).forEach(function(user_id) {
            location_data = self.locations[user_id];
            console.log(distanceBetweenLocations(message.message_location, location_data.location));
            if (distanceBetweenLocations(message.message_location, location_data.location) <= location_data.range) {
                if ( self.outputMessageQueues[user_id] == null) {
                    self.outputMessageQueues[user_id] = [];
                }
                self.outputMessageQueues[user_id].push(message);
            }
        });
    };

    distanceBetweenLocations = function(location1, location2) {
        return distanceInKmBetweenEarthCoordinates(location1.lat, location1.lon, location2.lat, location2.lon);
    };

    // START credit to StackOverflow users cletus and jameshfisher
    degreesToRadians = function(degrees) {
        return degrees * Math.PI / 180;
    };

    distanceInKmBetweenEarthCoordinates = function(lat1, lon1, lat2, lon2) {
        var earthRadiusKm = 6371;

        var dLat = degreesToRadians(lat2-lat1);
        var dLon = degreesToRadians(lon2-lon1);

        lat1 = degreesToRadians(lat1);
        lat2 = degreesToRadians(lat2);

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return earthRadiusKm * c;
    };
    // END credit to StackOverflow users cletus and jameshfisher
};


