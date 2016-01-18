/**
 * jspsych-survey-multi-choice
 * a jspsych plugin for multiple choice survey questions
 *
 * Shane Martin
 *
 * documentation: docs.jspsych.org
 * 
 * Addition by Zeynep Enkavi:
 * - [check] Store each question in separate rows
 * - [check] include numeric codes
 * - [check] scored numeric data
 * - progress bars
 * - [check] response range: 
 * - [check] include question data
 *
 * TODO:
 * When back -> next have page populated with responses before back (maybe a fillPageResponses function?)
 * continuous trial num
 * fix css to fit all options on one row
 *
 * add later:
 * "num_response_change": , //number of times a response was changed
 */


jsPsych.plugins['survey-multi-choice'] = (function() {

  var plugin = {};

  plugin.trial = function(display_element, trial) {

    var plugin_id_name = "jspsych-survey-multi-choice";
    var plugin_id_selector = '#' + plugin_id_name;
    var _join = function( /*args*/ ) {
      var arr = Array.prototype.slice.call(arguments, _join.length);
      return arr.join(separator = '-');
    }

    // trial defaults
    trial.preamble = typeof trial.preamble == 'undefined' ? "" : trial.preamble;
    trial.required = typeof trial.required == 'undefined' ? null : trial.required; // should have same dims as trial.pages
    trial.horizontal = typeof trial.required == 'undefined' ? false : trial.horizontal;

    trial.pages = typeof trial.pages == 'undefined' ? "" : trial.pages;
    trial.show_clickable_nav = (typeof trial.show_clickable_nav === 'undefined') ? true : trial.show_clickable_nav;
    trial.allow_backward = (typeof trial.allow_backward === 'undefined') ? true : trial.allow_backward;

    // mandatory parameters: 
    // options - Array with an array for each page that contains array with responses for each question (i.e. 3 dim array instead of 2 options[current_page][current_question][current_option])
    // scale - Object containing how any option should be coded numerically

    // Helper function to create arrays of lenght len filled with val
    function fillArray(value, len) {
      if (len == 0) return [];
      var a = [value];
      while (a.length * 2 <= len) a = a.concat(a);
      if (a.length < len) a = a.concat(a.slice(0, len - a.length));
      return a;
    }

    var total_qnum = trial.pages.reduce(function(a, b) {return a.concat(b);}, []).length;
    
    // reverse_score - Array indicating if question should be reverse scored
    trial.reverse_score = (typeof trial.reverse_score === 'undefined') ? fillArray(false, total_qnum) : trial.reverse_score;

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    var current_page = 0;

    var view_history = [];

    var start_time = (new Date()).getTime();

    var last_page_update_time = start_time;

    //array with arrays for each page to store the responses and lookup at navigation
    var response_data = []
    for(var i = 0; i < trial.pages.length; i++) {
      response_data.push([]);
    }

    var wentBack = false;

    function show_current_page() {
      
      var questions = trial.pages[current_page]
      // ADD ALL THE HTML CODE GENERATION HERE
      // form element
    var trial_form_id = _join(plugin_id_name, "form");
    display_element.append($('<form>', {
      "id": trial_form_id
    }));
    var $trial_form = $("#" + trial_form_id);

    // show preamble text
    var preamble_id_name = _join(plugin_id_name, 'preamble');
    $trial_form.append($('<div>', {
      "id": preamble_id_name,
      "class": preamble_id_name
    }));
    $('#' + preamble_id_name).html(trial.preamble);

    // add multiple-choice questions
    // for (var i = 0; i < trial.questions.length; i++) {
    for (var i = 0; i < trial.pages[current_page].length; i++) {
      // create question container
      var question_classes = [_join(plugin_id_name, 'question')];
      if (trial.horizontal) {
        question_classes.push(_join(plugin_id_name, 'horizontal'));
      }

      $trial_form.append($('<div>', {
        "id": _join(plugin_id_name, i),
        "class": question_classes.join(' ')
      }));

      var question_selector = _join(plugin_id_selector, i);

      // add question text
      $(question_selector).append(
        '<p class="' + plugin_id_name + '-text survey-multi-choice">' + trial.pages[current_page][i] + '</p>'
      );

      // create option radio buttons
      for (var j = 0; j < trial.options[current_page][i].length; j++) {
        var option_id_name = _join(plugin_id_name, "option", i, j),
          option_id_selector = '#' + option_id_name;

        // add radio button container
        $(question_selector).append($('<div>', {
          "id": option_id_name,
          "class": _join(plugin_id_name, 'option')
        }));

        // add label and question text
        var option_label = '<label class="' + plugin_id_name + '-text">' + trial.options[current_page][i][j] + '</label>';
        $(option_id_selector).append(option_label);

        // create radio button
        var input_id_name = _join(plugin_id_name, 'response', i);
        $(option_id_selector + " label").prepend('<input type="radio" name="' + input_id_name + '" value="' + trial.options[current_page][i][j] + '">');
      }

      if (trial.required && trial.required[current_page][i]) {
        // add "question required" asterisk
        $(question_selector + " p").append("<span class='required'>*</span>")

        // add required property
        $(question_selector + " input:radio").prop("required", true);
      }
    }


      // ADD NAVIGATION BUTTONS
      if (trial.show_clickable_nav) {

        var nav_html = "<div class='jspsych-survey-multi-choice-nav'>";
        
        // add back button if the current page is not 0 and going back is allowed in the parameters
        if (current_page != 0 && trial.allow_backward) {
          nav_html += "<button id='jspsych-survey-multi-choice-back' class='jspsych-btn'>&lt; Previous</button>";
        }

        // add forward button
        nav_html += "<button id='jspsych-survey-multi-choice-next' class='jspsych-btn'>Next &gt;</button></div>"

        // add html for button to the page
        display_element.append(nav_html);

        //SPECIFY SURVEY NAVIGATION BUTTON FUNCTIONS
        //Back button:
        if (current_page != 0 && trial.allow_backward) {
          $('#jspsych-survey-multi-choice-back').on('click', function() {
            clear_button_handlers();
            back();
          });
        }

        //Next button:
        $('#jspsych-survey-multi-choice-next').on('click', function() {
          clear_button_handlers();
          next();
        });

      }
    }

    function clear_button_handlers() {
      $('#jspsych-instructions-next').off('click');
      $('#jspsych-instructions-back').off('click');
    }

    function next() {

      add_current_page_to_view_history()

      //submit_page_data();
      //DON'T SUBMIT IT BUT UPDATE THE RESPONSE_DATA ARRAY
      update_page_data();

      current_page++;

      // if done, finish up...
      if (current_page >= trial.pages.length) { 

        submit_page_data();

        endTrial();
      } else {

        display_element.html('')

        show_current_page();
      }

    }

    function update_page_data(){
      if (wentBack){
        //REPLACE THE CURRENT RESPONSES  IN RESPONSE_DATA INSTEAD OF PUSHING
        for (var i = 0; i < trial.pages[current_page].length; i++){
          response_data[current_page][i] = $("#"+plugin_id_name+"-"+i).find("input:radio:checked").val();
        }
        wentBack = false;
      }

      else {
      //push to array with all responses
        $("div." + plugin_id_name + "-question").each(function(index) {
          var val = $(this).find("input:radio:checked").val();
          response_data[current_page].push(val);
        });
      }
    }

    function submit_page_data(){

      // DOUBLE LOOP TO SUBMIT AFTER DONE WITH SURVEY INSTEAD OF EACH PAGE 
      //loop to submit each question data on separate row
      for (var i = 0; i < trial.pages.length; i++){
        for (var j = 0; j < trial.pages[i].length; j++){
          jsPsych.data.write({
            "rt": getPageViewTime(view_history,i),
            "qnum": j+1,
            "page_num": i+1,
            "stim_question": trial.pages[i][j],
            "stim_response": response_data[i][j],
            "num_response": getNumResponse(response_data[i][j], trial.scale),
            "score_response": getScoreResponse(response_data[i][j], trial.scale, j, trial.reverse_score, trial.options[i][j]),
            "response_range": getRange(trial.options[i][j]),
            "times_viewed": getTimesViewed(view_history,i)
          })
        }
      }


      display_element.html('');

      wentBack = false;
    }

    function getTimesViewed(view_history_obj_array, page_index){

      var page_view_objects = view_history_obj_array.filter(function( obj ) {
        return obj.page_index == page_index;
      });

      return page_view_objects.length
    }

    function getPageViewTime(view_history_obj_array, page_index){

      var page_view_objects = view_history_obj_array.filter(function( obj ) {
        return obj.page_index == page_index;
      });

      var page_view_time = [];

      page_view_objects.map(function (obj){
        page_view_time.push(obj.viewing_time);
      })

      var total_page_view_time = page_view_time.reduce(function(a, b) {
        return a + b;
      });

      return total_page_view_time;

    };

    function getRange(question_option_array){
      range = [1, question_option_array.length];
      return range
    }

    function getNumResponse(text_response, scale){
      return scale[text_response]
    }

    function getScoreResponse(text_response, scale, index, reverse_score_array, option_array){
      var num_response = getNumResponse(text_response, scale)
      if (reverse_score_array[index]){
        score_response = (option_array.length + 1) - num_response;
        return score_response;
      }
      return num_response
    }

    function back() {

      wentBack = true;

      add_current_page_to_view_history()

      current_page--;

      display_element.html('')

      //Can't just load page blank. Need to load with previous answers
      //So load page
      show_current_page();

      // get the names of all the options in each question block (option names for each block is the same so the participant can only select one option)
      var option_names = [];
      $("div." + plugin_id_name + "-question").each(function(index) {
        if (option_names.indexOf($(this).find("input:radio").attr("name")) < 0) {
            option_names.push($(this).find("input:radio").attr("name"));
        }
    });

      //each option name ends with a number indicating the question number. split the texts to get the question number index to use in the loop
      option_numbers = option_names.map(function(str){
        tmp = str.split("-")
        return parseInt(tmp[tmp.length - 1])
      })

      //loop through each question number, 
      for (var i = 0; i < option_numbers.length; i++){
        var current_qnum = option_numbers[i]
        //get the previously selected value for that question stored in response_data
        var val = response_data[current_page][current_qnum]
        //check the option for each question with the matching value
        $("#"+plugin_id_name+"-"+current_qnum).find("input:radio[value='" + val + "']").prop("checked", true) 
      }

    }

    function add_current_page_to_view_history() {

      var current_time = (new Date()).getTime();

      var page_view_time = current_time - last_page_update_time;

      view_history.push({
        page_index: current_page,
        viewing_time: page_view_time
      });

      last_page_update_time = current_time;
    }

    function endTrial() {

      //submit_page_data();

      display_element.html('');

      //check if you need to keep this
      var trial_data = {
        "view_history": JSON.stringify(view_history),
        "rt": (new Date()).getTime() - start_time
      };

      jsPsych.finishTrial(trial_data);
    } 

    show_current_page();
  
  };

  return plugin;
})();
