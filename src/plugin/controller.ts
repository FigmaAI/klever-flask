import { PluginMessage } from '../typings/types';
import {
  createTaskFrame,
  createRoundElement,
  createNameFrame,
  createTaskDescFrame,
  getOrCreateUTReportsFrame,
  parseReportContent,
} from './FigmaUtils';

let reportPollingInterval: number | null = null;
let taskFrame: FrameNode | null = null;

async function loadFonts() {
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
}

function startPollReport() {
  if (reportPollingInterval === null) {
    reportPollingInterval = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:5000/get_report');
        const data = await response.json();
        if (data.status === 'success') {
          handleReportUpdate(data.content);
        }
      } catch (error) {
        console.error('Error polling report:', error);
      }
    }, 30000);
  }
}

function stopPollReport() {
  if (reportPollingInterval !== null) {
    clearInterval(reportPollingInterval);
    reportPollingInterval = null;
  }
}

async function handleReportUpdate(content: string) {
  await loadFonts();

  const parsedContent = parseReportContent(content);

  const utReportsFrame = await getOrCreateUTReportsFrame();

  if (!taskFrame) {
    taskFrame = createTaskFrame(parsedContent.taskName);
    utReportsFrame.appendChild(taskFrame);
  } else {
    taskFrame.name = parsedContent.taskName;
  }

  // Clear existing children
  taskFrame.children.forEach((child) => child.remove());

  const nameFrame = createNameFrame(parsedContent.title);
  taskFrame.appendChild(nameFrame);

  const taskDescFrame = createTaskDescFrame(parsedContent.taskDesc, parsedContent.personaDesc);
  taskFrame.appendChild(taskDescFrame);

  for (let i = 0; i < parsedContent.rounds.length; i++) {
    const roundData = await parsedContent.rounds[i];
    const roundElement = await createRoundElement(roundData, i + 1);
    taskFrame.appendChild(roundElement);
  }
  
  figma.viewport.scrollAndZoomIntoView([taskFrame]);
}

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

    // start polling for report after sending explore request to server
    setTimeout(() => {
      startPollReport();
    }, 5000);
  } else if (msg.type === 'stop-exploration') {
    const response = await fetch('http://localhost:5000/stop_exploration', { method: 'POST' });
    const data = await response.json();
    figma.ui.postMessage({ type: 'response', data });
    stopPollReport();
  } else if (msg.type === 'exploration-status') {
    const response = await fetch('http://localhost:5000/exploration_status');
    const data = await response.json();
    figma.ui.postMessage({ type: 'response', data });
  }
};
