import { Box, Carousel, Image } from "grommet";
import React, { Fragment } from "react";

export const ImagesSlideShow = ({ images, height = "medium", width = "medium" }) => {
    return (
        <Fragment>
            <Carousel wrap height={height} width={width} background="none">
                {
                    images && images.map((img, idx) => {
                        return (
                            <Fragment key={idx}>
                                <Box align="center" justify="center" background="light-1" pad="10px">
                                    <Image src={img} key={idx} fit="cover" />
                                </Box>
                            </Fragment>
                        );
                    })
                }
            </Carousel>
        </Fragment>
    );
};