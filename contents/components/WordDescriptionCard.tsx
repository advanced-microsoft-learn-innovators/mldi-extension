import {
  hideCard,
  setHover,
  setNotHover,
  setTimeoutId,
  type WordState
} from '~word-state';
import { useDispatch, useSelector } from 'react-redux';

// TODO: Too many magic numbers. Refactor this.
export const WordDescriptionCard = () => {
  const isShowCard = useSelector((state: WordState) => state.isShowCard);
  const word = useSelector((state: WordState) => state.word);
  const rect = useSelector((state: WordState) => state.rect);
  const timeoutId = useSelector((state: WordState) => state.timeoutId);
  const dispatch = useDispatch();

  const calcCardTop = () => {
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
    // calculate the left position of the card
    const windowWidth = window.innerWidth;
    if (rect.cursorX + 400 > windowWidth) {
      return rect.cursorX + rect.scrollX - 400;
    }
    return rect.cursorX + rect.scrollX - 20;
  };

  const calcTipTop = () => {
    // calculate the top position of the bubble_tip
    if (rect.cursorY < 200) {
      // if the word is at the top of the page
      return -9;
    } else {
      return 150 + 18;
    }
  };

  const calcTipLeft = () => {
    // calculate the left position of the bubble_tip
    const windowWidth = window.innerWidth;
    if (rect.cursorX + 400 > windowWidth) {
      return 400 * 0.98;
    } else {
      return 400 * 0.02;
    }
  };

  if (!isShowCard) {
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
      onMouseEnter={() => {
        // store.dispatch(setHover());
        if (timeoutId) {
          clearTimeout(timeoutId);
          dispatch(setTimeoutId({ timeoutId: null }));
        }
      }}
      onMouseLeave={() => {
        dispatch(setNotHover());

        // hide the card after 2 seconds if the mouse doesn't hover keywords
        const timeoutId = setTimeout(() => {
          dispatch(hideCard());
          dispatch(setTimeoutId({ timeoutId: null }));
        }, 2000);
        dispatch(setTimeoutId({ timeoutId: timeoutId }));
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
