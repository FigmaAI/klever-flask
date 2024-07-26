export function createText(characters: string, fontSize: number, fontStyle: 'Regular' | 'Bold'): TextNode {
  const text = figma.createText();
  text.characters = characters;
  text.fontSize = fontSize;
  text.fontName = { family: 'Inter', style: fontStyle };
  text.textAutoResize = 'WIDTH_AND_HEIGHT';
  return text;
}

export function createTextFrame(title: string, content: string): FrameNode {
  const frame = figma.createFrame();
  frame.name = title;

  const titleText = createText(title, 32, 'Bold');

  // decode 'content' e.g. "To complete the task of booking a ride, I need to tap the \"Book JustGrab\" button." -> "To complete the task of booking a ride, I need to tap the "Book JustGrab" button."
  const decodedContent = content.replace(/\\(.)/g, '$1');
  const contentText = createText(decodedContent, 24, 'Regular');

  frame.appendChild(titleText);
  frame.appendChild(contentText);

  // set auto-layouy and maxWidth 1000px
  frame.layoutMode = 'VERTICAL';
  frame.itemSpacing = 16;
  frame.counterAxisSizingMode = 'FIXED';
  frame.resize(1000, frame.height);
  frame.primaryAxisSizingMode = 'AUTO';
  // Set background color to transparent
  frame.fills = [];

  titleText.layoutSizingHorizontal = 'FILL';
  contentText.layoutSizingHorizontal = 'FILL';

  return frame;
}

// create a frame with a title and a content
export async function getOrCreateUTReportsFrame() {
  let frame = figma.currentPage.findOne((n) => n.type === 'FRAME' && n.name === 'UT Reports') as FrameNode;
  if (!frame) {
    frame = createUTReportsFrame();
    figma.currentPage.appendChild(frame);
  }
  return frame;
}

export function createUTReportsFrame() {
  const frame = figma.createFrame();
  frame.name = 'UT Reports';
  frame.layoutMode = 'HORIZONTAL';
  frame.itemSpacing = 128;
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.cornerRadius = 16;
  const maxX = figma.currentPage.children.reduce((max, node) => Math.max(max, node.x + node.width), 0);
  frame.x = maxX + 100;
  frame.y = 0;
  return frame;
}

export function createTaskFrame(taskName: string) {
  const frame = figma.createFrame();
  frame.name = taskName;
  frame.layoutMode = 'VERTICAL';
  frame.itemSpacing = 64;
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  return frame;
}

export function createNameFrame(nodeName: string) {
  const frame = figma.createFrame();
  frame.name = 'Name';
  frame.layoutMode = 'HORIZONTAL';
  frame.paddingTop = frame.paddingBottom = frame.paddingLeft = frame.paddingRight = 64;
  frame.cornerRadius = 16;
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';

  const text = figma.createText();
  text.characters = nodeName;
  text.fontSize = 64;
  text.fontName = { family: 'Inter', style: 'Bold' };
  text.textAutoResize = 'WIDTH_AND_HEIGHT';
  frame.appendChild(text);

  return frame;
}

export function createTaskDescFrame(taskDesc: string, personaDesc?: string) {
  const frame = figma.createFrame();
  frame.name = 'task_desc';
  frame.layoutMode = 'VERTICAL';
  frame.paddingTop = frame.paddingBottom = frame.paddingLeft = frame.paddingRight = 64;
  frame.itemSpacing = 48;
  frame.cornerRadius = 16;
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';

  const titleText = createText('Task Description', 48, 'Bold');
  frame.appendChild(titleText);

  const descText = createText(taskDesc, 24, 'Regular');
  frame.appendChild(descText);

  if (personaDesc) {
    const personaText = createText(`As a person who is ${personaDesc}`, 24, 'Regular');
    frame.appendChild(personaText);
  }

  return frame;
}

export function createAnatomyFrame(roundCount: number): FrameNode {
  const frame = figma.createFrame();
  frame.name = 'anatomy';
  frame.layoutMode = 'VERTICAL';
  frame.paddingTop = frame.paddingBottom = frame.paddingLeft = frame.paddingRight = 64;
  frame.itemSpacing = 32;
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';

  const titleText = createText(`Round ${roundCount}`, 48, 'Bold');
  frame.appendChild(titleText);

  return frame;
}

export function createPreviewFrame(): FrameNode {
  const frame = figma.createFrame();
  frame.name = 'preview';
  frame.layoutMode = 'HORIZONTAL';
  frame.paddingTop = frame.paddingBottom = frame.paddingLeft = frame.paddingRight = 64;
  frame.itemSpacing = 64;
  frame.fills = [{ type: 'SOLID', color: { r: 0.8667, g: 0.8667, b: 0.8667 } }]; // 배경색 #ddd 설정
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  return frame;
}

export async function addNodeImageToPreviewFrame(
  node: SceneNode
): Promise<{ imageHash: string; imageBytes: Uint8Array }> {
  const imageBytes = await node.exportAsync({ format: 'PNG' });
  const imageHash = figma.createImage(imageBytes).hash;
  return { imageHash, imageBytes };
}

export function createImageFrameFromHash(
  imageHash: string,
  width: number,
  height: number,
): FrameNode {
  const imageFrame = figma.createFrame();
  const imageNode = figma.createRectangle();
  imageNode.fills = [{ type: 'IMAGE', scaleMode: 'FILL', imageHash }];
  imageNode.resize(width, height);

  imageFrame.appendChild(imageNode);
  imageFrame.resize(width, height);

  return imageFrame;
}
