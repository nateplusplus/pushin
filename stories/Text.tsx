import React, { useRef, useLayoutEffect } from 'react';
import { PushIn } from '../dist/esm/pushin';
import './pushin.css';

export const Text = ({ layer1, layer2, layer3, layer4 }) => {
  const pushInContainer = useRef();

  useLayoutEffect(() => {
    const pushIn = new PushIn(pushInContainer.current);
    pushIn.start();

    return () => pushIn.destroy();
  });

  return (
    <div className="pushin" ref={pushInContainer}>
      <div className="pushin-scene">
        {layer1 && (
          <div key="layer1" className="pushin-layer">
            <span dangerouslySetInnerHTML={{ __html: layer1 }} />
          </div>
        )}
        {layer2 && (
          <div key="layer2" className="pushin-layer">
            <span dangerouslySetInnerHTML={{ __html: layer2 }} />
          </div>
        )}
        {layer3 && (
          <div key="layer3" className="pushin-layer">
            <span dangerouslySetInnerHTML={{ __html: layer3 }} />
          </div>
        )}
        {layer4 && (
          <div key="layer4" className="pushin-layer">
            <span dangerouslySetInnerHTML={{ __html: layer4 }} />
          </div>
        )}
      </div>
    </div>
  );
};
