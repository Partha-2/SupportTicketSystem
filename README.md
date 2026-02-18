# Support Ticket System

An AI-powered support ticket management system built with Django, React, and PostgreSQL, fully containerized with Docker.

## Features

- **AI-Powered Categorization**: Automatically suggests category and priority based on ticket description using an LLM.
- **Dynamic Stats Dashboard**: Real-time aggregated metrics using database-level aggregation.
- **Search and Filter**: Easily browse tickets by category, priority, status, or keyword search.
- **Premium UI**: Modern, dark-themed interface with glassmorphism effects.

## Setup Instructions

### Prerequisites
- Docker and Docker Compose

### Quick Start
1. Clone the repository.
2. (Optional) Create a `.env` file or set the environment variable `LLM_API_KEY` (Gemini or OpenAI).
3. Run the following command:
   ```bash
   docker-compose up --build
   ```
4. Access the application:
   - **Frontend**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:8000/api/tickets/](http://localhost:8000/api/tickets/)

## Design Decisions

### LLM Choice
I chose the **Gemini API** (with fallbacks) for the classification logic because of its high context window and ease of integration. The prompt is designed to return a structured JSON response to minimize parsing errors.

### Prompt Logic
The prompt is defined in `backend/tickets/views.py`:
```python
prompt = f"""
Classify the following support ticket description into a category and priority level.
Categories: billing, technical, account, general
Priorities: low, medium, high, critical

Description: {description}

Return only a JSON object with keys "suggested_category" and "suggested_priority".
"""
```

### Database Aggregation
The statistics endpoint uses Django's `annotate` and `count` functions to ensure all calculations are performed at the database level, optimizing performance for large datasets.

### Frontend Architecture
Built with React and Vite for a fast development experience. It uses a custom-crafted CSS system to provide a premium feel without the overhead of heavy UI libraries.
