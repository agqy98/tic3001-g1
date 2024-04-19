import * as React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';

import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import ToggleColorMode from './ToggleColorMode';

import { AccountCircle as UserIcon } from '@mui/icons-material'

import { Link } from 'react-router-dom';

const siteName = {
  background: '-webkit-linear-gradient(45deg, #09009f, #00ff95 80%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginLeft: '20px'
}

function AppAppBar({ user, mode, toggleColorMode, children, setIsLoggedIn, timerRun, progress, cancelTimer }) {
  const [open, setOpen] = React.useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const sbAction = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={() => cancelTimer()}>
        Cancel
        <CloseIcon fontSize="small" />
      </Button>
    </React.Fragment>
  );

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: 2,
          maxHeight: 40,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              borderRadius: '999px',
              bgcolor:
                theme.palette.mode === 'light'
                  ? 'rgba(255, 255, 255, 0.4)'
                  : 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(24px)',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow:
                theme.palette.mode === 'light'
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                ml: '-18px',
                px: 0,
              }}
            >
              <h3 style={siteName}>
                PeerPrep
              </h3>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <MenuItem
                  component={Link} to="/home"
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    Questions
                  </Typography>
                </MenuItem>
                <MenuItem
                  component={Link} to="/question/0"
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    Add Question
                  </Typography>
                </MenuItem>
                <MenuItem
                  component={Link} to="/findmatch"
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    Find a Match
                  </Typography>
                </MenuItem>
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 0.5,
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button component={Link} to="/profile" style={{ textTransform: "capitalize" }}>
                  <div className='mx-2'>
                    <UserIcon />
                  </div>
                  {user ? user : null}
                </Button>
              </Box>
              {/* <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} /> */}
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button
                  color="primary"
                  variant="text"
                  size="small"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: { sm: '', md: 'none' } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: '30px', p: '4px' }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: '60dvw',
                    p: 2,
                    backgroundColor: 'background.paper',
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'end',
                      flexGrow: 1,
                    }}
                  >
                  </Box>
                  <MenuItem component={Link} to="/home">
                    Questions
                  </MenuItem>
                  <MenuItem component={Link} to="/question/0">
                    Add Questions
                  </MenuItem>
                  <MenuItem component={Link} to="/findmatch">
                    Find a Match
                  </MenuItem>
                  {/* <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} /> */}
                  <MenuItem component={Link} to="/profile">
                    My Profile
                    <div className='mx-2'>
                      <UserIcon />
                    </div>
                  </MenuItem>
                  <MenuItem component={Button} onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
          <div className='mx-5 my-4' style={{ color: "darkgray", maxHeight: "70vh", overflowY: "scroll" }}>
            {children}
          </div>
        </Container>
      </AppBar >
      <Snackbar
        open={timerRun}
        //onClose={() => cancelTimer()}
        message={`Searching for a match (${progress}%)... `}
        action={sbAction}
      />
    </div >
  );
}

AppAppBar.propTypes = {
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
  toggleColorMode: PropTypes.func.isRequired,
};

export default AppAppBar;