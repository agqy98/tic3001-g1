import React, { useEffect, useState } from 'react'
import QuestionService from '../../services/QuestionService'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Delete as DeleteIcon } from "@mui/icons-material"

export default function QuestionList({ token }) {
  const [data, setData] = useState([])
  useEffect(() => {
    if (token) {
      getAllQuestions(token)
    }
  }, [token])

  const getAllQuestions = async (token) => {
    const res = await QuestionService.getAllQuestions(token);
    setData(res.questions || []);
  }
  const handleDelete = async (id) => {
    console.log("Deleting " + id + "...")
    const res = await QuestionService.deleteQuestion(token, id);
    const isSuccessful = res.message && (res.message.indexOf("successfully") != -1);
    if (isSuccessful) {
      alert(res.message);
      getAllQuestions(token);
    } else {
      alert(res.message);
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Complexity</TableCell>
            <TableCell>Link</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            data.map((item, index) => {
              return <TableRow key={"Row-" + index}>
            <TableCell>
              <Link to={"/question/" + item.id}>
                {item.id}
              </Link>
            </TableCell>
            <TableCell>{item.title}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>
              {item.category && item.category.map((cat, index) => (
                <Chip key={index} label={cat} />
              ))}
            </TableCell>
            <TableCell>{item.complexity}</TableCell>
            <TableCell>{item.link}</TableCell>
            <TableCell>
              <Button onClick={() => handleDelete(item.id)}>
                <DeleteIcon />
              </Button>
            </TableCell>
          </TableRow>
            })
          }
        </TableBody>
      </Table>
    </TableContainer>
  )
}
