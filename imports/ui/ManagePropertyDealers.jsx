import React, { Fragment } from "react";
import { ManageUsersTable } from "./data-tables//ManageUsersTable";
import { useTracker } from 'meteor/react-meteor-data';
import { Box, Button, Layer, Heading, FormField, TextInput, Text, Select } from "grommet";
import { Add, Close } from "grommet-icons";
import { isEmpty } from "lodash";
import { Navigate } from "react-router-dom";

export const ManagePropertyDealers = ({ user }) => {
    const [createUserFormOpen, setCreateUserFormOpen] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [userType, setUserType] = React.useState('');
    const [formValid, setFormValid] = React.useState(0);
    const propertyDealers = useTracker(() => Meteor.users.find({ "profile.type": "PropertyDealer" }).fetch());
    const onOpen = () => setCreateUserFormOpen(true);
    const onClose = () => {
        setUsername('');
        setPassword('');
        setUserType('');
        setCreateUserFormOpen(undefined)
    };
    const onSubmit = () => {
        Meteor.call('users/create', { username, password, userType: "PropertyDealer" })
        onClose();
    };
    const userTypes = ['PropertyDealer'];
    React.useEffect(() => {
        if (!isEmpty(username) && !isEmpty(password)) {
            setFormValid(1);
        } else {
            setFormValid(0);
        }
    }, [username, password, userType]);
    if (user.profile.type !== "FieldAgent") {
        return <Navigate to="/about" replace />;
    }
    return (
        <Fragment>
            <Box fill margin={{ top: "5rem" }}>
                <Box align="center" justify="center">
                    <Button icon={<Add />} label="Add" color="black" onClick={onOpen} />
                </Box>
                {createUserFormOpen && (
                    <Layer
                        position="right"
                        full="vertical"
                        modal
                        onClickOutside={onClose}
                        onEsc={onClose}
                    >
                        <Box
                            as="form"
                            fill="vertical"
                            overflow="auto"
                            width="medium"
                            pad="medium"
                            onSubmit={onClose}
                        >
                            <Box flex={false} direction="row" justify="between">
                                <Heading level={3} margin="none">Add new dealer</Heading>
                                <Button icon={<Close />} onClick={onClose} />
                            </Box>
                            <Box flex="grow" overflow="auto" pad={{ vertical: 'medium' }}>
                                <FormField label="Username" help={
                                    <Text weight="lighter" size="small">
                                        Usernames must be unique
                                    </Text>
                                } required>
                                    <TextInput onChange={({ target }) => setUsername(target.value)} value={username} />
                                </FormField>
                                <FormField label="Password" help={
                                    <Text weight="lighter" size="small">
                                        Please set a strong password
                                    </Text>
                                }>
                                    <TextInput onChange={({ target }) => setPassword(target.value)} type="password" value={password} />
                                </FormField>
                                <FormField label="Type" help={
                                    <Text weight="lighter" size="small">
                                        Field Agents are allowed to manage only `Property Dealers`
                                    </Text>
                                }>
                                    <Select placeholder="Select user type" value={userType} options={userTypes} onChange={({ opt }) => setUserType(opt)} />
                                </FormField>
                            </Box>
                            <Box flex={false} as="footer" align="start">
                                <Button type="submit" label="Submit" color="black" disabled={!formValid} onClick={onSubmit} primary />
                            </Box>
                        </Box>
                    </Layer>
                )}
                <ManageUsersTable users={propertyDealers} />
            </Box>
        </Fragment >
    );
};