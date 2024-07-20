import React, { useEffect, useState } from 'react';
import type { Message } from '~types';

// TODO: Too many magic numbers. Refactor this.
export const WordDescriptionCard = () => {
  const [isShowCard, setIsShowCard] = useState(false);
  const [word, setWord] = useState(null);
  const [description, setDiscription] = useState(null);
  const [rect, setRect] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (message: Message, sender, sendResponse) => {
        console.log('word description card: ' + message.command);
        switch (message.command) {
          case 'showCard':
            setWord(message.data.word);
            setRect(message.data.rect);
            setIsShowCard(true);
            return;
          case 'hideCard':
            hideCard();
            return;
          case 'addDescription':
            setDiscription(message.data.description);
            return;
          case 'setTimeout':
            setTimeoutToHideCard(message.data.time);
            return;
          case 'deleteTimeout':
            console.log(timeoutId);
            deleteTimeoutToHideCard();
            return;
          default:
            console.log('do not have listener of command: ' + message.command);
            return;
        }
      }
    );
  }, []);

  const hideCard = () => {
    setWord('');
    setDiscription('');
    setRect(null);
    setIsShowCard(false);
    setTimeoutId(null);
  };

  const setTimeoutToHideCard = (time: number) => {
    console.log('[DEBUG] setTimeoutToHideCard');
    const _timeoutId = setTimeout(() => {
      hideCard();
    }, time);
    setTimeoutId(_timeoutId);
  };

  const deleteTimeoutToHideCard = () => {
    // TODO: There may be more efficient way to clear the timeout.
    // When the 'deleteTimeout' message is sent, the timeoutId is always null, because this function is called before the timeout is set.
    console.log('[DEBUG] deleteTimeoutToHideCard');
    console.log(timeoutId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
      console.log('timeout cleared');
    } else {
      const lastTimeoutId = setTimeout(() => {
        for (let i = 0; i < (lastTimeoutId as unknown as number); i++) {
          clearTimeout(i);
        }
      }, 0);
      console.log('timeout cleared');
    }
  };

  useEffect(() => {
    console.log(`timeoutId: ${timeoutId}`);
  }, [timeoutId]);

  const calcCardTop = () => {
    if (!rect) return;
    // calculate the top position of the card
    if (rect.cursorY < 200) {
      // if the word is at the top of the page
      if (rect.height > 40) {
        // if the word is wrapped
        if (rect.cursorX > rect.contentLeft + rect.contentWidth / 2) {
          // if the word is at the right side of the page
          return rect.top + rect.scrollY + 30;
        } else {
          // if the word is at the left side of the page
          return rect.top + rect.scrollY + 50;
        }
      }
      return rect.top + rect.scrollY + 30;
    } else {
      // if the word is at the bottom of the page
      if (rect.height > 40) {
        // if the word is wrapped
        if (rect.cursorX > rect.contentLeft + rect.contentWidth / 2) {
          // if the word is at the right side of the page
          return rect.top + rect.scrollY - rect.height - 130;
        } else {
          // if the word is at the left side of the page
          return rect.top + rect.scrollY - rect.height - 105;
        }
      }
      return rect.top + rect.scrollY - 175;
    }
  };

  const calcCardLeft = () => {
    if (!rect) return;
    // calculate the left position of the card
    console.log(rect);
    const windowWidth = window.innerWidth;
    if (rect.cursorX + 400 > windowWidth) {
      return rect.cursorX + rect.scrollX - 400;
    }
    return rect.cursorX + rect.scrollX - 20;
  };

  const calcTipTop = () => {
    if (!rect) return;
    // calculate the top position of the bubble_tip
    if (rect.cursorY < 200) {
      // if the word is at the top of the page
      return -9;
    } else {
      return 150 + 18;
    }
  };

  const calcTipLeft = () => {
    if (!rect) return;
    // calculate the left position of the bubble_tip
    const windowWidth = window.innerWidth;
    if (rect.cursorX + 400 > windowWidth) {
      return 400 * 0.98;
    } else {
      return 400 * 0.02;
    }
  };

  if (!isShowCard) return null;
  return (
    <div
      className="mldi_word_card"
      style={{
        position: 'relative',
        top: calcCardTop(),
        left: calcCardLeft()
      }}
      onMouseEnter={() => {
        // if the mouse hovers the card, clear the timeout
        console.log('onMouseEnter');
        deleteTimeoutToHideCard();
      }}
      onMouseLeave={() => {
        // hide the card after 2 seconds if the mouse doesn't hover this card
        console.log('onMounseLeave');
        setTimeoutToHideCard(2000);
      }}
    >
      <div className="word">{word}</div>
      <div className="description">{description}</div>
      <div className="tags">#Microsoft365 #Skype</div>
      <div
        className="bubble_tip"
        style={{
          position: 'absolute',
          top: calcTipTop(),
          left: calcTipLeft(),
          clipPath:
            rect.cursorY < 200
              ? 'polygon(0 100%, 50% 0, 100% 100%)'
              : 'polygon(0 0, 50% 100%, 100% 0)'
        }}
      />
    </div>
  );
};
