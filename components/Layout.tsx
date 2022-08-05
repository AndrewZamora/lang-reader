import React, { useState } from 'react'
import { AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material'
import { GitHub, Menu, Create, Style } from '@mui/icons-material'
import Link from 'next/link'
import styles from './Layout.module.css'

const drawerWidth = 240
interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window
}
export default function Layout(props) {
  const { window, children } = props
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {[{ text: 'Create Reader', icon: <Create />, url: '/CreateReader' }, { text: 'All Flashcards', icon: <Style />, url: 'Flashcards' }].map((icon, index) => (
          <Link href={icon.url} key={icon.text}>
            <ListItem button >
              <ListItemIcon>
                {icon.icon}
              </ListItemIcon>
              <ListItemText primary={icon.text} />
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  )

  const container = window !== undefined ? () => window().document.body : undefined

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            <Link href="/">
              <a className={styles.anchor}>Lang Reader</a>
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
          <div className={styles.githubLink}>
            Code by <Link href="https://github.com/AndrewZamora"><a className={styles.anchor}><GitHub/></a></Link>
          </div>
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}