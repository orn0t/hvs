module.exports = function(pg, db, errorCodes, bcrypt){

    const saltRounds = 10;

	var User = {
        register: (data, callback) => {
            db.query(`select * from public.User where login=$1`, [data.login], (err, result)=>{
                if(err){
                    callback(err)
                } else if(result.rows.length) {
                    callback({
                        message: 'Same user already exists',
                        code: errorCodes.userAlreadyExists
                    })
                } else {
                    bcrypt.hash(data.password, saltRounds, function(err, hash) {
                        if(err){
                            callback(err)
                        } else {
                            db.query(`insert into public.User (login, password, userPriviledge) values
                                ($1, $2, $3)`, [data.login, hash, 'user'], (err) => {
                                if(err){
                                    callback(err)
                                } else {
                                    callback(null)
                                }
                            })
                        }
                    })
                }
            })
        },

        login: (data, callback) => {
            db.query(`select * from public.User
                where login = $1`, [data.login], function(err, result){
                if (err) {
                    callback(err)
                } else {
                    if (result.rows.length == 0){
                        callback({
                            code: errorCodes.userNotExists,
                            message: 'User not exists'
                        })
                        return
                    }
                    var user = result.rows[0];
                    bcrypt.compare(data.password, user.password, (err, passwordsMatch) => {
                        if(err){
                            callback(err)
                        } else if(!passwordsMatch) {
                            callback({
                                code: errorCodes.wrongPassword,
                                message: 'Wrong password'
                            })
                        } else {
                            callback(null, null, {
                                userId: result.rows[0].id,
                                userPriviledge: result.rows[0].userPriviledge
                            })
                        }
                    })
                }
            })
        },
		getProfile: function(data, callback){
    		db.query('select login from public.User where id = $1', [data.userId], function (err, result) {
                if (err) {
                    callback(err)
                } else {
                    callback(null, result.rows[0]);
                }
            })
    	},
        changePassword: function(data, callback){
            db.query('select * from public.User where id = $1', [data.userId], function (err, result) {
                if (err) {
                    callback(err)
                } else {
                    var user = result.rows[0];
                    bcrypt.compare(data.oldPassword, user.password, (err, passwordsMatch) => {
                        if(err){
                            callback(err)
                        } else if(!passwordsMatch) {
                            callback({
                                code: errorCodes.wrongPassword,
                                message: 'Wrong old password'
                            })
                        } else {
                            bcrypt.hash(data.newPassword, saltRounds, function(err, newHash) {
                                if(err){
                                    callback(err)
                                } else {
                                    db.query(`update public.User set password=$2 where id=$1`,
                                        [data.userId, newHash], (err) => {
                                        if(err){
                                            callback(err)
                                        } else {
                                            callback(null)
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        },
        logout: function(data, callback){
            callback(null, null, {});
        }
	}

    return User;
}








