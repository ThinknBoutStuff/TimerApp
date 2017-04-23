# TimerApp

Basic Interval Timer written in Javascript. Should work with most Desktop and Mobile Browsers.

Try it out here: http://stevewilcox.co/beta/timerapp/

## Use

The Timer App can create multiple "stage" timers in *Edit Mode* and counts down, starting with the top stage, in *Timer Mode*.

Pressing the button below 'mode' changes the App's current mode and behavior. 

### Edit Mode

The app starts in Edit Mode. 

Here, the user can add stages by pressing the '+' button, and remove stages by pressing the corresponding stage's '-' button.

Each stage has three editable fields: name, minutes, and seconds. Stage names have a 15 character limit. While Minutes can be any two digit positive whole number, if a seconds input is greater than 59, the seconds field will revert to 59.

If the user presses a field and makes no edits, that field will revert to default setting. Minutes/Seconds revert to 00, Stage Names revert to silly phrases.

### Timer Mode

In Timer Mode, the buttom button turns green and functions as a 'play' button. Once the play button is hit, the play button converts into a 'pause' button and the top stage begins counting down, chirping and changing color when the current stage is complete before moving onto counting down the next stage. 

Once the play button is hit, the mode will read 'RUNNING' to indicate the timer is currently counting down. When the pause button is pressed, the mode will read 'RESET'; pressing the reset button will reset all minute and second values to thier defaults (or their last values when leaving edit mode). 

When all stages are complete, the app will beep twice. 



