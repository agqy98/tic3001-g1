import React from 'react'
import { AccountCircleOutlined as NonAdminIcon, ManageAccountsOutlined as AdminIcon } from '@mui/icons-material'
export default function Profile({ user, token }) {
  const date = new Date(user.createdAt);

  // Get the YYYY-MM-DD format
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div>
      {user.isAdmin ?
        <AdminIcon fontSize='large' /> : <NonAdminIcon fontSize='large' />
      }
      <h3>
        {user.username}
      </h3>
      <p>
        {user.email}
      </p>
      <p>
        From {formattedDate}
      </p>
    </div>

  )
}
