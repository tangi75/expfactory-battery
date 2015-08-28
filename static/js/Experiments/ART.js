/* ************************************ */
/* Define helper functions */
/* ************************************ */
function appendTextAfter(input,search_term, new_text) {
	var index = input.indexOf(search_term)+search_term.length
	return input.slice(0,index) + new_text + input.slice(index)
}

function getGame() {
	if (pond_state == "" ) {
		round_over = 0
		game_state = game_setup
		game_state = appendTextAfter(game_state, 'Trip Bank: </strong>$', trip_bank)
		game_state = appendTextAfter(game_state, 'Tournament Bank: </strong>$', tournament_bank)
		game_state = appendTextAfter(game_state, 'Red Fish Caught: </strong>', 0)
		game_state = appendTextAfter(game_state, "Catch N' ", release)
		game_state = appendTextAfter(game_state, "weathertext>", weather)
		$(document.body).html(game_state)
		makeFish()
	} else {
		// Update game state with cached values
		game_state = game_setup
		game_state = appendTextAfter(game_state, 'pond>', pond_state)
		if (weather == "Sunny") {
			game_state = appendTextAfter(game_state, '# Red Fish in Pond: </strong>', red_fish_num)
			game_state = appendTextAfter(game_state, '# Blue Fish in Pond: </strong>', total_fish_num-red_fish_num)
		}
		game_state = appendTextAfter(game_state, 'Trip Bank: </strong>$', trip_bank)
		game_state = appendTextAfter(game_state, 'Tournament Bank: </strong>$', tournament_bank)
		game_state = appendTextAfter(game_state, "Catch N' ", release)
		game_state = appendTextAfter(game_state, "weathertext>", weather)
		game_state = appendTextAfter(game_state, 'Red Fish Caught: </strong>', Math.round(trip_bank/pay*100)/100)
		$(document.body).html(game_state)
	}
}

function get_data() {
	/* This records the data AFTER the choice has been made and so the values have all been updated. We are interested
		in the state of the world before the choice has been made. What value is the trip_bank at when the choice was made?
		To get this we need to subtract the changes due to this choice.
	*/
	if (last_pay == .05) {
		FB = 1
	} else {
		FB = 0
	}
	return {exp_id: "ART",
			red_fish_num: red_fish_num + 1,
			trip_bank: trip_bank - last_pay,
			FB: FB,
			tournament_bank: tournament_bank,
			weather: weather,
			release: release}
}

function makeFish() {
    $(".redfish").remove();
    $(".bluefish").remove();
	$(".greyfish").remove();
	red_fish_num = 0
	total_fish_num = 0
	filled_areas = [];
    for (i=0;i<start_fish_num-1;i++) {
        if (max_x == 0) {
			min_x = $('.pond').width()*.05;
			min_y = $('.pond').height()*.05;
            max_x = $('.pond').width()*.9;
            max_y = $('.pond').height()*.9;   
        }
		red_fish_num+=1
		if (weather == "Sunny") {
			$('.pond').append('<div class = redfish id = red_fish' + red_fish_num +'></div>')  
		} else {
			$('.pond').append('<div class = greyfish id = red_fish' + red_fish_num +'></div>')  
		}
    }
	if (weather == "Sunny") {
		$('.pond').append('<div class = bluefish id = blue_fish></div>')  
	} else {
		$('.pond').append('<div class = greyfish id = blue_fish></div>')  
	}
	place_fish()
	if (weather == "Sunny") {
		$('#red_count').html('<strong># Red Fish in Pond:</strong>: ' + red_fish_num)
		$('#blue_count').html('<strong># Red Fish in Pond:</strong>: 1')
	}
	total_fish_num = red_fish_num + 1
}

function goFish() {
	if (total_fish_num > 0) {
		if (Math.random() < 1/(total_fish_num)) {
			$('#blue_fish').remove();
			trip_bank = 0
			$(".pond").html('')
			red_fish_num = 0
			total_fish_num = 0
			last_pay = 0
			round_over = 1
		 } else {
			if (release == "Keep") {
				$('#red_fish' + red_fish_num).remove()
				red_fish_num-=1
				total_fish_num-=1
			} 
			trip_bank += pay
			trip_bank = Math.round(trip_bank * 100) / 100
			last_pay = pay
			
		 }

		pond_state = $('.pond').html()
		var e = jQuery.Event("keydown");
		e.which = 32; // # Some key code value
		e.keyCode = 32
		$(document).trigger(e);
		var e = jQuery.Event("keyup");
		e.which = 32; // # Some key code value
		e.keyCode = 32
		$(document).trigger(e)
	}	
}

function collect() {
 	tournament_bank += trip_bank
	tournment_bank = Math.round(tournament_bank * 100) / 100
    trip_bank = 0
    $(".redfish").remove();
    $(".bluefish").remove();
    $('#tournament_bank').html('<strong>Tournament Bank:</strong> $' + tournament_bank)
    $('#trip_bank').html('<strong>Trip Bank:</strong> $' + trip_bank)
	red_fish_num = 0
	total_fish_num = 0
	pond_state = $('.pond').html()
	cooler_state = $('.pond').html()
	round_over = 1
	
	var e = jQuery.Event("keydown");
	e.which = 40; // # Some key code value
	e.keyCode = 40
	$(document).trigger(e);
	var e = jQuery.Event("keyup");
	e.which = 40; // # Some key code value
	e.keyCode = 40
	$(document).trigger(e)
}



function calc_overlap(a1) {
    var overlap = 0;
    for (var i = 0; i < filled_areas.length; i++) {
		a2 = filled_areas[i]
        // no intersection cases
        if (a1.x + a1.width < a2.x) {
            continue;
        }
        if (a2.x + a2.width < a1.x) {
            continue;
        }
        if (a1.y + a1.height < a2.y) {
            continue;
        }
        if (a2.y + a2.height < a1.y) {
            continue;
        }

        // intersection exists : calculate it !
        var x1 = Math.max(a1.x, a2.x);
        var y1 = Math.max(a1.y, a2.y);
        var x2 = Math.min(a1.x + a1.width, a2.x + a2.width);
        var y2 = Math.min(a1.y + a1.height, a2.y + a2.height);

        var intersection = ((x1 - x2) * (y1 - y2));

        overlap += intersection;

    }
    return overlap;
}

function place_fish() {
    var index = 0;
	fish_types = ['redfish','bluefish','greyfish']
	for (f = 0; f<fish_types.length; f++) {
		fish = fish_types[f]
		$('.' + fish).each(function(index) {
			var rand_x = 0;
			var rand_y = 0;
			var i = 0;
			var smallest_overlap = '';
			var best_choice;
			var area;
			for (var i = 0; i < maxSearchIterations; i++) {
				rand_x = Math.round(min_x + ((max_x - min_x) * (Math.random() % 1)));
				rand_y = Math.round(min_y + ((max_y - min_y) * (Math.random() % 1)));
				area = {
					x: rand_x,
					y: rand_y,
					width: $(this).width(),
					height: $(this).height()
				};
				var overlap = calc_overlap(area);
				if (smallest_overlap == '') {
					smallest_overlap = overlap
					best_choice = area
				} else if (overlap < smallest_overlap) {
					smallest_overlap = overlap;
					best_choice = area;
				}
				if (overlap === 0) {
					break;
				}
			}

			filled_areas.push(best_choice)
			$(this).css({
				position: "absolute",
				"z-index": index++
			});
			
			$(this).animate({
				left: rand_x,
				top: rand_y
			}, 'slow');
			
			$(this).css({left:rand_x, top: rand_y});

		});
	}
}


/* ************************************ */
/* Define experimental variables */
/* ************************************ */
//Task variables
var num_rounds = 30
var red_fish_num = 0
var total_fish_num = 0
var start_fish_num = 0
var trip_bank = 0
var tournament_bank = 0
//each block defines the weather and release law
var blocks = [{weather: "Sunny", release: "Release"}, {weather: "Sunny", release: "Keep"}, {weather: "Cloudy", release: "Release"}, {weather: "Cloudy", release: "Keep"}]
var blocks = jsPsych.randomization.shuffle(blocks)
var pay = .05 //payment for one red fish
var last_pay = 0 //variable to hold the last amount of money received
var pond_state = '' //variable for redrawing the board from trial to trial
var round_over = 0  //equals 1 if a blue fish is caught or the participant 'collects'

//Variables for placing fish
var maxSearchIterations = 100;
var min_x = 0
var max_x = 0
var min_y = 0
var max_y = 0
var filled_areas = [];

var game_setup = "<div class = titlebox><div class = center-text>Catch N' </div></div>" +
"<div class = pond></div>" +
"<div class = cooler><p class = info-text><strong>Red Fish Caught: </strong></p></div>" +
"<div class = weatherbox><div class = center-text id = weathertext></div></div>" +
"<div class = infocontainer>" +
    "<div class = subinfocontainer>" +
        "<div class = infobox><p class = info-text id = red_count><strong># Red Fish in Pond: </strong></p></div>" +
        "<div class = infobox><p class = info-text id = blue_count><strong># Blue Fish in Pond: </strong></p></div>" +
    "</div>" +
    "<div class = subimgcontainer>" +
		"<div class = imgbox></div>" +
	"</div>" +
    "<div class = subinfocontainer>" +
        "<div class = infobox><p class = info-text id = trip_bank><strong>Trip Bank: </strong>$</p></div> " +
        "<div class = infobox><p class = info-text id = tournament_bank><strong>Tournament Bank: </strong>$</p></div>" +
"</div>" +
    "</div>" +
"<div class = buttonbox><button type='button' class = select-button onclick = goFish()>Go Fish</button><button type='button' class = select-button onclick = collect()>Collect</button></div>" +
"<button type = 'button' id = 'makeFish' onclick = makeFish()>Make Fish</button>"

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */

var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the ART experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var instructions_block = {
  type: 'instructions',
  pages: [
    '<div class = centerbox><p class = block-text>In this task, your job is to generate a random sequence of digits. You will do this by clicking on a virtual numpad using your mouse. Once you click, the number will temporarily turn red. You have less than a second to respond on each trial so it is important to respond quickly!</p><p class = block-text>.After the trial ends the numbers will dissapear for a moment. When they appear again the next trial has begun and you should respond as quickly as possible.</p><p class = block-text>Your goal is to choose each number completely randomly, as if you were picking a number from a hat with 9 slips of paper, reading it, and placing it back before picking another number.</p><p class = block-text>Press <strong>enter</strong> to continue.</p></div>',
  ],
  key_forward: 13,
  allow_backwards: false
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var start_practice_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Starting a practice block.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Starting a test block.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var  wait_block = {
  type: 'single-stim',
  stimuli: [game_setup],
  choices: 'none',
  is_html: true,
  data: {exp_id: "RNG", condition: "practice"},
  timing_stim: 200,
  timing_response: 200,
  response_ends_trial: false,
  timing_post_trial: 0
};


var game_block = {
  type: 'single-stim',
  stimuli: getGame,
  choices: [32,40],
  is_html: true,
  data: get_data,
  timing_post_trial: 0
};

var game_chunk = {
    chunk_type: 'while',
    timeline: [game_block],
    continue_function: function(data){
        if (round_over == 1) {
			return false
		} else {
			return true
		}
    }
}


ART_experiment = []
for (b = 0; b<blocks.length; b++) {
	block = blocks[b]
	weather = block.weather
	release = block.release
	if (weather == "Sunny") {
		start_fish_num = 128
	} else {
		start_fish_num = 65
	}
	for (i=0; i <num_rounds; i++) {
		ART_experiment.push(game_chunk)
	}
}

ART_experiment.push(welcome_block)
ART_experiment.push(instructions_block)
