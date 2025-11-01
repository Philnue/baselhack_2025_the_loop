from langchain_openai import AzureChatOpenAI

from app.settings import settings


llm = AzureChatOpenAI(
    azure_endpoint=settings.azure_openai_endpoint,
    api_key=settings.azure_openai_api_key,
    api_version=settings.azure_openai_api_version,
    model=settings.azure_openai_model,
)
