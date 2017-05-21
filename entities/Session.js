module.exports =  function(_, pg, db, errorCodes){
	
	function makeid(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 12; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    function createSession(data, callback){
    	var sessionId = makeid()
    	db.query('insert into session values($1, $2)', 
    	[sessionId, data.userId], function(err, result){
			if (err) {
    			callback(err)
    		} else {
                restoreSession(sessionId, function(err, session){
                    if(err){
                        callback(err)
                    }else{
                        callback(null, session.sessionId, session.userPriviledge)
                    }
                })	
        	}
    	})
    }

    function restoreSession(sessionId, callback){
    	if(!_.isString(sessionId)){
            callback(null, {
                userId: null,
                sessionId: null,
                userPriviledge: 'guest'
            })
            return
        }
    	db.query(`select public.User.userPriviledge, Session.userId
        from Session inner join public.User on Session.userId = public.User.id
            where Session.token = $1`,
        [sessionId], function(err, result){
    		if (err) {
    			callback(err)
    		} else {
                if (result.rows.length == 0){
                    callback({
                        code: errorCodes.invalidSessionId,
                        message: 'Invalid Session Id'
                    })
                    return
                }
                // console.log(result.rows, sessionId)
    			callback(null, {
                    userId: result.rows[0].userId,
                    sessionId: sessionId,
                    userPriviledge: result.rows[0].userPriviledge
                });
    		}
    	})
    }

	Session = {
		createSession: createSession,
        restoreSession: restoreSession
	}

	return Session;
}