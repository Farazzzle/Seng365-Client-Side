import { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography,
    Box,
    InputLabel,
    MenuItem,
    FormControl,
    Grid,
    Stack,
    Input,
    Avatar,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { fetchCategories, postAuction, patchAuction } from "../helpers/AuctionHelper";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { getUserId, isLoggedIn } from "../helpers/LoginHelpers";
import { uploadPhoto } from "../helpers/AuctionHelper";

const acceptedFileTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

export const CreateAuction = ({ edit, id }: any) => {
    const [sellerId, setSellerId] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [reserve, setReserve] = useState(1);
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [categories, setCategories] = useState([]);
    const [chosenCategory, setChosenCategory] = useState("");
    const [choseCatId, setChoseCatId] = useState(0);
    const [errors, setErrors] = useState({ title: "", description: "", category: "", global: "" });
    const [auctionPhoto, setAuctionPhoto] = useState(null);
    const [imageSrc, setImageSrc] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const validateInfo = () => {
        if (title.length === 0) {
            setErrorFlag(true);
            setErrorMessage("No title given.");
        } else if (reserve < 1) {
            setErrorFlag(true);
            setErrorMessage("Reserve must be min $1");
        } else if (description.length <= 0) {
            setErrorFlag(true);
            setErrorMessage("Enter description");
        } else {
            setErrorFlag(false);
            setErrorMessage("");
        }
    };

    const categoryMenuItems = () => {
        return categories.map((item: any) => {
            return (
                <MenuItem value={item.categoryId} onClick={setCategory}>
                    {item.name}
                </MenuItem>
            );
        });
    };

    const setCategory = (event: any) => {
        setChoseCatId(event.currentTarget.dataset.value);
    };

    const getCategories = async () => {
        const categoryResponse = await fetchCategories();
        setCategories(categoryResponse);
    };

    useEffect(() => {
        validateInfo();
    }, [title, reserve, description]);

    useEffect(() => {
        getCategories();
    }, []);

    const changeImage = async (e: any) => {
        const file = e.target.files[0];
        setAuctionPhoto(file);

        if (file === undefined) {
            return;
        }
        if (!acceptedFileTypes.includes(file.type)) {
            return;
        }

        const src = URL.createObjectURL(file);
        setImageSrc(src);
    };

    const create = async () => {
        function GetFormattedDate(date: Date | null) {
            if (date !== null) {
                var month = ("0" + (date.getMonth() + 1)).slice(-2);
                var day = ("0" + date.getDate()).slice(-2);
                var year = date.getFullYear();
                var hour = ("0" + date.getHours()).slice(-2);
                var min = ("0" + date.getMinutes()).slice(-2);
                var seg = ("0" + date.getSeconds()).slice(-2);
                var mill = ("00" + date.getMilliseconds()).slice(-3);
                return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + seg + "." + mill;
            }
        }

        const formattedDate = GetFormattedDate(endDate);
        if (!errorFlag) {
            let body;
            if (reserve >= 1) {
                body = {
                    title: title,
                    description: description,
                    endDate: formattedDate,
                    categoryId: choseCatId ? choseCatId : null,
                    reserve: reserve >= 1 ? reserve : null,
                };
            } else {
                body = {
                    title: title,
                    description: description,
                    endDate: formattedDate,
                    categoryId: choseCatId ? choseCatId : null,
                };
            }

            let auctionIdTemp;
            if (edit) {
                const response = await patchAuction(body, id);
                if (response === undefined || response.status !== 200) {
                    console.log(response);
                    setErrorFlag(true);
                    setErrorMessage("Error patching auction.");
                    return;
                }
                auctionIdTemp = id;
            } else {
                const response = await postAuction(body);
                if (response == undefined) return;
                if (response.status !== 201) {
                    console.log(response);
                    setErrorFlag(true);
                    setErrorMessage(response.statusText);
                    return;
                }
                auctionIdTemp = response.data.auctionId;
            }

            if (auctionPhoto !== null && auctionPhoto !== undefined) {
                const uploadImageResponse = await uploadPhoto(auctionPhoto, auctionIdTemp);
                if (uploadImageResponse !== 200 && uploadImageResponse !== 201) {
                    setErrorFlag(true);
                    setErrorMessage(uploadImageResponse.statusText);
                    return;
                }
            }

            window.open(`/auctions/${auctionIdTemp}`, "_self");
        }
    };

    if (getUserId() === id) {
        return (
            <Box>
                <Button variant="contained" onClick={() => setOpenDialog(true)} disabled={!isLoggedIn()}>
                    {edit ? "Edit Auction" : "Create Auction"}
                </Button>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Create Auction</DialogTitle>
                    <Typography sx={{ color: "red" }} variant="subtitle1">
                        {errorMessage}
                    </Typography>
                    <DialogContent>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <label htmlFor="contained-button-file">
                                <Input
                                    // accept=".jpg,.jpeg,.png,.gif"
                                    id="contained-button-file"
                                    type="file"
                                    onChange={async (e) => await changeImage(e)}
                                />
                                <Button
                                    sx={{ fontFamily: "Oxygen" }}
                                    variant="contained"
                                    component="span"
                                    endIcon={<PhotoCamera />}
                                >
                                    Upload
                                </Button>
                            </label>
                        </Stack>
                        <Grid
                            pb={3}
                            sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                            item
                            xs={12}
                        >
                            <label htmlFor="file-input">
                                <img style={{ height: "200px", width: "auto" }} src={imageSrc}></img>
                            </label>
                            <input
                                hidden
                                type="file"
                                accept=".jpg,.jpeg,.png,.gif"
                                id="file-input"
                                onChange={async (e) => await changeImage(e)}
                            />
                        </Grid>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="title"
                            label="Title"
                            required
                            fullWidth
                            onChange={(event) => setTitle(event.target.value)}
                        />
                        <FormControl fullWidth>
                            <InputLabel id="category-select-label">Category</InputLabel>
                            <Select
                                labelId="category-select-label"
                                id="simple-select-category"
                                value={chosenCategory}
                                label="Category"
                                onChange={(event) => setChosenCategory(event.target.value)}
                            >
                                {categoryMenuItems()}
                            </Select>
                        </FormControl>
                        <Grid>
                            <LocalizationProvider dateAdapter={AdapterDateFns} fullwidth>
                                <DateTimePicker
                                    label="Date&Time picker"
                                    value={endDate}
                                    onChange={(newDate: Date | null) => {
                                        setEndDate(newDate);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                    minDate={new Date(moment().clone().add(1, "days").toISOString())}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="reserve amount"
                            label="Reserve Amount"
                            type="number"
                            fullWidth
                            variant="standard"
                            onChange={(event) => {
                                setReserve(parseInt(event.target.value));
                            }}
                            defaultValue={1}
                        />
                        <TextField
                            fullWidth
                            required
                            id="outlined-multiline-static"
                            label="Description"
                            multiline
                            rows={4}
                            onChange={(event) => {
                                setDescription(event.target.value);
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button onClick={create}>{edit ? "Finish Editing" : "Create Auction"}</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
    } else return <h1></h1>;
};
