const back = "../resources/back.png";
const items = ["../resources/cb.png","../resources/co.png","../resources/sb.png",
"../resources/so.png","../resources/tb.png","../resources/to.png"];


//Selecciona n parells i dificultat
var options_data = {
	cards:2, dificulty:"hard"
};

var json = localStorage.getItem("config");
	if(json)
		options_data = JSON.parse(json);




var game = new Vue({
	el: "#game_id",
	data: {
		username:'',
		current_card: [],
		items: [],
		num_cards: 2,
		bad_clicks: 0
	},
	created: function(){
		this.num_cards = options_data.cards;
		this.username = sessionStorage.getItem("username","unknown");
		this.items = items.slice(); // Copiem l'array
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		this.items = this.items.slice(0, this.num_cards); // Agafem els primers numCards elements
		this.items = this.items.concat(this.items); // Dupliquem els elements
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		for (var i = 0; i < this.items.length; i++){
			this.current_card.push({done: false, texture: this.items[i]});
		}	
		
		//Set dificultad
		tiempoMostrar = [1500,600,150]; // E/N/H
		penalizacionError = [15,30,40]  // E/N/H
		//Mostrar cartas al inicio
		mostrandoCartas = true;
		obj = this;
		function comienzaElJuego()
		{
			for(var i = 0; i < obj.items.length; i++)
				Vue.set(obj.current_card, i, {done: false, texture: back});	
				
			mostrandoCartas = false				
		}		
		switch(options_data.dificulty){
			case "easy":
				i_dif = 0;

			break;
			case "normal":
				i_dif = 1;
				break;
			case "hard":
				i_dif = 2;
			break;
		}
		setTimeout(comienzaElJuego, tiempoMostrar[i_dif]);	
		
	
	},
	methods: {
		clickCard: function(i){
			
			if (!this.current_card[i].done && this.current_card[i].texture === back)
			{
				Vue.set(this.current_card, i, {done: false, texture: this.items[i]});				
			}			
		}
		
			
	},
	watch: {
		current_card: function(value){			
			if (value.texture === back || mostrandoCartas ) return;
			var front = null;
			var i_front = -1;
			for (var i = 0; i < this.current_card.length; i++){
				if (!this.current_card[i].done && this.current_card[i].texture !== back){
					if (front){
						if (front.texture === this.current_card[i].texture){
							front.done = this.current_card[i].done = true;
							this.num_cards--;
						}
						else{
							Vue.set(this.current_card, i, {done: false, texture: back});
							Vue.set(this.current_card, i_front, {done: false, texture: back});
							this.bad_clicks++;
							break;
						}
					}
					else{
						front = this.current_card[i];
						i_front = i;
					}
				}
			}			
		}
	},
	computed: {
		score_text: function(){
			return 100 - this.bad_clicks * penalizacionError[i_dif];
		}
	}
});


		




