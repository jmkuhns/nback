//  Participants will complete a standard 2-Back working memory updating task (Vaughan et al., 2008). They will view a series of digits (500ms each) and respond (within a 2500ms ITI) when the item matches that 2 trials prior, with targets as 25% of trials. Reaction time and accuracy will be recorded.

// sequence of digits, one at a time, required to press a digit on the screen regarding whether the digit on screen was identical to the digit presented N positions back in the sequence. Single digits: white, 6 mm tall. Shown in center of a black computer screen. The first N digits were presented at a rate of 2000ms. Beginning with the presentation of the (N+1th) digit, participants pressed either of two keys to indcate the answer, and the presentation was self-paced. The / key labed "yes" is a match, the z key is a no and indicates a mismatch.
// Each stimulus set (a 'trial') contained a total of 20 response items. A total of 11 trials (220 RTs total) were presented for each value of N, with N varying from 1 to 4. So IThink we're only doing up to 2 back??
//After each trial, participant receives feedback on on accuracy and mean RT
// OK, so the Nback described in the grant is not actually the Nback in the Vaughn task...I think that the nback is from the kane labe, where this task is set-up for mind wandering. 25% hits is low for something like this........................

/* ************************************ */
/* Define helper functions */
/* ************************************ */


/* experiment parameters */
// var reps_per_trial_type = 4;

/*set up welcome block*/
/*var welcome = {
  type: "html-keyboard-response",
  stimulus: "Welcome to the experiment. Press any key to begin."
}; */


//Calculates whether the last trial was correct and records the accuracy in data object
var record_acc = function() {
	var global_trial = jsPsych.progress().current_trial_global
	var stim = jsPsych.data.getData()[global_trial].stim.toLowerCase()
	var target = jsPsych.data.getData()[global_trial].target.toLowerCase()
	var key = jsPsych.data.getData()[global_trial].key_press
	if (stim == target && key == 37) {
		correct = true
	} else if (stim != target && key == 40) {
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


var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

var randomDraw = function(lst) {
	var index = Math.floor(Math.random() * (lst.length))
	return lst[index]
}


/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var current_trial = 0
var letters = '0123456789'
var num_blocks = 2 //of each delay
var num_trials = 20
var num_practice_trials = 25
var delays = jsPsych.randomization.shuffle([1, 2, 3])
var control_before = Math.round(Math.random()) //0 control comes before test, 1, after
var stims = [] //hold stims per block

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

var feedback_instruct_text =
	'Welcome to the experiment. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction"
	},
	cont_key: [13],
	text: getInstructFeedback,
	timing_post_trial: 0,
	timing_response: 180000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
	type: 'poldrack-instructions',
	data: {
		trial_id: "instruction"
	},
	pages: [
		'<div class = centerbox><p class = block-text>In this experiment you will see a sequence of numbers presented one at a time. Your job is to respond by pressing the <strong>left arrow key</strong>when the number matches the same number that occurred either 2 trials before, otherwise you should press the <strong>right arrow key</strong>. For instance, if you saw the sequence 5...3...2...2...7...8...1...8, you would press the left arrow key on the last "8" and the right arrow key for every other number.</p><p class = block-text>We will have you practice  </p></div>',
/*    Your job is to respond by pressing the <strong>left arrow key</strong> when the letter matches the same letter that occured either 1, 2 or 3 trials before, otherwise you should press the <strong>down arrow key</strong>. The letters will be both lower and upper case. You should ignore the case (so "t" matches "T")</p><p class = block-text>The specific delay you should pay attention to will differ between blocks of trials, and you will be told the delay before starting a trial block.</p><p class = block-text>For instance, if the delay is 2, you are supposed to press the left arrow key when the current letter matches the letter that occured 2 trials ago. If you saw the sequence: g...G...v...T...b...t...b, you would press the left arrow key on the last "t" and the last "b" and the down arrow key for every other letter.</p><p class = block-text>On one block of trials there will be no delay. On this block you will be instructed to press the left arrow key to the presentation of a specific letter on that trial. For instance, the specific letter may be "t", in which case you would press the left arrow key to "t" or "T".</p></div>' ,*/
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
};

var instruction_node = {
	timeline: [feedback_instruct_block, instructions_block],
	/* This function defines stopping criteria */
	loop_function: function(data) {
		for (i = 0; i < data.length; i++) {
			if ((data[i].trial_type == 'poldrack-instructions') && (data[i].rt != -1)) {
				rt = data[i].rt
				sumInstructTime = sumInstructTime + rt
			}
		}
		if (sumInstructTime <= instructTimeThresh * 1000) {
			feedback_instruct_text =
				'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <strong>enter</strong> to continue.'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = 'Done with instructions. Press <strong>enter</strong> to continue.'
			return false
		}
	}
}

var end_block = {
	type: 'poldrack-text',
	timing_response: 180000,
	data: {
		trial_id: "end",
		exp_id: 'n_back'
	},
	text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_post_trial: 0
};
