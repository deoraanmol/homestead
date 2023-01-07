import React from "react";
import { Box, Text, Grommet } from "grommet";
import { Next } from "grommet-icons";
export const SubMenu = ({ labels }) => {
    return (<Grommet themeMode="light" background="#cdcdcd">
        <Box pad="0.5rem">
            <Text color="black">
                {labels[0]} <Next size="small" /> {labels[1]}
            </Text>
        </Box>
    </Grommet>);
}