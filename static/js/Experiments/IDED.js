// Reference http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0057410

/* ************************************ */
/* Define helper functions */
/* ************************************ */
var post_trial_gap = function() {
  return Math.floor( Math.random() * 500 ) + 500;
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var practice_len = 2
var path = 'static/images/IDED/'
var center_prefix = '<div class = centerimg><img style="height: 80%; width: auto" src = "'
var left_prefix = '<div class = leftimg><img style="height: 80%; width: auto" src = "'
var right_prefix = '<div class = rightimg><img style="height: 80%; width: auto" src = "'
var postfix = '"</img></div>'
var Dim1_stim = jsPsych.randomization.shuffle(['Dim1_1.png','Dim1_2.png','Dim1_3.png','Dim1_4.png','Dim1_5.png','Dim1_6.png'])
var Dim2_stim = jsPsych.randomization.shuffle(['Dim2_1.png','Dim2_2.png','Dim2_3.png','Dim2_4.png','Dim2_5.png','Dim2_6.png'])
var blocks = ['simple', 'separate', 'compound'] //Simple: 1 dimension alone, separate: 2 dimensions side-by-side, compound: overlapping


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

/* create experiment definition array */
IDED_experiment = []


/* define test trials */
var block = 'separate'
if (block == 'simple') {
	var Dim1_stim1 = center_prefix + path + Dim1_stim[0] + postfix
	var Dim1_stim2 = center_prefix + path + Dim1_stim[1] + postfix
	stim1 = Dim1_stim1
	stim2 = Dim1_stim2
} else if (block == 'separate') {
	var Dim1_stim1 = left_prefix + path + Dim1_stim[0] + postfix
	var Dim1_stim2 = left_prefix + path + Dim1_stim[1] + postfix
	var Dim2_stim1 = right_prefix + path + Dim2_stim[0] + postfix
	var Dim2_stim2 = right_prefix + path + Dim2_stim[1] + postfix
	stim1 = Dim1_stim1 + Dim2_stim1
	stim2 = Dim1_stim2 + Dim2_stim2
} else if (block == 'compound') {
	var Dim1_stim1 = center_prefix + path + Dim1_stim[0] + postfix
	var Dim1_stim2 = center_prefix + path + Dim1_stim[1] + postfix
	var Dim2_stim1 = center_prefix + path + Dim2_stim[0] + postfix
	var Dim2_stim2 = center_prefix + path + Dim2_stim[1] + postfix
	stim1 = Dim1_stim1 + Dim2_stim1
	stim2 = Dim1_stim2 + Dim2_stim2
}
for (i=0; i<practice_len; i++) {
	IDED_experiment.push(fixation_block)
	contents = jsPsych.randomization.shuffle(['','', stim1, stim2])
	stim = '<div class = topbox>' + contents[0] + '</div><div class = bottombox>' + contents[1] + '</div><div class = leftbox>' + contents[2] + '</div><div class = rightbox>' + contents[3] + '</div>'
	var practice_block = {
	  type: 'categorize',
	  stimuli: [stim],
	  is_html: true,
	  key_answer: [37],
	  correct_text: '<br></br><div class = center-text><font size = 20>Correct</font></div>',
	  incorrect_text: '<br></br><div class = center-text><font size = 20>Incorrect</font></div>',
	  choices: [37,39],
	  timing_response: -1, 
	  timing_stim: -1,
	  timing_feedback_duration: 500,
	  show_stim_with_feedback: true,
	  timing_post_trial: 250
	}
	IDED_experiment.push(practice_block)
}

IDED_experiment.push(welcome_block)
IDED_experiment.push(instructions_block)
IDED_experiment.push(end_block)
