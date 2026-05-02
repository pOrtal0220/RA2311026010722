import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, Typography, Tabs, Tab, Box, Card, CardContent, Chip, Button, Select, MenuItem, FormControl, InputLabel, Grid, Pagination 
} from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { logAction } from './logger';
import './App.css'; // <-- Importing our creative styling!

const NOTIFICATIONS_API = "http://20.207.122.201/evaluation-service/notifications";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrZzQ5NDNAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNDQxOSwiaWF0IjoxNzc3NzAzNTE5LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMWQzZGMzYzItMjJkNS00MTY1LWJhNTUtZmI3ZDFjMDhlZDkxIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoia2F2eWEgZ2FuZGhpIiwic3ViIjoiMTgzZWIzODItYTM0MS00Y2Q2LThhNTgtN2QxMWMwZTFiMWU0In0sImVtYWlsIjoia2c0OTQzQHNybWlzdC5lZHUuaW4iLCJuYW1lIjoia2F2eWEgZ2FuZGhpIiwicm9sbE5vIjoicmEyMzExMDI2MDEwNzIyIiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMTgzZWIzODItYTM0MS00Y2Q2LThhNTgtN2QxMWMwZTFiMWU0IiwiY2xpZW50U2VjcmV0IjoiS3pFTnFGRVd4ZEFDbWJKcCJ9.2QJhBkipUm9ErFBh7C6bnPafs4JShDhCqBFHryfSwWs";

export default function NotificationApp() {
  const [activeTab, setActiveTab] = useState(0); 
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(() => JSON.parse(localStorage.getItem('read_notifications') || '[]'));

  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    localStorage.setItem('read_notifications', JSON.stringify(readIds));
  }, [readIds]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(NOTIFICATIONS_API, {
        headers: { Authorization: `Bearer ${TOKEN}` },
        params: { page, limit, notification_type: category || undefined }
      });
      if (response.data && response.data.notifications) {
        setNotifications(response.data.notifications);
        setTotalPages(response.data.totalPages || 1);
        await logAction("frontend", "info", "fetch_notifications", `Fetched page ${page} successfully`);
      }
    } catch (err) {
      console.error("Could not fetch notifications:", err.message);
    }
  };

  useEffect(() => { fetchNotifications(); }, [page, limit, category]);

  const handleMarkAsRead = async (id, title) => {
    if (!readIds.includes(id)) {
      setReadIds([...readIds, id]);
      await logAction("frontend", "info", "read_event", `Notification '${title}' (ID: ${id}) marked as read`);
    }
  };

  const getPrioritySorted = (items) => {
    const weights = { placement: 3, result: 2, event: 1 };
    return [...items].sort((a, b) => {
      const wA = weights[a.notification_type?.toLowerCase()] || 0;
      const wB = weights[b.notification_type?.toLowerCase()] || 0;
      if (wA !== wB) return wB - wA;
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  };

  const displayedNotifications = activeTab === 1 ? getPrioritySorted(notifications) : notifications;

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      {/* Dynamic Title with animated glowing gradient class */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h3" className="title-gradient" gutterBottom>
          Campus Notification Portal
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#94a3b8' }}>
          Real-time tracking with optimized Priority Inbox
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={(e, val) => { setActiveTab(val); setPage(1); }} centered>
          <Tab label="All Notifications" />
          <Tab label="Priority View" />
        </Tabs>
      </Box>

      {/* Filtering Options */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: '#94a3b8' }}>Filter Type</InputLabel>
            <Select 
              value={category} 
              label="Filter Type" 
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' } }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Placement">Placement</MenuItem>
              <MenuItem value="Result">Result</MenuItem>
              <MenuItem value="Event">Event</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: '#94a3b8' }}>Page Size</InputLabel>
            <Select 
              value={limit} 
              label="Page Size" 
              onChange={(e) => { setLimit(e.target.value); setPage(1); }}
              sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' } }}
            >
              <MenuItem value={5}>5 items</MenuItem>
              <MenuItem value={10}>10 items</MenuItem>
              <MenuItem value={15}>15 items</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Grid List */}
      {displayedNotifications.map((notif) => {
        const isRead = readIds.includes(notif.id);
        return (
          <Card 
            key={notif.id} 
            className={`notification-card ${isRead ? 'notification-card-read' : 'glow-unread'}`}
            sx={{ mb: 2, borderLeft: `5px solid ${isRead ? '#64748b' : '#3b82f6'} !important` }}
          >
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Chip 
                    label={notif.notification_type || 'General'} 
                    size="small"
                    sx={{ backgroundColor: isRead ? '#334155' : '#1d4ed8', color: '#fff' }}
                  />
                  {!isRead && <Chip label="NEW" color="success" size="small" variant="outlined" />}
                </Box>
                <Typography variant="h6" sx={{ color: isRead ? '#64748b' : '#f8fafc', fontWeight: 600 }}>
                  {notif.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  {notif.message}
                </Typography>
                <Typography variant="caption" sx={{ color: '#475569', display: 'block', mt: 1 }}>
                  {new Date(notif.timestamp).toLocaleString()}
                </Typography>
              </Box>

              <Button 
                variant={isRead ? "text" : "contained"} 
                color={isRead ? "inherit" : "primary"}
                size="small"
                onClick={() => handleMarkAsRead(notif.id, notif.title)}
                startIcon={isRead ? <MarkEmailReadIcon /> : <NotificationsActiveIcon />}
                sx={{ borderRadius: '8px', textTransform: 'capitalize' }}
              >
                {isRead ? "Viewed" : "Check Read"}
              </Button>
            </CardContent>
          </Card>
        );
      })}

      {/* Pagination component */}
      <Box display="flex" justifyContent="center" sx={{ mt: 5 }}>
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={(e, val) => setPage(val)} 
          sx={{ '& .MuiPaginationItem-root': { color: '#94a3b8' }, '& .Mui-selected': { color: '#fff !important' } }}
        />
      </Box>
    </Container>
  );
}