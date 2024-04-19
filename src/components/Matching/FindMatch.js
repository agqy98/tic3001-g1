import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import {
    Button, Select, FormControl, InputLabel,
    Typography, MenuItem, Grid,
    Box, LinearProgress
} from '@mui/material';
import { Categories, Complexities } from '../../models/Parameters';
import MatchService from '../../services/MatchService';


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

export default function FindMatch({ user, token, timerRun, progress, startTimer, cancelTimer }) {

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

        if (formData.category == "") {
            return;
        }

        var reqBody = {
            topic: formData.category,
            msg: user.username
        }
        await MatchService.startReceive(token, reqBody)
            .then(response => {
                console.log('Request to start receiving logs was successful:', response);
                // Check if the response status code indicates success
                if (response.message === 'Receiving logs started successfully.') {
                    // Request was successful, handle accordingly
                    startTimer(formData.category);
                } else {
                    // Request failed, handle accordingly
                    console.error('Request to start receiving logs failed:', response);
                    alert("Matching service is down")
                }

            })
            .catch(error => {
                // Request failed, handle accordingly
                console.error('Error starting to receive logs:', error);
                alert("An error has occured")
            });
    };
    return (
        <Grid container>
            <Grid item xs={8} md={5}>
                <Typography variant="h4" gutterBottom>
                    Find a match
                </Typography>
                <Box sx={{ width: '100%' }} className="mb-3" hidden={timerRun != true}>
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
