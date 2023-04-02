export interface LayerOptions {
  inpoints: number[];
  outpoints: number[];
  speed: number;
  transitions?: boolean;
  transitionStart?: number;
  transitionEnd?: number;
}

export interface LayerSettings {
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

export interface SceneSettings {
  layerDepth?: number;
  breakpoints: number[];
  inpoints: number[];
  composition?: CompositionOptions;
  layers?: LayerOptions[];
  ratio?: number[];
}

export interface PushInOptions {
  composition?: CompositionOptions;
  debug?: boolean;
  layers?: LayerOptions[];
  scene?: SceneSettings;
  selector?: string;
  target?: string;
  scrollTarget?: string;
  mode?: string;
}

export interface PushInSettings {
  composition?: CompositionOptions;
  debug?: boolean;
  layers?: LayerOptions[];
  scene?: SceneSettings;
  selector?: string;
  target?: string;
  scrollTarget?: string;
  mode: string;
}

export interface TargetSettings {
  target?: string;
  scrollTarget?: string;
}

export interface PushInLayer {
  container: HTMLElement;
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
