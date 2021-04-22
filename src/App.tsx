import hljs from 'highlight.js';
import 'highlight.js/styles/stackoverflow-dark.css';
import React, { useCallback, useEffect, useRef } from 'react';
import { Remarkable } from 'remarkable';
import './App.css';
import useWindowDimensions from './useWindowDimensions';

function App() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rawRef = useRef<HTMLTextAreaElement>(null);
  const htmlRef = useRef<HTMLDivElement>(null);

  const mdRef = useRef(
    // https://github.com/jonschlinkert/remarkable#syntax-highlighting
    new Remarkable({
      highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (err) {}
        }

        try {
          return hljs.highlightAuto(str).value;
        } catch (err) {}

        return ''; // use external default escaping
      }
    })
  );

  const { height: windowHeight } = useWindowDimensions();

  const modifyCode = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (htmlRef.current) {
        htmlRef.current.innerHTML = mdRef.current.render(e.target.value);

        htmlRef.current
          .querySelectorAll('pre code')
          .forEach(block => hljs.highlightBlock(block as HTMLElement));
      }
    },
    []
  );

  useEffect(() => {
    if (rawRef.current) rawRef.current.focus();
  }, []);

  useEffect(() => {
    if (wrapperRef.current)
      wrapperRef.current.style.height = `${windowHeight}px`;
  }, [windowHeight]);

  return (
    <div ref={wrapperRef} className='wrapper'>
      <textarea ref={rawRef} onChange={modifyCode} className='raw'></textarea>
      <div ref={htmlRef} className='rendered'></div>
    </div>
  );
}

export default App;
