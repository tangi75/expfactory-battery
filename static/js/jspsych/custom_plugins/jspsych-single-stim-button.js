/**
 * jspsych-multi-button
 * Ian Eisenberg
 *
 * plugin for displaying stimuli and getting mouse responses
 *
 * documentation: docs.jspsych.org
 *
 **/
 
jsPsych['single-stim-button'] = (function(){

    var plugin = {};

    plugin.create = function(params){
    	params = jsPsych.pluginAPI.enforceArray(params, ['stimuli', 'button_class']);

        var trials = new Array(params.stimuli.length);
			for (var i = 0; i < trials.length; i++) {
				trials[i] = {};
				trials[i].stimuli = params.stimuli[i]; 
				trials[i].button_class = params.button_class; //class of button to listen for. All buttons that have this class will advance the trial and be recorded
				trials[i].response_ends_trial = (typeof params.response_ends_trial === 'undefined') ? true : params.response_ends_trial;
				// timing parameters
				trials[i].timing_stim = params.timing_stim || -1; // if -1, then show indefinitely
				trials[i].timing_response = params.timing_response || -1; // if -1, then wait for response forever
				// optional parameters
				trials[i].prompt = (typeof params.prompt === 'undefined') ? "" : params.prompt;
			}
			return trials;
    }
    
    

    plugin.trial = function(display_element, trial){
		
		// if any trial variables are functions
		// this evaluates the function and replaces
		// it with the output of the function
		trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

		var start_time = (new Date()).getTime();
		var response = {rt: -1, mouse: -1};
		
		// this array holds handlers from setTimeout calls
		// that need to be cleared if the trial ends early
		var setTimeoutHandlers = [];
		
		// function to end trial when it is time
		var end_trial = function() {

			// kill any remaining setTimeout handlers
			for (var i = 0; i < setTimeoutHandlers.length; i++) {
				clearTimeout(setTimeoutHandlers[i]);
			}

			// gather the data to store for the trial
			var trial_data = {
				"rt": response.rt,
				"stimulus": trial.stimuli,
				"mouse_click": response.mouse
			};

			jsPsych.data.write(trial_data);

			// clear the display
			display_element.html('');

			// move on to the next trial
			jsPsych.finishTrial();
		};		
		
		// display stimulus
		display_element.append($('<div>', {
					html: trial.stimuli,
					id: 'jspsych-multi-button-stimulus'
				}));
				
		//show prompt if there is one
			if (trial.prompt !== "") {
				display_element.append(trial.prompt);
			}
		
		//Define button press behavior
        $('.' + trial.button_class).on('click',function(){
			if(response.mouse == -1){
				var end_time = (new Date()).getTime();
				var rt = end_time - start_time;
				
				response.rt = rt
				if ($(this).attr('id') != undefined) {
					response.mouse = $(this).attr('id')
				} else {
					response.mouse = 'undefined_button'
				}
				$(this).addClass('responded')
				if (trial.response_ends_trial) {
					end_trial();
				}
			}
        });
		
		// hide image if timing is set
		if (trial.timing_stim > 0) {
			var t1 = setTimeout(function() {
				$('#jspsych-multi-stim-stimulus').css('visibility', 'hidden');
			}, trial.timing_stim);
			setTimeoutHandlers.push(t1);
		}

		// end trial if time limit is set
		if (trial.timing_response > 0) {
			var t2 = setTimeout(function() {
				end_trial();
			}, trial.timing_response);
			setTimeoutHandlers.push(t2);
		}
    }

    return plugin;

})();