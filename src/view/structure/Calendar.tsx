import Calendar from '@toast-ui/react-calendar';
import React from 'react';
import 'tui-calendar/dist/tui-calendar.css';

export const SchedulingCalendar = () => {
    const calRef = React.useRef();

    const handleClick = () => {
        const inst = calRef.current.getInstance();
        console.log(inst.getDate());
    };

    return (
        <>
            <button onClick={handleClick}>Test</button>
            <Calendar ref={calRef} />
        </>
    );

}