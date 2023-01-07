import { Text } from 'grommet';
import React, { Fragment } from 'react'
import { SubMenu } from './navbars/SubMenu';

export const AboutHomestead = () => {
    return (
        <Fragment>
            <SubMenu labels={["About", "Homestead"]} />
            <div>
                <Text>This page should present a crisp description of what this product is all about?</Text>
            </div>
        </Fragment>
    )
};