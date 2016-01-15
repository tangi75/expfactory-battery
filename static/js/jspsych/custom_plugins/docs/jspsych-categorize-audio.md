# jspsych-categorize-audio plugin

Plugin for playing an audio file, getting a keyboard response, and giving feedback.

## Parameters

This table lists the parameters associated with this plugin. Parameters with a default value of *undefined* must be specified. Other parameters can be left unspecified if the default value is acceptable.

Parameter | Type | Default Value | Description
----------|------|---------------|------------
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
	trial.prompt = (typeof trial.prompt === 'undefined') ? "" : trial.prompt;
	trial.timing_feedback_duration = trial.timing_feedback_duration || 2000;

stimuli | string | NA | Path to audio file
choices | array | [] | Accepted responses
key_answer | boolean | NA | option to show image for fixed time interval, ignoring key responses, true = image will keep displaying after response, false = trial will immediately advance when response is recorded


## Data Generated

In addition to the [default data collected by all plugins](http://docs.jspsych.org/plugins/overview/#datacollectedbyplugins), this plugin collects the following data for each trial.


Name | Type | Value
-----|------|------


## Examples

#### EXPLANATION/TITLE OF EXAMPLE

```javascript
CODE
```