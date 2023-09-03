import { useEffect, useCallback, useState } from 'react';
import { socket } from 'utils/socket';
import styles from 'styles/DevelopmentMode.module.css';
import globalStyles from 'styles/global.module.css';
import classNames from 'classnames';
import { Tabs, Tab } from 'components/Tabs';
import { Socket } from 'socket.io-client';
import VisualizerMain from './src/VisualizerMain';
import { BackendState, CType } from './src/visualizer-component/types/backendType';
import CodeEditor from 'components/DevelopmentMode/CodeEditor';

type ExtendedWindow = Window &
  typeof globalThis & { socket: Socket; getBreakpoints: (line: string, listName: string) => void };

const DevelopmentMode = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Attach socket to window for debugging: ', socket);
      (window as ExtendedWindow).socket = socket;
      (window as ExtendedWindow).getBreakpoints = (line: string, listName: string) =>
        socket.emit('getBreakpoints', line, listName);
    }
  }, []);
  const [backendState, setBackendState] = useState<BackendState>({
    heap: {
      '0x1': {
        addr: '0x1',
        type: CType.TREE_NODE,
        is_pointer: false,
        data: {
          value: '27',
          left: '0x2',
          right: '0x3',
        },
      },
      '0x2': {
        addr: '0x2',
        type: CType.TREE_NODE,
        is_pointer: false,
        data: {
          value: '15',
          left: '0x0',
          right: '0x0',
        },
      },
      '0x3': {
        addr: '0x3',
        type: CType.TREE_NODE,
        is_pointer: false,
        data: {
          value: '35',
          left: '0x0',
          right: '0x0',
        },
      },
    },
    stack: {
      root: {
        addr: '0x1',
        type: CType.TREE_NODE,
        is_pointer: true,
        data: '0x1'
      },
    },
  });

  const [count, setCountState] = useState(100);
  const onSendDummyData = (data: any) => {
    const correctedJsonString = data.replace(/'/g, '"');
    console.log('Data', correctedJsonString);

    const backendStateJson = JSON.parse(correctedJsonString as string);

    // Upddate will handled in this step, rn we use backendState
    setBackendState(data);
  };

  const onGetBreakpoints = useCallback((data: any) => {
    console.log(`Received data:\n`, data);
  }, []);

  const onDisconnect = useCallback(() => {
    console.log('Disconnected!');
  }, []);

  const onMainDebug = useCallback((data: any) => {
    console.log(`Received event onMainDebug:\n`, data);
  }, []);

  // const onSendDummyData = useCallback((data: any) => {
  //   console.log(`Received message: ${data}`);
  // }, []);

  useEffect(() => {
    const onConnect = () => {
      console.log('Connected!');
      console.log('Emitting message to server...');
      socket.emit('mainDebug');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('getBreakpoints', onGetBreakpoints);
    socket.on('sendDummyData', onSendDummyData);
    socket.on('mainDebug', onMainDebug);
    socket.on('sendFunctionDeclaration', (data: any) => {
      console.log(`Received function declaration:\n`, data);
    });
    socket.on('sendTypeDeclaration', (data: any) => {
      console.log(`Received type declaration:\n`, data);
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('getBreakpoints', onGetBreakpoints);
      // socket.off('sendDummyData', onSendDummyData);
    };
  }, [onSendDummyData]);

  const DEBUG_MODE = false;
  return !DEBUG_MODE ? (
    <div className={classNames(globalStyles.root, styles.light)}>
      <div className={styles.layout}>
        <div className={classNames(styles.pane, styles.nav)}>Nav bar</div>
        <div className={classNames(styles.pane, styles.files)}>File tree</div>
        <div className={classNames(styles.pane, styles.editor)}>
          <CodeEditor />
        </div>
        <div className={classNames(styles.pane, styles.inspector)}>
          <Tabs>
            <Tab label="Console">
              <div className={styles.pane}>Console</div>
            </Tab>
            <Tab label="Inspect">
              <div className={styles.pane}>Inspect</div>
            </Tab>
            <Tab label="Configure">
              <div className={styles.pane}>Configure</div>
            </Tab>
          </Tabs>
        </div>
        <div className={classNames(styles.pane, styles.visualiser)}>
          <VisualizerMain
            backendState={backendState}
            getNextState={() => {
              socket.emit('sendDummyData', count.toString());
              setCountState(count + 1);
            }}
          />
        </div>
        <div className={classNames(styles.pane, styles.timeline)}>Timeline</div>
      </div>
    </div>
  ) : (
    <VisualizerMain
      backendState={backendState}
      getNextState={() => {
        socket.emit('sendDummyData', count.toString());
        setCountState(count + 1);
      }}
    />
  );
};

export default DevelopmentMode;
