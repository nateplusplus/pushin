import React, { useRef, useLayoutEffect } from 'react';
import { PushIn } from '../dist/esm/pushin';

export const AutoStart = () => {
  const pushInContainer = useRef();

  useLayoutEffect(() => {
    const pushIn = new PushIn(pushInContainer.current, {
      target: '#target',
      scrollTarget: 'window',
    });
    pushIn.start();

    return () => pushIn.destroy();
  });

  return (
    <div>
      <div
        style={{
          maxWidth: '300px',
          margin: '0 auto',
        }}
      >
        <h1>AutoStart</h1>
        <p>
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
        <p>
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
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae
          incidunt et harum dignissimos alias similique tempore! Nemo quisquam
          tenetur cumque tempore porro velit libero odit dolorum eligendi
          maiores, eius magnam.
        </p>
      </div>
      <div id="target" style={{ height: '300px' }}>
        <div className="pushin" ref={pushInContainer}>
          <div className="pushin-scene">
            <div key="layer1" className="pushin-layer">
              <span>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              </span>
            </div>
            <div key="layer2" className="pushin-layer">
              <span>
                Mollitia hic non, at tempora saepe doloremque, voluptatem
                provident.
              </span>
            </div>
            <div key="layer3" className="pushin-layer">
              <span>
                Reprehenderit nisi perspiciatis facilis sint repudiandae totam
                praesentium dignissimos consequuntur tenetur.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
