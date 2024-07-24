// types.ts

export interface ServerResponse {
    status: string;
    message: string;
  }
  
  export interface ExploreMessage {
    type: 'explore';
    taskDesc: string;
    personaDesc: string;
  }
  
  export interface InitMessage {
    type: 'init';
    url: string;
  }
  
  export type PluginMessage = ExploreMessage | InitMessage | { type: 'stop-exploration' } | { type: 'exploration-status' };
  