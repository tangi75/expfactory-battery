
/* Main reference: http://www.pnas.org/content/suppl/2009/04/20/0808187106.DCSupplemental/0808187106SI.pdf#nameddest=STXT */


/* Define helper functions */

var randomDraw = function(lst) {
    index = Math.round(Math.random()*(lst.length-1))
    return lst[index]
}

var getPracticeFeedback = function() {
	return '<div class = centerbox><p class = block-text>' + practice_feedback_text + '</p></div>'
}

var updateSSD = function() {
	var curr_trial = jsPsych.progress().current_trial_global
	if (jsPsych.data.getData()[curr_trial].rt == -1 && SSD<850) {
		SSD = SSD + 50
	} else if (SSD > 0) { 
		SSD = SSD - 50
	}
}


/* define welcome message block */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the stop signal experiment. Press any key to begin.</p></div>'
};

var correct_responses = jsPsych.randomization.repeat([["left arrow",37],["left arrow",37],["right arrow",39],["right arrow",39]],1)

/* define static blocks */
var instructions_block = {
  type: 'instructions',
  pages: [
	'<div class = centerbox><p class = block-text>In this task you will see black shapes appear on the screen one at a time. You will respond to them by pressing the left or right arrow keys.</p><p class = block-text>Press <strong>enter</strong> to continue.</p></div>',
	'<div class = centerbox><p class = block-text>Only one key is correct for each shape. The correct keys are as follows:</p><ul class = list-text><li >Square:  ' + correct_responses[0][0] + '</li><li>Circle:  ' + correct_responses[1][0] + ' </li><li>Triangle:  ' + correct_responses[2][0] + ' </li><li>Diamond:  ' + correct_responses[3][0] + ' </li></ul><p class = block-text>These instructions will remain on the screen during practice, but will be removed during the test phase.</p><p class = block-text> Press <strong>enter</strong> to continue.</p></div>',
	'<div class = centerbox><p class = block-text>You should respond as quickly and accurately as possible to each shape. The shape will only be on the screen for a very short amount of time, and you must respond before it disappears.</p><p class = block-text>Press <strong>enter</strong> to continue.</p></div>',
	'<div class = centerbox><p class = block-text>On some proportion of trials a red "X" will appear over the shape after a short delay. On these trials you should <strong>not respond</strong> in any way.</p><p class = block-text>Press <strong>enter</strong> to continue.</p></div>',
	'<div class = centerbox><p class = block-text>It is equally important that you both respond quickly and accurately to the shapes when there is no "X" <strong>and</strong> successfully stop your response on trials where there is a red "X".</p><p class = block-text>Press <strong>enter</strong> to continue.</p></div>'
	],
  key_forward: 13
};

var test_block = {
  type: 'text',
  cont_key: 13,
  text: '<div class = centerbox><p class = block-text>Done with practice. We will now begin the two test blocks. There will be a break after each block. Press any key to continue.</p></div>'
};

var rest_block = {
  type: 'text',
  cont_key: 13,
  text: '<div class = centerbox><p class = block-text>Take a break! Press any key to continue.</p></div>'
};

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

/* prompt blocks are used during practice to show the instructions */
var prompt_text = '<ul list-text><li>Square:  ' + correct_responses[0][0] + '</li><li>Circle:  ' + correct_responses[1][0] + ' </li><li>Triangle:  ' + correct_responses[2][0] + ' </li><li>Diamond:  ' + correct_responses[3][0] + ' </li></ul>'
var prompt_block = {
  type: 'single-stim',
  stimuli: prompt_text,
  is_html: true,
  choices: 'none',
  timing_post_trial: 0,
  timing_stim: 1000,
  timing_response: 1000,
}

var prompt_fixation_block = {
  type: 'single-stim',
  stimuli: '<div class = centerbox><p class = ss_fixation>+</p></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: "stop_signal", "trial_type": "fixation"},
  timing_post_trial: 0,
  timing_stim: 500,
  timing_response: 500,
  prompt: prompt_text
}

var practice_feedback_text = 'We will not start with a practice session. Press <strong>enter</strong> to continue.'

var practice_feedback_block = {
  type: 'text',
  text: getPracticeFeedback
};

/* define test block */

var SSD = 250

stimuli = [
	{image: '<div class = shapebox><div class = centered-shape id = circle></div></div>',
	data: {correct_response: correct_responses[0][1], exp_id: "stop_signal"}
	},
	{image: '<div class = shapebox><div class = centered-shape id = square></div></div>',
	data: {correct_response: correct_responses[1][1], exp_id: "stop_signal"}
	},
	{image: '<div class = shapebox><div class = centered-shape id = triangle></div></div>',
	data: {correct_response: correct_responses[2][1], exp_id: "stop_signal"}
	},
	{image: '<div class = shapebox><div class = centered-shape id = diamond></div></div>',
	data: {correct_response: correct_responses[3][1], exp_id: "stop_signal"}
	},
]


var practice_list = jsPsych.randomization.repeat($.extend(true,[],stimuli),5, true)

numblocks = 10
blocks = []
for (i = 0; i< numblocks; i++) {
    blocks.push(jsPsych.randomization.repeat($.extend(true,[],stimuli),15, true))
}

var stop_signal_experiment = []
stop_signal_experiment.push(welcome_block);
stop_signal_experiment.push(instructions_block);

/* Practice block */
var practice_trials = []
practice_trials.push(practice_feedback_block)
var stop_trials = jsPsych.randomization.repeat(['stop','stop', 'stop', 'go', 'go', 'go','go','go','go','go'],2,false)
for (i = 0; i < practice_list.data.length; i++) {
	practice_trials.push(prompt_fixation_block)
	practice_list.data[i]["condition"] = "go_practice"
	practice_list.data[i]["SSD"] = SSD
	if (stop_trials[i] == 'go') {
		var stim_block = {
		  type: 'single-stim',
		  stimuli: practice_list.image[i],
		  data: practice_list.data[i],
		  is_html: true,
		  choices: [37,39],
		  timing_post_trial: 0,
		  timing_stim: 850,
		  timing_response: 850,
		  prompt: prompt_text
		}
		practice_trials.push(stim_block)
	} else {
		practice_list.data[i]["condition"] = "go_practice"
		practice_list.data[i]["SSD"] = SSD
        var stop_signal_block = {
          type: 'stop-signal',
          stimuli: practice_list.image[i],
          data: practice_list.data[i],
          is_html: true,
          choices: [37,39],
          timing_post_trial: 0,
          timing_stim: 850,
          timing_response: 850,
          prompt: prompt_text,
          SSD: SSD,
          SS_stimulus: '<div class = centerbox><div id = burst-12></div></div>'
        }
		practice_trials.push(stop_signal_block)
	}
	practice_trials.push(prompt_block)
}

var practice_chunk = {
    chunk_type: 'while',
    timeline: practice_trials,
    continue_function: function(data){
        // check to see if the average RT was under 1s
        var sum_rt = 0;
        var sum_correct = 0;
        var go_length = 0;
		console.log(data.length)
        for(var i=0; i < data.length; i++){
            if (data[i].condition == "go_practice" && data[i].rt != -1) {
                go_length += 1
                sum_rt += data[i].rt;
				console.log(sum_rt)
                if (data[i].key_press == data[i].correct_response) { sum_correct += 1 }
            }
        }
        var average_rt = sum_rt / go_length;
        var average_correct = sum_correct / go_length;
        practice_feedback_text = "Average reaction time:  " + Math.round(average_rt) + " ms. Accuracy: " + Math.round(average_correct*100) + "%"
        if(average_rt < 1000 && average_correct > .75){
            // end the loop
            return false;
        } else {
            // keep going until they are faster!
            if (average_correct < .75) {
                practice_feedback_text += 	'</p><p class = block-text>We will try another practice block. Remember, the correct keys are as follows: ' + prompt_text
            }
            if (average_rt < 1000) {
                practice_feedback_text += '</p><p class = block-text>We will try another practice block. Remember, try to response as quickly and accurately as possible when no stop signal occurs.'
            }
            return true;
        }
    }
}
stop_signal_experiment.push(practice_chunk)
stop_signal_experiment.push(practice_feedback_block)
stop_signal_experiment.push(test_block)

/* Test blocks */
ss_freq = randomDraw(['high','low'])
for (b = 0; b< blocks.length; b++) {
	var block = blocks[b]
	if (b == b.length/2) {
	    if (ss_freq=="high") {ss_freq = "low"} else { ss_freq = "high"}
	}
	if (ss_freq == "high") {
	    var stop_trials = jsPsych.randomization.repeat(['stop','stop','go','go','go'],block.data.length/5,false)
	} else {
	    var stop_trials = jsPsych.randomization.repeat(['stop','go','go','go','go'],block.data.length/5,false)
	}
	for (i = 0; i < block.data.length; i++) {
		stop_signal_experiment.push(fixation_block)
		if (stop_trials[i] == 'go') {
			block.data[i]["condition"] = "go_" + ss_freq[b]
			block.data[i]["SSD"] = SSD
			var stim_block = {
			  type: 'single-stim',
			  stimuli: block.image[i],
			  data: block.data[i],
			  is_html: true,
			  choices: [37,39],
			  timing_post_trial: 1000,
			  timing_stim: 850,
			  timing_response: 850
			}
			stop_signal_experiment.push(stim_block)
		} else {
			block.data[i]["condition"] = "stop_" + ss_freq[b]
			block.data[i]["SSD"] = SSD
			var stop_signal_block = {
			  type: 'stop-signal',
			  stimuli: block.image[i],
			  data: block.data[i],
			  is_html: true,
			  choices: [37,39],
			  timing_post_trial: 1000,
			  timing_stim: 850,
			  timing_response: 850,
			  SSD: SSD,
			  SS_stimulus: '<div class = centerbox><p class = "stop-signal">X</p></div>',
			  on_finish: updateSSD
			}
			stop_signal_experiment.push(stop_signal_block)
		}
	}
	stop_signal_experiment.push(rest_block)
}

block.data[0]["condition"]="hiya"
	







