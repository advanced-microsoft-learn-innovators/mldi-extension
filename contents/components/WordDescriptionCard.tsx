import type { WordState } from '~word-state';
import { useSelector } from 'react-redux';

// TODO: Too many magic numbers. Refactor this.
export const WordDescriptionCard = () => {
  const isHover = useSelector((state: WordState) => state.isHover);
  const word = useSelector((state: WordState) => state.word);
  const rect = useSelector((state: WordState) => state.rect);

  const calcCardTop = () => {
    console.log(rect);
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
    const windowWidth = window.innerWidth;
    console.log(windowWidth);
    if (rect.cursorX + 400 > windowWidth) {
      return rect.cursorX + rect.scrollX - 400;
    }
    return rect.cursorX + rect.scrollX - 20;
  };

  const calcTipTop = () => {
    if (rect.cursorY < 200) {
      // if the word is at the top of the page
      return -9;
    } else {
      return 150 + 18;
    }
  };

  const calcTipLeft = () => {
    const windowWidth = window.innerWidth;
    if (rect.cursorX + 400 > windowWidth) {
      return 400 * 0.98;
    } else {
      return 400 * 0.02;
    }
  };

  if (!isHover) {
    return null;
  }
  return (
    <div
      className="mldi_word_card"
      style={{
        position: 'relative',
        top: calcCardTop(),
        left: calcCardLeft()
      }}
    >
      <div className="word">{word}</div>
      <div className="description">This is a word description card</div>
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
