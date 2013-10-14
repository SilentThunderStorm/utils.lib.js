utils.lib.js
============

A JavaScript utilities Library

timer ->

----------------------------------------------------------------------------------------------------------------

Overview:

Timer is an attempt at increased responsiveness, accuracy, and flexibility from JavaScript timers.

The traditional JavaScript timers, setInterval and setTimeout are generally unreliable timekeepers, often
allowing as much as 200 milliseconds to go by before triggering, depending upon script load.  In cases
where a script has a lot going on (for example, in cases of heavy graphics use, or animations) the script
generally requires MORE timer sensitivity, not less.

In addition, setInterval and setTimeout allow only a single callback for completion of the timer, and can
only be stopped or cleared by destroying any reference to the timer, whereupon they are garbage collected.

This timer hooks itself into the requestAnimationFrame callback, which allows it to be accurately responsive
within 17 or 18 milliseconds. This *IS* dependant on the screen draw rate, but JavaScript will do everything
in its power to retain 60 frames per second, which is where this number is derived.

This also allows the timer to be graphics friendly, as each time it is active is during a redraw event. This,
in turn means that it may be used for updating graphic objects without causing an additional redraw, thereby
preserving script performance.

In addition, this timer is able to be paused and continued while retaining an accurate count of the time 
elapsed.

It is also able to callback functions when started, paused, restarted, aborted, reset, or, of course, when 
it finishes.

----------------------------------------------------------------------------------------------------------------

Usage:

    var a = new timer( duration, callbacks, options );
or  var a = timer( duration, callbacks, timer );

Only two parameters are required, a duration and a callback used for timer completion.

Duration should be listed as the required number of milliseconds for the timer to run to completion. In the case
of a repeated timer (like a setInterval), then this will be the number of elapsed milliseconds before the timer
repeats.

Both the 'callbacks' and 'options' parameters expect an object, with appropriate values stored in specific properties.

It is usually easiest to cast these as object literals, thus:

    a = timer
    (
        10000,
        {
            onstart:function(){console.log("starting countdown...")},
            onfinish:function(){console.log("countdown finished... BOOM!")},
            onprogress:function(value){console.log("currently " + (value*100) + "% complete")}
        },
        {
            continuous:false
        }
    );

Callbacks: 

    onfinish (required) ~ onfinish will be called once the timer has completed its countdown. In the case of a repeated timer,
                            this callback will fire every time the countdown finishes.
                            
    onstart (optional) ~ onstart will fire whenever the timer is told to start. In the case of a timer which has been paused,
                            onstart will fire when it is restarted. This callback will pass a single parameter to the callback,
                            if the timer is starting fresh, it will send a string with the value "Starting", while if it is
                            restarting a paused timer, it will pass the string "Restarting".
                            
    onprogress (optional) ~ onprogress will fire EVERY TIME the timer updates itself, this will be on every screen redraw. It
                            is possible to hook this to draw events, so that objects will always redraw during this period.
                            In effect, this is very similar to requestAnimationFrame, with the exception that this callback
                            passes the percentage of timer completion to the callback function. This may be, for example, an
                            easing function, which would then convert this percent of progress into another value based on 
                            the easing function used.
                            
    onpause (optional) ~ onpause will be fired whenever the timer is paused. This will pass to the callback function a
                            parameter of type number representing the elapsed time ACCORDING TO THE TIMER. This time will not
                            include time spent paused, and will not persist throughout reset or abort events.
    
    onabort (optional) ~ this callback will fire whenever the timer is cancelled. A cancelled timer loses all information about
                            the countdown which was in progress, and the timer will not restart unless it is first reset. This
                            will not pass a parameter to the callback function. If it is crucial to your application to stop the 
                            timer and to receive a callback parameter representing the time at which the timer was stopped, 
                            then you should be calling 'pause' and 'reset' instead.
                            
    onreset (optional) ~ this callback will fire whenever the counter is reset. Resetting the timer WILL NOT STOP the timer, it
                            will simply clear the timers state of progress, in effect starting the timer over. A reset will also
                            be required to restart a timer which has been intentionally aborted. Reset does not pass a parameter 
                            to the callback function. If it is crucial to your application to receive notification of the progress
                            of the timer when it was reset, you may wish to call pause instead, and then reset the timer.
                            
Options:

    continuous (optional) ~ Currently, this is the only enabled option (others will be forthcoming as time presents itself). This 
                            should be set as a Boolean flag set directly as true or false. This CAN use a string, just be aware that 
                            this uses the default typecasting used by JavaScript... in other words, be aware that 'false' evaluates 
                            to true. If this flag is set to be true, then the timer will not stop on completion, but will reset itself 
                            and continue to count down. In effect, setting this flag to true will convert the timer from a setTimeout 
                            style timer into a setInterval style timer. Callbacks, such as onfinish, will continue to fire normally.
                            
                            This parameter is optional, and will default to false if missing.
                            
Properties:

    This timer object also exposes several punblic properties which may be useful.
    
    These properties are currently writable, and writing to many of these properties WILL cause problems with the timers function. The
    next iteration of this timer may include proper GETters and SETters, which will alleviate this flaw, yet is not included in this 
    version to allow the greatest compatability, specifically with Internet Explorer 8 or below. As this browser is currently at 1%
    market saturation, this support will be removed in following versions.
    
    timer.duration ~ The total duration of the timer in milliseconds.
    timer.progress ~ A running percentage, expressed as a float between 0 and 1, indicating the percentage of timer completion.
    timer.status ~ Holds a string representing the current state of the timer, "ready", "running", "paused", or "aborted".
    timer.time ~ A running total of the amount of time that the timer has been running; this does not include time spent paused, and 
                    does not persist through reset or abort calls.
                    
Methods:

    timer.start() ~ Starts the timer when it is ready, restarts the timer when it is paused. Will call the onstart callback, if set.
    timer.pause() ~ Pauses a timer. Calls the onpause callback, if set.
    timer.reset() ~ Resets the current time on the timer to zero, effectively starting it fresh. Does not stop a running timer.
    timer.abort() ~ Stops a timer, and clears its set time. Cannot be restarted by timer.start(), and must be reset to be restarted.
    