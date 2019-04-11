var socket = io();




function scrollToBottom ()
{
	var message = jQuery('#messages');
	var newMessage = message.children('li:last-child');
	var scrollHeight = message.prop('scrollHeight');
	var scrollTop = message.prop('scrollTop');
	var clientHeight = message.prop('clientHeight');
	var newMessageHeight = newMessage.innerHeight();
	var oldMessageHeight = newMessage.prev().innerHeight();

	if(clientHeight + scrollTop + newMessageHeight + oldMessageHeight >= scrollHeight)
	{
		message.scrollTop(scrollHeight);
	}
}


socket.on('connect',()=>
{
	console.log('connected to server');
});

socket.on('newMessage',(message)=>
{
	var time = moment(message.createdAT).format('hh:mm a');
	template = jQuery('#message-template').html();
	html = Mustache.render(template,{
		text : message.text,
		from : message.from,
		createdAT : time
	});
	jQuery('#messages').append(html);
	scrollToBottom();
});
socket.on('newLocationMessage',(message)=>
{
	var time = moment(message.createdAT).format('hh:mm a');
	template = jQuery('#location-message-template').html();
	html = Mustache.render(template,{
		text : message.text,
		from : message.from,
		createdAT : time
	});
	jQuery('#messages').append(html);
	scrollToBottom();
});

jQuery('#message-form').on('submit', function (e)
{

	var messageTextbox = jQuery('[name=message]');

	e.preventDefault();
	socket.emit('createMessage',{
		from : 'User',
		text : messageTextbox.val()
	}, function ()
{
	messageTextbox.val('')
	console.log("i am here");
});
});

jQuery('#sendLocation').on('click',function()
{
	if(!navigator.geolocation)
	{
		alert("Your Browser is not worth it ");
	}

	jQuery('#sendLocation').attr('disabled','disabled') // to disable the send location button while proceesing .

	navigator.geolocation.getCurrentPosition(function (location)
{
	jQuery('#sendLocation').removeAttr('disabled') // to enable it again
	console.log(location);
	socket.emit('createLocationMessage',{
		from : 'User',
		latitude : location.coords.latitude,
		longitude :location.coords.longitude
	})
},function()
{
	jQuery('#sendLocation').removeAttr('disabled')
	alert("unable to fetch the location");
})
})



socket.on('disconnect',()=>
{
	console.log('server closed');
});
