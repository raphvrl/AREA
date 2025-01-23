// src/types/area.ts
export interface Action {
  id: string;
  service: string;
  type: string;
  description: string;
  config?: any;
}

export interface Reaction {
  id: string;
  service: string;
  type: string;
  description: string;
  config?: any;
}

export interface Area {
  id: string;
  name: string;
  action: {
    service: string;
    type: string;
    description: string;
  };
  reaction: {
    service: string;
    type: string;
    description: string;
  };
  isActive: boolean;
}