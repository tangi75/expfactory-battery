
/* Main reference: http://www.pnas.org/content/suppl/2009/04/20/0808187106.DCSupplemental/0808187106SI.pdf#nameddest=STXT */

/* define welcome message block */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the stop signal experiment. Press any key to begin.</p></div>'
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

var SSD = 250
var updateSSD = function() {
	var curr_trial = jsPsych.progress().current_trial_global
	if (jsPsych.data.getData()[curr_trial].rt != -1 || jsPsych.data.getData()[curr_trial-1].rt != -1) {
		SSD = SSD + 50
	} else { 
		SSD = SSD - 50
	}
}

var fixation_block = {
  type: 'single-stim',
  stimuli: '<div class = centerbox><p class = ss_fixation>+</p></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: "stop_signal", "trial_type": "fixation"},
  timing_post_trial: 0,
  timing_stim: 500,
  timing_response: 500
}



var A_cue = {
  type: 'single-stim',
  stimuli: '<div class = centerbox><p class = AX_text>A</p></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: "AX-CPT", "trial_type": "cue"},
  timing_stim: 300,
  timing_response: 300,
  timing_post_trial: 4900
};

responses = jsPsych.randomization.repeat([37,37,39,39],1,false)
stimuli = [
	{image: '<div class = centerbox><div class = centered-shape id = circle></div></div>',
	data: {correct_response: responses[0], exp_id: "stop_signal"}
	},
	{image: '<div class = centerbox><div class = centered-shape id = square></div></div>',
	data: {correct_response: responses[1], exp_id: "stop_signal"}
	},
	{image: '<div class = centerbox><div class = centered-shape id = triangle></div></div>',
	data: {correct_response: responses[2], exp_id: "stop_signal"}
	},
	{image: '<div class = centerbox><div class = centered-shape id = diamond></div></div>',
	data: {correct_response: responses[3], exp_id: "stop_signal"}
	},
]



var block1_list = jsPsych.randomization.repeat(stimuli,60, true)
var block2_list = jsPsych.randomization.repeat(stimuli,60, true)
var blocks = [block1_list,block2_list]

var stop_signal_experiment = []
stop_signal_experiment.push(welcome_block);
stop_signal_experiment.push(instructions_block);

for (b = 0; b< blocks.length; b++) {
	var block = blocks[b]
	var stop_trials = jsPsych.randomization.repeat(['stop','stop','go','go','go'],block.data.length/5,false)
	for (i = 0; i < block.data.length; i++) {
		stop_signal_experiment.push(fixation_block)
		stim_data = block.data[i]["condition"] = "go"
		if (stop_trials[i] == 'go') {
			var stim_block = {
			  type: 'single-stim',
			  stimuli: block.image[i],
			  data: stim_data,
			  is_html: true,
			  choices: [37,39],
			  timing_post_trial: 1000,
			  timing_stim: 850,
			  timing_response: 850
			}
			stop_signal_experiment.push(stim_block)
		} else {
			stim_data = block.data[i]["condition"] = "stop"
			var stim_block = {
			  type: 'single-stim',
			  stimuli: block.image[i],
			  data: stim_data,
			  is_html: true,
			  choices: [37,39],
			  timing_post_trial: 0,
			  timing_stim: SSD,
			  timing_response: SSD
			}
			var stop_signal_block = {
			  type: 'single-stim',
			  stimuli: '<div class = centerbox><p class = "stop-signal">X</p></div>',
			  data: stim_data,
			  is_html: true,
			  choices: [37,39],
			  timing_post_trial: 1000,
			  timing_stim: 500,
			  timing_response: 500,
			  on_finish: updateSSD
			}
			stop_signal_experiment.push(stim_block)
			stop_signal_experiment.push(stop_signal_block)
		}
	}
	stop_signal_experiment.push(rest_block)
}
	







