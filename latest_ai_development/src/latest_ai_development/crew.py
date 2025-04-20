from crewai import Agent, Crew, Process, Task  # type: ignore
from crewai.project import CrewBase, agent, crew, task  # type: ignore
from crewai_tools import SerperDevTool, FileReadTool  # type: ignore
# If you want to run a snippet of code before or after the crew starts,
# you can use the @before_kickoff and @after_kickoff decorators
# https://docs.crewai.com/concepts/crews#example-crew-class-with-decorators

@CrewBase
class LatestAiDevelopment():
    """LatestAiDevelopment crew"""

    # Learn more about YAML configuration files here:
    # Agents: https://docs.crewai.com/concepts/agents#yaml-configuration-recommended
    # Tasks: https://docs.crewai.com/concepts/tasks#yaml-configuration-recommended
    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    # If you would like to add tools to your agents, you can learn more about it here:
    # https://docs.crewai.com/concepts/agents#agent-tools
    @agent
    def fetcher(self) -> Agent:
        return Agent(
            config=self.agents_config['fetcher'],  # type: ignore
            verbose=True,
            tools=[SerperDevTool(), FileReadTool(filepath=r'C:\Users\Raghav\Desktop\Coding\crewai-101\latest_ai_development\products.json')]
        )

    @agent
    def rater(self) -> Agent:
        return Agent(
            config=self.agents_config['rater'],  # type: ignore
            allow_delegation=True,
            verbose=True,
            tools=[FileReadTool(filepath=r'C:\Users\Raghav\Desktop\Coding\crewai-101\latest_ai_development\products.json')]
        )
    
    @agent
    def reporter(self) -> Agent:
        return Agent(
            config=self.agents_config['reporter'],  # type: ignore
            verbose=True
        )

    @agent
    def summarizer(self) -> Agent:
        return Agent(
            config=self.agents_config['summarizer'],   # type: ignore
            verbose=True,
            tools=[SerperDevTool(), FileReadTool(filepath=r'C:\Users\Raghav\Desktop\Coding\crewai-101\latest_ai_development\report.md')]
        )

    # To learn more about structured task outputs,
    # task dependencies, and task callbacks, check out the documentation:
    # https://docs.crewai.com/concepts/tasks#overview-of-a-task
    @task
    def fetch_task(self) -> Task:
        return Task(
            config=self.tasks_config['fetch_task'],  # type: ignore
            output_file='final_list.json',
        )

    @task
    def rate_task(self) -> Task:
        return Task(
            config=self.tasks_config['rate_task'],   # type: ignore
            output_file='final_list.json',
        )
    
    @task
    def report_task(self) -> Task:
        return Task(
            config=self.tasks_config['report_task'],   # type: ignore
            output_file='final_list.json', 
        )
    
    @task
    def summary_task(self) -> Task:
        return Task(
            config=self.tasks_config['summary_task'],   # type: ignore
            output_file='summary.md'
        )
    
    @crew
    def crew(self) -> Crew:
        """Creates the LatestAiDevelopment crew"""
        # To learn how to add knowledge sources to your crew, check out the documentation:
        # https://docs.crewai.com/concepts/knowledge#what-is-knowledge

        return Crew(
            agents=self.agents, # Automatically created by the @agent decorator # type: ignore
            tasks=self.tasks, # Automatically created by the @task decorator  # type: ignore
            process=Process.sequential,
            verbose=True,
            # process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
        )
