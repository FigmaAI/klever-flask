import * as React from 'react';

const App = () => {
  const [data, setData] = React.useState(null);

  const getData = () => {
    setData(null);
    parent.postMessage({ pluginMessage: { type: 'get-data' } }, '*');
  };

  const postData = () => {
    setData(null);
    parent.postMessage({ pluginMessage: { type: 'post-data' } }, '*');
  };

  const requestRico = () => {
    setData(null);
    parent.postMessage({ pluginMessage: { type: 'request-rico' } }, '*');
  };

  const generateMappingTable = () => {
    setData(null);
    parent.postMessage({ pluginMessage: { type: 'generate-mapping-table' } }, '*');
  };

  const requestFigmaFile = () => {
    setData(null);
    parent.postMessage({ pluginMessage: { type: 'request-figma-file' } }, '*');
  };


  React.useEffect(() => {
    function handleMessage(event) {
      if (event.data.pluginMessage.type === 'response-data') {
        setData(event.data.pluginMessage.data);
      }
      if (event.data.pluginMessage.type === 'response-post') {
        setData(event.data.pluginMessage.data);
      }
      if (event.data.pluginMessage.type === 'response-rico') {
        setData(event.data.pluginMessage.data);
      }
      if (event.data.pluginMessage.type === 'response-mapping') {
        setData(event.data.pluginMessage.data);
      }
      if (event.data.pluginMessage.type === 'response-figma-file') {
        setData(event.data.pluginMessage.data);
      }
    }

    window.addEventListener('message', handleMessage);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={getData}>Test if API is working (GET)</button>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={postData}>Extract design library information (POST)</button>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={requestRico}>Extract annotation information from RICO (POST)</button>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={generateMappingTable}>Generate mapping table (POST)</button>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={requestFigmaFile}>Request Figma File</button>
      </div>
      {data && <div>Data: {JSON.stringify(data)}</div>}
    </div>
  );
};

export default App;