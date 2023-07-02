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
  const { initials, text } = parseMessage(message);

  const bubbleStyles: React.CSSProperties = {
    position: 'relative',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '10px',
  };

  const tailStyles: React.CSSProperties = {
    content: '',
    position: 'absolute',
    bottom: '-10px',
    borderStyle: 'solid',
  };

  if (self) {
    bubbleStyles.backgroundColor = '#0b93f6';
    bubbleStyles.color = '#fff';
    bubbleStyles.alignSelf = 'flex-end';
    tailStyles.right = '-10px';
    tailStyles.borderColor = 'transparent transparent transparent #0b93f6';
    tailStyles.borderWidth = '10px';
  } else {
    bubbleStyles.backgroundColor = '#e5e5ea';
    bubbleStyles.color = '#000';
    bubbleStyles.alignSelf = 'flex-start';
    tailStyles.left = '-10px';
    tailStyles.borderColor = 'transparent #e5e5ea transparent transparent';
    tailStyles.borderWidth = '10px';
  }

  return (
    <div style={bubbleStyles}>
      <strong>{initials}:</strong> {text}
      <div style={tailStyles} />
    </div>
  );
};