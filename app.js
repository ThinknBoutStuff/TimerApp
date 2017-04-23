/*

    Beta Version!

    Basic Interval Timer - have fun!

*/

(function () {
    var app = {
        mode: "edit",
        current: null,
        stages: [],
        counter: 0,
        timeInfo: {},
        sec: null,
        min: null,
        timeout: null,
        template: document.querySelector(".stageTemplate"),
        container: document.getElementById('main'),
        modeBut: document.getElementById('modeBut'),
        button: document.getElementById('button'),
        stageBGColor: '#a1a2b7',
        doneColor: '#b52d2d',
        beep: document.getElementById('beep'),
        bloop: document.getElementById('bloop'),
        phrases: ["brehhh", "brah.", "Brosef!", "Forget something?", "Try Again.",
         "dude?", "wut.", "Soooo....", "[Insert Here]", "Dang it!!", "Just. No.",
         "Name Me Please...", "Meowwww", "Secret Brew Recipe"]
    }

    // Random Phrase Chooser helper function
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }

    // Button has different functionality depending on mode
    document.getElementById('button').addEventListener('click', function() {
        // console.log("Current Mode: " + app.mode);
        if (app.mode === "edit") {
            addStage();
            viewElement(app.button);
        } else if (app.mode === "pause") {
            play(app.current);
        } else if (app.mode === "stop") {
            play();
        } else if (app.mode === "play") {
            pause();
        }
    });

    modeBut.addEventListener('click', modeTog, false);

    // Toggle to and from EDIT
    function modeTog() {
        // console.log("Current Mode: " + app.mode)
        if (app.mode === "stop" ) {
            editTransition();
            app.mode = "edit";
            app.modeBut.innerHTML = "EDIT STAGES";
        } else if (app.mode === "edit") {
            timerModeTransition();
            app.mode = "stop";
            app.modeBut.innerHTML = "TIMER";
        } else if (app.mode === "pause") {
            reset();
            app.mode = "stop";
            app.modeBut.innerHTML = "TIMER";
        }
    }

    // Disables Input Editing and instance saves settings
    function timerModeTransition() {

        // Clear previous save and stages array
        for(var saved in app.timeInfo) {
            delete app.timeInfo[saved];
        }

        app.stages.length = 0;
        // Save new values, disable inputs
        var nameInput = document.querySelectorAll('.stageName');
        var delButs = document.querySelectorAll('.delBut');
        var sec;
        var min;
        for (i = 1; i < nameInput.length; i++) {
            var timeInput = nameInput[i].parentElement.querySelectorAll('.Nums');
            for (j = 0; j < timeInput.length; j++) {
                var time = timeInput[j].value;
                if (timeInput[j].classList[0] === 'seconds') {
                    timeInput[j].value = time;
                    sec = time;
                } else {
                    timeInput[j].value = time;
                    min = time;
                }
                timeInput[j].setAttribute('disabled', 'disabled');
                timeInput[j].onfocus = null;
                timeInput[j].onblur = null;
            }
            app.stages.push(nameInput[i]);
            if(nameInput[i].value in app.timeInfo) {
                nameInput[i].value = nameInput[i].value + " " + app.stages.length;
            }
            app.timeInfo[nameInput[i].value] = {
                seconds: sec,
                minutes: min
            }
            nameInput[i].setAttribute('disabled', 'disabled');
            delButs[i].setAttribute('hidden', 'hidden');
        }

        // console.log(app.stages);
        // console.log(app.timeInfo);

        // Change add button to play button
        button.classList.remove("editBut");
        button.classList.add("playBut");
    }

    // Second/Minute Formatting
    function secondsInputFilter(n) {
        n = parseInt(n, 10);
        switch (true) {
            case (n === null):
            case (isNaN(n)):
                return "00";
            case (n < 10):
                return "0" + n;
            case (n >= 60):
                return "59";
            default:
                return n;
        }
    }

    function minInputFilter(n) {
        n = parseInt(n, 10);
        switch (true) {
            case (n === null):
            case (isNaN(n)):
                return "00";
            case (n < 10):
                return "0" + n;
            default:
                return n;
        }
    }

    // Enables input editing
    function editTransition() {
        // TODO: add reset function to the beginning
        var nameInput = document.querySelectorAll('.stageName');
        var timeInput = document.querySelectorAll('.Nums');
        var delButs = document.querySelectorAll('.delBut');
        for (i = 0; i < nameInput.length; i++) {
            nameInput[i].removeAttribute('disabled');
            delButs[i].removeAttribute('hidden');
        }
        for (i = 0; i < timeInput.length; i++) {
            timeInput[i].removeAttribute('disabled');
            timeInput[i].onfocus = function() {this.value = ''};
            timeInput[i].onblur = function() {this.value = minInputFilter(this.value)};
        }
        // Change play button to add button
        button.classList.add("editBut");
        button.classList.remove("playBut");
    }


    // adds new stage and deletion listener
    // TODO Alter addstage to take variables so it can be used to reconstruct
    // Timer stages from a saved cache!
    function addStage() {
        var stage = app.template.cloneNode(true);
        var stageName = "Stage " + (app.stages.length + 1);
        stage.querySelector('.stageName').value = stageName;
        stage.removeAttribute("hidden");
        stage.value = stageName;
        app.stages.push(stage);
        app.container.appendChild(stage);

        var m = stage.querySelector(".minutes");
        var s = stage.querySelector(".seconds");

        // Clear on focus...
        m.onfocus = function() {this.value = ''};
        s.onfocus = function() {this.value = ''};
        m.onblur = function() {this.value = minInputFilter(this.value)};
        s.onblur = function() {this.value = secondsInputFilter(this.value)};
        stage.querySelector('.stageName').onfocus = function() {this.value = ''};
        stage.querySelector('.stageName').onblur = function() {
            if (this.value.length < 1) this.value = app.phrases[getRandomInt(0,app.phrases.length)];
        };
        // Setup Remove Stage Buttons
        stage.querySelector(".delBut").addEventListener('click', function() {
            if (app.mode === "edit") {
                var parent = event.target.parentNode.parentNode;
                // Check if event.target will pick right node to remove
                if (parent.classList.contains("stage")) parent = parent.parentNode;
                removeStage(parent);
            }
        });
    }

    function removeStage(node) {
        node.parentNode.removeChild(node);
        app.stages.splice(app.stages.indexOf(node),1);
        //console.log(app.stages);
    }

    function timerStart() {
        var interval = 100;
        var expected = Date.now() + interval;
        var count = 0;
        app.timeout = setTimeout(step, interval);
        function step() {
            var dt = Date.now() - expected;
            if (dt > interval) {
                // TODO: Add stuff in case of 'drift'
                console.log("Warning: Timer Desync");
            }
            expected += interval;

            // Main Timer functions
            count++;
            if (app.sec.value < 11) {
                decrement(0.1);
                count = 0;
            } else if (count > 10) {
                decrement(1);
                count = 0;
            }
            app.timeout = setTimeout(step, Math.max(0, interval - dt));
            // take into account drift
        }
    }

    // Could be cleaned up...
    function decrement(n) {
        var s = parseFloat(app.sec.value, 10) - n;
        var m = parseFloat(app.min.value, 10) - 1;
        if (s === -1) {
            app.current.parentElement.style.background = app.doneColor;
            if (app.counter >= app.stages.length) {
                return pause();
            } else {
                app.counter++;
                updateCurrent(app.stages[app.counter]);
                return decrement(n);
            }
        } else if (s <= 0) {
            app.sec.value = "00";
            if (m < 0) {
                app.counter++;
                if (app.counter === app.stages.length) {
                    app.current.parentElement.style.background = app.doneColor;
                    app.mode === 'stop';
                    setTimeout(function () {
                        app.beep.currentTime = 0;
                        app.beep.play();
                        setTimeout(function () {
                            app.beep.currentTime = 0.05;
                            app.beep.play();
                        }, 150);
                    }, 150);
                    return pause();
                } else {
                    // Don't play sound on last stage
                    if (app.counter < app.stages.length) {
                        app.bloop.currentTime = 0;
                        app.bloop.play();
                    }
                    app.current.parentElement.style.background = app.doneColor;
                    return updateCurrent(app.stages[app.counter]);
                }
            }
            app.sec.value = 59;
            if (m < 10) {
                app.min.value = "0" + m;
            } else {
                app.min.value = m;
            }
        } else if (s < 10) {
            app.sec.value = s.toFixed(1);
        } else {
            app.sec.value = s;
        }
    }

    function updateCurrent(stage) {
        app.current = stage;
        app.sec = app.current.parentElement.querySelector('.seconds');
        app.min = app.current.parentElement.querySelector('.minutes');
        viewElement(app.current);
    }

    function viewElement(elem, distance=-25) {
        if (app.counter >= app.stages.length - 1) {
            elem = app.button;
            distance = 100;
        }
        elem.scrollIntoView(false);
        window.scrollBy(0, distance);
    }

    function play(stage = app.stages[0]) {
        if (app.counter < app.stages.length) {
            updateCurrent(stage);
            app.mode = 'play'
            // change button to 'pause' graphic
            button.classList.add("pauseBut");
            button.classList.remove("playBut");
            app.modeBut.innerHTML = "RUNNING";
            timerStart();
        };
    }

    function pause() {
        app.mode = 'pause'
        // change button to 'play' graphic
        button.classList.add("playBut");
        button.classList.remove("pauseBut");
        app.modeBut.innerHTML = "RESET";
        clearTimeout(app.timeout);
    }

    function reset() {
        app.modeBut.innerHTML = "RESET";
        app.counter = 0;
        for (var i = 0; i < app.stages.length; i++) {
            app.stages[i].parentElement.style.background = app.stageBGColor;
            var sec = app.stages[i].parentElement.querySelector('.seconds');
            var min = app.stages[i].parentElement.querySelector('.minutes');
            var name = app.stages[i].value;
            sec.value = app.timeInfo[name].seconds;
            min.value = app.timeInfo[name].minutes;
        }
    }

}) ();
