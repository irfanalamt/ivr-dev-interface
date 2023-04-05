import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import DoneIcon from '@mui/icons-material/Done';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
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
      style={{
        height: 35,
        backgroundColor: '#CCCCCC',
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
            backgroundColor: '#7FB5B5',
            '&:hover': {
              backgroundColor: '#A8CCCC',
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
            backgroundColor: '#7FB5B5',
            '&:hover': {
              backgroundColor: '#A8CCCC',
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
      <Box sx={{ml: 5, display: 'flex', alignItems: 'center'}}>
        <Tabs value={activeTab} onChange={(e, id) => handleChangeTab(id)}>
          {tabs.map((tab) => (
            <Tab
              sx={{
                minHeight: 35,
                maxHeight: 35,
                mt: 0.9,
                backgroundColor: tab.id === activeTab && '#EFF7FD',
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
                  <span
                    onContextMenu={(e) => {
                      setMenuOpen({
                        id: tab.id,
                        clientY: e.clientY - 100,
                        clientX: e.clientX,
                      });
                    }}
                    onDoubleClick={() => handleTabDoubleClick(tab.id)}>
                    {tab.label}
                  </span>
                )
              }
              value={tab.id}
            />
          ))}
        </Tabs>
        <Tooltip title='Add Page'>
          <IconButton sx={{ml: 2}} size='small' onClick={handleAddTab}>
            <AddBoxIcon />
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
