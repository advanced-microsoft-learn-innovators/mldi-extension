import React from 'react';
import styled from 'styled-components';
import { storage } from 'background';

// Intentionally not using useStorage for toggle animation.
// If useStorage is used, the rendering is happened and skip the animation.
// If you want to use useStorage, you may need to create "SAVE" button.
const ToggleSwitch = (params: { storageKey: string }) => {
  const checkboxRef = React.useRef(null);
  React.useEffect(() => {
    (async () => {
      const isChecked = await storage.get(params.storageKey);
      if (checkboxRef.current) {
        checkboxRef.current.checked = isChecked;
      }
    })();
  }, []);

  const Canvas = styled.label`
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  `;
  const Switch = styled.div`
    position: relative;
    width: 30px;
    height: 15px;
    border: 0.5px solid black;
    border-radius: 9px;
    padding: 1px;
    transition: 300ms all;

    &:before {
      content: '';
      transition: 300ms;
      position: absolute;
      width: 13px;
      height: 13px;
      border-radius: 9px;
      top: 50%;
      left: 2px;
      background: white;
      border: 0.5px solid black;
      transform: translate(0, -50%);
    }
  `;
  const Input = styled.input`
    display: none;

    &:checked + ${Switch} {
      background: #4f52b2;

      &:before {
        border: none;
        transform: translate(15px, -50%);
      }
    }
  `;

  return (
    <Canvas>
      <Input
        type="checkbox"
        ref={checkboxRef}
        onChange={(e) => {
          const isChecked = e.target.checked;
          (async () => {
            await storage.set(params.storageKey, isChecked);
          })();
        }}
      />
      <Switch />
    </Canvas>
  );
};

export default ToggleSwitch;
