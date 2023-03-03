import {
  Box,
  Button,
  Divider,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {useRef, useState} from 'react';
import defaultParams from '../src/defaultParams';
import DrawerName from './DrawerName';
import DrawerTop from './DrawerTop';
import SaveIcon from '@mui/icons-material/Save';
import {useEffect} from 'react';

const SetParams2 = ({shape, handleCloseDrawer, shapes, clearAndDraw}) => {
  return <h1>hello there {shape.text}</h1>;
};

export default SetParams2;
