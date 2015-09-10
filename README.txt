All experiments are run through the "exp_hub.html".
The list of experiments are defined and loaded by "load_experiments.js"

General points when making experiments:
-Each experiment should end with an X_experiment jspsych array.
-Each trial of each experiment should be tagged with a "exp_id" indicating the experiment it belongs to.
-More general identification (like "fixation") should be defined in "trial_id" if need be. Generally only used for 
 when more detailed descriptors aren't applicable (like condition, direction, etc.). Best practice to include it regardless.
-Have generally tried to use 'condition' generically. This will make the data output simpler, but means that you have to know
 what condition means in the context of the experiment.
 
 
 For easy reading, set up each experiment in this way:
 /* ************************************ */
/* Define helper functions */
/* ************************************ */



/* ************************************ */
/* Define experimental variables */
/* ************************************ */



/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */