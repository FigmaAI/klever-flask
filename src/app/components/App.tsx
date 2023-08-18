import * as React from 'react';

const App = () => {
  const [data, setData] = React.useState(null);

  const requestData = () => {
    parent.postMessage({ pluginMessage: { type: 'request-data' } }, '*');
  };

  React.useEffect(() => {
    function handleMessage(event) {
      if (event.data.pluginMessage.type === 'response-data') {
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
    <div>
      <button onClick={requestData}>Request Data</button>
      {data && <div>Data: {JSON.stringify(data)}</div>}
    </div>
  );
};

export default App;