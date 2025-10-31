FROM python:3.12-slim AS base

FROM base AS requirements-stage

WORKDIR /tmp

COPY --from=artifacts.endress.com/docker-ghcr-mirror/astral-sh/uv:latest /uv /uvx /bin/

COPY ./pyproject.toml ./uv.lock /tmp/

RUN uv export --no-dev --format requirements-txt -o requirements.txt

FROM base

WORKDIR /

COPY --from=requirements-stage /tmp/requirements.txt /tmp/requirements.txt

RUN pip install --no-cache-dir --upgrade --require-hashes -r /tmp/requirements.txt && \
    rm -rf /tmp/requirements.txt

COPY ./app /app

RUN groupadd -g 1000 python && \
    useradd -r -u 1000 -g python python

USER 1000:1000

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--no-server-header"]
