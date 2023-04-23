import React, { useRef, useLayoutEffect } from 'react';
import { PushIn } from '../dist/esm/pushin';

export const Modes = ({ options, modeAttr = '' }) => {
  const pushInContainer = useRef();

  useLayoutEffect(() => {
    const pushIn = new PushIn(pushInContainer.current, options);
    pushIn.start();

    return () => pushIn.destroy();
  });

  const pushInAttr = {};
  if (modeAttr !== '') {
    pushInAttr['data-pushin-mode'] = modeAttr;
  }

  return (
    <div className="pushin" ref={pushInContainer} {...pushInAttr}>
      <div className="pushin-scene">
        <div key="layer1" className="pushin-layer">
          <span
            style={{
              position: 'absolute',
              top: options.mode === 'sequential' ? 'initial' : '35%',
            }}
          >
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          </span>
        </div>
        <div key="layer2" className="pushin-layer">
          <span>
            Mollitia hic non, at tempora saepe doloremque, voluptatem provident.
          </span>
        </div>
        <div key="layer3" className="pushin-layer">
          <span
            style={{
              position: 'absolute',
              top: options.mode === 'sequential' ? 'initial' : '60%',
            }}
          >
            Reprehenderit nisi perspiciatis facilis sint repudiandae totam
            praesentium dignissimos consequuntur tenetur.
          </span>
        </div>
      </div>
    </div>
  );
};
