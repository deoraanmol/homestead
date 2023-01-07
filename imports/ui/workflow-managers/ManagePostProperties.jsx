import React, { Fragment } from "react";
import { useTracker } from 'meteor/react-meteor-data';
import { Box, Button, Layer, Heading, FormField, TextInput, Text, Select, FileInput } from "grommet";
import { Add, Close } from "grommet-icons";
import { isEmpty } from "lodash";
import { Navigate } from "react-router-dom";
import { SubMenu } from "../navbars/SubMenu";
import { toBase64List } from "../../utils/image_utils";
import { ManageMyPostingsTable } from "../data-tables/ManageMyPostingsTable";
import { PropertiesCollection } from '/imports/api/PropertiesCollection';
import { ImagesSlideShow } from "../multimedia/ImagesSlideShow";

export const ManagePostProperties = ({ user }) => {
    const userProperties = useTracker(() => PropertiesCollection.find({ postedBy: user.username }, { sort: { postedAt: -1 } }).fetch());
    const [postPropertyForm, setPostPropertyForm] = React.useState(false);
    const [propertyImages, setPropertyImages] = React.useState([]);
    const [previewImages, setPreviewImages] = React.useState([]);
    const [propertyPost, setPropertyPost] = React.useState({
        name: '',
        location: '',
        postedBy: user.username,
        multimediaImages: []
    });
    const [formValid, setFormValid] = React.useState(0);
    const onOpen = () => setPostPropertyForm(true);
    const onClose = () => {
        setPropertyPost({
            name: '',
            location: '',
            postedBy: user.username,
            multimediaImages: []
        });
        setPostPropertyForm(undefined);
        setFormValid(0);
        setPreviewImages([]);
    };
    const onImagesUpload = (files) => {
        setPropertyPost({
            ...propertyPost,
            multimediaImages: files
        });
        toBase64List(files).then(base64List => setPreviewImages(base64List));
    }
    const onNameChange = (e) => {
        setPropertyPost({
            ...propertyPost,
            name: e.target.value
        });
    }
    const onLocationChange = (e) => {
        setPropertyPost({
            ...propertyPost,
            location: e.target.value
        });
    }
    const onSubmit = () => {
        toBase64List(propertyPost.multimediaImages).then((base64Images) => {
            const request = {
                ...propertyPost,
                multimediaImages: base64Images
            }
            Meteor.call('properties/post', request);
        })
        onClose();
    };
    React.useEffect(() => {
        if (!isEmpty(propertyPost.name) && !isEmpty(propertyPost.location) && !isEmpty(propertyPost.multimediaImages)) {
            setFormValid(1);
        } else {
            setFormValid(0);
        }
    }, [propertyPost]);
    if (user.profile.type !== "FieldAgent") {
        return <Navigate to="/about" replace />;
    }
    return (
        <Fragment>
            <SubMenu labels={["Properties", "Manage Property Submissions"]} />
            <Box fill margin={{ top: "5rem" }}>
                <Box align="center" justify="center">
                    <Button icon={<Add />} label="Post a property" color="black" onClick={onOpen} />
                </Box>
                {postPropertyForm && (
                    <Layer
                        position="center"
                        animate="false"
                        onClickOutside={onClose}
                        onEsc={onClose}
                    >
                        <Box
                            style={{ minWidth: '10em', height: '80vh' }}
                            onSubmit={onClose}
                        >
                            <Box direction="row" align="center" as="header" elevation="none" justify="between">
                                <Text margin={{ left: "small" }}>Post new property</Text>
                                <Button icon={<Close />} style={{ boxShadow: "none" }} onClick={onClose} />
                            </Box>
                            <Box flex overflow="auto" pad="xsmall">
                                <span>
                                    <FormField label="Name" help={
                                        <Text weight="lighter" size="small">
                                            Try to name it short-and-crisp
                                        </Text>
                                    } required>
                                        <TextInput onChange={onNameChange} value={propertyPost.name} />
                                    </FormField>
                                </span>
                                <span>
                                    <FormField label="Location" help={
                                        <Text weight="lighter" size="small">
                                            Mention complete address of the property
                                        </Text>
                                    }>
                                        <TextInput onChange={onLocationChange} value={propertyPost.location} />
                                    </FormField>
                                </span>
                                <span>
                                    <FormField label="Last Posted By" disabled>
                                        <TextInput value={propertyPost.postedBy} disabled />
                                    </FormField>
                                </span>
                                <span>
                                    <FormField label="Images" disabled help={<Text weight="lighter" size="small">Please upload atleast 3 clear images of the property</Text>}>
                                        <FileInput onChange={(event, { files }) => onImagesUpload(files)} multiple
                                            messages={{
                                                dropPromptMultiple: 'Drag and drop',
                                                browse: propertyImages.length > 0 ? 'Select more files' : 'Select files',
                                            }} />
                                    </FormField>
                                </span>
                                <span>
                                    <Box align="center">
                                        <ImagesSlideShow height="300px" width="300px" images={previewImages} />
                                    </Box>
                                </span>
                                <span>
                                    <Box flex={false} align="center">
                                        <Button type="submit" label="Submit" color="black" disabled={!formValid} onClick={onSubmit} primary />
                                    </Box>
                                </span>
                            </Box>
                        </Box>
                    </Layer>
                )}
                <ManageMyPostingsTable userProperties={userProperties} />
            </Box>
        </Fragment >
    );
};