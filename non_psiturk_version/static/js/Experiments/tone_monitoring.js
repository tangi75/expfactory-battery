/* ************************************ */
/* Define helper functions */
/* ************************************ */
var post_trial_gap = function() {
  return Math.floor( Math.random() * 500 ) + 500;
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var correct_responses = jsPsych.randomization.repeat([["left arrow",37],["right arrow",39]],1)



/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the tone_monitoring experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

  
var instructions_block = {
  type: 'text',
  text: "<div class = centerbox><p class = block-text>In this experiment you will see five letters on the string composed of f's and h's. For instance, you might see 'fffff' or 'hhfhh'. Your task is to respond by pressing the key corresponding to the <strong>middle</strong> letter. So if you see 'ffhff' you would press the 'h' key.</p><p class = block-text>After each respond you will get feedback about whether you were correct or not. We will start with a short practice set.</p><p class = block-text>Press <strong>enter</strong> to begin.</p></div>",
  cont_key: 13
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Finished with this task. Press <strong>enter</strong> to continue.</p></div>',
  cont_key: 13
};

var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Done with practice. Starting test. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var high_tone_block = {
  type: 'single-audio',
  stimuli: ['static/images/tone_monitoring/880Hz_-6dBFS_.5s.mp3'],
  choices: [32],
  timing_stim: 500,
  timing_response: 500,
  timing_post_trial: 2500
};

//Set up experiment
tone_monitoring_experiment = []
tone_monitoring_experiment.push(welcome_block);
tone_monitoring_experiment.push(instructions_block);
tone_monitoring_experiment.push(high_tone_block)
tone_monitoring_experiment.push(end_block)


