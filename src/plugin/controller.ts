figma.showUI(__html__, { width: 400, height: 400 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'request-data') {
    const serverUrl = `http://127.0.0.1:5000/${msg.api}`;
    try {
      const response = await fetch(serverUrl);
      if (response.ok) {
        const data = await response.json();
        figma.ui.postMessage({ type: 'response-data', data });
      } else {
        console.error('Server response was not ok');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  } else if (msg.type === 'post-document-data') {
    const serverUrl = 'http://127.0.0.1:5000/post';

    // Get document name
    const documentName = figma.root.name;


    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentName}),
      });
      if (response.ok) {
        if (response.status !== 204) {
          const data = await response.json();
          figma.ui.postMessage({ type: 'response-post', data });
        } else {
          figma.ui.postMessage({ type: 'response-post', data: 'No Content' });
        }
      } else {
        console.error('Server response was not ok');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
};