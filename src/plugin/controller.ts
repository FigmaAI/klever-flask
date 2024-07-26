import { PluginMessage } from '../typings/types';
import { createTaskFrame, createText, createNameFrame, getOrCreateUTReportsFrame } from './FigmaUtils';

let reportPollingInterval: number | null = null;
let taskFrame: FrameNode | null = null;

async function loadFonts() {
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
}

// function parseReport(content: string) {
//   const rounds = content.split(/^## Round \d+$/m).slice(1);
//   return rounds.map(parseRound);
// }

// function parseRound(roundContent: string) {
//   const imageRegex = /!\[.*?\]\((.*?)\)/g;
//   const observationRegex = /### Observation:\n\n([\s\S]*?)(?=\n###|$)/;
//   const thoughtBeforeRegex = /### Thought:\n\n([\s\S]*?)(?=\n###|$)/;
//   const actionRegex = /### Action:\n\n([\s\S]*?)(?=\n###|$)/;
//   const summaryRegex = /### Summary:\n\n([\s\S]*?)(?=\n###|$)/;
//   const decisionRegex = /### Decision:\n\n([\s\S]*?)(?=\n###|$)/;
//   const thoughtAfterRegex = /### Thought:\n\n([\s\S]*?)$/;

//   const images = [...roundContent.matchAll(imageRegex)].map((match) => match[1]);
//   const observation = observationRegex.exec(roundContent)?.[1].trim();
//   const thoughtBefore = thoughtBeforeRegex.exec(roundContent)?.[1].trim();
//   const action = actionRegex.exec(roundContent)?.[1].trim();
//   const summary = summaryRegex.exec(roundContent)?.[1].trim();
//   const decision = decisionRegex.exec(roundContent)?.[1].trim();
//   const thoughtAfter = thoughtAfterRegex.exec(roundContent)?.[1].trim();

//   return {
//     images,
//     observation,
//     thoughtBefore,
//     action,
//     summary,
//     decision,
//     thoughtAfter,
//   };
// }

// async function createRoundElement(round: ReturnType<typeof parseRound>, roundCount: number) {
//   const anatomyFrame = createAnatomyFrame(roundCount);
//   const previewFrame = createPreviewFrame();
//   anatomyFrame.appendChild(previewFrame);

//   for (const imagePath of round.images) {
//     const image = await figma.createImageAsync(imagePath);
//     const { width, height } = await image.getSizeAsync();
//     const imageFrame = createImageFrameFromHash(image.hash, width, height);
//     previewFrame.appendChild(imageFrame);
//   }

//   previewFrame.appendChild(createTextFrame('Observation', round.observation));
//   previewFrame.appendChild(createTextFrame('Thought', round.thoughtBefore));
//   previewFrame.appendChild(createTextFrame('Action', round.action));
//   previewFrame.appendChild(createTextFrame('Summary', round.summary));
//   previewFrame.appendChild(createTextFrame('Decision', round.decision));
//   previewFrame.appendChild(createTextFrame('Thought', round.thoughtAfter));

//   return anatomyFrame;
// }

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

// function createReportLayout(content: string): FrameNode {
//   const titleMatch = content.match(/# (.+)/);
//   const taskNameMatch = content.match(/^(.+)$/m);
//   const taskDescMatch = content.match(/## Task Description\n\n(.+)/);

//   const reportFrame = figma.createFrame();
//   reportFrame.name = taskNameMatch[1];

//   if (titleMatch) {
//     const titleText = figma.createText();
//     titleText.characters = titleMatch[1];
//     titleText.fontSize = 24;
//     reportFrame.appendChild(titleText);
//   }

//   if (taskNameMatch) {
//     const taskNameText = figma.createText();
//     taskNameText.characters = taskNameMatch[1];
//     taskNameText.fontSize = 18;
//     reportFrame.appendChild(taskNameText);
//   }

//   if (taskDescMatch) {
//     const taskDescText = figma.createText();
//     taskDescText.characters = 'Task Description: ' + taskDescMatch[1];
//     taskDescText.fontSize = 16;
//     reportFrame.appendChild(taskDescText);
//   }

//   return reportFrame;
// }

async function handleReportUpdate(content: string) {
  await loadFonts();

  const lines = content.split('\n');
  const taskName = lines[1].trim();
  const title = lines[0].replace('# ', '').trim();

  const utReportsFrame = await getOrCreateUTReportsFrame();

  if (!taskFrame) {
    taskFrame = createTaskFrame(taskName);
    utReportsFrame.appendChild(taskFrame);
  } else {
    taskFrame.name = taskName;
  }

  // clear existing children
  taskFrame.children.forEach((child) => child.remove());

  const nameFrame = createNameFrame(title);
  taskFrame.appendChild(nameFrame);

  const contentText = createText(content, 12, 'Regular');
  taskFrame.appendChild(contentText);

  // const rounds = parseReport(content);
  // for (let i = 0; i < rounds.length; i++) {
  //   const roundElement = await createRoundElement(rounds[i], i + 1);
  //   reportFrame.appendChild(roundElement);
  // }

  figma.viewport.scrollAndZoomIntoView([utReportsFrame]);
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
