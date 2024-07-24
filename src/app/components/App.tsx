import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';

import { ServerResponse } from '../../typings/types';

const App = () => {
  const [data, setData] = React.useState<ServerResponse | null>(null);
  const [url, setUrl] = React.useState('');
  const [taskDesc, setTaskDesc] = React.useState('');
  const [personaDesc, setPersonaDesc] = React.useState('');

  const handleInit = () => {
    parent.postMessage({ pluginMessage: { type: 'init', url } }, '*');
  };

  const handleExplore = () => {
    parent.postMessage({ pluginMessage: { type: 'explore', taskDesc, personaDesc } }, '*');
  };

  const handleStop = () => {
    parent.postMessage({ pluginMessage: { type: 'stop-exploration' } }, '*');
  };

  const handleStatus = () => {
    parent.postMessage({ pluginMessage: { type: 'exploration-status' } }, '*');
  };

  React.useEffect(() => {
    window.onmessage = (event) => {
      const { type, data } = event.data.pluginMessage;
      if (type === 'response') {
        setData(data);
      }
    };
  }, []);

  return (
    <CssVarsProvider>
      <Sheet sx={{ maxWidth: 400, mx: 'auto', my: 4, py: 3, px: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography level="h4" component="h1">
          Figma Explorer
        </Typography>
        <FormControl>
          <FormLabel>Figma URL</FormLabel>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter Figma URL"
          />
        </FormControl>
        <Button onClick={handleInit}>Initialize</Button>
        <FormControl>
          <FormLabel>Task Description</FormLabel>
          <Input
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            placeholder="Enter task description"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Persona Description</FormLabel>
          <Input
            value={personaDesc}
            onChange={(e) => setPersonaDesc(e.target.value)}
            placeholder="Enter persona description"
          />
        </FormControl>
        <Stack direction="row" spacing={1}>
          <Button onClick={handleExplore}>Start Exploration</Button>
          <Button onClick={handleStop} color="danger">Stop Exploration</Button>
          <Button onClick={handleStatus} variant="outlined">Check Status</Button>
        </Stack>
        {data && (
          <Sheet variant="outlined" sx={{ mt: 2, p: 2 }}>
            <Typography component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(data, null, 2)}
            </Typography>
          </Sheet>
        )}
      </Sheet>
    </CssVarsProvider>
  );
};

export default App;
