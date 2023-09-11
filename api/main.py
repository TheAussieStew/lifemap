from fastapi import FastAPI, Response, Query
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
import openai
from sympy.parsing.latex import parse_latex
from sympy.printing import srepr
import re
from urllib.parse import quote_plus

from pydantic import BaseModel

openai.api_key = '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'

app = FastAPI()


class SolvePayload(BaseModel):
    query:str
    
class StepsPayload(BaseModel):
    stepsString: str
    tex: str
    method: str
    
class CEPayload(BaseModel):
    tex: str

class WolframQueryPayload(BaseModel):
    userQuery:str
    tex:str

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"Online"}

@app.post("/solve")
async def solve(payload: SolvePayload, response: Response):
    query = payload.query
    
    # Add Allow header
    response.headers["Allow"] = "POST, OPTIONS"

    # Specify your appid (API key)
    appid = "PVT3LL-Y9U53UVKU4"

    
    wolfram_response = requests.get(f"http://api.wolframalpha.com/v2/query?appid={appid}&input={query}&podstate=Step-by-step%20solution&output=json")


    # Get the response content as a string
    content = wolfram_response.content.decode('utf-8')
    dict_content = json.loads(content)

    
    print(dict_content)

    # Get all pods
    pods = dict_content['queryresult']['pods']
    
    with open('test.json', 'w') as f:
        f.write(json.dumps(dict_content, indent=6))
    # print(pods)

    # Prepare a dictionary to hold the results
    steps = []
    result = ""
    liststep = []
    for pod in pods:
        for subpod in pod['subpods']:
            steps.append(subpod['plaintext'])
            if subpod['title'] == "Possible intermediate steps":
                liststep.append(subpod['plaintext'])
        
        if pod['id'] == "Result":
            for subpod in pod['subpods']:
                if subpod['title'] == "":
                    result = subpod['plaintext']
            
            
            

    # Ask OpenAI to format and explain the result
    # prompt = f"Explain this question: {query} to the user step by step with the following information {steps}. STEP BY STEP is key. Never put math and text on the same line, alternate. Format the response so all latex math equations start with  $ and end with $. Don't make up stuff."
    # print(prompt)
    # openai_response = openai.Completion.create(engine="text-davinci-003", prompt=prompt, max_tokens=300)

    # # print(openai_response)    
    
    # # Extracting the answer from OpenAI's response
    # explanation = openai_response.choices[0].text.strip()

    # Return the result and its explanation as JSON
    
    print(liststep)
    return {
        "pods": pods,
        "explanation": liststep[0],
        'result': result
    }
    
@app.post("/solveMathSteps")
async def solveMathSteps(payload: StepsPayload, response: Response):
    steps = payload.stepsString
    tex = payload.tex
    method = payload.method
    response.headers["Allow"] = "POST, OPTIONS"

    # Ask OpenAI to format and explain the result
    prompt = f"Explain this question: {method} {tex} with steps: {steps}. Never put math and text on the same line, alternate. Format the response so all latex math equations start with  $ and end with $. Use latex for every math equation. The rest of the text should be presentable and good looking, with no all caps and clear but very brief explanations on how the math works."
    print(prompt)
    openai_response = openai.Completion.create(engine="text-davinci-003", prompt=prompt, max_tokens=300)

    print(openai_response)    
    
    # Extracting the answer from OpenAI's response
    explanation = openai_response.choices[0].text.strip()

    # Return the result and its explanation as JSON
    return {
        "explanation": explanation
    }

@app.post("/createWolframQuery")
async def createWolframQuery(payload: WolframQueryPayload, response: Response):
    user_query = payload.userQuery
    tex = payload.tex
    
    response.headers["Allow"] = "POST, OPTIONS"
    
    
    prompt = f"Based on the user query: {user_query} and this math they wrote {tex}, write a wolfram alpha query to do what the user asked and show steps. format the query in quotes"
    print(prompt)
    openai_response = openai.Completion.create(engine="text-davinci-003", prompt=prompt, max_tokens=50)
    explanation = openai_response.choices[0].text.strip()
    print(explanation)
    extracted_text = quote_plus(explanation)
    
    return{
        'query':extracted_text
    }

    

@app.post("/check_expr/")
async def latex_to_tree(ce:CEPayload, response:Response):
    
    mathsteps = ['Pow', 'Mul', 'Add', 'Symbol', 'Integer', 'Float', 'precision']
    
    tex = ce.tex
    
    # Add Allow header
    response.headers["Allow"] = "POST, OPTIONS"
    
    try:

        # Parse the LaTeX expression into a SymPy object
        parsed_equation = parse_latex(tex)

        # Generate the expression tree
        text = srepr(parsed_equation)
        print(text)
        words = re.findall(r'\b[a-zA-Z]{2,}\b', text)
        
        print(words)
        print(mathsteps)
        
        for word in words:
            if word not in mathsteps:
                print('word not in mathsteps')
                return {"use_wolfram": True}
        
        
        return {"use_wolfram": False}

    except Exception as e:
        return {"error": str(e)}