/**
 * jspsych plugin for categorization trials with feedback
 * Ian Eisenberg
 *
 * modified by Zeynep Enkavi
 * to be tested
 **/

jsPsych.plugins["stim-feedback"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('stim-feedback', 'stimulus', 'image')

  plugin.trial = function(display_element, trial) {

    // set default values for parameters
    //trial.parameter = trial.parameter || 'default value';
    //trial.a_path = trial.stimuli; // all a_path's have been replaced by stimulus
    trial.stimulus = trial.stimulus;
    trial.key_answer = trial.key_answer;
    trial.text_answer = (typeof trial.text_answer === 'undefined') ? "" : trial.text_answer;
    trial.choices = trial.choices;
    trial.correct_text = (typeof trial.correct_text === 'undefined') ? "<p class='feedback'>Correct</p>" : trial.correct_text;
    trial.incorrect_text = (typeof trial.incorrect_text === 'undefined') ? "<p class='feedback'>Incorrect</p>" : trial.incorrect_text;
    trial.noresponse_text = (typeof trial.noresponse_text === 'undefined') ? "<p class='feedback'>No Response</p>" : trial.noresponse_text;
	// timing trial
	trial.timing_response = trial.timing_response || -1; // if -1, then wait for response forever
	trial.timing_stim = trial.timing_stim || -1; // default is to show image until response
	trial.timing_feedback_duration = trial.timing_feedback_duration || 2000;
	// optional trial
	trial.show_stim_with_feedback = (typeof trial.show_stim_with_feedback === 'undefined') ? true : trial.show_stim_with_feedback;
	trial.is_html = (typeof trial.is_html === 'undefined') ? false : trial.is_html;
	trial.force_correct_button_press = (typeof trial.force_correct_button_press === 'undefined') ? false : trial.force_correct_button_press;
	trial.prompt = (typeof trial.prompt === 'undefined') ? '' : trial.prompt;

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

   if (!trial.is_html) {
   	//add image to display
   	display_element.append($('<img>', {
   		"src": trial.stimulus,
   		"class": 'jspsych-categorize-stimulus',
   		"id": 'jspsych-categorize-stimulus'
   	}));
   } else {
   	display_element.append($('<div>', {
   		"id": 'jspsych-categorize-stimulus',
   		"class": 'jspsych-categorize-stimulus',
   		"html": trial.stimulus
   	}));
   }

   // hide image after time if the timing parameter is set
   if (trial.timing_stim > 0) {
   	setTimeoutHandlers.push(setTimeout(function() {
   		$('#jspsych-categorize-stimulus').css('visibility', 'hidden');
   	}, trial.timing_stim));
   }

   // if prompt is set, show prompt
   if (trial.prompt !== "") {
   	display_element.append(trial.prompt);
   }

   // create response function
   var after_response = function(info) {

   	// kill any remaining setTimeout handlers
   	for (var i = 0; i < setTimeoutHandlers.length; i++) {
   		clearTimeout(setTimeoutHandlers[i]);
   	}

   	var correct = false;
   	if (trial.key_answer == info.key) {
   		correct = true;
   	}

   	// save data
   	var trial_data = {
   		"rt": info.rt,
   		"correct": correct,
   		"stimulus": trial.stimulus,
   		"key_press": info.key
   	};

   	//jsPsych.data.write(trial_data);

   	display_element.html('');

   	doFeedback(correct);
   }

   // end trial if time limit is set
   if (trial.timing_response > 0) {
   	var t2 = setTimeout(function() {
   		// save data
   		var trial_data = {
   			"rt": -1,
   			"correct": "NAN",
   			"stimulus": trial.stimulus,
   			"key_press": -1
   		};
   		//jsPsych.data.write(trial_data);

   		display_element.html('');

   		doFeedback("NAN");
   	}, trial.timing_response);
   	setTimeoutHandlers.push(t2);
   }

   var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse(after_response, trial.choices, 'date', false);



   function doFeedback(correct) {
   	// kill keyboard listeners
   	if(typeof keyboardListener !== 'undefined'){
   		jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
   	}

   	// show image during feedback if flag is set
   	if (trial.show_stim_with_feedback) {
   		if (!trial.is_html) {
   			// add image to display
   			display_element.append($('<img>', {
   				"src": trial.stimulus,
   				"class": 'jspsych-categorize-stimulus',
   				"id": 'jspsych-categorize-stimulus'
   			}));
   		} else {
   			display_element.append($('<div>', {
   				"id": 'jspsych-categorize-stimulus',
   				"class": 'jspsych-categorize-stimulus',
   				"html": trial.stimulus
   			}));
   		}
   	}

   	// substitute answer in feedback string.
   	var atext = "";
   	if (correct == "NAN") {
   		atext = trial.noresponse_text.replace("%ANS%", trial.text_answer);
   	}
   	else {
   		if (correct) {
   			atext = trial.correct_text.replace("%ANS%", trial.text_answer);
   		} else {
   			atext = trial.incorrect_text.replace("%ANS%", trial.text_answer);
   		}
   	}

   	// show the feedback
   	display_element.append(atext);

   	// check if force correct button press is set
   	if (trial.force_correct_button_press && correct === false) {

   		var after_forced_response = function(info) {
   			endTrial();
   		}

   		jsPsych.pluginAPI.getKeyboardResponse(after_forced_response, trial.key_answer, 'date', false);

   	} else {
   		setTimeout(function() {
   			endTrial();
   		}, trial.timing_feedback_duration);
   	}

   }

   function endTrial() {
   	// kill any remaining setTimeout handlers
   	for (var i = 0; i < setTimeoutHandlers.length; i++) {
   		clearTimeout(setTimeoutHandlers[i]);
   	}


   	display_element.html("");
   	// jsPsych.finishTrial();
   	jsPsych.finishTrial(trial_data);
   }
  };

  return plugin;
})();