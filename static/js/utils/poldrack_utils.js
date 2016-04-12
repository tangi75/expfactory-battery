

// Class to track focus shifts during experiment
class focus_track {
  constructor() {
    this.shift_away = 0;
  }

  add_shift() {
  	this.shift_away += 1
  }

  get_shifts() {
    return this.shift_away;
  }

  reset() {
  	this.shift_away = 0
  }
}

var focuser = new focus_track()

$(window).blur(function(){
  focuser.add_shift()
});

/**
* Adds the experiment ID as well as the number of focus shifts and whether the experiment was in
* full screen during that trial
* @param {exp_id} string to specify the experiment id
*/
function addID(exp_id) {
	var full_screen_on = (!window.screenTop && !window.screenY)
	jsPsych.data.addDataToLastTrial({
		exp_id: exp_id,
		full_screen: full_screen_on,
		focus_shifts: focuser.get_shifts()
	})
	focuser.reset()
}

/*
* Adds a display stage rather than the generic jsPsych background element
*/
function getDisplayElement() {
  $('<div class = display_stage_background></div>').appendTo('body')
  return $('<div class = display_stage></div>').appendTo('body')
}