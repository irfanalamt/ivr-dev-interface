import ControlPointIcon from '@mui/icons-material/ControlPoint';
import {Box, Button, Tooltip} from '@mui/material';
import {styled} from '@mui/material/styles';
import {tooltipClasses} from '@mui/material/Tooltip';

const LightTooltip = styled(({className, ...props}) => (
  <Tooltip {...props} classes={{popper: className}} />
))(({theme}) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#fdf5ef',
    color: 'black',
    fontSize: 13,
  },
}));

const renderButton = (
  itemKey,
  selectedItemToolbar,
  handleSetSelectedItemToolbar,
  iconElement
) => {
  const isActive = selectedItemToolbar[itemKey];
  const backgroundColor = isActive ? '#FFA500' : '#ECEFF1';
  const hoverColor = isActive ? '#FF8C00' : '#CDCDCD';

  return (
    <Button
      size='small'
      onClick={(e) => handleSetSelectedItemToolbar(e, itemKey)}
      sx={{
        backgroundColor: backgroundColor,
        height: 40,
        transition: 'transform 0.2s, background-color 0.3s',
        '&:hover': {
          transform: 'scale(1.05)',
          backgroundColor: hoverColor,
        },
      }}>
      {iconElement}
    </Button>
  );
};

const MainToolbar = ({selectedItemToolbar, handleSetSelectedItemToolbar}) => {
  return (
    <Box
      sx={{
        pt: '50px',
        pb: '35px',
        height: '100%',
        boxShadow: 2,
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
        ['endFlow', '/icons/endFlow.png', '/icons/endFlowBlack.png', 25],
        [
          'connector',
          null,
          null,
          null,
          <ControlPointIcon
            sx={{
              fontSize: '25px',
              color: selectedItemToolbar['connector'] ? 'black' : '#607D8B',
            }}
          />,
        ],
        ['jumper', '/icons/jumper.png', '/icons/jumperBlack.png', 25],
      ].map(([key, defaultIcon, activeIcon, height, customIcon]) => (
        <LightTooltip
          title={key.replace(/^\w/, (c) => c.toUpperCase())}
          placement='right'
          key={key}>
          {renderButton(
            key,
            selectedItemToolbar,
            handleSetSelectedItemToolbar,
            customIcon || (
              <img
                src={selectedItemToolbar[key] ? activeIcon : defaultIcon}
                alt='Icon'
                height={`${height}px`}
              />
            )
          )}
        </LightTooltip>
      ))}
    </Box>
  );
};

export default MainToolbar;
