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

function handleInputValidation(name, e) {
  let errorBox = document.getElementById('error-box');
  let errorMessage = checkValidity(name, e);
  if (errorMessage !== -1) {
    e.target.style.backgroundColor = '#ffebee';
    errorBox.style.visibility = 'visible';
    errorBox.innerText = errorMessage;
    return;
  }
  // no error condition
  e.target.style.backgroundColor = '#f1f8e9';
  errorBox.style.visibility = 'hidden';
  errorBox.innerText = '';
}

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
              handleInputValidation('prompt', e);
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
              handleInputValidation('ordinal', e);
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
              handleInputValidation('number', e);
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
              handleInputValidation('amount', e);
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
              handleInputValidation('date', e);
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
              handleInputValidation('digit', e);
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
              handleInputValidation('time', e);
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

export function checkValidity(name, e) {
  let { value } = e.target;
  // return error string if invalid; else returns -1
  switch (name) {
    case 'object':
      let objectRegex = /^[a-zA-z_]+[a-zA-z0-9_]*$/;
      if (!objectRegex.test(value)) return 'name not in valid format';
      return -1;

    case 'prompt':
      let promptRegex = /^[a-zA-z][a-zA-Z0-9]+(-?[a-z0-9]+)+$/;
      if (value == '' || value == null) return 'Prompt is required';
      if (!promptRegex.test(value)) return 'prompt not in valid format';
      return -1;

    case 'number':
      let numberRegex = /^\d+$/;
      if (value == '' || value == null) return 'number is required';
      if (!numberRegex.test(value)) return 'number not in valid format';
      return -1;

    case 'amount':
      let amountRegex = /^\d+\.?\d+$/;
      if (value == '' || value == null) return 'amount is required';
      if (!amountRegex.test(value)) return 'amount not in valid format';
      return -1;

    case 'ordinal':
      let ordinalRegex = /^\d{1,2}$/;
      if (value == '' || value == null) return 'ordinal is required';
      if (!ordinalRegex.test(value))
        return 'ordinal not in valid format. (0-99)';
      return -1;

    case 'digit':
      let digitRegex = /^\d+$/;
      if (value == '' || value == null) return 'digit is required';
      if (!digitRegex.test(value)) return 'digit not in valid format';
      return -1;

    case 'date':
      let dateRegex =
        /^(1[3-4]|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
      if (value == '' || value == null) return 'date is required';
      if (!dateRegex.test(value)) return 'date not in valid format';
      return -1;

    case 'time':
      let timeRegex = /^([0-1]?[0-9]|2[0-3])[0-5][0-9]$/;
      if (value == '' || value == null) return 'time is required';
      if (!timeRegex.test(value)) return 'time not in valid format';
      return -1;
  }
}
