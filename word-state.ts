import { createSlice } from '@reduxjs/toolkit';

export type WordState = {
  isHover: boolean;
  isShowCard: boolean;
  word: string;
  description: string;
  timeoutId: number | null;
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
    isShowCard: false,
    word: '',
    description: '',
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
    },
    timeoutId: null
  },
  reducers: {
    setHover: (state) => {
      state.isHover = true;
    },
    setNotHover: (state) => {
      state.isHover = false;
    },
    showCard: (state) => {
      state.isShowCard = true;
    },
    hideCard: (state) => {
      state.isShowCard = false;
    },
    setWord: (state, action) => {
      const { word } = action.payload;
      state.word = word;
    },
    setDiscription: (state, action) => {
      const { description } = action.payload;
      state.description = description;
    },
    setRect: (state, action) => {
      const { rect } = action.payload;
      state.rect = rect;
    },
    setTimeoutId: (state: WordState, action) => {
      const { timeoutId } = action.payload;
      state.timeoutId = timeoutId;
    }
  }
});

export const {
  setHover,
  setNotHover,
  setWord,
  setDiscription,
  setRect,
  showCard,
  hideCard,
  setTimeoutId
} = wordStateSlice.actions;
export default wordStateSlice.reducer;
