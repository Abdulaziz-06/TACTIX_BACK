# TACTIX Intelligence API Reference

The TACTIX intelligence platform exposes several API endpoints for triggering multi-agent workflows and individual agent intelligence generation.

## 🚀 Base URL
The API server runs locally at: `http://localhost:3001/api`

---

## 1. Multi-Agent Workflow API
Triggers the full quad-agent parallel research and synthesis workflow (`intelligenceWorkflow`). This endpoint executes the entire logic of Market analysis, Nature/Environment monitoring, Geopolitical (Shadow) intelligence, and Nexus synthesis.

### **POST** `/workflow/intelligence`
- **Description**: Executes the complete intelligence graph generation for a given topic.
- **Payload**:
  ```json
  {
    "topic": "The impact of the 7.2 earthquake on global semiconductor supply chains"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Intelligence graph successfully generated.",
    "data": {
      "finalGraph": {
         "nodes": [...],
         "edges": [...],
         "insights": "..."
      }
    }
  }
  ```

---

## 2. Individual Agent Trigger API
Directly invokes a specific agent from the TACTIX network to generate intelligence on a specific prompt. Each agent corresponds to a specialized domain.

### **POST** `/agent/:agentId`
- **Path Parameter (`agentId`)**:
  - `market`: Market Dynamics Agent (economic impacts, stock volatility, industry trends).
  - `nature`: Environmental/Nature Agent (natural disasters, ecological shifts, climate impacts).
  - `shadow`: Geopolitical/Shadow Agent (global stability, conflict, political risk).
  - `nexus`: Nexus Synthesis Agent (cross-domain synthesis and graph construction).
- **Description**: Triggers a direct generative request to the specified agent.
- **Payload**:
  ```json
  {
    "prompt": "Analyze the immediate volatility of the S&P 500 following current regional instability."
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "status": "success",
    "agent": "marketAgent",
    "data": {
      "nodes": [...],
      "edges": [...],
      "summary": "..."
    }
  }
  ```

---

## 3. System Utilities
Basic utility endpoints for monitoring the status of the intelligence core.

### **GET** `/health`
- **Description**: Checks if the Mastra instance and API server are responsive.
- **Response**:
  ```json
  {
    "status": "ok",
    "mastra": "ready"
  }
  ```

---

> [!TIP]
> **Example `curl` Trigger (Workflow)**:
> ```bash
> curl -X POST http://localhost:3001/api/workflow/intelligence \
>      -H "Content-Type: application/json" \
>      -d '{"topic": "Current geopolitical tensions in Europe"}'
> ```

> [!IMPORTANT]
> **Authentication**: Ensure your `GOOGLE_API_KEY` is correctly set in the `.env` file of the `mastra-app` directory. The server will use this for the underlying Gemini 2.0 models.
