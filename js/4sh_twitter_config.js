$(function () {
		$('#twitter-ticker').slideDown('slow');
		
		var tweetUser = '4sh_france';
		var nb_tweets = '15';

		$.ajax({
			url:"https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name=" + tweetUser + "&count=" + nb_tweets,
			dataType:'jsonp',
			success: function (data) {
				
				var container = $("#tweet-container");
				container.html('');
				
				var i = 0;
				$.each(data, function(i, tweet){

					var html = '<div class="tweet">\
								<div class="avatar"><a href="http://twitter.com/'+ tweetUser +'" target="_blank"><img src="'+ tweet.user.profile_image_url+'"/></a></div>\
								<div class="user"><a href="http://twitter.com/'+ tweetUser +'" target="_blank">'+ tweetUser +'</a></div>\
								<div class="time">'+ relativeTime(tweet.created_at) +'</div>\
								<div class="txt">'+ formatTwitString(tweet.text) +'</div>\
								</div>';

					container.append(html);
					
				});
				
				container.jScrollPane();
			}
		});


		function formatTwitString(str)
		{
			str=' '+str;
			str = str.replace(/((ftp|https?):\/\/([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?)/gm,'<a href="$1" target="_blank">$1</a>');
			str = str.replace(/([^\w])\@([\w\-]+)/gm,'$1@<a href="http://twitter.com/$2" target="_blank">$2</a>');
			str = str.replace(/([^\w])\#([\w\-]+)/gm,'$1<a href="http://twitter.com/search?q=%23$2" target="_blank">#$2</a>');
			return str;
		}
		

		function relativeTime(pastTime)
		{	
			var origStamp = Date.parse(pastTime);
			var curDate = new Date();
			var currentStamp = curDate.getTime();
			
			var difference = parseInt((currentStamp - origStamp)/1000);

			if(difference < 0) return false;
			if(difference <= 5)				return "A l'instant";
			if(difference <= 20)			return "Il y a quelques secondes";
			if(difference <= 60)			return "Il y a 1 minute";
			if(difference < 3600)			return "Il y a " + parseInt(difference/60) + " minutes";
			if(difference <= 1.5*3600) 		return "Il y a 1 heure";
			if(difference < 23.5*3600)		return "Il y a " + Math.round(difference/3600) + " heures";
			if(difference < 1.5*24*3600)	return "Il y a 1 jour";

			var dateArr = pastTime.split(' ');
			return dateArr[2] +' '+ dateArr[1] +' '+ (dateArr[5]!=curDate.getFullYear()?' '+dateArr[5]:'')+ ' ' + dateArr[3].replace(/\:\d+$/,'');
		}
	});