function loadjscssfile(filename, filetype){
	if (filetype == "js") {
		document.write('<script src =' + filename + '></script>')
	}
	else if (filetype = "css") {
		document.write('<link href =' + filename + ' rel="stylesheet" type="text/css"></script>')
	}
}
/*
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}
*/

/* Define some function to select experiments to show. Right now I am hard coding,
but eventually they should be selected by some function (I.E. random new combinations
for a returning subject, keeping the total time under 30 minutes)
*/ 
/* full list of experiment names: ["simon", "ANT", "AX-CPT", "stop_signal","plus-minus","number-letter"] */
var experiment_names = ["number-letter"]

/* One the experiments are selected, load the appropriate files */
for (i = 0; i < experiment_names.length; i++) {
	switch (experiment_names[i]) {
	case "simon":
		loadjscssfile("../Simon/simon.css","css")
		loadjscssfile("../Simon/simon.js","js")
		break;
	case "ANT":
		loadjscssfile("../ANT/ANT.css","css")
		loadjscssfile("../ANT/ANT.js","js")
		loadjscssfile("../ANT/jspsych-ANT-practice.js","js")
		break;
	case "AX-CPT":
		loadjscssfile("../AX-CPT/AX-CPT.css","css")
		loadjscssfile("../AX-CPT/AX-CPT.js","js")
		break;
	case "stop_signal":
		loadjscssfile("../Stop_signal/stop_signal.css","css")
		loadjscssfile("../Stop_signal/stop_signal.js","js")
		loadjscssfile("../Stop_signal/jspsych-stop-signal.js","js")
		break;
	case "plus-minus":
		loadjscssfile("../Plus-minus/plus-minus.js","js")
		loadjscssfile("jspsych-4.2/plugins/jspsych-survey-text.js","js")
		break;
	case "number-letter":
	    loadjscssfile("../Number-letter/number-letter.css","css")
		loadjscssfile("../Number-letter/number-letter.js","js")
		break;
	}
}

/* takes an experiment array and concatenates it with the array of each experiment \
identified in 'experiment_names' */
function cat_experiments(experiment_array) {
	for (i = 0; i < experiment_names.length; i++) {
		switch (experiment_names[i]) {
		case "simon":
			experiments = experiments.concat(simon_experiment)
			break;
		case "ANT":
			experiments = experiments.concat(ANT_experiment)
			break;
		case "AX-CPT":
			experiments = experiments.concat(AX_experiment)
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
		}
	}
}