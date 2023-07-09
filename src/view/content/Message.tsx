import React from 'react';

interface MessageProps {
  children: string;
}

interface ParsedMessage {
  initials: string;
  text: string;
}

export const parseMessage = (message: string): ParsedMessage => {
  const [initials, text] = message.split(':');
  return { initials: initials.trim(), text: text.trim() };
};

export const Message: React.FC<MessageProps> = (props: { children: string }) => {

  const bubbleStyles: React.CSSProperties = {
    position: 'relative',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '10px',
  };

  // TODO: Make it such that it uses a custom colour for each person. Not this self vs other format.

  bubbleStyles.backgroundColor = '#0b93f6';
  bubbleStyles.color = '#fff';
  bubbleStyles.alignSelf = 'flex-end';

  return (
    <div style={bubbleStyles}>
      {props.children}
    </div>
  );
};