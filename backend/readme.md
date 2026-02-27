# 🧵 Fabric Database Backend

Backend setup for the **Fabric Database Project** built using:

- ⚡ FastAPI
- 🍃 MongoDB
- 🚀 Uvicorn (server)
- 🔐 Python Virtual Environment

This guide explains how to set up and run the backend project successfully in VS Code.

---

# 📌 1️⃣ Prerequisites

Make sure the following are installed:

- Python 3.9 or above
- MongoDB (Local installation OR MongoDB Atlas)
- Git
- VS Code

Check Python version:

```bash
python --version
```

---

# 📌 2️⃣ Clone the Repository

Open terminal and run:

```bash
git clone https://github.com/SHARANYA-216/Fabric-database-setup.git
cd Fabric-database-setup
```

---

# 📌 3️⃣ Create & Activate Virtual Environment

### ▶ On Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### ▶ On Mac/Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

After activation, you should see `(venv)` in your terminal.

---

# 📌 4️⃣ Install Dependencies

If `requirements.txt` exists:

```bash
pip install -r requirements.txt
```

If not, install manually:

```bash
pip install fastapi uvicorn pymongo python-dotenv
```

---

# 📌 5️⃣ Setup Environment Variables

Create a file named:

```
.env
```

Inside the root folder and add:

### ▶ For Local MongoDB

```
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=fabric_db
```

### ▶ For MongoDB Atlas

```
MONGO_URI=your_atlas_connection_string
DATABASE_NAME=fabric_db
```

⚠ Important:
- Do NOT upload `.env` to GitHub
- Make sure `.env` is added to `.gitignore`

---

# 📌 6️⃣ Start MongoDB

### ▶ If Using Local MongoDB

Ensure MongoDB service is running.

On Windows:
- Open Services
- Start MongoDB service

Or run:

```bash
mongod
```

If using MongoDB Atlas, no need to start local service.

---

# 📌 7️⃣ Run the Backend Server 🌟🌟🌟

If your main file is `main.py`:

```bash
uvicorn main:app --reload
```

---

# 📌 8️⃣ Access the API

After running successfully, open in your browser:

### Swagger UI 🌟🌟🌟
```
http://127.0.0.1:8000/docs 
```

### ReDoc
```
http://127.0.0.1:8000/redoc
```

---

# 📂 Project Structure

```
FABRIC BACKEND/
│
├── routes/
│   ├── fabric.py
│   └── seller.py
│
├── auth.py
├── database.py
├── main.py
├── models.py
├── schemas.py
├── requirements.txt
├── .env
└── venv/
```

---

# 📌 9️⃣ Common Errors & Fixes

### ❌ Module Not Found Error
Run:
```bash
pip install -r requirements.txt
```

### ❌ MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- Verify internet connection (if using Atlas)

### ❌ Port Already in Use
Run on different port:
```bash
uvicorn main:app --reload --port 8001
```

---

# 📌 🔐 Important Setup Commands (For First Time Only)

If requirements.txt is missing, generate it:

```bash
pip freeze > requirements.txt
```

Create `.gitignore` file and add:

```
venv/
.env
__pycache__/
```

---

# 👩‍💻 Contributors

- Sharanya Kathroju
- Sathwik Kandakatla
- Joshi Vishnu Vardhan

---

# 🚀 Project Status

Backend setup completed.  
Further development in progress.

---

# 📞 Support

If setup fails, check:
- Python version
- MongoDB service status
- Virtual environment activation
- Correct file naming

## 📸 API Preview

![](api1.png)
![](api2.png)

Happy Coding 🚀