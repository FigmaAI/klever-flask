import * as React from 'react';

const App = () => {
  const [data, setData] = React.useState(null);
  const [api, setApi] = React.useState('hello2');

  const requestData = () => {
    parent.postMessage({ pluginMessage: { type: 'request-data', api } }, '*');
  };

  const postDocumentData = () => {
    parent.postMessage({ pluginMessage: { type: 'post-document-data' } }, '*');
  };

  const handleApiChange = (event) => {
    setApi(event.target.value);
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
      <select value={api} onChange={handleApiChange}>
        <option value="hello2">hello2</option>
        <option value="hello/world">hello/world</option>
      </select>
      <button onClick={requestData}>Request Data</button>
      <button onClick={postDocumentData}>Post Library Data</button>
      {data && <div>Data: {JSON.stringify(data)}</div>}
    </div>
  );
};

export default App;