import {
  Button,
  FormControlLabel,
  Input,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { useState } from 'react';

import PlayMessage from './PlayMessage';

const DrawerComponent = ({
  isOpen,
  handleCloseDrawer,
  shape = null,
  userValues,
}) => {
  const [shapeName, setShapeName] = useState(shape.text);

  const myList = () => {
    if (shape?.type == 'roundedRectangle') {
      return (
        <PlayMessage
          shapeName={shapeName}
          setShapeName={setShapeName}
          shape={shape}
        />
      );
    } else {
      return (
        <List>
          <ListItem>
            <Typography variant='h5'> not playMessage</Typography>
          </ListItem>
          <ListItem>
            <Typography variant='h5'> Work in progress ⚒️⚒️🏗️</Typography>
          </ListItem>
        </List>
      );
    }
  };
  return (
    <>
      <Drawer
        anchor='right'
        open={isOpen}
        onClose={() => {
          shape.setText(shapeName);
          shape.setSelected(false);
          handleCloseDrawer();
        }}
      >
        {myList()}
      </Drawer>
    </>
  );
};

export default DrawerComponent;
