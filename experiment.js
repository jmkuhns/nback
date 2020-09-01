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
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */

// task specific variables
var current_trial = 0;
var numbers = '0123456789';
var num_blocks = 6;
var num_trials = 20;
var num_practice_trials = 20;
var stims = []; //hold stims per block
var init = jsPsych.randomization.sampleWithoutReplacement(numbers, 4);
/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
/*define static blocks */
var welcome = {
  type: "html-keyboard-response",
  stimulus: 'Welcome to the experiment. Press any key to begin.' +
	'<p>'+ init + '</p>'
};

/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
	type: "html-keyboard-response",

	stimulus:	'<p>In this experiment you will see a sequence of numbers presented one at a time. Your job is to respond by pressing the <strong>left arrow key</strong> when the number matches the same number that occured 2 trials before, otherwise you should press the <strong>right arrow key</strong>.</p><p>You are supposed to press the left arrow key when the current number matches the number that occured 2 trials ago. If you saw the sequence: 4...0...1...3...4...5...6...5, you would press the left arrow key on the last 5 the right arrow key for every other number.</p><br><p>Press any key to continue</p>',
	data: {
		trial_id: "instruction"
	},
	post_trial_gap: 1000
};


var start_practice_block = {
	type: "html-keyboard-response",
	text: '<p>Starting practice.<br>During practice, you should press the left arrow key when the current number matches the number that appeared 2 trials before. Otherwise press the right arrow key</p><p>You will receive feedback about whether you were correct or not during practice. There will be no feedback during the main experiment. Press any key to begin.</p>',
	data: {
		trial_id: "instruction"
	},
	post_trial_gap: 1000
}


//Setup 2-back practice
var timeline = [];
timeline.push(welcome, instructions_block);
timeline.push(start_practice_block);
for (var i = 0; i < (num_practice_trials); i++) {
	var stim = randomDraw(numbers);
	stims.push(stim);
	if (i >= 2) {
		target = stims[i - 2];
	}
	if (stim == target) {
		correct_response = 37;
	} else {
		correct_response = 39;
	}
	var practice_block = {
		type: 'html-keyboard-response',
		stimulus: jsPsych.timelineVariable('stim'),
		key_answer: correct_response,
		data: {
			trial_id: "stim",
			exp_stage: "practice",
			stim: stim,
			target: target
		},
		correct_text: '<p style="color:green;font-size:60px";>Correct!</p>',
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

var first_two = jsPsych.randomization.sampleWithoutReplacement(numbers, 2)


for (var b = 0; b < num_blocks; b++) {
		var target = '';
		stims = [first_two];
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
