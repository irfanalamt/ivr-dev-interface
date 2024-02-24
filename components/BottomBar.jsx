import AddCircleIcon from '@mui/icons-material/AddCircle';
import DoneIcon from '@mui/icons-material/Done';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {useRef, useState} from 'react';

const BottomBar = ({
  resetSelectedItemToolbar,
  tabs,
  setTabs,
  activeTab,
  handleChangeTab,
  handleAddTab,
  handleTabDoubleClick,
  handleLabelChange,
  handleDeleteTab,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const tabRef = useRef(null);

  const menuItems = [
    {
      label: 'Rename',
      onClick: (id) => {
        handleChangeTab(id);
        handleTabDoubleClick(id);
        setMenuOpen(false);
      },
    },
    {
      label: 'Delete',
      onClick: (id) => {
        handleDeleteTab(id);
        setMenuOpen(false);
      },
    },
  ];

  function handleClick() {
    resetSelectedItemToolbar();
  }

  return (
    <Box
      sx={{
        height: 35,
        bgcolor: '#E5E5E5',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
      onClick={handleClick}>
      <Box
        sx={{
          ml: '60px',
          display: 'flex',
          alignItems: 'center',
          maxWidth: '80%',
        }}>
        <Tabs
          value={activeTab}
          onChange={(e, id) => handleChangeTab(id)}
          variant='scrollable'
          scrollButtons>
          {tabs.map((tab, i) => (
            <Tab
              onContextMenu={(e) => {
                if (!tab.isEditMode)
                  setMenuOpen({
                    id: tab.id,
                    clientY: e.clientY - 100,
                    clientX: e.clientX,
                  });
              }}
              onDoubleClick={() => {
                if (!tab.isEditMode) handleTabDoubleClick(tab.id);
              }}
              sx={{
                minHeight: 35,
                maxHeight: 35,
                mt: 0.9,
                borderBottom:
                  tab.id === activeTab &&
                  !tab.isEditMode &&
                  '4px solid #9e9e9e',
                borderRight:
                  tab.id === activeTab
                    ? '2px solid #9e9e9e'
                    : '1px solid grey.400',
                bgcolor: tab.id === activeTab && '#EFF7FD',
                borderLeft:
                  tab.id === activeTab
                    ? '2px solid #9e9e9e'
                    : i === 0 && '1px solid grey.400',
              }}
              key={tab.id}
              disableRipple={true}
              label={
                tab.isEditMode ? (
                  <Box sx={{display: 'flex'}}>
                    <TextField
                      ref={tabRef}
                      sx={{
                        '.MuiInputBase-input': {
                          fontSize: '0.89rem',
                          fontWeight: 'fontWeightMedium',
                        },
                      }}
                      value={tab.label}
                      size='small'
                      variant='standard'
                      autoFocus
                      InputProps={{spellCheck: 'false'}}
                      onChange={(e) =>
                        setTabs(
                          tabs.map((t) =>
                            t.id === tab.id ? {...t, label: e.target.value} : t
                          )
                        )
                      }
                    />
                    <Tooltip
                      onClick={() => handleLabelChange(tab.id)}
                      color='success'
                      sx={{mr: -1}}
                      size='small'>
                      <DoneIcon />
                    </Tooltip>
                  </Box>
                ) : (
                  <Typography variant='button' sx={{textTransform: 'none'}}>
                    {tab.label}
                  </Typography>
                )
              }
              value={tab.id}
            />
          ))}
        </Tabs>
        <Tooltip title='Add Page'>
          <IconButton sx={{ml: -2}} size='small' onClick={handleAddTab}>
            <AddCircleIcon />
          </IconButton>
        </Tooltip>
      </Box>
      {menuOpen && (
        <Menu
          open={Boolean(menuOpen)}
          disableScrollLock={true}
          onClose={() => setMenuOpen(false)}
          anchorReference='anchorPosition'
          anchorPosition={
            menuOpen
              ? {top: menuOpen.clientY, left: menuOpen.clientX}
              : undefined
          }>
          {menuItems.map((item) => (
            <MenuItem
              key={item.label}
              onClick={() => item.onClick(menuOpen.id)}>
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      )}
    </Box>
  );
};
export default BottomBar;
