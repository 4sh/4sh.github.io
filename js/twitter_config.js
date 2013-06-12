var tweetUsers = ['agraphik'];
var buildString = "";

$(document).ready(function(){

	$('#twitter-ticker').slideDown('slow');
	
	for(var i=0;i<tweetUsers.length;i++)
	{
		if(i!=0) buildString+='+OR+';
		buildString+='from:'+tweetUsers[i];
	}
	
	var fileref = document.createElement('script');
	
	fileref.setAttribute("type","text/javascript");
	fileref.setAttribute("src", "http://search.twitter.com/search.json?q="+buildString+"&callback=TweetTick&rpp=50");
	
	document.getElementsByTagName("head")[0].appendChild(fileref);
	
});

function TweetTick(ob)
{
	var container=$('#tweet-container');
	container.html('');
	
	$(ob.results).each(function(el){
	
		var str = '	<div class="tweet">\
					<div class="avatar"><a href="http://twitter.com/'+this.from_user+'" target="_blank"><img src="'+this.profile_image_url+'" alt="'+this.from_user+'" /></a></div>\
					<div class="user"><a href="http://twitter.com/'+this.from_user+'" target="_blank">'+this.from_user+'</a></div>\
					<div class="time">'+relativeTime(this.created_at)+'</div>\
					<div class="txt">'+formatTwitString(this.text)+'</div>\
					</div>';
		
		container.append(str);
	
	});
	
	container.jScrollPane();
}

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
	return dateArr[4].replace(/\:\d+$/,'')+' '+dateArr[2]+' '+dateArr[1]+(dateArr[3]!=curDate.getFullYear()?' '+dateArr[3]:'');
}