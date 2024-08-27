import { motion } from "framer-motion"
import { flowMenuStyle } from "../structure/FlowMenu"
import { FlowSwitch, Option } from "../structure/FlowSwitch"
import React from "react"
import IconButton from "@mui/material/IconButton"
import StopIcon from '@mui/icons-material/Stop';
import PlayArrow from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { AttrPomodoro } from './PomodoroTimerExtension'
import { DateTime } from 'ts-luxon'
import { Tag, TypeTag } from "./Tag"
import { useInterval } from "react-use"
import _ from "lodash"
import { kitchenTimerStartAudio, dingAudio, rubbishingAudio } from "../../utils/utils"

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
// then the pomodoro will immediately start running again.
// So this means the pomodoro data is stateless, and the client having the website open makes it stateful by operating per tick on it
// Local react state is mutated by various handlers
// This local react state is then synchronised with the node attributes, which also hold state, but this time at the document level
// This document level state is then continually synced using the QuantaStore, which uses a combination of 
// TipTap Cloud Collab (Y.js) and storage in the LocalStorage web db

type Pomodoro = {
    start: DateTime,
    startStatus: "realised" | "unrealised"
    end: DateTime,
    endStatus: "realised" | "unrealised",
    completionType: "natural" | "manual" | "incomplete"
}

const getPomodoroStatus = (pomodoro: Pomodoro) => {
    switch (pomodoro.endStatus) {
        case "unrealised":
            if (pomodoro.startStatus === "unrealised") {
                return "planned"
            } else if (pomodoro.startStatus === "realised") {
                return "inProgress"
            }
            break;
        case "realised":
            if (pomodoro.startStatus === "unrealised") {
                return "invalid"
            } else if (pomodoro.startStatus === "realised") {
                return pomodoro.completionType === "natural" ? "complete" : "stopped"
            }
    }
}

const createNewPomodoro = (withBreak: boolean, pomodoroBreakDuration: number, pomodoroDuration: number) => {
    // TODO: Current problem is that when one pomodoro ends, then next pomodoro has a start duration of 1 minute into the future, not the break duration
    const start = withBreak ? DateTime.now().plus({ minutes: pomodoroBreakDuration }) : DateTime.now();
    const end = start.plus({ minutes: pomodoroDuration });

    // Instead of pushing to the original array, return the new pomodoro
    const newPomodoro: Pomodoro = { start, startStatus: "realised", end, endStatus: "unrealised", completionType: "incomplete" };
    return newPomodoro;
};

const getAllPomodorosStatus = (pomodoros: Pomodoro[]) => {
    const latestPomodoro = pomodoros[pomodoros.length - 1];
    if (latestPomodoro) {
        const status = getPomodoroStatus(latestPomodoro);
        console.log("Latest pomodoro status:", status);
        return status === "inProgress" ? "stop" : "start";
    }
    return "start";
}

// Regularly, check and possibly update the pomodoros
// This also handles sound effects and automatic creation of new pomodoros after the current one is complete
// We use a closure to maintain the previouslyCheckedPomodoroEndTime state across multiple function invocations

const playAudio = (status: "start" | "stop" | "complete") => {
    switch (status) {
        case "start":
            if (kitchenTimerStartAudio) {
                kitchenTimerStartAudio.pause();
                kitchenTimerStartAudio.currentTime = 0;
                kitchenTimerStartAudio.play().catch(error => console.error('Error playing audio:', error));
                
                // Set a timeout to pause the audio after 5 seconds
                setTimeout(() => {
                    if (kitchenTimerStartAudio) {
                        kitchenTimerStartAudio.pause();
                        kitchenTimerStartAudio.currentTime = 0;
                    }
                }, 5000);
            }
            break;
        case "stop":
        case "complete":
            if (dingAudio) {
                dingAudio.pause();
                dingAudio.currentTime = 0;
                dingAudio.play().catch(error => console.error('Error playing audio:', error));
            }
            break;
    }
};

const updatePomodoroTick = (pomodoros: Pomodoro[], pomodoroBreakDuration: number, pomodoroDuration: number, setPomodoros: React.Dispatch<React.SetStateAction<Pomodoro[]>>) => {
    const now = DateTime.now();
    let updatedPomodoros = [...pomodoros];
    let shouldUpdateState = false;
    let shouldPlayCompleteSound = false;

    updatedPomodoros = updatedPomodoros.map(pomodoro => {
        if (pomodoro.start <= now && pomodoro.startStatus === "unrealised") {
            pomodoro.startStatus = "realised";
            shouldUpdateState = true;
        }
        if (pomodoro.end <= now && pomodoro.endStatus === "unrealised") {
            pomodoro.endStatus = "realised";
            pomodoro.completionType = "natural";
            shouldUpdateState = true;
            shouldPlayCompleteSound = true;
        }
        return pomodoro;
    });

    // Check if we need to create a new planned Pomodoro
    const latestPomodoro = updatedPomodoros[updatedPomodoros.length - 1];
    if (latestPomodoro && getPomodoroStatus(latestPomodoro) === "complete" && latestPomodoro.completionType === "natural") {
        const nextPomodoroStart = latestPomodoro.end.plus({ minutes: pomodoroBreakDuration });
        if (now < nextPomodoroStart && !updatedPomodoros.some(p => getPomodoroStatus(p) === "planned")) {
            const newEnd = nextPomodoroStart.plus({ minutes: pomodoroDuration });
            const newPomodoro: Pomodoro = {
                start: nextPomodoroStart,
                startStatus: "unrealised",
                end: newEnd,
                endStatus: "unrealised",
                completionType: "incomplete"
            };
            updatedPomodoros.push(newPomodoro);
            shouldUpdateState = true;
            console.log("Created new planned Pomodoro:", newPomodoro);
        }
    }

    if (shouldUpdateState) {
        console.log("Updating pomodoro states:", updatedPomodoros);
        setPomodoros(updatedPomodoros);
    }

    if (shouldPlayCompleteSound) {
        playAudio("complete");
    }
};

// Change the pomodoros based on an action
const handlePomodoroTimerButtonClick = (pomodoros: Pomodoro[], pomodoroDuration: number, pomodoroBreakDuration: number, setPomodoros: React.Dispatch<React.SetStateAction<Pomodoro[]>>) => {
    let newPomodoros = [...pomodoros];
    const latestPomodoro = newPomodoros[newPomodoros.length - 1];

    if (latestPomodoro && getPomodoroStatus(latestPomodoro) === "inProgress") {
        // Stop the current pomodoro
        latestPomodoro.endStatus = "realised";
        latestPomodoro.end = DateTime.now();
        latestPomodoro.completionType = "manual";
        console.log("Stopping pomodoro:", latestPomodoro);
        playAudio("stop");
    } else {
        // Start a new pomodoro
        const newPomodoro: Pomodoro = {
            start: DateTime.now(),
            startStatus: "realised",
            end: DateTime.now().plus({ minutes: pomodoroDuration }),
            endStatus: "unrealised",
            completionType: "incomplete"
        };
        newPomodoros.push(newPomodoro);
        console.log("Starting new pomodoro:", newPomodoro);
        playAudio("start");
    }

    setPomodoros(newPomodoros);
};

const deleteAllPomodorosFromAttrs = (setPomodoros: React.Dispatch<React.SetStateAction<Pomodoro[]>>) => {
    setPomodoros([])
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
        completionType: attrPomodoro.completionType
    }))
    return pomodoros
}

const convertPomodoros = (pomodoros: Pomodoro[]) => {
    let attrPomodoros: AttrPomodoro[] = pomodoros.map((pomodoro) => ({
        start: pomodoro.start.toISO(),
        startStatus: pomodoro.startStatus,
        end: pomodoro.end.toISO(),
        endStatus: pomodoro.endStatus,
        completionType: pomodoro.completionType
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
    handleDelete: () => void,
}) => {


    // Always keep the node attrs pomodoros synced with the local component state
    // React.useEffect(() => {
    //     if (!_.isEqual(props.attrsPomodoros, pomodoros)) {
    //         setPomodoros(convertAttrsPomodoros(props.attrsPomodoros))
    //         console.log("pomodoros", pomodoros)
    //     }
    // }, [props.attrsPomodoros])


    // Push local state to node attrs
    const [pomodoros, setPomodoros] = React.useState<Pomodoro[]>(convertAttrsPomodoros(props.attrsPomodoros))
    React.useEffect(() => {
        if (!_.isEqual(pomodoros, convertAttrsPomodoros(props.attrsPomodoros))) {
            console.log("updating node attrs, pomodoros:", pomodoros)
            // This prevents the flush sync React error
            const timeoutId = setTimeout(() => {
                props.updateAttrsPomodoros(convertPomodoros(pomodoros))
            }, 5000)
            return () => clearTimeout(timeoutId)
        }

    }, [pomodoros])

    // Duration in minutes
    const [selectedPomodoroDuration, setSelectedPomodoroDuration] = React.useState<string>(`${props.attrsPomodoroDuration}`)
    const [selectedPomodoroBreakDuration, setSelectedPomodoroBreakDuration] = React.useState<string>(`${props.attrsPomodoroBreakDuration}`)

    // Update the pomodoros' statuses at least once every second
    // Refresh rate is higher because 1000ms is not enough to guarantee that this will fire at least once in every second
    useInterval(() => {
        updatePomodoroTick(
          pomodoros,
          Number(props.attrsPomodoroBreakDuration),
          Number(props.attrsPomodoroDuration),
          setPomodoros
        );
      }, 200);

    // Scroll to the latest pomodoros
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollLeft = containerRef.current.scrollWidth;
        }
    }, [pomodoros]);

    React.useEffect(() => {
        return () => {
            if (kitchenTimerStartAudio) {
                kitchenTimerStartAudio.pause();
                kitchenTimerStartAudio.currentTime = 0;
            }
            if (dingAudio) {
                dingAudio.pause();
                dingAudio.currentTime = 0;
            }
        };
    }, []);


    return (
        <motion.div style={flowMenuStyle()}>
            <FlowSwitch value={selectedPomodoroDuration} isLens>
                <Option
                    value={"25"}
                    onClick={() => {
                        setSelectedPomodoroDuration("25");
                        props.handlePomodoroDurationChange("25");
                        console.log("selectedPomodoroDuration", selectedPomodoroDuration)
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
                        setSelectedPomodoroDuration("50")
                        props.handlePomodoroBreakDurationChange("50");
                        console.log("selectedPomodoroDuration", selectedPomodoroDuration)
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
                    console.log("Button clicked. Current status:", getAllPomodorosStatus(pomodoros));
                    handlePomodoroTimerButtonClick(pomodoros, Number(props.attrsPomodoroDuration), Number(props.attrsPomodoroBreakDuration), setPomodoros);
                }}
            >
                {getAllPomodorosStatus(pomodoros) === "stop"? <StopIcon fontSize="medium" /> : <PlayArrow fontSize="medium" />}
            </IconButton>
            <IconButton
                aria-label="delete all pomodoros"
                size="small"
                onClick={() => {
                    deleteAllPomodorosFromAttrs(setPomodoros)
                    // Play sound effects
                    if (rubbishingAudio) {
                        rubbishingAudio.play();
                    }
                }}
            >
                <DeleteIcon fontSize="small" />
            </IconButton>
            <motion.div
                ref={containerRef}
                style={{ overflowX: 'scroll', display: 'flex', width: '400px', gap: 4 }}
            >
                {pomodoros.map((pomodoro) => {
                    return (
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
                    )
                })}
            </motion.div>
            <motion.div style={{ opacity: 0, position: "absolute", top: -15, right: -15 }} whileHover={{ opacity: 1 }}>
                <IconButton
                    aria-label="delete this pomodoro timer"
                    size="small"
                    onClick={() => {
                        props.handleDelete()
                    }}
                >
                    <HighlightOffIcon fontSize="small" />
                </IconButton>
            </motion.div>
        </motion.div>
    )
}