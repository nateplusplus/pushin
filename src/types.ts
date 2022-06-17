export interface LayerOptions {
  inpoints: number[];
  outpoints: number[];
  speed: number;
  transitions?: boolean;
  transitionStart?: number;
  transitionEnd?: number;
}

export interface CompositionOptions {
  ratio?: number[];
}

export interface SceneOptions {
  layerDepth?: number;
  breakpoints: number[];
  inpoints: number[];
  composition?: CompositionOptions;
  layers?: LayerOptions[];
  ratio?: number[];
}

export interface PushInOptions {
  debug?: boolean;
  target?: string;
  composition?: CompositionOptions;
  layers?: LayerOptions[];
  scene?: SceneOptions;
}

export interface PushInLayer {
  element: HTMLElement;
  index: number;
  originalScale: number;
}

export interface LayerRef {
  inpoints: number[];
  outpoints: number[];
  speed: number;
}

export interface LayerParams {
  depth: number;
  inpoint: number;
  outpoint: number;
  overlap: number;
  speed: number;
  transitions: boolean;
  transitionStart: number;
  transitionEnd: number;
}
