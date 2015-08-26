
/* ************************************ */
/* Define helper functions */
/* ************************************ */
var post_trial_gap = function() {
  return Math.floor( Math.random() * 500 ) + 500;
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var correct_responses = jsPsych.randomization.repeat([['left',37],['right',39]],1)
var train_stimuli = [
  {
	image: '<div class = centerbox><div  id = "stim1"></div></div>',
	data: { correct_response: correct_responses[0][1], condition: correct_responses[0][0], trial_id: 'practice', exp_id: 'choice_rt'}
  },
  {
	image:  '<div class = centerbox><div id = "stim2"></div></div>',
	data: { correct_response: correct_responses[1][1], condition:  correct_responses[1][0], trial_id: 'practice', exp_id: 'choice_rt'}
  }
];

//set one of the stims to 'go' for block 1 and the other to 'go' for block 2
test_stim_responses = jsPsych.randomization.repeat([[['left',37],['right',39]],[['right',39],['left',37]]],1)
//set up block stim. test_stim_responses indexed by [block][stim][type]
var test_stimuli_block1 = [
  {
	image: '<div class = centerbox><div  id = "stim1"></div></div>',
	data: { correct_response: test_stim_responses[0][0][1], condition: test_stim_responses[0][0][0], trial_id: 'test_block1', exp_id: 'choice_rt'}
  },
  {
	image:  '<div class = centerbox><div id = "stim2"></div></div>',
	data: { correct_response: test_stim_responses[0][1][1], condition:  test_stim_responses[0][1][0], trial_id: 'test_block1', exp_id: 'choice_rt'}
  }
];

var test_stimuli_block2 = [
  {
	image: '<div class = centerbox><div  id = "stim1"></div></div>',
	data: { correct_response: test_stim_responses[1][0][1], condition: test_stim_responses[1][0][0], trial_id: 'test_block2', exp_id: 'choice_rt'}
  },
  {
	image:  '<div class = centerbox><div id = "stim2"></div></div>',
	data: { correct_response: test_stim_responses[1][1][1], condition:  test_stim_responses[1][1][0], trial_id: 'test_block2', exp_id: 'choice_rt'}
  }
];


var practice_trials = jsPsych.randomization.repeat(train_stimuli, 10, true);
var test_trials_block1 = jsPsych.randomization.repeat(test_stimuli_block1, 50, true);
var test_trials_block2 = jsPsych.randomization.repeat(test_stimuli_block2, 50, true);

var response_array = [];
for (i = 0; i < practice_trials.data.length; i++) {
	response_array.push(practice_trials.data[i]['correct_response'])
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the choice_rt experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var instructions_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>In this experiment blue and orange squares will appear on the screen. You will be told to respond to one of the colored squares by pressing the left arrow and to the other by pressing the right arrow. </p><p class = block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: 13
};

var start_practice_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>We will begin with practice. If you see the <font color="orange">orange</font> square you should press the <strong>' + correct_responses[0][0] + '</strong> arrow. If you see the <font color="blue">blue</font> square you should press the <strong>' + correct_responses[1][0] + '</strong> arrow.</p><p class = block-text>You will get feedback telling you if you were correct. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var start_test_block1 = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>We will now begin the first test block. You will no longer get feedback about your responses. NOTE: Correct responses to the shapes may have changed!</p><p class = block-text>If you see the <font color="orange">orange</font> square you should press the <strong>' + test_stim_responses[0][0][0] + '</strong> arrow. If you see the <font color="blue">blue</font> square you should press the <strong>' + test_stim_responses[0][1][0] + '</strong> arrow. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var start_test_block2 = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>We will now begin the second test block. NOTE: Correct responses to the shapes have changed!</p><p class = block-text>If you see the <font color="orange">orange</font> square you should press the <strong>' + test_stim_responses[1][0][0] + '</strong> arrow. If you see the <font color="blue">blue</font> square you should press the <strong>' + test_stim_responses[1][0][0] + '</strong> arrow. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

/* define practice block */
var practice_block = {
  type: 'categorize',
  stimuli: practice_trials.image,
  is_html: true,
  key_answer: response_array,
  correct_text: '<div class = centerbox><div class = center-text><font size = 20>Correct</font></div></div>',
  incorrect_text: '<div class = centerbox><div class = center-text><font size = 20>Incorrect</font></div></div>',
  timeout_message: '<div class = centerbox><div class = center-text><font size = 20>Respond faster!</font></div></div>',
  choices: [37,39],
  data: practice_trials.data,
  timing_response: 2000, 
  timing_stim: 2000,
  timing_feedback_duration: 1000,
  show_stim_with_feedback: false,
  timing_post_trial: post_trial_gap,
}

/* define test block */
var test_block1 = {
  type: 'single-stim',
  stimuli: test_trials_block1.image,
  is_html: true,
  choices: [37,39],
  data: test_trials_block1.data,
  timing_response: 2000,
  timing_post_trial: post_trial_gap
};

var test_block2 = {
  type: 'single-stim',
  stimuli: test_trials_block2.image,
  is_html: true,
  choices: [37,39],
  data: test_trials_block2.data,
  timing_response: 2000,
  timing_post_trial: post_trial_gap
};

/* create experiment definition array */
var choice_rt_experiment = [];
choice_rt_experiment.push(welcome_block);
choice_rt_experiment.push(instructions_block);
choice_rt_experiment.push(start_practice_block)
choice_rt_experiment.push(practice_block);
choice_rt_experiment.push(start_test_block1);
choice_rt_experiment.push(test_block1);
choice_rt_experiment.push(start_test_block2);
choice_rt_experiment.push(test_block2);
choice_rt_experiment.push(end_block)


