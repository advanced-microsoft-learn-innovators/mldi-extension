import React, { type ChangeEvent } from 'react';
import styled from 'styled-components';

const ToggleSwitch = () => {
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
      <Input type="checkbox" />
      <Switch />
    </Canvas>
  );
};

export default ToggleSwitch;
