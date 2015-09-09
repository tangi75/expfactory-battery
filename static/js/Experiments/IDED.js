// Reference http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0057410

/* ************************************ */
/* Define helper functions */
/* ************************************ */
var post_trial_gap = function() {
  return Math.floor( Math.random() * 500 ) + 500;
}

function get_stim() {
	contents = jsPsych.randomization.shuffle(['','', stim1, stim2])
	stim = '<div class = leftbox>' + contents[0] + '</div><div class = topbox>' + contents[1] + '</div><div class = rightbox>' + contents[2] + '</div><div class = bottombox>' + contents[3] + '</div>'
	return stim
}

function get_correct_response() {
	return responses[contents.indexOf(target)]
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
var blocks = ['simple', 'separate', 'compound'] //Simple: 1 dimension alone, separate: 2 dimensions side-by-side, compound: overlapping
var contents = [] //holds content of each box (left, up, right, down)
var correct_counter = 0 // tracks number of correct choices in each stage
var stage_counter = 0 // tracks trials in each stage
var stage_over = 0 // when this variable equals 1 the experiment transitions to the next stage
var target = '' // target is one of the stims
/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the Press the <strong>left</strong> arrow key to go back or the <strong>right</strong> arrow key to move forward through the instructions. experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var instructions_block = {
  type: 'text',
  text: '',
  cont_key: 13
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
  data: {exp_id: "stop_signal", "trial_id": "fixation"},
  timing_post_trial: 500,
  timing_stim: 500,
  timing_response: 500
}

var define_simple_stims = {
	type: 'call-function',
	func: function() {
		var Dim1_stim1 = center_prefix + path + Dim1_stim[0] + postfix
		var Dim1_stim2 = center_prefix + path + Dim1_stim[1] + postfix
		stim1 = Dim1_stim1
		stim2 = Dim1_stim2
		target = stim1
	}
}

var define_separate_stims = {
	type: 'call-function',
	func: function() {
		var Dim1_stim1 = left_prefix + path + Dim1_stim[0] + postfix
		var Dim1_stim2 = left_prefix + path + Dim1_stim[1] + postfix
		var Dim2_stim1 = right_prefix + path + Dim2_stim[0] + postfix
		var Dim2_stim2 = right_prefix + path + Dim2_stim[1] + postfix
		stim1 = Dim1_stim1 + Dim2_stim1
		stim2 = Dim1_stim2 + Dim2_stim2
		target = stim1
	}
}

var define_compound_stims = {
	type: 'call-function',
	func: function() {
		var Dim1_stim1 = center_prefix + path + Dim1_stim[0] + postfix
		var Dim1_stim2 = center_prefix + path + Dim1_stim[1] + postfix
		var Dim2_stim1 = center_prefix + path + Dim2_stim[0] + postfix
		var Dim2_stim2 = center_prefix + path + Dim2_stim[1] + postfix
		stim1 = Dim1_stim1 + Dim2_stim1
		stim2 = Dim1_stim2 + Dim2_stim2
		target= stim1
	}
}

var switch_target= {
	type: 'call-function',
	func: function() {
		target = stim2
	}
}

/* create experiment definition array */
IDED_experiment = []


/* define test trials */
for (b=0; b<blocks.length; b++) {
	block = blocks[b]
	if (block == 'simple') {
		IDED_experiment.push(define_simple_stims)
	} else if (block == 'separate') {
		IDED_experiment.push(define_separate_stims)
	} else if (block == 'compound') {
		IDED_experiment.push(define_compound_stims)
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
	  timing_feedback_duration: 500,
	  show_stim_with_feedback: true,
	  timing_post_trial: 250,
	  on_finish: function(data) {
		  stage_counter += 1
		  if (data.correct == true) {
			  correct_counter += 1
		  } else {
			  correct_counter = 0
		  }
		  if (correct_counter == 6 || stage_counter == 50) {
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
				stage_counter = 0
				return false
			} else {
				return true
			}
		}
	}
	IDED_experiment.push(stage_chunk)

	if (block != 'separate') {
		IDED_experiment.push(switch_target)
		IDED_experiment.push(stage_chunk)
	}
}

IDED_experiment.push(welcome_block)
IDED_experiment.push(instructions_block)
IDED_experiment.push(end_block)
