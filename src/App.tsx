import { motion } from 'framer-motion';
import * as React from 'react';
import { Qi } from './core/Qi';
import { Group } from './view/structure/Group';

const App = () => {
  return (
    <React.StrictMode>
      <motion.div style={{ margin: 10 }}>
        <Group lens={'verticalArray'}>
          <Qi qiId={'000000'} userId={'000000'} />
        </Group>
      </motion.div>
    </React.StrictMode>
  );
};

export default App;
