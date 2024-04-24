import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import LLMChain, RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.llms import BaseLLM
from dotenv import load_dotenv

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=GOOGLE_API_KEY)


class ReportsAgent(LLMChain):
    """Chain to analyze what information are required to diagno."""

    @classmethod
    def from_llm(cls, llm: BaseLLM = llm, verbose: bool = True) -> LLMChain:
        """Get the response parser."""
        medical_report_agent_prompt = """You are a medical assistant who helps the doctor by recommending the test and reports required to assist the doctor. 
            Following '===' is the conversation history. 
            Use this conversation history to make your decision.
            The conversation is provided to you between first and second '===' to help you accomplish the task above.
            ===
            {conversation_history}
            ===
            The patient complain has been provided to you, keep in mind the conversation_history and the given below patient's complain to finally suggest the required test and reports.
            Patient's complain: {patient_complain}
            
            
            Return the response in the following format:
            
            Test Required: 
            - Test1 
            - Test2
            
            Medical Reports Required:
            - Report1 
            - Report2
            ."""
        prompt = PromptTemplate(
            template=medical_report_agent_prompt,
            input_variables=["conversation_history", "patient_complain"],
        )
        return cls(prompt=prompt, llm=llm, verbose=verbose)


if __name__ == "__main__":
    report_agent = ReportsAgent.from_llm()
    output = report_agent.run(conversation_history='''{
    "How long have you had this swelling?": "less than 4 hours",
    "How much time do you spend standing or walking during the day?": "Yes I feel pain while walking",
    "Do you have any pain or discomfort associated with the swelling?": "no only pale color and swelling"
}''', patient_complain="""I've been feeling extremely fatigued and weak lately. I have a persistent high fever that 
doesn't seem to go away, accompanied by chills and body aches. My throat is sore, and I've been experiencing 
headaches and muscle pain. I've also noticed a loss of appetite and have been feeling nauseous""")
    print(output)
