import { DataTable, Text, Box, Button, Layer, FormField, TextInput, FileInput, Image, Carousel } from "grommet";
import React, { Fragment } from "react";
import { isEmpty, cloneDeep } from "lodash";
import { toBase64, toBase64List } from "../../utils/image_utils";
import { PropertiesCollection } from '/imports/api/PropertiesCollection';
import { ImagesSlideShow } from "../multimedia/ImagesSlideShow";
import { Close } from "grommet-icons";

export const ManageMyPostingsTable = ({ userProperties }) => {
    const [show, setShow] = React.useState(false);
    const [clickedProperty, setClickedProperty] = React.useState({});
    const [previewImages, setPreviewImages] = React.useState([]);
    const [updateFormValid, setUpdateFormValid] = React.useState(0);
    const onUpdateName = (e) => {
        setClickedProperty({ ...clickedProperty, name: e.target.value });
    }
    const onUpdateLocation = (e) => {
        setClickedProperty({ ...clickedProperty, location: e.target.value });
    }
    const onUpdateImages = (files) => {
        setClickedProperty({ ...clickedProperty, multimediaImages: files });
        toBase64List(files).then((base64List) => setPreviewImages(base64List));
    }
    React.useEffect(() => {
        if (!isEmpty(clickedProperty.name) && !isEmpty(clickedProperty.location) && !isEmpty(clickedProperty.multimediaImages)) {
            setUpdateFormValid(1);
        } else {
            setUpdateFormValid(0);
        }
    }, [clickedProperty]);
    const onUpdateSubmit = () => {
        const updatedProperty = cloneDeep(clickedProperty);
        toBase64List(updatedProperty.multimediaImages).then((base64List) => {
            const request = {
                _id: updatedProperty._id,
                name: updatedProperty.name,
                location: updatedProperty.location,
                multimediaImages: base64List,
                statusTrail: updatedProperty.statusTrail,
                postedBy: clickedProperty.postedBy
            }
            Meteor.call('properties/put', request);
            setShow(false);
        });
    }
    return (
        <Fragment>
            {
                isEmpty(userProperties) ?
                    <Box justify="center" align="center" margin={{ vertical: "5rem" }}><Text color="gray">No properties posted yet!</Text></Box> :
                    <DataTable
                        columns={[
                            { property: "_id", header: "ID", primary: true },
                            { property: "name", header: "Name" },
                            { property: "location", header: "Location" },
                            { property: "postedBy", header: "Posted By" },
                            { property: "currentStatus", header: "Status" },
                            { property: "cityManagerRemarks", header: "Remarks" },
                        ]}
                        data={userProperties}
                        step={10}
                        paginate={true}
                        onClickRow={(event) => {
                            const clonedRow = cloneDeep(event.datum);
                            if (clonedRow.currentStatus !== "PENDING" && clonedRow.currentStatus !== "REJECTED") {
                                alert("Only 'PENDING' or 'REJECTED' properties can be updated!");
                            } else {
                                setShow(true);
                                setClickedProperty(clonedRow);
                                setPreviewImages(clonedRow.multimediaImages);
                            }
                        }}
                    />
            }
            {!isEmpty(userProperties) && show && (
                <Layer
                    position="center"
                    full="vertical"
                    onEsc={() => setShow(false)}
                    onClickOutside={() => setShow(false)}
                >
                    <Box margin="medium" style={{ height: "85vh" }}>
                        <Box as="header" direction="row" align="center" elevation="none" justify="center">
                            <Text margin={{ left: 'small' }}>Update Property (ID: {clickedProperty._id})</Text>
                            <Button icon={<Close />} style={{ boxShadow: "none" }} onClick={() => setShow(false)} />
                        </Box>
                        <Box flex overflow="auto" pad="small">
                            <Box flex="grow" overflow="auto" pad={{ vertical: 'medium' }}>
                                <FormField label="Name" required>
                                    <TextInput onChange={onUpdateName} value={clickedProperty.name} />
                                </FormField>
                                <FormField label="Location">
                                    <TextInput onChange={onUpdateLocation} value={clickedProperty.location} />
                                </FormField>
                                <FormField label="Last Posted By" disabled>
                                    <TextInput value={clickedProperty.postedBy} disabled />
                                </FormField>
                                <FormField label="Upload new images" disabled help={<Text weight="lighter" size="small">Please upload atleast 3 clear images of the property</Text>}>
                                    <FileInput onChange={(event, { files }) => onUpdateImages(files)} multiple
                                        messages={{
                                            dropPromptMultiple: 'Drag and drop',
                                            browse: 'Select new files',
                                        }} />
                                </FormField>
                                <Box align="center">
                                    <ImagesSlideShow images={previewImages} />
                                </Box>
                            </Box>
                        </Box>
                        <Box flex={false} as="footer" align="center">
                            <Button type="submit" onClick={onUpdateSubmit} disabled={!updateFormValid} label="Update" color="black" primary />
                        </Box>
                    </Box>
                </Layer>
            )}
        </Fragment>
    );
};