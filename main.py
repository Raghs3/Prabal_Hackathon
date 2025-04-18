from crewai import Agent, Task, Crew

# from dotenv import load_dotenv
# import os
# 
# load_dotenv()  # loads from .env
# 
# SERPER_API_KEY = os.getenv('SERPER_API_KEY')
# GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
# 
# os.environ['SERPER_API_KEY'] = SERPER_API_KEY
# os.environ['GEMINI_API_KEY'] = GEMINI_API_KEY

from dotenv import load_dotenv
import os

load_dotenv()  # loads from .env

SERPER_API_KEY = os.getenv('SERPER_API_KEY')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

if SERPER_API_KEY is None:
    raise ValueError("SERPER_API_KEY is not set in your .env file.")
if GEMINI_API_KEY is None:
    raise ValueError("GEMINI_API_KEY is not set in your .env file.")

os.environ['SERPER_API_KEY'] = SERPER_API_KEY
os.environ['GEMINI_API_KEY'] = GEMINI_API_KEY

# os.environ['SERPER_API_KEY'] = userdata.get('SERPER_API_KEY')

from crewai_tools import SerperDevTool
serperdev_tool = SerperDevTool(
    country="in"
)

from crewai import LLM
# os.environ['GEMINI_API_KEY'] = userdata.get('GEMINI_API_KEY')
llm = LLM(model="gemini/gemini-1.5-flash")


fetcher = Agent(
    role="Product Detail Fetcher",
    goal="Fetch and compile relevant eco-friendliness details about the product: {product}",
    backstory=(
        "You are an expert in product analysis, trained to fetch details "
        "about materials, brand ethics, certifications, and environmental impact "
        "for the product: {product}. Your job is to collect accurate and detailed information "
        "about {product} for further rating and evaluation. "
        "If you encounter missing or incomplete information, use your web search tool to find up-to-date, reliable information online."
    ),
    tools=[serperdev_tool],
    allow_delegation=False,
    llm=llm,
    verbose=False
)

# 2. Rater Agent with tool
rater = Agent(
    role="Eco-Friendliness Rater",
    goal="Evaluate the eco-friendliness of the product: {product} based on its details.",
    backstory=(
        "You are an expert in sustainability and environmental impact. "
        "You use predefined criteria to assign a rating to the product: {product} based "
        "on its materials, brand ethics, certifications, and other details. "
        "If you notice any details are missing or unclear, use your web search tool to supplement the information. "
        "You also categorize {product} as 'Eco-Friendly', 'Moderately Friendly', or 'Not Eco-Friendly' based on the rating."
    ),
    tools=[serperdev_tool],
    allow_delegation=False,
    llm=llm,
    verbose=False
)

# 3. Reporter Agent with tool (in case of missing alternative suggestions)
reporter = Agent(
    role="Eco-Friendliness Reporter",
    goal="Prepare a user-friendly report about the product: {product}'s eco-friendliness status.",
    backstory=(
        "You are a skilled communicator who presents {product}'s eco-friendliness "
        "evaluation in a clear and understandable format. Your job is to explain "
        "the rating for {product}, provide insights into why it received its status, "
        "and suggest greener alternatives if necessary. If you can't find alternatives in the initial data, use your web search tool to discover eco-friendlier options."
    ),
    tools=[serperdev_tool],
    allow_delegation=False,
    llm=llm,
    verbose=False
)

# Tasks (unchanged, but agents now have error-handling and web search capability)

fetch_task = Task(
    description=(
        "1. Search for product details about {product} using various sources (e.g., databases, APIs, AI agents).\n"
        "2. Collect information on materials, brand ethics, certifications, and environmental impact for {product}.\n"
        "3. If any information is missing or incomplete, use your web search tool to find the relevant details.\n"
        "4. Ensure the details about {product} are accurate and comprehensive."
    ),
    expected_output="A structured set of eco-friendliness details for the product: {product}, "
                    "including materials, brand ethics, certifications, and environmental impact.",
    agent=fetcher,
)

rate_task = Task(
    description=(
        "1. Analyze the details of the product: {product} (e.g., materials, brand ethics, certifications).\n"
        "2. If any relevant information is missing, use your web search tool to find it.\n"
        "3. Assign an eco-friendliness score on a scale of 0-100 for {product}.\n"
        "4. Categorize {product} as 'Eco-Friendly', 'Moderately Friendly', or 'Not Eco-Friendly' "
        "based on the score.\n"
        "5. Provide a brief explanation for the assigned rating for {product}."
    ),
    expected_output="An eco-friendliness score (0-100), a category, and a brief explanation for the rating of {product}.",
    agent=rater,
)

report_task = Task(
    description=(
        "1. Use the product: {product}'s eco-friendliness rating and category to generate a user-friendly report.\n"
        "2. Include an explanation for the rating and category for {product}.\n"
        "3. If you can't find greener alternatives in the provided data, use your web search tool to suggest them.\n"
        "4. Suggest greener alternatives if {product} is not eco-friendly."
    ),
    expected_output="A user-friendly report in markdown format, including the rating, category, "
                    "explanation, and suggestions for greener alternatives for {product}.",
    agent=reporter,
)


crew = Crew(
    agents=[fetcher, rater, reporter],
    tasks=[fetch_task, rate_task, report_task],
    verbose=True
)

product_user = input("Enter product name: ")
result = crew.kickoff(inputs={"product": product_user})  # all false, main true