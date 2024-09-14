#Kairos

## Overview
Kairos is the miniapp that handles non-linear, long term and natural time in Moira Lifemap. It's composed of several fundamental primitives which each add an additional aspect of non-linear time to Kairos.

## Temporal Estimates

Temporal estimates refer to the ability to pre-ration a select amount of time on a task. When this task is started in real life, the user presses the play button on the temporal estimate to indicate they are doing it. When the task is complete or the user has to stop, they press stop. The purpose of this is to make explicit how much time a user has spent on a task, and also to focus their attention on one thing. For example, in the case of a user pre-planning to spend 20 minutes on answering emails, they would put a temporal estimate of 20 minutes beside the task. When they start checking their emails, they press play on the temporal estimate. It will automatically stop after 20 minutes, and a ding! will sound, much like in the PomodoroTimer. If they have to stop prematurely, they can press the stop button, and then it will show a time block that reflects the time between which they started and ended. If they have to work more than the required pre-estimated time, they can just press start again and it will create another time block that runs for another one of the pre-planned durations. After which it is elapsed, it will stop again, and so on and so forth.

The temporal estimate is an inline component, meaning that it can be inserted inline.