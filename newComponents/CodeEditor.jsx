import React, {useEffect, useState} from 'react';
import Editor, {useMonaco} from '@monaco-editor/react';

function CodeEditor({userVariables, value, onChange}) {
  const monaco = useMonaco();
  const [hasRegisteredCompletion, setHasRegisteredCompletion] = useState(false);

  useEffect(() => {
    if (monaco && !hasRegisteredCompletion) {
      monaco.languages.registerCompletionItemProvider('javascript', {
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
      });

      setHasRegisteredCompletion(true);
    }
  }, [monaco, userVariables, hasRegisteredCompletion]);

  return (
    <Editor
      options={{
        fontSize: 17,
        minimap: {
          enabled: false,
        },
        lineNumbers: 'off',
        glyphMargin: false,
      }}
      defaultValue='//Enter JavaScript code here'
      defaultLanguage='javascript'
      value={value}
      onChange={onChange}
    />
  );
}

export default CodeEditor;
