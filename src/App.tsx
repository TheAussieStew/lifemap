import { motion } from 'framer-motion';
import * as React from 'react';
import { Qi } from './core/Qi';
import { Group } from './view/structure/Group';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import '@fontsource/public-sans';

const App = () => {
  return (
    <React.StrictMode>
      <HelmetProvider>
        <Helmet>
          <title>Hello World</title>
          <script defer src="//unpkg.com/mathlive"></script>
        </Helmet>
        <motion.div style={{ margin: 10 }}>
          <Group lens={'verticalArray'}>
            <Qi qiId={'000000'} userId={'000000'} />
          </Group>
        </motion.div>
      </HelmetProvider>
    </React.StrictMode>
  );
};

export default App;
