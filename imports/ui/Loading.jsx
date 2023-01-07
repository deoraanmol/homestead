import React from 'react';
import { Spinner, Box, Text } from 'grommet';

export const Loading = () => (
    <Box align="center" direction="row" gap="small">
        <Spinner border={[{ side: 'horizontal', color: '#575b50', size: 'medium' }]} />
        <Text color='#575b50'>Loading...</Text>
    </Box>
);