import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  TextField, Button, Select, FormControl, InputLabel,
  Typography, MenuItem, Box, Chip,
  Grid
} from '@mui/material';
import Question, { QuestionFormat } from '../../models/Question';
import { Categories, Complexities } from '../../models/Parameters';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import QuestionService from '../../services/QuestionService';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function getStyles(name, selectedCategories, theme) {
  return {
    fontWeight:
      selectedCategories.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function QuestionDetail({ token }) {
  const { id } = useParams(); // Retrieve id parameter from URL
  const theme = useTheme();
  const navigate = useNavigate();

  // State to store form inputs
  const [formData, setFormData] = useState({
    ...QuestionFormat,
    id: id == 0 ? '' : id // Set the id property to the value retrieved from the URL parameter
  });
  const [selectedCategories, setSelectedCategories] = useState(formData.category);
  useEffect(() => {
    if (id != 0) {
      getQuestion(id);
    }
  }, [])

  const getQuestion = async (id) => {
    const res = await QuestionService.getQuestionById(token, id);
    if (res.questionDetails) {
      setFormData(res.questionDetails)
      setSelectedCategories(res.questionDetails.category)
    }
  }

  const handleCategoriesChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
    setFormData({ ...formData, category: value });
  };

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
    // Create a new instance of Question using form data
    const questionData = new Question(
      formData._id,
      formData.id || 0,
      formData.title,
      formData.description,
      formData.category,
      formData.complexity,
      formData.link
    );
    if (formData.id == 0 || formData.id == '') {
      // Send questionData to backend (e.g., via API)
      const res = await QuestionService.createQuestion(token, questionData);
      const isSuccessful = res.message && (res.message.indexOf("successfully") != -1);
      if (isSuccessful) {
        alert(res.message);
        navigate('/home', { replace: true });
      } else {
        alert(res.message);
      }
    } else {
      // Send questionData to backend (e.g., via API)
      const res = await QuestionService.updateQuestion(token, formData.id, questionData);
      const isSuccessful = res.message && (res.message.indexOf("successfully") != -1);
      if (isSuccessful) {
        console.log(res)
        alert(res.message);
        navigate('/home', { replace: true });
      } else {
        alert(res.message);
      }
    }
  };
  const resetForm = () => {
    setFormData(QuestionFormat);
    setSelectedCategories([])
  }

  return (
    <Grid container>
      <Grid item xs={8} md={5}>
        <Typography variant="h4" gutterBottom>
          {
            formData.id == '' ?
              <b>Add Question</b> :
              <b>Edit Question {formData.id}</b>
          }
        </Typography>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <TextField
              label="ID"
              type="number"
              name="id"
              value={formData.id}
              fullWidth
              hidden
            />
          </div>
          <div className='mb-3'>
            <TextField
              label="Title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div className='mb-3'>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
            />
          </div>
          <div className='mb-3'>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                label='Category'
                multiple
                value={selectedCategories}
                onChange={handleCategoriesChange}
                MenuProps={MenuProps}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {Categories.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, selectedCategories, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
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
            <TextField
              label="Link"
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div className='mb-3'>
            <Button variant="contained" color="primary" type="submit">
              {
                formData.id == '' ? "Add" : "Update"
              }
            </Button>
            {' '}
            <Button component={Link} variant='outlined' to="/home">
              Back
            </Button>
          </div>
        </form>
      </Grid>
    </Grid>
  );
}
