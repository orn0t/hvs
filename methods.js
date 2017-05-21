module.exports = function(_, pg, User, EventModel, Project, Donate, errorCodes) {

	var common = {
	    getProfile: function(session, data, callback){
            data.userId = session.userId
    		User.getProfile(data, callback)
    	},
        changePassword: function(session, data, callback){
            data.userId = session.userId
            User.changePassword(data, callback)
        },
        logout: function(session, data, callback){
            User.logout(data, callback)
        }
    }

    var guest = {
        login: function(session, data, callback){
            User.login(data, callback)
        },
        register: function(session, data, callback){
            User.register(data, callback)
        }
    }

	var user = {
		getProfile: common.getProfile,
		changePassword: common.changePassword,
        logout: common.logout
	}

	var volunteer = {
		getProfile: common.getProfile,
		changePassword: common.changePassword,
        logout: common.logout
	}

	var manager = {
		getProfile: common.getProfile,
		changePassword: common.changePassword,
        logout: common.logout
	}

	var admin = {
		getProfile: common.getProfile,
		changePassword: common.changePassword,
        logout: common.logout
	}

    return {
        guest,
        user,
        volunteer,
        manager,
        admin
    }
}