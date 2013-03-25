$(function() {

	$(".hidden").removeClass("hidden");

/*
	$.get('rss.php', function(xml) {
		var $ul = $('#post-list'),
			limit = 5,
			count = 0;

		$ul.find('li').remove();

		$('channel item', xml).each(function() {
			var $item = $(this);

			var link = $('link',this).text(),
				title = $('title',this).text(),
				pubDate = new Date($('pubDate',this).text()),
				description = $('description',this).text(),
				pubDateF = (pubDate.getMonth()+1) + '/' + pubDate.getDate() + '/' + pubDate.getFullYear() + " " + pubDate.getHours() + ":" + pubDate.getMinutes();

			$ul.append([
				"<li><a target='_blank' href='",link,"'><strong>",title,"</strong></a> - <em>",pubDateF,"</em> - ",description,"</li>"
			].join(''));

			count++;
			return (count < limit);
		});
	});
*/
	var cloud = new TagCloud({
		'work' : {
			'Time Warner Cable' : [{
				title : "IT Specialist",
				date : { start : "06/01/2003", end : "08/01/2003" },
				tags : {
					'php' : 15,
					'mysql' : 15,
					'microsoftaccess' : 30,
					'marketing' : 40
				}
			},{
				title : "IT Specialist",
				date : { start : "06/01/2004", end : "08/01/2004" },
				tags : {
					'microsoftaccess' : 40,
					'oracle' : 40,
					'lotusapproach' : 20
				}
			},{
				title : "IT Specialist",
				date : { start : "06/01/2005", end : "08/01/2005" },
				tags : {
					'marketing' : 15,
					'windowsserver2003' : 20,
					'disaster-contingency' : 20,
					'data-retention' : 20,
					'activedirectory' : 25
				}
			}],
			'NSFive Design' : {
				title : "Owner/Founder",
				date : { start : "07/01/2005", end : "03/15/2007"},
				tags : {
					'php' : 10,
					'mysql' : 10,
					'asp' : 5,
					'xhtml' : 10,
					'css' : 10,
					'javascript' : 10,
					'hosting' : 10,
					'consulting' : 10,
					'marketing' : 5,
					'searchengineoptimization' : 5,
					'teamlead' : 5,
					'projectmanagement' : 10
				}
			},
			'Marshall University' : {
				title : "Web Developer",
				date: { start : "05/01/2006", end : "03/15/2007"},
				tags : {
					'asp' : 15,
					'mysql' : 15,
					'css' : 5,
					'javascript' : 5,
					'xhtml' : 10,
					'moderator' : 5,
					'searchengineoptimization' : 5,
					'technical-presentations' : 10,
					'teamlead' : 10,
					'projectmanagement' : 10,
					'vbscript' : 10
				}
			},
			'Bulldog Creative Services' : {
				title : "Web Director",
				date : { start : "03/01/2005", end : "05/01/2008" },
				tags : {
					'xhtml' : 5,
					'css' : 5,
					'javascript' : 5,
					'php' : 5,
					'asp' : 5,
					'mysql' : 5,
					'mssql' : 5,
					'searchengineoptimization' : 5,
					'marketing' : 5,
					'technical-presentations' : 5,
					'disaster-contingency' : 5,
					'data-retention' : 5,
					'projectmanagement' : 5,
					'hosting' : 5,
					'technical-support' : 5,
					'teamlead' : 10,
					'interviewing' : 5,
					'mentoring' : 5,
					'hardware' : 5
				}
			},
			'Wall Street On Demand' : {
				title : "Senior Developer",
				date : { start : "05/19/2008", end : "10/15/2010" },
				tags : {
					'xhtml' : 5,
					'css' : 5,
					'asp' : 5,
					'jscript' : 10,
					'javascript' : 15,
					'.net' : 5,
					'c#' : 5,
					'teamlead' : 10,
					'i18n' : 5,
					'interviewing' : 5,
					'xml' : 5,
					'xslt' : 5,
					'accessibility' : 5,
					'mentoring' : 5,
					'adobeair' : 5,
					'visualstudio' : 5
				}
			},
			'Yahoo' : {
				title : "Senior Engineer",
				date : { start : "10/18/2010" },
				tags : {
					'xhtml' : 4,
					'css' : 4,
					'php' : 13,
					'javascript' : 8,
					'i18n' : 10,
					'interviewing' : 4,
					'mysql' : 8,
					'reporting' : 8,
					'projectmanagement' : 8,
					'node.js' : 29,
					'technical-presentations' : 4
				}
			}
		},
		'education' : {
			'Bridgeport High School' : {
				degree : "Emphasis in Communications",
				courses : [{
					title : "Cisco Networking",
					date : [],
					tags : {}
				}]
			},
			'Marshall University' : {
				courses : [
					{
						title : "Programming Practicum with C++",
						date : { start : "01/01/2005", end : "05/01/2005"},
						tags : {
							"c++" : 85,
							"visualstudio" : 15
						}
					},
					{
						title : "Data Structures",
						date : { start : "09/01/2005", end : "12/01/2005"},
						tags : {
							"c++" : 85,
							"visualstudio" : 15
						}
					},
					{
						title : "Algorithms",
						date : { start : "09/01/2005", end : "12/01/2005"},
						tags : {
							"c++" : 75,
							"java" : 25
						}
					},
					{
						title : "Advanced C++",
						date : { start : "01/01/2006", end : "05/01/2006"},
						tags : {
							"c++" : 50,
							".net" : 25,
							"visualstudio" : 25
						}
					},
					{
						title : "Software Engineering I && II",
						date : [
							{ start : "09/01/2006", end : "12/01/2006"},
							{ start : "01/01/2007", end : "05/01/2007"}
						],
						tags : {
							'projectmanagement' : 25,
							'technical-presentations' : 75
						}
					},
					{
						title : "Hardware Technology",
						date : { start : "01/01/2005", end : "05/01/2005"},
						tags : {
							'windows' : 25,
							'linux' : 25,
							'hardware' : 50
						}
					},
					{
						title : "Web Programming",
						date : [
							{ start : "09/01/2005", end : "12/01/2005"},
							{ start : "01/01/2008", end : "05/01/2008"}
						],
						tags : {
							'php' : 30,
							'mysql' : 20,
							'xhtml' : 20,
							'javascript' : 20,
							'css' : 10
						}
					},
					{
						title : "E-Commerce",
						date : { start : "01/01/2006", end : "05/01/2006"},
						tags : {
							'php' : 10,
							'mysql' : 15,
							'projectmanagement' : 20,
							'technical-presentations' : 20,
							'xhtml' : 10,
							'javascript' : 15,
							'css' : 5,
							'asp' : 5
						}
					},
					{
						title : "Database Management",
						date : { start : "09/01/2006", end : "12/01/2006"},
						tags : {
							'mysql' : 50,
							'oracle' : 50
						}
					},
					{
						title : "Multimedia Systems",
						date : { start : "09/01/2005", end : "12/01/2005"},
						tags : {
							'flash' : 50,
							'javascript' : 30,
							'php' : 10,
							'gd' : 10
						}
					},
					{
						title : "Java",
						date : { start : "01/01/2007", end : "05/01/2007"},
						tags : {
							'java' : 100
						}
					},
					{
						title : "Operating Systems",
						date : { start : "01/01/2007", end : "05/01/2007"},
						tags : {
							'windows' : 50,
							'linux' : 50
						}
					},
					{
						title : "Scripting Languages",
						date : { start : "01/01/2007", end : "05/01/2007"},
						tags : {
							'jscript' : 34,
							'wsh' : 33,
							'vbscript' : 33
						}
					}
				]
			}
		}
	});
	$("#tag-cloud").html(cloud.render());

});