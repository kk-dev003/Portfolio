# KK Backend (FastAPI + ONNX/gRPC)

## FastAPI (local dev)
```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Frontend is proxied to `http://localhost:8000` via Vite. Toggle **Server Mode** on the Live page.

## ONNXRuntime (GPU)
- Install CUDA-compatible `onnxruntime-gpu` instead of `onnxruntime`.
- Then set your session options in `app/main.py` (load your `.onnx` and run inference).

## gRPC (optional)
1) Generate Python stubs:
```bash
python -m grpc_tools.protoc -I proto --python_out=. --grpc_python_out=. proto/inference.proto
```
2) Start server:
```bash
python server_grpc.py
```
3) Connect from other services at `localhost:50051`.

This backend ships working endpoints for: `/api/health`, `/api/sentiment`, `/api/toxicity`, `/api/summarize`, `/api/edge`, `/api/style`.
