module.exports = function(pg, prettify){
	var connectionString = process.env.DATABASE_URL;

	function query(sql, params, callback) {
	    pg.connect(connectionString, function(err, client, done) {
	    	if (err) {
	    		callback(err)
	        	return console.error('error fetching client from pool', err);
	     	}
	    	client.query(sql, params, function(err, result) {
	        	done();
	        	if (err) {
	        		console.error('error running query', err);
	        	}
	        	if (callback) {
	        		result.rows =  prettify(result.rows) // e
	            	callback(err, result);
	        	}
	      	});
	    });
	};

	return {query};
}