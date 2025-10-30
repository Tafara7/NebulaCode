# ReadMe

This is a simple version control website focused on code that allows users to share and update files in shared projects, view other projects, add friends, collaborate, etc.

All relevant files are in their respective folders (frontend and backend).

# To build and run the app in Docker:
docker build -t nebula-app .
docker run -p 3000:3000 nebula-app


### Steps to Run
1. Clone the repository
2. Open terminal in project root
3. Run:
```bash
docker compose up --build
```
4. Wait for both containers to start (you'll see "Server running on port 3000")
5. Open http://localhost:3000 in your browser

### Default Admin Account
- Email: lionelmessi@gmail.com
- Password: Password123

### User Account
- Username: mosalah@gmail.com
- Password: Password123