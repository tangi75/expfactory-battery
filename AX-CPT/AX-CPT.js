
/* Main reference: http://www.pnas.org/content/suppl/2009/04/20/0808187106.DCSupplemental/0808187106SI.pdf#nameddest=STXT */

/* define welcome message block */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the AX experiment. Press any key to begin.</p></div>'
};

var correct_responses = jsPsych.randomization.repeat([["left arrow",37],["right arrow",39]],1)

/* define instructions block */
var instructions_block = {
  type: 'instructions',
  pages: [
	'<div class = centerbox><p class = block-text>Instructions 1. Press <strong>enter</strong> to continue.</p></div>',
	'<div class = centerbox><p class = block-text>Instructions 2. Press <strong>enter</strong> to continue.</p></div>'
	],
  key_forward: 13
};

var rest_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Take a break! Press any key to continue.</p></div>'
};

/* define test block */
var chars = 'BCDEFGHIJLMNOPQRSTUVWZ'
var getChar = function() {
 return '<div class = centerbox><p class = AX_text>' + chars[Math.round(Math.random()*21)] + '</p></div>'
}
var post_trial_gap = function() {
  return Math.floor( Math.random() * 500 ) + 500;
}

var wait_block = {
  type: 'single-stim',
  stimuli: '<div class = centerbox><p class = AX_feedback>Trial over, get ready for the next one.</p></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: "AX-CPT", "trial_id": "feedback"},
  timing_post_trial: 0,
  timing_stim: 1000,
  timing_response: 1000
}

var A_cue = {
  type: 'single-stim',
  stimuli: '<div class = centerbox><p class = AX_text>A</p></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: "AX-CPT", "trial_id": "cue"},
  timing_stim: 300,
  timing_response: 300,
  timing_post_trial: 4900
};

var other_cue = {
  type: 'single-stim',
  stimuli: getChar,
  is_html: true,
  choices: 'none',
  data: {exp_id: "AX-CPT", "trial_id": "cue"},
  timing_stim: 300,
  timing_response: 300,
  timing_post_trial: 4900
};

var X_target = {
  type: 'single-stim',
  stimuli: '<div class = centerbox><p class = AX_text>X</p></div>',
  is_html: true,
  choices: [37,39],
  data: {exp_id: "AX-CPT", "trial_id": "target"},
  timing_stim: 300,
  timing_response: 1300,
  timing_post_trial: 0
};

var other_target = {
  type: 'single-stim',
  stimuli: getChar,
  is_html: true,
  choices: [37,39],
  data: {exp_id: "AX-CPT", "trial_id": "target"},
  timing_stim: 300,
  timing_response: 1300,
  timing_post_trial: 0
};



var trial_proportions = ["AX", "AX", "AX", "AX", "AX", "AX", "AX", "BX", "AY", "BY"]
var block1_list = jsPsych.randomization.repeat(trial_proportions,10)
var block2_list = jsPsych.randomization.repeat(trial_proportions,10)
var block3_list = jsPsych.randomization.repeat(trial_proportions,10)
var blocks = [block1_list,block2_list, block3_list]

var AX_experiment = []
AX_experiment.push(welcome_block);
AX_experiment.push(instructions_block);

for (b = 0; b< blocks.length; b++) {
	var block = blocks[b]
	for (i = 0; i < block.length; i++) {
		switch (block[i]) {
			case "AX":
				cue = A_cue
				target = X_target
				cue.data["condition"]="AX"
				target.data["condition"]="AX"
				break;
			case "BX":
				cue = other_cue
				target = X_target
				cue.data["condition"]="BX"
				target.data["condition"]="BX"
				break;
			case "AY":
				cue = A_cue
				target = other_target
				cue.data["condition"]="AY"
				target.data["condition"]="AY"
				break;
			case "BY":
				cue = other_cue
				target = other_target
				cue.data["condition"]="BY"
				target.data["condition"]="BY"
				break;
		}
		AX_experiment.push(cue)
		AX_experiment.push(target)
		AX_experiment.push(wait_block)
	}
	AX_experiment.push(rest_block)
}
	







