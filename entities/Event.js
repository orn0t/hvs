module.exports =  function(pg, db){

    // stubs
    // TODO: make honest queries to right db
	Event = {
		getAllEvents: function(data, callback){
    		db.query('select * from Event ', [], function(err, result){
                // console.log(result.rows)
                if (err) {
                    callback(err)
                } else {
                    callback(null, result.rows);
                }
            })
    	},
    	editEvent: function(data, callback){
            db.query(`update Event
            set fblink=$2, pointsCost=$3, pointsRevenue=$4, volunteersQuota=$5, volunteersRevenueQuota=$6
            where id = $1`, 
            [data.eventId, data.fblink, data.pointsCost, data.pointsRevenue, data.volunteersQuota, data.volunteersRevenueQuota],
            (err, result) => {
                if (err) {
                    callback(err)
                } else {
                    callback(null);
                }
            })
    	},
    	getEventById: function(data, callback){
            db.query('select * from Event where id = $1', [data.eventId], (err, result) => {
                if (err) {
                    callback(err)
                } else {
                    callback(null, result.rows);
                }
            })
    	},

		addEvent: function(data, callback){
            db.query('insert into Event (fblink, pointsCost, pointsRevenue, managerId, volunteersQuota, volunteersRevenueQuota) values ($1, $2, $3, $4, $5, $6)',
            [data.fblink, data.pointsCost, data.pointsRevenue, data.managerId, data.volunteersQuota, data.volunteersRevenueQuota],
            (err, result) => {
                if (err) {
                    callback(err)
                } else {
                    callback(null)
                }
            }) 
    	},

		deleteEvent: function(data, callback){
            db.query('delete from Event where id=$1', [data.eventId], function(err, result){
                if (err) {
                    callback(err)
                } else {
                    callback(null)
                }
            })
    	}
	}

	return Event;
}

               