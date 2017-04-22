var LocationBasedChatServerCompute = function() {
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
    this.addUserUpdate = function(user_id, user_location, timestamp, range)
    {

    };

    /**
     * Sends a message to the compute service
     * @param {String} user_id The user id
     * @param {GeoPoint} message_location The location of the message
     * @param {Long} timestamp Unix timestamp of the message
     * @param {Long} sequence_number Message sequence number
     * @param {String} message The message itself
     */
    this.addSingleMessage = function(user_id, message_location, timestamp, sequence_number, message)
    {

    };


    /**
     * Gets user location at the moment
     * @param {String} user_id The user id
     * @return {GeoPoint} User's location
     */
    this.retrieveUserLocation = function(user_id)
    {

    };

    /**
     * Gets the first message in queue for a given user
     * @param {String} user_id The user id
     * @return {Message} The first message in queue for the user
     */
    this.retrieveSingleMessage = function(user_id)
    {

    };

    //Helper functions bellow, not part of the API

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
