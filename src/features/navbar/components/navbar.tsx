import React from "react";
import { NavBarProps } from "../../../types";
import { AppBar, Button, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";

export const NavBar: React.FC<NavBarProps> = ({routes}: NavBarProps) => {
    return (
        <AppBar position="static">
            <Toolbar>
                {routes.map((route) => (
                    <Button 
                        color="inherit"
                        key={route.label} 
                        component={Link} 
                        to={route.path}
                    >
                        {route.label}
                    </Button>
                ))}
            </Toolbar>
        </AppBar>
    );
}