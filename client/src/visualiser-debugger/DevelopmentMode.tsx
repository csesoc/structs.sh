import { useRef } from 'react';
import styles from 'styles/DevelopmentMode.module.css';
import globalStyles from 'styles/global.module.css';
import classNames from 'classnames';
import { Tabs, Tab } from 'components/Tabs';
import Console from 'visualiser-debugger/Component/Console/Console';
import DynamicTabs from 'components/TabResize/DynamicTabs';
import DevelopmentModeNavbar from '../components/Navbars/DevelopmentModeNavbar';
import Configuration from './Component/Configuration/Configuration';
import Controls from './Component/Control/Controls';
import CodeEditor from './Component/CodeEditor/CodeEditor';
import StackInspector from './Component/StackInspector/StackInspector';
import VisualizerMain from './Component/VisualizerMain';
import FileManager from './Component/FileTree/FileManager';
import { useGlobalStore } from './Store/globalStateStore';
import { useSocketCommunication } from '../Services/useSocketCommunication';
import { useFrontendStateStore } from './Store/frontendStateStore';

const DevelopmentMode = () => {
  const { isActive } = useFrontendStateStore();
  const inputElement = useRef(null);
  const { uiState, updateCurrFocusedTab } = useGlobalStore();

  const { activeSession } = useSocketCommunication();

  const scrollToBottom = () => {
    if (inputElement.current) {
      const container = inputElement.current.parentElement;
      container.scrollTop = container.scrollHeight;
    }
  };

  return (
    <div className={classNames(globalStyles.root, styles.light, styles.layout)}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <DevelopmentModeNavbar />
        <div style={{ display: 'flex', flex: 1 }}>
          <div className={classNames(styles.pane, styles.files)} style={{ overflowY: 'scroll' }}>
            <FileManager />
          </div>
          <div className={classNames(styles.pane, styles.editor)}>
            <CodeEditor />
          </div>
          <Console scrollToBottom={scrollToBottom} isActive={activeSession} />
          <div className={classNames(styles.pane, styles.inspector)}>
            <Tabs value={uiState.currFocusedTab} onValueChange={updateCurrFocusedTab}>
              <Tab label="Configure">
                <Configuration />
              </Tab>
              <Tab label="Inspect">
                <StackInspector />
              </Tab>
              <Tab label="Console">
                <Console scrollToBottom={scrollToBottom} isActive={isActive} />
              </Tab>
            </Tabs>
          </div>
          <div className={classNames(styles.pane, styles.visualiser)}>
            <VisualizerMain />
          </div>
          <div className={classNames(styles.pane, styles.timeline)}>
            <Controls />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentMode;
