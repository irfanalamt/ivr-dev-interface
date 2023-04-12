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

const MainToolbar = ({selectedItemToolbar, handleSetSelectedItemToolbar}) => {
  function renderButton(icon, iconName, actionName, key) {
    const isSelected = selectedItemToolbar[actionName];

    return (
      <Button
        key={key}
        size='small'
        variant='outlined'
        onClick={(e) => handleSetSelectedItemToolbar(e, actionName)}
        sx={{
          backgroundColor: isSelected ? '#FFA500' : '#ECEFF1',
          width: 40,
          height: 40,
          borderColor: '#ECEFF1',
          '&:hover': {
            backgroundColor: isSelected ? '#FFA500' : '#F5F5F5',
            borderColor: '#ECEFF1',
          },
        }}>
        {isSelected ? (
          <img src={`/icons/${iconName}Black.png`} alt='Icon' height={'25px'} />
        ) : (
          <img src={`/icons/${iconName}.png`} alt='Icon' height={'25px'} />
        )}
      </Button>
    );
  }

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
        gap: 1,
      }}>
      {[
        ['setParams', 'Start / Set Params'],
        ['playMessage', 'Play Message'],
        ['getDigits', 'Get Digits'],
        ['playConfirm', 'Play Confirm'],
        ['playMenu', 'Play Menu'],
        ['runScript', 'Run Script'],
        ['switch', 'Switch'],
        ['callAPI', 'Call API'],
        ['endFlow', 'End Flow'],
        [
          'connector',
          'Connector',
          <ControlPointIcon
            sx={{
              fontSize: '25px',
              color: selectedItemToolbar['connector'] ? 'black' : '#607D8B',
            }}
          />,
        ],
        ['jumper', 'Jumper'],
      ].map(([actionName, tooltipTitle, icon], i) => (
        <LightTooltip key={i} title={tooltipTitle} placement='right'>
          {icon ? (
            <Button
              size='small'
              variant='outlined'
              onClick={(e) => handleSetSelectedItemToolbar(e, actionName)}
              sx={{
                backgroundColor: selectedItemToolbar[actionName]
                  ? '#FFA500'
                  : '#ECEFF1',
                borderColor: '#ECEFF1',
                width: 40,
                height: 40,
                '&:hover': {
                  backgroundColor: selectedItemToolbar[actionName]
                    ? '#FFA500'
                    : '#F5F5F5',
                  borderColor: '#ECEFF1',
                },
              }}>
              {icon}
            </Button>
          ) : (
            renderButton(icon, actionName, actionName, i)
          )}
        </LightTooltip>
      ))}
    </Box>
  );
};

export default MainToolbar;
