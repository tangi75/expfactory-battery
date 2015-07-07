
/* ************************************ */
/* Define helper functions */
/* ************************************ */


/* ************************************ */
/* Define experimental variables */
/* ************************************ */


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the simple_RT experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var instructions_block = {
  type: 'instructions',
  pages: [
	'<div class = centerbox><p class = block-text>In this experiment we are testing how fast you can respond. On each trial wait press the spacebar as quickly as possible after you see the large "X".</p><p class = block-text>Press <strong>enter</strong> to continue.</p></div>'
	],
  key_forward: 13
};

var start_practice_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>We will start with some practice. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>We will now start the test. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

/* define practice block */
var practice_block = {
  type: 'categorize',
  stimuli: practice_trials.image,
  is_html: true,
  key_answer: practice_response_array,
  correct_text: '<div class = centerbox><p class = center-text>Correct</p></div>',
  incorrect_text: '<div class = centerbox><p class = center-text>Incorrect</p></div>',
  timeout_message: '<div class = centerbox><p class = center-text>Response faster!</p></div>',
  choices: [49,50,51,52],
  data: practice_trials.data,
  timing_feedback_duration: 1000,
  show_stim_with_feedback: false,
  timing_post_trial: 500
}

/* define test block */
var test_block = {
  type: 'single-stim',
  stimuli: test_trials.image,
  is_html: true,
  data: test_trials.data,
  choices: [49,50,51,52],
  timing_post_trial: 500
};

/* create experiment definition array */
var local_global_experiment = [];
local_global_experiment.push(welcome_block);
local_global_experiment.push(instructions_block);
local_global_experiment.push(start_practice_block);
local_global_experiment.push(practice_block);
local_global_experiment.push(start_test_block);
local_global_experiment.push(test_block);


