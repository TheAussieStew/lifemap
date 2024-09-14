import React from 'react';
import { motion } from 'framer-motion';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { DateTime } from 'ts-luxon';
import { kitchenTimerStartAudio, dingAudio } from '../../utils/utils';
import { FlowSwitch, Option } from '../controls/FlowSwitch';

type TimeBlock = {
    start: DateTime;
    end: DateTime;
};

type TemporalEstimateProps = {
    estimatedDuration: number; // in minutes
    timeBlocks: TimeBlock[];
    updateTimeBlocks: (timeBlocks: TimeBlock[]) => void;
    updateEstimatedDuration: (duration: number) => void;
};

export const TemporalEstimate: React.FC<TemporalEstimateProps> = ({
    estimatedDuration,
    timeBlocks,
    updateTimeBlocks,
    updateEstimatedDuration,
}) => {
    const [isRunning, setIsRunning] = React.useState(false);
    const [currentStart, setCurrentStart] = React.useState<DateTime | null>(null);

    const handleStart = () => {
        setIsRunning(true);
        setCurrentStart(DateTime.now());
        playAudio('start');
    };

    const handleStop = () => {
        if (currentStart) {
            const newTimeBlock: TimeBlock = {
                start: currentStart,
                end: DateTime.now(),
            };
            updateTimeBlocks([...timeBlocks, newTimeBlock]);
            setCurrentStart(null);
        }
        setIsRunning(false);
        playAudio('stop');
    };

    React.useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isRunning && currentStart) {
            const endTime = currentStart.plus({ minutes: estimatedDuration });
            const msUntilEnd = endTime.diff(DateTime.now()).as('milliseconds');
            
            if (msUntilEnd > 0) {
                timer = setTimeout(() => {
                    handleStop();
                    playAudio('complete');
                }, msUntilEnd);
            } else {
                handleStop();
            }
        }
        return () => clearTimeout(timer);
    }, [isRunning, currentStart, estimatedDuration]);

    const playAudio = (status: 'start' | 'stop' | 'complete') => {
        const audio = status === 'start' ? kitchenTimerStartAudio : dingAudio;
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(error => console.error('Error playing audio:', error));
        }
    };

    const totalTimeSpent = timeBlocks.reduce((total, block) => 
        total + block.end.diff(block.start).as('minutes'), 0
    );

    return (
        <motion.span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <FlowSwitch value={estimatedDuration.toString()} isLens>
                <Option
                    value="5"
                    onClick={() => updateEstimatedDuration(5)}
                >
                    <span>5m</span>
                </Option>
                <Option
                    value="25"
                    onClick={() => updateEstimatedDuration(25)}
                >
                    <span>25m</span>
                </Option>
                <Option
                    value="60"
                    onClick={() => updateEstimatedDuration(60)}
                >
                    <span>1h</span>
                </Option>
            </FlowSwitch>
            <IconButton size="small" onClick={isRunning ? handleStop : handleStart}>
                {isRunning ? <StopIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
            </IconButton>
            <span>{Math.round(totalTimeSpent)}/{estimatedDuration} min</span>
        </motion.span>
    );
};