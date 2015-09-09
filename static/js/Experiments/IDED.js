// Reference http://www.sciencedirect.com/science/article/pii/0028393289901280
// Impaired extra-dimensional shift performance in medicated and unmedicated Parkinson's disease: evidence for a specific attentional dysfunction. Downes et al. 1989
/* ************************************ */
/* Define helper functions */
/* ************************************ */
var post_trial_gap = function() {
  return Math.floor( Math.random() * 500 ) + 500;
}

function get_stim() {
	if (stims.length == 2) {
		stim1 = stims[0]
		stim2 = stims[1]
	} else if (stims.length == 4) {
		if (Math.random()<.5) {
			stim1 = stims[0] + stims[2]
			stim2 = stims[1] + stims[3]
		} else {
			stim1 = stims[0] + stims[3]
			stim2 = stims[1] + stims[2]
		}
	}
	if (reversal == false) {
		target = stim1
	} else {
		target = stim2
	}
	contents = jsPsych.randomization.shuffle(['','', stim1, stim2])
	stim = '<div class = leftbox>' + contents[0] + '</div><div class = topbox>' + contents[1] + '</div><div class = rightbox>' + contents[2] + '</div><div class = bottombox>' + contents[3] + '</div>'
	return stim
}

function get_correct_response() {
	return responses[contents.indexOf(target)]
}

function get_data() {
	return {exp_id: 'IDED', trial_id: 'test', stage: stages[stage_counter]}
}
	
/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var exp_len = 2
var responses = [37,38,39,40]
var path = 'static/images/IDED/'
var center_prefix = '<div class = centerimg><img style="height: 80%; width: auto" src = "'
var left_prefix = '<div class = leftimg><img style="height: 80%; width: auto" src = "'
var right_prefix = '<div class = rightimg><img style="height: 80%; width: auto" src = "'
var postfix = '"</img></div>'
var shape_stim = jsPsych.randomization.shuffle(['Shape_1.png','Shape_2.png','Shape_3.png','Shape_4.png','Shape_5.png','Shape_6.png'])
var line_stim = jsPsych.randomization.shuffle(['Line_1.png','Line_2.png','Line_3.png','Line_4.png','Line_5.png','Line_6.png'])
if (Math.random() < .5) {
	Dim1_stim = shape_stim
	Dim2_stim = line_stim
} else {
	Dim1_stim = line_stim
	Dim2_stim = shape_stim
}
var blocks = ['simple', 'separate', 'compound', 'ID', 'ED'] //Simple: 1 dimension alone, separate: 2 dimensions side-by-side, compound: overlapping
var stages = ['simple', 'simple_rev', 'separate', 'compound', 'compound_rev', 'ID', 'ID_rev', 'ED', 'ED_rev']
//initialize variables used by functions
var contents = [] //holds content of each box (left, up, right, down)
var correct_counter = 0 // tracks number of correct choices in each stage
var stage_counter = 0 // tracks number of stages
var trial_counter = 0 // tracks trials in each stage
var stage_over = 0 // when this variable equals 1 the experiment transitions to the next stage
var target = '' // target is one of the stims
var stims = []
var reversal = false
/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Welcome to the IDED experiment.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var instructions_block = {
  type: 'instructions',
  pages: [
    '<div class = centerbox><p class = block-text>In this task you will see two patterns placed in two of four boxes on the screen. One of the patterns is correct. You must select the one you think is correct by pressing the arrow key corresponding to the correct box (left, right, up or down).</p><p class = block-text>There is a rule you can follow to make sure you make the correct choice each time. The computer will be keeping track of how well you arc doing and when it ia clear that you know the rule then the computer will change, but this not happen very often. To begin with, there is nothing on the screen to tell you which of the two patterns is correct, so your first choice will be a simple guess. However, the computer will give a message after each attempt to tell you whether you are right or wrong. You can start now.</p><p class = block-text>Press the <strong>right</strong> arrow key to move forward through the instructions.</p></div>'   
	]
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: 13
};


var fixation_block = {
  type: 'single-stim',
  stimuli: '<div class = centerbox><div class = fixation>+</div></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: "IDED", "trial_id": "fixation"},
  timing_post_trial: 500,
  timing_stim: 500,
  timing_response: 500
}

var define_simple_stims = {
	type: 'call-function',
	func: function() {
		var Dim1_stim1 = center_prefix + path + Dim1_stim[0] + postfix
		var Dim1_stim2 = center_prefix + path + Dim1_stim[1] + postfix
		stims = [Dim1_stim1, Dim1_stim2]
	}
}

var define_separate_stims = {
	type: 'call-function',
	func: function() {
		var Dim1_stim1 = left_prefix + path + Dim1_stim[0] + postfix
		var Dim1_stim2 = left_prefix + path + Dim1_stim[1] + postfix
		var Dim2_stim1 = right_prefix + path + Dim2_stim[0] + postfix
		var Dim2_stim2 = right_prefix + path + Dim2_stim[1] + postfix
		stims = [Dim1_stim1, Dim1_stim2, Dim2_stim1, Dim2_stim2]
	}
}

var define_compound_stims = {
	type: 'call-function',
	func: function() {
		var Dim1_stim1 = center_prefix + path + Dim1_stim[0] + postfix
		var Dim1_stim2 = center_prefix + path + Dim1_stim[1] + postfix
		var Dim2_stim1 = center_prefix + path + Dim2_stim[0] + postfix
		var Dim2_stim2 = center_prefix + path + Dim2_stim[1] + postfix
		stims = [Dim1_stim1, Dim1_stim2, Dim2_stim1, Dim2_stim2]
	}
}

var define_ID_stims = {
	type: 'call-function',
	func: function() {
		var Dim1_stim1 = center_prefix + path + Dim1_stim[2] + postfix
		var Dim1_stim2 = center_prefix + path + Dim1_stim[3] + postfix
		var Dim2_stim1 = center_prefix + path + Dim2_stim[2] + postfix
		var Dim2_stim2 = center_prefix + path + Dim2_stim[3] + postfix
		stims = [Dim1_stim1, Dim1_stim2, Dim2_stim1, Dim2_stim2]
	}
}

var define_ED_stims = {
	type: 'call-function',
	func: function() {
		var Dim1_stim1 = center_prefix + path + Dim1_stim[4] + postfix
		var Dim1_stim2 = center_prefix + path + Dim1_stim[5] + postfix
		var Dim2_stim1 = center_prefix + path + Dim2_stim[4] + postfix
		var Dim2_stim2 = center_prefix + path + Dim2_stim[5] + postfix
		stims = [Dim2_stim1, Dim2_stim2, Dim1_stim1, Dim1_stim2]
	}
}

/* create experiment definition array */
IDED_experiment = []
IDED_experiment.push(welcome_block)
IDED_experiment.push(instructions_block)
/* define test trials */
for (b=0; b<blocks.length; b++) {
	block = blocks[b]
	if (block == 'simple') {
		IDED_experiment.push(define_simple_stims)
	} else if (block == 'separate') {
		IDED_experiment.push(define_separate_stims)
	} else if (block == 'compound') {
		IDED_experiment.push(define_compound_stims)
	} else if (block == 'ID') {
		IDED_experiment.push(define_ID_stims)
	} else if (block == 'ED') {
		IDED_experiment.push(define_ED_stims)
	}
	
	var stage_block = {
	  type: 'categorize',
	  stimuli: get_stim,
	  is_html: true,
	  key_answer: get_correct_response,
	  correct_text: '<div class = centerbox><div class = center-text><font size = 20>Correct</font></div></div>',
	  incorrect_text: '<div class = centerbox><div class = center-text><font size = 20>Incorrect</font></div></div>',
	  choices: responses,
	  timing_response: -1, 
	  timing_stim: -1,
	  timing_feedback_duration: 1500,
	  show_stim_with_feedback: true,
	  data: get_data,
	  timing_post_trial: 1000,
	  on_finish: function(data) {
		  trial_counter += 1
		  if (data.correct == true) {
			  correct_counter += 1
		  } else {
			  correct_counter = 0
		  }
		  if (correct_counter == 6 || trial_counter == 50) {
			  stage_over = 1
		  }
	  }
	}
	var stage_chunk = {
		chunk_type: 'while',
		timeline: [fixation_block, stage_block],
		continue_function: function(data){
			if (stage_over == 1) {
				stage_over = 0
				correct_counter = 0
				trial_counter = 0
				stage_counter += 1
				reversal = !reversal
				return false
			} else {
				return true
			}
		}
	}
	IDED_experiment.push(stage_chunk)

	if (block != 'separate') {
		IDED_experiment.push(stage_chunk)
	}
}


IDED_experiment.push(end_block)
