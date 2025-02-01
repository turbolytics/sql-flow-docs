# FAQ

## What is SQLFlow?

SQLFlow is a python-based stream processor. It embeds DuckDB using the python DuckDB library. All stream processing is performed using DuckDB. SQLFlow supports a number of "sources" for ingesting data, and "sinks" for writing data.

## How is SQLFlow different than Flink?

SQLFlow is based on python. It is deployed as a single process. Horizontal scaling can be achieved through the use of Kafka consumer groups. SQLFlow has considerably less features than Flink, especially around windowing and aggregations. SQLFlow leverages optimized C library bindings for Arrow, DuckDB and Dafka to achieve high performance processing. Think of SQLFlow as the DuckDB of stream processing. It enables companies to handle stream processing at scale in a lightweight package that is easy to operate, configure and understand, and is cost effective.

## Why would I run SQLFlow?

SQLFlow is a good fit if your data throughput < 30k messages per second. It is a good fit for simple stream enrichment, tumbling window aggregations, enhancing streaming data using custom functions (through UDFs). SQLFlow as a great way to create lightweight stream processing for high throughput data streams.

## Why is SQLFlow written in Python?

The python ecosystem is rich with libraries for data processing. SQLFlow leverages the Arrow and DuckDB libraries for high performance stream processing. Python is a great language for building stream processing applications. It is easy to understand, and has a rich ecosystem of libraries for data processing.

The DuckDB python library is their most mature client library. Python also has an iceberg implementation that supports writing. Python is an accessible foundation for building a stream processing framework. Python is a wrapper around the high performance kafka library (librdkafka), DuckDB, and Arrow.
 