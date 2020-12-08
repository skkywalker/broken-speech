$(document).ready(function() {

	//conecta ao server
	var socket = io.connect('http://127.0.0.1:5000');

	//envia uma mensagem ao servidor
	socket.on('connect', function() {
		socket.send('User has connected!');
	});

	//adiciona o conteúdo à lista de mensagens
	socket.on('message', function(msg) {
		$(".events").append('<li>'+msg+'</li>');
	});

	//quando o botão é clicado, envia a mensagem
	$('.send').on('click', function() {
		socket.send($('.chat').val());
		$('.chat').val('');
	});

});