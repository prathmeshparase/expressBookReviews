curl -X POST http://localhost:5000/customer/login -H "Content-Type: application/json" -d "{\"username\": \"prathmesh\", \"password\": \"password123\"}" -c cookie.txt
{
  "message": "User successfully logged in"
}
