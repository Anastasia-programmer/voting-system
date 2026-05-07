# 🗳️ E-Voting System Backend

This is a secure backend for an electronic voting system built with **Python (FastAPI)**. It includes authentication, cryptography modules, and voting services.

---

# ⚙️ Requirements

- Python 3.10+
- pip
- virtual environment (venv)

---

# 🚀 Setup & Installation

## 1. Clone the repository
```bash
git clone <your-repo-url>
cd voting-system
```

---

## 2. Create virtual environment
```bash
python -m venv venv
```

---

## 3. Activate virtual environment

### Windows:
```bash
venv\Scripts\activate
```

### Linux / WSL:
```bash
source venv/bin/activate
```

---

## 4. Install dependencies
```bash
pip install -r requirements.txt
```

---

# ▶️ Run the server

Make sure you are in the project root folder, then run:

```bash
uvicorn app.main:app --reload
```

---

# 🌐 API Access

Once running, the server will be available at:

```
http://127.0.0.1:8000
```

Swagger documentation:

```
http://127.0.0.1:8000/docs
```

---

# 📁 Project Structure

```
app/
 ├── main.py
 ├── auth.py
 ├── database.py
 ├── models.py
 ├── routes/
 ├── services/
 ├── crypto/
```

---

# ⚠️ Notes

- Always activate `venv` before running the project
- If dependencies fail, reinstall using `pip install -r requirements.txt`
- If module import error happens, ensure you run from the **root folder**

---

# 🧠 Author
Secure Voting Backend Project