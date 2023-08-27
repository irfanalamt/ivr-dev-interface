import {ClickAwayListener, Paper, Popper, TextField} from '@mui/material';
import React, {useRef, useState} from 'react';

let FONT_WIDTH;

export default function ExpressionTextField({
  inputValue,
  variableNames,
  setInputValue,
}) {
  const [caretPosition, setCaretPosition] = useState({top: 0, left: 0});
  const [suggestions, setSuggestions] = useState([]);
  const textFieldRef = useRef(null);

  const virtualElement = {
    getBoundingClientRect: () => ({
      width: 0,
      height: 0,
      top: caretPosition.top,
      right: caretPosition.left,
      bottom: caretPosition.top,
      left: caretPosition.left,
    }),
  };

  function handleInputChange(event) {
    const inputElement = event.target;
    const variablePart = getVariablePart(inputElement);

    if (!variablePart) {
      setSuggestions([]);
      return;
    }

    setSuggestionBoxCoordinates(inputElement, variablePart);
    setSuggestionList(variablePart);
  }

  function setSuggestionList(variablePart) {
    const filteredSuggestions = variableNames.filter((name) =>
      name.startsWith(variablePart)
    );
    setSuggestions(filteredSuggestions);
  }

  function setSuggestionBoxCoordinates(element, variablePart) {
    const value = element.value;
    const selectionStart = element.selectionStart;
    const rect = element.getBoundingClientRect();
    const dollarPosition = selectionStart - variablePart.length;

    if (!FONT_WIDTH) {
      FONT_WIDTH = getFontWidth(element);
    }

    const width = rect.width;
    const charactersPerLine = Math.round(width / FONT_WIDTH);

    const textBeforeDollar = value.slice(0, dollarPosition);
    const lines = textBeforeDollar.split('\n');
    const lineNum = lines.length;

    let sublines = 0;
    lines.forEach((line) => {
      const lineLength = line.length;
      const numSublines = Math.ceil(lineLength / charactersPerLine);
      if (numSublines > 1) {
        sublines += numSublines - 1;
      }
    });

    const lastLineLength = lines[lines.length - 1].length;
    const lastSublineLength = lastLineLength % charactersPerLine;

    const dx = lastSublineLength * FONT_WIDTH;
    const dy = (lineNum + sublines) * getLineHeight(element);
    const boxTop = rect.top + dy + 5;
    const boxLeft = rect.left + dx - 4;

    setCaretPosition({
      top: boxTop,
      left: boxLeft,
    });
  }

  function getVariablePart(element) {
    const value = element.value;
    const selectionStart = element.selectionStart;
    let ch = value.slice(selectionStart, 1);
    if (!isWhitespace(ch) && ch) return '';

    let result = '';
    for (let i = selectionStart - 1; i >= 0; i--) {
      ch = value[i];
      if (ch === '$') {
        result = ch + result;
        return result;
      }
      if (isWordCharacter(ch)) {
        result = ch + result;
      } else {
        return '';
      }
    }
  }

  function isWhitespace(char) {
    return /\s/.test(char);
  }

  function isWordCharacter(character) {
    return /\w/.test(character);
  }

  function getFontWidth(element) {
    const testDiv = document.createElement('div');
    testDiv.style.position = 'absolute';
    testDiv.style.top = '-9999px';
    testDiv.style.left = '-9999px';
    testDiv.style.fontFamily = element.style.fontFamily;
    testDiv.style.fontSize = window.getComputedStyle(element).fontSize;

    testDiv.textContent = 'M';
    document.body.appendChild(testDiv);
    const width = testDiv.getBoundingClientRect().width;
    document.body.removeChild(testDiv);
    return width;
  }

  function getLineHeight(element) {
    const computedStyle = window.getComputedStyle(element);
    return parseFloat(computedStyle.lineHeight);
  }

  function handleSuggestionClick(suggestion) {
    const inputElement = textFieldRef.current;
    const caretPos = inputElement.selectionStart;
    const inputText = inputValue.condition;

    const uptoCaret = inputText.slice(0, caretPos);
    const lastDollarPos = uptoCaret.lastIndexOf('$');

    const textBeforeLastDollar =
      lastDollarPos !== -1 ? uptoCaret.slice(0, lastDollarPos) : uptoCaret;
    const textAfterCaret = inputText.slice(caretPos);

    const newValue = textBeforeLastDollar + suggestion + textAfterCaret;

    setInputValue(newValue);
    setSuggestions([]);
  }

  return (
    <>
      <ClickAwayListener onClickAway={() => setSuggestions([])}>
        <TextField
          value={inputValue.condition}
          error={Boolean(inputValue.conditionError)}
          inputRef={textFieldRef}
          size='small'
          onChange={(e) => {
            setInputValue(e.target.value);
            handleInputChange(e);
          }}
          sx={{backgroundColor: '#f5f5f5', width: 400}}
          inputProps={{
            style: {fontFamily: 'Courier New'},
          }}
          multiline
        />
      </ClickAwayListener>
      <Popper
        open={Boolean(suggestions.length)}
        placement='bottom-start'
        anchorEl={virtualElement}
        modifiers={[
          {
            name: 'flip',
            enabled: false,
          },
        ]}
        style={{
          zIndex: 9999,
          position: 'absolute',
          top: caretPosition.top,
          left: caretPosition.left,
        }}>
        <Paper>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              style={{
                cursor: 'pointer',
                padding: '4px',
                backgroundColor: 'white',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = '#f5f5f5')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = 'white')
              }
              onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </div>
          ))}
        </Paper>
      </Popper>
    </>
  );
}
