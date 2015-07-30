/* ************************************ */
/* Define helper functions */
/* ************************************ */
var post_trial_gap = function() {
  return Math.floor( Math.random() * 500 ) + 500;
}

var randomDraw = function(lst) {
    var index = Math.floor(Math.random()*(lst.length))
    return lst[index]
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var correct_responses = jsPsych.randomization.repeat([["left arrow",37],["right arrow",39]],1)

practice_stims = [{sound: 'static/sounds/tone_monitoring/880Hz_-6dBFS_.5s.mp3',
		  data: {exp_id: 'tone_monitoring', trial_id: 'high', condition: 'practice'}},
		 {sound: 'static/sounds/tone_monitoring/440Hz_-6dBFS_.5s.mp3',
		  data: {exp_id: 'tone_monitoring', trial_id: 'medium', condition: 'practice'}},
		 {sound: 'static/sounds/tone_monitoring/220Hz_-6dBFS_.5s.mp3',
		 data: {exp_id: 'tone_monitoring', trial_id: 'low', condition: 'practice'}}
]

stims = [{sound: 'static/sounds/tone_monitoring/880Hz_-6dBFS_.5s.mp3',
		  data: {exp_id: 'tone_monitoring', trial_id: 'high', condition: 'test'}},
		 {sound: 'static/sounds/tone_monitoring/440Hz_-6dBFS_.5s.mp3',
		  data: {exp_id: 'tone_monitoring', trial_id: 'medium', condition: 'test'}},
		 {sound: 'static/sounds/tone_monitoring/220Hz_-6dBFS_.5s.mp3',
		 data: {exp_id: 'tone_monitoring', trial_id: 'low', condition: 'test'}}
]

last_tone = randomDraw(practice_stims)
practice_trials = jsPsych.randomization.repeat(practice_stims,8, true);
practice_trials.sound.push(last_tone.sound)
practice_trials.data.push(last_tone.data)

block_num = 4
blocks = []
for (b=0; b<block_num; b++){
	block_trials = jsPsych.randomization.repeat(stims,8,true);
	last_tone = randomDraw(stims)
	block_trials.sound.push(last_tone.sound)
	block_trials.data.push(last_tone.data)
	blocks.push(block_trials)
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
	
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the tone monitoring experiment. This experiment has sound. At this time, make sure you can hear sounds using headphones or speakers. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

  
var instructions_block = {
  type: 'instructions',
  pages: [
    '<div class = centerbox><p class = block-text>In this experiment you will hear tones in a sequence, one after the other. You will hear one of three tones on each trial: a high tone, a medium tone, or a low tone.</p><p class = block-text>Press <strong>enter</strong> to continue.</p></div>',
    '<div class = centerbox><p class = block-text>Your job is to keep each track of the number of times each tone repeats and respond when you hear any tone repeat four times by pressing the spacebar. For instance, if you hear "high, high, low, medium, high, low, medium, <strong>high</strong>" you should respond on the last (fourth) high tone.</p><p class = block-text>If the sequence of tones continued with "high, medium, low, <strong>medium</strong>" you would respond again, as the medium tone had repeated four times, and so on.</p><p class = block-text>Press <strong>enter</strong> to begin.</p></div>',
	"<div class = centerbox><p class = block-text>After you respond by pressing the spacebar, you should 'reset' that tone's count. So in the previous examples, once you press the spacebar in response to the high tones, you should start counting the high tones again from 0.</p><p class = block-text>Even if you believe you pressed the spacebar at the wrong time (if you thought only 3 high tones had passed instead of 4), you <strong>still should reset your count</strong>. So if you count 3 high tones and inappropriately responded, begin counting high tones from 0 again.</p><p class = block-text>Press <strong>enter</strong> to continue.</p></div>",
	'<div class = centerbox><p class = block-text>To summarize, you will keep track of three different tones: low, medium and high. When you count 4 of any tone, press the spacebar. After you respond to a tone (regardless of if you were correct or not), mentally reset that tones count, while leaving the count for the other tones intact.</p><p class = block-text>Press <strong>enter</strong> to continue.</p></div>'
	],
  key_forward: 13
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Finished with this task. Press <strong>enter</strong> to continue.</p></div>',
  cont_key: 13
};

var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Starting a test block. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};


//Set up experiment
var tone_monitoring_experiment = []
tone_monitoring_experiment.push(welcome_block);
tone_monitoring_experiment.push(instructions_block);

for (b=0; b<block_num; b++) {
	block = blocks[b]
	tone_monitoring_experiment.push(start_test_block)
	var test_tone_block = {
	  type: 'single-audio',
	  stimuli: block.sound,
	  data: block.data,
	  choices: [32],
	  timing_stim: 500,
	  timing_response: 500,
	  timing_post_trial: 2500
	};
	tone_monitoring_experiment.push(test_tone_block)
}

tone_monitoring_experiment.push(end_block)


