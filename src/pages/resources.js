import React from "react";
import { StaticQuery, graphql } from "gatsby";
import { uniq, flatten } from "lodash";

import styles from "./page.module.scss";

import SEO from "../components/seo";
import Card from "../components/card/card";
import PageHeader from "../components/pageHeader/pageHeader";

export default () => (
  <StaticQuery
    query={graphql`
      query ResourcesQuery {
        allFile(filter: { absolutePath: { regex: "/resources/" } }) {
          edges {
            node {
              childMarkdownRemark {
                frontmatter {
                  title
                  url
                  author
                  tags
                }
                html
              }
            }
          }
        }
      }
    `}
    render={data => {
      let allTags = [];

      data.allFile.edges.forEach(({ node }) => {
        allTags.push(node.childMarkdownRemark.frontmatter.tags);
      });

      allTags = flatten(allTags);
      allTags = uniq(allTags);

      return (
        <>
          <SEO title="Resources" />
          <PageHeader title="Resources">
            <p>
              Articles about things related to Serverless, JAMstack, and the
              whole ball of yarn.
            </p>

            <nav>
              {allTags.map((tag, i) => {
                return <button>{tag}</button>;
              })}
            </nav>
          </PageHeader>

          <main className={styles.grid}>
            {data.allFile.edges.map(({ node }, i) => {
              const { title, url } = node.childMarkdownRemark.frontmatter;
              return (
                <Card
                  title={title}
                  key={title}
                  html={node.childMarkdownRemark.html}
                  url={url}
                />
              );
            })}
          </main>
        </>
      );
    }}
  />
);