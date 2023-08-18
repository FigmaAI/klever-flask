figma.showUI(__html__, { width: 400, height: 400 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'request-data') {
    const serverUrl = 'http://localhost:8888/hello/world'; 
    try {
      const response = await fetch(serverUrl);
      // Check if the response is ok before trying to parse it as JSON
      if (response.ok) {
        const data = await response.json();
        figma.ui.postMessage({ type: 'response-data', data });
      } else {
        console.error('Server response was not ok');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
};