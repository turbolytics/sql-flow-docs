import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/easytolearn.svg').default,
    description: (
      <>
        SQLFlow models stream-processing as SQL queries using the <a href={"https://duckdb.org/docs/sql/introduction.html"}>DuckDB SQL dialect</a>.
        Express your entire stream processing pipeline—ingestion, transformation, and enrichment—as a single SQL statement and configuration file.
      </>
    ),
  },
  {
    title: 'High Performance',
    Svg: require('@site/static/img/turbolytics-logo.svg').default,
    description: (
      <>
        Process 10's of thousands of events per second on a single machine with low memory overhead, using Python, DuckDB, Arrow and Confluent Python Client.
      </>
    ),
  },
  {
    title: 'Powered by DuckDB',
    Svg: require('@site/static/img/duckdb.svg').default,
    description: (
      <>
        Tap into the DuckDB ecosystem of tools and libraries to build your stream processing applications. SQLFlow support
          parquet, csv, json and iceberg. Read data from Kafka.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
