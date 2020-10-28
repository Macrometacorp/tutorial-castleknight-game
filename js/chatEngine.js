const getRandomInt = () => {
    return Math.floor(Math.random() * Math.floor(99999));
}

function generateName() {
    // Colors and Animals for randomly generated names
    var colors = ['amaranth', 'amber', 'amethyst', 'apricot', 'aquamarine', 'azure', 'beige', 'black', 'blue', 'blush', 'bronze', 'brown', 'burgundy', 'cerulean', 'champagne', 'chartreuse', 'chocolate', 'cobalt', 'coffee', 'copper', 'coral', 'crimson', 'cyan', 'desert', 'electric', 'emerald', 'erin', 'gold', 'gray', 'green', 'harlequin', 'indigo', 'ivory', 'jade', 'jungle', 'lavender', 'lemon', 'lilac', 'lime', 'magenta', 'maroon', 'mauve', 'navy', 'ocher', 'olive', 'orange', 'orchid', 'peach', 'pear', 'periwinkle', 'pink', 'plum', 'purple', 'raspberry', 'red', 'rose', 'ruby', 'salmon', 'sangria', 'sapphire', 'scarlet', 'silver', 'slate', 'tan', 'taupe', 'teal', 'turquoise', 'violet', 'viridian', 'white', 'yellow'];
    var animals = ['alligator', 'bear', 'cat', 'chinchilla', 'cow', 'coyote', 'crocodile', 'dolphin', 'duck', 'fish', 'fox', 'gecko', 'hamster', 'hippopotamus', 'jaguar', 'leopard', 'liger', 'lion', 'lynx', 'monkey', 'ocelot', 'octopus', 'panther', 'penguin', 'pig', 'rhinoceros', 'seal', 'skunk', 'sloth', 'starfish', 'stingray', 'tiger', 'tortoise', 'toucan', 'turtle', 'whale', 'wolf'];

    var color = colors[Math.floor(Math.random() * colors.length)];
    var animal = animals[Math.floor(Math.random() * animals.length)];

    return color + '-' /*+ animal*/ + getRandomInt();
}

window.initChatEngine = async function () {
    // Don't draw the Chat UI more than once
    if (document.getElementById('chatLog')) return;

    var domChatContent = `
    <div class="chat-container">
        <div class="content">
            <div class="chat-log" id="chatLog"></div>
            <div class="chat-input">
                <textarea
                  id="chatInput"
                  placeholder="message..."
                  maxlength="20000"
                ></textarea>
            </div>
        </div>
    </div>
    `;


    const chatStreamTopic = window.chatStream.topic;

    const producerOtp = await window.chatStream.getOtp();
    const consumerOtp = await window.chatStream.getOtp();

    let producerURL = `wss://${window.BASE_URL}/_ws/ws/v2/producer/persistent/${window.TENANT}/c8global.${window.DB_NAME}/${chatStreamTopic}/${window.UniqueID}?otp=${producerOtp}`;
    let consumerURL = `wss://${window.BASE_URL}/_ws/ws/v2/consumer/persistent/${window.TENANT}/c8global.${window.DB_NAME}/${chatStreamTopic}/${window.UniqueID}?otp=${consumerOtp}`;

    var consumer = new WebSocket(consumerURL);

    consumer.onopen = () => {
        console.log("chatEngine consumer is open");
    }

    consumer.onerror = () => {
        console.log('Failed to establish WS connection for chatEngine');
    }

    consumer.onclose = (event) => {
        console.log('Closing WS connection for chatEngine');
    }

    consumer.onmessage = (message) => {
        message = JSON.parse(message.data);

        if (message.payload !== 'noop' && message.properties && message.properties.text) {
            console.log("payload", message.payload);
            var uuid = message.properties.uuid;
            var text = message.properties.text;

            // add the message to the chat UI
            var domContent = `<div class="chat-message"><b>${uuid}:</b> ${text}</div>`;
            chatLog.insertAdjacentHTML('beforeend', domContent);
            scrollBottom();

            // add the message to the top of the player's head in game
            var notMe = window.globalOtherHeros.get(uuid);

            if (uuid === window.UniqueID) {
                window.globalMyHero.children[0].text = text.substring(0, 10);
            } else if (notMe) {
                notMe.children[0].text = text.substring(0, 10);
            }
        }
        else {
            //console.log("chat engine gibberish data");
        }
    }

    var producer = this.producer = new WebSocket(producerURL);
    producer.onclose = (event) => {
        console.log("chat producer closed");
    };
    producer.onopen = () => {
        console.log("chat producer opened");
    };

    setInterval(() => {
        if (producer) producer.send(JSON.stringify({ 'payload': 'noop' }));
    }, 30000);

    function sendMessage(e) {
        if (e.keyCode === 13 && !e.shiftKey) e.preventDefault();

        var focussed = chatInput.matches(':focus');

        if (focussed && e.keyCode === 13 && chatInput.value.length > 0) {
            var text = chatInput.value;

            /*ChatEngine.global.emit('message', {
                text: text,
                uuid: window.UniqueID
            });*/
            var obj = {
                'uuid': window.UniqueID,
                'text': text
            };
            var jsonString = JSON.stringify({
                'payload': 'rD',
                'properties': obj
            });

            producer.send(jsonString);

            chatInput.value = '';
        }
    }

    function scrollBottom() {
        chatLog.scrollTo(0, chatLog.scrollHeight);
    }

    // Add Chat UI to the DOM
    var gameContainer = document.getElementById('game');
    gameContainer.insertAdjacentHTML('beforeend', domChatContent);

    // Chat log element
    var chatLog = document.getElementById('chatLog');

    // Textarea of the chat UI
    var chatInput = document.getElementById('chatInput');

    // Add event listener for the textarea of the chat UI
    chatInput.addEventListener('keypress', sendMessage);
};