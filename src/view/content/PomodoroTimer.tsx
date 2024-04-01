import { motion } from "framer-motion"
import { flowMenuStyle } from "../structure/FlowMenu"
import { FlowSwitch, Option } from "../structure/FlowSwitch"
import React from "react"
import IconButton from "@mui/material/IconButton"
import StopIcon from '@mui/icons-material/Stop';
import PlayArrow from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import { AttrPomodoro } from './PomodoroTimerExtension'
import { DateTime } from 'ts-luxon'
import { Tag, TypeTag } from "./Tag"

// These edge cases need to be handled
//
// When I accidently leave the pomodoro running, but I'm not actually working
// And I need to edit it, or delete it

// Possible Pomodoro states
//
// 1. Planned Pomodoro
// start time tag: realised
// end time tag: unrealised
// 2. In Progress Pomodoro
// start time tag: realised
// end time tag: unrealised
// 3. Premature Stop Pomodoro
// start time tag: realised
// end time tag: realised (but sooner than originally planned)
// 4. Complete Pomodoro
// start time tag: realised
// end time tag: realised (as planned)
// original end is overwritten by the realised end.

// Question: If there is dissonance between the planned unrealised time, and the actual realised time, should we record both?
// Or should we simply overwrite the unrealised time with the realised time?

// Possible Pomodoro states
// 1. When this Timer is initially created, there is an empty array
// 2. There is a new in progress pomodoro created the moment the start button is pressed.
// 3. There is an implicit now, in the form of the current Date(), if it were to be created
// 4. When this implicity now, reaches a pomodoro.end date then the end sound will play - this is checked every second

// State design choices
// This pomodoro is designed to be resilient to the document closing. That is, if the website is closed, and then re-opened
// then the pomodoro will immediately start running again. This means there is minimal use of state to store the status of the pomodoro
// Instead, the status of the pomodoros and the timer is embedded in the document itself, which will sync immediately to whatever local or cloud store it's using
// However, the update frequency of the local state is faster than the document store, so the tight inner loop is the local react state
// And the less tight outer loop is the document store in node attributes of the pomodoro timer 

type Pomodoro = {
    start: DateTime,
    startStatus: "realised" | "unrealised"
    end: DateTime,
    endStatus: "realised" | "unrealised",
}

const kitchenTimerStartAudio = new Audio("/kitchenTimerStart.mp3");
const dingAudio = new Audio("/ding.mp3");
const rubbishingAudio = new Audio("/rubbishing.mp3");

const getPomodoroStatus = (pomodoro: Pomodoro) => {
    // Must have both an actual start time and planned end time at initialisation
    switch (pomodoro.endStatus) {
        case "unrealised":
            if (pomodoro.startStatus === "unrealised") {
                // This state occurs when the previous pomodoro has finished
                // And a break begins. The moment the previous pomodoro has finished,
                // We add a new pomodoro which is completely unrealised, that will
                // automatically start after the break
                return "planned"
            } else if (pomodoro.startStatus === "realised") {
                // This occurs when the pomodoro has started, and we've not completed the full duration
                return "inProgress"
            }
            break;
        case "realised":
            if (pomodoro.startStatus === "unrealised") {
                // This is because it's impossible for a later time to be realised
                // But an earlier time to not be realised
                return "invalid"
            } else if (pomodoro.startStatus === "realised") {
                // This occurs when the pomodoro is complete
                // The pomodoro can either be complete according to the 
                // original duration of the planned pomodoro, or 
                // it can be complete because it was interrupted and stopped
                return "complete"
            }
    }
}

const createNewPomodoro = (withBreak: boolean, pomodoroBreakDuration: number, pomodoroDuration: number) => {
    const start = withBreak ? DateTime.now().plus({ minutes: pomodoroBreakDuration }) : DateTime.now();
    const end = start.plus({ minutes: pomodoroDuration });

    // Instead of pushing to the original array, return the new pomodoro
    const newPomodoro: Pomodoro = { start, startStatus: "realised", end, endStatus: "unrealised" };
    return newPomodoro;
};

const getAllPomodorosStatus = (pomodoros: Pomodoro[]) => {
    const latestPomodoro = pomodoros[pomodoros.length - 1];
    if (latestPomodoro) {
        const status = getPomodoroStatus(latestPomodoro);
        if (status === "inProgress" || status === "planned") {
            return "stop";
        }
    }
    return "start";
}

// Every second, check and possibly update the pomodoros
// This also handles sound effects and automatic creation of new pomodoros after the current one is complete
const updatePomodoroTick = (pomodoros: Pomodoro[], pomodoroBreakDuration: number, pomodoroDuration: number) => {
    const now = DateTime.now();
    return pomodoros.map(pomodoro => {
        // Sweep the now (I) demarcation across both the start and end times of the pomodoro
        if (pomodoro.start < now) {
            pomodoro.startStatus = "realised";
        }
        if (pomodoro.end < now) {
            pomodoro.endStatus = "realised";
        }

        if (getPomodoroStatus(pomodoro) === "inProgress" && now.hasSame(pomodoro.start, "second")) {
            // Pause all existing sounds
            dingAudio.pause()
            kitchenTimerStartAudio.pause()

            // It's just started, so we need to play the wind up sound
            kitchenTimerStartAudio.play()

            setTimeout(() => {
                kitchenTimerStartAudio.pause();
                kitchenTimerStartAudio.currentTime = 0;
            }, 3000);
        } else if (getPomodoroStatus(pomodoro) === "complete" && now.hasSame(pomodoro.end, "second")) {
            // Pause all existing sounds
            dingAudio.pause()
            kitchenTimerStartAudio.pause()

            // The pomodoro has just ended so we need to play the ding sound
            dingAudio.play()
            dingAudio.currentTime = 0

            // The pomodoro just ended, so we need to create a planned pomodoro after a break interval
            const newPomodoro = createNewPomodoro(true, pomodoroBreakDuration, pomodoroDuration);
            pomodoros.push(newPomodoro);
        }

        return pomodoro;
    });
}

// Change the pomodoros based on an action
const handlePomodoroTimerButtonClick = (pomodoros: Pomodoro[], pomodoroDuration: number, pomodoroBreakDuration: number, setPomodoros: React.Dispatch<React.SetStateAction<Pomodoro[]>>) => {
    

    let newPomodoros: Pomodoro[] = []; // This will hold the new state
    if (pomodoros.length === 0) {
        // Create a new pomodoro that is in progress and add it to the array
        newPomodoros = [createNewPomodoro(false, pomodoroBreakDuration, pomodoroDuration)];
    } else {
        // Copy the existing pomodoros to a new array
        newPomodoros = [...pomodoros];

        // Look at the very latest pomodoro
        const latestPomodoro = newPomodoros[newPomodoros.length - 1];

        // Exhaustively handle all the possible states of the most recent pomodoro
        if (getPomodoroStatus(latestPomodoro) === "inProgress") {
            // Then the button stops the pomodoro
            latestPomodoro.endStatus = "realised";
            latestPomodoro.end = DateTime.now();
        } else if (getPomodoroStatus(latestPomodoro) === "complete") {
            // Problem: Subtle logic bug here. If the timer is stopped prematurely, then then pomodoro is complete and another one should not start
            // However it does currently start.
            // Then the button starts another pomodoro immediately
            newPomodoros.push(createNewPomodoro(false, pomodoroBreakDuration, pomodoroDuration));
        } else if (getPomodoroStatus(latestPomodoro) === "planned") {
            // Then we're currently in a break, and the pomodoro timer is running, give the user the option to stop the timer

        }
    }

    // Now we're setting the state with a new array, ensuring React knows it's a state change
    setPomodoros(newPomodoros);
};

const deleteAllPomodorosFromAttrs = (updateAttrsPomodoros: (attrsPomodoros: AttrPomodoro[]) => void) => {
    updateAttrsPomodoros([])
}

const convertAttrsPomodoros = (attrsPomodoros: AttrPomodoro[]) => {
    if (!attrsPomodoros) { 
        return [] 
    }

    let pomodoros: Pomodoro[] = attrsPomodoros.map((attrPomodoro) => ({
        start: DateTime.fromISO(attrPomodoro.start),
        startStatus: attrPomodoro.startStatus,
        end: DateTime.fromISO(attrPomodoro.end),
        endStatus: attrPomodoro.endStatus,
    }))
    return pomodoros
}

const convertPomodoros = (pomodoros: Pomodoro[]) => {
    let attrPomodoros: AttrPomodoro[] = pomodoros.map((pomodoro) => ({
        start: pomodoro.start.toISO(),
        startStatus: pomodoro.startStatus,
        end: pomodoro.end.toISO(),
        endStatus: pomodoro.endStatus,
    }))
    return attrPomodoros
}

export const PomodoroTimer = (props: {
    attrsPomodoros: AttrPomodoro[],
    attrsPomodoroDuration: string,
    attrsPomodoroBreakDuration: string,
    handlePomodoroDurationChange: (duration: string) => void,
    handlePomodoroBreakDurationChange: (duration: string) => void,
    updateAttrsPomodoros: (attrsPomodoros: AttrPomodoro[]) => void
}) => {


    // Always keep the node attrs pomodoros synced with the local component state
    React.useEffect(() => {
        setPomodoros(convertAttrsPomodoros(props.attrsPomodoros))
        console.log("pomodoros", pomodoros)

    }, [props.attrsPomodoros])

    const [pomodoros, setPomodoros] = React.useState<Pomodoro[]>(convertAttrsPomodoros(props.attrsPomodoros))

    // Similarly, always keep the local state pomodoros synced with the node attrs
    React.useEffect(() => {
        props.updateAttrsPomodoros(convertPomodoros(pomodoros))

    }, [pomodoros])

    // Duration in minutes
    const [selectedPomodoroDuration, setSelectedPomodoroDuration] = React.useState<string>(`${props.attrsPomodoroDuration} minutes`)
    const [selectedPomodoroBreakDuration, setSelectedPomodoroBreakDuration] = React.useState<string>(`${props.attrsPomodoroBreakDuration} minutes`)

    // Update the pomodoros' statuses every second
    React.useEffect(() => {
        // Timer Interval
        const updatePomodoroStatusesTimer = setInterval(() => {

            const updatedPomodoros = updatePomodoroTick(pomodoros, Number(props.attrsPomodoroDuration), Number(props.attrsPomodoroBreakDuration))

            const attrsPomodoros = convertPomodoros(updatedPomodoros)
            // Update attrs stored within the node, inside the document
            props.updateAttrsPomodoros(attrsPomodoros)

        }, 100)

        return () => clearInterval(updatePomodoroStatusesTimer)
    })

    // Scroll to the latest pomodoros
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [pomodoros]);


    return (
        <motion.div style={flowMenuStyle()}>
            <FlowSwitch value={selectedPomodoroDuration} isLens>
                <Option
                    value={"25"}
                    onClick={() => {
                        setSelectedPomodoroDuration("25 minutes");
                        props.handlePomodoroDurationChange("25");
                    }}
                >
                    <motion.div>
                        <span style={{}}>
                            ⏲️ 25 minutes
                        </span>
                    </motion.div>
                </Option>
                <Option
                    value={"50"}
                    onClick={() => {
                        setSelectedPomodoroDuration("50 minutes")
                        props.handlePomodoroBreakDurationChange("50");
                    }}
                >
                    <motion.div>
                        <span style={{}}>
                            ⏲️ 50 minutes
                        </span>
                    </motion.div>
                </Option>
            </FlowSwitch>
            <FlowSwitch value={selectedPomodoroBreakDuration} isLens>
                <Option
                    value={"5"}
                    onClick={() => { setSelectedPomodoroBreakDuration("5") }}
                >
                    <motion.div>
                        <span style={{}}>
                            😴 5 minutes
                        </span>
                    </motion.div>
                </Option>
                <Option
                    value={"10"}
                    onClick={() => { setSelectedPomodoroBreakDuration("10") }}
                >
                    <motion.div>
                        <span style={{}}>
                            😴 10 minutes
                        </span>
                    </motion.div>
                </Option>
            </FlowSwitch>
            <IconButton
                aria-label={getAllPomodorosStatus(pomodoros) === "stop" ? "Stop timer" : "Start timer"}
                size="small"
                onClick={() => {
                    handlePomodoroTimerButtonClick(pomodoros, Number(props.attrsPomodoroDuration), Number(props.attrsPomodoroBreakDuration), setPomodoros)
                }}
            >
                {getAllPomodorosStatus(pomodoros) === "stop"? <StopIcon fontSize="medium" /> : <PlayArrow fontSize="medium" />}
            </IconButton>
            <IconButton
                aria-label="delete all pomodoros"
                size="small"
                onClick={() => {
                    deleteAllPomodorosFromAttrs(props.updateAttrsPomodoros)

                    // Play sound effects
                    rubbishingAudio.play();
                }}
            >
                <DeleteIcon fontSize="small" />
            </IconButton>
            <motion.div
                ref={containerRef}
                style={{ overflowX: 'scroll', display: 'flex', width: '400px', gap: 4 }}
            >
                {pomodoros.map((pomodoro) => (
                    <motion.div key={pomodoro.start.toString()} style={{ width: 'fit-content', overflow: "visible" }}>
                        <Tag>
                            <motion.div style={{ opacity: pomodoro.startStatus === 'realised' ? 1 : 0.5 }}>
                                <TypeTag icon={'🕕'} label={pomodoro.start.toLocaleString(DateTime.TIME_24_SIMPLE)} />
                            </motion.div>
                            {'-'}
                            <motion.div style={{ opacity: pomodoro.endStatus === 'realised' ? 1 : 0.5 }}>
                                <TypeTag icon={'🕕'} label={pomodoro.end.toLocaleString(DateTime.TIME_24_SIMPLE)} />
                            </motion.div>
                        </Tag>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    )
}