var Utils = {
	getUnixTimestamp : function(d) { return Math.round(d.getTime() / 1000); },
	getDateFromUnix : function(t) { return new Date(t*1000); }
}

function TagCloud(data) {

	//////// massage the tag data

	var tagMap = {};
	var work = data.work,
		education = data.education;

	var thisWork, start, end, timeDelta, tags;
	for(var name in work) {
		thisWork = work[name];
		thisWork = (thisWork instanceof Array) ? thisWork : [thisWork];

		for(var i=0; i<thisWork.length; i++) {

			start = thisWork[i].date.start;
			end = thisWork[i].date.end;

			start = new Date(start);
			end = (end) ? (new Date(end)) : (new Date());

			timeDelta = Utils.getUnixTimestamp(end) - Utils.getUnixTimestamp(start);

			tags = thisWork[i].tags;
			for(var keyword in tags) {
				if(!(keyword in tagMap)) { tagMap[keyword] = 0; }
				tagMap[keyword] += tags[keyword] * timeDelta;
			}
		}
	}

	var thisEducation, courses, thisCourse, thisDate, timeDelta, start, end, tags;
	for(var name in education) {

		thisEducation = education[name];
		courses = thisEducation.courses;
		for(var i=0; i<courses.length; i++) {

			thisCourse = courses[i];
			thisDate = thisCourse.date;
			thisDate = (thisDate instanceof Array) ? thisDate : [thisDate];

			timeDelta = 0;
			for(var j=0; j<thisDate.length; j++) {

				start = thisDate[j].start;
				end = thisDate[j].end;

				start = new Date(start);
				end = (end) ? (new Date(end)) : (new Date());

				timeDelta += (Utils.getUnixTimestamp(end) - Utils.getUnixTimestamp(start));
			}

			tags = thisCourse.tags;
			for(var keyword in tags) {
				if(!(keyword in tagMap)) { tagMap[keyword] = 0; }
				tagMap[keyword] += tags[keyword] * timeDelta;
			}
		}

	}

	this._tags = tagMap;
}

TagCloud.prototype = {
	steps : 5,
	render : function() {

		var tagArray = [];
		var min = null, max = null;
		var tags = this._tags;
		for(var keyword in tags) {

			min = (min == null) ? tags[keyword] : Math.min(tags[keyword], min);
			max = (max == null) ? tags[keyword] : Math.max(tags[keyword], max);
			tagArray.push({ tag : keyword, size : tags[keyword] });
		}

		tagArray.sort(function(a,b) {
			return (a.tag > b.tag) ? 1 : (b.tag > a.tag ) ? -1 : 0;
		});

		var stepSize = (max - min)/this.steps;

		var html = [];
		for(var i=0; i<tagArray.length; i++) {
			html.push(["<li><span style='font-size:",(75+(Math.floor((tagArray[i].size - min)/stepSize)*30)),"%'>",tagArray[i].tag,"</span></li>"].join(''));
		}
		return html.join('');
	}
};
