import React from 'react';
import { Avatar, Anchor, Box, Header, Text } from 'grommet';
const gravatarSrc = '//s.gravatar.com/avatar/b7fb138d53ba0f573212ccce38a7c43b?s=80';

export const NavbarPreLogin = () => (
    <Header background="dark-1" pad="small">
        <Box direction="row" align="center" gap="small">
            <Avatar background="dark-2">🏠</Avatar>
            <Text size="large">
                Hunt your homestead
            </Text>
        </Box>
    </Header>
);