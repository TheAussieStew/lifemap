appid = "PVT3LL-Y9U53UVKU4"
import requests
import xmltodict
import json
import openai
import re
from urllib.parse import quote_plus


openai.api_key = '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'


simple_api_url = 'http://api.wolframalpha.com/v1/simple'
query_api_url = 'http://api.wolframalpha.com/v2/query'
conversation_api_url = 'http://api.wolframalpha.com/v1/conversation.jsp'

while True:
    query = input("query:")
    tex = input('tex: ')

    user_query = query
    tex = tex
    
    
    prompt = f"Based on the user query: {user_query} and this math they wrote {tex}, write a wolfram alpha query to do what the user asked and show steps. format the query in quotes"
    print(prompt)
    openai_response = openai.Completion.create(engine="text-davinci-003", prompt=prompt, max_tokens=50)
    explanation = openai_response.choices[0].text.strip()
    print(explanation)
    extracted_text = quote_plus(explanation)
    # pattern = r"``(.*?)``"

    # match = re.search(pattern, explanation)

    # if match:
    #     extracted_text = match.group(1)
    #     # print(f"The query is: {extracted_text}")
    
    # else:
    #     print('rip')
    
    
    
    wolfram_response = requests.get(f"http://api.wolframalpha.com/v2/query?appid={appid}&input={extracted_text}&podstate=Step-by-step%20solution&output=json")


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
    for pod in pods:
        for subpod in pod['subpods']:
            steps.append(subpod['plaintext'])
            
    

    # Go through all the pods and gather relevant information
    # for pod in pods:
    #     print(pod)
    #     if 'subpod' in pod:
    #         # The subpod may be a list if there are multiple steps
    #         # if isinstance(pod['subpod'], list):
    #         #     result[pod['@title']] = [subpod['minput'] for subpod in pod['subpod']]
    #         if 'minput' in pod['subpod']: result[pod['@title']] = pod['subpod']['alt']
    #         else: result[pod['@title']] = ""
    #     else:
    #         if 'minput' in pod: result[pod['@title']] = pod['minput']
    #         else: result[pod['@title']] = ""
    # Return the result as JSON

    # Ask OpenAI to format and explain the result
    prompt = f"Explain this question: {query} to the user step by step with the following information {steps}. STEP BY STEP is key. Never put math and text on the same line, alternate. Format the response so all latex math equations start with  $ and end with $. Don't make up stuff"
    print(prompt)
    openai_response = openai.Completion.create(engine="text-davinci-003", prompt=prompt, max_tokens=300)

    # print(openai_response)    
    
    # Extracting the answer from OpenAI's response
    explanation = openai_response.choices[0].text.strip()

    # Return the result and its explanation as JSON
    print("------")
    print(explanation)