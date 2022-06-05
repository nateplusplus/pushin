export interface LayerOptions {
  inpoints: number[];
  outpoints: number[];
  speed: number;
}

export interface SceneOptions {
  speedDelta?: number;
  layerDepth?: number;
  transitionLength?: number;
  breakpoints: number[];
  inpoints: number[];
  layers?: LayerOptions[];
  fixedRatio?: number[];
}

export interface PushInOptions {
  debug?: boolean;
  target?: HTMLElement;
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
  inpoint: number;
  outpoint: number;
  speed: number;
}

export interface CompositionOptions {
  isFixed: boolean;
  ratio?: number[];
}
