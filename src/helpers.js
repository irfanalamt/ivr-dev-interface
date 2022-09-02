import {
  Box,
  FormControlLabel,
  ListItem,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
export function addInputElements(type, key, msgObj, setMsgObj) {
  function handleMsgObjChange(e, index, name = null) {
    e.preventDefault();
    console.log('🚀 ~ handleMsgObjChange ~ index', index);
    if (name === null) {
      setMsgObj((s) => {
        const newArr = [...s];
        newArr[index].value = e.target.value;
        return newArr;
      });
      return;
    }
    setMsgObj((s) => {
      const newArr = [...s];
      newArr[index][name] = e.target.value;
      return newArr;
    });
  }
  switch (type) {
    case 'prompt':
      const promptCode = (
        <ListItem key={key}>
          <Typography sx={{ fontSize: '1.1rem' }} variant='button'>
            V
          </Typography>
          <Switch sx={{ ml: 0 }} size='large'></Switch>

          <Typography sx={{ marginRight: 2, marginLeft: 1 }} variant='body1'>
            prompt:
          </Typography>
          <Box id={`prompt${key}-div`}></Box>
          <TextField
            id={`prompt${key}`}
            size='small'
            variant='outlined'
            name='prompt'
            value={msgObj[key].value}
            onChange={(e) => {
              handleMsgObjChange(e, key);
            }}
          />
        </ListItem>
      );
      return promptCode;

    case 'ordinal':
      const ordinalCode = (
        <ListItem key={key}>
          <Typography sx={{ fontSize: '1.1rem' }} variant='button'>
            V
          </Typography>
          <Switch></Switch>
          <Typography sx={{ marginX: 2 }} variant='body1'>
            ordinal:
          </Typography>
          <Box id={`ordinal${key}-div`}></Box>
          <TextField
            id={`ordinal${key}`}
            size='small'
            sx={{ maxWidth: 100 }}
            name='ordinal'
            value={msgObj[key]?.value}
            onChange={(e) => {
              handleMsgObjChange(e, key);
            }}
          />
        </ListItem>
      );
      return ordinalCode;

    case 'number':
      const numberCode = (
        <ListItem key={key}>
          <Typography sx={{ fontSize: '1.1rem' }} variant='button'>
            V
          </Typography>
          <Switch></Switch>

          <Typography sx={{ marginX: 2 }} variant='body1'>
            number:
          </Typography>
          <Box id={`number${key}-div`}></Box>
          <TextField
            id={`number${key}`}
            size='small'
            sx={{ maxWidth: 100 }}
            name='number'
            value={msgObj[key]?.value}
            onChange={(e) => {
              handleMsgObjChange(e, key);
            }}
          />
        </ListItem>
      );
      return numberCode;

    case 'amount':
      const amountCode = (
        <ListItem key={key}>
          <Typography sx={{ fontSize: '1.1rem' }} variant='button'>
            V
          </Typography>
          <Switch></Switch>

          <Typography sx={{ marginX: 2 }} variant='body1'>
            amount:
          </Typography>
          <Box id={`amount${key}-div`}></Box>
          <TextField
            id={`amount${key}`}
            size='small'
            sx={{ maxWidth: 100 }}
            name='amount'
            value={msgObj[key]?.value}
            onChange={(e) => {
              handleMsgObjChange(e, key);
            }}
          />
          <Typography sx={{ marginX: 2, marginLeft: 4 }} variant='body1'>
            currency:
          </Typography>
          <Select
            size='small'
            name='currency'
            value={msgObj[key]?.currency || 'SAR'}
            onChange={(e) => {
              handleMsgObjChange(e, key, 'currency');
            }}
          >
            <MenuItem value='SAR'>SAR</MenuItem>
            <MenuItem value='USD'>USD</MenuItem>
            <MenuItem value='CAD'>CAD</MenuItem>
            <MenuItem value='GBP'>GBP</MenuItem>
            <MenuItem value='AUD'>AUD</MenuItem>
          </Select>
        </ListItem>
      );

      return amountCode;

    case 'date':
      const dateCode = (
        <ListItem key={key}>
          <Typography sx={{ fontSize: '1.1rem' }} variant='button'>
            V
          </Typography>
          <Switch></Switch>

          <Typography sx={{ marginX: 2 }} variant='body1'>
            date:
          </Typography>
          <Box id={`date${key}-div`}></Box>
          <TextField
            id={`date${key}`}
            sx={{ maxWidth: 150 }}
            placeholder='yyyymmdd'
            variant='outlined'
            size='small'
            name='date'
            value={msgObj[key]?.value}
            onChange={(e) => {
              handleMsgObjChange(e, key);
            }}
          />
          <Typography sx={{ marginLeft: 2 }} variant='body1'>
            playYear:
          </Typography>
          <RadioGroup
            row
            name='playYear'
            value={msgObj[key]?.playYear || false}
            onChange={(e) => {
              handleMsgObjChange(e, key, 'playYear');
            }}
          >
            <FormControlLabel
              sx={{ marginLeft: 1 }}
              value={true}
              control={<Radio />}
              label='true'
            />
            <FormControlLabel value={false} control={<Radio />} label='false' />
          </RadioGroup>
        </ListItem>
      );
      return dateCode;

    case 'day':
      const dayCode = (
        <ListItem key={key}>
          <Typography sx={{ fontSize: '1.1rem' }} variant='button'>
            V
          </Typography>
          <Switch></Switch>

          <Typography sx={{ marginX: 2 }} variant='body1'>
            day:
          </Typography>
          <Box id={`day${key}-div`}></Box>
          <Select
            id={`day${key}`}
            placeholder='day'
            size='small'
            name='day'
            value={msgObj[key]?.value || ''}
            onChange={(e) => {
              handleMsgObjChange(e, key);
            }}
          >
            <MenuItem value='mon'>Monday</MenuItem>
            <MenuItem value='tue'>Tuesday</MenuItem>
            <MenuItem value='wed'>Wednesday</MenuItem>
            <MenuItem value='thu'>Thursday</MenuItem>
            <MenuItem value='fri'>Friday</MenuItem>
            <MenuItem value='sat'>Saturday</MenuItem>
            <MenuItem value='sun'>Sunday</MenuItem>
          </Select>
        </ListItem>
      );
      return dayCode;

    case 'digit':
      const digitCode = (
        <ListItem key={key}>
          <Typography sx={{ fontSize: '1.1rem' }} variant='button'>
            V
          </Typography>
          <Switch></Switch>

          <Typography sx={{ marginX: 2 }} variant='body1'>
            digit:
          </Typography>
          <Box id={`digit${key}-div`}></Box>
          <TextField
            id={`digit${key}`}
            sx={{ maxWidth: 100 }}
            size='small'
            name='digit'
            value={msgObj[key]?.value}
            onChange={(e) => {
              handleMsgObjChange(e, key);
            }}
          />
        </ListItem>
      );

      return digitCode;

    case 'month':
      const monthCode = (
        <ListItem key={key}>
          <Typography sx={{ fontSize: '1.1rem' }} variant='button'>
            V
          </Typography>
          <Switch></Switch>

          <Typography sx={{ marginX: 2 }} variant='body1'>
            month:
          </Typography>
          <Box id={`month${key}-div`}></Box>
          <Select
            id={`month${key}`}
            size='small'
            name='month'
            value={msgObj[key]?.value || ''}
            onChange={(e) => {
              handleMsgObjChange(e, key);
            }}
          >
            <MenuItem value={1}>January</MenuItem>
            <MenuItem value={2}>February</MenuItem>
            <MenuItem value={3}>March</MenuItem>
            <MenuItem value={4}>April</MenuItem>
            <MenuItem value={5}>May</MenuItem>
            <MenuItem value={6}>June</MenuItem>
            <MenuItem value={7}>July</MenuItem>
            <MenuItem value={8}>August</MenuItem>
            <MenuItem value={9}>September</MenuItem>
            <MenuItem value={10}>October</MenuItem>
            <MenuItem value={11}>November</MenuItem>
            <MenuItem value={12}>December</MenuItem>
          </Select>
          <Typography sx={{ marginLeft: 2 }} variant='body1'>
            isHijri:
          </Typography>
          <RadioGroup
            row
            name='isHijri'
            value={msgObj[key]?.isHijri || false}
            onChange={(e) => {
              handleMsgObjChange(e, key, 'isHijri');
            }}
          >
            <FormControlLabel
              sx={{ marginLeft: 1 }}
              value={true}
              control={<Radio />}
              label='true'
            />
            <FormControlLabel value={false} control={<Radio />} label='false' />
          </RadioGroup>
        </ListItem>
      );
      return monthCode;

    case 'time':
      const timeCode = (
        <ListItem key={key}>
          <Typography sx={{ fontSize: '1.1rem' }} variant='button'>
            V
          </Typography>
          <Switch></Switch>

          <Typography sx={{ marginX: 2 }} variant='body1'>
            time:
          </Typography>
          <Box id={`time${key}-div`}></Box>
          <TextField
            id={`time${key}`}
            sx={{ maxWidth: 100 }}
            variant='outlined'
            placeholder='hhmm'
            size='small'
            name='time'
            value={msgObj[key]?.value}
            onChange={(e) => {
              handleMsgObjChange(e, key);
            }}
          />
          <Typography sx={{ marginLeft: 2 }} variant='body1'>
            is24:
          </Typography>
          <RadioGroup
            row
            name='is24'
            value={msgObj[key]?.is24 || false}
            onChange={(e) => {
              handleMsgObjChange(e, key, 'is24');
            }}
          >
            <FormControlLabel
              sx={{ marginLeft: 1 }}
              value={true}
              control={<Radio />}
              label='true'
            />
            <FormControlLabel value={false} control={<Radio />} label='false' />
          </RadioGroup>
        </ListItem>
      );
      return timeCode;
  }
}
