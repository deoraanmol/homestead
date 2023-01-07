import React from 'react';
import { Avatar, Anchor, Box, Header, Nav, Menu } from 'grommet';
import { Power } from 'grommet-icons';
const items = [
    { label: 'About', href: '/about' },
    { label: 'Property-Dealers', href: '/manage-property-dealers' },
    { label: 'Properties', href: '/manage-property-postings' }
];
const logout = () => Meteor.logout();

export const NavbarFieldAgent = ({ user }) => (
    <Header background="dark-1" pad="small">
        <Nav direction="row">
            {items.map((item) => (
                <Box>
                    <Anchor color="lightgray" href={item.href} label={item.label} key={item.label} />
                </Box>
            ))}
        </Nav>
        <Box direction="row" align="center" gap="small" onClick={logout}>
            <Anchor color="lightgray"><span style={{ paddingRight: '0.5rem' }}>{user.username}</span><Power size='16px' /></Anchor>
        </Box>
    </Header>
);