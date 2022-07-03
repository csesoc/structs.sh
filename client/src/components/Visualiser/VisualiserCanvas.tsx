import React from 'react';
import { Box } from '@mui/material';

/* -------------------------------------------------------------------------- */
/*                        Visualiser-Specific Canvases                        */
/* -------------------------------------------------------------------------- */

/**
 * The React component that renders the DOM elements that the visualiser
 * attaches itself to.
 */
const VisualiserCanvas: React.FC = () => (
  <Box id="visualiser-container" sx={{ height: '92vh', background: '#EBE8F4' }}>
    <svg id="visualiser-canvas" />
  </Box>
);

export default VisualiserCanvas;
