module.exports =  function(pg, db, _, moment){
    // stubs
    // TODO: make honest queries to right db

	Donate = {
		getMonthBudget: function(data, callback){
            db.query('select * from MonthlyBudget where MonthlyBudget.year=$1 and MonthlyBudget.month=$2',
                [moment().year(), moment().month()], (err, result) => {
                // console.log(result.rows)
                if (err) {
                    callback(err)
                } else {
                    callback(null, result.rows[0]);
                }
            })
    	}
	}

	return Donate;
}

               