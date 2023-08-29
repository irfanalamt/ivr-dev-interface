import React, {useEffect, useRef} from 'react';
import Editor, {useMonaco} from '@monaco-editor/react';

let completionProvider = null;

function CodeEditor({userVariables, value, onChange}) {
  const monaco = useMonaco();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (completionProvider) {
      completionProvider.dispose();
      completionProvider = null;
    }

    if (monaco && isMounted.current) {
      completionProvider = monaco.languages.registerCompletionItemProvider(
        'javascript',
        {
          provideCompletionItems: function (model, position) {
            const word = model.getWordAtPosition(position);
            const range = word
              ? new monaco.Range(
                  position.lineNumber,
                  word.startColumn,
                  position.lineNumber,
                  word.endColumn
                )
              : null;

            const suggestions = userVariables.map((varName) => ({
              label: varName,
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: varName,
              range: range,
            }));

            return {suggestions: suggestions};
          },
        }
      );
    }

    return () => {
      if (completionProvider) {
        completionProvider.dispose();
        completionProvider = null;
      }
    };
  }, [monaco, userVariables]);

  return (
    <Editor
      options={{
        fontSize: 18,
        minimap: {enabled: false},
        lineNumbers: 'off',
        glyphMargin: false,
        padding: {
          top: 20,
        },
      }}
      defaultValue='//Enter JavaScript code here'
      defaultLanguage='javascript'
      value={value}
      onChange={onChange}
    />
  );
}

export default CodeEditor;
