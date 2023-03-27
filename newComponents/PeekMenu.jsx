import {Box, Paper, Stack, Typography} from '@mui/material';

const PeekMenu = ({shape}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        top: 60,
        right: 10,
        px: 2,
        py: 1,
        backgroundColor: '#fdf5ef',
        color: 'black',
        wordWrap: 'break-word',
      }}>
      <Stack spacing={-0.4}>
        {shape.userValues?.variableName ? (
          <Typography sx={{fontSize: 'small'}} variant='subtitle2'>
            {shape.userValues?.variableName} = getDigits[
            {`${shape.userValues?.params.minDigits}-${shape.userValues?.params.maxDigits}`}
            ]
          </Typography>
        ) : (
          <Typography sx={{fontSize: 'small'}} variant='subtitle2'>
            {shape.type}
          </Typography>
        )}
        {['playMessage', 'playConfirm', 'getDigits'].includes(shape.type) && (
          <Typography sx={{fontSize: 'small'}} variant='subtitle1'>
            [{shape.userValues?.messageList.map((m) => m.item).join(', ')}]
          </Typography>
        )}
        {shape.type === 'playMenu' &&
          shape.userValues?.items.map((m, i) => (
            <Box sx={{display: 'flex', alignItems: 'center'}} key={i}>
              <Typography sx={{fontSize: 'small'}} variant='subtitle1'>
                {'['}
              </Typography>
              <Typography sx={{fontSize: 'small'}} variant='subtitle2'>
                {`${m.digit}`}&nbsp;
              </Typography>
              <Typography sx={{fontSize: 'small'}} variant='subtitle2'>
                {`${m.action}`}&nbsp;
              </Typography>
              <Typography sx={{fontSize: 'small'}} variant='subtitle1'>
                {` ${m.prompt}]`}
              </Typography>
            </Box>
          ))}
        {shape.type === 'switch' &&
          shape.userValues?.actions.map((a, i) => (
            <Box sx={{display: 'flex', alignItems: 'center'}} key={i}>
              <Typography sx={{fontSize: 'small'}} variant='subtitle2'>
                {`${a.action}:`}&nbsp;
              </Typography>
              <Typography
                key={i}
                sx={{fontSize: 'small'}}
                variant='subtitle1'>{` ${a.condition}`}</Typography>
            </Box>
          ))}
      </Stack>
    </Paper>
  );
};

export default PeekMenu;
