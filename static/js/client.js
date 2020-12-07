const log = (message) => {
    const parent = document.querySelector('#events');
    const el = document.createElement('li');
    el.innerHTML = message;

    parent.appendChild(el);
    parent.scrollTop = parent.scrollHeight;
}

const onChatSubmitted = (e) => {
    e.preventDefault();

    const input = document.querySelector('#chat');
    const message = input.value;
    input.value = '';
    
    log(message);
};

(() => {
    log('welcome');

    document
        .querySelector('#chat-form')
        .addEventListener('submit', onChatSubmitted);

})();