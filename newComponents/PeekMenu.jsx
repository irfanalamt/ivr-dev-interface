import {Box, Grid, Paper, Typography} from '@mui/material';

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
        backgroundColor: '#E5E5E5',
        color: '#000000',
        wordWrap: 'break-word',
      }}>
      <Box sx={{mb: 0.5}}>
        {shape.userValues?.variableName ? (
          <Typography sx={{mb: 0.5}} variant='h6' fontSize='medium'>
            {shape.userValues?.variableName} = getDigits[
            {`${shape.userValues?.params.minDigits}-${shape.userValues?.params.maxDigits}`}
            ]
          </Typography>
        ) : (
          <Typography sx={{mb: 0.5}} variant='h6' fontSize='medium'>
            {shape.type}
          </Typography>
        )}
      </Box>
      {['playMessage', 'playConfirm', 'getDigits'].includes(shape.type) && (
        <>
          {shape.userValues.messageList.map((m, i) => (
            <Box
              sx={{display: 'flex', alignItems: 'center', fontSize: '13px'}}
              key={i}
              variant='body1'>
              <Typography>
                {i === 0 && '['}&nbsp;
                {`${m.item}`}
                {i !== shape.userValues.messageList.length - 1 && ','}&nbsp;
                {i === shape.userValues.messageList.length - 1 && ']'}
              </Typography>
            </Box>
          ))}
        </>
      )}
      {shape.type === 'playMenu' &&
        shape.userValues.items.map((m, i) => (
          <Box display='flex' key={i} mb={1}>
            <Box>
              <Typography
                sx={{fontSize: '14px', fontWeight: 'bold'}}
                variant='body1'>
                {`${m.digit}:`}
              </Typography>
            </Box>
            <Box ml={1}>
              <Typography
                sx={{fontSize: '14px', fontWeight: 'bold'}}
                variant='body1'>
                {`${m.action}`}
              </Typography>
            </Box>
            <Box ml={1}>
              <Typography sx={{fontSize: '14px'}} variant='body1'>
                {m.action === 'Transfer'
                  ? ` ${m.transferPoint}`
                  : ` '${m.prompt}'`}
              </Typography>
            </Box>
          </Box>
        ))}

      {shape.type === 'switch' && (
        <>
          {shape.userValues.actions.map((a, i) => (
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}} key={i}>
              <Typography
                sx={{fontSize: '14px', fontWeight: 'bold'}}
                variant='body1'>
                {`${a.action}:`}
              </Typography>
              <Typography key={i} sx={{fontSize: '14px'}} variant='body1'>
                {` ${a.condition}`}
              </Typography>
            </Box>
          ))}
          {
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
              <Typography
                sx={{fontSize: '14px', fontWeight: 'bold'}}
                variant='body1'>
                {`${shape.userValues.defaultAction}:`}
              </Typography>
              <Typography sx={{fontSize: '14px'}} variant='body1'>
                {`  default`}
              </Typography>
            </Box>
          }
        </>
      )}
      {shape.type === 'runScript' && (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Typography sx={{fontSize: '14px'}} variant='body1'>
            {`${shape.userValues.script}`}&nbsp;
          </Typography>
        </Box>
      )}
      {shape.type === 'setParams' &&
        shape.userValues.params.map((p, i) => (
          <Box sx={{display: 'flex', alignItems: 'center'}} key={i}>
            <Typography
              sx={{fontSize: '14px', fontWeight: 'bold'}}
              variant='body1'>
              {`${p.name}: `}&nbsp;
            </Typography>
            <Typography sx={{fontSize: '14px'}} variant='body1'>
              {`${p.value}`}&nbsp;
            </Typography>
          </Box>
        ))}
    </Paper>
  );
};

export default PeekMenu;
