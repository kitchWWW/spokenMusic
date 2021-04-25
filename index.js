var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition

var CLIENT_TOKEN = "VVP7VGEAD7IVHIUWELYYP6DVCLDYGJ5B"
var MODIFY_LINE = "modify_line"
var ADD_LINE = "add_line"
var REMOVE_LINE = "remove_line"

var MORE_DIR = "more"
var LESS_DIR = "less"

function log(str){
	content_log = document.getElementById("content_log");
	console.log(str)
	content_log.innerHTML+="<br/> > "+ str
	content_log.scrollTop = content_log.scrollHeight;
}

var recognition = new SpeechRecognition();
recognition.onresult = function(event) {
  var transcript = event.results[0][0].transcript;
  log("transcript: " + transcript)
  sendCommandToWit(transcript)
}
recognition.onspeechend = function() {
  log("stopped!")
  recognition.stop();
}

recognition.onerror = function(event) {
	console.log(event.error)
}

function startListening(){
	log("recognition was started")
	recognition.start();
}

function sendCommandToWit(q){
	const uri = 'https://api.wit.ai/message?v=20200513&q=' + q;
	const auth = 'Bearer ' + CLIENT_TOKEN;
	fetch(uri, {headers: {Authorization: auth}})
	  .then(res => res.json())
	  .then(function(res){
	  	log(q)
	  	log(res)
	  	processCommand(res)
	  })
}

var sounds = {
	melodica: "melodicaChords.mp3",
	noise: "noise.mp3",
	bells: "bells.mp3",
	rain: "rain.mp3",
	water: "sea.mp3",
	bowls: "bowls.mp3",
	crickets: "crickets.mp3",
	whispers: "whispers.mp3",
	piano: "piano.mp3",
}

var soundFiles = {}

for(const name in sounds){
	var soundFile = new Pizzicato.Sound('/res/'+sounds[name], function() {});
	soundFiles[name] = soundFile
	soundFile.volume = .5
	soundFile.loop = true
	soundFile.attack = 2
	soundFile.release = 4

}

function processCommand(res){
	if(res.intents.length > 0){
		if(res.intents[0].name == MODIFY_LINE){
			log("Intent is MODIFY_LINE")
			if(res.entities["sonic_entity:sonic_entity"]){
				sonic_entity = res.entities["sonic_entity:sonic_entity"][0].value.toLowerCase()
				log("Sonic Entity is: "+ sonic_entity)
				soundFiles[sonic_entity].play()
			}
			if(res.entities["direction:direction"]){
				direction = res.entities["direction:direction"][0].value.toLowerCase()
				log("Direction is: "+ direction)
				if(direction == MORE_DIR){
					soundFiles[sonic_entity].volume += .2
				}else{
					soundFiles[sonic_entity].volume -= .2	
				}
			}
		}else if(res.intents[0].name == ADD_LINE){			
			log("Intent is ADD_LINE")
			if(res.entities["sonic_entity:sonic_entity"]){
				sonic_entity = res.entities["sonic_entity:sonic_entity"][0].value.toLowerCase()
				log("Sonic Entity is: "+ sonic_entity)
				soundFiles[sonic_entity].play()
			}
		}else if(res.intents[0].name == REMOVE_LINE){			
			log("Intent is REMOVE_LINE")
			if(res.entities["sonic_entity:sonic_entity"]){
				sonic_entity = res.entities["sonic_entity:sonic_entity"][0].value
				log("Sonic Entity is: "+ sonic_entity)
				soundFiles[sonic_entity].pause()
			}
		}
	}
}

log("alright, things are working...")
























