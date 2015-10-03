function loadjscssfile(filename, filetype){
	if (filetype == "js") {
		document.write('<script src =' + filename + '></script>')
	}
	else if (filetype = "css") {
		document.write('<link href =' + filename + ' rel="stylesheet" type="text/css"></script>')
	}
}

var randomDraw = function(lst,n) {
	n = n || "1"
	var random_list = []
	for (i=0; i<n; i++) {
		index = Math.floor(Math.random()*lst.length)
		random_list.push(lst[index])
	}
    return random_list
}

/* Draws experiments randomly to fill up a certain amount of time. 
Completely avoids any knapsack type optimization and just stops 
when it can't find another experiment to add */

var experimentDraw = function(lst, time) {
	var time = time || "30"
	console.log(time)
	var return_list = []
	var total_time = 0
	while (total_time < time && lst.length > 0) {
		console.log(lst.lnoteength)
		index = Math.floor(Math.random()*lst.length)
		if ((total_time + lst[index].time) < 30) {
			total_time += lst[index].time
			return_list.push(lst[index].name)
		} 
		lst.splice(index,1)
	}
    return return_list
}

/* Define some function to select experiments to show. Right now I am hard coding,
but eventually they should be selected by some function (I.E. random new combinations
for a returning subject, keeping the total time under 30 minutes)
*/ 
// full list of experiment names:
var experiment_list = [{name:"simple_rt", time: 3.5}, {name:"choice_rt", time: 4}, {name: "simon", time: 5}, {name: "ANT", time: 20}, 
						{name: "AX-CPT", time: 20}, {name: "DPX", time: 15}, {name: 'keep_track', time: 6},
						{name: "stop_signal", time: 30},{name: "plus-minus", time: 5},{name: "number-letter", time: 5}, {name: "local-global", time: 5},
						{name: "go-nogo", time: 7}, {name: 'stroop', time: 5}, {name: 'antisaccade', time: 8}, {name: 'flanker', time: 6.5},
						{name: 'tone_monitoring', time: 6}, {name: 'image_monitoring', time: 6}, {name: 'letter_memory', time: 5},
						{name: 'volatile_bandit', time: 18}, {name: 'multi-source', time: 7}, {name: 'n-back', time: 16},
						{name: 'adaptive-n-back', time: 16}, {name: 'RNG', time: 3}, {name: '2-stage-decision', time: 26},
						{name: 'ART', time: 45}, {name: 'IDED', time : 10}] 
						
// experiment_names = experimentDraw(experiment_list)
var experiment_names = ["IDED"]

/* One the experiments are selected, load the appropriate files */
for (i = 0; i < experiment_names.length; i++) {
	switch (experiment_names[i]) {
		case "simple_rt":
			loadjscssfile("static/css/experiments/simple_rt.css","css")
			loadjscssfile("static/js/experiments/simple_rt.js","js")
			break;
		case "choice_rt":
			loadjscssfile("static/css/experiments/choice_rt.css","css")
			loadjscssfile("static/js/experiments/choice_rt.js","js")
			break;
		case "simon":
			loadjscssfile("static/css/experiments/simon.css","css")
			loadjscssfile("static/js/experiments/simon.js","js")
			break;
		case "ANT":
			loadjscssfile("static/css/experiments/ANT.css","css")
			loadjscssfile("static/js/experiments/ANT.js","js")
			loadjscssfile("static/js/jspsych/custom_plugins/jspsych-ANT-practice.js","js")
			break;
		case "AX-CPT":
			loadjscssfile("static/css/experiments/AX-CPT.css","css")
			loadjscssfile("static/js/experiments/AX-CPT.js","js")
			break;
		case "DPX":
			loadjscssfile("static/css/experiments/DPX.css","css")
			loadjscssfile("static/js/experiments/DPX.js","js")
			break;
		case "stop_signal":
			loadjscssfile("static/css/experiments/stop_signal.css","css")
			loadjscssfile("static/js/experiments/stop_signal.js","js")
			loadjscssfile("static/js/jspsych/custom_plugins/jspsych-stop-signal.js","js")
			loadjscssfile("static/js/jspsych/plugins/jspsych-call-function.js","js")
			break;
		case "plus-minus":
			loadjscssfile("static/js/experiments/plus-minus.js","js")
			break;
		case "number-letter":
			loadjscssfile("static/css/experiments/number-letter.css","css")
			loadjscssfile("static/js/experiments/number-letter.js","js")
			break;
		case "local-global":
			loadjscssfile("static/css/experiments/local-global.css","css")
			loadjscssfile("static/js/experiments/local-global.js","js")
			break;
		case "go-nogo":
			loadjscssfile("static/css/experiments/go-nogo.css","css")
			loadjscssfile("static/js/experiments/go-nogo.js","js")
			break;
		case "stroop":
			loadjscssfile("static/css/experiments/stroop.css","css")
			loadjscssfile("static/js/experiments/stroop.js","js")
			break;
		case "antisaccade":
			loadjscssfile("static/css/experiments/antisaccade.css","css")
			loadjscssfile("static/js/experiments/antisaccade.js","js")
			break;
		case "flanker":
			loadjscssfile("static/css/experiments/flanker.css","css")
			loadjscssfile("static/js/experiments/flanker.js","js")
			break;
		case "tone_monitoring":
			loadjscssfile("static/js/experiments/tone_monitoring.js","js")
			loadjscssfile("static/js/jspsych/custom_plugins/jspsych-categorize-audio.js","js")
			loadjscssfile("static/js/jspsych/plugins/jspsych-single-audio.js","js")
			loadjscssfile("static/js/jspsych/plugins/jspsych-call-function.js","js")
			break;
		case "image_monitoring":
			loadjscssfile("static/css/experiments/image_monitoring.css","css")
			loadjscssfile("static/js/experiments/image_monitoring.js","js")
			loadjscssfile("static/js/jspsych/plugins/jspsych-call-function.js","js")
			break;
		case "letter_memory":
			loadjscssfile("static/js/experiments/letter_memory.js","js")
			break;
		case "keep_track":
			loadjscssfile("static/css/experiments/keep_track.css","css")
			loadjscssfile("static/js/experiments/keep_track.js","js")
			break;
		case "volatile_bandit":
			loadjscssfile("static/css/experiments/volatile_bandit.css","css")
			loadjscssfile("static/js/experiments/volatile_bandit.js","js")
			break;
		case "multi-source":
			loadjscssfile("static/css/experiments/multi-source.css","css")
			loadjscssfile("static/js/experiments/multi-source.js","js")
			break;
		case "n-back":
			loadjscssfile("static/js/experiments/n-back.js","js")
			break;
		case "adaptive-n-back":
			loadjscssfile("static/js/experiments/adaptive_n-back.js","js")
			loadjscssfile("static/js/jspsych/plugins/jspsych-call-function.js","js")
			break;
		case "RNG":
			loadjscssfile("static/js/jspsych/custom_plugins/jspsych-multi-button.js","js")
			loadjscssfile("static/css/experiments/RNG.css","css")
			loadjscssfile("static/js/experiments/RNG.js","js")
			break;
		case "2-stage-decision":
			loadjscssfile("static/css/experiments/2-stage-decision.css","css")
			loadjscssfile("static/js/experiments/2-stage-decision.js","js")
			loadjscssfile("static/js/jspsych/plugins/jspsych-call-function.js","js")
			break;
		case "ART":
			loadjscssfile("static/css/experiments/ART.css","css")
			loadjscssfile("static/js/experiments/ART.js","js")
			loadjscssfile("static/js/jspsych/plugins/jspsych-call-function.js","js")
			break;
		case "IDED":
			loadjscssfile("static/js/experiments/IDED.js","js")
			loadjscssfile("static/css/experiments/IDED.css","css")
			loadjscssfile("static/js/jspsych/plugins/jspsych-call-function.js","js")
			break;
	}
}

/* takes an experiment array and concatenates it with the array of each experiment \
identified in 'experiment_names' */
function cat_experiments(experiment_array) {
	for (i = 0; i < experiment_names.length; i++) {
		switch (experiment_names[i]) {
			case "simple_rt":
				experiments = experiments.concat(simple_rt_experiment)
				break;
			case "choice_rt":
				experiments = experiments.concat(choice_rt_experiment)
				break;
			case "simon":
				experiments = experiments.concat(simon_experiment)
				break;
			case "ANT":
				experiments = experiments.concat(ANT_experiment)
				break;
			case "AX-CPT":
				experiments = experiments.concat(AX_experiment)
				break;
			case "DPX":
				experiments = experiments.concat(DPX_experiment)
				break;
			case "stop_signal":
				experiments = experiments.concat(stop_signal_experiment)
				break;
			case "plus-minus":
				experiments = experiments.concat(plus_minus_experiment)
				break;
			case "number-letter":
				experiments = experiments.concat(numlet_experiment)
				break;
			case "local-global":
				experiments = experiments.concat(local_global_experiment)
				break;
			case "go-nogo":
				experiments = experiments.concat(gonogo_experiment)
				break;
			case "stroop":
				experiments = experiments.concat(stroop_experiment)
				break;
			case "antisaccade":
				experiments = experiments.concat(antisaccade_experiment)
				break;
			case "flanker":
				experiments = experiments.concat(flanker_experiment)
				break;
			case "tone_monitoring":
				experiments = experiments.concat(tone_monitoring_experiment)
				break;
			case "image_monitoring":
				experiments = experiments.concat(image_monitoring_experiment)
				break;
			case "letter_memory":
				experiments = experiments.concat(letter_memory_experiment)
				break;
			case "keep_track":
				experiments = experiments.concat(keep_track_experiment)
				break;
			case "volatile_bandit":
				experiments = experiments.concat(volatile_bandit_experiment)
				break;
			case "multi-source":
				experiments = experiments.concat(multisource_experiment)
				break;
			case "n-back":
				experiments = experiments.concat(n_back_experiment)
				break;
			case "adaptive-n-back":
				experiments = experiments.concat(adaptive_n_back_experiment)
				break;
			case "RNG":
				experiments = experiments.concat(RNG_experiment)
				break;
			case "2-stage-decision":
				experiments = experiments.concat(two_stage_experiment)
				break;
			case "ART":
				experiments = experiments.concat(ART_experiment)
				break;
			case "IDED":
				experiments = experiments.concat(IDED_experiment)
				break;
		}
	}
}
