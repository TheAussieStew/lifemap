import { motion } from "framer-motion"
import { flowMenuStyle } from "../structure/FlowMenu"
import { FlowSwitch, Option } from "../structure/FlowSwitch"
import React from "react"
import IconButton from "@mui/material/IconButton"
import StopIcon from '@mui/icons-material/Stop';
import { AttrPomodoro } from './PomodoroTimerExtension'
import { DateTime } from 'ts-luxon'
import { Tag, TypeTag } from "./Tag"

// Functionality
// Audio plays on start and stop
// Can delete pomodoros

// Edge cases
// When I accidently leave the pomodoro running, but I'm not actually working
// And I need to edit it, or delete it

// Actions - transitions between states
// Start
// Stop

// States
// Initialisation
// start - realised, end - planned, unrealised
// Premature stop
// start - realised, end - realised. 
// original end is overwritten by the realised end.
// Full stop
// start - realised, end - realised.
// end is just a realised version of the original planned end

// Internal state design
// There is a new pomodoro created the moment the start button is pressed.
// There is an implicit now, in the form of the current Date(), if it were to be created
// When this now, reaches the pomodoro.end date, that is, when the seconds are equal
// checked every single second, 1000ms
// then the end sound, usually a "ding!", will play

// Required variables
// Need to add the startStatus and update other method
type Pomodoro = {
    start: DateTime,
    startStatus: "realised" | "unrealised"
    end: DateTime,
    endStatus: "realised" | "unrealised",
}

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

// Return whether the button should be a start or stop
// TODO: I'm confused about this and I don't know what I'm confused about
// Something about whether to reverse the pomodoros, and whether pomodoros at the 
// start that are unrealised will throw off the current algorithm
const getAllPomodorosStatus = (pomodoros: Pomodoro[]) => {
    const unrealisedPomodoro = pomodoros.find((pomodoro) => (pomodoro.endStatus === "unrealised" || pomodoro.startStatus === "unrealised"))
    if (unrealisedPomodoro) {
        if (getPomodoroStatus(unrealisedPomodoro) === "planned") {
            // This represents being in a break, and then stopping the pomodoros entirely.
            return "stop"
        }
        else if (getPomodoroStatus(unrealisedPomodoro) === "inProgress") {
            return "start"
        }
    } else if (!unrealisedPomodoro) {
        // TODO: This is under the assumption that all pomodoros will be realised, which is not the case
        // Basically, if all pomodoros are complete, start another pomodoro
        return "start"
    }
}

// Every second, check and possibly update the pomodoros
// TODO: This needs to definitely mutate the pomodoro in the array, not sure if this does
const updatePomodoroTick = (pomodoros: Pomodoro[]) => {
    return pomodoros.reverse().map((pomodoro) => {
        // If it's completely realised, then the pomodoro timer was stopped
        if (getPomodoroStatus(pomodoro) === "complete") {
            return pomodoro
        } else if (getPomodoroStatus(pomodoro) === "inProgress") {
            // Check if "now" is later than either the start or the end
            // Realise either the start or the end if so
            if (pomodoro.start < DateTime.now()) {
                pomodoro.startStatus = "realised"
            }
            if (pomodoro.end < DateTime.now()) {
                pomodoro.endStatus = "realised"
            }
            return pomodoro
        }
        else {
            return pomodoro
        }
    })
}

// Change the pomodoros based on an action
// TODO: Need to mutate actual pomodoros, not a copy
const handlePomodoroTimerButtonClick = (pomodoros: Pomodoro[], pomodoroDuration: number, pomodoroBreakDuration: number) => {
    const createNewPomodoro = (withBreak: boolean) => {
        const start = withBreak ? DateTime.now().plus({ minutes: pomodoroBreakDuration }) : DateTime.now()
        const end = start.plus({ minutes: pomodoroDuration })

        pomodoros.push({ start, startStatus: withBreak ? "unrealised" : "realised", end, endStatus: "unrealised" })
    }

    if (pomodoros.length === 0) {
        // Create a new pomodoro that is in progress
        createNewPomodoro(false)
    } else {
        // Look at the very last pomodoro
        const latestPomodoro = pomodoros.pop()

        // If realised (complete), then we need to start another pomodoro
        if (latestPomodoro!.endStatus === "realised") {
            createNewPomodoro(true)
        }
        // If not realised, then we need to stop the current pomodoro and update 
        else {
            pomodoros[-1].endStatus = "realised"
            pomodoros[-1].end = DateTime.now()
        }
    }
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
    const [pomodoros, setPomodoros] = React.useState<Pomodoro[]>(convertAttrsPomodoros(props.attrsPomodoros))

    // Duration in minutes
    const [selectedPomodoroDuration, setSelectedPomodoroDuration] = React.useState<string>(`${props.attrsPomodoroDuration} minutes`)
    const [selectedPomodoroBreakDuration, setSelectedPomodoroBreakDuration] = React.useState<string>(`${props.attrsPomodoroBreakDuration} minutes`)

    React.useEffect(() => {

        setPomodoros(convertAttrsPomodoros(props.attrsPomodoros))
        // Timer Interval
        const timer = setInterval(() => {

            const pomodoros = updatePomodoroTick(convertAttrsPomodoros(props.attrsPomodoros))
            const attrsPomodoros = convertPomodoros(pomodoros)
            props.updateAttrsPomodoros(attrsPomodoros)

        }, 1000)

    }, [props.attrsPomodoros])


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
                    onClick={() => { setSelectedPomodoroDuration("5") }}
                >
                    <motion.div>
                        <span style={{}}>
                            😴 5 minutes
                        </span>
                    </motion.div>
                </Option>
                <Option
                    value={"10"}
                    onClick={() => { setSelectedPomodoroDuration("50") }}
                >
                    <motion.div>
                        <span style={{}}>
                            😴 10 minutes
                        </span>
                    </motion.div>
                </Option>
            </FlowSwitch>
            <IconButton
                aria-label="delete"
                size="medium"
                onClick={() => {
                    const pomodoros = convertAttrsPomodoros(props.attrsPomodoros)
                    const pomodoroDuration = Number(props.attrsPomodoroDuration)
                    const pomodoroBreakDuration = Number(props.attrsPomodoroBreakDuration)
                    handlePomodoroTimerButtonClick(pomodoros, pomodoroDuration, pomodoroBreakDuration)
                }}
            >
                <StopIcon fontSize="medium" />
            </IconButton>
            <>
                <Tag>
                    <TypeTag icon={"🕕"} label={DateTime.now().toLocaleString(DateTime.TIME_24_SIMPLE)} />
                    {"-"}
                    <TypeTag icon={"🕕"} label={DateTime.now().plus({ minutes: 25 }).toLocaleString(DateTime.TIME_24_SIMPLE)} />
                </Tag>
                <Tag>
                    <TypeTag icon={"🕕"} label={DateTime.now().toLocaleString(DateTime.TIME_24_SIMPLE)} />
                    {"-"}
                    <motion.div initial={{opacity: 0}} animate={{opacity: 0.5}}>
                        <TypeTag icon={"🕕"} label={DateTime.now().plus({ minutes: 25 }).toLocaleString(DateTime.TIME_24_SIMPLE)} />
                    </motion.div>
                </Tag>
            </>
            {/* {
                pomodoros.map((pomodoro) => {
                    console.log("pomodoro", pomodoro)
                    return (
                        <>
                            <TypeTag icon={"🕕"} label={pomodoro.start.toLocaleString(DateTime.TIME_24_SIMPLE)} />
                            {"-"}
                            <TypeTag icon={"🕕"} label={pomodoro.end.toLocaleString(DateTime.TIME_24_SIMPLE)} />
                        </>
                    )
                })
            } */}
        </motion.div>
    )
}