// src/logger.js
import axios from 'axios';

const LOG_API = "http://20.207.122.201/evaluation-service/logs";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrZzQ5NDNAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNDQxOSwiaWF0IjoxNzc3NzAzNTE5LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMWQzZGMzYzItMjJkNS00MTY1LWJhNTUtZmI3ZDFjMDhlZDkxIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoia2F2eWEgZ2FuZGhpIiwic3ViIjoiMTgzZWIzODItYTM0MS00Y2Q2LThhNTgtN2QxMWMwZTFiMWU0In0sImVtYWlsIjoia2c0OTQzQHNybWlzdC5lZHUuaW4iLCJuYW1lIjoia2F2eWEgZ2FuZGhpIiwicm9sbE5vIjoicmEyMzExMDI2MDEwNzIyIiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMTgzZWIzODItYTM0MS00Y2Q2LThhNTgtN2QxMWMwZTFiMWU0IiwiY2xpZW50U2VjcmV0IjoiS3pFTnFGRVd4ZEFDbWJKcCJ9.2QJhBkipUm9ErFBh7C6bnPafs4JShDhCqBFHryfSwWs";

export async function logAction(stack, level, pkg, message) {
  try {
    const response = await axios.post(
      LOG_API,
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
      }
    );
    console.log("Log successfully sent from frontend:", response.data);
    return response.data;
  } catch (error) {
    console.error("Frontend log failed:", error.message);
  }
}