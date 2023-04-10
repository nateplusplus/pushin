import React, { useRef, useLayoutEffect } from 'react';
import { PushIn } from '../dist/esm/pushin';

export const AutoStart = ({ settings, useAttr }) => {
  const pushInContainer = useRef();

  useLayoutEffect(() => {
    const pushIn = new PushIn(pushInContainer.current, {
      target: '#target',
      scrollTarget: 'window',
      ...settings,
    });
    pushIn.start();

    return () => pushIn.destroy();
  });

  const pushInAttr = {};
  if (useAttr) {
    pushInAttr['data-pushin-auto-start'] = useAttr;
  }

  return (
    <div>
      <div
        style={{
          maxWidth: '300px',
          margin: '0 auto',
        }}
      >
        <h1>AutoStart</h1>
        <p style={{ marginBottom: '80px' }}>
          Scroll down to confirm that the animation starts just before the
          pushIn effect is visible on the screen.
        </p>
        <h2>Lorem Ipsum</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae
          incidunt et harum dignissimos alias similique tempore! Nemo quisquam
          tenetur cumque tempore porro velit libero odit dolorum eligendi
          maiores, eius magnam.
        </p>
        <p style={{ marginBottom: '80px' }}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae
          incidunt et harum dignissimos alias similique tempore! Nemo quisquam
          tenetur cumque tempore porro velit libero odit dolorum eligendi
          maiores, eius magnam.
        </p>
        <h2>Lorem Ipsum</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae
          incidunt et harum dignissimos alias similique tempore! Nemo quisquam
          tenetur cumque tempore porro velit libero odit dolorum eligendi
          maiores, eius magnam.
        </p>
        <p style={{ marginBottom: '80px' }}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae
          incidunt et harum dignissimos alias similique tempore! Nemo quisquam
          tenetur cumque tempore porro velit libero odit dolorum eligendi
          maiores, eius magnam.
        </p>
        <h2>Lorem Ipsum</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae
          incidunt et harum dignissimos alias similique tempore! Nemo quisquam
          tenetur cumque tempore porro velit libero odit dolorum eligendi
          maiores, eius magnam.
        </p>
        <p style={{ marginBottom: '80px' }}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae
          incidunt et harum dignissimos alias similique tempore! Nemo quisquam
          tenetur cumque tempore porro velit libero odit dolorum eligendi
          maiores, eius magnam.
        </p>
      </div>
      <div id="target" style={{ backgroundColor: '#EEE' }}>
        <div className="pushin" ref={pushInContainer} {...pushInAttr}>
          <div className="pushin-scene">
            <div key="layer1" className="pushin-layer">
              <h2 style={{ position: 'absolute', left: '35%' }}>Slide 1</h2>
            </div>
            <div key="layer2" className="pushin-layer">
              <h2>Slide 2</h2>
            </div>
            <div key="layer3" className="pushin-layer">
              <h2 style={{ position: 'absolute', left: '60%' }}>Slide 3</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
