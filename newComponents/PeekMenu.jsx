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
        backgroundColor: '#cccccc',
        color: '#000000',
        wordWrap: 'break-word',
      }}>
      <Stack spacing={-0.3}>
        {shape.userValues?.variableName ? (
          <Typography variant='subtitle2'>
            {shape.userValues?.variableName} = getDigits[
            {`${shape.userValues?.params.minDigits}-${shape.userValues?.params.maxDigits}`}
            ]
          </Typography>
        ) : (
          <Typography variant='subtitle2'>{shape.type}</Typography>
        )}
        {['playMessage', 'playConfirm', 'getDigits'].includes(shape.type) && (
          <Typography sx={{fontSize: 'small'}} variant='subtitle1'>
            [{shape.userValues?.messageList.map((m) => m.item).join(', ')}]
          </Typography>
        )}
        {shape.type === 'playMenu' &&
          shape.userValues?.items.map((m, i) => (
            <Box sx={{display: 'flex', alignItems: 'center'}} key={i}>
              <Typography sx={{fontSize: 'small', fontWeight: 'bold'}}>
                {`${m.digit}: `}&nbsp;
              </Typography>
              <Typography sx={{fontSize: 'small'}} variant='subtitle2'>
                {`${m.action}`}&nbsp;
              </Typography>
              <Typography sx={{fontSize: 'small'}} variant='subtitle1'>
                {` '${m.prompt}'`}
              </Typography>
            </Box>
          ))}
        {shape.type === 'switch' &&
          shape.userValues?.actions.map((a, i) => (
            <Box sx={{display: 'flex', alignItems: 'center'}} key={i}>
              <Typography sx={{fontSize: 'small'}} variant='subtitle1'>
                {`${a.action}:`}&nbsp;
              </Typography>
              <Typography
                key={i}
                sx={{fontSize: 'small'}}
                variant='subtitle2'>{` ${a.condition}`}</Typography>
            </Box>
          ))}
      </Stack>
    </Paper>
  );
};

export default PeekMenu;
