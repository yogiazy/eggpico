const temp = document.getElementById("temp");
const hum = document.getElementById("hum");

client = new Paho.MQTT.Client("broker.hivemq.com", Number(8000), "clientId-eggpico-app-2");
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
client.connect({ onSuccess: onConnect });

function onConnect() {
    console.log("onConnect");
    client.subscribe("eggpico/app-2");
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);
    let data = JSON.parse(message.payloadString);
    temp.textContent = data.temp;
    hum.textContent = data.hum;
    if (data.temp >= 30 && control) {
        toggleSwitch.checked = false;
        lamp_off();
    } else if (data.temp < 30 && control) {
        toggleSwitch.checked = true;
        lamp_on();
    }
    console.log(data);
}

const toggleSwitch = document.getElementById('toggleSwitch');
const toggleText = document.getElementById('toggleText');
const lampON = document.getElementById('lamp_on');
const lampOFF = document.getElementById('lamp_off');

function lamp_on() {
    toggleText.textContent = 'ON';
    lampOFF.style.display = 'none';
    lampON.style.display = 'inline-block';
    message = new Paho.MQTT.Message("1");
    message.destinationName = "eggpico/raspico-2";
    client.send(message);
}

function lamp_off() {
    toggleText.textContent = 'OFF';
    lampON.style.display = 'none';
    lampOFF.style.display = 'inline-block';
    message = new Paho.MQTT.Message("0");
    message.destinationName = "eggpico/raspico-2";
    client.send(message);
}

toggleSwitch.addEventListener('change', function () {
    if (this.checked) {
        lamp_on();
    } else {
        lamp_off();
    }
});

const toggleAuto = document.getElementById('toggleAuto');
const autoText = document.getElementById('autoText');
const manualText = document.getElementById('manualText');
let control = true;

toggleAuto.addEventListener('change', function () {
    if (this.checked) {
        control = true;
        autoText.style.color = '#0bc2b9';
        manualText.style.color = '#666';
        toggleSwitch.disabled = true;
    } else {
        control = false;
        manualText.style.color = '#0bc2b9';
        autoText.style.color = '#666';
        toggleSwitch.disabled = false;
    }
});