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
          scrollButtons
          sx={{
            '.MuiTabs-indicator': {
              backgroundColor: '#64b5f6',
            },
          }}>
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
                  '4px solid #64b5f6',
                bgcolor: tab.id === activeTab ? '#EFF7FD' : 'transparent',
                '&:hover': {
                  bgcolor: '#ECEFF1',
                },
                borderRight: '1px solid #E0E0E0',
                '&:last-child': {
                  borderRight: 'none',
                },
              }}
              key={tab.id}
              disableRipple={true}
              label={
                tab.isEditMode ? (
                  <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <TextField
                      ref={tabRef}
                      sx={{
                        '.MuiInputBase-input': {
                          fontSize: '0.89rem',
                          fontWeight: 'medium',
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
                    <Tooltip title='Confirm' sx={{ml: 1}}>
                      <IconButton
                        size='small'
                        onClick={() => handleLabelChange(tab.id)}>
                        <DoneIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ) : (
                  <Typography
                    variant='button'
                    sx={{textTransform: 'none', color: '#455A64'}}>
                    {tab.label}
                  </Typography>
                )
              }
              value={tab.id}
            />
          ))}
        </Tabs>
        <Tooltip title='Add Page'>
          <IconButton
            sx={{ml: -2, color: '#455A64'}}
            size='small'
            onClick={handleAddTab}>
            <AddCircleIcon />
          </IconButton>
        </Tooltip>
      </Box>
      {menuOpen && (
        <Menu
          open={Boolean(menuOpen)}
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
