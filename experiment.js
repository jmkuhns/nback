/*
reference: http://www.sciencedirect.com/science/article/pii/S1053811905001424
Cognitive control and brain resources in major depression: An fMRI study using the n-back task Harvey at al. 2005
This task differs in that the subject only has to respond on target trials, rather than indicating whether the current trial is
a match or not
*/

//Calculates whether the last trial was correct and records the accuracy in data object
var record_acc = function() {
	var global_trial = jsPsych.progress().current_trial_global
	var stim = jsPsych.data.getData()[global_trial].stim
	var target = jsPsych.data.getData()[global_trial].target
	var key = jsPsych.data.getData()[global_trial].key_press
	if (stim == target && key == 37) {
		correct = true
	} else if (stim != target && key == 39) {
		correct = true
	} else {
		correct = false
	}
	jsPsych.data.addDataToLastTrial({
		correct: correct,
		trial_num: current_trial
	})
	current_trial = current_trial + 1
}

var randomDraw = function(lst) {
	var index = Math.floor(Math.random() * (lst.length))
	return lst[index]
} // draws one number

/* ************************************ */
/* Define experimental variables */
/* ************************************ */

var timeline = [];
// task specific variables
var current_trial = 0;
var numbers = [1,2,3,4,5,6,7,8,9];
var success = [0,1];
var num_blocks = 6;
var num_trials = 20;
var num_practice_trials = 20;
var stims = []; //hold stims per block
//var init = randomDraw(numbers);
var success_test = [0,0];
var success_prac = [];
var success_prac_init = [0,0];

//27 for later
for (var i = 0; i <= 17; i++) {
	    if(i <8) {
    success_prac.push(0)
} else success_prac.push(1)
}

var success_prac_25 = [];
var success_prac_init_25 = [0, 0];
for (var i = 0; i <= 17; i++) {
			if(i < 13){
				success_prac_25.push(0)
			} else success_prac_25.push(1)

}


var success_prac_draws = jsPsych.randomization.repeat(success_prac, 1);
//
var success_prac_draws_25 = jsPsych.randomization.repeat(success_prac_25, 1);


success_prac_init = success_prac_init.concat(success_prac_draws);

//success_prac_init_25 = success_prac_init_25.concat(success_prac_draws_25);

var stims_prac = [];
//var stims_prac_25 = [];

for (var i  = 0; i < num_practice_trials; i++){
	stims_prac.push(randomDraw(numbers));
}
//for (var i  = 0; i < num_practice_trials; i++){
//	stims_prac_25.push(randomDraw(numbers));
//}

for (var i = 2; i <= stims_prac.length; i++){
	if (success_prac_init[i] == 1) {
		stims_prac[i] = stims_prac[i-2];
	}
}

for (var i = 2; i <= stims_prac.length; i++) {
	if (success_prac_init[i] == 0){
		if( stims_prac[i] == stims_prac[i-2]){
			var x = numbers.indexOf(stims_prac[i]);
			var numb_minus = numbers.splice(x,1);
			stims_prac[i] = randomDraw(numb_minus);
		}
	}
}

//for (var i = 2; i <= stims_prac_25.length; i++) {
//		if (success_prac_init_25[i] == 1) {
//			stims_prac_25[i] = stims_prac_25[i-2];
//		}
//}

/*for (var i = 0; i < num_practice_trials; i++){
	if (i < 2){
		var stim = randomDraw(numbers);
		stims_prac.push(stim);
	} else if( success_prac_init[i] == 1){
		var stim = stims_prac[i-2]
		stims_prac.push(stim)
	} else{
		var stim = randomDraw(numbers);
		stims_prac.push(stim);
	}
}
*/

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
/*define static blocks */
var welcome = {
  type: "html-keyboard-response",
  stimulus: '<p>Welcome to the experiment. Press any key to begin.</p>'
};

/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
	type: "html-keyboard-response",

	stimulus:
	'<p>In this experiment you will see a sequence of numbers presented one at a time. Your job is to respond by pressing the <strong>left arrow key</strong> when the number matches the same number that occured 2 trials before, otherwise you should press the <strong>right arrow key</strong>.</p><p>You are supposed to press the left arrow key when the current number matches the number that occured 2 trials ago. If you saw the sequence: 4...0...1...3...4...5...6...5, you would press the left arrow key on the last 5 the right arrow key for every other number.</p><br><p>Press any key to continue</p>',
	data: {
		trial_id: "instruction"
	},
	post_trial_gap: 1000
};


var start_practice_block = {
	type: "html-keyboard-response",
	stimulus:
	'<p>Starting practice.<br>During practice, you should press the left arrow key when the current number matches the number that appeared 2 trials before. Otherwise press the right arrow key.</p><p>You will receive feedback about whether you were correct or not during practice. There will be no feedback during the main experiment. Press any key to begin.<br>' + stims_prac	+	'<br>' +
	success_prac_init +
	'<br>confirmation</p>',
	data: {
		trial_id: "instruction"
	},
	post_trial_gap: 1000
}

/*var matt_time = {
	type: "html-keyboard-response",
	stimulus: '<p> Half of the trials match the stimulus N back (2 back). <br>A random sequence of digits that would be chosen anew on each block for each participant will be shown below. Below that sequence is a sequence of 0s and 1s, where a 1 indicates that the element in that sequence matches the element 2 back, and a 0 indicates otherwise. Because of randomization, occasionally a 0 will match the element 2 back, but I am working on a fix for that.<br>' +
	stims_prac	+	'<br>' +
	success_prac_init +
	'<br></p><p>25% below<br>'+
	stims_prac_25	+	'<br>' +
	success_prac_init_25 +
	'<br>Reload page to get a sense of how the sequences will go.</p>',
	choices: jsPsych.NO_KEYS
}
*/

//Setup 2-back practice

// timeline.push(matt_time);

/* temporarily commenting the rest out.
timeline.push(welcome);
timeline.push(instructions_block);
timeline.push(start_practice_block);

for (var i = 0; i < (num_practice_trials); i++) {




	if (i < 2) {
	var stim = randomDraw(numbers);
	stims.push(stim);
	} else if (i >= 2) {
			if (success_prac_init[i] == 1){
				var stim = stims[i-2];
				target = stims[i-2];
			} else{
				var stim = randomDraw(numbers);
				stims.push(stim);
				target = stims[i - 2];
			}
	}
	if (stim == target) {
		correct_response = 37;
	} else {
		correct_response = 39;
	}
	var practice_block = {
		type: 'html-keyboard-response',
		stimulus: jsPsych.timelineVariable('stims_prac'),
		key_answer: correct_response,
		data: {
			trial_id: "stim",
			exp_stage: "practice",
			stim: stims_prac,
			target: target
		},
		timeline_variables: stims_prac,
		// /* correct_text: '<p style="color:green;font-size:60px";>Correct!</p>',
		incorrect_text: '<p style="color:red;font-size:60px";>Incorrect</p>',
		timeout_message: '<p style="font-size:60px";>Respond Faster!</p>',
		timing_feedback_duration: 500,
		show_stim_with_feedback: false,
		choices: [37,39],
		timing_stim: 500,
		timing_response: 2500,
		timing_post_trial: 500
	};
	timeline.push(practice_block);
}

//Set up experiment
//var n_back_experiment = [];

//n_back_experiment = n_back_experiment.concat(practice_trials);

var delay = 2;

var first_two = jsPsych.randomization.sampleWithoutReplacement(numbers, 2);


for (var b = 0; b < num_blocks; b++) {
		var target = '';
		stims = [];
		for (var i = 0; i < num_trials; i++) {
			var stim = randomDraw(numbers);
			stims.push(stim);
			if (i >= delay) {
				target = stims[i - delay];
			}
			var test_block = {
				type: 'html-keyboard-response',
				stimulus: jsPsych.timelineVariable('stim'),
				data: {
					trial_id: "stim",
					exp_stage: "test",
					load: delay,
					stim: stim,
					target: target
				},
				choices: [37,39],
				timing_stim: 500,
				timing_response: 2500,
				timing_post_trial: 0,
				on_finish: record_acc
			};
			timeline.push(test_block);
		}
}
var debrief = {
  type: "html-keyboard-response",
	stimulus: "<p>Press any key to complete the experiment. Thank you!</p>"
};

timeline.push(debrief);
*/
