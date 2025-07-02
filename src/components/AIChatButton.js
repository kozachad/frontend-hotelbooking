import React, { useState } from 'react';
import AIChat from './AIChat';
import './AIChatButton.css';

function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="ai-chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        💬
      </div>
      {isOpen && <AIChat onClose={() => setIsOpen(false)} />}
    </>
  );
}

export default AIChatButton;
