import { createSlice } from '@reduxjs/toolkit';

export type WordState = {
  isHover: boolean;
  word: string;
  rect: {
    left: number;
    right: number;
    top: number;
    height: number;
    width: number;
    scrollX: number;
    scrollY: number;
    cursorX: number;
    cursorY: number;
    contentWidth: number;
    contentLeft: number;
  };
};

const wordStateSlice = createSlice({
  name: 'wordState',
  initialState: {
    isHover: false,
    word: '',
    rect: {
      left: 0,
      top: 0,
      right: 0,
      height: 0,
      width: 0,
      scrollX: 0,
      scrollY: 0,
      cursorX: 0,
      cursorY: 0,
      contentWidth: 0,
      contentLeft: 0
    }
  },
  reducers: {
    setHover: (state) => {
      state.isHover = true;
    },
    setNotHover: (state) => {
      state.isHover = false;
    },
    setWord: (state, action) => {
      const { word } = action.payload;
      state.word = word;
    },
    setRect: (state, action) => {
      const { rect } = action.payload;
      state.rect = rect;
    }
  }
});

export const { setHover, setNotHover, setWord, setRect } =
  wordStateSlice.actions;
export default wordStateSlice.reducer;
