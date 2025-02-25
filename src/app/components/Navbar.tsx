'use client';

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { useRouter } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import BookIcon from '@mui/icons-material/Book';
import LogoutIcon from '@mui/icons-material/Logout';
import BusinessIcon from '@mui/icons-material/Business';

export default function Navbar() {
    const router = useRouter();
    const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
    const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
    
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        router.push('/');
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMenuAnchor(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMenuAnchor(null);
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setProfileMenuAnchor(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setProfileMenuAnchor(null);
    };

    const getPrincipalMenu = () => {
        const menuItems = [
            { text: 'Dashboard', icon: <DashboardIcon />, path: '/principal/dashboard' },
            { text: 'Departments', icon: <BusinessIcon />, path: '/principal/departments' },
            { text: 'Teachers', icon: <GroupIcon />, path: '/principal/teachers' },
            { text: 'Lessons', icon: <BookIcon />, path: '/principal/lessons' },
        ];

        return (
            <>
                {/* Desktop Menu */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                    {menuItems.map((item) => (
                        <Button
                            key={item.text}
                            color="inherit"
                            startIcon={item.icon}
                            onClick={() => router.push(item.path)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                },
                            }}
                        >
                            {item.text}
                        </Button>
                    ))}
                </Box>

                {/* Mobile Menu */}
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleMobileMenuOpen}
                        edge="start"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorEl={mobileMenuAnchor}
                        open={Boolean(mobileMenuAnchor)}
                        onClose={handleMobileMenuClose}
                    >
                        {menuItems.map((item) => (
                            <MenuItem
                                key={item.text}
                                onClick={() => {
                                    router.push(item.path);
                                    handleMobileMenuClose();
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {item.icon}
                                    <Typography>{item.text}</Typography>
                                </Box>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </>
        );
    };

    return (
        <AppBar position="sticky" elevation={0}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon sx={{ fontSize: 32 }} />
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            fontWeight: 600,
                            display: { xs: 'none', sm: 'block' },
                        }}
                    >
                        School Management
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {(role === 'PRINCIPAL' || role === 'TEACHER') && getPrincipalMenu()}
                    
                    {role === 'SUPER_ADMIN' && (
                        <Button
                            color="inherit"
                            startIcon={<DashboardIcon />}
                            onClick={() => router.push('/admin/dashboard')}
                        >
                            Dashboard
                        </Button>
                    )}
                    
                    <IconButton
                        color="inherit"
                        onClick={handleProfileMenuOpen}
                        sx={{ ml: 1 }}
                    >
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                            <AccountCircleIcon />
                        </Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={profileMenuAnchor}
                        open={Boolean(profileMenuAnchor)}
                        onClose={handleProfileMenuClose}
                    >
                        <MenuItem onClick={handleLogout}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LogoutIcon fontSize="small" />
                                <Typography>Logout</Typography>
                            </Box>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
} 