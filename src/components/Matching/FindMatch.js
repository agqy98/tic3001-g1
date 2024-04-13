import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import {
    Button, Select, FormControl, InputLabel,
    Typography, MenuItem, Grid,
    Box, LinearProgress
} from '@mui/material';
import { Categories, Complexities } from '../../models/Parameters';

function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

// LinearProgressWithLabel.propTypes = {
//     /**
//      * The value of the progress indicator for the determinate and buffer variants.
//      * Value between 0 and 100.
//      */
//     value: PropTypes.number.isRequired,
// };

export default function FindMatch({ token, timerRun, progress, startTimer, cancelTimer }) {

    // State to store form inputs
    const [formData, setFormData] = useState({
        category: "",
        complexity: ""
    });

    useEffect(() => {

    }, []);

    // Handler for form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        startTimer();

        // Send questionData to backend (e.g., via API)
        // const res = await QuestionService.createQuestion(token, questionData);
        // const isSuccessful = res.message && (res.message.indexOf("successfully") != -1);
        // if (isSuccessful) {
        //     alert(res.message);
        //     navigate('/', { replace: true });
        // } else {
        //     alert(res.message);
        // }
    };
    return (
        <Grid container>
            <Grid item xs={8} md={5}>
                <Typography variant="h4" gutterBottom>
                    Find a match
                </Typography>
                <Box sx={{ width: '100%' }} className="mb-3" hidden={timerRun == false}>
                    <LinearProgressWithLabel value={progress} />
                </Box>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                label='Category'
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                disabled={timerRun}
                            >
                                {
                                    Categories.map(item => {
                                        return <MenuItem key={item} value={item}>{item}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </div>
                    <div className='mb-3'>
                        <FormControl fullWidth>
                            <InputLabel>Complexity</InputLabel>
                            <Select
                                label='Complexity'
                                name="complexity"
                                value={formData.complexity}
                                onChange={handleChange}
                                disabled={timerRun}
                            >
                                {
                                    Complexities.map(item => {
                                        return <MenuItem key={item} value={item}>{item}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </div>
                    <div className='mb-3'>
                        <Button variant="contained" color="primary" type="submit" disabled={timerRun}>
                            Search
                        </Button>
                        {' '}
                        {/* {
                            timerRun ?
                                <Button variant="contained" color="info" onClick={() => cancelTimer()}>
                                    Cancel
                                </Button>
                                : */}
                                <Button component={Link} variant='outlined' to="/">
                                    Back
                                </Button>
                        {/* } */}
                    </div>
                </form>
            </Grid>
        </Grid>
    );
}
