export interface LayerOptions {
  inpoints: number[];
  outpoints: number[];
  speed: number;
  isFirst: boolean;
  isLast: boolean;
  transitions?: boolean;
  transitionStart?: number;
  transitionEnd?: number;
  tabInpoints?: number[];
}

export interface LayerSettings {
  inpoints: number[];
  outpoints: number[];
  speed: number;
  isFirst: boolean;
  isLast: boolean;
  transitions?: boolean;
  transitionStart?: number;
  transitionEnd?: number;
}

export interface CompositionOptions {
  ratio?: number[];
}

export interface SceneOptions {
  layerDepth?: number;
  breakpoints?: number[];
  inpoints?: number[];
  composition?: CompositionOptions;
  layers?: LayerOptions[];
  ratio?: number[];
}

export interface SceneSettings {
  breakpoints: number[];
  inpoints: number[];
  layers: LayerOptions[];
  layerDepth?: number;
  composition?: CompositionOptions;
  ratio?: number[];
  autoStart?: string;
  length?: number;
}

export interface PushInOptions {
  composition?: CompositionOptions;
  debug?: boolean;
  layers?: LayerOptions[];
  scene?: SceneOptions;
  selector?: string;
  target?: string;
  scrollTarget?: string;
  mode?: string;
  autoStart?: string;
  length?: number;
}

export interface PushInSettings {
  mode: string;
  composition?: CompositionOptions;
  debug?: boolean;
  layers?: LayerOptions[];
  selector?: string;
  target?: string;
  scrollTarget?: string;
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
  tabInpoints: number[];
}

export interface LayerParams {
  depth: number;
  inpoint: number;
  outpoint: number;
  tabInpoint: number;
  overlap: number;
  speed: number;
  transitions: boolean;
  transitionStart: number;
  transitionEnd: number;
}
