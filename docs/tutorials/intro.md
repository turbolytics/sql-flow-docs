---
sidebar_position: 1
---

# Quickstart 

Create a stream processor that reads data from Kafka **in less than 5 minutes**.

## Getting Started

Get started by **running a stream processor that executes SQL against a kafka stream and writes the output to the console**.

### What you'll need

- Docker
- A copy of turbolytics/sql-flow cloned on your local machine (https://github.com/turbolytics/sql-flow)
- turbolytics/sql-flow Python dependencies installed
```
cd path/to/turbolytics/sql-flow/github/repo && pip install -r requirements.txt
```
- The turbolytics/sql-flow docker image
```
docker pull turbolytics/sql-flow:latest
```
- Kafka running on your local machine
```
cd path/to/turbolytics/sql-flow/github/repo && docker-compose -f dev/kafka-single.yml up -d
```

## Test the SQLFlow configuration file

SQLFlow ships with cli support to test a stream configuration against any fixture file of test data. The goal is to support testing and linting of a configuration file before executing in a stream environment.

Run the invoke command to test the configuration file against a set of test data:
```
docker run -v $(pwd)/dev:/tmp/conf -v /tmp/sqlflow:/tmp/sqlflow turbolytics/sql-flow:latest dev invoke /tmp/conf/config/examples/basic.agg.yml /tmp/conf/fixtures/simple.json
```

The following output should show:
```
[{'city': 'New York', 'city_count': 28672}, {'city': 'Baltimore', 'city_count': 28672}]
```

## Run SQLFlow against a Kafka stream

This section runs SQLFlow as a stream processor that reads data from a Kafka topic and writes the output to the console. SQLFow runs as a daemon and will continuously read data from kafka, execute the SQL and write the output to the console.

- Publish test messages to the Kafka topic
```
python3 cmd/publish-test-data.py --num-messages=10000 --topic="input-simple-agg-mem"
```
- Start the Kafka Console Consumer, to view the SQLFlow output
```
docker exec -it kafka1 kafka-console-consumer --bootstrap-server=kafka1:9092 --topic=output-simple-agg-mem
```
- Start SQLFlow
```
docker run -v $(pwd)/dev:/tmp/conf -v /tmp/sqlflow:/tmp/sqlflow -e SQLFLOW_KAFKA_BROKERS=host.docker.internal:29092 turbolytics/sql-flow:latest run /tmp/conf/config/examples/basic.agg.mem.yml --max-msgs-to-process=10000
```

The following output should begin to show in the kafka console consumer:

```
...
...
{"city":"San Francisco504","city_count":1}
{"city":"San Francisco735","city_count":1}
{"city":"San Francisco533","city_count":1}
{"city":"San Francisco556","city_count":1}
...
```
