module.exports = function(){

	var ChangeList = {
		userpriviledge: 'userPriviledge',
		pointscost: 'pointsCost',
		pointsrevenue: 'pointsRevenue',
		managerid: 'managerId',
		volunteersquota: 'volunteersQuota',
		volunteersrevenuequota: 'volunteersRevenueQuota',
		eventid: 'eventId',
		participanttype: 'participantType',
		projectid: 'projectId',
		userid: 'userId'
	};

	function prettify(data){
		var result = []
		for (var i = 0; i < data.length; i++){
			result.push({})
			for (var key in data[i]){
				if (ChangeList[key]){
					var changeKey = ChangeList[key]
					result[i][changeKey] = data[i][key] 
				} else {
					result[i][key] = data[i][key] 
				}
			}			
		}
		return result;
	}

	return prettify
}