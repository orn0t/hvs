module.exports =  function(pg, db){

    // stubs
    // TODO: make honest queries to right db

	Project = {
		getAllProjects: function(data, callback){
    		db.query('select * from Project ', [], function(err, result){
                // console.log(result.rows)
                if (err) {
                    callback(err)
                } else {
                    callback(null, result.rows);
                }
            })
    	},
    	editProject: function(data, callback){
            db.query(`update Project
            set name=$2, description=$3, managerId=$4
            where id = $1`, 
            [data.projectId, data.name, data.description, data.managerId],
            (err, result) => {
                if (err) {
                    callback(err)
                } else {
                    callback(null);
                }
            })
    	},
    	getProjectById: function(data, callback){
            db.query('select * from Project where id = $1',
                [data.projectId], (err, result) => {
                if (err) {
                    callback(err)
                } else {
                    callback(null, result.rows[0]);
                }
            })
    	},
		addProject: function(data, callback){
            db.query('insert into patient (name, description, managerId) values ($1, $2, $3)',
            [data.name, data.description, data.managerId],
            (err, result) => {
                if (err) {
                    callback(err)
                } else {
                    callback(null)
                }
            }) 
    	},
		deleteProject: function(data, callback){
            db.query('delete from patient where id=$1',
                [data.projectId], (err, result) => {
                if (err) {
                    callback(err)
                } else {
                    callback(null)
                }
            })
    	}
	}

	return Project;
}

               