import styles from 'styles/DevelopmentModeNavBar.module.css';
import dialogStyles from 'styles/Dialog.module.css';
import logo from 'assets/img/logo.png';
import BookIcon from '@mui/icons-material/Book';
import classNames from 'classnames';
import { Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { VisualizerType } from 'visualiser-debugger/Types/visualizerType';
import { useGlobalStore } from 'visualiser-debugger/Store/globalStateStore';
import VisualiserConfiguration from './VisualiserConfiguration';

type AnnotationFieldType = {
  name: VisualizerType;
};

const visTypes: AnnotationFieldType[] = [
  {
    name: VisualizerType.LINKED_LIST,
  },
  {
    name: VisualizerType.BINARY_TREE,
  },
  // Add more later
];

const DevelopmentModeNavbar = ({
  onButtonClick,
}: {
  onButtonClick: (event: React.MouseEvent<HTMLElement>) => void;
}) => {
  const [visualiserSelected, setVisualiserSelected] = useState(VisualizerType.LINKED_LIST);

  useEffect(() => {
    useGlobalStore.getState().setVisualizerType(visualiserSelected);
  }, [visualiserSelected]);

  return (
    <div className={styles.navBar}>
      <div className={styles.navItem}>
        <img src={logo} alt="logo" height="30px" />
        <span>
          <h4>Structs.sh</h4>
        </span>
      </div>
      <div style={{ marginLeft: '81vw' }} />
      <Tooltip title="Start Onboarding">
        <button
          className={classNames(dialogStyles.OnboardingButton, 'onboardingButton')}
          onClick={onButtonClick}
          type="button"
          aria-label="Start Onboardings"
        >
          <BookIcon />
        </button>
      </Tooltip>
      <div style={{ marginLeft: '1vw' }} />
      <div>
        <VisualiserConfiguration fields={visTypes} handleUpdateAnnotation={setVisualiserSelected} />
      </div>
    </div>
  );
};

export default DevelopmentModeNavbar;
