/*
reference: http://www.sciencedirect.com/science/article/pii/S1053811905001424
*/

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

var letters = 'bBdDgGtTvV'
var num_blocks = 2 //of each delay
var num_trials = 50
var delays = jsPsych.randomization.shuffle([1, 2, 3])
control_random = jsPsych.randomization.repeat(letters,5,false)
var control_stims = []
for (var i = 0; i < control_random.length; i++) {
	control_stims.push('<div class = centerbox><div class = center-text>' + control_random[i] + '</div></div>')
}
var control_before = Math.round(Math.random()) //0 control comes before test, 1, after

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */

var welcome_block = {
	
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the n-back task experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var instructions_block = {
  type: 'instructions',
  pages: [
    '<div class = centerbox><p class = block-text>In this experiment you will see a sequence of letters presented one at a time. Your job is to respond by pressing the spacebar when the letter matches the same letter that occured either 1, 2 or 3 trials before. The letters will be both lower and upper case. You should ignore the case (so "t" matches "T")</p><p class = block-text>The specific delay you should pay attention to will differ between blocks of trials, and you will be told the delay before starting a trial block.</p><p class = block-text>For instance, if the delay is 2, you are supposed to respond when the current letter matches the letter that occured 2 trials ago. If you saw the sequence: g...G...v...T...b...t, you would respond only on the last "t".</p><p class = block-text>Press <strong>enter</strong> to continue.</p></div>',
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

var start_control_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>In this block you do not have to match letters to previous letters. Instead, press the spacebar everytime you see a "t" or "T".</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

//Define control (0-back) block
var control_block = {
  type: 'single-stim',
  is_html: true,
  stimuli: control_stims,
  data: {exp_id: "n-back", condition: "n: 0", target: 't'},
  choices: 'none',
  timing_stim: 500,
  timing_response: 500,
  response_ends_trial: false,
  timing_post_trial: 2000
};

//Set up experiment
var n_back_experiment = []
n_back_experiment.push(welcome_block);
n_back_experiment.push(instructions_block);

if (control_before == 0) {
	n_back_experiment.push(start_control_block)
	n_back_experiment.push(control_block)
}
for (var d = 0; d<delays.length; d++) {
	var delay = delays[d]
	var start_delay_block = {
	  type: 'text',
	  text: '<div class = centerbox><p class = block-text>In these next blocks, you should respond when the current letter matches the letter that appeared ' + delay + ' trials before.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
	  cont_key: 13
	};
	n_back_experiment.push(start_delay_block)
	for (var b = 0; b < num_blocks; b++) {
		n_back_experiment.push(start_test_block)
		var target = ''
		var stims = []
		for (var i=0; i<num_trials; i++) {
			stim = randomDraw(letters)
			stims.push[stim]
			var test_block = {
			  type: 'single-stim',
			  is_html: true,
			  stimuli: '<div class = centerbox><div class = center-text>' + stim + '</div></div>',
			  data: {exp_id: "n-back", condition: "n: " + delay, target: target},
			  choices: 'none',
			  timing_stim: 500,
			  timing_response: 500,
			  response_ends_trial: false,
			  timing_post_trial: 2000
			};
			target = stims[i-delay+1]
			n_back_experiment.push(test_block)
		}
	}
}
if (control_before == 1) {
	n_back_experiment.push(start_control_block)
	n_back_experiment.push(control_block)
}
//Set up control

n_back_experiment.push(end_block)


