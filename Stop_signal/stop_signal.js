
/* Main reference: http://www.pnas.org/content/suppl/2009/04/20/0808187106.DCSupplemental/0808187106SI.pdf#nameddest=STXT */

/* ************************************ */
/* Define helper functions */
/* ************************************ */

var randomDraw = function(lst) {
    index = Math.round(Math.random()*(lst.length-1))
    return lst[index]
}

var getPracticeFeedback = function() {
	return '<div class = centerbox><p class = block-text>' + practice_feedback_text + '</p></div>'
}

/* After each test block let the subject know their average RT and accuracy. If they succeed or fail on too many stop signal trials, give them a reminder */
var getTestFeedback = function() {
	data = jsPsych.data.getLastChunkData()
	var sum_rt = 0;
	var sum_correct = 0;
	var go_length = 0;
	var stop_length = 0;
	var num_responses = 0;
	var successful_stops = 0;
	for(var i=0; i < data.length; i++){
		if (data[i].trial_id == "stim") {
			if (data[i].condition.slice(0,2) == "go") {
				go_length += 1
				if (data[i].rt != -1) {
					num_responses += 1
					sum_rt += data[i].rt;
					if (data[i].key_press == data[i].correct_response) { sum_correct += 1 }
				}
			} else {
				stop_length +=1
				if (data[i].rt != -1) {
					successful_stops +=1
				}
			}
		}
	}
	var average_rt = sum_rt / go_length;
	var average_correct = sum_correct / num_responses;
	var missed_responses = go_length - num_responses
	var stop_percent = successful_stops/stop_length
	test_feedback_text = "Average reaction time:  " + Math.round(average_rt) + " ms. Accuracy: " + Math.round(average_correct*100) + "%"
	if (stop_percent >= .75) {
		test_feedback_text += '</p><p class = block-text> Remember to respond as quickly as possible on each trial.'
	} else if (stop_percent <= .25) {
		test_feedback_text += '</p><p class = block-text> Remember to try to withold your response if you see the red stop signal.'
	}
	return '<div class = centerbox><p class = block-text>' + test_feedback_text + '</p></div>'
}

/* Staircase procedure. After each successful stop, make the stop signal delay longer (making stopping harder) */
var updateSSD = function() {
	jsPsych.data.addDataToLastTrial({'SSD': SSD})
	var curr_trial = jsPsych.progress().current_trial_global
	if (jsPsych.data.getData()[curr_trial].rt == -1 && SSD<850) {
		SSD = SSD + 50
	} else if (jsPsych.data.getData()[curr_trial].rt != -1 && SSD > 0) { 
		SSD = SSD - 50
	}
}

var getSSD = function() {
	return SSD
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */

/* Stop signal delay in ms */
var SSD = 250
var stop_signal = '<div class = stopbox><div class = centered-shape id = stop-signal></div><div class = centered-shape id = stop-signal-inner></div></div>'
var correct_responses = jsPsych.randomization.repeat([["left arrow",37],["left arrow",37],["right arrow",39],["right arrow",39]],1)
var prompt_text = '<ul list-text><li>Square:  ' + correct_responses[0][0] + '</li><li>Circle:  ' + correct_responses[1][0] + ' </li><li>Triangle:  ' + correct_responses[2][0] + ' </li><li>Diamond:  ' + correct_responses[3][0] + ' </li></ul>'

var stimuli = [
	{image: '<div class = shapebox><div class = centered-shape id = square></div></div>',
	data: {correct_response: correct_responses[0][1], exp_id: "stop_signal", trial_id: "stim"}
	},
	{image: '<div class = shapebox><div class = centered-shape id = circle></div></div>',
	data: {correct_response: correct_responses[1][1], exp_id: "stop_signal", trial_id: "stim"}
	},
	{image: '<div class = shapebox><div class = centered-shape id = triangle></div></div>',
	data: {correct_response: correct_responses[2][1], exp_id: "stop_signal", trial_id: "stim"}
	},
	{image: '<div class = shapebox><div class = centered-shape id = diamond></div></div>',
	data: {correct_response: correct_responses[3][1], exp_id: "stop_signal", trial_id: "stim"}
	},
]

var noSS_practice_list = jsPsych.randomization.repeat(stimuli,3,true)
var practice_list = jsPsych.randomization.repeat(stimuli,5, true)

numblocks = 2
blocks = []
for (i = 0; i< numblocks; i++) {
    blocks.push(jsPsych.randomization.repeat(stimuli,15, true))
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the stop signal experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
};

var instructions_block = {
  type: 'instructions',
  pages: [
	'<div class = centerbox><p class = block-text>In this task you will see black shapes appear on the screen one at a time. You will respond to them by pressing the left or right arrow keys.</p><p class = block-text>Press <strong>enter</strong> to continue.</p></div>',
	'<div class = centerbox><p class = block-text>Only one key is correct for each shape. The correct keys are as follows:' + prompt_text + '<p class = block-text>These instructions will remain on the screen during practice, but will be removed during the test phase.</p><p class = block-text> Press <strong>enter</strong> to continue.</p></div>',
	'<div class = centerbox><p class = block-text>You should respond as quickly and accurately as possible to each shape.</p><p class = block-text>Press <strong>enter</strong> to continue.</p></div>',
	'<div class = centerbox><p class = block-text>On some proportion of trials a red "stop signal"  will appear around the shape after a short delay. On these trials you should <strong>not respond</strong> in any way.</p><p class = block-text>Press <strong>enter</strong> to continue.</p></div>',
	'<div class = centerbox><p class = block-text>It is equally important that you both respond quickly and accurately to the shapes when there is no red stop signal <strong>and</strong> successfully stop your response on trials where there is a red stop signal.</p><p class = block-text>Press <strong>enter</strong> to continue.</p></div>'
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
  data: {exp_id: "stop_signal", "trial_id": "fixation"},
  timing_post_trial: 0,
  timing_stim: 500,
  timing_response: 500
}

/* prompt blocks are used during practice to show the instructions */
var prompt_block = {
  type: 'single-stim',
  stimuli: prompt_text,
  choices: [37, 39],
  is_html: true,
  timing_post_trial: 0,
  timing_stim: 1000,
  timing_response: 1000,
  response_ends_trial: false
}

var prompt_fixation_block = {
  type: 'single-stim',
  stimuli: '<div class = shapebox><p class = ss_fixation>+</p></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: "stop_signal", "trial_id": "fixation"},
  timing_post_trial: 0,
  timing_stim: 500,
  timing_response: 500,
  prompt: prompt_text
}

/* Initialize 'feedback text' and set up feedback blocks */
var practice_feedback_text = 'We will now start with a practice session. There will be no stop signals. In this practice just concentrate on responding quickly and accurately to each shape. Press <strong>enter</strong> to continue.'
var practice_feedback_block = {
  type: 'text',
  cont_key: 13,
  text: getPracticeFeedback
};

var test_feedback_block = {
  type: 'text',
  cont_key: 13,
  text: getTestFeedback
};

/* ************************************ */
/* Set up experiment */
/* ************************************ */

var stop_signal_experiment = []
stop_signal_experiment.push(welcome_block);
stop_signal_experiment.push(instructions_block);

/* Practice block w/o SS */
var noSS_practice_trials = []
noSS_practice_trials.push(practice_feedback_block)
for (i = 0; i < noSS_practice_list.data.length; i++) {
	noSS_practice_trials.push(prompt_fixation_block)
	var stim_data = $.extend({},noSS_practice_list.data[i])
	stim_data["condition"] = "go_noSS_practice"
	var stim_block = {
	  type: 'single-stim',
	  stimuli: noSS_practice_list.image[i],
	  data: stim_data,
	  is_html: true,
	  choices: [37,39],
	  timing_post_trial: 0,
	  timing_stim: 850,
	  timing_response: 850,
	  response_ends_trial: false,
	  prompt: prompt_text
	}
	noSS_practice_trials.push(stim_block)
	noSS_practice_trials.push(prompt_block)
}

var noSS_practice_chunk = {
    chunk_type: 'while',
    timeline: noSS_practice_trials,
	continue_function: function(data){
        var sum_rt = 0;
        var sum_correct = 0;
        var go_length = 0;
		var num_responses = 0;
        for(var i=0; i < data.length; i++){
			if (data[i].condition == "go_noSS_practice") {
				if (data[i].rt != -1) {
					console.log(data[i].rt)
					num_responses += 1
					sum_rt += data[i].rt;
					if (data[i].key_press == data[i].correct_response) { sum_correct += 1 }
				} else if (data[i+1].rt != -1) {
					console.log(850+data[i+1].rt)
					num_responses += 1
					sum_rt += (850 + data[i+1].rt);
					if (data[i+1].key_press == data[i].correct_response) { sum_correct += 1 }
				}
				go_length += 1
			}
        }
        var average_rt = sum_rt / num_responses;
        var average_correct = sum_correct / num_responses;
		var missed_responses = go_length - num_responses
        practice_feedback_text = "Average reaction time:  " + Math.round(average_rt) + " ms. Accuracy: " + Math.round(average_correct*100) + "%"
        if(average_rt < 1000 && average_correct > .75 && missed_responses < 3){
            // end the loop
			practice_feedback_text += '</p><p class = block-text>In this next practice there will be a stop signal on some trials like there will be in the rest of the experiment. On these trials try to withold your response. Press <strong>enter</strong> to continue.'
            return false;
        } else {
            // keep going until they are faster!
			practice_feedback_text += '</p><p class = block-text>We will try another practice block. '
            if (average_rt > 1000) {
                practice_feedback_text += '</p><p class = block-text>Remember, try to response as quickly and accurately as possible.'
            }
			if (missed_responses >= 3) {
			    practice_feedback_text += '</p><p class = block-text>Remember to respond to each shape.'
			}
			if (average_correct < .75) {
                practice_feedback_text += '</p><p class = block-text>Remember, the correct keys are as follows: ' + prompt_text
            }
            return true;
        }
    }
}
stop_signal_experiment.push(noSS_practice_chunk)

/* Practice block with SS */
var practice_trials = []
practice_trials.push(practice_feedback_block)
var stop_trials = jsPsych.randomization.repeat(['stop','stop','stop','go','go','go','go','go','go','go'],practice_list.data.length/10,false)
for (i = 0; i < practice_list.data.length; i++) {
	practice_trials.push(prompt_fixation_block)
	var stim_data = $.extend({},practice_list.data[i])
	stim_data["condition"] = "go_practice"
	stim_data["SSD"] = SSD
	if (stop_trials[i] == 'go') {
		var stim_block = {
		  type: 'single-stim',
		  stimuli: practice_list.image[i],
		  data: stim_data,
		  is_html: true,
		  choices: [37,39],
		  timing_post_trial: 0,
		  timing_stim: 850,
		  timing_response: 850,
		  response_ends_trial: false,
		  prompt: prompt_text
		}
		practice_trials.push(stim_block)
	} else {
		var stim_data = $.extend({},practice_list.data[i])
		stim_data["condition"] = "stop_practice"
		stim_data["SSD"] = SSD
        var stop_signal_block = {
          type: 'stop-signal',
          stimuli: practice_list.image[i],
          data: stim_data,
          is_html: true,
          choices: [37,39],
          timing_post_trial: 0,
          timing_stim: 850,
          timing_response: 850,
		  response_ends_trial: false,
          prompt: prompt_text,
          SSD: SSD,
          SS_stimulus: stop_signal
        }
		practice_trials.push(stop_signal_block)
	}
	practice_trials.push(prompt_block)
}

/* Practice chunk continues repeating until the subject reaches certain criteria */
var practice_chunk = {
    chunk_type: 'while',
    timeline: practice_trials,
	/* This function defines stopping criteria */
    continue_function: function(data){
        var sum_rt = 0;
        var sum_correct = 0;
        var go_length = 0;
		var num_responses = 0;
        for(var i=0; i < data.length; i++){
            if (data[i].condition == "go_practice") {
				if (data[i].rt != -1) {
					num_responses += 1
					sum_rt += data[i].rt;
					if (data[i].key_press == data[i].correct_response) { sum_correct += 1 }
				} else if (data[i+1].rt != -1) {
					console.log(850+data[i+1].rt)
					num_responses += 1
					sum_rt += (850 + data[i+1].rt);
					if (data[i+1].key_press == data[i].correct_response) { sum_correct += 1 }
				}
				go_length += 1
            }
        }
        var average_rt = sum_rt / num_responses;
        var average_correct = sum_correct / num_responses;
		var missed_responses = go_length - num_responses
        practice_feedback_text = "Average reaction time:  " + Math.round(average_rt) + " ms. Accuracy: " + Math.round(average_correct*100) + "%"
        if(average_rt < 1000 && average_correct > .75 && missed_responses < 3){
            // end the loop
            return false;
        } else {
            // keep going until they are faster!
			practice_feedback_text += '</p><p class = block-text>We will try another practice block. '
            if (average_rt > 1000) {
                practice_feedback_text += '</p><p class = block-text>Remember, try to response as quickly and accurately as possible when no stop signal occurs.'
            }
			if (missed_responses >= 3) {
			    practice_feedback_text += '</p><p class = block-text>Remember to respond to each shape unless you see the red stop signal.'
			}
			if (average_correct < .75) {
                practice_feedback_text += '</p><p class = block-text>Remember, the correct keys are as follows: ' + prompt_text
            }
            return true;
        }
    }
}

stop_signal_experiment.push(practice_chunk)
stop_signal_experiment.push(practice_feedback_block) 
stop_signal_experiment.push(test_block)


/* Test blocks */
ss_freq = 'high' // randomDraw(['high','low'])
for (b = 0; b< blocks.length; b++) {
	stop_signal_exp_block = []
	var block = blocks[b]
	if (b == blocks.length/2) {
	    if (ss_freq=="high") {ss_freq = "low"} else { ss_freq = "high"}
		SSD = 250
	}
	if (ss_freq == "high") {
	    var stop_trials = jsPsych.randomization.repeat(['stop','stop','go','go','go'],block.data.length/5,false)
	} else {
	    var stop_trials = jsPsych.randomization.repeat(['stop','go','go','go','go'],block.data.length/5,false)
	}
	for (i = 0; i < block.data.length; i++) {
		stop_signal_exp_block.push(fixation_block)
		if (stop_trials[i] == 'go') {
			var stim_data = $.extend({},block.data[i])
			stim_data["condition"] = "go_" + ss_freq
			var stim_block = {
			  type: 'single-stim',
			  stimuli: block.image[i],
			  data: stim_data,
			  is_html: true,
			  choices: [37,39],
			  timing_post_trial: 0,
			  timing_stim: 850,
			  timing_response: 1850,
			  response_ends_trial: false
			}
			stop_signal_exp_block.push(stim_block)
		} else {
			var stim_data = $.extend({},block.data[i])
			stim_data["condition"] = "stop_" + ss_freq
			var stop_signal_block = {
			  type: 'stop-signal',
			  stimuli: block.image[i],
			  data: stim_data,
			  is_html: true,
			  choices: [37,39],
			  timing_post_trial: 0,
			  timing_stim: 850,
			  timing_response: 1850,
			  response_ends_trial: false,
			  SSD: getSSD,
			  SS_stimulus: stop_signal,
			  on_finish: updateSSD
			}
			stop_signal_exp_block.push(stop_signal_block)
		}
	}
	var stop_signal_chunk = {
		chunk_type: 'linear',
		timeline: stop_signal_exp_block
	}
	stop_signal_experiment.push(stop_signal_chunk)
	stop_signal_experiment.push(rest_block)
	stop_signal_experiment.push(test_feedback_block)
}
	







