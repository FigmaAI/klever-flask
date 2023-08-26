// type DesignSystemNode = ComponentNode | ComponentSetNode;

figma.showUI(__html__, { width: 400, height: 400 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'get-data') {
    const serverUrl = `http://127.0.0.1:5000/api/get`;
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
  } else if (msg.type === 'post-data') {
    const serverUrl = 'http://127.0.0.1:5000/api/post';

    // Find all ComponentSet and Component nodes in the Figma file
    const nodes = figma.root.findAll((node) => node.type === 'COMPONENT_SET') as ComponentSetNode[];
    // console.log(nodes.slice(0, 5));

    // Extract the id, key, and name from each node
    const nodeData = nodes.map((node) => ({
      id: node.id,
      name: node.name,
      path: getNodePath(node),
      description: node.description,
      documentationLinks: node.documentationLinks,
      key: node.key,
      componentPropertyDefinitions: node.componentPropertyDefinitions,
      width: node.width,
      height: node.height,
    }));

    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes: nodeData }), // Send the extracted data
      });

      const data = {
        status: response.status,
        statusText: response.statusText,
      };

      figma.ui.postMessage({ type: 'response-post', data });
    } catch (error) {
      console.error('Error:', error);
    }
  } else if (msg.type === 'request-rico') {
    const serverUrl = 'http://127.0.0.1:5000/api/rico';

    // send post request to server without any data
    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Parse the error message
        const error = await response.json();
        // Notify the user with a link to download the dataset
        figma.notify(`${error.error}. ${error.link}`);
      } else {
        const data = {
          status: response.status,
          statusText: response.statusText,
        };

        figma.ui.postMessage({ type: 'response-rico', data });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  } else if (msg.type === 'generate-llm-response') {
    const serverUrl = 'http://127.0.0.1:5000/api/generate';

    // Extract the system and user prompts from the message
    const { system, user } = msg;

    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ system, user }), // Send the prompts
      });

      if (response.ok) {
        const data = await response.json();
        figma.ui.postMessage({ type: 'response-llm', data });
      } else {
        console.error('Server response was not ok');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  } else if (msg.type === 'generate-mapping-table') {
    const serverUrl = 'http://127.0.0.1:5000/api/generateMappingTable';

    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        figma.ui.postMessage({ type: 'response-mapping', data });
      } else {
        const error = await response.json();
        figma.notify(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      figma.notify(`Error: ${error.message}`);
    }
  }
};

// Recursive function to get the path of a node
function getNodePath(node: SceneNode): string {
  // If the parent is a PageNode, return the node's name
  if (node.parent && node.parent.type === 'PAGE') {
    return node.parent.name + '/' + node.name;
  }
  // If the parent is a SceneNode (but not a PageNode), prepend the parent's name and recurse
  else if (node.parent && 'name' in node.parent) {
    return getNodePath(node.parent as SceneNode) + '/' + node.name;
  }
  // If the node has no parent, return the node's name
  else {
    return node.name;
  }
}
