export interface Action {
  id: string;
  service: string;
  type: string;
  description: string;
  hasOptions?: boolean; // Add this optional property
  config?: any;
}

export interface Reaction {
  id: string;
  service: string;
  type: string;
  description: string;
  hasOptions?: boolean; // Add this optional property like in Action interface
  config?: any;
}

export interface Area {
  id: string;
  name: string;
  isActive: boolean;
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
}
