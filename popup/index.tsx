import React from 'react';
import ToggleSwitch from './components/ToggleSwitch';
import { storage } from '~background';
import { HeadingCheckBoxGroup } from './components/HeadingCheckBoxGroup';

function IndexPopup() {
  const textareaRef = React.useRef(null);

  React.useEffect(() => {
    (async () => {
      const summaryPrompt = await storage.get('summaryPrompt');
      if (textareaRef.current) {
        textareaRef.current.value = summaryPrompt;
      }
    })();
  }, []);

  const configSection: React.CSSProperties = {
    borderBottom: '1px solid #E0E0E0',
    paddingBottom: '20px',
    marginTop: '20px',
    marginBottom: '20px'
  };
  const configTitle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '20px'
  };
  const configItem: React.CSSProperties = {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'space-between'
  };
  const configKey: React.CSSProperties = {
    fontSize: '16px'
  };

  return (
    <div
      style={{
        width: 400
      }}
    >
      <h1
        style={{
          paddingLeft: '20px',
          paddingBottom: '10px',
          borderBottom: '1px solid #E0E0E0',
          fontSize: '24px',
          fontWeight: 'bold'
        }}
      >
        設定
      </h1>
      <div
        style={{
          paddingLeft: '20px',
          paddingRight: '20px'
        }}
      >
        <div style={configSection}>
          <h2 style={configTitle}>単語の説明</h2>
          <div style={configItem}>
            <span style={configKey}>説明を表示する</span>
            <ToggleSwitch storageKey="isShowDescription" />
          </div>
        </div>
        <div style={configSection}>
          <h2 style={configTitle}>要約の表示</h2>
          <div style={configItem}>
            <span style={configKey}>要約を表示する</span>
            <ToggleSwitch storageKey="isShowSummary" />
          </div>
          <div style={configItem}>
            <span style={configKey}>要約する段落レベル</span>
            <HeadingCheckBoxGroup />
          </div>
          <div style={{ marginTop: '10px' }}>
            <span style={configKey}>要約に使用する使用するプロンプト</span>
            <textarea
              ref={textareaRef}
              style={{
                width: '100%',
                borderColor: '#E0E0E0',
                lineHeight: '1em',
                height: '5em',
                resize: 'vertical',
                borderRadius: '5px'
              }}
              onChange={(e) => {
                storage.set('summaryPrompt', e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default IndexPopup;
