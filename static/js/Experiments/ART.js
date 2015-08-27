/* ************************************ */
/* Define helper functions */
/* ************************************ */

function makeFish() {
    $(".redfish").remove();
    $(".bluefish").remove();
    filled_areas = []
    for (i=0;i<start_fish_num;i++) {
        if (max_x == 0) {
            max_x = $('.pond').width()*.8;
            max_y = $('.pond').height()*.8;   
        }
        $('.pond').append('<div class = redfish id = red_fish' + red_fish_num +'></div>')  
        place_fish('red_fish' + red_fish_num)
        red_fish_num+=1
    }
    $('.pond').append('<div class = bluefish id = blue_fish></div>')  
    place_fish('blue_fish')
    $('#red_count').html('<strong># Red Fish in Pond:</strong>: ' + red_fish_num)
    $('#blue_count').html('<strong># Red Fish in Pond:</strong>: 1')
	total_fish_num = red_fish_num + 1
}

function goFish() {
	if (total_fish_num > 0) {
		if (Math.random() < 1/(total_fish_num)) {
			$('#blue_fish').remove();
			trip_bank = 0
			$('#trip_bank').html('<strong>Trip Bank:</strong> $' + trip_bank)
			$('.cooler').append('<div class = bluefish>fish</div>')
			$(".pond").html('')
			red_fish_num = 0
			total_fish_num = 0
		 } else {
			$('#red_fish'+red_fish_num).remove();
			red_fish_num-=1
			total_fish_num-=1
			trip_bank += .05
			trip_bank = Math.round(trip_bank * 100) / 100
			$('#trip_bank').html('<strong>Trip Bank:</strong> $' + trip_bank)
			$('.cooler').append('<div class = redfish>fish</div>')
		 }
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
}



function calc_overlap(a1) {
    var overlap = 0;
    for (i = 0; i < filled_areas.length; i++) {

        var a2 = filled_areas[i];

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

        // console.log("( "+x1+" - "+x2+" ) * ( "+y1+" - "+y2+" ) = " + intersection);
    }

    // console.log("overlap = " + overlap + " on " + filled_areas.length + " filled areas ");
    return overlap;
}

function place_fish(fish) {


    var index = 0;
    $('#' + fish).each(function() {
        var rand_x = 0;
        var rand_y = 0;
        var i = 0;
        var smallest_overlap = 9007199254740992;
        var best_choice;
        var area;
        for (i = 0; i < maxSearchIterations; i++) {
            rand_x = Math.round(min_x + ((max_x - min_x) * (Math.random() % 1)));
            rand_y = Math.round(min_y + ((max_y - min_y) * (Math.random() % 1)));
            area = {
                x: rand_x,
                y: rand_y,
                width: $(this).width(),
                height: $(this).height()
            };
            var overlap = calc_overlap(area);
            if (overlap < smallest_overlap) {
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
        /*
        $(this).animate({
            left: rand_x,
            top: rand_y
        });
        */
        $(this).css({left:rand_x, top: rand_y});

        // console.log("and the winner is : " + smallest_overlap);
    });
    return false;
}


/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var red_fish_num = 0
var total_fish_num = 0
var start_fish_num = 120
var trip_bank = 0
var tournament_bank = 0
var maxSearchIterations = 100;
var min_x = 0
var max_x = 0
var min_y = 0
var max_y = 0
var filled_areas = [];

var game_setup = "<div class = titlebox><div class = title-text>Catch N' Release</div></div>" +
"<div class = pond></div><div class = cooler></div>" +
"<div class = infocontainer>" +
    "<div class = subinfocontainer>" +
        "<div class = infobox><p class = info-text id = red_count><strong># Red Fish in Pond:</strong></p></div>" +
        "<div class = infobox><p class = info-text id = blue_count><strong># Blue Fish in Pond:</strong></p></div>" +
    "</div>" +
    "<div class = subimgcontainer>" +
		"<div class = imgbox></div>" +
	"</div>" +
    "<div class = subinfocontainer>" +
        "<div class = infobox><p class = info-text id = trip_bank><strong>Trip Bank</strong></p></div> " +
        "<div class = infobox><p class = info-text id = tournament_bank><strong>Tournament Bank</strong></p></div>" +
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
  stimuli: [game_setup],
  choices: 'none',
  is_html: true,
  data: {exp_id: "RNG", condition: "practice"},
  timing_post_trial: 0
};

ART_experiment = []
ART_experiment.push(game_block)
ART_experiment.push(welcome_block)
ART_experiment.push(instructions_block)
