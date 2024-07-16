import type { WordState } from '~word-state';
import { useSelector } from 'react-redux';

// TODO: Too many magic numbers. Refactor this.
export const WordDescriptionCard = () => {
  const isHover = useSelector((state: WordState) => state.isHover);
  const word = useSelector((state: WordState) => state.word);
  const rect = useSelector((state: WordState) => state.rect);

  const calcLeft = () => {
    const windowWidth = window.innerWidth;
    console.log(windowWidth);
    if (rect.cursorX + 400 > windowWidth) {
      return rect.cursorX + rect.scrollX - 400;
    }
    return rect.cursorX + rect.scrollX - 20;
  };

  const calcTop = () => {
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
          return rect.top + rect.scrollY - rect.height - 90;
        } else {
          // if the word is at the left side of the page
          return rect.top + rect.scrollY - rect.height - 65;
        }
      }
      return rect.top + rect.scrollY - 135;
    }
  };

  if (!isHover) {
    return null;
  }
  return (
    <div
      className="mldi_word_card"
      style={{
        position: 'absolute',
        top: calcTop(),
        left: calcLeft()
      }}
    >
      <h1>
        {word} {rect.height}
      </h1>
      <p>This is a word description card</p>
    </div>
  );
};
