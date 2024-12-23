import { useCallback, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { XMarkIcon } from "@heroicons/react/24/solid";

const PropertyMedia = (props) => {
  const { formik } = props;
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = [];
    const newPreviewUrls = [];

    for (let i = 0; i < files.length && uploadedImages.length + newImages.length < 7; i++) {
      newImages.push(files[i]);
      newPreviewUrls.push(URL.createObjectURL(files[i]));
    }

    setUploadedImages([...uploadedImages, ...newImages]);
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);

    const newPhotos = [
      ...formik.values.photos,
      ...newImages.map((file) => ({ path: URL.createObjectURL(file), file })),
    ];
    formik.setFieldValue("photos", newPhotos);
  };

  const handleDeleteImage = (index) => {
    const updatedUploadedImages = uploadedImages.filter((_, i) => i !== index);
    const updatedPreviewUrls = previewUrls.filter((_, i) => i !== index);

    setUploadedImages(updatedUploadedImages);
    setPreviewUrls(updatedPreviewUrls);

    const updatedPhotos = formik.values.photos.filter((_, i) => i !== index);
    formik.setFieldValue("photos", updatedPhotos);
  };

  return (
    <Card>
      <CardHeader subheader="The information can be edited" title="Property Media" />
      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ m: -1.5 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              {previewUrls.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  {previewUrls.map((url, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        display: "inline-block",
                        marginRight: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      <img
                        src={url}
                        alt={`Uploaded ${index + 1}`}
                        style={{ maxHeight: "70px", display: "block" }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          color: "red",
                        }}
                        onClick={() => handleDeleteImage(index)}
                      >
                        <XMarkIcon style={{ width: "16px", height: "16px" }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
              <TextField
                error={!!(formik.touched.photos && formik.errors.photos)}
                fullWidth
                helperText={formik.touched.photos && formik.errors.photos}
                label="Photos"
                name="photos"
                onBlur={formik.handleBlur}
                onChange={handleFileChange}
                type="file"
                inputProps={{ multiple: true }}
                style={{ cursor: "pointer" }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                error={!!(formik.touched.virtualTour && formik.errors.virtualTour)}
                fullWidth
                helperText={formik.touched.virtualTour && formik.errors.virtualTour}
                label="Virtual Tour"
                placeholder="https://link-to-virtual-tour.example"
                name="virtualTour"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.virtualTour}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                error={!!(formik.touched.video && formik.errors.video)}
                fullWidth
                helperText={formik.touched.video && formik.errors.video}
                label="Video"
                placeholder="https://link-to-video.example"
                name="video"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.video}
              />
            </Grid>
          </Grid>
        </Box>
      </CardContent>
      <Divider />
    </Card>
  );
};

export default PropertyMedia;
