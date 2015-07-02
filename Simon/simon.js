
/* define welcome message block */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the experiment. Press any key to begin.</p></div>'
};

var correct_responses = jsPsych.randomization.repeat([["left arrow",37],["right arrow",39]],1)

/* define instructions block */
var instructions_block = {
  type: 'instructions',
  pages: [
	'<div class = centerbox><p class = block-text>If you see red, press the ' + correct_responses[0][0] + '. Press <strong>enter</strong> to continue.</p></div>',
	'<div class = centerbox><p class = block-text>If you see blue, press the ' + correct_responses[1][0] + '. Press <strong>enter</strong> to continue.</p></div>'
	],
  key_forward: 13
};

var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Starting test. Press any key to begin.</p></div>'
};

/* define test block */
var test_stimuli = [
  {
	image: '<div class = centerbox><div class = simon_left id = "stim1"></div></div>',
	data: { correct_response: correct_responses[0][1], condition: 'left', exp_id: 'simon'}
  },
  {
	image:  '<div class = centerbox><div class = simon_right id = "stim1"></div></div>',
	data: { correct_response: correct_responses[0][1], condition:  'left', exp_id: 'simon'}
  },
  {
	image: '<div class = simon_leftbox><div class = simon_left id = "stim2"></div></div>',
	data: { correct_response: correct_responses[1][1], condition: 'right', exp_id: 'simon'}
  },
  {
	image:  '<div class = simon_rightbox><div class = simon_right id = "stim2"></div></div>',
	data: { correct_response: correct_responses[1][1], condition:  'right', exp_id: 'simon'}
  }
];

var practice_trials = jsPsych.randomization.repeat(test_stimuli, 2, true);
var test_trials = jsPsych.randomization.repeat(test_stimuli, 4, true);

var response_array = [];
for (i = 0; i < practice_trials.data.length; i++) {
	response_array.push(practice_trials.data[i]['correct_response'])
}
var post_trial_gap = function() {
  return Math.floor( Math.random() * 500 ) + 500;
}

var practice_block = {
  type: 'stim-feedback',
  stimuli: practice_trials.image,
  is_html: true,
  key_answer: response_array,
  correct_text: '<div class = centerbox><p class = center-text>Correct</p></div>',
  incorrect_text: '<div class = centerbox><p class = center-text>Incorrect</p></div>',
  noresponse_text: '<div class = centerbox><p class = center-text>Response faster!</p></div>',
  choices: [37,39],
  data: practice_trials.data,
  timing_response: 1500, 
  timing_stim: 1500,
  timing_feedback_duration: 1000,
  show_stim_with_feedback: false,
  timing_post_trial: post_trial_gap,
}
	
var test_block = {
  type: 'single-stim',
  stimuli: test_trials.image,
  is_html: true,
  choices: [37,39],
  data: test_trials.data,
  timing_response: 1500,
  timing_post_trial: post_trial_gap
};

/* create experiment definition array */
var simon_experiment = [];
simon_experiment.push(welcome_block);
simon_experiment.push(instructions_block);
simon_experiment.push(practice_block);
simon_experiment.push(start_test_block);
simon_experiment.push(test_block);


