import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import {Box, IconButton, Pagination, Tooltip} from '@mui/material';

const BottomBar = ({
  resetSelectedItemToolbar,
  openVariableManager,
  openPromptList,
  pageNumber,
  pageCount,
  setPageNumber,
  setPageCount,
}) => {
  function handleClick() {
    resetSelectedItemToolbar();
  }

  function handleVariableManagerClick() {
    openVariableManager();
  }

  function handlePromptListClick() {
    openPromptList();
  }

  function handlePageChange(event, value) {
    setPageNumber(value);
  }

  function handleAddPage() {
    setPageCount((p) => p + 1);
  }
  function handleRemovePage() {
    if (pageCount == 1) return;
    setPageCount((p) => p - 1);
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
        <Pagination
          shape='rounded'
          hideNextButton={true}
          hidePrevButton={true}
          count={pageCount}
          page={pageNumber}
          onChange={handlePageChange}
          color='primary'
          size='small'
          sx={{'& .MuiPaginationItem-root': {margin: '0 4px'}}}
        />
        <Tooltip title='Add Page'>
          <IconButton onClick={handleAddPage}>
            <AddBoxIcon sx={{fontSize: 'large'}} />
          </IconButton>
        </Tooltip>
        <Tooltip title='Remove Page'>
          <IconButton onClick={handleRemovePage}>
            <IndeterminateCheckBoxIcon sx={{fontSize: 'large'}} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default BottomBar;
