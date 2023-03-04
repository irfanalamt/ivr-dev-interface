import CancelIcon from '@mui/icons-material/Cancel';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import {Box, Button} from '@mui/material';
import {styled} from '@mui/material/styles';
import Tooltip, {tooltipClasses} from '@mui/material/Tooltip';

const LightTooltip = styled(({className, ...props}) => (
  <Tooltip {...props} classes={{popper: className}} />
))(({theme}) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#fdf5ef',
    color: 'black',
    fontSize: 12.5,
  },
}));

const MainToolbar = ({selectedItemToolbar, handleSetSelectedItemToolbar}) => {
  const ToolBarButton = styled(Button)({
    backgroundColor: selectedItemToolbar['setParams'] ? '#FFA500' : '#ECEFF1',
    width: 40,
    height: 40,
    borderColor: '#ECEFF1',
  });

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
      <LightTooltip title='start / setParams' placement='right'>
        <ToolBarButton
          size='small'
          variant='outlined'
          onClick={(e) => handleSetSelectedItemToolbar(e, 'setParams')}>
          {selectedItemToolbar['setParams'] ? (
            <img src='/icons/setParamsBlack.png' alt='Icon' height={'22px'} />
          ) : (
            <img src='/icons/setParams.png' alt='Icon' height={'22px'} />
          )}
        </ToolBarButton>
      </LightTooltip>
      <LightTooltip title='playMessage' placement='right'>
        <ToolBarButton
          variant='outlined'
          onClick={(e) => handleSetSelectedItemToolbar(e, 'playMessage')}
          size='small'>
          {selectedItemToolbar['playMessage'] ? (
            <img src='/icons/playMessageBlack.png' alt='Icon' height={'25px'} />
          ) : (
            <img src='/icons/playMessage.png' alt='Icon' height={'25px'} />
          )}
        </ToolBarButton>
      </LightTooltip>
      <LightTooltip title='getDigits' placement='right'>
        <ToolBarButton
          variant='outlined'
          size='small'
          onClick={(e) => handleSetSelectedItemToolbar(e, 'getDigits')}>
          {selectedItemToolbar['getDigits'] ? (
            <img src='/icons/getDigitsBlack.png' alt='Icon' height={'22px'} />
          ) : (
            <img src='/icons/getDigits.png' alt='Icon' height={'22px'} />
          )}
        </ToolBarButton>
      </LightTooltip>
      <LightTooltip title='playConfirm' placement='right'>
        <ToolBarButton
          variant='outlined'
          size='small'
          onClick={(e) => handleSetSelectedItemToolbar(e, 'playConfirm')}>
          {selectedItemToolbar['playConfirm'] ? (
            <img src='/icons/playConfirmBlack.png' alt='Icon' height={'25px'} />
          ) : (
            <img src='/icons/playConfirm.png' alt='Icon' height={'25px'} />
          )}
        </ToolBarButton>
      </LightTooltip>
      <LightTooltip title='playMenu' placement='right'>
        <ToolBarButton
          variant='outlined'
          size='small'
          onClick={(e) => handleSetSelectedItemToolbar(e, 'playMenu')}>
          {selectedItemToolbar['playMenu'] ? (
            <img src='/icons/playMenuBlack.png' alt='Icon' height={'22px'} />
          ) : (
            <img src='/icons/playMenu.png' alt='Icon' height={'22px'} />
          )}
        </ToolBarButton>
      </LightTooltip>
      <LightTooltip title='runScript' placement='right'>
        <ToolBarButton
          variant='outlined'
          size='small'
          onClick={(e) => handleSetSelectedItemToolbar(e, 'runScript')}>
          {selectedItemToolbar['runScript'] ? (
            <img src='/icons/runScriptBlack.png' alt='Icon' height={'25px'} />
          ) : (
            <img src='/icons/runScript.png' alt='Icon' height={'25px'} />
          )}
        </ToolBarButton>
      </LightTooltip>
      <LightTooltip title='switch' placement='right'>
        <ToolBarButton
          variant='outlined'
          size='small'
          onClick={(e) => handleSetSelectedItemToolbar(e, 'switch')}>
          {selectedItemToolbar['switch'] ? (
            <img src='/icons/switchBlack.png' alt='Icon' height={'25px'} />
          ) : (
            <img src='/icons/switch.png' alt='Icon' height={'25px'} />
          )}
        </ToolBarButton>
      </LightTooltip>
      <LightTooltip title='callAPI' placement='right'>
        <ToolBarButton
          variant='outlined'
          size='small'
          onClick={(e) => handleSetSelectedItemToolbar(e, 'callAPI')}
          color='info'>
          {selectedItemToolbar['callAPI'] ? (
            <img src='/icons/callAPIBlack.png' alt='Icon' height={'25px'} />
          ) : (
            <img src='/icons/callAPI.png' alt='Icon' height={'25px'} />
          )}
        </ToolBarButton>
      </LightTooltip>
      <LightTooltip title='endFlow' placement='right'>
        <ToolBarButton
          size='small'
          variant='outlined'
          onClick={(e) => handleSetSelectedItemToolbar(e, 'endFlow')}>
          <CancelIcon
            sx={{
              fontSize: '25px',
              color: selectedItemToolbar['endFlow'] ? 'black' : '#607D8B',
            }}
          />
        </ToolBarButton>
      </LightTooltip>
      <LightTooltip title='connector' placement='right'>
        <ToolBarButton
          size='small'
          variant='outlined'
          onClick={(e) => handleSetSelectedItemToolbar(e, 'connector')}>
          <ControlPointIcon
            sx={{
              fontSize: '25px',
              color: selectedItemToolbar['connector'] ? 'black' : '#607D8B',
            }}
          />
        </ToolBarButton>
      </LightTooltip>
      <LightTooltip title='jumper' placement='right'>
        <ToolBarButton
          size='small'
          variant='outlined'
          onClick={(e) => handleSetSelectedItemToolbar(e, 'jumper')}>
          {selectedItemToolbar['jumper'] ? (
            <img src='/icons/jumperBlack.png' alt='Icon' height={'25px'} />
          ) : (
            <img src='/icons/jumper.png' alt='Icon' height={'25px'} />
          )}
        </ToolBarButton>
      </LightTooltip>
    </Box>
  );
};

export default MainToolbar;
