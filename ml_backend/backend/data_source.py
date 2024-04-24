import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from dotenv import load_dotenv

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


class RAGAgent:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=GOOGLE_API_KEY)
        self.embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key = GOOGLE_API_KEY)
        self.db_path = "knowledge_source/vector_db"
        try:
            self.vector_db = FAISS.load_local(self.db_path, self.embeddings, allow_dangerous_deserialization=True)
        except Exception as e:
            print("Initialize the database first")

    def preprocess(self, pdf_file):
        loader = PyPDFLoader(pdf_file)
        pages = loader.load()
        text_splitters = CharacterTextSplitter(
            chunk_size=2000,
            chunk_overlap=200
        )
        docs = text_splitters.split_documents(pages)
        print(docs[0].page_content)

        self.vector_db = FAISS.from_documents(
            docs,
            self.embeddings,
        )
        self.vector_db.save_local(self.db_path)
        return "Database initialized successfully"

    def query_datasource(self, query):
        retrieved_docs = self.vector_db.similarity_search(query)
        # query_embeddings = self.embeddings.embed_query(query)
        # retrieved_docs = self.vector_db.similarity_search(query, top_k=3)
        chunk_string = "\n------------\n".join([doc.page_content for doc in retrieved_docs])
        return chunk_string


if __name__ == "__main__":
    agent = RAGAgent()
    message = agent.preprocess("backend/data_source/data_source.pdf")
    response = agent.query_datasource("I am having continous vomit and wish to eat sour things")
    print(response)

