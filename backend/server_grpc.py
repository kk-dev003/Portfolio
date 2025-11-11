import io
from concurrent import futures
import grpc, proto.inference_pb2 as pb, proto.inference_pb2_grpc as rpc
from PIL import Image

AFINN = {"good":2,"great":3,"awesome":3,"love":3,"fast":2,"happy":2,"delight":2,"wow":2,
         "bad":-2,"slow":-2,"hate":-3,"bug":-2,"broken":-2,"terrible":-3,"sad":-2,"angry":-2}

def score_sentiment(t): return sum(AFINN.get(w,0) for w in "".join(c if c.isalpha() else " " for c in t.lower()).split())

class InferenceServicer(rpc.InferenceServicer):
    def AnalyzeSentiment(self, request, context):
        return pb.SentimentReply(score=score_sentiment(request.text))
    def ClassifyImage(self, request, context):
        # placeholder classifier
        _ = Image.open(io.BytesIO(request.image))
        return pb.ClassReply(label="demo", confidence=0.99)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=4))
    rpc.add_InferenceServicer_to_server(InferenceServicer(), server)
    server.add_insecure_port("[::]:50051")
    server.start()
    server.wait_for_termination()

if __name__ == "__main__":
    serve()
