var ContainerModel = Backbone.Model.extend({
});

var UserModel = Backbone.Model.extend({
    
});


var UserCollection = Backbone.Collection.extend({
    model: UserModel
});

var ChatModel = Backbone.Model.extend({
    
});


var ChatCollection = Backbone.Collection.extend({
    model: ChatModel,
    comparator: function(chat1, chat2) {
        if (chat1.get("message").timestamp == null) a = 0;
        else a = chat1.get("message").timestamp;
        if (chat2.get("message").timestamp == null) b = 0;
        else b = chat2.get("message").timestamp;
        return a-b;
    }
});



var HomeModel = Backbone.Model.extend({
    defaults: {
	onlineUsers: new UserCollection(),
	userChats: new ChatCollection([
	    new ChatModel({ sender: '', message: 'Chat Server v.1' })
	])
    },


    addUser: function(username) {
	this.get('onlineUsers').add(new UserModel({ name: username }));
    },

    removeUser: function(username) {
	var onlineUsers = this.get('onlineUsers');

        var u = onlineUsers.find(function(item) { return item.get('name') == username; });

        if (u) {
            onlineUsers.remove(u);
        }
    },

    addChat: function(chat) {
	      this.get('userChats').add(new ChatModel({ sender: chat.sender, message: chat.message}));
    },
});


var LoginModel = Backbone.Model.extend({
    defaults: {
	error: ""
    }
});
