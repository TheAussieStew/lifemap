import React from 'react';

interface MessageProps {
  message: string;
  self: boolean;
}

interface ParsedMessage {
  initials: string;
  text: string;
}

export const parseMessage = (message: string): ParsedMessage => {
  const [initials, text] = message.split(':');
  return { initials: initials.trim(), text: text.trim() };
};

export const Message: React.FC<MessageProps> = ({ message, self }) => {

  const bubbleStyles: React.CSSProperties = {
    position: 'relative',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '10px',
  };

  if (self) {
    bubbleStyles.backgroundColor = '#0b93f6';
    bubbleStyles.color = '#fff';
    bubbleStyles.alignSelf = 'flex-end';
  } else {
    bubbleStyles.backgroundColor = '#e5e5ea';
    bubbleStyles.color = '#000';
    bubbleStyles.alignSelf = 'flex-start';
  }

  return (
    <div style={bubbleStyles}>
      {message}
    </div>
  );
};