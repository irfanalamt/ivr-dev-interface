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
} from '@mui/material';
import {useRef, useState} from 'react';

const BottomBar = ({
  resetSelectedItemToolbar,
  openVariableManager,
  openPromptList,
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

  function handleVariableManagerClick() {
    openVariableManager();
  }

  function handlePromptListClick() {
    openPromptList();
  }

  return (
    <Box
      sx={{
        height: 35,
        bgcolor: 'grey.300',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
      onClick={handleClick}>
      <Tooltip title='VARIABLE MANAGER' arrow>
        <IconButton
          onClick={handleVariableManagerClick}
          sx={{
            ml: '90px',
            bgcolor: '#7FB5B5',
            '&:hover': {
              bgcolor: '#A8CCCC',
            },
            height: '30px',
            width: '30px',
          }}>
          <img
            src='/icons/variableManager.png'
            alt='Icon'
            height={'16px'}
            width={'16px'}
          />
        </IconButton>
      </Tooltip>

      <Tooltip title='PROMPT LIST' arrow>
        <IconButton
          onClick={handlePromptListClick}
          sx={{
            ml: 4,
            bgcolor: '#7FB5B5',
            '&:hover': {
              bgcolor: '#A8CCCC',
            },
            height: '30px',
            width: '30px',
          }}>
          <img
            src='/icons/promptList.png'
            alt='Icon'
            height={'16px'}
            width={'16px'}
          />
        </IconButton>
      </Tooltip>
      <Box sx={{ml: 4, display: 'flex', alignItems: 'center', maxWidth: '80%'}}>
        <Tabs
          value={activeTab}
          onChange={(e, id) => handleChangeTab(id)}
          variant='scrollable'
          scrollButtons='auto'>
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
                minHeight: 33,
                maxHeight: 33,
                mt: 0.9,
                bgcolor: tab.id === activeTab && 'divider',
                borderBottom:
                  tab.id === activeTab &&
                  !tab.isEditMode &&
                  '3px solid primary.main',
                borderRight:
                  tab.id === activeTab
                    ? '1px solid primary.main'
                    : '1px solid grey.400',
                bgcolor: tab.id === activeTab && 'divider',
                borderLeft:
                  tab.id === activeTab
                    ? '1px solid primary.main'
                    : i === 0 && '1px solid grey.400',
              }}
              key={tab.id}
              disableRipple={tab.isEditMode}
              label={
                tab.isEditMode ? (
                  <Box sx={{display: 'flex'}}>
                    <TextField
                      ref={tabRef}
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
                  <span>{tab.label}</span>
                )
              }
              value={tab.id}
            />
          ))}
        </Tabs>
        <Tooltip title='Add Page'>
          <IconButton sx={{ml: 1}} size='small' onClick={handleAddTab}>
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
