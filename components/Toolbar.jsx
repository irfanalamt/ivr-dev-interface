import React from 'react';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import {Box, Button, Tooltip, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {tooltipClasses} from '@mui/material/Tooltip';

const LightTooltip = styled(({className, ...props}) => (
  <Tooltip {...props} classes={{popper: className}} />
))(({theme}) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#fdf5ef',
    color: 'black',
    fontSize: 14,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
  },
}));

const StyledButton = styled(Button)(({theme, isActive}) => ({
  backgroundColor: isActive ? theme.palette.secondary.main : '#ECEFF1',
  height: 40,
  width: 'auto',
  padding: '0 16px',
  '&:hover': {
    backgroundColor: isActive
      ? theme.palette.secondary.dark
      : theme.palette.action.hover,
    boxShadow: theme.shadows[3],
    transform: 'translateY(-2px)',
  },
  transition: 'transform 0.2s, background-color 0.3s',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const renderButton = (
  itemKey,
  selectedItemToolbar,
  handleSetSelectedItemToolbar,
  iconElement
) => {
  const isActive = selectedItemToolbar[itemKey];

  return (
    <StyledButton size='small' isActive={isActive}>
      {iconElement}
    </StyledButton>
  );
};

const MainToolbar = ({selectedItemToolbar, handleSetSelectedItemToolbar}) => {
  const handleDragStart = (e, key) => {
    e.dataTransfer.setData('application/reactflow', key);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Box
      sx={{
        pt: '50px',
        pb: '35px',
        height: '100%',
        boxShadow:
          '0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -1px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}>
      {[
        ['setParams', '/icons/setParams.png', '/icons/setParamsBlack.png', 22],
        [
          'playMessage',
          '/icons/playMessage.png',
          '/icons/playMessageBlack.png',
          25,
        ],
        ['getDigits', '/icons/getDigits.png', '/icons/getDigitsBlack.png', 22],
        [
          'playConfirm',
          '/icons/playConfirm.png',
          '/icons/playConfirmBlack.png',
          25,
        ],
        ['playMenu', '/icons/playMenu.png', '/icons/playMenuBlack.png', 22],
        ['runScript', '/icons/runScript.png', '/icons/runScriptBlack.png', 25],
        ['switch', '/icons/switch.png', '/icons/switchBlack.png', 25],
        ['callAPI', '/icons/callAPI.png', '/icons/callAPIBlack.png', 25],
        ['dial', '/icons/dial.png', '/icons/dialBlack.png', 25],
        ['endFlow', '/icons/endFlow.png', '/icons/endFlowBlack.png', 25],
        [
          'connector',
          null,
          null,
          null,
          <ControlPointIcon
            key='controlPointIcon-connector'
            sx={{
              fontSize: '25px',
              color: selectedItemToolbar['connector'] ? 'black' : '#607D8B',
            }}
          />,
        ],
        ['jumper', '/icons/jumper.png', '/icons/jumperBlack.png', 25],
      ].map(([key, defaultIcon, activeIcon, height, customIcon]) => (
        <LightTooltip
          title={
            <Typography variant='caption'>
              {key.replace(/^\w/, (c) => c.toUpperCase())}
            </Typography>
          }
          placement='right'
          key={key}>
          <div
            draggable='true'
            onDragStart={(e) => handleDragStart(e, key)}
            style={{cursor: 'grab'}}>
            {renderButton(
              key,
              selectedItemToolbar,
              handleSetSelectedItemToolbar,
              customIcon || (
                <img
                  src={selectedItemToolbar[key] ? activeIcon : defaultIcon}
                  alt='Icon'
                  style={{height: `${height}px`}}
                  key={key}
                />
              )
            )}
          </div>
        </LightTooltip>
      ))}
    </Box>
  );
};

export default MainToolbar;
