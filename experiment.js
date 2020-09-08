/*
reference: http://www.sciencedirect.com/science/article/pii/S1053811905001424
Cognitive control and brain resources in major depression: An fMRI study using the n-back task Harvey at al. 2005
This task differs in that the subject only has to respond on target trials, rather than indicating whether the current trial is
a match or not
*/

//Calculates whether the last trial was correct and records the accuracy in data object


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
var num_blocks = 7;
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
			numbers.splice(i, 1);
			stims_prac[i] = randomDraw(numbers);
			var numbers = [1,2,3,4,5,6,7,8,9];
		}
	}
}
var correct_responses = [];
for (i = 0; i < success_prac_init.length; i++){
	if (success_prac_init[i] == 1){
		correct_responses.push(37);
	} else {
		correct_responses.push(39);
	}
}

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
	'<p>In this experiment you will see a sequence of numbers presented one at a time. Your job is to respond by pressing the <strong>left arrow key</strong> when the number matches the same number that occured 2 trials before, otherwise you should press the <strong>right arrow key</strong>.</p><p>You are supposed to press the left arrow key when the current number matches the number that occured 2 trials ago. If you saw the sequence: 4...0...1...3...4...5...6...5, you would press the left arrow key on the last 5, and the right arrow key for every other number.</p><br><p>Press any key to continue</p>',
	data: {
		trial_id: "instruction"
	},
	post_trial_gap: 1000
};


var start_practice_block = {
	type: "html-keyboard-response",
	stimulus:
	'<p>Starting practice.<br>During practice, you should press the left arrow key when the current number matches the number that appeared 2 trials before. Otherwise press the right arrow key. This means that for the first two trials, you should press the right arrow key, because there are no numbers 2 trials before.</p><p>You will receive feedback about whether you were correct or not during practice. There will be no feedback during the main experiment. Press any key to begin.<br></p>',
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

timeline.push(welcome);
timeline.push(instructions_block);
timeline.push(start_practice_block);

/*
for (var i = 0; i < (num_practice_trials); i++) {
	if (success_prac_init[i] == 1){
		target = stims_prac[i-2];
		//correct_response = 37;
	} else {
		target = stims_prac[i];
		//correct_response = 39;
	}
	var stim = stims_prac[i];
	var correct_response = correct_responses[i];


	var practice_block = {
		type: 'html-keyboard-response',
		stimulus: '<p style="font-size:60px";>' +stim +'</p>',
		data: {
			trial_id: "stim",
			exp_stage: "practice",
			stim: stims_prac,
			target: target,
			corr_resp: correct_response
		},
		choices: [37,39],
		stimulus_duration: 500,
		trial_duration: 3000,
		response_ends_trial: false,
		on_finish: function(data){
			if (data.key_press == data.corr_resp){
				data.accuracy = 1;

			}else {
					data.accuracy = 0;
				}




	};

	var feedback = {
		  type: 'html-keyboard-response',
			trial_id: "feedback",
		  stimulus: function(){
		    var last_trial_correct = jsPsych.data.get().last(1).values()[0].accuracy;
		    if(last_trial_correct == 1){
		      return '<p style="color:green;font-size:60px";>Correct!</p>';
		    } else {
		      return '<p style="color:red;font-size:60px";>incorrect.</p>';
		    }
		  },
			trial_duration: 500,
			post_trial_gap: 30
		};
	timeline.push(practice_block, feedback);
}
*/
//Set up experiment
//var n_back_experiment = [];

//n_back_experiment = n_back_experiment.concat(practice_trials);
var test_brief = {
	type: "html-keyboard-response",
	data: "instr",
	stimulus: '<p>You have now completed the practice trials. The experiment will consist of 6 blocks of 20 trials each. Press any key to begin block 1.</p>'
};
timeline.push(test_brief);
var num_blocks = 7;
var b = 1;
while (b < num_blocks){
		var test_inter = {
			type: "html-keyboard-response",
			data: "instr",
			stimulus: '<p>You have now completed block ' + b + '. Press any key to continue.</p>'
		}


	var numbers = [1,2,3,4,5,6,7,8,9];
	var num_trials = 20;
	var stims = []; //hold stims per block
	var success_test = [0,0];
	var success = [];

	for (var n = 0; n <= 17; n++) {
				if(n <8) {
			success.push(0)
	} else success.push(1)
	}

	var success_draws = jsPsych.randomization.repeat(success, 1);

	success_test = success_test.concat(success_draws);


	for (var m  = 0; m < num_trials; m++){
		stims.push(randomDraw(numbers));
	}

	for (var l = 2; l <= stims.length; l++){
		if (success_test[l] == 1) {
			stims[l] = stims[l-2];
		}
	}

	for (var k = 2; k <= stims.length; k++) {
		if (success_test[k] == 0){
			if( stims[k] == stims[k-2]){
				numbers.splice(k, 1);
				stims[k] = randomDraw(numbers);
				var numbers = [1,2,3,4,5,6,7,8,9];
			}
		}
	}

var correct_responses = [];
	for (j = 0; j < success_test.length; j++){
				if (success_test[j] == 1){
					correct_responses.push(37);
				} else {
					correct_responses.push(39);
				}
	}


	for (var i = 0; i < num_trials; i++) {
			if (success_test[i] == 1){
			target = stims[i-2];
			//correct_response = 37;
			} else {
			target = stims[i];
			//correct_response = 39;
			}
			var stim = stims[i];
			var correct_response = correct_responses[i];

			var test_block = {
			type: 'html-keyboard-response',
			stimulus: '<p style="font-size:60px";>' + 'i: ' + i + '  '+ stim +'b: '+ b + ' </p>',
			data: {
				trial_id: "stim",
				exp_stage: "test",
				stim: stim,
				target: target
			},
			choices: [37,39],
			stimulus_duration: 500,
			trial_duration: 3000,
			response_ends_trial: false,
			on_finish: function(data){

					if (data.key_press == data.corr_resp){
						data.accuracy = 1;

					}else {
							data.accuracy = 0;
						}

			}
		}
		timeline.push(test_block);
	}
timeline.push(test_inter);
b++;
}


var debrief = {
  type: "html-keyboard-response",
	stimulus: "<p>Press any key to complete the experiment. Thank you!</p>"
};

timeline.push(debrief);
