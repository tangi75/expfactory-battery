/* ************************************ */
/* Define helper functions */
/* ************************************ */
var post_trial_gap = function() {
  return Math.floor( Math.random() * 500 ) + 500;
}

var randomDraw = function(lst) {
    var index = Math.floor(Math.random()*(lst.length))
    return lst[index]
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var categories = ['animals', 'colors', 'countries', 'distances', 'metals', 'relatives']
var exemplars = {
	'animals': ['fish', 'bird', 'snake', 'cow', 'whale'],
	'colors': ['red', 'yellow','green','blue', 'brown'],
	'countries': ['China', 'US', 'England', 'India', 'Brazil'],
	'distances': ['mile', 'kilometer', 'meter', 'foot', 'inch'],
	'metals': ['iron', 'copper', 'aluminum', 'gold', 'silver'],
	'relatives': ['mother', 'father', 'brother', 'sister', 'aunt']
}

var difficulty_order = jsPsych.randomization.repeat([3,4,5],1,false)
var num_blocks = 3
var trial_length = 15
var blocks = []
var targets = []

/* Draw 2 or 3 exemplars from each of six categories totalling 15 exemplars for each block.
 Present 3 such blocks for each difficulty level, where each difficulty level has a different number
 of target categories (randomly drawn)
*/
for (var i = 0; i<difficulty_order.length; i++) {
	for (var b = 0; b<num_blocks; b++) {
		var target_categories = jsPsych.randomization.repeat(categories,1,false).slice(0,difficulty_order[i]) //select the target categories
		var block_exemplars = []
		var cat_repeats = jsPsych.randomization.repeat([2,2,2,3,3,3],1,false) //determines how many exemplars from each category to select for this block
		for (var cat = 0; cat<categories.length; cat++) {
			var exemplars_to_add = jsPsych.randomization.repeat(exemplars[categories[cat]],1,false).slice(0,cat_repeats[cat])
			var items = []
			exemplars_to_add.forEach(function(entry){
				items.push([categories[cat]].concat(entry))
			})
			block_exemplars = block_exemplars.concat(items)
		}
		blocks.push(jsPsych.randomization.repeat(block_exemplars,1,false))
		targets.push(target_categories)
	}
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */

var welcome_block = {
	
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the letter memory experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var category_instructions = '<ul class = list-text>' +
	'<li><strong>animals</strong>: fish, bird, snake, cow, whale</li>' +
	'<li><strong>colors</strong>: red, yellow, green, blue, brown</li>' +
	'<li><strong>countries</strong>: China, US, England, India, Brazil</li>' +
	'<li><strong>distances</strong>: mile, kilometer, meter, foot, inch</li>' +
	'<li><strong>metals</strong>: iron, copper, aluminum, gold, silver</li>' +
	'<li><strong>relatives</strong>: mother, father, brother, sister, aunt</li>'

	
var instructions_block = {
  type: 'instructions',
  pages: [
    '<div class = centerbox><p class = block-text>In this experiment you will see a sequence of words presented on at time. These words will fall into one of six cateogries: animals, colors, countries, distances, metals and relatives.</p><p class = block-text>3 to 5 of these cateogries will be "target" categories presented at the bottom of the screen. Your job is to remember the <strong>last</strong> word shown from each of the target categories and report them at the end of the trial.<p class = block-text>Press <strong>enter</strong> to continue.</p></div>',
	'<div class = centerbox><p class = block-text>The words in each category are presented below: ' + category_instructions + '</p><p class = block-text>Press <strong>enter</strong> to continue.</p></div>'
  ],
  key_forward: 13
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
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




//Set up experiment
var keep_track_experiment = []
keep_track_experiment.push(welcome_block);
keep_track_experiment.push(instructions_block);

// set up blocks
for (b=0; b<blocks.length; b++) {
	keep_track_experiment.push(start_test_block)
	block = blocks[b]
	target = targets[b]
	prompt = '<div class = promptbox><div class = prompt-text>Targets: ' + target.join(', ') +'</div></div>'
	data = {exp_id: 'keep_track', trial_id: 'prompt', condition: 'target_length_' + target.length, targets: target}
	var prompt_block = {
		type: 'single-stim',
		stimuli: '<div class = centerbox><p class = block-text>Below are the target categories. They will remain on the bottom of the screen during the trial. Press enter when you are sure you can remember them. </p></div>',
		is_html: true,
		choices: [13],
		data: data,
		prompt: prompt,
		timing_post_trial: 0,
	}
	var wait_block = {
		type: 'single-stim',
		stimuli: ' '
		is_html: true,
		choices: 'none',
		prompt: prompt,
		timing_stim: 500,
		timing_response: 500,
		timing_post_trial: 0,
	}
	keep_track_experiment.push(prompt_block)
	keep_track_experiment.push(wait_block)
	for (i = 0; i < block.length; i++ ) {
		stim = '<div class = centerbox><div class = keep-track-text>' + block[i][1] + '</div></div>'
		data = {exp_id: 'keep_track', trial_id: block[i][0], condition: 'target_length_' + target.length, targets: target}
		var track_block = {
			type: 'single-stim',
			stimuli: stim,
			is_html: true,
			choices: 'none',
			data: data,
			timing_response: 1500, 
			timing_stim: 1500,
			prompt: prompt,
			timing_post_trial: 0,
		}
		keep_track_experiment.push(track_block)
	}
	var response_block = {
		type: 'survey-text',
		questions: [['What was the last word in each of the target categories? Please separate your words with a space']],
		data: {exp_id: 'keep_track', trial_id: 'response', condition: 'target_length_' + target.length, targets: target}
	}
	keep_track_experiment.push(response_block)
}



keep_track_experiment.push(end_block)


