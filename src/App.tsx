import * as React from 'react';
import { Qi } from './core/Qi';
import { Group } from './view/structure/Group';

const App = () => {
  return (
    <React.StrictMode>
      <Group lens={'verticalArray'}>
        <Qi qiId={'000000'} userId={'000000'}/>
      </Group>
    </React.StrictMode>
  );
};

export default App;
