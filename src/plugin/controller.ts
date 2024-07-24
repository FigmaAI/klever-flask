import { PluginMessage } from '../typings/types';

figma.showUI(__html__, { width: 400, height: 500 });

figma.ui.onmessage = async (msg: PluginMessage) => {
  if (msg.type === 'init') {
    const response = await fetch('http://localhost:5000/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: msg.url, app: figma.root.name }),
    });
    const data = await response.json();
    figma.ui.postMessage({ type: 'response', data });
  } else if (msg.type === 'explore') {
    console.log('Sending explore request with:', msg.taskDesc, msg.personaDesc);
    const response = await fetch('http://localhost:5000/explore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_desc: msg.taskDesc, persona_desc: msg.personaDesc }),
    });
    const data = await response.json();
    figma.ui.postMessage({ type: 'response', data });
  } else if (msg.type === 'stop-exploration') {
    const response = await fetch('http://localhost:5000/stop_exploration', { method: 'POST' });
    const data = await response.json();
    figma.ui.postMessage({ type: 'response', data });
  } else if (msg.type === 'exploration-status') {
    const response = await fetch('http://localhost:5000/exploration_status');
    const data = await response.json();
    figma.ui.postMessage({ type: 'response', data });
  }
};
