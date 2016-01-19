/**
 * jspsych-categorize-audio
 * Ian Eisenberg
 *
 * plugin for playing an audio file, getting a keyboard response, and giving feedback
 *
 * modified by Zeynep Enkavi
 * to be tested
 **/

jsPsych.plugins["categorize-audio"] = (function() {

  var plugin = {};

  var context = new AudioContext();

  plugin.trial = function(display_element, trial) {

    // set default values for parameters
    //trial.parameter = trial.parameter || 'default value';
    trial.audio_stim = jsPsych.pluginAPI.loadAudioFile(trial.stimuli);
    trial.audio_path = trial.stimuli;
    trial.choices = trial.choices || [];
	// option to show image for fixed time interval, ignoring key responses
	//      true = image will keep displaying after response
	//      false = trial will immediately advance when response is recorded
	trial.key_answer = trial.key_answer;
	trial.text_answer = (typeof trial.text_answer === 'undefined') ? "" : trial.text_answer;
	trial.correct_text = (typeof trial.correct_text === 'undefined') ? "<p class='feedback'>Correct</p>" : trial.correct_text;
	trial.incorrect_text = (typeof trial.incorrect_text === 'undefined') ? "<p class='feedback'>Incorrect</p>" : trial.incorrect_text;
	trial.response_ends_trial = (typeof trial.response_ends_trial === 'undefined') ? true : trial.response_ends_trial;
	trial.force_correct_button_press = (typeof trial.force_correct_button_press === 'undefined') ? false : trial.force_correct_button_press;
	trial.prompt = (typeof trial.prompt === 'undefined') ? '' : trial.prompt;
	trial.show_feedback_on_timeout = (typeof trial.show_feedback_on_timeout === 'undefined') ? false : trial.show_feedback_on_timeout;
	trial.timeout_message = trial.timeout_message || "<p>Please respond faster.</p>";
	// timing parameters
	// trials[i].timing_stim = params.timing_stim || -1; // if -1, then show indefinitely
	trial.timing_response = trial.timing_response || -1; // if -1, then wait for response forever
	//trial.prompt = (typeof trial.prompt === 'undefined') ? "" : trial.prompt;
	trial.timing_feedback_duration = trial.timing_feedback_duration || 2000;

    // allow variables as functions
    // this allows any trial variable to be specified as a function
    // that will be evaluated when the trial runs. this allows users
    // to dynamically adjust the contents of a trial as a result
    // of other trials, among other uses. you can leave this out,
    // but in general it should be included
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // this array holds handlers from setTimeout calls
	// that need to be cleared if the trial ends early
	var setTimeoutHandlers = [];

	// play stimulus
	var source = context.createBufferSource();
	source.buffer = jsPsych.pluginAPI.getAudioBuffer(trial.audio_stim);
	source.connect(context.destination);
	startTime = context.currentTime + 0.1;
	source.start(startTime);

	// show prompt if there is one
	if (trial.prompt !== "") {
		display_element.append(trial.prompt);
	}

	// store response
	var response = {rt: -1, key: -1};

			// // function to end trial when it is time
			// var end_trial = function() {

			// 	// kill any remaining setTimeout handlers
			// 	for (var i = 0; i < setTimeoutHandlers.length; i++) {
			// 		clearTimeout(setTimeoutHandlers[i]);
			// 	}

			// 	// move on to the next trial
			// 	jsPsych.finishTrial();
			// };

	// function to handle responses by the subject
	var after_response = function(info) {
	
		// kill any remaining setTimeout handlers
		for (var i = 0; i < setTimeoutHandlers.length; i++) {
			clearTimeout(setTimeoutHandlers[i]);
		}

		// clear keyboard listener
		jsPsych.pluginAPI.cancelAllKeyboardResponses();

		var correct = false;
		if (trial.key_answer == info.key) {
			correct = true;
		}
		console.log(trial.key_answer)
		console.log(info.key)

		// save data
		var trial_data = {
			"rt": info.rt,
			"correct": correct,
			// "stimulus": trial.a_path,
			"stimulus": trial.audio_path,
			"key_press": info.key
			};

		// jsPsych.data.write(trial_data);

		display_element.html('');

		var timeout = info.rt == -1;
		doFeedback(correct, timeout);
	};

	jsPsych.pluginAPI.getKeyboardResponse({
		callback_function: after_response,
		valid_responses: trial.choices,
		rt_method: 'date',
		persist: false,
		allow_held_key: false
	});

	if(trial.timing_response > 0) {
		setTimeoutHandlers.push(setTimeout(function(){
			after_response({key: -1, rt: -1});
		}, trial.timing_response));
	}

	function doFeedback(correct, timeout) {

		if(timeout && !trial.show_feedback_on_timeout){
			display_element.append(trial.timeout_message);
		} else {
		// substitute answer in feedback string.
		var atext = "";
		if (correct) {
			atext = trial.correct_text.replace("%ANS%", trial.text_answer);
		} else {
			atext = trial.incorrect_text.replace("%ANS%", trial.text_answer);
		}

		// show the feedback
		display_element.append(atext);
				}
		// check if force correct button press is set
		if (trial.force_correct_button_press && correct === false && ((timeout && trial.show_feedback_on_timeout) || !timeout)) {

			var after_forced_response = function(info) {
				endTrial();
			}

			jsPsych.pluginAPI.getKeyboardResponse({
				callback_function: after_forced_response,
				valid_responses: [trial.key_answer],
				rt_method: 'date',
				persist: false,
				allow_held_key: false
			});

		} else {
			setTimeout(function() {
				endTrial();
			}, trial.timing_feedback_duration);
		}

	}

	function endTrial() {
		display_element.html("");
		// stop the audio file if it is playing
		source.stop();
				
		// jsPsych.finishTrial();
		jsPsych.finishTrial(trial_data);
	}

  return plugin;
})();

