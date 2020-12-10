$(document).ready(function() {
	
    var user = document.getElementsByClassName("chat")[0].value;
    //conecta ao server
    var socket = io.connect('http://127.0.0.1:5000');

    //envia uma mensagem ao servidor
    socket.on('connect', function() {
        socket.send(user + " connected");
    });

    //adiciona o conteúdo à lista de mensagens
    socket.on('message', function(msg) {
		$(".events").append('<li>'+msg+'</li>');
	});

    //quando o botão é clicado, envia a mensagem
    $('.send').on('click', function() {
        socket.send(user+': '+$('.chat').val());
        $('.chat').val('');
	});
	
	user = "";
});