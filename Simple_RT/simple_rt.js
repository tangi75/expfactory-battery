
/* ************************************ */
/* Define helper functions */
/* ************************************ */
var post_trial_gap = function() {
  return Math.floor( Math.random() * 500 ) + 500;
}

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
  text: '<div class = centerbox><p class = block-text>In this experiment we are testing how fast you can respond. On each trial wait press the spacebar as quickly as possible after you see the large "X".</p><p class = block-text>Press <strong>enter</strong> to continue.</p></div>'
  key_forward: 13
};

var start_practice_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>We will start 5 practice trials. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>We will now start the test. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

/* define practice block */
var practice_block = {
  type: 'single-stim',
  stimuli: test_trials.image,
  is_html: true,
  data: {exp_id: "simple_rt", trial_id: "practice"},
  choices: [32],
  timing_post_trial: post_trial_gap
};

/* define test block */
var test_block = {
  type: 'single-stim',
  stimuli: test_trials.image,
  is_html: true,
  data: {exp_id: "simple_rt", trial_id: "test"},
  choices: [32],
  timing_post_trial: post_trial_gap
};

/* create experiment definition array */
var local_global_experiment = [];
local_global_experiment.push(welcome_block);
local_global_experiment.push(instructions_block);
local_global_experiment.push(start_practice_block);
local_global_experiment.push(practice_block);
local_global_experiment.push(start_test_block);
local_global_experiment.push(test_block);


